import { motion } from "framer-motion";
import { FiCheck, FiClipboard, FiCheckCircle, FiBox, FiTruck, FiMapPin, FiHome, FiXCircle } from "react-icons/fi";
import { ORDER_STATUS_FLOW, deriveStatus, statusIndex, fmtDateTime } from "../../utils/orders";

const STEP_ICONS = {
  Pending: FiClipboard,
  Confirmed: FiCheckCircle,
  Packed: FiBox,
  Shipped: FiTruck,
  "Out for Delivery": FiMapPin,
  Delivered: FiHome,
};

/**
 * Vertical order timeline used inside the details modal.
 * For a cancelled order it shows the stages the order reached before
 * cancellation, then a red "Cancelled" node with the reason and timestamp.
 */
export default function OrderTimeline({ order }) {
  const status = deriveStatus(order);
  const cancelled = status === "Cancelled";

  // For a cancelled order, show progress up to the last real stage it reached
  // (stored on the order if available), otherwise just the first stage.
  const reachedIdx = cancelled
    ? Math.max(0, statusIndex(order.reachedStatus) )
    : statusIndex(status);

  const steps = cancelled
    ? ORDER_STATUS_FLOW.slice(0, Math.max(1, reachedIdx + 1))
    : ORDER_STATUS_FLOW;

  return (
    <ol className="relative">
      {steps.map((label, i) => {
        const Icon = STEP_ICONS[label];
        const done = i <= reachedIdx;
        const isCurrent = !cancelled && i === reachedIdx;
        return (
          <li key={label} className="flex gap-3.5 pb-6 last:pb-0 relative">
            <span
              className={`absolute left-[18px] top-9 bottom-0 w-0.5 ${
                done ? "bg-[#fe4462]" : "bg-gray-200 dark:bg-white/10"
              }`}
            />
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className={`relative grid h-9 w-9 place-items-center rounded-full shrink-0 ${
                done ? "bg-[#fe4462] text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400"
              }`}
            >
              {i < reachedIdx ? <FiCheck size={16} /> : <Icon size={15} />}
            </motion.span>
            <div className="pt-1.5">
              <p className={`text-sm font-semibold ${done ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                {label === "Pending" ? "Order Placed" : label}
              </p>
              {i === 0 && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{fmtDateTime(order.createdAt)}</p>
              )}
              {isCurrent && <p className="mt-0.5 text-xs font-medium text-[#fe4462]">Current status</p>}
            </div>
          </li>
        );
      })}

      {/* Cancelled terminal node */}
      {cancelled && (
        <li className="flex gap-3.5 relative">
          <span className="absolute left-[18px] -top-6 h-6 w-0.5 bg-red-400/70" />
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: steps.length * 0.06 }}
            className="relative z-10 grid h-9 w-9 place-items-center rounded-full shrink-0 bg-red-500 text-white"
          >
            <FiXCircle size={16} />
          </motion.span>
          <div className="pt-1.5">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Cancelled</p>
            {order.cancellation?.reason && (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                Reason: <span className="font-medium">{order.cancellation.reason}</span>
              </p>
            )}
            {order.cancellation?.note && (
              <p className="mt-0.5 text-xs italic text-gray-500 dark:text-gray-400">
                “{order.cancellation.note}”
              </p>
            )}
            {order.cancellation?.cancelledAt && (
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Cancelled on {fmtDateTime(order.cancellation.cancelledAt)}
              </p>
            )}
          </div>
        </li>
      )}
    </ol>
  );
}
