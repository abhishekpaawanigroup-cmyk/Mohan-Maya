import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";

/**
 * Wishlist heart icon with a consistent toggle animation used site-wide:
 *   • default → outline heart, transparent fill (white outline by default so it
 *     reads cleanly over product imagery)
 *   • active  → fully filled red heart
 * Keyed by `active`, so each toggle re-mounts and "pops" via a spring.
 *
 * Purely presentational -the wrapping button owns the click + wishlist state.
 * Pass `outlineClassName` to recolour the default outline on light surfaces
 * (e.g. product detail pages) where pure white would be invisible.
 */
export default function HeartIcon({ active, size = 18, outlineClassName = "text-white" }) {
  return (
    <motion.span
      key={active ? "on" : "off"}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 600, damping: 14 }}
      className="grid place-items-center"
    >
      {active ? (
        <FaHeart size={size} className="text-[#fe4462]" />
      ) : (
        <FiHeart size={size} strokeWidth={2.2} className={outlineClassName} />
      )}
    </motion.span>
  );
}
