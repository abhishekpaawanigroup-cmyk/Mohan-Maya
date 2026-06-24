import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from "react-icons/fi";
import { useApp } from "../../context/AppContext";

const config = {
  success: { icon: FiCheckCircle, ring: "border-green-500", text: "text-green-600" },
  info: { icon: FiInfo, ring: "border-[#fe4462]", text: "text-[#fe4462]" },
  error: { icon: FiAlertCircle, ring: "border-red-500", text: "text-red-600" },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-24 right-4 z-[1000] flex flex-col gap-3 w-[min(92vw,340px)] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { icon: Icon, ring, text } = config[toast.type] || config.info;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-center gap-3 bg-white dark:bg-[#1a0a0e] border-l-4 ${ring} shadow-xl rounded-xl px-4 py-3`}
              role="status"
            >
              <Icon className={`${text} shrink-0`} size={20} />
              <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                aria-label="Dismiss notification"
              >
                <FiX size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
