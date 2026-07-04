import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Reusable pagination bar with a "Showing X-Y of N" summary, optional
 * page-size selector, and numbered pages with ellipses. Purely presentational -
 * the parent owns page/perPage state so filters & search persist across pages.
 */
export default function Pagination({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 50],
  label = "Orders",
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(total, page * perPage);

  const pages = getPageList(page, totalPages);

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
        <span>
          Showing <strong className="text-gray-900 dark:text-white">{start}-{end}</strong> of{" "}
          <strong className="text-gray-900 dark:text-white">{total}</strong> {label}
        </span>
        <span className="text-gray-400" aria-hidden="true">·</span>
        <span>
          Page <strong className="text-gray-900 dark:text-white">{page}</strong> of{" "}
          <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
        </span>
        {onPerPageChange && (
          <label className="hidden items-center gap-2 sm:flex">
            <span className="text-gray-500 dark:text-gray-400">Per page</span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-[#fe4462]"
            >
              {perPageOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <PageBtn disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <FiChevronLeft size={16} />
        </PageBtn>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-gray-400 select-none">…</span>
          ) : (
            <motion.button
              key={p}
              whileTap={{ scale: 0.92 }}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid h-9 min-w-9 place-items-center rounded-lg px-2.5 text-sm font-semibold transition ${
                p === page
                  ? "bg-[#fe4462] text-white shadow-sm"
                  : "border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-[#fe4462] hover:text-[#fe4462]"
              }`}
            >
              {p}
            </motion.button>
          )
        )}

        <PageBtn disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <FiChevronRight size={16} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ disabled, onClick, children, ...rest }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 transition hover:border-[#fe4462] hover:text-[#fe4462] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
      {...rest}
    >
      {children}
    </button>
  );
}

// Compact page list with leading/trailing ellipses, e.g. 1 … 4 [5] 6 … 20
function getPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}
