import { createPortal } from "react-dom";

/**
 * Renders modal/overlay content into <body> via a portal.
 *
 * Why: a `position: fixed` overlay is normally positioned against the viewport,
 * but if ANY ancestor establishes a containing block (a CSS `transform`,
 * `filter`, `perspective`, `contain`, `will-change`, etc. — Framer Motion adds
 * transforms during animations, and the app wraps each page in an animated
 * `motion.div`), the overlay would instead resolve against that ancestor and
 * could be clipped or shifted out of the viewport. Portaling to <body> escapes
 * every such ancestor, guaranteeing overlays always cover the true viewport and
 * stay correctly positioned at any zoom level or scroll position.
 *
 * Rendering happens client-side only (Vite SPA), so `document.body` is always
 * available. React portals preserve event bubbling through the React tree, so
 * click-outside, Escape handling, focus and animations keep working unchanged.
 */
export default function ModalPortal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
