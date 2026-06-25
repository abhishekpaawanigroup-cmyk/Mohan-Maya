import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/** Build a compact page list with ellipses, e.g. 1 … 4 5 6 … 12. */
function pageItems(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  if (page > 3) items.push("left-ellipsis");
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  for (let i = start; i <= end; i++) items.push(i);
  if (page < total - 2) items.push("right-ellipsis");
  items.push(total);
  return items;
}

/**
 * Theme-consistent pagination control. `onPrev` / `onNext` are separate from
 * `onChange` so the parent can hook "Next" on the final page into fetching more
 * videos from the API. `nextLoading` shows a spinner; `nextHasMore` keeps Next
 * enabled past the last loaded page.
 */
export default function Pagination({
  page,
  totalPages,
  onChange,
  onPrev,
  onNext,
  nextLoading = false,
  nextHasMore = false,
}) {
  if (totalPages <= 1 && !nextHasMore) return null;

  const items = pageItems(page, totalPages);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages && !nextHasMore;

  const arrowBase =
    "grid place-items-center h-10 w-10 rounded-full border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl text-gray-600 dark:text-gray-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-[#fe4462] enabled:hover:text-[#fe4462] enabled:hover:-translate-y-0.5";

  return (
    <nav aria-label="Video pagination" className="mt-12 flex items-center justify-center gap-2">
      <button type="button" onClick={onPrev} disabled={prevDisabled} aria-label="Previous page" className={arrowBase}>
        <FiChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1.5">
        {items.map((it) =>
          typeof it === "string" ? (
            <span key={it} className="px-1.5 text-gray-400 dark:text-gray-500 select-none">
              …
            </span>
          ) : (
            <button
              key={it}
              type="button"
              onClick={() => onChange(it)}
              aria-current={it === page ? "page" : undefined}
              className={`h-10 min-w-10 px-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                it === page
                  ? "bg-gradient-to-r from-[#fe4462] to-[#d93550] text-white shadow-md shadow-[#fe4462]/40"
                  : "border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl text-gray-600 dark:text-gray-300 hover:border-[#fe4462] hover:text-[#fe4462] hover:-translate-y-0.5"
              }`}
            >
              {it}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        aria-label="Next page"
        className={arrowBase}
      >
        {nextLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-[#fe4462]/40 border-t-[#fe4462] animate-spin" />
        ) : (
          <FiChevronRight size={18} />
        )}
      </button>
    </nav>
  );
}
