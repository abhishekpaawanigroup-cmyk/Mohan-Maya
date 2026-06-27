import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiTrash2,
  FiShoppingCart,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import PageHero from "../../../components/common/PageHero";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -24, transition: { duration: 0.25 } },
};

export default function Wishlist() {
  usePageMeta(
    "Your Wishlist - Mohan Maya",
    "Keep track of the handcrafted miniatures you love and move them to your cart whenever you're ready."
  );

  const { wishlist, toggleWishlist, addToCart } = useApp();

  // Add to cart (keeps the fly-to-cart animation), then drop from the wishlist.
  const moveToCart = (item, e) => {
    addToCart(item, 1, e);
    toggleWishlist(item);
  };
  const moveAllToCart = () => {
    [...wishlist].forEach((item) => {
      addToCart(item, 1);
      toggleWishlist(item);
    });
  };
  const clearWishlist = () => [...wishlist].forEach((item) => toggleWishlist(item));

  const totalValue = wishlist.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  // ── Empty state ──────────────────────────────────────────
  if (!wishlist.length) {
    return (
      <section className="relative overflow-hidden min-h-screen flex items-center bg-[#f4edee] dark:bg-[#0d0508] pt-28 pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#fe4462]/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full bg-[#c48212]/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md mx-auto text-center px-6"
        >
          <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">
            <FiHeart size={40} className="text-[#fe4462]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Your wishlist is empty
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">
            Your wishlist is waiting for your favorite items. Browse the collection
            and tap the heart on any piece to save it here.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fe4462] px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#d93550] hover:shadow-[0_0_28px_rgba(254,68,98,0.45)] active:scale-95"
          >
            Continue Shopping
            <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      {/* ── Hero (matches the Cart page hero) ── */}
      <PageHero
        title="Your Wishlist"
        subtitle="Keep track of the handcrafted pieces you love. Move them to your cart whenever you're ready to make them yours."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />

      {/* ── Wishlist body ── */}
      <section className="bg-[#f4edee] dark:bg-[#0d0508] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Items list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Saved Items <span className="text-gray-400 font-medium">({wishlist.length})</span>
                </h2>
                <button
                  onClick={clearWishlist}
                  className="text-sm font-medium text-gray-500 hover:text-[#fe4462] transition-colors"
                >
                  Clear wishlist
                </button>
              </div>

              <motion.ul layout className="space-y-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {wishlist.map((item) => (
                    <WishlistItem
                      key={item.id}
                      item={item}
                      onMoveToCart={moveToCart}
                      onRemove={toggleWishlist}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>

              {/* Continue shopping (under the list) */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#fe4462] transition-colors"
              >
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>

            {/* Wishlist summary */}
            <ScrollReveal direction="left" className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Wishlist Summary</h2>

                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                    <span>Saved items</span>
                    <span className="font-semibold dark:text-white">{wishlist.length}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200/70 pt-3 dark:border-white/10">
                    <span className="text-base font-bold text-gray-900 dark:text-white">Total Value</span>
                    <span className="text-xl font-bold text-[#fe4462]">₹{totalValue}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Saved on this device · prices may change over time.
                  </p>
                </div>

                <button
                  onClick={moveAllToCart}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#fe4462] px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#d93550] hover:shadow-[0_0_28px_rgba(254,68,98,0.45)] active:scale-95"
                >
                  <FiShoppingCart size={16} /> Move All to Cart
                </button>
                <Link
                  to="/shop"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors duration-300 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/20 dark:text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

/** A single saved item with a graceful image-loading state and row actions. */
function WishlistItem({ item, onMoveToCart, onRemove }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  // Catch already-cached images synchronously so the skeleton never flashes.
  const imgRef = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) setImgLoaded(true);
  }, []);

  const stock =
    item.badge === "Limited"
      ? { label: "Few left", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" }
      : { label: "In Stock", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" };

  return (
    <motion.li
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
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f0e0e3] dark:bg-white/10 grid place-items-center"
      >
        {!imgLoaded && <span className="absolute inset-3 skeleton rounded-lg" />}
        <img
          ref={imgRef}
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-contain p-2 transition-all duration-500 hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>

      {/* Details + actions */}
      <div className="flex flex-1 flex-col gap-3 min-w-0 sm:flex-row sm:items-center">
        <div className="flex-1 min-w-0">
          {item.category && (
            <p className="text-[11px] uppercase tracking-wide text-gray-400">{item.category}</p>
          )}
          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
            {item.name}
          </h3>
          <p className="mt-0.5 text-base font-bold text-[#fe4462]">₹{item.price}</p>
          <span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-medium ${stock.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
            {stock.label}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
          <button
            onClick={(e) => onMoveToCart(item, e)}
            className="inline-flex items-center gap-2 rounded-full bg-[#fe4462] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#d93550] hover:shadow-[0_0_22px_rgba(254,68,98,0.4)] active:scale-95"
          >
            <FiShoppingCart size={15} /> Move to Cart
          </button>
          <button
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item.name} from wishlist`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
          >
            <FiTrash2 size={17} />
          </button>
        </div>
      </div>
    </motion.li>
  );
}
