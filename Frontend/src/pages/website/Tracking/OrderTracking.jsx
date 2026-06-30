import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheck, FiPackage, FiTruck, FiHome, FiClipboard, FiMapPin, FiClock, FiInbox, FiX, FiCreditCard, FiCalendar } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import { useApp } from "../../../context/AppContext";
import { ORDER_STEPS } from "../../../data/shop";
import { usePageMeta } from "../../../hooks/useHooks";
import { getDeliveryEstimate } from "../../../utils/delivery";

const STEP_ICONS = [FiClipboard, FiPackage, FiTruck, FiMapPin, FiHome];
const STEP_MS = 1000 * 60 * 30; // advance one step every 30 minutes (demo pacing)

const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  upi: "UPI",
};
// COD is collected on delivery; online methods are treated as paid.
const paymentStatus = (method) => (method === "cod" ? "Pending (pay on delivery)" : "Paid");

function currentStep(order) {
  const elapsed = Date.now() - (order.createdAt || Date.now());
  return Math.min(ORDER_STEPS.length - 1, Math.floor(elapsed / STEP_MS));
}

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const fmtDateTime = (ts) =>
  new Date(ts).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

export default function OrderTracking() {
  usePageMeta("My Orders - Mohan Maya", "View your Mohan Maya orders and track their status in real time.");
  const { getOrder, orders } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  // Initialise straight from the URL so ?order= (e.g. right after checkout)
  // resolves on first render - no effect / cascading render needed.
  const initialId = searchParams.get("order") || "";
  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState(() => (initialId ? getOrder(initialId) : null));
  const [searched, setSearched] = useState(Boolean(initialId));
  const [detailsOrder, setDetailsOrder] = useState(null); // order shown in the Details modal
  const [expanded, setExpanded] = useState(() => new Set()); // cards with all items shown
  const detailRef = useRef(null);

  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const runSearch = (id) => {
    setOrder(getOrder(id));
    setSearched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ order: query.trim() }, { replace: true });
    runSearch(query);
  };

  // Track a specific order (from a list card) and scroll its timeline into view.
  const trackOrder = (id) => {
    setQuery(id);
    setSearchParams({ order: id }, { replace: true });
    runSearch(id);
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const step = order ? currentStep(order) : -1;

  return (
    <section className="pt-28 pb-20 bg-[#fbfefb] dark:bg-[#0d0508] min-h-screen">
      <div className="max-w-5xl mx-auto px-5">
        <ScrollReveal className="text-center mb-10">
          <span className="inline-block text-[#fe4462] border border-[#fe4462] px-4 py-2 text-sm font-bold uppercase rounded-full">
            My Orders
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#fe4462] mt-4">Your Orders</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3">
            Review your orders and track their progress - or look one up by ID below.
          </p>
        </ScrollReveal>

        {/* Track by ID */}
        <ScrollReveal className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. MM1A2B3C"
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 outline-none focus:border-[#fe4462] dark:text-white uppercase placeholder:normal-case"
              />
            </div>
            <button type="submit" className="btn-primary justify-center">Track</button>
          </form>
        </ScrollReveal>

        {/* Not-found result */}
        {searched && !order && (
          <ScrollReveal className="mt-10 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/10">
              <FiSearch size={44} className="text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-bold dark:text-white">Order not found</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Double-check the ID. Orders you place on this device appear in the list below.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Tracking detail for the selected order */}
        {order && (
          <motion.div
            ref={detailRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 max-w-3xl mx-auto space-y-6 scroll-mt-28"
          >
            {/* Order header */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Order ID</p>
                <p className="font-bold text-lg dark:text-white">{order.id}</p>
              </div>
              <span className="inline-flex items-center gap-2 bg-[#fe4462]/10 text-[#fe4462] px-4 py-2 rounded-full text-sm font-semibold">
                {ORDER_STEPS[step]}
              </span>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/10">
              <ol className="relative">
                {ORDER_STEPS.map((label, i) => {
                  const Icon = STEP_ICONS[i];
                  const done = i <= step;
                  const isLast = i === ORDER_STEPS.length - 1;
                  return (
                    <li key={label} className="flex gap-4 pb-8 last:pb-0 relative">
                      {!isLast && (
                        <span
                          className={`absolute left-5 top-10 bottom-0 w-0.5 ${
                            i < step ? "bg-[#fe4462]" : "bg-gray-200 dark:bg-white/10"
                          }`}
                        />
                      )}
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          done ? "bg-[#fe4462] text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400"
                        }`}
                      >
                        {i < step ? <FiCheck size={18} /> : <Icon size={18} />}
                      </motion.span>
                      <div className="pt-1.5">
                        <p className={`font-semibold ${done ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                          {label}
                        </p>
                        {i === step && (
                          <p className="text-xs text-[#fe4462] font-medium mt-0.5">Current status</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
        )}

        {/* ── All orders ── */}
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            All Orders {orders.length > 0 && <span className="text-gray-400 font-medium">({orders.length})</span>}
          </h2>

          {orders.length === 0 ? (
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10 py-16 px-5 text-center">
                <FiInbox size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold dark:text-white">No orders yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                  You haven't placed any orders yet. Once you do, they'll appear here with full tracking.
                </p>
                <Link to="/shop" className="btn-primary mt-6">Start Shopping</Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {orders.map((o, idx) => {
                const s = currentStep(o);
                const itemCount = o.items?.reduce((sum, i) => sum + i.qty, 0) || 0;
                const isActive = order?.id === o.id;
                return (
                  <ScrollReveal key={o.id} delay={idx * 0.05}>
                    <div
                      className={`flex h-full flex-col rounded-2xl border bg-white dark:bg-white/5 p-5 shadow-sm transition-colors ${
                        isActive ? "border-[#fe4462]" : "border-gray-100 dark:border-white/10"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 dark:border-white/10 pb-3">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">Order</p>
                          <p className="font-bold text-gray-900 dark:text-white truncate">#{o.id}</p>
                          <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <FiClock size={12} /> {fmtDate(o.createdAt)} · {itemCount} item{itemCount === 1 ? "" : "s"}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fe4462]/10 px-3 py-1 text-xs font-semibold text-[#fe4462] shrink-0">
                          {ORDER_STEPS[s]}
                        </span>
                      </div>

                      {/* Items (first few, expandable) */}
                      <div className="mt-3 flex-1 space-y-2.5">
                        {(expanded.has(o.id) ? o.items : o.items.slice(0, 3)).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg bg-[#fbfefb] dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate dark:text-white">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty {item.qty}</p>
                            </div>
                            <span className="text-sm font-semibold text-[#fe4462] shrink-0">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                        {o.items.length > 3 && (
                          <button
                            onClick={() => toggleExpand(o.id)}
                            aria-expanded={expanded.has(o.id)}
                            className="text-xs font-semibold text-[#fe4462] hover:underline"
                          >
                            {expanded.has(o.id) ? "Show less" : `+${o.items.length - 3} more item${o.items.length - 3 === 1 ? "" : "s"}`}
                          </button>
                        )}
                      </div>

                      {/* Total */}
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                        <span className="font-bold text-[#fe4462]">₹{o.totals?.total ?? 0}</span>
                      </div>

                      {/* Actions: Details + Track */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setDetailsOrder(o)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-white/15 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:border-[#fe4462] hover:text-[#fe4462]"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => trackOrder(o.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#fe4462] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d93550] active:scale-95"
                        >
                          <FiTruck size={16} /> {isActive ? "Tracking…" : "Track"}
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order details modal */}
      <AnimatePresence>
        {detailsOrder && (
          <OrderDetailsModal
            order={detailsOrder}
            onClose={() => setDetailsOrder(null)}
            onTrack={(id) => { setDetailsOrder(null); trackOrder(id); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Full order details modal ── */
function OrderDetailsModal({ order, onClose, onTrack }) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const step = currentStep(order);
  const c = order.customer || {};
  const { minDate, maxDate, rangeLabel } = getDeliveryEstimate(3, 5, new Date(order.createdAt || Date.now()));
  const t = order.totals || {};

  const Row = ({ icon: Icon, label, children }) => (
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
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10 sm:p-7"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fe4462] to-[#c48212]" aria-hidden="true" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="pr-10">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">Order ID</p>
          <h3 id="order-details-title" className="text-xl font-bold text-gray-900 dark:text-white">#{order.id}</h3>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#fe4462]/10 px-3 py-1 text-xs font-semibold text-[#fe4462]">
            {ORDER_STEPS[step]}
          </span>
        </div>

        {/* Meta grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Row icon={FiClock} label="Order placed">{fmtDateTime(order.createdAt)}</Row>
          <Row icon={FiCalendar} label="Expected delivery">
            {minDate.getTime() === maxDate.getTime() ? fmtDate(maxDate) : rangeLabel}
          </Row>
          <Row icon={FiTruck} label="Order status">{ORDER_STEPS[step]}</Row>
          <Row icon={FiCreditCard} label="Payment">
            {PAYMENT_LABELS[c.payment] || "-"}
            <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
              {paymentStatus(c.payment)}
            </span>
          </Row>
          <div className="sm:col-span-2">
            <Row icon={FiMapPin} label="Delivery address">
              {c.fullName && <span className="block">{c.fullName}{c.phone ? ` · ${c.phone}` : ""}</span>}
              <span className="block font-normal text-gray-600 dark:text-gray-300 leading-relaxed">
                {[c.address, c.city, c.state, c.pincode].filter(Boolean).join(", ") || "-"}
              </span>
            </Row>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Items ({order.items.length})</h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#fbfefb] dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                </div>
                <span className="text-sm font-semibold text-[#fe4462] shrink-0">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mt-5 space-y-1.5 border-t border-gray-100 dark:border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>₹{t.subtotal ?? 0}</span></div>
          {t.discount > 0 && (
            <div className="flex justify-between text-green-600"><span>Discount{order.coupon ? ` (${order.coupon})` : ""}</span><span>−₹{t.discount}</span></div>
          )}
          <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Shipping</span><span>{t.shipping === 0 ? "Free" : `₹${t.shipping}`}</span></div>
          {t.gst != null && (
            <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>GST (18%)</span><span>₹{t.gst}</span></div>
          )}
          <div className="flex justify-between border-t border-gray-100 dark:border-white/10 pt-2 font-bold text-gray-900 dark:text-white">
            <span>Total Paid</span><span className="text-[#fe4462]">₹{t.total ?? 0}</span>
          </div>
        </div>

        <button
          onClick={() => onTrack(order.id)}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#fe4462] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d93550] active:scale-95"
        >
          <FiTruck size={16} /> Track this order
        </button>
      </motion.div>
    </motion.div>
  );
}
