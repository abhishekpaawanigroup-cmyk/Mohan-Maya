import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import AuthShell from "./AuthShell";
import { btnPrimary } from "./authStyles";

export default function VerifyEmail() {
  usePageMeta("Verify Email - Mohan Maya", "Confirm your Mohan Maya account email address.");

  const { verifyEmail } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard StrictMode double-invoke
    ran.current = true;

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }
    verifyEmail({ token })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(err?.message || "We couldn't verify this link.");
      });
  }, [token, verifyEmail]);

  if (status === "verifying") {
    return (
      <AuthShell title="Verifying your email" subtitle="Hold on a moment…">
        <div className="flex justify-center py-4">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#fe4462]/30 border-t-[#fe4462]" />
        </div>
      </AuthShell>
    );
  }

  if (status === "success") {
    return (
      <AuthShell title="Email verified" subtitle="Your email address has been confirmed. Welcome aboard!">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <FiCheckCircle size={28} />
          </span>
          <button onClick={() => navigate("/profile")} className={`${btnPrimary} mt-6`}>
            Continue to profile
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verification failed"
      subtitle={message}
      footer={
        <button onClick={() => navigate("/auth")} className="font-semibold text-[#fe4462] hover:underline">
          Back to sign in
        </button>
      }
    >
      <div className="flex justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <FiAlertTriangle size={28} />
        </span>
      </div>
    </AuthShell>
  );
}
