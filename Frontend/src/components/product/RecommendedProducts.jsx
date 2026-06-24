import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import ProductCard from "../common/ProductCard";
import ScrollReveal from "../common/ScrollReveal";
import { products } from "../../data/products";
import { useApp } from "../../context/AppContext";

// Same Quick View popup used by the Shop page. Lazy so the heavy 3D bundle only
// loads when a user actually opens a product.
const ProductModal = lazy(() => import("../../pages/website/Shop/ProductModal"));

/**
 * "You May Also Like" - recommends products by category, falling back to
 * top-rated items. Basis = an explicit `product`, else the most recently
 * viewed item, else nothing-specific (top rated overall).
 */
export default function RecommendedProducts({
  product = null,
  title = "You May Also Like",
  count = 4,
  onQuickView,
  className = "",
}) {
  const { recentlyViewed } = useApp();
  // Self-contained Quick View: use the caller's handler if given, else open the
  // shared ProductModal ourselves so the feature works in any section.
  const [quickView, setQuickView] = useState(null);
  const handleQuickView = onQuickView || setQuickView;
  const basis = product || recentlyViewed[0] || null;

  let recs = basis
    ? products.filter((p) => p.category === basis.category && p.id !== basis.id)
    : [];

  if (recs.length < count) {
    const have = new Set([basis?.id, ...recs.map((r) => r.id)]);
    const extra = [...products]
      .sort((a, b) => b.rating - a.rating)
      .filter((p) => !have.has(p.id));
    recs = [...recs, ...extra];
  }
  recs = recs.slice(0, count);

  if (!recs.length) return null;

  return (
    <section className={`py-16 bg-[#f4edee] dark:bg-[#0d0508] ${className}`}>
      <div className="max-w-7xl mx-auto px-5">
        <ScrollReveal className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#fe4462]">{title}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recs.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.05}>
              <ProductCard product={p} onQuickView={handleQuickView} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Quick View popup (only when this section manages it itself) */}
      {!onQuickView && (
        <Suspense fallback={null}>
          <AnimatePresence>
            {quickView && (
              <ProductModal product={quickView} onClose={() => setQuickView(null)} />
            )}
          </AnimatePresence>
        </Suspense>
      )}
    </section>
  );
}
