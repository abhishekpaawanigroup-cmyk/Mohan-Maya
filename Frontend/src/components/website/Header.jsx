import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuShoppingBag } from "react-icons/lu";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import {
  FiMapPin, FiX, FiMoon, FiSun, FiUser, FiLogOut, FiPackage,
  FiSettings, FiHeart, FiCheck, FiCreditCard, FiTag, FiRotateCcw, FiStar,
  FiHelpCircle, FiChevronRight, FiChevronDown, FiGrid, FiMenu, FiShoppingBag,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { useI18n } from "../../context/I18nContext";
import { useScrollThreshold, useClickOutside } from "../../hooks/useHooks";
import { categories } from "../../data/products";
import HeaderSearch from "./HeaderSearch";
import AnnouncementBar from "./AnnouncementBar";
import NotificationBell from "./NotificationBell";

// Secondary-nav links. Labels are i18n keys resolved at render. "New Arrivals"
// and "Best Sellers" jump to the matching Home sections (hash routes handled by
// ScrollToTop); the remaining "discover" entry funnels into the Shop PLP.
const NAV = [
  { key: "nav.home", to: "/", end: true },
  { key: "nav.products", to: "/shop" },
  { key: "nav.newArrivals", to: "/#upcoming", discover: true, badge: "soon" },
  { key: "nav.bestSellers", to: "/#best-sellers", discover: true, badge: "hot" },
  { key: "nav.offers", to: "/shop", discover: true },
  { key: "nav.about", to: "/about" },
  { key: "nav.contact", to: "/contact" },
  { key: "nav.customerService", to: "/customer-service" },
  { key: "nav.community", to: "/Community" },
];

// Compact nav badges ("Soon" / "Hot"). Solid brand fill for Hot (with a subtle
// pulsing dot) and a soft brand-tinted pill for Soon — both on-theme, tiny, and
// vertically centered so they never change nav row height or spacing.
const NAV_BADGE_STYLES = {
  hot: "bg-[#fe4462] text-white shadow-sm shadow-[#fe4462]/30",
  soon: "bg-[#fe4462]/10 text-[#fe4462] ring-1 ring-inset ring-[#fe4462]/20 dark:bg-[#fe4462]/15",
};

function NavBadge({ type }) {
  if (!type) return null;
  const isHot = type === "hot";
  return (
    <span
      className={`ml-1.5 inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide ${NAV_BADGE_STYLES[type]}`}
    >
      {isHot && (
        <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" aria-hidden="true" />
      )}
      {isHot ? "Hot" : "Soon"}
    </span>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const scrolled = useScrollThreshold(50);

  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const profileRef = useClickOutside(() => setProfileOpen(false));
  const catRef = useClickOutside(() => setCatOpen(false));

  const {
    darkMode, toggleDarkMode, cartCount, wishlist, cartAnimating, cartSuccess,
    user, logout, addToast, requireAuth, openAuthModal, orders,
  } = useApp();
  const { t, lang, setLang, languages } = useI18n();

  // Shared row style for the mobile drawer (reused across every section).
  const drawerItemCls =
    "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10";

  // Protected targets open the auth modal (and resume) when signed out.
  const goProtected = (path) => requireAuth(() => navigate(path));

  const openAuth = (mode) => {
    setProfileOpen(false);
    setOpenMenu(false);
    openAuthModal(mode);
  };

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openMenu]);

  // Escape closes any open header surface.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setProfileOpen(false);
      setCatOpen(false);
      setConfirmLogout(false);
      setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const accountMenu = [
    { label: "My Profile", key: "account.myProfile", icon: FiUser, to: "/profile" },
    { label: "My Orders", key: "account.myOrders", icon: FiPackage, to: "/orders" },
    { label: "Wishlist", key: "account.wishlist", icon: FiHeart, to: "/wishlist" },
    { label: "My Cart", key: "account.myCart", icon: LuShoppingBag, to: "/cart" },
    { label: "Manage Addresses", key: "account.addresses", icon: FiMapPin, to: "/profile" },
    { label: "Payment Methods", icon: FiCreditCard, soon: true },
    { label: "Coupons & Offers", icon: FiTag, soon: true },
    { label: "Returns & Refunds", icon: FiRotateCcw, soon: true },
    { label: "Reviews & Ratings", icon: FiStar, soon: true },
    { label: "Help & Support", key: "account.help", icon: FiHelpCircle, to: "/faq" },
    { label: "Account Settings", key: "account.settings", icon: FiSettings, to: "/profile" },
  ];

  // Resolve a menu item's display text (translated when a key exists).
  const menuText = (item) => (item.key ? t(item.key, item.label) : item.label);

  const onMenuItem = (item, close) => {
    close?.();
    if (item.soon) addToast(`${menuText(item)} - coming soon`, "info");
    else navigate(item.to);
  };

  const goCategory = (c, close) => {
    close?.();
    navigate(c === categories[0] ? "/shop" : `/shop?search=${encodeURIComponent(c)}`);
  };

  const goNav = (item, close) => {
    close?.();
    navigate(item.to);
  };

  const initials = user?.name?.trim()?.[0]?.toUpperCase() || "U";
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "";

  const navLinkCls = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
      isActive
        ? "text-[#fe4462] bg-[#fe4462]/10"
        : "text-gray-700 hover:bg-[#fe4462]/10 hover:text-[#fe4462] dark:text-gray-300"
    }`;

  return (
    <>
      <motion.header
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-black/5 bg-white/85 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur-lg dark:border-white/5 dark:bg-[#0d0508]/85"
            : "border-transparent bg-[#fbfefb] dark:bg-[#1a0a0e]"
        }`}
      >
        {/* ── Announcement bar ── */}
        <AnnouncementBar />

        {/* ── Main row ── */}
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-10 py-8">
          {/* Logo */}
          <NavLink to="/" className="group flex shrink-0 items-center gap-2" aria-label="Mohan Maya - home">
            <span className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-[#fe4462]/30 transition group-hover:ring-[#fe4462]">
              <img src="/header/logo.png" alt="" className="h-full w-full object-cover" />
            </span>
            <span className="hidden leading-none min-[360px]:block">
              <span className="block text-2xl font-black text-gradient">M&amp;M</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Mohan Maya</span>
            </span>
          </NavLink>

          {/* Inline search (tablet + desktop) */}
          <div className="hidden flex-1 justify-center px-2 md:flex lg:px-4">
            <HeaderSearch className="w-full max-w-2xl" />
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="rounded-full p-2.5 text-gray-700 transition hover:bg-[#fe4462]/10 dark:text-gray-200 md:hidden"
            >
              <IoSearch size={22} />
            </button>

            {/* Theme */}
            <motion.button
              onClick={toggleDarkMode}
              whileTap={{ rotate: 180, scale: 0.85 }}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="hidden rounded-full p-2.5 text-gray-700 transition hover:bg-[#fe4462]/10 dark:text-gray-200 lg:inline-flex"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </motion.button>

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} items` : ""}`}
              className="relative hidden rounded-full p-2.5 transition hover:bg-[#fe4462]/10 lg:inline-flex"
            >
              {wishlist.length > 0
                ? <FaHeart size={20} className="text-[#fe4462]" />
                : <FaRegHeart size={20} className="text-gray-700 dark:text-gray-200" />}
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#fe4462] px-1 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Notifications - sized to match the Wishlist icon exactly */}
            <NotificationBell
              iconSize={20}
              buttonClass="relative inline-flex items-center justify-center rounded-full p-2.5 text-gray-700 outline-none transition hover:bg-[#fe4462]/10 dark:text-gray-200"
            />

            {/* Cart */}
            <button
              onClick={() => goProtected("/cart")}
              aria-label={`${t("account.cart")}${cartCount ? `, ${cartCount}` : ""}`}
              className={`relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-[#fe4462]/10 ${cartAnimating ? "animate-cart-bounce" : ""}`}
            >
              <span className="relative">
                <LuShoppingBag size={23} className="text-gray-700 dark:text-gray-200" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#fe4462] px-1 text-[10px] font-bold text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
                <AnimatePresence>
                  {cartSuccess && (
                    <motion.span
                      key="tick"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 18 }}
                      className="pointer-events-none absolute inset-0 m-auto grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white shadow"
                    >
                      <FiCheck size={13} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="hidden text-sm font-bold text-gray-800 dark:text-white xl:inline">{t("account.cart")}</span>
            </button>

            {/* Returns / Orders (stacked label) */}
            <button
              onClick={() => goProtected("/orders")}
              className="hidden flex-col items-start rounded-lg px-2.5 py-1 leading-tight transition hover:bg-[#fe4462]/10 xl:flex"
            >
              <span className="text-[12px] font-bold text-gray-800 dark:text-white">{t("account.returns")}</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">{t("account.andOrders")}</span>
            </button>

            {/* Account (desktop) */}
            <div className="relative hidden lg:block" ref={profileRef}>
              <button
                onClick={() => (user ? setProfileOpen((v) => !v) : openAuth("login"))}
                aria-label={user ? "Account menu" : "Sign in"}
                aria-haspopup={user ? "menu" : undefined}
                aria-expanded={user ? profileOpen : undefined}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-[#fe4462]/10"
              >
                {user ? (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fe4462] text-sm font-bold text-white">{initials}</span>
                ) : (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-300 text-gray-600 dark:border-white/20 dark:text-gray-300">
                    <FiUser size={18} />
                  </span>
                )}
                <span className="hidden leading-tight xl:block">
                  <span className="block max-w-[110px] truncate text-[12px] font-bold text-gray-800 dark:text-white">
                    {user ? `${t("account.hello")} ${firstName}` : t("account.helloSignIn")}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white">
                    {t("account.account")} <FiChevronDown size={13} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </span>
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    role="menu"
                    aria-label="Account menu"
                    className="absolute right-0 z-50 mt-3 w-72 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-200/70 dark:bg-[#1a0a0e] dark:ring-white/10"
                  >
                    <div className="border-b border-gray-100 bg-gray-50/60 p-4 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#fe4462] font-bold text-white ring-2 ring-[#fe4462]/20">{initials}</span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button onClick={() => { setProfileOpen(false); navigate("/orders"); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-[#fe4462] dark:border-white/10 dark:bg-white/5">
                          <span className="block text-lg font-bold leading-none text-[#fe4462]">{orders.length}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{t("account.orders")}</span>
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate("/cart"); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-[#fe4462] dark:border-white/10 dark:bg-white/5">
                          <span className="block text-lg font-bold leading-none text-[#fe4462]">{cartCount}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{t("account.inCart")}</span>
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[min(60vh,360px)] overflow-y-auto py-1.5">
                      {accountMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            role="menuitem"
                            onClick={() => onMenuItem(item, () => setProfileOpen(false))}
                            className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462] dark:text-gray-200"
                          >
                            <Icon size={16} className="shrink-0 text-gray-400 transition-colors group-hover:text-[#fe4462]" />
                            <span className="flex-1 text-left">{menuText(item)}</span>
                            {item.soon
                              ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:bg-white/10">Soon</span>
                              : <FiChevronRight size={15} className="text-gray-300 transition-colors group-hover:text-[#fe4462]" />}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      role="menuitem"
                      onClick={() => { setProfileOpen(false); setConfirmLogout(true); }}
                      className="flex w-full items-center gap-3 border-t px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10 dark:border-white/10"
                    >
                      <FiLogOut size={16} /> {t("account.logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setOpenMenu(true)}
              aria-label={t("menu.menu")}
              className="rounded-full p-2.5 text-gray-700 transition hover:bg-[#fe4462]/10 dark:text-gray-200 lg:hidden"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>

        {/* Expandable mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="mobile-search"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="border-t border-gray-100 px-3 py-3 dark:border-white/10 sm:px-4 md:hidden"
            >
              <HeaderSearch autoFocus className="w-full" onNavigate={() => setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Secondary nav row (desktop) ── */}
        <div className="hidden border-t border-gray-100 dark:border-white/10 lg:block py-1">
          <div className="mx-auto w-full max-w-[1600px] px-8">
            <nav aria-label="Primary" className="flex h-9 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Categories dropdown */}
              <div className="relative shrink-0" ref={catRef}>
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={catOpen}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-bold text-gray-800 transition  dark:text-white"
                >
                  <FiGrid size={15} /> {t("nav.categories")}
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      aria-label="Categories"
                      className="absolute left-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-xl bg-white py-1.5 shadow-xl ring-1 ring-gray-200/70 dark:bg-[#1a0a0e] dark:ring-white/10"
                    >
                      {categories.map((c) => (
                        <button
                          key={c}
                          role="menuitem"
                          onClick={() => goCategory(c, () => setCatOpen(false))}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462] dark:text-gray-200"
                        >
                          <FiChevronRight size={14} className="text-gray-300" /> {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="mx-1 h-5 w-px shrink-0 bg-gray-200 dark:bg-white/10" aria-hidden="true" />

              <ul className="flex items-center gap-0.5">
                {NAV.map((item) => (
                  <li key={item.key} className="shrink-0">
                    {item.discover ? (
                      <button onClick={() => goNav(item)} className="inline-flex items-center rounded-md px-3 py-1.5 text-[13px] font-semibold text-gray-700 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462] dark:text-gray-300">
                        {t(item.key)}
                        <NavBadge type={item.badge} />
                      </button>
                    ) : (
                      <NavLink to={item.to} end={item.end} className={navLinkCls}>
                        {t(item.key)}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {openMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-[998] bg-black/60 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[999] flex w-[88vw] max-w-[360px] flex-col bg-white text-gray-900 dark:bg-[#0d0508] dark:text-white lg:hidden"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              {/* Drawer header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <img src="/header/logo.png" alt="" className="h-10 w-10 rounded-full ring-2 ring-[#fe4462]/30" />
                  <div className="leading-none">
                    <span className="block text-lg font-black text-gradient">M&amp;M</span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Mohan Maya</span>
                  </div>
                </div>
                <button onClick={() => setOpenMenu(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full bg-[#fe4462] text-white transition hover:bg-[#d93550]">
                  <FiX size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto pb-6">
                {/* User profile */}
                <div className="p-4">
                  {user ? (
                    <button
                      onClick={() => { setOpenMenu(false); navigate("/profile"); }}
                      className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-[#fe4462]/10 to-[#c48212]/10 p-3.5 text-left ring-1 ring-[#fe4462]/15 transition hover:ring-[#fe4462]/40"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fe4462] text-lg font-bold text-white">{initials}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-gray-900 dark:text-white">{user.name}</span>
                        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                      </span>
                      <FiChevronRight className="shrink-0 text-gray-400" />
                    </button>
                  ) : (
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => openAuth("login")} className="btn-primary justify-center">{t("account.login")}</button>
                        <button onClick={() => openAuth("register")} className="btn-outline justify-center">{t("account.register")}</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <DrawerSection title={t("menu.menu")}>
                  {NAV.map((item) =>
                    item.discover ? (
                      <button key={item.key} onClick={() => goNav(item, () => setOpenMenu(false))} className={drawerItemCls}>
                        <span className="flex-1 text-left">{t(item.key)}</span>
                        <NavBadge type={item.badge} />
                      </button>
                    ) : (
                      <NavLink
                        key={item.key}
                        to={item.to}
                        end={item.end}
                        onClick={() => setOpenMenu(false)}
                        className={({ isActive }) => `${drawerItemCls} ${isActive ? "!bg-[#fe4462] !text-white hover:!bg-[#fe4462]" : ""}`}
                      >
                        {t(item.key)}
                      </NavLink>
                    )
                  )}
                </DrawerSection>

                {/* Categories */}
                <DrawerSection title={t("menu.categories")}>
                  {categories.map((c) => (
                    <button key={c} onClick={() => goCategory(c, () => setOpenMenu(false))} className={drawerItemCls}>
                      <FiGrid size={17} className="shrink-0 text-gray-400" /> <span className="flex-1 text-left">{c}</span>
                    </button>
                  ))}
                </DrawerSection>

                {/* Quick access */}
                <DrawerSection title={t("menu.quickActions")}>
                  <button onClick={() => { setOpenMenu(false); goProtected("/orders"); }} className={drawerItemCls}>
                    <FiShoppingBag size={18} /> <span className="flex-1 text-left">{t("account.orders")}</span>
                    {orders.length > 0 && <Badge>{orders.length}</Badge>}
                  </button>
                  <button onClick={() => { setOpenMenu(false); navigate("/wishlist"); }} className={drawerItemCls}>
                    {wishlist.length > 0 ? <FaHeart size={18} className="text-[#fe4462]" /> : <FaRegHeart size={18} />}
                    <span className="flex-1 text-left">{t("account.wishlist")}</span>
                    {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
                  </button>
                  <button onClick={() => { setOpenMenu(false); goProtected("/cart"); }} className={drawerItemCls}>
                    <LuShoppingBag size={18} /> <span className="flex-1 text-left">{t("account.cart")}</span>
                    {cartCount > 0 && <Badge>{cartCount}</Badge>}
                  </button>
                </DrawerSection>

                {/* Settings (signed in) */}
                {user && (
                  <DrawerSection title={t("menu.account")}>
                    {accountMenu
                      .filter((item) => !["/wishlist", "/cart", "/orders"].includes(item.to))
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <button key={item.label} onClick={() => onMenuItem(item, () => setOpenMenu(false))} className={drawerItemCls}>
                            <Icon size={18} /> <span className="flex-1 text-left">{menuText(item)}</span>
                            {item.soon && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:bg-white/10">Soon</span>}
                          </button>
                        );
                      })}
                  </DrawerSection>
                )}

                {/* Preferences: theme + language */}
                <DrawerSection title={t("menu.preferences")}>
                  <button onClick={toggleDarkMode} className={drawerItemCls}>
                    {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                    <span className="flex-1 text-left">{darkMode ? t("menu.lightMode") : t("menu.darkMode")}</span>
                  </button>
                  <div className="mt-1 flex flex-wrap gap-2 px-1">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        aria-pressed={lang === l.code}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          lang === l.code
                            ? "border-[#fe4462] bg-[#fe4462]/10 text-[#fe4462]"
                            : "border-gray-200 text-gray-600 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/10 dark:text-gray-300"
                        }`}
                      >
                        {l.native}
                      </button>
                    ))}
                  </div>
                </DrawerSection>

                {/* Logout */}
                {user && (
                  <div className="px-4 pt-4">
                    <button
                      onClick={() => { setOpenMenu(false); setConfirmLogout(true); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:text-red-400"
                    >
                      <FiLogOut size={18} /> {t("account.logout")}
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Logout confirmation ── */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmLogout(false)}
            role="presentation"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              className="max-h-full w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-500/10 text-red-500">
                <FiLogOut size={26} />
              </div>
              <h3 id="logout-title" className="mt-4 text-center text-lg font-bold text-gray-900 dark:text-white">{t("logout.title")}</h3>
              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">{t("logout.desc")}</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setConfirmLogout(false)} className="flex-1 rounded-full border border-gray-200 px-5 py-2.5 font-semibold text-gray-600 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-300">{t("logout.cancel")}</button>
                <button autoFocus onClick={() => { setConfirmLogout(false); logout(); navigate("/"); }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600 active:scale-95">{t("account.logout")}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Badge({ children }) {
  return (
    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#fe4462] px-1.5 text-[10px] font-bold text-white">
      {children}
    </span>
  );
}

// Titled, separated block used to structure the mobile drawer.
function DrawerSection({ title, children }) {
  return (
    <div className="border-t border-gray-100 px-4 py-3 dark:border-white/10">
      {title && (
        <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
