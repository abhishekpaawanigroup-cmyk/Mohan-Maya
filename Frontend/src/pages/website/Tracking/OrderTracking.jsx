import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiPackage, FiCalendar, FiCreditCard, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";
import OrderTimeline from "../../../components/orders/OrderTimeline";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import {
  deriveStatus, paymentLabel, paymentStatus, PAYMENT_TONE,
  itemCount, deliveryEstimate, fmtDate, inr,
} from "../../../utils/orders";

export default function OrderTracking() {
  usePageMeta("Track Order - Mohan Maya", "Track any Mohan Maya order in real time by its order ID.");
  const { getOrder } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  // Initialise straight from the URL so ?order= (e.g. right after checkout)
  // resolves on first render - no effect / cascading render needed.
  const initialId = searchParams.get("order") || "";
  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState(() => (initialId ? getOrder(initialId) : null));
  const [searched, setSearched] = useState(Boolean(initialId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ order: query.trim() }, { replace: true });
    setOrder(getOrder(query));
    setSearched(true);
  };

  return (
    <section className="min-h-screen bg-[#fbfefb] pb-20 pt-28 lg:pt-36 dark:bg-[#0d0508]">
      <div className="mx-auto max-w-3xl px-5">
        <ScrollReveal className="mb-10 text-center">
          <span className="inline-block rounded-full border border-[#fe4462] px-4 py-2 text-sm font-bold uppercase text-[#fe4462]">
            Track Order
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#fe4462] md:text-4xl">Track Your Order</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Enter your order ID to see its live status - or view all your orders in one place.
          </p>
        </ScrollReveal>

        {/* Track by ID */}
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. MM1A2B3C"
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 uppercase outline-none placeholder:normal-case focus:border-[#fe4462] dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <button type="submit" className="btn-primary justify-center">Track</button>
          </form>
          <div className="mt-3 text-center sm:text-left">
            <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#fe4462] hover:underline">
              View all my orders <FiArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        {/* Not-found result */}
        {searched && !order && (
          <ScrollReveal className="mt-10">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
              <FiSearch size={44} className="mx-auto mb-3 text-gray-300" />
              <h2 className="text-lg font-bold dark:text-white">Order not found</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Double-check the ID. You can also find all your orders on the{" "}
                <Link to="/orders" className="font-semibold text-[#fe4462] hover:underline">My Orders</Link> page.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Tracking detail */}
        {order && <TrackedOrder key={order.id} order={order} />}
      </div>
    </section>
  );
}

function TrackedOrder({ order }) {
  const status = deriveStatus(order);
  const pay = paymentStatus(order);
  const count = itemCount(order);
  const { minDate, maxDate, rangeLabel } = deliveryEstimate(order);
  const cancelled = status === "Cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-10 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Order ID</p>
          <p className="text-lg font-bold dark:text-white">#{order.id}</p>
        </div>
        <OrderStatusBadge status={status} size="lg" />
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Fact icon={FiPackage} label="Items" value={`${count}`} />
        <Fact icon={FiCreditCard} label={paymentLabel(order)} value={pay.label} tone={PAYMENT_TONE[pay.tone]} />
        <Fact
          icon={FiCalendar}
          label={cancelled ? "Delivery" : "Est. delivery"}
          value={cancelled ? "—" : minDate.getTime() === maxDate.getTime() ? fmtDate(maxDate) : rangeLabel}
        />
        <Fact icon={FiPackage} label="Total" value={inr(order.totals?.total)} tone="text-[#fe4462] font-bold" />
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <OrderTimeline order={order} />
      </div>
    </motion.div>
  );
}

function Fact({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-white/5">
      <Icon size={15} className="mb-1.5 text-gray-400" />
      <p className="truncate text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`truncate text-sm font-semibold text-gray-800 dark:text-gray-100 ${tone || ""}`}>{value}</p>
    </div>
  );
}
