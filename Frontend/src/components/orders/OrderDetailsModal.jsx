import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiX, FiClock, FiCalendar, FiCreditCard, FiMapPin, FiUser, FiTruck,
  FiDownload, FiSlash, FiInfo,
} from "react-icons/fi";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import {
  deriveStatus, paymentLabel, paymentStatus, PAYMENT_TONE, isCancellable,
  deliveryEstimate, downloadInvoice, fmtDate, fmtDateTime, inr,
} from "../../utils/orders";

/**
 * Full order details modal, shared by the customer (My Orders) and admin views.
 * Props:
 *  - order            the order object
 *  - onClose          () => void
 *  - onTrack          (id) => void   (optional — shows "Track this order")
 *  - onCancel         (order) => void (optional — shows "Cancel Order" when eligible)
 *  - adminMode        boolean         (shows the owning customer's email)
 */
export default function OrderDetailsModal({ order, onClose, onTrack, onCancel, adminMode = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const status = deriveStatus(order);
  const cancelled = status === "Cancelled";
  const c = order.customer || {};
  const t = order.totals || {};
  const pay = paymentStatus(order);
  const { minDate, maxDate, rangeLabel } = deliveryEstimate(order);
  const canCancel = isCancellable(order);
  const canTrack = !cancelled && onTrack;
  const instructions = c.deliveryInstructions || order.deliveryInstructions;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fe4462] to-[#c48212]" aria-hidden="true" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white/95 px-6 pb-4 pt-6 backdrop-blur dark:border-white/10 dark:bg-[#140a0d]/95 sm:px-7">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Order ID</p>
            <h3 id="order-details-title" className="text-xl font-bold text-gray-900 dark:text-white">
              #{order.id}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={status} />
              <span className="text-xs text-gray-400">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FiClock size={12} /> {fmtDateTime(order.createdAt)}
              </span>
            </div>
            {adminMode && order.ownerEmail && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Customer: <span className="font-medium">{order.ownerEmail}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-500 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-7">
          {/* Meta grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Meta icon={FiCalendar} label="Estimated delivery">
              {cancelled ? "—" : minDate.getTime() === maxDate.getTime() ? fmtDate(maxDate) : rangeLabel}
            </Meta>
            <Meta icon={FiCreditCard} label="Payment">
              {paymentLabel(order)}
              <span className={`mt-0.5 block text-xs font-semibold ${PAYMENT_TONE[pay.tone]}`}>{pay.label}</span>
            </Meta>
            <Meta icon={FiUser} label="Billing details">
              <span className="block">{c.fullName || "—"}</span>
              {c.email && <span className="block font-normal text-gray-500 dark:text-gray-400">{c.email}</span>}
              {c.phone && <span className="block font-normal text-gray-500 dark:text-gray-400">{c.phone}</span>}
            </Meta>
            <Meta icon={FiMapPin} label="Shipping address">
              <span className="block font-normal leading-relaxed text-gray-600 dark:text-gray-300">
                {[c.address, c.city, c.state, c.pincode].filter(Boolean).join(", ") || "—"}
              </span>
            </Meta>
            {instructions && (
              <div className="sm:col-span-2">
                <Meta icon={FiInfo} label="Delivery instructions">
                  <span className="font-normal text-gray-600 dark:text-gray-300">{instructions}</span>
                </Meta>
              </div>
            )}
          </div>

          {/* Timeline */}
          <Section title="Order Timeline">
            <OrderTimeline order={order} />
          </Section>

          {/* Items */}
          <Section title={`Ordered Products (${order.items?.length || 0})`}>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fbfefb] dark:bg-white/10">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500">{inr(item.price)} × {item.qty}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#fe4462]">{inr(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Bill summary */}
          <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-4">
            <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Bill Summary</h4>
            <div className="space-y-1.5 text-sm">
              <BillRow label="Subtotal" value={inr(t.subtotal)} />
              {t.discount > 0 && (
                <BillRow label={`Discount${order.coupon ? ` (${order.coupon})` : ""}`} value={`−${inr(t.discount)}`} tone="text-green-600" />
              )}
              <BillRow label="Delivery Charges" value={t.shipping === 0 ? "Free" : inr(t.shipping)} />
              {t.gst != null && <BillRow label="GST (18%)" value={inr(t.gst)} />}
              <div className="mt-1.5 flex justify-between border-t border-gray-200 dark:border-white/10 pt-2 font-bold text-gray-900 dark:text-white">
                <span>Total {cancelled ? "" : "Paid"}</span>
                <span className="text-[#fe4462]">{inr(t.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={() => downloadInvoice(order)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-white/15 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:border-[#fe4462] hover:text-[#fe4462]"
            >
              <FiDownload size={16} /> Download Invoice
            </button>
            {canTrack && (
              <button
                onClick={() => onTrack(order.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#fe4462] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d93550] active:scale-[0.98]"
              >
                <FiTruck size={16} /> Track Order
              </button>
            )}
            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(order)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-300 dark:border-red-500/40 px-5 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-500 hover:text-white hover:border-red-500"
              >
                <FiSlash size={16} /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Meta({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fe4462]/10 text-[#fe4462]">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{children}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
      {children}
    </div>
  );
}

function BillRow({ label, value, tone }) {
  return (
    <div className={`flex justify-between ${tone || "text-gray-600 dark:text-gray-300"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
