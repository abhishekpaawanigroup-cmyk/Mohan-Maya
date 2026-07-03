import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiInbox, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle,
  FiDollarSign, FiEye, FiChevronDown,
} from "react-icons/fi";
import ScrollReveal from "../../components/common/ScrollReveal";
import Pagination from "../../components/common/Pagination";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import { OrderRowSkeleton } from "../../components/orders/OrderSkeletons";
import { useApp } from "../../context/AppContext";
import { usePageMeta } from "../../hooks/useHooks";
import { ORDER_STATUS_FLOW } from "../../utils/orders";
import {
  deriveStatus, paymentStatus, PAYMENT_TONE, itemCount, fmtDate, inr,
} from "../../utils/orders";

const STATUS_FILTERS = ["All", ...ORDER_STATUS_FLOW, "Cancelled"];
const PAYMENT_FILTERS = ["All Payments", "Paid", "Pending", "Refunded"];
const SORTS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "amount_desc", label: "Amount: High to Low" },
  { key: "amount_asc", label: "Amount: Low to High" },
];

// Maps a payment tone to the coarse label used by the payment filter.
const PAY_FILTER_MAP = { paid: "Paid", pending: "Pending", refund: "Refunded" };

export default function AllOrders() {
  usePageMeta("All Orders - Admin - Mohan Maya", "Admin dashboard to manage all customer orders.");
  const { allOrders, adminSetOrderStatus } = useApp();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All Payments");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [detailsOrder, setDetailsOrder] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Wrap each filter setter so any change returns to the first page (keeping
  // the active filters + search intact). Avoids an effect-driven page reset.
  const onFirstPage = (setter) => (v) => { setter(v); setPage(1); };
  const changeStatus = onFirstPage(setStatus);
  const changePayment = onFirstPage(setPayment);
  const changeSearch = onFirstPage(setSearch);
  const changeSort = onFirstPage(setSort);
  const changeFrom = onFirstPage(setFrom);
  const changeTo = onFirstPage(setTo);
  const changePerPage = onFirstPage(setPerPage);

  // Summary metrics across ALL orders (unaffected by filters).
  const stats = useMemo(() => {
    let revenue = 0, delivered = 0, cancelled = 0, active = 0;
    for (const o of allOrders) {
      const s = deriveStatus(o);
      if (s === "Cancelled") cancelled++;
      else {
        revenue += o.totals?.total || 0;
        if (s === "Delivered") delivered++;
        else active++;
      }
    }
    return { total: allOrders.length, revenue, delivered, cancelled, active };
  }, [allOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = from ? new Date(from).setHours(0, 0, 0, 0) : null;
    const toTs = to ? new Date(to).setHours(23, 59, 59, 999) : null;

    let list = allOrders.filter((o) => {
      const s = deriveStatus(o);
      if (status !== "All" && s !== status) return false;
      if (payment !== "All Payments" && PAY_FILTER_MAP[paymentStatus(o).tone] !== payment) return false;
      if (fromTs && (o.createdAt || 0) < fromTs) return false;
      if (toTs && (o.createdAt || 0) > toTs) return false;
      if (q) {
        const c = o.customer || {};
        const hit =
          o.id?.toLowerCase().includes(q) ||
          c.fullName?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          o.ownerEmail?.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "oldest": return (a.createdAt || 0) - (b.createdAt || 0);
        case "amount_desc": return (b.totals?.total || 0) - (a.totals?.total || 0);
        case "amount_asc": return (a.totals?.total || 0) - (b.totals?.total || 0);
        default: return (b.createdAt || 0) - (a.createdAt || 0);
      }
    });
    return list;
  }, [allOrders, status, payment, search, sort, from, to]);

  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const resetFilters = () => {
    setStatus("All"); setPayment("All Payments"); setSearch(""); setSort("newest");
    setFrom(""); setTo(""); setPage(1);
  };

  return (
    <section className="min-h-screen bg-[#fbfefb] pb-20 pt-28 lg:pt-36 dark:bg-[#0d0508]">
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}
        <ScrollReveal className="mb-6">
          <span className="inline-block rounded-full border border-[#fe4462] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#fe4462]">
            Admin
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">All Orders</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage, track and update every customer order.</p>
        </ScrollReveal>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.total} tone="text-[#fe4462] bg-[#fe4462]/10" />
          <StatCard icon={FiClock} label="Active" value={stats.active} tone="text-blue-600 bg-blue-500/10" />
          <StatCard icon={FiCheckCircle} label="Delivered" value={stats.delivered} tone="text-green-600 bg-green-500/10" />
          <StatCard icon={FiXCircle} label="Cancelled" value={stats.cancelled} tone="text-red-600 bg-red-500/10" />
          <StatCard icon={FiDollarSign} label="Revenue" value={inr(stats.revenue)} tone="text-amber-600 bg-amber-500/10" />
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          {/* Row 1: search + selects */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search by Order ID, customer name, mobile or email"
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <Select value={payment} onChange={changePayment} options={PAYMENT_FILTERS} />
            <Select value={sort} onChange={changeSort} options={SORTS.map((s) => ({ value: s.key, label: s.label }))} />
          </div>

          {/* Row 2: date range + reset */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              From
              <input type="date" value={from} onChange={(e) => changeFrom(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#fe4462] dark:border-white/15 dark:bg-white/5 dark:text-gray-200" />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              To
              <input type="date" value={to} onChange={(e) => changeTo(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#fe4462] dark:border-white/15 dark:bg-white/5 dark:text-gray-200" />
            </label>
            <button
              onClick={resetFilters}
              className="ml-auto rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-600 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-300"
            >
              Reset filters
            </button>
          </div>

          {/* Row 3: status tabs */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-white/10">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => changeStatus(f)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  status === f
                    ? "bg-[#fe4462] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/10">
            <table className="w-full">
              <tbody>{Array.from({ length: 6 }).map((_, i) => <OrderRowSkeleton key={i} cols={7} />)}</tbody>
            </table>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-5 py-16 text-center dark:border-white/10">
            <FiInbox size={48} className="mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {allOrders.length === 0 ? "No orders placed yet" : "No matching orders"}
            </h3>
            <p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">
              {allOrders.length === 0
                ? "Customer orders will appear here as they come in."
                : "Try adjusting the filters, date range or search."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                    <tr>
                      <Th>Order</Th>
                      <Th>Customer</Th>
                      <Th>Date</Th>
                      <Th className="text-center">Items</Th>
                      <Th className="text-right">Total</Th>
                      <Th>Payment</Th>
                      <Th>Status</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {pageItems.map((o) => (
                        <OrderTableRow
                          key={`${o.ownerEmail}-${o.id}`}
                          order={o}
                          onDetails={() => setDetailsOrder(o)}
                          onStatusChange={(s) => adminSetOrderStatus(o.ownerEmail, o.id, s)}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 lg:hidden">
              {pageItems.map((o) => (
                <OrderMobileCard
                  key={`${o.ownerEmail}-${o.id}`}
                  order={o}
                  onDetails={() => setDetailsOrder(o)}
                  onStatusChange={(s) => adminSetOrderStatus(o.ownerEmail, o.id, s)}
                />
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                page={page}
                perPage={perPage}
                total={total}
                onPageChange={setPage}
                onPerPageChange={changePerPage}
                perPageOptions={[10, 20, 50]}
                label="orders"
              />
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {detailsOrder && (
          <OrderDetailsModal order={detailsOrder} onClose={() => setDetailsOrder(null)} adminMode />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Desktop table row ── */
function OrderTableRow({ order, onDetails, onStatusChange }) {
  const s = deriveStatus(order);
  const pay = paymentStatus(order);
  const c = order.customer || {};
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/60 dark:border-white/5 dark:hover:bg-white/5"
    >
      <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">#{order.id}</td>
      <td className="px-4 py-3.5">
        <p className="font-medium text-gray-800 dark:text-gray-100">{c.fullName || "—"}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{c.phone || order.ownerEmail}</p>
      </td>
      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{fmtDate(order.createdAt)}</td>
      <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-300">{itemCount(order)}</td>
      <td className="px-4 py-3.5 text-right font-bold text-[#fe4462]">{inr(order.totals?.total)}</td>
      <td className={`px-4 py-3.5 font-medium ${PAYMENT_TONE[pay.tone]}`}>{pay.label}</td>
      <td className="px-4 py-3.5"><OrderStatusBadge status={s} size="sm" /></td>
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-2">
          <StatusSelect status={s} onChange={onStatusChange} />
          <button
            onClick={onDetails}
            aria-label="View details"
            className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-300"
          >
            <FiEye size={15} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── Mobile card ── */
function OrderMobileCard({ order, onDetails, onStatusChange }) {
  const s = deriveStatus(order);
  const pay = paymentStatus(order);
  const c = order.customer || {};
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3 dark:border-white/10">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">#{order.id}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{fmtDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={s} size="sm" />
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <Line label="Customer" value={c.fullName || "—"} />
        <Line label="Phone" value={c.phone || "—"} />
        <Line label="Email" value={order.ownerEmail} />
        <Line label="Items" value={itemCount(order)} />
        <Line label="Payment" value={pay.label} valueClass={PAYMENT_TONE[pay.tone]} />
        <Line label="Total" value={inr(order.totals?.total)} valueClass="text-[#fe4462] font-bold" />
        {order.cancellation?.reason && (
          <Line label="Cancel reason" value={order.cancellation.reason} valueClass="text-red-500" />
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
        <StatusSelect status={s} onChange={onStatusChange} full />
        <button
          onClick={onDetails}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-200"
        >
          <FiEye size={15} /> View
        </button>
      </div>
    </motion.div>
  );
}

/* ── Status change dropdown ── */
function StatusSelect({ status, onChange, full }) {
  const cancelled = status === "Cancelled";
  return (
    <div className={`relative ${full ? "flex-1" : ""}`}>
      <select
        value={cancelled ? "Cancelled" : status}
        disabled={cancelled}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Change order status"
        className={`w-full appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs font-semibold outline-none transition ${
          cancelled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-white/5"
            : "border-gray-200 bg-white text-gray-700 hover:border-[#fe4462] focus:border-[#fe4462] dark:border-white/15 dark:bg-white/5 dark:text-gray-200"
        }`}
      >
        {cancelled ? (
          <option value="Cancelled">Cancelled</option>
        ) : (
          ORDER_STATUS_FLOW.map((st) => <option key={st} value={st}>{st}</option>)
        )}
      </select>
      <FiChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <span className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
        <Icon size={18} />
      </span>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}

function Select({ value, onChange, options }) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-gray-200 lg:w-auto"
      >
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <FiChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function Line({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`truncate font-medium text-gray-800 dark:text-gray-100 ${valueClass}`}>{value}</span>
    </div>
  );
}
