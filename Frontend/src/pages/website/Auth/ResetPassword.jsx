import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiAlertTriangle } from "react-icons/fi";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import AuthShell from "./AuthShell";
import { fieldCls, btnPrimary } from "./authStyles";

export default function ResetPassword() {
  usePageMeta("Reset Password - Mohan Maya", "Create a new password for your Mohan Maya account.");

  const { resetPassword, addToast } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  // `tokenError` covers invalid / expired links (a dead-end state).
  const [tokenError, setTokenError] = useState(token ? "" : "This reset link is missing its token.");

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const errs = {};
    if (!form.password) errs.password = "Enter a new password";
    else if (form.password.length < 6) errs.password = "Use at least 6 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords don't match";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await resetPassword({ token, password: form.password });
      addToast("Password reset successfully. Please sign in.", "success");
      navigate("/auth?mode=login", { replace: true });
    } catch (err) {
      if (err?.code === "INVALID_TOKEN" || err?.code === "EXPIRED_TOKEN") {
        setTokenError(err.message);
      } else if (err?.fields) {
        setErrors((prev) => ({ ...prev, ...err.fields }));
      } else {
        addToast(err?.message || "Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return (
      <AuthShell
        title="Link not valid"
        subtitle={tokenError}
        footer={
          <button onClick={() => navigate("/auth")} className="font-semibold text-[#fe4462] hover:underline">
            Back to sign in
          </button>
        }
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <FiAlertTriangle size={28} />
          </span>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#fe4462] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d93550]"
          >
            Request a new link
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create new password" subtitle="Choose a strong password you don't use elsewhere.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="New password"
              autoComplete="new-password"
              aria-label="New password"
              aria-invalid={Boolean(errors.password)}
              className={`${fieldCls(Boolean(errors.password))} !pr-11`}
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

        <div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPw ? "text" : "password"}
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="Confirm new password"
              autoComplete="new-password"
              aria-label="Confirm new password"
              aria-invalid={Boolean(errors.confirm)}
              className={fieldCls(Boolean(errors.confirm))}
            />
          </div>
          {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
        </div>

        <button type="submit" disabled={loading} aria-busy={loading} className={btnPrimary}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Resetting…
            </>
          ) : (
            "Reset password"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
