import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

/**
 * Accessible breadcrumb trail. `items` = [{ label, to? }] - the last item is the
 * current page (rendered as plain text with aria-current).
 * `light` switches link colours for use over a dark hero background.
 */
export default function Breadcrumb({ items = [], light = false, className = "" }) {
  const linkCls = light
    ? "text-white/70 hover:text-white transition-colors"
    : "text-gray-500 dark:text-gray-400 hover:text-[#fe4462] transition-colors";
  const mutedCls = light ? "text-white/70" : "text-gray-500 dark:text-gray-400";
  const sepCls = light ? "text-white/50" : "text-gray-400";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-x-1.5">
              {item.to && !last ? (
                <Link to={item.to} className={linkCls}>
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-[#fe4462] font-semibold" : mutedCls}
                >
                  {item.label}
                </span>
              )}
              {!last && <FiChevronRight size={14} className={`${sepCls} shrink-0`} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
