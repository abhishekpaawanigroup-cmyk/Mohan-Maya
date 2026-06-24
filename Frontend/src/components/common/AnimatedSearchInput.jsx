import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const DEFAULT_PHRASES = [
  "Search products by name...",
  "Search anime figures...",
  "Search action figures...",
  "Search collectibles...",
  "Search limited editions...",
];

const TYPE_SPEED = 80;     // ms per character typed
const DELETE_SPEED = 40;   // ms per character removed
const HOLD_FULL = 1500;    // pause once a phrase is fully typed
const HOLD_EMPTY = 350;    // pause before the next phrase starts

/**
 * Search input with a self-contained typewriter placeholder that cycles through
 * phrases while empty, plus a clean, theme-based focus state (no red ring/glow).
 *
 * The animation lives entirely inside this component so its frequent state
 * updates never re-render the parent product grid.
 */
export default function AnimatedSearchInput({
  value,
  onChange,
  onClear,
  phrases = DEFAULT_PHRASES,
  className = "",
  ariaLabel = "Search products",
}) {
  const [typed, setTyped] = useState("");
  const [caretOn, setCaretOn] = useState(true);
  const [focused, setFocused] = useState(false);

  // Only animate while the field is empty and unfocused - pausing keeps both the
  // UX (no animation under the user's cursor) and CPU usage sensible.
  const animate = !value && !focused;

  // Respect reduced-motion preference: fall back to a static placeholder.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const stateRef = useRef({ phrase: 0, char: 0, deleting: false });

  useEffect(() => {
    if (!animate || prefersReducedMotion) return;

    let timer;
    const tick = () => {
      const s = stateRef.current;
      const current = phrases[s.phrase];

      if (!s.deleting) {
        s.char += 1;
        setTyped(current.slice(0, s.char));
        if (s.char >= current.length) {
          s.deleting = true;
          timer = setTimeout(tick, HOLD_FULL);
          return;
        }
        timer = setTimeout(tick, TYPE_SPEED);
      } else {
        s.char -= 1;
        setTyped(current.slice(0, Math.max(0, s.char)));
        if (s.char <= 0) {
          s.deleting = false;
          s.phrase = (s.phrase + 1) % phrases.length;
          timer = setTimeout(tick, HOLD_EMPTY);
          return;
        }
        timer = setTimeout(tick, DELETE_SPEED);
      }
    };

    timer = setTimeout(tick, HOLD_EMPTY);
    return () => clearTimeout(timer);
  }, [animate, prefersReducedMotion, phrases]);

  // Blinking caret (only runs while animating; caretOn is read below only when
  // `animate` is true, so there's no need to reset it when paused).
  useEffect(() => {
    if (!animate || prefersReducedMotion) return;
    const blink = setInterval(() => setCaretOn((c) => !c), 500);
    return () => clearInterval(blink);
  }, [animate, prefersReducedMotion]);

  const placeholder = prefersReducedMotion
    ? phrases[0]
    : animate
    ? `${typed}${caretOn ? "|" : " "}`
    : "Search products...";

  return (
    <div className="relative flex-1">
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full pl-11 pr-10 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow duration-200 outline-none ring-0 focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!rounded-full focus:border-gray-300 dark:focus:border-white/20 focus:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.18)] ${className}`}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-8 w-8 rounded-full text-gray-400 hover:text-[#fe4462] hover:bg-gray-100 dark:hover:bg-white/10 transition"
          aria-label="Clear search"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}
