import { motion } from "framer-motion";
import { getStatusMeta } from "../../utils/orders";

/**
 * Coloured pill for an order status. Colour comes from STATUS_META so both the
 * customer and admin views stay in sync. Animates in on mount / status change.
 */
export default function OrderStatusBadge({ status, size = "md", className = "" }) {
  const meta = getStatusMeta(status);
  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${meta.badge} ${sizes[size]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </motion.span>
  );
}
