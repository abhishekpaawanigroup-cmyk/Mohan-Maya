import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiInbox, FiClock, FiPackage, FiTruck, FiCalendar, FiCreditCard, FiSlash, FiEye,
} from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import Pagination from "../../../components/common/Pagination";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";
import OrderDetailsModal from "../../../components/orders/OrderDetailsModal";
import CancelOrderModal from "../../../components/orders/CancelOrderModal";
import { OrderCardSkeletonGrid } from "../../../components/orders/OrderSkeletons";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import {
  deriveStatus, isCancellable, paymentLabel, paymentStatus, PAYMENT_TONE,
  itemCount, deliveryEstimate, fmtDate, inr,
} from "../../../utils/orders";

// Status filter tabs shown across the top.
const FILTERS = ["All", "Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
const PER_PAGE = 6;

export default function MyOrders() {
  usePageMeta("My Orders - Mohan Maya", "View, track and manage your Mohan Maya orders.");
  const navigate = useNavigate();
  const { orders, cancelOrder } = useApp();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  // Brief skeleton pass on mount for a polished loading feel (data is local).
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Changing a filter or the search resets to the first page (so results are
  // never hidden on a now-out-of-range page).
  const changeFilter = (f) => { setFilter(f); setPage(1); };
  const changeSearch = (v) => { setSearch(v); setPage(1); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const status = deriveStatus(o);
      if (filter !== "All" && status !== filter) return false;
      if (!q) return true;
      const inId = o.id?.toLowerCase().includes(q);
      const inItems = o.items?.some((i) => i.name?.toLowerCase().includes(q));
      return inId || inItems;
    });
  }, [orders, filter, search]);

  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Per-status counts for the filter tab badges.
  const counts = useMemo(() => {
    const map = { All: orders.length };
    for (const o of orders) {
      const s = deriveStatus(o);
      map[s] = (map[s] || 0) + 1;
    }
    return map;
  }, [orders]);

  const trackOrder = (id) => navigate(`/track?order=${id}`);

  const handleCancel = async ({ reason, note }) => {
    cancelOrder(cancelTarget.id, { reason, note });
    setCancelTarget(null);
    setDetailsOrder(null);
  };

  return (
    <section className="min-h-screen bg-[#fbfefb] pb-20 pt-28 dark:bg-[#0d0508]">
      <div className="mx-auto max-w-6xl px-5">
        {/* Heading */}
        <ScrollReveal className="mb-8">
          <span className="inline-block rounded-full border border-[#fe4462] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#fe4462]">
            My Orders
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Your Orders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track, review and manage every order in one place.
          </p>
        </ScrollReveal>

        {/* Search */}
        <div className="mb-5">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Search by order ID or product name"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-7 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            const count = counts[f] || 0;
            return (
              <button
                key={f}
                onClick={() => changeFilter(f)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#fe4462] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                }`}
              >
                {f}
                <span
                  className={`rounded-full px-1.5 text-[11px] ${
                    active ? "bg-white/25" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        {loading ? (
          <OrderCardSkeletonGrid count={4} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            hint="You haven't placed any orders yet. Once you do, they'll appear here with full tracking."
            cta
          />
        ) : total === 0 ? (
          <EmptyState
            title="No matching orders"
            hint="Try a different filter or search term to find what you're looking for."
          />
        ) : (
          <>
            <motion.div layout className="grid gap-5 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {pageItems.map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    onDetails={() => setDetailsOrder(o)}
                    onTrack={() => trackOrder(o.id)}
                    onCancel={() => setCancelTarget(o)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {total > PER_PAGE && (
              <div className="mt-8">
                <Pagination
                  page={page}
                  perPage={PER_PAGE}
                  total={total}
                  onPageChange={setPage}
                  perPageOptions={[6]}
                  label="orders"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {detailsOrder && (
          <OrderDetailsModal
            order={detailsOrder}
            onClose={() => setDetailsOrder(null)}
            onTrack={(id) => { setDetailsOrder(null); trackOrder(id); }}
            onCancel={(o) => setCancelTarget(o)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cancelTarget && (
          <CancelOrderModal
            order={cancelTarget}
            onClose={() => setCancelTarget(null)}
            onConfirm={handleCancel}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Single order card ── */
function OrderCard({ order, onDetails, onTrack, onCancel }) {
  const status = deriveStatus(order);
  const cancelled = status === "Cancelled";
  const pay = paymentStatus(order);
  const count = itemCount(order);
  const { minDate, maxDate, rangeLabel } = deliveryEstimate(order);
  const canCancel = isCancellable(order);
  const preview = order.items?.slice(0, 3) || [];
  const extra = (order.items?.length || 0) - preview.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3 dark:border-white/10">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">Order</p>
          <p className="truncate font-bold text-gray-900 dark:text-white">#{order.id}</p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <FiClock size={12} /> {fmtDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      {/* Meta chips */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Chip icon={FiPackage} label={`${count} item${count === 1 ? "" : "s"}`} />
        <Chip icon={FiCreditCard} label={paymentLabel(order)} value={pay.label} tone={PAYMENT_TONE[pay.tone]} />
        <Chip
          icon={FiCalendar}
          label={cancelled ? "Delivery" : "Est. delivery"}
          value={cancelled ? "—" : minDate.getTime() === maxDate.getTime() ? fmtDate(maxDate) : rangeLabel}
        />
        <Chip icon={FiTruck} label="Total" value={inr(order.totals?.total)} tone="text-[#fe4462] font-bold" />
      </div>

      {/* Items */}
      <div className="mt-3 flex-1 space-y-2.5">
        {preview.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#fbfefb] dark:bg-white/10">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500">Qty {item.qty} · {inr(item.price)}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-[#fe4462]">{inr(item.price * item.qty)}</span>
          </div>
        ))}
        {extra > 0 && (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            +{extra} more item{extra === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-white/10">
        <button
          onClick={onDetails}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-200"
        >
          <FiEye size={15} /> View Details
        </button>
        {!cancelled && (
          <button
            onClick={onTrack}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#fe4462] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d93550] active:scale-[0.98]"
          >
            <FiTruck size={15} /> Track
          </button>
        )}
        {canCancel && (
          <button
            onClick={onCancel}
            aria-label="Cancel order"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-500/40"
          >
            <FiSlash size={15} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Chip({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-2.5 py-2 dark:bg-white/[0.04]">
      <Icon size={14} className="shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="truncate text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
        {value && <p className={`truncate text-xs font-medium text-gray-700 dark:text-gray-200 ${tone || ""}`}>{value}</p>}
      </div>
    </div>
  );
}

function EmptyState({ title, hint, cta }) {
  return (
    <ScrollReveal>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-5 py-16 text-center dark:border-white/10">
        <FiInbox size={48} className="mb-4 text-gray-300" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">{hint}</p>
        {cta && <Link to="/shop" className="btn-primary mt-6">Start Shopping</Link>}
      </div>
    </ScrollReveal>
  );
}
