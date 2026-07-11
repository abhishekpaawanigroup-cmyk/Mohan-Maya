import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiInbox, FiMapPin, FiTruck, FiSlash, FiEye,
} from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import Pagination from "../../../components/common/Pagination";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";
import OrderDetailsModal from "../../../components/orders/OrderDetailsModal";
import CancelOrderModal from "../../../components/orders/CancelOrderModal";
import { OrderCardSkeletonGrid } from "../../../components/orders/OrderSkeletons";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import { useNotificationTrigger } from "../../../hooks/useNotificationTrigger";
import {
  deriveStatus, isCancellable, paymentLabel, paymentStatus, PAYMENT_TONE,
  itemCount, deliveryEstimate, fmtDate, inr,
} from "../../../utils/orders";

// Status filter tabs shown across the top.
const FILTERS = ["All", "Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
const PER_PAGE = 4;

export default function MyOrders() {
  usePageMeta("My Orders - Mohan Maya", "View, track and manage your Mohan Maya orders.");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, cancelOrder } = useApp();
  const trigger = useNotificationTrigger();

  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Brief skeleton pass on mount for a polished loading feel (data is local).
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Handle auto-filtering and highlighting order from notification click
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId || !orders.length) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      // Order not found - show friendly message
      setErrorMessage(`Order #${orderId} not found. It may have been deleted.`);
      // Clear the query param
      setSearchParams({});
      return;
    }

    // Set the correct filter based on order status (but don't open modal)
    const orderStatus = deriveStatus(order);
    if (orderStatus !== filter) {
      setFilter(orderStatus);
      setFiltering(true);
    }

    // Clear the query param after setting filter
    // Do NOT open the modal - just navigate and filter
    setSearchParams({});
  }, [searchParams, orders, filter, setSearchParams]);

  // Show a short skeleton pass whenever the active filter switches, so the
  // change is clearly perceptible even when data resolves instantly.
  useEffect(() => {
    if (!filtering) return;
    const t = setTimeout(() => setFiltering(false), 380);
    return () => clearTimeout(t);
  }, [filtering]);

  // Changing a filter resets to page 1 and triggers the transition skeleton.
  // Search also resets the page (kept instant - no skeleton flash on typing).
  const changeFilter = (f) => {
    if (f === filter) return;
    setFilter(f);
    setPage(1);
    setFiltering(true);
  };
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
    const orderId = cancelTarget.id;
    cancelOrder(orderId, { reason, note });

    // Show notification in the notification bell instead of toast
    trigger.orderCancelled(orderId);

    setCancelTarget(null);
    setDetailsOrder(null);
  };

  // Empty-state copy tailored to the active filter (e.g. "No Pending orders found").
  const emptyForFilter =
    filter === "All"
      ? { title: "No matching orders", hint: "Try a different search term to find what you're looking for." }
      : { title: `No ${filter} orders found`, hint: `You don't have any ${filter.toLowerCase()} orders right now.` };

  return (
    <section className="min-h-screen bg-[#fbfefb] pb-20 pt-28 lg:pt-36 dark:bg-[#0d0508] mt-20">
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

        {/* Error Message - Order Not Found */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 dark:border-orange-900/30 dark:bg-orange-900/20 dark:text-orange-300"
          >
            <p className="font-medium">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-5">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Search by order ID or product name"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition  dark:border-white/10 dark:bg-white/5 dark:text-white"
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
                aria-pressed={active}
                className={`relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? "border-transparent text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="orderFilterPill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#fe4462] shadow-sm"
                  />
                )}
                <span className="relative z-10">{f}</span>
                <span
                  className={`relative z-10 rounded-full px-1.5 text-[11px] transition-colors ${
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
          <OrderCardSkeletonGrid count={PER_PAGE} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="You haven't placed any orders yet."
            hint="When you place an order, it will appear here with full tracking and details."
            cta
          />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {filtering ? (
              // Transition skeleton - makes a filter switch clearly perceptible.
              <motion.div
                key="filtering"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OrderCardSkeletonGrid count={Math.min(PER_PAGE, total || PER_PAGE)} />
              </motion.div>
            ) : total === 0 ? (
              <motion.div
                key={`empty-${filter}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <EmptyState title={emptyForFilter.title} hint={emptyForFilter.hint} />
              </motion.div>
            ) : (
              <motion.div
                key={`list-${filter}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
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
                </div>

                {total > PER_PAGE && (
                  <div className="mt-8">
                    <Pagination
                      page={page}
                      perPage={PER_PAGE}
                      total={total}
                      onPageChange={setPage}
                      label="Orders"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
  const items = order.items || [];
  const first = items[0];
  const extra = Math.max(0, items.length - 1);
  const c = order.customer || {};
  const address = [c.city, c.state, c.pincode].filter(Boolean).join(", ");
  const deliveryValue = cancelled
    ? "-"
    : minDate.getTime() === maxDate.getTime()
      ? fmtDate(maxDate)
      : rangeLabel;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03] sm:px-5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-gray-400">Order ID</p>
          <p className="truncate text-sm font-bold text-gray-900 dark:text-white">#{order.id}</p>
        </div>
        <OrderStatusBadge status={status} size="sm" />
      </div>

      {/* Body - everything on the left, single unified column */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Product */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fbfefb] dark:bg-white/10">
            <img
              src={first?.image}
              alt={first?.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {extra > 0 && (
              <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                +{extra}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white sm:text-[15px]">
              {first?.name}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {count} item{count === 1 ? "" : "s"}
              {extra > 0 ? ` · ${items.length} products` : ""}
            </p>
          </div>
        </div>

        {/* Key facts */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <SummaryCell label="Order Date" value={fmtDate(order.createdAt)} />
          <SummaryCell label={cancelled ? "Delivery" : "Est. Delivery"} value={deliveryValue} />
          <SummaryCell label="Payment Method" value={paymentLabel(order)} />
          <SummaryCell label="Payment Status" value={pay.label} tone={PAYMENT_TONE[pay.tone]} />
        </dl>

        {/* Address summary */}
        {address && (
          <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <FiMapPin size={13} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              Deliver to {c.fullName ? `${c.fullName}, ` : ""}{address}
            </span>
          </p>
        )}

        {/* Total */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total ({count} qty)
          </span>
          <span className="text-lg font-bold text-[#fe4462]">{inr(order.totals?.total)}</span>
        </div>

        {/* Actions - pinned to the bottom so they align across cards */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button
            onClick={onDetails}
            className="inline-flex min-w-[6rem] flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:bg-transparent dark:text-gray-200"
          >
            <FiEye size={15} /> View Details
          </button>
          {!cancelled && (
            <button
              onClick={onTrack}
              className="inline-flex min-w-[6rem] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#fe4462] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d93550] active:scale-[0.98]"
            >
              <FiTruck size={15} /> Track
            </button>
          )}
          {canCancel && (
            <button
              onClick={onCancel}
              aria-label="Cancel order"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-500/40 dark:bg-transparent"
            >
              <FiSlash size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Labelled value cell used in the card's key-facts grid.
function SummaryCell({ label, value, tone }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-[11px] uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className={`mt-0.5 truncate text-sm font-semibold text-gray-800 dark:text-gray-100 ${tone || ""}`}>{value}</dd>
    </div>
  );
}

function EmptyState({ title, hint, cta }) {
  return (
    <ScrollReveal>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-5 py-16 text-center dark:border-white/10 sm:py-20">
        <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#fe4462]/10 text-[#fe4462]">
          <FiInbox size={40} />
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{title}</h3>
        <p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">{hint}</p>
        {cta && <Link to="/shop" className="btn-primary mt-6">Continue Shopping</Link>}
      </div>
    </ScrollReveal>
  );
}
