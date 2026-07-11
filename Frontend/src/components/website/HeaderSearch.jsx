import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiX, FiMic, FiChevronDown, FiCheck } from "react-icons/fi";
import { useClickOutside, useLocalStorage } from "../../hooks/useHooks";
import { useApp } from "../../context/AppContext";
import { useI18n } from "../../context/I18nContext";
import { products, categories } from "../../data/products";

/**
 * Reusable premium search bar for the header (used both inline on desktop/tablet
 * and inside the expandable mobile search). Fully keyboard-accessible combobox:
 * type to see live product suggestions (sourced from the local catalog - no
 * backend needed), arrow keys to move, Enter to search, Escape to dismiss.
 *
 * On submit it routes to `/shop?search=<term>`; the Shop page's existing filter
 * matches the term against product name AND category, so category shortcuts work
 * through the same path without any new routes.
 */
export default function HeaderSearch({ onNavigate, autoFocus = false, className = "" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useApp();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  // Selected category persists for the session so its label survives remounts
  // (the mobile search opens as a fresh instance each time).
  const [category, setCategory] = useLocalStorage("mm-search-category", categories[0]);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const wrapRef = useClickOutside(() => { setOpen(false); setActive(-1); });
  const catRef = useClickOutside(() => setCatOpen(false));

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  const showList = open && suggestions.length > 0;

  const go = (term) => {
    const t = (term ?? "").trim();
    const isCategorySelected = category !== categories[0];

    // Preserve existing filter parameters and merge with new ones
    const params = new URLSearchParams(searchParams);

    // If no search term but category is selected, update category filter (preserve other filters)
    if (!t && isCategorySelected) {
      params.set("category", category);
      navigate(`/shop?${params.toString()}`);
      setQuery("");
      setOpen(false);
      setActive(-1);
      onNavigate?.();
      return;
    }

    // If search term provided, update search parameter (preserve other filters like category, character, price, sort)
    if (t) {
      params.set("search", t);
      navigate(`/shop?${params.toString()}`);
      setQuery("");
      setOpen(false);
      setActive(-1);
      onNavigate?.();
      return;
    }

    // If no search term and no category selected, clear category filter but preserve other filters
    if (!isCategorySelected) {
      params.delete("category");
      navigate(`/shop?${params.toString()}`);
      setQuery("");
      setOpen(false);
      setActive(-1);
      onNavigate?.();
      return;
    }

    // No search term and no category selected - just focus input
    inputRef.current?.focus();
  };

  // Selecting a suggestion fills the input with the product name (does not
  // navigate) and keeps focus, so the user can refine or press Enter to search.
  const selectSuggestion = (name) => {
    setQuery(name);
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) selectSuggestion(suggestions[active].name);
    else go(query);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  return (
    <form ref={wrapRef} role="search" onSubmit={onSubmit} className={`header-search relative ${className}`}>
      <div className="flex items-stretch rounded-full bg-white ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
        {/* Category scope - custom dropdown; label reflects the current choice
            and only the hovered option ever highlights. */}
        <div ref={catRef} className="relative hidden shrink-0 sm:block">
          <button
            type="button"
            onClick={() => { setCatOpen((v) => !v); setOpen(false); }}
            aria-haspopup="listbox"
            aria-expanded={catOpen}
            aria-label={`Search category: ${category}`}
            className="flex h-full max-w-[150px] items-center gap-1 rounded-l-full border-r border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-600 outline-none transition hover:text-[#fe4462] dark:border-white/10 dark:bg-white/10 dark:text-gray-300"
          >
            <span className="truncate">{category}</span>
            <FiChevronDown size={12} className={`shrink-0 transition-transform ${catOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {catOpen && (
              <motion.ul
                role="listbox"
                aria-label="Search category"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg bg-white py-1.5 shadow-xl ring-1 ring-gray-200/70 dark:bg-[#1a0a0e] dark:ring-white/10"
              >
                {categories.map((c) => (
                  <li key={c} role="option" aria-selected={c === category}>
                    <button
                      type="button"
                      onClick={() => { setCategory(c); setCatOpen(false); inputRef.current?.focus(); }}
                      className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition hover:bg-[#fe4462]/10 hover:text-[#fe4462] ${
                        c === category ? "font-semibold text-[#fe4462]" : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {c}
                      {c === category && <FiCheck size={14} className="shrink-0 text-[#fe4462]" />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex flex-1 items-center">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
            onFocus={() => { setOpen(true); setCatOpen(false); }}
            onKeyDown={onKeyDown}
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls="header-search-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `header-sugg-${active}` : undefined}
            aria-label={t("search.button")}
            placeholder={t("search.placeholder")}
            className="w-full bg-transparent py-3 pl-4 pr-9 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:outline-none focus-visible:outline-none dark:text-white dark:placeholder:text-gray-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setActive(-1); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute right-2 grid h-7 w-7 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-[#fe4462] dark:hover:bg-white/10"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Voice search - UI ready for future integration */}
        <IconAction icon={FiMic} label={t("search.voice")} onClick={() => addToast(`${t("search.voice")} - coming soon`, "info")} />

        <button
          type="submit"
          aria-label={t("search.button")}
          className="flex items-center justify-center rounded-r-full bg-[#fe4462] px-4 text-white transition hover:bg-[#d93550] active:scale-95 sm:px-5"
        >
          <IoSearch size={18} />
        </button>
      </div>

      {/* Live suggestions */}
      <AnimatePresence>
        {showList && (
          <motion.ul
            id="header-search-suggestions"
            role="listbox"
            aria-label="Search suggestions"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white py-1.5 shadow-xl ring-1 ring-gray-200/70 dark:bg-[#1a0a0e] dark:ring-white/10"
          >
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                id={`header-sugg-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s.name); }}
                className={`flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  i === active ? "bg-[#fe4462]/10 text-[#fe4462]" : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <IoSearch size={14} className="shrink-0 text-gray-400" aria-hidden="true" />
                <span className="truncate">{s.name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </form>
  );
}

// Icon button inside the search bar (mic / camera) with a styled tooltip.
function IconAction({ icon: Icon, label, onClick }) {
  return (
    <div className="group relative flex shrink-0 items-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="grid h-9 w-9 place-items-center self-center rounded-full text-gray-500 outline-none transition-all duration-200 hover:scale-110 hover:bg-[#fe4462]/10 hover:text-[#fe4462] active:scale-90 dark:text-gray-400"
      >
        <Icon size={17} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-white dark:text-gray-900"
      >
        {label}
      </span>
    </div>
  );
}
