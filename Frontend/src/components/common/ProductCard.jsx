import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiEye, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import HeartIcon from "./HeartIcon";
import ExpectedDelivery from "./ExpectedDelivery";
import { useApp } from "../../context/AppContext";

/** Renders 5 stars (full / half / empty) from a numeric rating. */
function StarRating({ value = 0, size = 13 }) {
  return (
    <span className="flex items-center gap-0.5 text-[#ff7f50]" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (value >= i + 1) return <FaStar key={i} size={size} />;
        if (value >= i + 0.5) return <FaStarHalfAlt key={i} size={size} />;
        return <FaRegStar key={i} size={size} />;
      })}
    </span>
  );
}

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
  const rating = Number(product.rating) || 0;

  return (
    <motion.div
      data-fly-card
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      {/* Image — clicking the image area opens the same Quick View modal as the eye icon */}
      <div
        className={`relative overflow-hidden pt-4 pb-2 bg-[#e5e5e5] dark:bg-white/5 ${onQuickView ? "cursor-pointer" : ""}`}
        onClick={onQuickView ? () => onQuickView(product) : undefined}
        role={onQuickView ? "button" : undefined}
        aria-label={onQuickView ? `Quick view ${product.name}` : undefined}
      >
        {!imgLoaded && <div className="absolute inset-5 skeleton rounded-full" />}
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`h-36 w-36 sm:h-44 sm:w-44 max-w-full mx-auto rounded-full object-contain transition-all duration-500 group-hover:scale-105 ${
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
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            aria-pressed={wished}
            className="grid h-9 w-9 place-items-center rounded-full bg-black/25 backdrop-blur-sm shadow-md transition-all duration-300 hover:bg-black/40 hover:scale-110 active:scale-95"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon active={wished} size={18} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              className="bg-white dark:bg-[#1a0a0e] p-2.5 rounded-full shadow-md hover:scale-110 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Quick view"
            >
              <FiEye size={18} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3.5 flex flex-col flex-1">
        <h3 className="text-[15px] font-semibold leading-snug text-gray-800 dark:text-white line-clamp-1">
          {product.name}
        </h3>

        {/* Rating — dynamic stars in their original row below the title */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating value={rating} />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-[#fe4462]">₹{product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
          )}
        </div>

        <ExpectedDelivery compact className="mt-2" />

        <button
          onClick={(e) => addToCart(product, 1, e)}
          className="mt-3.5 w-full flex items-center justify-center gap-2 bg-[#fe4462] hover:bg-[#d93550] text-white py-2.5 rounded-xl font-medium transition-colors"
        >
          <FiShoppingBag size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
