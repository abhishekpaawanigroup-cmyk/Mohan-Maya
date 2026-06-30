import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLock,
  FiTruck,
} from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import PageHero from "../../../components/common/PageHero";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import { FREE_SHIPPING_THRESHOLD } from "../../../data/shop";

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -24, transition: { duration: 0.25 } },
};

export default function Cart() {
  usePageMeta(
    "Shopping Cart - Mohan Maya",
    "Review the handcrafted miniatures in your cart and proceed to a secure checkout."
  );

  const {
    cart,
    cartCount,
    updateQty,
    removeFromCart,
    clearCart,
    totals,
    coupon,
    couponCode,
    applyCoupon,
    removeCoupon,
    requireAuth,
  } = useApp();
  const navigate = useNavigate();

  // Checkout is a protected action: signed-out users get the auth modal, then
  // continue to checkout once they sign in (no navigation away from the cart).
  const goToCheckout = () => requireAuth(() => navigate("/checkout"));

  // ── Pagination (view-only) ───────────────────────────────
  // Paginates only how cart items are *displayed* - the cart state, totals, GST
  // and checkout all keep operating on the full `cart`.
  const PER_PAGE = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(cart.length / PER_PAGE));
  // If items are removed and the current page no longer exists, step back to
  // the last valid page.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // ── Empty state ──────────────────────────────────────────
  if (!cart.length) {
    return (
      <section className="relative overflow-hidden min-h-screen flex items-center bg-[#fbfefb] dark:bg-[#0d0508] pt-28 pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#fe4462]/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full bg-[#c48212]/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md mx-auto text-center px-6"
        >
          <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">
            <FiShoppingBag size={42} className="text-[#fe4462]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Your cart is empty
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">
            Looks like you haven't added any handcrafted treasures yet. Explore the
            collection and find a piece that speaks to you.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fe4462] px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#d93550] hover:shadow-[0_0_28px_rgba(254,68,98,0.45)] active:scale-95"
          >
            Start Shopping
            <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    );
  }

  // Free-shipping progress nudge.
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  const freeShipPct = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Items shown on the current page (clamp the page in case it's mid-correction).
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageItems = cart.slice(start, start + PER_PAGE);

  return (
    <>
      {/* ── Hero (matches the Contact page hero) ── */}
      <PageHero
        title="Your Shopping Cart"
        subtitle="Review your selected collectibles and miniatures before proceeding to checkout. Manage quantities, update your cart, and complete your purchase with ease."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Cart" }]}
      />

      {/* ── Cart body ── */}
      <section className="bg-[#fbfefb] dark:bg-[#0d0508] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Items list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cart Items <span className="text-gray-400 font-medium">({cartCount})</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm font-medium text-gray-500 hover:text-[#fe4462] transition-colors"
                >
                  Clear cart
                </button>
              </div>

              <motion.ul layout className="space-y-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {pageItems.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      className="flex gap-4 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:ring-white/10"
                    >
                      {/* Image */}
                      <Link
                        to="/shop"
                        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#fbfefb] dark:bg-white/10 grid place-items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-105"
                        />
                      </Link>

                      {/* Details + controls */}
                      <div className="flex flex-1 flex-col gap-3 min-w-0 sm:flex-row sm:items-center">
                        <div className="flex-1 min-w-0">
                          {item.category && (
                            <p className="text-[11px] uppercase tracking-wide text-gray-400">
                              {item.category}
                            </p>
                          )}
                          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            ₹{item.price} <span className="text-xs">each</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                          {/* Quantity selector */}
                          <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/15 overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="grid h-10 w-10 sm:h-9 sm:w-9 place-items-center text-gray-600 dark:text-gray-300 transition-colors hover:text-[#fe4462] disabled:opacity-40"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-9 text-center text-sm font-semibold dark:text-white">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="grid h-10 w-10 sm:h-9 sm:w-9 place-items-center text-gray-600 dark:text-gray-300 transition-colors hover:text-[#fe4462]"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          {/* Line subtotal */}
                          <p className="w-20 text-right text-base font-bold text-[#fe4462]">
                            ₹{item.price * item.qty}
                          </p>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="grid h-10 w-10 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>

              {/* Pagination - only when the cart exceeds one page */}
              {totalPages > 1 && (
                <nav
                  className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
                  aria-label="Cart pages"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                    className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#fe4462] hover:text-[#fe4462] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 dark:border-white/15 dark:text-gray-300 dark:disabled:hover:border-white/15 dark:disabled:hover:text-gray-300"
                  >
                    <FiChevronLeft size={18} />
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        aria-current={safePage === n ? "page" : undefined}
                        aria-label={`Page ${n}`}
                        className={`h-10 min-w-[2.5rem] rounded-full px-3 text-sm font-semibold transition ${
                          safePage === n
                            ? "bg-[#fe4462] text-white shadow-[0_8px_20px_-8px_rgba(254,68,98,0.7)]"
                            : "border border-gray-200 text-gray-600 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-300"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                    className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#fe4462] hover:text-[#fe4462] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 dark:border-white/15 dark:text-gray-300 dark:disabled:hover:border-white/15 dark:disabled:hover:text-gray-300"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </nav>
              )}

              {/* Continue shopping (under the list) */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#fe4462] transition-colors"
              >
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <ScrollReveal direction="left" className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Summary</h2>

                {/* Free-shipping progress */}
                <div className="mt-4 rounded-xl bg-[#fe4462]/5 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <FiTruck className="text-[#fe4462]" size={15} />
                    {remainingForFreeShip > 0 ? (
                      <>Add <strong className="text-[#fe4462]">₹{remainingForFreeShip}</strong> more for free shipping</>
                    ) : (
                      <>You've unlocked <strong className="text-[#fe4462]">free shipping!</strong></>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[#fe4462]"
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShipPct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-5">
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2 dark:bg-green-500/10">
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        {couponCode} -{coupon.label}
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-green-700 hover:text-red-500 dark:text-green-400"
                        aria-label="Remove coupon"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <CouponForm onApply={applyCoupon} />
                  )}
                </div>

                {/* Totals */}
                <div className="mt-5 space-y-2 border-t border-gray-200/70 pt-5 text-sm dark:border-white/10">
                  <Row label="Subtotal" value={`₹${totals.subtotal}`} />
                  {totals.discount > 0 && (
                    <Row label="Discount" value={`−₹${totals.discount}`} accent="text-green-600" />
                  )}
                  <Row
                    label="Shipping"
                    value={totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}
                  />
                  <Row label="GST (18%)" value={`₹${totals.gst}`} />
                  <div className="flex items-center justify-between border-t border-gray-200/70 pt-3 dark:border-white/10">
                    <span className="text-base font-bold text-gray-900 dark:text-white">Grand Total</span>
                    <span className="text-xl font-bold text-[#fe4462]">₹{totals.total}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">GST (18%) included in the total above.</p>
                </div>

                {/* Actions */}
                <button
                  onClick={goToCheckout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#fe4462] px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#d93550] hover:shadow-[0_0_28px_rgba(254,68,98,0.45)] active:scale-95"
                >
                  <FiLock size={16} /> Proceed to Checkout
                </button>
                <Link
                  to="/shop"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors duration-300 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/20 dark:text-white"
                >
                  Continue Shopping
                </Link>

                <p className="mt-4 text-center text-[11px] text-gray-400">
                  Secure checkout · your data is protected
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

/** Summary line. */
function Row({ label, value, accent = "" }) {
  return (
    <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
      <span>{label}</span>
      <span className={accent}>{value}</span>
    </div>
  );
}

/** Coupon input -local state, lifts the code up on apply. */
function CouponForm({ onApply }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const code = e.currentTarget.elements.coupon.value;
        if (onApply(code)) e.currentTarget.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="coupon"
        placeholder="Coupon code"
        className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm uppercase outline-none placeholder:normal-case dark:bg-white/10 dark:text-white"
      />
      <button
        type="submit"
        className="rounded-lg border border-[#fe4462] px-4 py-2 text-sm font-semibold text-[#fe4462] transition-colors hover:bg-[#fe4462] hover:text-white"
      >
        Apply
      </button>
    </form>
  );
}
