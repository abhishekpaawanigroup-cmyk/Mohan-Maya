import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import AuthShell from "./AuthShell";
import { fieldCls, btnPrimary } from "./authStyles";

export default function ForgotPassword() {
  usePageMeta("Forgot Password - Mohan Maya", "Request a link to reset your Mohan Maya account password.");

  const { forgotPassword, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoLink, setDemoLink] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const { resetLink } = await forgotPassword({ email });
      setDemoLink(resetLink); // demo only - a real backend would email this
      setSent(true);
      addToast("If an account exists, a reset link has been sent.", "success");
    } catch (err) {
      if (err?.fields?.email) setError(err.fields.email);
      addToast(err?.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="If an account exists for that address, we've sent a link to reset your password."
        footer={
          <button onClick={() => navigate("/auth")} className="font-semibold text-[#fe4462] hover:underline">
            Return to sign in
          </button>
        }
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <FiCheckCircle size={28} />
          </span>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Didn't receive it? Check your spam folder, or try again in a minute.
          </p>
        </div>

        {demoLink && (
          <div className="mt-5 rounded-xl border border-dashed border-[#fe4462]/40 bg-[#fe4462]/5 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-[#fe4462]">Demo mode - no real email is sent</p>
            <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">{demoLink}</p>
            <button
              onClick={() => navigate(demoLink.replace(window.location.origin, ""))}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fe4462] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d93550]"
            >
              Open reset link <FiArrowRight />
            </button>
          </div>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <>
          Remembered it?{" "}
          <button onClick={() => navigate("/auth")} className="font-semibold text-[#fe4462] hover:underline">
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email address"
              autoComplete="email"
              aria-label="Email address"
              aria-invalid={Boolean(error)}
              className={fieldCls(Boolean(error))}
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <button type="submit" disabled={loading} aria-busy={loading} className={btnPrimary}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending…
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
