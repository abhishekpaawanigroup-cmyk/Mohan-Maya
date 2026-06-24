import { motion, useScroll } from "framer-motion";

/**
 * Thin gradient bar pinned to the top that fills as the user scrolls.
 * Drives `scaleX` with a framer-motion MotionValue so the bar updates on the
 * compositor without triggering a React re-render on every scroll frame.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[1001] origin-left bg-gradient-to-r from-[#fe4462] to-[#ff8d6b]"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
