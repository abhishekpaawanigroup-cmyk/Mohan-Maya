import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Product3DCanvas from "../../../components/product/Product3DCanvas";
import {
  Plus,
  Minus,
  RotateCcw,
  X,
  ShoppingBag,
  Heart,
  Share2,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Box,
  Ruler,
  Zap,
  Gift,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

/* ── Static spec / feature data (synthesised for the demo) ── */
const SIZES = ["Small", "Medium", "Large"];

const keyFeatures = [
  { icon: Sparkles, label: "Hand-painted finish" },
  { icon: ShieldCheck, label: "Premium resin build" },
  { icon: Gift, label: "Gift-ready packaging" },
  { icon: Zap, label: "Limited edition" },
];

const shipping = [
  { icon: Truck, title: "Free shipping", desc: "On orders over ₹999 · delivered in 5–7 days" },
  { icon: RefreshCw, title: "7-day replacement", desc: "Easy returns on damaged or defective items" },
  { icon: ShieldCheck, title: "Secure checkout", desc: "100% protected payments" },
];

export default function ProductModal({ product = {}, onClose }) {
  const { addToCart, toggleWishlist, isWishlisted, addToast, addRecentlyViewed } = useApp();
  const controlsRef = useRef(null);
  const dialogRef = useRef(null);

  // Record this product in the user's recently-viewed history.
  useEffect(() => {
    addRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const gallery = product.gallery?.length ? product.gallery : [product.image].filter(Boolean);
  const [mediaTab, setMediaTab] = useState("photos"); // 'photos' | '3d'
  const [activeImg, setActiveImg] = useState(gallery[0]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [size, setSize] = useState(SIZES[1]);
  const [qty, setQty] = useState(1);

  const wished = isWishlisted(product.id);
  const reviewCount = 80 + ((product.id || 1) * 17) % 240;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const specs = [
    { icon: Box, label: "Material", value: "Hand-cast resin" },
    { icon: Ruler, label: "Height", value: size === "Small" ? "8 cm" : size === "Large" ? "16 cm" : "12 cm" },
    { icon: Sparkles, label: "Finish", value: "Matte hand-paint" },
    { icon: Gift, label: "SKU", value: `MM-${String(product.id || 0).padStart(4, "0")}` },
  ];

  // Body scroll lock + Escape close + initial focus.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  /* 3D controls */
  const zoomIn = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.z = Math.max(cam.position.z - 3, 5);
    controlsRef.current.update();
  };
  const zoomOut = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.z = Math.min(cam.position.z + 3, 100);
    controlsRef.current.update();
  };
  const resetView = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.set(0, 2, 40);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handleAddToCart = () => addToCart(product, qty);
  const handleBuyNow = () => {
    addToCart(product, qty);
    addToast("Proceeding to checkout…", "info");
    onClose();
  };
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        addToast("Link copied to clipboard", "success");
      } catch {
        addToast("Couldn't copy link", "error");
      }
    }
  };

  const iconBtn =
    "w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-[#fe4462] hover:text-[#fe4462] transition";

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pm-title"
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto lg:overflow-hidden rounded-3xl bg-white/95 dark:bg-[#140a0d]/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 outline-none grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur text-gray-700 dark:text-white flex items-center justify-center hover:bg-[#fe4462] hover:text-white transition shadow-md"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* ── LEFT: media ─────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#ffe7ec] to-[#f7e3e6] dark:from-[#1f1015] dark:to-[#140a0d] p-5 sm:p-8 flex flex-col lg:sticky lg:top-0">
          {/* media tabs */}
          <div className="inline-flex self-start gap-1 p-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur shadow-sm mb-4">
            {[
              { id: "photos", icon: ImageIcon, label: "Photos" },
              { id: "3d", icon: Box, label: "3D View" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMediaTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  mediaTab === t.id
                    ? "bg-[#fe4462] text-white shadow"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#fe4462]"
                }`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {/* stage */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] rounded-2xl bg-white/60 dark:bg-white/5 overflow-hidden flex items-center justify-center shadow-inner">
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-20 bg-[#fe4462] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{discount}%
              </span>
            )}

            <AnimatePresence mode="wait">
              {mediaTab === "photos" ? (
                <motion.div
                  key="photos"
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
                    className="max-h-[360px] w-auto object-contain drop-shadow-xl"
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
                  <Product3DCanvas
                    modelPath="/Modal/mohan-model.glb"
                    controlsRef={controlsRef}
                  />

                  {/* 3D controls */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/80 dark:bg-white/10 backdrop-blur px-2 py-1.5 rounded-full shadow">
                    <button
                      onClick={zoomIn}
                      aria-label="Zoom in"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={zoomOut}
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* thumbnails */}
          {mediaTab === "photos" && gallery.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImg(img)}
                  onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden bg-white/70 dark:bg-white/10 border-2 transition ${
                    activeImg === img
                      ? "border-[#fe4462] scale-105"
                      : "border-transparent hover:border-[#fe4462]/50"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: details ──────────────────────── */}
        
        <div className="lg:max-h-[92vh] lg:overflow-y-auto p-6 sm:p-8 lg:p-10">
          {/* category + actions */}
          <div className="flex items-center justify-between gap-3">
            {product.category && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#fe4462] bg-[#fe4462]/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className={iconBtn}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} className={wished ? "fill-[#fe4462] text-[#fe4462]" : ""} />
              </button>
              <button onClick={handleShare} className={iconBtn} aria-label="Share product">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* title */}
          <h2
            id="pm-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-4 leading-tight"
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
            <span className="text-3xl sm:text-4xl font-bold text-[#fe4462]">₹{product.price}</span>
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
            artisans. Each {product.name} is a one-of-a-kind collectible finished to museum-grade
            detail - a centrepiece worthy of any shelf or gift.
          </p>

          {/* size / variant */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Size</span>
              <span className="text-xs text-gray-400">Size guide</span>
            </div>
            <div className="flex gap-2.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                    size === s
                      ? "border-[#fe4462] bg-[#fe4462] text-white shadow-md shadow-[#fe4462]/30"
                      : "border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#fe4462]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* stock + quantity */}
          <div className="flex items-center justify-between gap-4 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              In Stock
            </div>

            <div className="inline-flex items-center rounded-xl border border-gray-200 dark:border-white/15 overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#fe4462]/10 hover:text-[#fe4462] transition disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold dark:text-white" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#fe4462]/10 hover:text-[#fe4462] transition disabled:opacity-40"
                disabled={qty >= 10}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-white/10 border-2 border-[#fe4462] text-[#fe4462] font-semibold py-3.5 rounded-2xl hover:bg-[#fe4462] hover:text-white transition"
            >
              <ShoppingBag size={18} /> Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 bg-[#fe4462] text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-[#fe4462]/30 hover:bg-[#d93550] transition"
            >
              <Zap size={18} /> Buy Now
            </motion.button>
          </div>

          {/* key features */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {keyFeatures.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2.5"
              >
                <span className="w-8 h-8 rounded-lg bg-[#fe4462]/10 text-[#fe4462] flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</span>
              </div>
            ))}
          </div>

          {/* specifications */}
          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100 mb-3">
              Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 dark:bg-white/10 rounded-2xl overflow-hidden">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white dark:bg-[#140a0d] p-4 flex items-center gap-3">
                  <Icon size={18} className="text-[#fe4462] shrink-0" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* delivery / returns */}
          <div className="mt-8 space-y-3">
            {shipping.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-gray-100 dark:border-white/10 p-4"
              >
                <span className="w-9 h-9 rounded-full bg-[#fe4462]/10 text-[#fe4462] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                    {title} <Check size={14} className="text-green-500" />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
