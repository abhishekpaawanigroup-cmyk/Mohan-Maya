import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { CANCEL_REASONS } from "../../utils/orders";

/**
 * Confirmation modal for cancelling an order. A reason is mandatory; picking
 * "Other" reveals a required free-text box. Calls onConfirm({ reason, note })
 * and shows a loading state while the parent completes the cancellation.
 */
export default function CancelOrderModal({ order, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const isOther = reason === "Other";

  const handleConfirm = async () => {
    if (!reason) return setError("Please select a reason for cancellation.");
    if (isOther && !note.trim()) return setError("Please tell us the reason.");
    setError("");
    setSubmitting(true);
    try {
      await onConfirm({ reason, note: isOther ? note.trim() : "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !submitting && onClose()}
      role="presentation"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-order-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10 sm:p-7"
      >
        <button
          onClick={() => !submitting && onClose()}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-red-500/10 hover:text-red-500"
        >
          <FiX size={20} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/10 text-red-500">
            <FiAlertTriangle size={22} />
          </span>
          <div>
            <h3 id="cancel-order-title" className="text-lg font-bold text-gray-900 dark:text-white">
              Cancel Order
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to cancel order <span className="font-semibold">#{order.id}</span>?
            </p>
          </div>
        </div>

        <fieldset className="mt-5" disabled={submitting}>
          <legend className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            Reason for cancellation <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((r) => (
              <label
                key={r}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                  reason === r
                    ? "border-[#fe4462] bg-[#fe4462]/5 text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#fe4462]/50"
                }`}
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => { setReason(r); setError(""); }}
                  className="h-4 w-4 accent-[#fe4462]"
                />
                {r}
              </label>
            ))}
          </div>

          {isOther && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <label htmlFor="cancel-note" className="mt-3 mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Please tell us the reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancel-note"
                value={note}
                onChange={(e) => { setNote(e.target.value); setError(""); }}
                rows={3}
                placeholder="Tell us a bit more…"
                className="w-full resize-none rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3.5 py-2.5 text-sm text-gray-800 dark:text-white outline-none transition focus:border-[#fe4462]"
              />
            </motion.div>
          )}
        </fieldset>

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => !submitting && onClose()}
            disabled={submitting}
            className="flex-1 rounded-full border border-gray-200 dark:border-white/15 px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 transition hover:border-[#fe4462] hover:text-[#fe4462] disabled:opacity-60"
          >
            Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? "Cancelling…" : "Cancel Order"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
