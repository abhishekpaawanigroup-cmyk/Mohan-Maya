import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { LuShoppingBag } from "react-icons/lu";
import { FiCheck } from "react-icons/fi";

const CIRCLE = 144; // confirmation circle diameter (px)

// Sample a quadratic Bézier (p0 → p2, bowing through control p1) at given t's.
function sampleBezier(p0, p1, p2, ts) {
  return ts.map((t) => {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  });
}

/**
 * Premium add-to-cart confirmation. A circular badge (cart icon + check +
 * "Added to Cart") scales/fades in at screen centre, holds briefly (~0.4s),
 * then flies along a natural curved path into the header cart icon — shrinking,
 * rotating and fading out just before it lands. On completion `onDone` commits
 * the cart update and bounces the icon.
 *
 * Only one ever runs at a time (guarded in AppContext). Rendered in a body
 * portal; every animated property is transform/opacity, so it stays on the GPU
 * compositor at 60fps.
 */
export default function CartFx({ flyers, onDone }) {
  if (typeof document === "undefined" || flyers.length === 0) return null;

  return createPortal(
    <>
      {flyers.map((f) => {
        const startX = window.innerWidth / 2 - CIRCLE / 2;
        const startY = window.innerHeight / 2 - CIRCLE / 2;
        const endX = f.to.left + f.to.width / 2 - CIRCLE / 2;
        const endY = f.to.top + f.to.height / 2 - CIRCLE / 2;

        // Control point lifts the arc upward for a graceful, gravity-like curve.
        const ctrl = {
          x: startX + (endX - startX) * 0.65,
          y: Math.min(startY, endY) - 140,
        };
        const pts = sampleBezier(
          { x: startX, y: startY },
          ctrl,
          { x: endX, y: endY },
          [0, 0.33, 0.6, 0.85, 1]
        );

        // Unified timeline: pop-in → hold at centre → curved flight out. Position
        // holds at centre for the first 4 stops, then follows the Bézier points.
        const xs = [startX, startX, startX, ...pts.map((p) => p.x)];
        const ys = [startY, startY, startY, ...pts.map((p) => p.y)];
        const times = [0, 0.1, 0.2, 0.38, 0.55, 0.72, 0.88, 1];

        return (
          <motion.div
            key={f.id}
            aria-hidden="true"
            initial={{ x: startX, y: startY, scale: 0.3, opacity: 0, rotate: 0 }}
            animate={{
              x: xs,
              y: ys,
              scale: [0.3, 1.08, 1, 1, 0.82, 0.55, 0.36, 0.22],
              opacity: [0, 1, 1, 1, 1, 0.85, 0.35, 0],
              rotate: [0, 0, 0, 0, 8, 16, 23, 28],
            }}
            transition={{ duration: 1.1, times, ease: [0.45, 0, 0.55, 1] }}
            onAnimationComplete={() => onDone(f)}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: CIRCLE,
              height: CIRCLE,
              borderRadius: "9999px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              color: "#fff",
              background: "linear-gradient(135deg, #fe4462, #d93550)",
              boxShadow:
                "0 18px 50px -12px rgba(254,68,98,0.6), 0 0 0 6px rgba(254,68,98,0.12)",
              pointerEvents: "none",
              zIndex: 9999,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          >
            <span style={{ position: "relative", display: "grid", placeItems: "center" }}>
              <LuShoppingBag size={40} strokeWidth={1.8} />
              <span
                style={{
                  position: "absolute",
                  right: -8,
                  bottom: -6,
                  width: 22,
                  height: 22,
                  borderRadius: "9999px",
                  background: "#10b981",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                }}
              >
                <FiCheck size={14} strokeWidth={3} />
              </span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>
              Added to Cart
            </span>
          </motion.div>
        );
      })}
    </>,
    document.body
  );
}
