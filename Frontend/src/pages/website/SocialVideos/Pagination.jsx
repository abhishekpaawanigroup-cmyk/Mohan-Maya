import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const WINDOW = 3; // how many page numbers are visible at once

/**
 * A sliding window of `WINDOW` page numbers, centred on the current page when
 * possible: 1 2 3 → 2 3 4 → 3 4 5 … Ellipses mark hidden ranges on either side.
 */
function pageWindow(page, total) {
  if (total <= WINDOW) {
    return { nums: Array.from({ length: total }, (_, i) => i + 1), left: false, right: false };
  }
  const start = Math.min(Math.max(page - 1, 1), total - WINDOW + 1);
  const nums = Array.from({ length: WINDOW }, (_, i) => start + i);
  return { nums, left: start > 1, right: start + WINDOW - 1 < total };
}

const arrowBase =
  "grid place-items-center h-10 w-10 rounded-full border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl text-gray-600 dark:text-gray-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-[var(--accent)] enabled:hover:text-[var(--accent)] enabled:hover:-translate-y-0.5 enabled:active:scale-95";

const ellipsisBase =
  "grid place-items-center h-10 min-w-10 px-2 rounded-full text-gray-400 dark:text-gray-500 transition-colors duration-300 hover:text-[var(--accent)] active:scale-95 select-none";

/**
 * Modern, theme-consistent pagination. The active page is a gradient pill that
 * smoothly slides between numbers via a shared layout animation (layoutId).
 * Purely client-side: `onChange(nextPage)` is the only callback.
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const { nums, left, right } = pageWindow(page, totalPages);
  const go = (p) => {
    if (p >= 1 && p <= totalPages && p !== page) onChange(p);
  };

  return (
    <motion.nav
      aria-label="Video pagination"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={arrowBase}
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Hidden earlier pages → jump to the first page */}
      {left && (
        <button type="button" onClick={() => go(1)} aria-label="Jump to first page" className={ellipsisBase}>
          …
        </button>
      )}

      {nums.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => go(n)}
          aria-current={n === page ? "page" : undefined}
          className={`relative grid place-items-center h-10 min-w-10 px-3 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
            n === page
              ? "text-white"
              : "text-gray-600 dark:text-gray-300 border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          {n === page && (
            <motion.span
              layoutId="yt-page-active"
              transition={{ type: "spring", stiffness: 500, damping: 36 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] shadow-md shadow-[var(--ring)]"
            />
          )}
          <span className="relative z-10">{n}</span>
        </button>
      ))}

      {/* Hidden later pages → jump to the last page */}
      {right && (
        <button type="button" onClick={() => go(totalPages)} aria-label="Jump to last page" className={ellipsisBase}>
          …
        </button>
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={arrowBase}
      >
        <FiChevronRight size={18} />
      </button>
    </motion.nav>
  );
}
