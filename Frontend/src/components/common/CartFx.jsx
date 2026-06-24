import { createPortal } from "react-dom";
import { motion } from "framer-motion";

/**
 * Minimal "add to cart" micro-interaction. Instead of flying a large product
 * image across the screen, we render a small mini-thumbnail that originates
 * just below the cart icon and rises a short distance straight into it while
 * shrinking and fading. It's deliberately local to the cart — fast (~0.5s),
 * subtle and premium. On arrival it calls onDone, which commits the cart
 * update, bounces the icon and shows the success tick.
 *
 * Rendered in a body portal so it floats above all UI and is positioned from
 * the live cart-icon rect captured at click time.
 */
const SIZE = 30; // mini-thumbnail diameter (px)
const RISE = 44; // how far below the cart it starts (px)

export default function CartFx({ flyers, onDone }) {
  if (typeof document === "undefined" || flyers.length === 0) return null;

  return createPortal(
    <>
      {flyers.map((f) => {
        const cx = f.to.left + f.to.width / 2 - SIZE / 2;
        const cy = f.to.top + f.to.height / 2 - SIZE / 2;
        const startX = cx + 4; // tiny horizontal drift for a natural feel
        const startY = cy + RISE;

        return (
          <motion.img
            key={f.id}
            src={f.image}
            alt=""
            aria-hidden="true"
            initial={{ x: startX, y: startY, scale: 1, opacity: 0 }}
            animate={{
              x: [startX, cx],
              y: [startY, cy],
              scale: [1, 0.35],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              opacity: { times: [0, 0.15, 0.7, 1] },
            }}
            onAnimationComplete={() => onDone(f)}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: SIZE,
              height: SIZE,
              objectFit: "cover",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 4px 12px rgba(254,68,98,0.35)",
              outline: "2px solid #fe4462",
              pointerEvents: "none",
              zIndex: 9999,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </>,
    document.body
  );
}
