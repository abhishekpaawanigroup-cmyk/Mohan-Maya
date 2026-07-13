import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Returns whether the page is scrolled past `threshold` px as a boolean.
 * Unlike useScrollPosition this only triggers a re-render when the boolean
 * actually flips - so consumers (Header, BackToTop) don't re-render on every
 * scroll frame, which is critical for smooth 60fps scrolling.
 */
export function useScrollThreshold(threshold = 0) {
  const [passed, setPassed] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold
  );

  useEffect(() => {
    let frame = null;
    const check = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setPassed((prev) => {
          const next = window.scrollY > threshold;
          return prev === next ? prev : next; // bail out if unchanged
        });
        frame = null;
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return passed;
}

// Same-tab broadcast channel for localStorage writes: the native "storage"
// event only fires in *other* tabs, so independent useLocalStorage(key, ...)
// instances in the same tab (e.g. the currency selector and CurrencyContext,
// both keyed on "mm-currency") would otherwise never see each other's writes.
const LOCAL_STORAGE_EVENT = "mm-local-storage";

/**
 * Persists a piece of state to localStorage so it survives reloads. Instances
 * sharing the same key stay in sync across the whole app (same tab and other
 * tabs), so any component may read/write a key without needing to be the one
 * "owner" of that state.
 */
export function useLocalStorage(key, initialValue) {
  const read = useCallback(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [value, setValue] = useState(read);
  // Mirrors `value` synchronously so setStored can resolve functional updates
  // (`next(prev)`) without putting side effects (localStorage write, event
  // dispatch) inside the setValue updater itself - React may invoke that
  // updater outside the normal commit flow, and it must stay pure.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Pick up writes made by other useLocalStorage(key) instances - same tab
  // (custom event) or other tabs (native "storage" event).
  useEffect(() => {
    const onCustom = (e) => {
      if (e.detail?.key === key) setValue(e.detail.value);
    };
    const onStorage = (e) => {
      if (e.key === key) setValue(read());
    };
    window.addEventListener(LOCAL_STORAGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LOCAL_STORAGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [key, read]);

  const setStored = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(valueRef.current) : next;
      valueRef.current = resolved;
      setValue(resolved);
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_EVENT, { detail: { key, value: resolved } })
        );
      } catch {
        /* ignore write errors (private mode / quota) */
      }
    },
    [key]
  );

  return [value, setStored];
}

/**
 * Debounces a fast-changing value (e.g. a search input).
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/**
 * Sets the document <title> and meta description for the current page, and
 * restores the previous values on unmount. A tiny dependency-free alternative
 * to react-helmet for per-route SEO metadata.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let meta = null;
    let createdMeta = false;
    let prevDesc = null;
    if (description) {
      meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
        createdMeta = true;
      } else {
        prevDesc = meta.getAttribute("content");
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (meta) {
        if (createdMeta) meta.remove();
        else if (prevDesc != null) meta.setAttribute("content", prevDesc);
      }
    };
  }, [title, description]);
}

/**
 * Calls `handler` when a pointer/touch event occurs outside the ref element.
 * Useful for closing dropdowns and popovers.
 */
export function useClickOutside(handler) {
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [handler]);
  return ref;
}

// Ref-counted body scroll lock so nested modals don't unlock each other.
let scrollLockCount = 0;
function lockScroll() {
  if (scrollLockCount++ === 0) document.body.style.overflow = "hidden";
}
function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = "";
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessibility helper for modals/dialogs. Returns a ref to spread on the
 * dialog element. Handles: body scroll lock (nest-safe), Escape to close,
 * Tab focus trapping, initial focus, and focus restoration on unmount.
 */
export function useModalA11y(onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);

  // Keep the latest onClose without re-running the trap effect.
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const node = ref.current;
    const previouslyFocused = document.activeElement;
    lockScroll();

    const items = () =>
      Array.from(node?.querySelectorAll(FOCUSABLE) || []).filter(
        (el) => el.offsetParent !== null
      );

    // Move focus inside the dialog on open.
    (items()[0] || node)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) {
        e.preventDefault();
        node?.focus();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node?.addEventListener("keydown", onKey);
    return () => {
      node?.removeEventListener("keydown", onKey);
      unlockScroll();
      previouslyFocused?.focus?.();
    };
  }, []);

  return ref;
}
