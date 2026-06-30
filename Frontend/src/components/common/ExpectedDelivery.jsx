import { FiTruck } from "react-icons/fi";
import { getDeliveryEstimate } from "../../utils/delivery";

/**
 * Expected-delivery indicator, recomputed from the current date on each render.
 *
 * - `compact` (product cards): a single subtle line.
 * - default (product detail views): a bordered card with the estimated window.
 */
export default function ExpectedDelivery({ minDays = 3, maxDays = 5, compact = false, className = "" }) {
  const { rangeLabel } = getDeliveryEstimate(minDays, maxDays);

  if (compact) {
    return (
      <p className={`flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        <FiTruck size={13} className="shrink-0 text-[#fe4462]" />
        <span>
          Delivery in <span className="font-semibold text-gray-700 dark:text-gray-200">{minDays}–{maxDays} business days</span>
        </span>
      </p>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fe4462]/10 text-[#fe4462]">
        <FiTruck size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Estimated Delivery: {minDays}–{maxDays} business days
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Arrives by <span className="font-medium text-gray-700 dark:text-gray-300">{rangeLabel}</span>
        </p>
      </div>
    </div>
  );
}
