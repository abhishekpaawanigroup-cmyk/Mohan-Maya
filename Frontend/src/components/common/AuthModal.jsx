import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import { useModalA11y } from "../../hooks/useHooks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{6,}$/;

const fieldCls = (invalid) =>
  `w-full bg-gray-50 dark:bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none transition-all duration-200 focus:ring-4 focus:ring-[#fe4462]/15 focus:border-[#fe4462] focus:bg-white dark:focus:bg-white/[0.07] focus-visible:!outline-none ${
    invalid ? "border-red-400 focus:ring-red-400/15" : "border-gray-200 dark:border-white/10"
  }`;

/** Labelled input with icon + inline error (shown once the field is touched). */
function Field({ icon: Icon, error, touched, trailing, ...props }) {
  const show = touched && error;
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input aria-invalid={Boolean(show)} className={`${fieldCls(show)} ${trailing ? "!pr-11" : ""}`} {...props} />
        {trailing}
      </div>
      {show && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* Outer gate: only mounts the dialog (and its focus-trap/scroll-lock) when open. */
export default function AuthModal() {
  const { authModal } = useApp();
  return (
    <AnimatePresence>{authModal.open && <AuthDialog key="auth-modal" />}</AnimatePresence>
  );
}

function AuthDialog() {
  const { authModal, closeAuthModal, completeAuth, login, signup, addToast } = useApp();
  const navigate = useNavigate();
  const dialogRef = useModalA11y(closeAuthModal);

  const [tab, setTab] = useState(authModal.mode === "register" ? "register" : "login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const isRegister = tab === "register";

  // Real-time validation derived from the current values.
  const errors = useMemo(() => {
    const e = {};
    if (isRegister && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email";
    if (isRegister) {
      if (!form.phone.trim()) e.phone = "Mobile number is required";
      else if (!PHONE_RE.test(form.phone.trim())) e.phone = "Enter a valid mobile number";
    }
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Use at least 6 characters";
    if (isRegister && form.confirm !== form.password) e.confirm = "Passwords don't match";
    return e;
  }, [form, isRegister]);

  // Merge live + server-side errors for display.
  const fieldError = (k) => serverErrors[k] || errors[k];
  const isValid = Object.keys(errors).length === 0;

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setServerErrors((p) => ({ ...p, [k]: undefined }));
  };
  const markTouched = (k) => () => setTouched((p) => ({ ...p, [k]: true }));

  const switchTab = (next) => {
    setTab(next);
    setTouched({});
    setServerErrors({});
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading || !isValid) {
      // Reveal any remaining errors if they force-submit via Enter.
      setTouched({ name: true, email: true, phone: true, password: true, confirm: true });
      return;
    }
    setLoading(true);
    setServerErrors({});
    try {
      if (isRegister) {
        await signup({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });
      } else {
        await login({ email: form.email.trim(), password: form.password, remember });
      }
      completeAuth(); // close + resume the action that opened the modal
    } catch (err) {
      if (err?.fields) setServerErrors(err.fields);
      addToast(err?.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const goForgot = () => {
    closeAuthModal();
    navigate("/forgot-password");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeAuthModal}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl outline-none ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10 sm:p-8"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fe4462] to-[#c48212]" aria-hidden="true" />

        <button
          onClick={closeAuthModal}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
        >
          <FiX size={20} />
        </button>

        {/* Logo + heading */}
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-[#fe4462]/30">
            <img src="/header/logo.png" alt="Mohan Maya" className="h-full w-full object-cover" />
          </div>
          <h2 id="auth-modal-title" className="mt-3 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Welcome to Mohan Maya
          </h2>
          <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue shopping, save your favorites, and manage your orders.
          </p>
        </div>

        {/* Tabs */}
        <div className="relative mt-6 grid grid-cols-2 gap-1 rounded-full bg-gray-100 p-1 dark:bg-white/5">
          {["login", "register"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              aria-pressed={tab === t}
              className="relative z-10 rounded-full py-2.5 text-sm font-semibold capitalize transition-colors"
            >
              {tab === t && (
                <motion.span
                  layoutId="auth-modal-tab"
                  className="absolute inset-0 rounded-full bg-[#fe4462] shadow-[0_8px_20px_-8px_rgba(254,68,98,0.7)]"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span className={`relative ${tab === t ? "text-white" : "text-gray-600 dark:text-gray-300"}`}>
                {t === "login" ? "Sign In" : "Create Account"}
              </span>
            </button>
          ))}
        </div>

        {/* Google sign-in (UI ready) */}
        <button
          type="button"
          onClick={() => addToast("Google sign-in coming soon", "info")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#fe4462] hover:bg-[#fe4462]/5 hover:text-[#fe4462] dark:border-white/10 dark:text-gray-200"
        >
          <FaGoogle className="text-[#ea4335]" size={18} /> Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          <span className="text-xs font-medium text-gray-400">OR</span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={submit} noValidate className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {isRegister && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Field
                  icon={FiUser}
                  name="name"
                  value={form.name}
                  onChange={set("name")}
                  onBlur={markTouched("name")}
                  placeholder="Full name"
                  autoComplete="name"
                  error={fieldError("name")}
                  touched={touched.name}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            icon={FiMail}
            type="email"
            name="email"
            value={form.email}
            onChange={set("email")}
            onBlur={markTouched("email")}
            placeholder="Email address"
            autoComplete="email"
            error={fieldError("email")}
            touched={touched.email}
          />

          <AnimatePresence initial={false} mode="popLayout">
            {isRegister && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Field
                  icon={FiPhone}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={set("phone")}
                  onBlur={markTouched("phone")}
                  placeholder="Mobile number"
                  autoComplete="tel"
                  error={fieldError("phone")}
                  touched={touched.phone}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            icon={FiLock}
            type={showPw ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={set("password")}
            onBlur={markTouched("password")}
            placeholder="Password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            error={fieldError("password")}
            touched={touched.password}
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition hover:text-[#fe4462]"
              >
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            }
          />

          <AnimatePresence initial={false} mode="popLayout">
            {isRegister && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Field
                  icon={FiLock}
                  type={showPw ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={set("confirm")}
                  onBlur={markTouched("confirm")}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  error={fieldError("confirm")}
                  touched={touched.confirm}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remember me + forgot (sign in only) */}
          {!isRegister && (
            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex cursor-pointer select-none items-center gap-2 text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#fe4462]"
                />
                Remember me
              </label>
              <button type="button" onClick={goForgot} className="font-medium text-[#fe4462] hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading || !isValid}
            aria-busy={loading}
            whileHover={{ scale: loading || !isValid ? 1 : 1.02 }}
            whileTap={{ scale: loading || !isValid ? 1 : 0.97 }}
            className="!mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fe4462] to-[#d93550] py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_12px_28px_-10px_rgba(254,68,98,0.7)] transition-shadow duration-200 hover:shadow-[0_16px_34px_-10px_rgba(254,68,98,0.85)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {isRegister ? "Creating account…" : "Signing in…"}
              </>
            ) : isRegister ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400">
          By continuing you agree to our{" "}
          <button onClick={() => { closeAuthModal(); navigate("/terms"); }} className="underline hover:text-[#fe4462]">Terms</button>{" "}
          and{" "}
          <button onClick={() => { closeAuthModal(); navigate("/privacy"); }} className="underline hover:text-[#fe4462]">Privacy Policy</button>.
        </p>
      </motion.div>
    </motion.div>
  );
}
