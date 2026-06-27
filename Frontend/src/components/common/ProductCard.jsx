import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingBag, FiStar } from "react-icons/fi";
import { useApp } from "../../context/AppContext";

/**
 * Reusable product card used by the Shop grid. Connected to the global
 * cart / wishlist so actions persist and fire toast notifications.
 */
export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [imgLoaded, setImgLoaded] = useState(false);
  const wished = isWishlisted(product.id);

  // When a card remounts during pagination, an already-cached image is
  // complete the moment the node mounts. Catch that synchronously (the ref
  // callback runs at commit, before paint) so the skeleton never flashes.
  const imgRef = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) setImgLoaded(true);
  }, []);
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <motion.div
      data-fly-card
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden pt-6 pb-2 bg-[#f0e0e3] dark:bg-white/5">
        {!imgLoaded && <div className="absolute inset-6 skeleton rounded-full" />}
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`h-44 w-44 sm:h-[200px] sm:w-[200px] max-w-full mx-auto rounded-full object-contain transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#fe4462] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product)}
            className="bg-white dark:bg-[#1a0a0e] p-2.5 rounded-full shadow-md hover:scale-110 transition"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart
              size={18}
              className={`transition ${wished ? "fill-[#fe4462] text-[#fe4462]" : "text-gray-500"}`}
            />
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white dark:bg-[#1a0a0e] p-2.5 rounded-full shadow-md hover:scale-110 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Quick view"
            >
              <FiEye size={18} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mt-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-2 text-[#ff7f50]">
          <FiStar size={14} className="fill-current" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-[#fe4462]">₹{product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
          )}
        </div>

        <button
          onClick={(e) => addToCart(product, 1, e)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-[#fe4462] hover:bg-[#d93550] text-white py-2.5 rounded-xl font-medium transition-colors"
        >
          <FiShoppingBag size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
