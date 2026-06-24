import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const benefits = [
  "Track orders & manage your wishlist",
  "Faster, secure checkout every time",
  "Early access to new drops & offers",
  "Personalised character recommendations",
];

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

  const validate = () => {
    const e = {};
    if (isRegister && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Use at least 6 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setLoading(true);
    // Mock async auth - gives a realistic loading state.
    setTimeout(() => {
      if (isRegister) register({ name: form.name.trim(), email: form.email.trim() });
      else login({ email: form.email.trim() });
      setLoading(false);
      navigate(redirectTo, { replace: true });
    }, 900);
  };

  const fieldCls = (name) =>
    `w-full bg-gray-50 dark:bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#fe4462]/30 focus:border-[#fe4462] focus-visible:!outline-none ${
      errors[name] ? "border-red-400 focus:ring-red-400/20" : "border-gray-200 dark:border-white/10"
    }`;

  return (
    <section className="min-h-screen md:min-h-[900px] max-w-7xl m-auto pt-20 grid grid-cols-1 lg:grid-cols-2 bg-[#f4edee] dark:bg-[#0d0508]">
      {/* ── Left: brand / value panel ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1b1016] to-[#0d0508] text-white flex items-center">
        {/* Subtle theme graphics */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#fe4462]/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#c48212]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

        <div className="relative z-10 w-full max-w-lg mx-auto px-8 sm:px-12 py-12 lg:py-0">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition mb-10">
            <FiArrowLeft /> Back to home
          </Link>

          <span className="inline-flex items-center gap-2 ml-3 px-4 py-1.5 rounded-full border border-[#fe4462] bg-[#fe4462]/10 text-[#fe4462] text-xs font-bold uppercase tracking-wider">
            <HiSparkles /> Mohan Maya
          </span>

          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Where tiny art
            <br />
            comes to <span className="text-[#fe4462]">life</span>
          </h1>

          <p className="mt-4 text-white/70 leading-relaxed max-w-md">
            Join a community of collectors. Sign in to manage your handcrafted
            miniatures, orders, and wishlist - all in one premium experience.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-white/85">
                <span className="w-6 h-6 rounded-full bg-[#fe4462]/20 text-[#fe4462] flex items-center justify-center shrink-0">
                  <FiCheck size={14} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right: auth card ── */}
      <div className="flex items-center justify-center px-5 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-white dark:bg-[#140a0d] rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-7 sm:p-9"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isRegister
              ? "Join Mohan Maya for a tailored experience."
              : "Log in to continue your collection."}
          </p>

          {/* Tabs */}
          <div className="relative grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-full mt-6">
            {["login", "register"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                aria-pressed={tab === t}
                className="relative py-2.5 rounded-full text-sm font-semibold capitalize z-10 transition-colors"
              >
                {tab === t && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-[#fe4462] rounded-full shadow"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span className={`relative ${tab === t ? "text-white" : "text-gray-600 dark:text-gray-300"}`}>
                  {t === "login" ? "Login" : "Register"}
                </span>
              </button>
            ))}
          </div>

          {/* Social logins (placeholders for future integration) */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {socials.map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => addToast(`${label} sign-in coming soon`, "info")}
                aria-label={`Continue with ${label}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#fe4462] hover:text-[#fe4462] transition"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Form (animated swap between login/register) */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {isRegister && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="name" className="sr-only">Full name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      className={fieldCls("name")}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={fieldCls("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  aria-invalid={Boolean(errors.password)}
                  className={`${fieldCls("password")} !pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#fe4462] transition"
                >
                  {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#fe4462]"
                />
                Remember me
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => addToast("Password reset link sent (demo)", "info")}
                  className="font-medium text-[#fe4462] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full justify-center bg-[#fe4462] border border-[#fe4462] rounded-full text-[#fff] font-medium hover:bg-transparent hover:text-[#fe4462] duration-200 cursor-pointer !py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  {isRegister ? "Creating account…" : "Signing in…"}
                </>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {isRegister ? "Already have an account?" : "New to Mohan Maya?"}{" "}
            <button
              type="button"
              onClick={() => switchTab(isRegister ? "login" : "register")}
              className="text-[#fe4462] font-semibold hover:underline"
            >
              {isRegister ? "Login" : "Create one"}
            </button>
          </p>

          <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
            By continuing you agree to our{" "}
            <Link to="/terms" className="underline hover:text-[#fe4462]">Terms</Link> and{" "}
            <Link to="/privacy" className="underline hover:text-[#fe4462]">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
