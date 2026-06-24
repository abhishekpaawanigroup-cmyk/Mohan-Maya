import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { useScrollThreshold } from "../../hooks/useHooks";

/** Floating button that appears after scrolling and returns to the top. */
export default function BackToTop() {
  // Only re-renders when crossing 500px, not on every scroll frame.
  const visible = useScrollThreshold(500);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[997] w-12 h-12 rounded-full bg-[#fe4462] text-white shadow-lg shadow-[#fe4462]/40 flex items-center justify-center hover:bg-[#d93550] transition-colors"
          aria-label="Back to top"
        >
          <FiArrowUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
