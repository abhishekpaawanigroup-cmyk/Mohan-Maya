/**
 * Client-side auth engine (localStorage-backed).
 *
 * ⚠️ This is a front-end SIMULATION, not real security. It exists so the full
 * auth UX (sign up / in / out, forgot + reset password, email verification,
 * remember-me, session persistence, rate limiting, edge cases) works without a
 * backend. Every function is async and throws typed `AuthError`s, so this module
 * can be swapped for a real HTTP client later with no UI changes.
 *
 * Real-security caveats (impossible client-side): passwords use Web Crypto
 * SHA-256+salt (not server bcrypt), the session lives in localStorage (not an
 * httpOnly cookie), and reset/verification "emails" are simulated by returning
 * the link to the caller (also logged to the console).
 */

const USERS_KEY = "mm-auth-users";
const SESSION_KEY = "mm-auth-session";
const THROTTLE_KEY = "mm-auth-throttle";

// Toggle to require a verified email before login is allowed.
export const REQUIRE_VERIFICATION = false;

const SESSION_TTL_REMEMBER = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_TTL_DEFAULT = 1000 * 60 * 60 * 12; // 12 hours
const RESET_TTL = 1000 * 60 * 60; // 1 hour
const MAX_ATTEMPTS = 5;
const LOCK_MS = 1000 * 60; // 60s lockout

export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

/* ── storage helpers ───────────────────────────────────── */
const read = (store, key, fallback) => {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (store, key, value) => {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode - ignore */
  }
};

const getUsers = () => read(localStorage, USERS_KEY, []);
const setUsers = (users) => write(localStorage, USERS_KEY, users);

/* ── crypto helpers ────────────────────────────────────── */
const toHex = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const randomToken = (bytes = 24) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
};

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

// Simulate network latency so loading states are real and visible.
const delay = (ms = 650) => new Promise((r) => setTimeout(r, ms));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normEmail = (email) => String(email || "").trim().toLowerCase();

// Strip secrets before anything reaches the UI / session.
const publicUser = (u) =>
  u && {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    verified: Boolean(u.verified),
    createdAt: u.createdAt,
  };

const findByEmail = (email) => getUsers().find((u) => u.email === normEmail(email));

/* ── session ───────────────────────────────────────────── */
function persistSession(userId, remember) {
  const session = {
    userId,
    token: randomToken(16),
    expires: Date.now() + (remember ? SESSION_TTL_REMEMBER : SESSION_TTL_DEFAULT),
    remember: Boolean(remember),
  };
  // remember → localStorage (survives restart); otherwise sessionStorage.
  clearSession();
  write(remember ? localStorage : sessionStorage, SESSION_KEY, session);
  return session;
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function readSession() {
  const session =
    read(sessionStorage, SESSION_KEY, null) || read(localStorage, SESSION_KEY, null);
  if (!session) return null;
  if (Date.now() > session.expires) {
    clearSession();
    return null;
  }
  return session;
}

/** Current signed-in user (re-derived from the store so profile edits show). */
export function getSessionUser() {
  const session = readSession();
  if (!session) return null;
  const user = getUsers().find((u) => u.id === session.userId);
  return user ? publicUser(user) : null;
}

/* ── rate limiting ─────────────────────────────────────── */
function checkThrottle(email) {
  const map = read(localStorage, THROTTLE_KEY, {});
  const rec = map[normEmail(email)];
  if (rec?.lockUntil && Date.now() < rec.lockUntil) {
    const secs = Math.ceil((rec.lockUntil - Date.now()) / 1000);
    throw new AuthError("RATE_LIMITED", `Too many attempts. Try again in ${secs}s.`);
  }
}
function recordFail(email) {
  const map = read(localStorage, THROTTLE_KEY, {});
  const key = normEmail(email);
  const rec = map[key] || { count: 0, lockUntil: 0 };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockUntil = Date.now() + LOCK_MS;
    rec.count = 0;
  }
  map[key] = rec;
  write(localStorage, THROTTLE_KEY, map);
}
function clearThrottle(email) {
  const map = read(localStorage, THROTTLE_KEY, {});
  delete map[normEmail(email)];
  write(localStorage, THROTTLE_KEY, map);
}

/* ── simulated email ───────────────────────────────────── */
function simulateEmail(kind, link) {
  // In a real app this would hit an email provider. Here we surface the link.
  // eslint-disable-next-line no-console
  console.info(`[Mohan Maya · simulated ${kind} email] ${link}`);
  return link;
}

/* ── public API ────────────────────────────────────────── */
export async function signup({ name, email, phone = "", password }) {
  await delay();
  const errors = {};
  if (!name?.trim()) errors.name = "Name is required";
  if (!email?.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(normEmail(email))) errors.email = "Enter a valid email";
  if (phone && !/^[+\d][\d\s-]{6,}$/.test(phone.trim())) errors.phone = "Enter a valid mobile number";
  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Use at least 6 characters";
  if (Object.keys(errors).length) {
    const e = new AuthError("VALIDATION", "Please fix the highlighted fields.");
    e.fields = errors;
    throw e;
  }
  if (findByEmail(email)) {
    const e = new AuthError("EMAIL_TAKEN", "An account with this email already exists.");
    e.fields = { email: "This email is already registered" };
    throw e;
  }

  const salt = randomToken(8);
  const hash = await hashPassword(password, salt);
  const verifyToken = randomToken();
  const user = {
    id: randomToken(8),
    name: name.trim(),
    email: normEmail(email),
    phone: phone.trim(),
    salt,
    hash,
    verified: !REQUIRE_VERIFICATION,
    verifyToken,
    createdAt: Date.now(),
  };
  setUsers([...getUsers(), user]);

  const verifyLink = `${window.location.origin}/verify-email?token=${verifyToken}`;
  simulateEmail("verification", verifyLink);

  // Auto sign-in after signup (session-only unless they tick remember later).
  persistSession(user.id, false);
  return { user: publicUser(user), verifyLink };
}

export async function login({ email, password, remember }) {
  await delay();
  checkThrottle(email);

  const user = findByEmail(email);
  if (!user) {
    recordFail(email);
    throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password.");
  }
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) {
    recordFail(email);
    throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password.");
  }
  if (REQUIRE_VERIFICATION && !user.verified) {
    throw new AuthError("NOT_VERIFIED", "Please verify your email before signing in.");
  }

  clearThrottle(email);
  persistSession(user.id, remember);
  return { user: publicUser(user) };
}

export function logout() {
  clearSession();
}

export async function forgotPassword({ email }) {
  await delay();
  if (!email?.trim() || !EMAIL_RE.test(normEmail(email))) {
    const e = new AuthError("VALIDATION", "Enter a valid email.");
    e.fields = { email: "Enter a valid email" };
    throw e;
  }
  const users = getUsers();
  const user = users.find((u) => u.email === normEmail(email));
  // Never reveal whether an account exists (anti-enumeration).
  if (!user) return { resetLink: null };

  user.resetToken = randomToken();
  user.resetExpires = Date.now() + RESET_TTL;
  setUsers(users);

  const resetLink = `${window.location.origin}/reset-password?token=${user.resetToken}`;
  simulateEmail("password reset", resetLink);
  return { resetLink };
}

export async function resetPassword({ token, password }) {
  await delay();
  if (!password || password.length < 6) {
    const e = new AuthError("WEAK_PASSWORD", "Use at least 6 characters.");
    e.fields = { password: "Use at least 6 characters" };
    throw e;
  }
  const users = getUsers();
  const user = users.find((u) => u.resetToken && u.resetToken === token);
  if (!user) throw new AuthError("INVALID_TOKEN", "This reset link is invalid.");
  if (Date.now() > (user.resetExpires || 0)) {
    delete user.resetToken;
    delete user.resetExpires;
    setUsers(users);
    throw new AuthError("EXPIRED_TOKEN", "This reset link has expired. Please request a new one.");
  }

  user.salt = randomToken(8);
  user.hash = await hashPassword(password, user.salt);
  delete user.resetToken;
  delete user.resetExpires;
  setUsers(users);
  clearThrottle(user.email);
  return { email: user.email };
}

export async function verifyEmail({ token }) {
  await delay();
  const users = getUsers();
  const user = users.find((u) => u.verifyToken && u.verifyToken === token);
  if (!user) throw new AuthError("INVALID_TOKEN", "This verification link is invalid or already used.");
  user.verified = true;
  delete user.verifyToken;
  setUsers(users);
  return { user: publicUser(user) };
}

export async function resendVerification({ email }) {
  await delay();
  const users = getUsers();
  const user = users.find((u) => u.email === normEmail(email));
  if (!user || user.verified) return { verifyLink: null };
  user.verifyToken = randomToken();
  setUsers(users);
  const verifyLink = `${window.location.origin}/verify-email?token=${user.verifyToken}`;
  simulateEmail("verification", verifyLink);
  return { verifyLink };
}

/** Update the signed-in user's profile fields. */
export async function updateProfile(patch) {
  await delay(300);
  const session = readSession();
  if (!session) throw new AuthError("UNAUTHENTICATED", "You're not signed in.");
  const users = getUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) throw new AuthError("UNAUTHENTICATED", "You're not signed in.");
  if (patch.email && patch.email !== user.email) {
    if (!EMAIL_RE.test(normEmail(patch.email))) {
      const e = new AuthError("VALIDATION", "Enter a valid email.");
      e.fields = { email: "Enter a valid email" };
      throw e;
    }
    if (findByEmail(patch.email)) {
      const e = new AuthError("EMAIL_TAKEN", "That email is already in use.");
      e.fields = { email: "That email is already in use" };
      throw e;
    }
  }
  Object.assign(user, {
    name: patch.name?.trim() ?? user.name,
    email: patch.email ? normEmail(patch.email) : user.email,
    phone: patch.phone ?? user.phone,
  });
  setUsers(users);
  return { user: publicUser(user) };
}

/** Change password for the signed-in user (verifies current password). */
export async function changePassword({ current, next }) {
  await delay();
  const session = readSession();
  if (!session) throw new AuthError("UNAUTHENTICATED", "You're not signed in.");
  const users = getUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) throw new AuthError("UNAUTHENTICATED", "You're not signed in.");

  const currentHash = await hashPassword(current, user.salt);
  if (currentHash !== user.hash) {
    const e = new AuthError("INVALID_CREDENTIALS", "Your current password is incorrect.");
    e.fields = { current: "Incorrect password" };
    throw e;
  }
  if (!next || next.length < 6) {
    const e = new AuthError("WEAK_PASSWORD", "Use at least 6 characters.");
    e.fields = { next: "Use at least 6 characters" };
    throw e;
  }
  user.salt = randomToken(8);
  user.hash = await hashPassword(next, user.salt);
  setUsers(users);
  return { ok: true };
}
