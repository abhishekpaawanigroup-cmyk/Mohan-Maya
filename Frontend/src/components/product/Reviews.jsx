import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiUploadCloud,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiThumbsUp,
  FiCheckCircle,
  FiCamera,
  FiZoomIn,
  FiAlertTriangle,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { useModalA11y } from "../../hooks/useHooks";

/* ── Seed data (mock; replace with API later) ── */
const SEED_REVIEWS = [
  {
    id: "r1",
    name: "Ananya Verma",
    rating: 5,
    title: "Absolutely stunning craftsmanship",
    text: "The detailing on this miniature is incredible - far beyond what I expected. Packaging was premium and delivery was quick. Worth every rupee!",
    date: "2026-05-28",
    verified: true,
    helpful: 24,
    images: ["/Shop/Product1.jpeg", "/Shop/Product2.jpeg"],
  },
  {
    id: "r2",
    name: "Rahul Mehta",
    rating: 4,
    title: "Beautiful piece, slightly small",
    text: "Loved the finish and the hand-painted look. Only wish it was a touch bigger, but the quality is top-notch.",
    date: "2026-05-19",
    verified: true,
    helpful: 11,
    images: ["/Shop/Product3.jpeg"],
  },
  {
    id: "r3",
    name: "Priya Nair",
    rating: 5,
    title: "Perfect gift!",
    text: "Bought this for my brother and he was thrilled. The character looks exactly like the photos. Highly recommend.",
    date: "2026-04-30",
    verified: false,
    helpful: 7,
    images: [],
  },
  {
    id: "r4",
    name: "Karan Singh",
    rating: 4,
    title: "Great value for money",
    text: "Solid build and lovely colours. Took a little longer to arrive but support kept me updated throughout.",
    date: "2026-04-12",
    verified: true,
    helpful: 4,
    images: ["/Shop/Product4.jpeg"],
  },
  {
    id: "r5",
    name: "Sneha Iyer",
    rating: 5,
    title: "Exceeded expectations",
    text: "The colours are vibrant and the finish is flawless. It's now the centerpiece of my shelf.",
    date: "2026-03-26",
    verified: true,
    helpful: 9,
    images: ["/Shop/Product5.jpeg", "/Shop/Product6.jpeg"],
  },
  {
    id: "r6",
    name: "Aditya Kapoor",
    rating: 5,
    title: "Museum-quality detail",
    text: "I collect figurines and this easily ranks among my favourites. The hand-painting is on another level.",
    date: "2026-03-10",
    verified: true,
    helpful: 15,
    images: [],
  },
  {
    id: "r7",
    name: "Meera Joshi",
    rating: 3,
    title: "Lovely but fragile",
    text: "Gorgeous piece, though it needs careful handling. Arrived safely thanks to the sturdy packaging.",
    date: "2026-02-22",
    verified: false,
    helpful: 2,
    images: [],
  },
  {
    id: "r8",
    name: "Vikram Rao",
    rating: 4,
    title: "Highly recommend",
    text: "Beautiful craftsmanship and a fair price. Will definitely be ordering more from this collection.",
    date: "2026-02-05",
    verified: true,
    helpful: 6,
    images: ["/Shop/Product1.jpeg"],
  },
];

const REVIEWS_PER_PAGE = 6;

// Warm, neutral avatar palette (kept off the brand pink to feel professional).
const AVATAR_COLORS = ["#c48212", "#475569", "#0f766e", "#b45309", "#6d28d9"];

/* ── Small reusable bits ── */

function Stars({ value = 0, size = 16, className = "" }) {
  const rounded = Math.round(value);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <FiStar
          key={i}
          size={size}
          className={i < rounded ? "fill-[#f5a623] text-[#f5a623]" : "text-gray-300 dark:text-white/20"}
        />
      ))}
    </span>
  );
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-1 rounded transition-transform hover:scale-110"
        >
          <FiStar
            size={28}
            className={n <= active ? "fill-[#f5a623] text-[#f5a623]" : "text-gray-300 dark:text-white/20"}
          />
        </button>
      ))}
    </div>
  );
}

function Avatar({ name }) {
  const letter = name?.trim()?.[0]?.toUpperCase() || "U";
  const color = AVATAR_COLORS[(name?.length || 0) % AVATAR_COLORS.length];
  return (
    <span
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

/* ── Rating summary (average + breakdown bars) ── */
function RatingSummary({ reviews }) {
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      {/* Average */}
      <div className="text-center sm:pr-8 sm:border-r border-gray-200 dark:border-white/10">
        <p className="text-5xl font-bold text-gray-900 dark:text-white">{avg.toFixed(1)}</p>
        <Stars value={avg} size={18} className="mt-2 justify-center" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {total} review{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {counts.map(({ star, count }) => {
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-gray-600 dark:text-gray-300 flex items-center gap-1 shrink-0">
                {star} <FiStar size={12} className="fill-[#f5a623] text-[#f5a623]" />
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#f5a623]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="w-8 text-right text-gray-500 dark:text-gray-400 tabular-nums shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Review submission form ── */
function ReviewForm({ onSubmit }) {
  const { user, addToast } = useApp();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // { url, file }
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  // Revoke object URLs on unmount to avoid leaks.
  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (fileList) => {
    const picked = Array.from(fileList || []).filter((f) => f.type.startsWith("image/")).slice(0, 6);
    const mapped = picked.map((file) => ({ url: URL.createObjectURL(file), file }));
    setImages((prev) => [...prev, ...mapped].slice(0, 6));
  };

  const removeImage = (url) => {
    URL.revokeObjectURL(url);
    setImages((prev) => prev.filter((img) => img.url !== url));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    const next = {};
    if (!rating) next.rating = "Please select a star rating";
    if (!title.trim()) next.title = "Add a short title";
    if (text.trim().length < 10) next.text = "Tell us a bit more (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    // Mock async submit → realistic loading state.
    setTimeout(() => {
      onSubmit({
        id: `u${Date.now()}`,
        name: user?.name || "Guest Reviewer",
        rating,
        title: title.trim(),
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
        verified: Boolean(user),
        helpful: 0,
        images: images.map((img) => img.url),
      });
      setSubmitting(false);
      setRating(0);
      setTitle("");
      setText("");
      setImages([]); // keep URLs - they're now owned by the rendered review
      setErrors({});
      addToast("Thanks! Your review has been posted.", "success");
    }, 800);
  };

  const inputCls = (k) =>
    `w-full bg-gray-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#fe4462]/30 focus:border-[#fe4462] focus-visible:!outline-none ${
      errors[k] ? "border-red-400" : "border-gray-200 dark:border-white/10"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-7 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Write a Review</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">
        Share your experience to help other collectors.
      </p>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Overall rating</label>
        <StarInput value={rating} onChange={(n) => { setRating(n); setErrors((e) => ({ ...e, rating: undefined })); }} />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="rv-title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Review title</label>
        <input
          id="rv-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((er) => ({ ...er, title: undefined })); }}
          placeholder="Summarise your experience"
          className={inputCls("title")}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Text */}
      <div className="mb-4">
        <label htmlFor="rv-text" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Your review</label>
        <textarea
          id="rv-text"
          rows={4}
          value={text}
          onChange={(e) => { setText(e.target.value); setErrors((er) => ({ ...er, text: undefined })); }}
          placeholder="What did you like or dislike? How was the quality and finish?"
          className={`${inputCls("text")} resize-none`}
          aria-invalid={Boolean(errors.text)}
        />
        {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
      </div>

      {/* Image upload */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Add photos (optional)</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-white/15 rounded-xl py-6 text-gray-500 dark:text-gray-400 hover:border-[#fe4462] hover:text-[#fe4462] transition"
        >
          <FiUploadCloud size={26} />
          <span className="text-sm font-medium">Click to upload images</span>
          <span className="text-xs">PNG or JPG · up to 6 photos</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {images.map((img) => (
              <div key={img.url} className="relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                <img src={img.url} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.url)}
                  aria-label="Remove image"
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#fe4462] transition"
                >
                  <FiX size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="bg-[#fe4462] border border-[#fe4462] text-[#fff] hover:bg-transparent hover:text-[#fe4462] duration-200 rounded-full cursor-pointer font-medium w-full justify-center !py-3 "
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Posting…
          </>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}

/* ── Single review card ── */
function ReviewCard({ review, onLike, liked, onOpenImage }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      className="bg-white dark:bg-white/5 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10 hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Reviewer */}
      <div className="flex items-center gap-2.5">
        <Avatar name={review.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{review.name}</p>
            {review.verified && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-green-600 dark:text-green-400 shrink-0"
                title="Verified Purchase"
              >
                <FiCheckCircle size={11} /> Verified
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400">{formatDate(review.date)}</span>
        </div>
      </div>

      {/* Rating + title */}
      <div className="flex items-center gap-2 mt-3">
        <Stars value={review.rating} size={13} />
      </div>
      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mt-1.5">{review.title}</h4>
      <p className="text-[13px] text-gray-600 dark:text-gray-300 mt-1 leading-relaxed line-clamp-4">{review.text}</p>

      {review.images?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {review.images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => onOpenImage(src)}
              className="w-12 h-12 rounded-md overflow-hidden ring-1 ring-black/5 dark:ring-white/10 hover:ring-[#fe4462] transition group"
              aria-label="View review photo"
            >
              <img src={src} alt={`Photo from ${review.name}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/10">
        <button
          type="button"
          onClick={() => onLike(review.id)}
          aria-pressed={liked}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
            liked
              ? "border-[#fe4462]/40 text-[#fe4462] bg-[#fe4462]/5"
              : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <FiThumbsUp size={13} className={liked ? "fill-[#fe4462]" : ""} />
          Helpful ({review.helpful + (liked ? 1 : 0)})
        </button>
      </div>
    </motion.article>
  );
}

/* ── Customer photo gallery ── */
function PhotoGallery({ images, onOpen }) {
  if (!images.length) return null;
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <FiCamera size={18} className="text-[#fe4462]" /> Customer Photos
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{images.length} photos from buyers</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => onOpen(i)}
            className="relative aspect-square rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10 hover:ring-[#fe4462] transition group"
            aria-label={`Open customer photo ${i + 1}`}
          >
            <img src={src} alt={`Customer photo ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
              <FiZoomIn size={20} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Lightbox with zoom + keyboard navigation ── */
function Lightbox({ images, index, setIndex, onClose }) {
  const dialogRef = useModalA11y(onClose);
  const [zoom, setZoom] = useState(false);

  const go = useCallback(
    (dir) => {
      setZoom(false);
      setIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length, setIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Customer photo viewer"
    >
      <div ref={dialogRef} tabIndex={-1} className="relative outline-none" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={index}
          src={images[index]}
          alt={`Customer photo ${index + 1} of ${images.length}`}
          onClick={() => setZoom((z) => !z)}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`max-h-[82vh] max-w-[90vw] rounded-xl object-contain select-none transition-transform duration-300 ${
            zoom ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
        />
        <p className="text-center text-white/60 text-xs mt-3">{index + 1} / {images.length}</p>
      </div>

      {/* Controls */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-[#fe4462] text-white flex items-center justify-center transition"
      >
        <FiX size={22} />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-[#fe4462] text-white flex items-center justify-center transition"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-[#fe4462] text-white flex items-center justify-center transition"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}
    </motion.div>
  );
}

/* ── Skeleton + states ── */
function ReviewSkeleton() {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded skeleton" />
          <div className="h-3 w-24 rounded skeleton" />
        </div>
      </div>
      <div className="h-3 w-40 rounded skeleton mt-5" />
      <div className="h-3 w-full rounded skeleton mt-3" />
      <div className="h-3 w-3/4 rounded skeleton mt-2" />
    </div>
  );
}

/* ── Main section ── */
export default function Reviews({ title = "Customer Reviews & Ratings" }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [liked, setLiked] = useState({});
  const [lightbox, setLightbox] = useState(-1); // index into gallery, -1 = closed
  const [page, setPage] = useState(1);

  // Mock async fetch on mount - state is only set inside the timeout (async),
  // never synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      if (!cancelled) {
        setReviews(SEED_REVIEWS);
        setStatus("ready");
      }
    }, 700);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // Retry handler (click) for the error state.
  const retry = () => {
    setStatus("loading");
    setTimeout(() => { setReviews(SEED_REVIEWS); setStatus("ready"); }, 700);
  };

  const gallery = useMemo(() => reviews.flatMap((r) => r.images || []), [reviews]);

  // Pagination (clamped so it never points past the last page).
  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = reviews.slice((safePage - 1) * REVIEWS_PER_PAGE, safePage * REVIEWS_PER_PAGE);

  // New review → jump to the first page so it's visible.
  const addReview = (review) => { setReviews((prev) => [review, ...prev]); setPage(1); };
  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  const openImageBySrc = (src) => {
    const i = gallery.indexOf(src);
    if (i >= 0) setLightbox(i);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#f5f0e8] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Real feedback from verified Mohan Maya collectors.
          </p>
        </div>

        {/* Top: summary + form */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="space-y-6">
            {status === "loading" ? (
              <div className="h-44 rounded-2xl skeleton" />
            ) : status === "ready" ? (
              <RatingSummary reviews={reviews} />
            ) : null}
            <PhotoGallery images={gallery} onOpen={setLightbox} />
          </div>
          <ReviewForm onSubmit={addReview} />
        </div>

        {/* Reviews list */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
            {status === "ready" ? `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}` : "Reviews"}
          </h3>

          {status === "loading" && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <ReviewSkeleton key={i} />)}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center text-center py-14 bg-white dark:bg-white/5 rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
              <FiAlertTriangle size={42} className="text-red-400 mb-3" />
              <p className="font-semibold text-gray-800 dark:text-white">Couldn't load reviews</p>
              <p className="text-sm text-gray-500 mt-1 mb-5">Something went wrong. Please try again.</p>
              <button onClick={retry} className="btn-primary text-sm">Retry</button>
            </div>
          )}

          {status === "ready" && reviews.length === 0 && (
            <div className="flex flex-col items-center text-center py-14 bg-white dark:bg-white/5 rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
              <FiStar size={42} className="text-gray-300 mb-3" />
              <p className="font-semibold text-gray-800 dark:text-white">No reviews yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to share your experience.</p>
            </div>
          )}

          {status === "ready" && reviews.length > 0 && (
            <>
              {/* Keyed by page → subtle fade/slide between pages, in-place (no
                  double mount), so there's no layout shift. */}
              <motion.div
                key={safePage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {paginated.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    liked={Boolean(liked[r.id])}
                    onLike={toggleLike}
                    onOpenImage={openImageBySrc}
                  />
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Reviews pagination" className="flex items-center justify-center flex-wrap gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 text-sm dark:text-white disabled:opacity-40 hover:border-[#fe4462] hover:text-[#fe4462] transition"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={`rp-${i + 1}`}
                      onClick={() => setPage(i + 1)}
                      aria-label={`Go to page ${i + 1}`}
                      aria-current={safePage === i + 1 ? "page" : undefined}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        safePage === i + 1
                          ? "bg-[#fe4462] text-white"
                          : "border border-gray-300 dark:border-white/10 dark:text-white hover:border-[#fe4462] hover:text-[#fe4462]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 text-sm dark:text-white disabled:opacity-40 hover:border-[#fe4462] hover:text-[#fe4462] transition"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox >= 0 && gallery[lightbox] && (
          <Lightbox
            images={gallery}
            index={lightbox}
            setIndex={(updater) =>
              setLightbox((i) => (typeof updater === "function" ? updater(i) : updater))
            }
            onClose={() => setLightbox(-1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
