import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const socials = [
  { Icon: FaGoogle, label: "Google" },
  { Icon: FaGithub, label: "GitHub" },
  { Icon: FaApple, label: "Apple" },
];

export default function Auth() {
  usePageMeta(
    "Sign In · Create Account - Mohan Maya",
    "Log in or create your Mohan Maya account to track orders, save your wishlist, and check out faster."
  );

  const { login, register, user, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  const initialTab = params.get("mode") === "register" ? "register" : "login";
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const isRegister = tab === "register";
  const redirectTo = location.state?.from || "/";

  // Already signed in → no reason to be here.
  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  // Keep the URL (?mode=) in sync so the tab is shareable / reload-safe.
  const switchTab = (next) => {
    setTab(next);
    setErrors({});
    const p = new URLSearchParams(params);
    p.set("mode", next);
    setParams(p, { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (registering) => {
    const e = {};
    if (registering && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Use at least 6 characters";
    return e;
  };

  // `mode` defaults to the active tab; passing it explicitly lets each panel in
  // the sliding layout submit unambiguously (both forms are mounted at once).
  const handleSubmit = (e, mode = tab) => {
    e.preventDefault();
    if (loading) return;
    const registering = mode === "register";
    const next = validate(registering);
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setLoading(true);
    // Mock async auth - gives a realistic loading state.
    setTimeout(() => {
      if (registering) register({ name: form.name.trim(), email: form.email.trim() });
      else login({ email: form.email.trim() });
      setLoading(false);
      navigate(redirectTo, { replace: true });
    }, 900);
  };

  const fieldCls = (name) =>
    `w-full bg-gray-50 dark:bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none transition-all duration-200 focus:ring-4 focus:ring-[#fe4462]/15 focus:border-[#fe4462] focus:bg-white dark:focus:bg-white/[0.07] focus-visible:!outline-none ${
      errors[name] ? "border-red-400 focus:ring-red-400/15" : "border-gray-200 dark:border-white/10"
    }`;

  /* ── A single auth form (used for both Sign In and Sign Up panels) ── */
  const Panel = (mode) => {
    const registering = mode === "register";
    return (
      <div className="flex h-full flex-col items-center justify-center px-7 sm:px-10 py-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {registering ? "Create Account" : "Sign In"}
        </h2>

        {/* Social logins (placeholders for future integration) */}
        <div className="mt-5 flex items-center gap-3">
          {socials.map(({ Icon, label }) => (
            <motion.button
              key={label}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => addToast(`${label} sign-in coming soon`, "info")}
              aria-label={`Continue with ${label}`}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 dark:border-white/15 text-gray-500 dark:text-gray-300 transition hover:border-[#fe4462] hover:text-[#fe4462] hover:bg-[#fe4462]/5"
            >
              <Icon size={17} />
            </motion.button>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400">
          {registering ? "or use your email for registration" : "or use your account"}
        </p>

        <form onSubmit={(e) => handleSubmit(e, mode)} noValidate className="mt-4 w-full space-y-3 text-left">
          {registering && (
            <div>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  autoComplete="name"
                  aria-label="Full name"
                  aria-invalid={Boolean(errors.name)}
                  className={fieldCls("name")}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
          )}

          <div>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                autoComplete="email"
                aria-label="Email address"
                aria-invalid={Boolean(errors.email)}
                className={fieldCls("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete={registering ? "new-password" : "current-password"}
                aria-label="Password"
                aria-invalid={Boolean(errors.password)}
                className={`${fieldCls("password")} !pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition hover:text-[#fe4462]"
              >
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Remember me + forgot password (login only) */}
          {!registering && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer select-none items-center gap-2 text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#fe4462]"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => addToast("Password reset link sent (demo)", "info")}
                className="font-medium text-[#fe4462] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <motion.button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              whileHover={{ scale: loading ? 1 : 1.04 }}
              whileTap={{ scale: loading ? 1 : 0.96 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fe4462] to-[#d93550] px-10 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_12px_28px_-10px_rgba(254,68,98,0.7)] transition-shadow duration-200 hover:shadow-[0_16px_34px_-10px_rgba(254,68,98,0.85)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {registering ? "Creating…" : "Signing in…"}
                </>
              ) : registering ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    );
  };

  /* Ghost CTA inside the sliding overlay panel. */
  const overlayBtn =
    "mt-6 inline-flex items-center justify-center rounded-full border-2 border-white px-10 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#fe4462] active:scale-95";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfefb] px-4 pt-24 pb-12 dark:from-[#1a0a0e] dark:via-[#0d0508] dark:to-[#160c11]">
      

      <Link
        to="/"
        className="absolute top-24 left-4 z-50 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#fe4462] dark:text-gray-400 sm:left-8"
      >
        <FiArrowLeft /> Back to home
      </Link>

      {/* ── Desktop: sliding split-panel card (md and up) ── */}
      <div className="relative hidden min-h-[650px] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10 md:block">
        {/* Sign In form */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
            isRegister ? "z-10 translate-x-full opacity-0 pointer-events-none" : "z-20 opacity-100"
          }`}
        >
          {Panel("login")}
        </div>

        {/* Sign Up form */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
            isRegister ? "z-20 translate-x-full opacity-100" : "z-10 opacity-0 pointer-events-none"
          }`}
        >
          {Panel("register")}
        </div>

        {/* Sliding overlay */}
        <div
          className={`absolute top-0 left-1/2 z-50 h-full w-1/2 overflow-hidden transition-transform duration-700 ease-in-out ${
            isRegister ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`relative -left-full h-full w-[200%] bg-gradient-to-br from-[#fe4462] to-[#d93550] text-white transition-transform duration-700 ease-in-out ${
              isRegister ? "translate-x-1/2" : ""
            }`}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="relative flex h-full">
              {/* Overlay-left → shown when registering (prompt to sign in) */}
              <div className="flex h-full w-1/2 flex-col items-center justify-center px-10 text-center">
                <h2 className="text-3xl font-bold">Welcome Back!</h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
                  To keep connected with us please login with your personal info
                </p>
                <button type="button" onClick={() => switchTab("login")} className={overlayBtn}>
                  Sign In
                </button>
              </div>

              {/* Overlay-right → shown when logging in (prompt to register) */}
              <div className="flex h-full w-1/2 flex-col items-center justify-center px-10 text-center">
                <h2 className="text-3xl font-bold">Hello, Friend!</h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
                  Enter your details and start your journey with us
                </p>
                <button type="button" onClick={() => switchTab("register")} className={overlayBtn}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: single card with animated form swap + toggle (below md) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10 md:hidden"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fe4462] to-[#c48212]" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {Panel(tab)}
          </motion.div>
        </AnimatePresence>

        <p className="px-7 pb-8 -mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {isRegister ? "Already have an account?" : "New to Mohan Maya?"}{" "}
          <button
            type="button"
            onClick={() => switchTab(isRegister ? "login" : "register")}
            className="font-semibold text-[#fe4462] hover:underline"
          >
            {isRegister ? "Sign In" : "Create one"}
          </button>
        </p>
      </motion.div>
    </section>
  );
}
