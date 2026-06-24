import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useModalA11y } from "../../hooks/useHooks";
import Product3DViewerModal from "./Product3DViewerModal";

// Lazy 3D - Home page stays light until a shopper opens the 3D view.
const Product3DCanvas = lazy(() => import("./Product3DCanvas"));

const MODEL_PATH = "/Modal/mohan-model.glb";


function InlineCanvasSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-[#fe4462]/30 border-t-[#fe4462] animate-spin" />
      <p className="text-xs font-medium text-gray-400">Loading 3D model…</p>
    </div>
  );
}

export default function ProductQuickViewModal({ product = {}, onClose }) {
  const { addToCart, toggleWishlist, isWishlisted, addRecentlyViewed } = useApp();
  const dialogRef = useModalA11y(onClose);
  const controlsRef = useRef(null);

  // Record this product in the user's recently-viewed history.
  useEffect(() => {
    addRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const gallery = product.gallery?.length ? product.gallery : [product.image].filter(Boolean);
  const [mediaTab, setMediaTab] = useState("images"); // 'images' | '3d'
  const [activeImg, setActiveImg] = useState(gallery[0]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qty, setQty] = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);

  const wished = isWishlisted(product.id);
  const reviewCount = 60 + ((product.id || 1) * 23) % 200;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const zoom = (dir) => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.z =
      dir === "in" ? Math.max(cam.position.z - 4, 5) : Math.min(cam.position.z + 4, 100);
    controlsRef.current.update();
  };
  const resetView = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.set(0, 2, 40);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qv-title"
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto lg:overflow-hidden rounded-3xl bg-white/95 dark:bg-[#140a0d]/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 outline-none grid grid-cols-1 lg:grid-cols-2"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur text-gray-700 dark:text-white flex items-center justify-center hover:bg-[#fe4462] hover:text-white transition shadow-md"
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        {/* ── LEFT: media ─────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#ffe7ec] to-[#f7e3e6] dark:from-[#1f1015] dark:to-[#140a0d] p-5 sm:p-7 flex flex-col lg:sticky lg:top-0">
          {/* Toggle: View Images / View in 3D */}
          <div
            className="inline-flex self-start gap-1 p-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur shadow-sm mb-4"
            role="group"
            aria-label="Choose media view"
          >
            <button
              onClick={() => setMediaTab("images")}
              aria-pressed={mediaTab === "images"}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                mediaTab === "images"
                  ? "bg-[#fe4462] text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:text-[#fe4462]"
              }`}
            >
              <ImageIcon size={14} /> View Images
            </button>
            <button
              onClick={() => setMediaTab("3d")}
              aria-pressed={mediaTab === "3d"}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                mediaTab === "3d"
                  ? "bg-[#fe4462] text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:text-[#fe4462]"
              }`}
            >
              <Box size={14} /> View in 3D
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] rounded-2xl bg-white/60 dark:bg-white/5 overflow-hidden flex items-center justify-center shadow-inner">
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-20 bg-[#fe4462] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{discount}%
              </span>
            )}

            <AnimatePresence mode="wait">
              {mediaTab === "images" ? (
                <motion.div
                  key="images"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center p-6"
                >
                  {!imgLoaded && <div className="absolute inset-8 skeleton rounded-2xl" />}
                  <motion.img
                    key={activeImg}
                    src={activeImg}
                    alt={product.name}
                    onLoad={() => setImgLoaded(true)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: imgLoaded ? 1 : 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[340px] w-auto object-contain drop-shadow-xl"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  {/* While the Big-Screen viewer is open, unmount the inline
                      canvas so only one WebGL context is live; it remounts
                      fresh (and renders correctly) the moment you return. */}
                  {viewerOpen ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                      Viewing in full screen…
                    </div>
                  ) : (
                    <Suspense fallback={<InlineCanvasSkeleton />}>
                      <Product3DCanvas modelPath={MODEL_PATH} controlsRef={controlsRef} />
                    </Suspense>
                  )}

                  {/* inline controls */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-white/80 dark:bg-white/10 backdrop-blur px-2 py-1.5 rounded-full shadow">
                    <button
                      onClick={() => zoom("in")}
                      aria-label="Zoom in"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => zoom("out")}
                      aria-label="Zoom out"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={resetView}
                      aria-label="Reset view"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => setViewerOpen(true)}
                      aria-label="Open immersive fullscreen 3D viewer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thumbnails (images mode) */}
          {mediaTab === "images" && gallery.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImg(img)}
                  onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden bg-white/70 dark:bg-white/10 border-2 transition ${
                    activeImg === img ? "border-[#fe4462] scale-105" : "border-transparent hover:border-[#fe4462]/50"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}

          {/* Prominent CTA to launch immersive 3D */}
          <button
            onClick={() => {
              setMediaTab("3d");
              setViewerOpen(true);
            }}
            className="mt-4 inline-flex items-center justify-center gap-2 self-start bg-[#fe4462] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-[#fe4462]/30 hover:bg-[#d93550] transition"
          >
            <Box size={16} /> View in 3D
          </button>
        </div>

        {/* ── RIGHT: details ──────────────────────── */}
        <div className="lg:max-h-[92vh] lg:overflow-y-auto p-6 sm:p-8 lg:p-10">
          {product.category && (
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#fe4462] bg-[#fe4462]/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}

          <h2
            id="qv-title"
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-4 leading-tight"
          >
            {product.name}
          </h2>

          {/* rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-[#ff9500]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating || 0) ? "fill-current" : "text-gray-300 dark:text-white/20"}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{product.rating}</span>
            <span className="text-sm text-gray-400">({reviewCount} reviews)</span>
          </div>

          {/* price */}
          <div className="flex items-end gap-3 mt-5">
            <span className="text-3xl font-bold text-[#fe4462]">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through mb-1">₹{product.oldPrice}</span>
            )}
            {discount > 0 && (
              <span className="mb-1.5 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-500/15 px-2.5 py-1 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>

          {/* description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-5 text-sm">
            A meticulously handcrafted miniature, individually sculpted and hand-painted by our
            artisans - finished to museum-grade detail and ready to be the centrepiece of any
            collection.
          </p>

          {/* stock */}
          <div className="inline-flex items-center gap-2 text-sm font-medium text-green-600 mt-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            In Stock
          </div>

          {/* quantity */}
          <div className="flex items-center gap-4 mt-5">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Quantity</span>
            <div className="inline-flex items-center rounded-xl border border-gray-200 dark:border-white/15 overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#fe4462]/10 hover:text-[#fe4462] transition disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold dark:text-white" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                disabled={qty >= 10}
                className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#fe4462]/10 hover:text-[#fe4462] transition disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addToCart(product, qty)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#fe4462] text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-[#fe4462]/30 hover:bg-[#d93550] transition"
            >
              <ShoppingBag size={18} /> Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleWishlist(product)}
              className="flex items-center justify-center gap-2 border-2 border-[#fe4462] text-[#fe4462] font-semibold px-5 py-3.5 rounded-2xl hover:bg-[#fe4462] hover:text-white transition"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} className={wished ? "fill-current" : ""} />
              <span className="sm:hidden lg:inline">{wished ? "Saved" : "Wishlist"}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Immersive fullscreen 3D viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <Product3DViewerModal
            product={product}
            modelPath={MODEL_PATH}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
