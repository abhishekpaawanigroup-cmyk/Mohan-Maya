import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  RotateCcw,
  X,
  Maximize2,
  Minimize2,
  Move3d,
} from "lucide-react";
import { useModalA11y } from "../../hooks/useHooks";

// Lazy so the heavy three.js bundle only downloads when 3D is opened.
const Product3DCanvas = lazy(() => import("./Product3DCanvas"));

function CanvasSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-[#fe4462]/30 border-t-[#fe4462] animate-spin" />
      <p className="text-sm font-medium text-gray-400">Preparing 3D viewer…</p>
    </div>
  );
}

/**
 * Immersive, fullscreen-capable 3D product viewer.
 * Props: product, modelPath, onClose.
 */
export default function Product3DViewerModal({ product = {}, modelPath, onClose }) {
  const dialogRef = useModalA11y(onClose);
  const stageRef = useRef(null);
  const controlsRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep local state in sync with the browser fullscreen status.
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const zoom = (dir) => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.z =
      dir === "in"
        ? Math.max(cam.position.z - 4, 5)
        : Math.min(cam.position.z + 4, 100);
    controlsRef.current.update();
  };

  const resetView = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.set(0, 2, 40);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await stageRef.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch {
      /* fullscreen denied - keep windowed */
    }
  };

  // Exit native fullscreen first (if active), then close the viewer so the user
  // always returns to the page underneath.
  const handleClose = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen?.();
    } catch {
      /* ignore - close regardless */
    }
    onClose();
  };

  const ctrlBtn =
    "w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-[#fe4462] hover:text-white transition";

  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Stop the click bubbling to a parent Quick View backdrop.
        e.stopPropagation();
        handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`3D viewer for ${product.name || "product"}`}
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-5xl h-[80vh] rounded-3xl overflow-hidden ring-1 ring-white/15 outline-none bg-gradient-to-br from-[#1b1016] to-[#0d0508] shadow-2xl"
      >
        {/* Header */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <Move3d size={18} className="text-[#fe4462]" />
            <span className="font-semibold text-sm sm:text-base">{product.name || "3D Preview"}</span>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-[#fe4462] transition"
            aria-label="Close 3D viewer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stage (this element goes fullscreen) */}
        <div ref={stageRef} className="absolute inset-0 bg-gradient-to-br from-[#1b1016] to-[#0d0508]">
          <Suspense fallback={<CanvasSkeleton />}>
            {/* Larger fill so the model is prominent in the wide Big-Screen canvas. */}
            <Product3DCanvas modelPath={modelPath} controlsRef={controlsRef} fill={1.15} />
          </Suspense>

          {/* Close button rendered INSIDE the stage so it stays visible during
              native fullscreen (where sibling header/controls are not shown). */}
          {isFullscreen && (
            <button
              onClick={handleClose}
              aria-label="Close fullscreen viewer"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[60] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md text-white ring-1 ring-white/25 flex items-center justify-center hover:bg-[#fe4462] hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={22} />
            </button>
          )}

          <p className="absolute bottom-20 inset-x-0 text-center text-xs text-white/40 pointer-events-none">
            Drag to rotate · scroll or pinch to zoom
          </p>
        </div>

        {/* Control bar */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white/10 backdrop-blur-xl px-2 py-1.5 rounded-full ring-1 ring-white/15">
          <button onClick={() => zoom("in")} className={ctrlBtn} aria-label="Zoom in">
            <Plus size={18} />
          </button>
          <button onClick={() => zoom("out")} className={ctrlBtn} aria-label="Zoom out">
            <Minus size={18} />
          </button>
          <button onClick={resetView} className={ctrlBtn} aria-label="Reset view">
            <RotateCcw size={18} />
          </button>
          <span className="w-px h-6 bg-white/15 mx-1" />
          <button
            onClick={toggleFullscreen}
            className={ctrlBtn}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
