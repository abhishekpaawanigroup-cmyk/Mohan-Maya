import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuShoppingBag } from "react-icons/lu";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiX, FiMoon, FiSun, FiUser, FiLogOut, FiPackage, FiSettings, FiHeart, FiCheck, FiCreditCard, FiTag, FiRotateCcw, FiStar, FiBell, FiHelpCircle, FiChevronRight } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { useScrollThreshold, useClickOutside } from "../../hooks/useHooks";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Shop", path: "/shop" },
  { label: "Contact", path: "/contact" },
  { label: "Community", path: "/Community" },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const profileRef = useClickOutside(() => setProfileOpen(false));

  // Boolean-only scroll state → Header no longer re-renders every scroll frame.
  const scrolled = useScrollThreshold(50);
  const {
    darkMode,
    toggleDarkMode,
    cartCount,
    wishlist,
    cartAnimating,
    cartSuccess,
    user,
    logout,
    addToast,
    requireAuth,
    openAuthModal,
    orders,
  } = useApp();

  // Protected nav targets open the auth modal (and resume) when signed out.
  const goProtected = (path) => requireAuth(() => navigate(path));

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (openMenu) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [openMenu]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(localSearch.trim())}`);
      setSearchOpen(false);
      setLocalSearch("");
    }
  };

  // Open the premium auth modal (logged-out profile / login / register).
  const openAuth = (mode) => {
    setProfileOpen(false);
    setOpenMenu(false);
    openAuthModal(mode);
  };

  // Account dropdown items. `to` navigates; `soon` shows a coming-soon toast
  // (UI ready, backend pending).
  const accountMenu = [
    { label: "My Profile", icon: FiUser, to: "/profile" },
    { label: "My Orders", icon: FiPackage, to: "/track" },
    { label: "Wishlist", icon: FiHeart, to: "/wishlist" },
    { label: "My Cart", icon: LuShoppingBag, to: "/cart" },
    { label: "Manage Addresses", icon: FiMapPin, to: "/profile" },
    { label: "Payment Methods", icon: FiCreditCard, soon: true },
    { label: "Coupons & Offers", icon: FiTag, soon: true },
    { label: "Returns & Refunds", icon: FiRotateCcw, soon: true },
    { label: "Reviews & Ratings", icon: FiStar, soon: true },
    { label: "Notifications", icon: FiBell, soon: true },
    { label: "Help & Support", icon: FiHelpCircle, to: "/faq" },
    { label: "Account Settings", icon: FiSettings, to: "/profile" },
  ];

  // Run a menu item, closing whichever surface it was opened from.
  const onMenuItem = (item, close) => {
    close?.();
    if (item.soon) addToast(`${item.label} — coming soon`, "info");
    else navigate(item.to);
  };

  const initials = user?.name?.trim()?.[0]?.toUpperCase() || "U";

  // ESC closes the profile dropdown / logout confirmation.
  useEffect(() => {
    if (!profileOpen && !confirmLogout) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setConfirmLogout(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileOpen, confirmLogout]);

  return (
    <>
      {/* ── Navbar ── */}
      <motion.header
        className={`w-full fixed top-0 z-50 border-b-0 transition-all duration-300 ${
          scrolled
            ? "bg-[#fbfefbcc] dark:bg-[#0d0508]/90 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-white/5"
            : darkMode
            ? "bg-[#1a0a0e]"
            : "bg-[#fbfefb]"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#fe4462]/30 group-hover:ring-[#fe4462] transition-all duration-300">
              <img src="/header/logo.png" alt="Mohan Maya logo" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="block">
              <span className="block text-2xl font-black text-gradient leading-none">M&amp;M</span>
              <p className="text-[10px] tracking-widest text-gray-500 dark:text-gray-400 uppercase">Mohan Maya</p>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === "/"}
                    className={({ isActive }) =>
                      `relative font-semibold text-[15px] transition-colors duration-200 group
                       ${isActive ? "text-[#fe4462]" : "text-gray-700 dark:text-gray-300 hover:text-[#fe4462]"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-[#fe4462] transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
              aria-label="Search"
            >
              <IoSearch size={22} />
            </button>

            {/* Dark mode -desktop only; on mobile/tablet it lives in the side menu */}
            <motion.button
              onClick={toggleDarkMode}
              className="max-lg:hidden p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
              whileTap={{ rotate: 180, scale: 0.8 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </motion.button>

            {/* Wishlist -desktop only; on mobile/tablet it lives in the side menu */}
            <button
              onClick={() => navigate("/wishlist")}
              className="max-lg:hidden p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
              aria-label="Wishlist"
            >
              {wishlist.length > 0 ? (
                <FaHeart size={20} className="text-[#fe4462] transition-colors duration-300" />
              ) : (
                <FaRegHeart size={20} className="transition-colors duration-300" />
              )}
            </button>

            {/* Cart -requires login: opens the auth modal when signed out, then
                continues to the cart after a successful login/registration. */}
            <button
              onClick={() => goProtected("/cart")}
              className={`max-lg:hidden relative p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300 ${cartAnimating ? "animate-cart-bounce" : ""}`}
              aria-label="Cart"
            >
              <LuShoppingBag size={22} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-[#fe4462] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}

              {/* Success tick -brief pop confirming the item was added */}
              <AnimatePresence>
                {cartSuccess && (
                  <motion.span
                    key="cart-tick"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 18 }}
                    className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md pointer-events-none"
                  >
                    <FiCheck size={15} strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Profile (desktop) */}
            <div className="relative hidden lg:block" ref={profileRef}>
              <button
                onClick={() => (user ? setProfileOpen((v) => !v) : openAuth("login"))}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
                aria-label={user ? "Account menu" : "Sign in"}
                aria-haspopup={user ? "true" : undefined}
                aria-expanded={user ? profileOpen : undefined}
              >
                {user ? (
                  <span className="w-9 h-9 rounded-full bg-[#fe4462] text-white flex items-center justify-center font-bold text-sm">
                    {initials}
                  </span>
                ) : (
                  <span className="w-9 h-9 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center">
                    <FiUser size={18} />
                  </span>
                )}
                {user && <span className="text-sm font-semibold max-w-[90px] truncate">{user.name}</span>}
              </button>

              <AnimatePresence>
                {profileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#1a0a0e] rounded-lg shadow-xl ring-1 ring-gray-200/70 dark:ring-white/10 overflow-hidden z-50"
                    role="menu"
                    aria-label="Account menu"
                  >
                    {/* Header: avatar, name, email + order/cart counts (light theme) */}
                    <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-full bg-[#fe4462] text-white ring-2 ring-[#fe4462]/20 flex items-center justify-center font-bold">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold truncate text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/track"); }}
                          className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-left transition hover:border-[#fe4462]"
                        >
                          <span className="block text-lg font-bold leading-none text-[#fe4462]">{orders.length}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">Orders</span>
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/cart"); }}
                          className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-left transition hover:border-[#fe4462]"
                        >
                          <span className="block text-lg font-bold leading-none text-[#fe4462]">{cartCount}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">In Cart</span>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable menu */}
                    <div className="max-h-[min(60vh,360px)] overflow-y-auto py-1.5">
                      {accountMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            role="menuitem"
                            onClick={() => onMenuItem(item, () => setProfileOpen(false))}
                            className="group w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#fe4462]/10 hover:text-[#fe4462] transition"
                          >
                            <Icon size={16} className="shrink-0 text-gray-400 group-hover:text-[#fe4462] transition-colors" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.soon ? (
                              <span className="rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Soon
                              </span>
                            ) : (
                              <FiChevronRight size={15} className="text-gray-300 group-hover:text-[#fe4462] transition-colors" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Logout (opens confirmation) */}
                    <button
                      role="menuitem"
                      onClick={() => { setProfileOpen(false); setConfirmLogout(true); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition border-t dark:border-white/10"
                    >
                      <FiLogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setOpenMenu(true)}
              className="lg:hidden p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
              aria-label="Open menu"
            >
              <MdMenu size={28} />
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100 dark:border-white/10 bg-white/95 dark:bg-[#1a0a0e]/95 backdrop-blur-xl"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                <input
                  ref={searchRef}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  type="text"
                  placeholder="Search miniatures, characters…"
                  className="flex-1 bg-gray-100 dark:bg-white/10 !rounded-full px-5 py-3 text-sm font-medium placeholder-gray-400 dark:text-white border border-transparent outline-none focus:outline-none focus-visible:!outline-none focus:bg-gray-200/70 dark:focus:bg-white/15 focus:border-gray-300 dark:focus:border-white/20 transition-colors"
                />
                <button type="submit" className="btn-primary !py-3 !px-5 text-sm" aria-label="Submit search">
                  <IoSearch size={18} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2.5 text-gray-500 hover:text-[#fe4462]" aria-label="Close search">
                  <FiX size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {openMenu && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[998] lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 h-screen w-[88vw] max-w-[340px] sm:w-[380px] sm:max-w-[380px] bg-white text-gray-900 dark:bg-[#0d0508] dark:text-white z-[999] overflow-y-auto lg:hidden transition-colors duration-300"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <img src="/header/logo.png" alt="logo" className="w-12 h-12 rounded-full" />
                  <span className="text-2xl font-black text-gradient">M&M</span>
                </div>
                <button
                  onClick={() => setOpenMenu(false)}
                  className="w-10 h-10 rounded-full bg-[#fe4462] text-white flex items-center justify-center hover:bg-[#d93550] transition"
                  aria-label="Close menu"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); navigate(`/shop?search=${localSearch}`); setOpenMenu(false); }}
                  className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6"
                >
                  <input
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products…"
                    className="bg-transparent flex-1 text-sm placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:outline-none focus-visible:!outline-none"
                  />
                  <button type="submit" aria-label="Submit search"><IoSearch size={20} className="text-gray-400 hover:text-[#fe4462] transition" /></button>
                </form>

                <nav className="space-y-1">
                  {navLinks.map(({ label, path }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end={path === "/"}
                      onClick={() => setOpenMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-[#fe4462] text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </nav>

                {/* Quick actions — Wishlist, Cart, Theme toggle (relocated from the header) */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-1">
                  <button
                    onClick={() => { setOpenMenu(false); navigate("/wishlist"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition"
                  >
                    {wishlist.length > 0 ? <FaHeart size={18} className="text-[#fe4462]" /> : <FaRegHeart size={18} />}
                    <span className="flex-1 text-left">Wishlist</span>
                    {wishlist.length > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#fe4462] px-1.5 text-[10px] font-bold text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { setOpenMenu(false); goProtected("/cart"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition"
                  >
                    <LuShoppingBag size={18} />
                    <span className="flex-1 text-left">Cart</span>
                    {cartCount > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#fe4462] px-1.5 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition"
                  >
                    {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                    <span className="flex-1 text-left">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                </div>

                {/* Account section (mobile) */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-11 h-11 rounded-full bg-[#fe4462] text-white flex items-center justify-center font-bold">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold truncate text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {/* Wishlist & Cart live in the quick-actions section above, so they're excluded here to avoid duplicates. */}
                        {accountMenu
                          .filter((item) => item.to !== "/wishlist" && item.to !== "/cart")
                          .map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.label}
                                onClick={() => onMenuItem(item, () => setOpenMenu(false))}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition"
                              >
                                <Icon size={18} /> <span className="flex-1 text-left">{item.label}</span>
                                {item.soon && (
                                  <span className="rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Soon</span>
                                )}
                              </button>
                            );
                          })}
                        <button
                          onClick={() => { setOpenMenu(false); setConfirmLogout(true); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 dark:text-red-400 transition"
                        >
                          <FiLogOut size={18} /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <button onClick={() => openAuth("login")} className="btn-primary w-full justify-center">Login</button>
                      <button onClick={() => openAuth("register")} className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200 hover:border-[#fe4462] hover:text-[#fe4462] transition font-medium">
                        Register
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Contact</h3>
                  <div className="space-y-4">
                    {[
                      { icon: FiMapPin, text: "Ganga Enclave, Roorkee, Uttarakhand, India" },
                      { icon: FiPhone, text: "+91 99567 48903" },
                      { icon: FiMail, text: "support@mohanmaya.in" },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <div className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-[#fe4462] hover:border-[#fe4462] hover:text-white transition cursor-pointer">
                          <Icon size={15} />
                        </div>
                        <span className="text-sm">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  {[
                    { Icon: FaFacebookF, label: "Facebook" },
                    { Icon: FaTwitter, label: "Twitter" },
                    { Icon: FaInstagram, label: "Instagram" },
                    { Icon: FaYoutube, label: "YouTube" },
                  ].map(({ Icon, label }, i) => (
                    <button
                      key={i}
                      aria-label={label}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-[#fe4462] hover:border-[#fe4462] transition text-gray-500 dark:text-gray-400 hover:text-white"
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Logout confirmation ── */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#140a0d] p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-500/10 text-red-500">
                <FiLogOut size={26} />
              </div>
              <h3 id="logout-title" className="mt-4 text-center text-lg font-bold text-gray-900 dark:text-white">
                Sign out of your account?
              </h3>
              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                You'll need to sign in again to access your orders, wishlist, and cart.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 rounded-full border border-gray-200 dark:border-white/15 px-5 py-2.5 font-semibold text-gray-600 dark:text-gray-300 transition hover:border-[#fe4462] hover:text-[#fe4462]"
                >
                  Cancel
                </button>
                <button
                  autoFocus
                  onClick={() => { setConfirmLogout(false); logout(); navigate("/"); }}
                  className="flex-1 rounded-full bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600 active:scale-95"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}