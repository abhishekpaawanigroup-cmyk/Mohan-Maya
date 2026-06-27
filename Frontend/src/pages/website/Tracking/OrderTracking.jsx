import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiCheck, FiPackage, FiTruck, FiHome, FiClipboard, FiMapPin } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import { useApp } from "../../../context/AppContext";
import { ORDER_STEPS } from "../../../data/shop";
import { usePageMeta } from "../../../hooks/useHooks";

const STEP_ICONS = [FiClipboard, FiPackage, FiTruck, FiMapPin, FiHome];
const STEP_MS = 1000 * 60 * 30; // advance one step every 30 minutes (demo pacing)

function currentStep(order) {
  const elapsed = Date.now() - (order.createdAt || Date.now());
  return Math.min(ORDER_STEPS.length - 1, Math.floor(elapsed / STEP_MS));
}

export default function OrderTracking() {
  usePageMeta("Track Your Order - Mohan Maya", "Track the status of your Mohan Maya order in real time.");
  const { getOrder, orders } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  // Initialise straight from the URL so ?order= (e.g. right after checkout)
  // resolves on first render - no effect / cascading render needed.
  const initialId = searchParams.get("order") || "";
  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState(() => (initialId ? getOrder(initialId) : null));
  const [searched, setSearched] = useState(Boolean(initialId));

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

  const step = order ? currentStep(order) : -1;

  return (
    <section className="pt-28 pb-20 bg-[#fbfefb] dark:bg-[#0d0508] min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <ScrollReveal className="text-center mb-10">
          <span className="inline-block text-[#fe4462] border border-[#fe4462] px-4 py-2 text-sm font-bold uppercase rounded-full">
            Track Order
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#fe4462] mt-4">Where's my order?</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3">Enter your order ID to see the latest status.</p>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal>
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
          {orders.length > 0 && (
            <button
              onClick={() => { setQuery(orders[0].id); setSearchParams({ order: orders[0].id }, { replace: true }); runSearch(orders[0].id); }}
              className="text-sm text-[#fe4462] font-medium mt-3 hover:underline"
            >
              Use my latest order ({orders[0].id})
            </button>
          )}
        </ScrollReveal>

        {/* Result */}
        {searched && !order && (
          <ScrollReveal className="mt-10">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/10">
              <FiSearch size={44} className="text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-bold dark:text-white">Order not found</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Double-check the ID. Orders you place on this device appear here automatically.
              </p>
            </div>
          </ScrollReveal>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 space-y-6"
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
                      {/* connector */}
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

            {/* Items + total */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="font-bold dark:text-white mb-4">Items</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#fbfefb] dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#fe4462]">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t dark:border-white/10 font-bold dark:text-white">
                <span>Total Paid</span>
                <span className="text-[#fe4462]">₹{order.totals?.total}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
