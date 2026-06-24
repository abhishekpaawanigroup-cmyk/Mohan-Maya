import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "../hooks/useHooks";
import { COUPONS, computeTotals } from "../data/shop";
import CartFx from "../components/common/CartFx";

const AppContext = createContext(null);

let toastId = 0;
let flyId = 0;
const MAX_RECENT = 8;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage("mm-dark-mode", false);
  const [cart, setCart] = useLocalStorage("mm-cart", []);
  const [wishlist, setWishlist] = useLocalStorage("mm-wishlist", []);
  const [couponCode, setCouponCode] = useLocalStorage("mm-coupon", null);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage("mm-recent", []);
  const [orders, setOrders] = useLocalStorage("mm-orders", []);
  const [user, setUser] = useLocalStorage("mm-user", null);
  const [cartAnimating, setCartAnimating] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [flyers, setFlyers] = useState([]);
  const animTimer = useRef(null);
  const successTimer = useRef(null);
  // Attached to the header cart button so fly-to-cart knows where to land.
  const cartIconRef = useRef(null);

  // Apply the dark class to <html> so Tailwind's dark: variants work app-wide.
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [setDarkMode]);

  // ── Toasts ──────────────────────────────────────────────
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "success") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  // ── Cart ────────────────────────────────────────────────
  // Pop the cart icon and flash the success tick. Used both when the mini
  // indicator lands and as the fallback when motion is reduced/unavailable.
  const triggerCartBounce = useCallback(() => {
    setCartAnimating(true);
    clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => setCartAnimating(false), 600);

    setCartSuccess(true);
    clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setCartSuccess(false), 650);
  }, []);

  // Commits the actual cart state update + toast (no animation).
  const commitAddToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
        }
        return [...prev, { ...product, qty }];
      });
      addToast(`${product.name} added to cart`, "success");
    },
    [setCart, addToast]
  );

  // Add to cart. When motion is allowed, play a small indicator that rises into
  // the cart icon; the cart updates + tick fires when it lands (handleFlyerDone).
  // The third arg is kept for call-site compatibility but is no longer used —
  // the effect originates at the cart icon, not the source element.
  const addToCart = useCallback(
    // eslint-disable-next-line no-unused-vars
    (product, qty = 1, source = null) => {
      const cartEl = cartIconRef.current;

      if (cartEl && product?.image && !prefersReducedMotion()) {
        const to = cartEl.getBoundingClientRect();
        if (to.width) {
          flyId += 1;
          setFlyers((prev) => [...prev, { id: flyId, image: product.image, to, product, qty }]);
          return; // commit happens in handleFlyerDone when it lands
        }
      }

      commitAddToCart(product, qty);
      triggerCartBounce();
    },
    [commitAddToCart, triggerCartBounce]
  );

  // Called when the indicator reaches the cart: commit + bounce + tick + clean up.
  const handleFlyerDone = useCallback(
    (flyer) => {
      commitAddToCart(flyer.product, flyer.qty);
      triggerCartBounce();
      setFlyers((prev) => prev.filter((f) => f.id !== flyer.id));
    },
    [commitAddToCart, triggerCartBounce]
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => prev.filter((i) => i.id !== id));
      addToast("Removed from cart", "info");
    },
    [setCart, addToast]
  );

  const updateQty = useCallback(
    (id, qty) => {
      if (qty < 1) return;
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
  }, [setCart, setCouponCode]);

  // ── Wishlist ────────────────────────────────────────────
  const isWishlisted = useCallback((id) => wishlist.some((i) => i.id === id), [wishlist]);

  const toggleWishlist = useCallback(
    (product) => {
      // Decide the action from current state, THEN fire side effects once.
      // The state updater stays pure so Strict Mode's double-invoke can't
      // duplicate the toast.
      const exists = wishlist.some((i) => i.id === product.id);
      if (exists) {
        setWishlist((prev) => prev.filter((i) => i.id !== product.id));
        addToast("Removed from wishlist", "info");
      } else {
        setWishlist((prev) => [...prev, product]);
        addToast(`${product.name} added to wishlist`, "success");
      }
    },
    [wishlist, setWishlist, addToast]
  );

  // ── Coupons ─────────────────────────────────────────────
  const coupon = couponCode ? COUPONS[couponCode] : null;

  const applyCoupon = useCallback(
    (code) => {
      const key = (code || "").trim().toUpperCase();
      if (!key) return false;
      if (!COUPONS[key]) {
        addToast("Invalid coupon code", "error");
        return false;
      }
      setCouponCode(key);
      addToast(`Coupon ${key} applied - ${COUPONS[key].label}`, "success");
      return true;
    },
    [setCouponCode, addToast]
  );

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    addToast("Coupon removed", "info");
  }, [setCouponCode, addToast]);

  const totals = computeTotals(cart, coupon);

  // ── Recently viewed ─────────────────────────────────────
  const addRecentlyViewed = useCallback(
    (product) => {
      if (!product?.id) return;
      setRecentlyViewed((prev) => {
        const next = [product, ...prev.filter((p) => p.id !== product.id)];
        return next.slice(0, MAX_RECENT);
      });
    },
    [setRecentlyViewed]
  );

  // ── Orders ──────────────────────────────────────────────
  const placeOrder = useCallback(
    (customer) => {
      const id = `MM${Date.now().toString(36).toUpperCase().slice(-7)}`;
      const order = {
        id,
        items: cart,
        customer,
        totals: computeTotals(cart, coupon),
        coupon: couponCode,
        createdAt: Date.now(),
      };
      setOrders((prev) => [order, ...prev]);
      clearCart();
      addToast("Order placed successfully!", "success");
      return id;
    },
    [cart, coupon, couponCode, setOrders, clearCart, addToast]
  );

  const getOrder = useCallback(
    (id) => orders.find((o) => o.id?.toUpperCase() === (id || "").trim().toUpperCase()) || null,
    [orders]
  );

  // ── Auth (lightweight mock - persisted to localStorage) ──
  const login = useCallback(
    ({ name, email }) => {
      const u = { name: name || email.split("@")[0], email };
      setUser(u);
      addToast(`Welcome back, ${u.name}!`, "success");
      return u;
    },
    [setUser, addToast]
  );

  const register = useCallback(
    ({ name, email }) => {
      const u = { name, email };
      setUser(u);
      addToast(`Welcome to Mohan-Maya, ${u.name}!`, "success");
      return u;
    },
    [setUser, addToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    addToast("You've been logged out", "info");
  }, [setUser, addToast]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const value = {
    darkMode,
    toggleDarkMode,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartAnimating,
    cartSuccess,
    cartIconRef,
    wishlist,
    isWishlisted,
    toggleWishlist,
    toasts,
    addToast,
    removeToast,
    // shopping experience
    coupon,
    couponCode,
    applyCoupon,
    removeCoupon,
    totals,
    recentlyViewed,
    addRecentlyViewed,
    orders,
    placeOrder,
    getOrder,
    // auth
    user,
    login,
    register,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <CartFx flyers={flyers} onDone={handleFlyerDone} />
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
