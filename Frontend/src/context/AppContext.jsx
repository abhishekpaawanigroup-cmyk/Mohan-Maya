import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocalStorage } from "../hooks/useHooks";
import { COUPONS, computeTotals } from "../data/shop";
import { products } from "../data/products";
import * as authApi from "../services/authApi";

const AppContext = createContext(null);

let toastId = 0;
const MAX_RECENT = 8;

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage("mm-dark-mode", false);
  const [cart, setCart] = useLocalStorage("mm-cart", []);
  const [wishlist, setWishlist] = useLocalStorage("mm-wishlist", []);
  const [couponCode, setCouponCode] = useLocalStorage("mm-coupon", null);
  // Persist ONLY product ids (not full objects). The ids are the stable source
  // of truth; full product data is always re-resolved from the catalog below.
  // This prevents stale/partial objects cached from an older build from
  // rendering as blank cards, and keeps the payload small.
  const [recentIds, setRecentIds] = useLocalStorage("mm-recent", []);
  const [orders, setOrders] = useLocalStorage("mm-orders", []);
  // Auth session is owned by the authApi service (localStorage/sessionStorage);
  // we mirror the current public user here, rehydrating it on mount.
  const [user, setUser] = useState(() => authApi.getSessionUser());
  const [addresses, setAddresses] = useLocalStorage("mm-addresses", []);
  const [toasts, setToasts] = useState([]);
  // Cart-icon confirmation: brief pop + green checkmark tick when an item is added.
  const [cartAnimating, setCartAnimating] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const animTimer = useRef(null);
  const successTimer = useRef(null);
  // Router's navigate(), registered by a component inside the RouterProvider
  // (WebsiteLayout) so the provider — which lives outside the router — can
  // redirect (e.g. to login) without a full page reload.
  // Auth modal: shown when a signed-out user triggers a protected action.
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
  // The action to resume after a successful login/registration.
  const pendingActionRef = useRef(null);

  // Apply the dark class to <html> so Tailwind's dark: variants work app-wide.
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [setDarkMode]);

  // ── Auth modal + gated actions ──────────────────────────
  const openAuthModal = useCallback((mode = "login") => {
    setAuthModal({ open: true, mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal((a) => ({ ...a, open: false }));
    pendingActionRef.current = null; // user dismissed — drop the pending action
  }, []);

  // Run `action` immediately if signed in; otherwise open the auth modal and
  // resume the action after a successful login/registration. Returns true when
  // it ran right away.
  const requireAuth = useCallback(
    (action, { mode = "login" } = {}) => {
      if (user) {
        action?.();
        return true;
      }
      pendingActionRef.current = action || null;
      setAuthModal({ open: true, mode });
      return false;
    },
    [user]
  );

  // Called by the modal once auth succeeds: close it, then continue the action
  // that triggered it (add to cart, go to checkout, open shop, …).
  const completeAuth = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    setAuthModal((a) => ({ ...a, open: false }));
    if (action) action();
  }, []);

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
  // Pop the cart icon and flash the green checkmark tick — the only add-to-cart
  // confirmation (no toast).
  const triggerCartBounce = useCallback(() => {
    setCartAnimating(true);
    clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => setCartAnimating(false), 600);

    setCartSuccess(true);
    clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setCartSuccess(false), 650);
  }, []);

  // Add to cart, then show the cart-icon confirmation. The third arg is accepted
  // for call-site compatibility but unused. Requires authentication: a signed-out
  // user gets the auth modal (no navigation) and the item is added automatically
  // once they sign in. Returns false when the add was deferred to login.
  const addToCart = useCallback(
    // eslint-disable-next-line no-unused-vars
    (product, qty = 1, source = null) => {
      const commit = () => {
        setCart((prev) => {
          const existing = prev.find((i) => i.id === product.id);
          if (existing) {
            return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
          }
          return [...prev, { ...product, qty }];
        });
        triggerCartBounce();
      };
      if (!user) {
        requireAuth(commit);
        return false; // deferred — caller should skip any post-add side effects
      }
      commit();
      return true;
    },
    [user, requireAuth, setCart, triggerCartBounce]
  );

  const removeFromCart = useCallback(
    (id) => {
      // Silent update -the list animates the item out (no toast).
      setCart((prev) => prev.filter((i) => i.id !== id));
    },
    [setCart]
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
      // Wishlist is open to everyone — no authentication required. Toggle
      // silently; the heart icon's filled/outline state is the only feedback.
      // The functional updater stays pure, so Strict Mode's double-invoke can't
      // duplicate the item.
      setWishlist((prev) =>
        prev.some((i) => i.id === product.id)
          ? prev.filter((i) => i.id !== product.id)
          : [...prev, product]
      );
    },
    [setWishlist]
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
  // Normalises a stored entry to a product id. Handles the legacy format where
  // whole product objects were persisted (entry.id) as well as the current
  // id-only format, so existing localStorage data keeps working after upgrade.
  const entryId = (entry) =>
    entry && typeof entry === "object" ? entry.id : entry;

  // Resolve persisted ids to complete, current product objects from the catalog.
  // Unknown ids (e.g. a product later removed) are dropped — that's the
  // fallback for missing data, so a card is never rendered without its details.
  const recentlyViewed = useMemo(
    () =>
      recentIds
        .map(entryId)
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean),
    [recentIds]
  );

  const addRecentlyViewed = useCallback(
    (product) => {
      const id = product?.id;
      if (id == null) return;
      setRecentIds((prev) => {
        const ids = prev.map(entryId).filter((x) => x != null);
        return [id, ...ids.filter((x) => x !== id)].slice(0, MAX_RECENT);
      });
    },
    [setRecentIds]
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

  // ── Auth (client-side engine in services/authApi — see its caveats) ──
  // Thin wrappers: update the mirrored `user` + toast on success, and re-throw
  // typed AuthErrors so each screen can show inline field / edge-case messages.
  const signup = useCallback(
    async (data) => {
      const res = await authApi.signup(data);
      setUser(res.user);
      addToast(`Welcome to Mohan-Maya, ${res.user.name}!`, "success");
      return res;
    },
    [addToast]
  );

  const login = useCallback(
    async (data) => {
      const res = await authApi.login(data);
      setUser(res.user);
      addToast(`Welcome back, ${res.user.name}!`, "success");
      return res;
    },
    [addToast]
  );

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    addToast("You've been logged out", "info");
  }, [addToast]);

  const updateProfile = useCallback(
    async (patch) => {
      const { user: updated } = await authApi.updateProfile(patch);
      setUser(updated);
      addToast("Profile updated", "success");
      return updated;
    },
    [addToast]
  );

  const changePassword = useCallback(
    async (data) => {
      await authApi.changePassword(data);
      addToast("Password changed successfully", "success");
    },
    [addToast]
  );

  // Stateless flows (no session change) — pass straight through to the engine.
  const forgotPassword = useCallback((data) => authApi.forgotPassword(data), []);
  const resetPassword = useCallback((data) => authApi.resetPassword(data), []);
  const resendVerification = useCallback((data) => authApi.resendVerification(data), []);
  const verifyEmail = useCallback(
    async (data) => {
      const res = await authApi.verifyEmail(data);
      // Reflect the verified flag if it's the signed-in user.
      setUser((prev) => (prev && prev.email === res.user.email ? { ...prev, verified: true } : prev));
      return res;
    },
    []
  );

  // ── Saved addresses (persisted, additive) ───────────────
  const addAddress = useCallback(
    (addr) => {
      setAddresses((prev) => {
        const id = `addr_${Date.now().toString(36)}${prev.length}`;
        const makeDefault = prev.length === 0 || addr.isDefault;
        const next = makeDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
        return [...next, { ...addr, id, isDefault: Boolean(makeDefault) }];
      });
      addToast("Address saved", "success");
    },
    [setAddresses, addToast]
  );

  const updateAddress = useCallback(
    (id, patch) => {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === id) return { ...a, ...patch };
          // Only one address can be the default.
          return patch.isDefault ? { ...a, isDefault: false } : a;
        })
      );
      addToast("Address updated", "success");
    },
    [setAddresses, addToast]
  );

  const removeAddress = useCallback(
    (id) => {
      setAddresses((prev) => {
        const next = prev.filter((a) => a.id !== id);
        // If we removed the default, promote the first remaining address.
        if (next.length && !next.some((a) => a.isDefault)) next[0].isDefault = true;
        return next;
      });
      addToast("Address removed", "info");
    },
    [setAddresses, addToast]
  );

  const setDefaultAddress = useCallback(
    (id) => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id }))),
    [setAddresses]
  );

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
    signup,
    register: signup, // backward-compatible alias
    login,
    logout,
    // auth modal + gated actions
    authModal,
    openAuthModal,
    closeAuthModal,
    requireAuth,
    completeAuth,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    // saved addresses
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
