import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuShoppingBag } from "react-icons/lu";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiX, FiMoon, FiSun, FiPlus, FiMinus, FiUser, FiLogOut, FiPackage, FiSettings, FiHeart, FiCheck } from "react-icons/fi";
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
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setProfileOpen(false));

  // Boolean-only scroll state → Header no longer re-renders every scroll frame.
  const scrolled = useScrollThreshold(50);
  const {
    darkMode,
    toggleDarkMode,
    cartCount,
    cart,
    removeFromCart,
    updateQty,
    wishlist,
    toggleWishlist,
    cartAnimating,
    cartSuccess,
    cartIconRef,
    coupon,
    couponCode,
    applyCoupon,
    removeCoupon,
    totals,
    user,
    logout,
    addToast,
  } = useApp();

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

  const goToCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) setCouponInput("");
  };

  // Navigate to the dedicated full-page auth screen (login/register tab).
  const goToAuth = (mode) => {
    setProfileOpen(false);
    setOpenMenu(false);
    navigate(`/auth?mode=${mode}`);
  };

  // Menu items for a logged-in user. `action` runs on click.
  const accountMenu = [
    { label: "My Profile", icon: FiUser, action: () => addToast("Profile page coming soon", "info") },
    { label: "My Orders", icon: FiPackage, action: () => navigate("/track") },
    { label: "Wishlist", icon: FiHeart, action: () => setWishlistOpen(true) },
    { label: "Settings", icon: FiSettings, action: () => addToast("Settings page coming soon", "info") },
  ];

  const initials = user?.name?.trim()?.[0]?.toUpperCase() || "U";

  return (
    <>
      {/* ── Navbar ── */}
      <motion.header
        className={`w-full fixed top-0 z-50 border-b-0 transition-all duration-300 ${
          scrolled
            ? "bg-[#e8d3d3b8] dark:bg-[#0d0508]/90 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-white/5"
            : darkMode
            ? "bg-[#1a0a0e]"
            : "bg-[#f0e0e3]"
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
            <div className="hidden sm:block">
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

            {/* Dark mode */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
              whileTap={{ rotate: 180, scale: 0.8 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </motion.button>

            {/* Wishlist — solid red heart when items are saved (no count badge) */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300"
              aria-label="Wishlist"
            >
              {wishlist.length > 0 ? (
                <FaHeart size={20} className="text-[#fe4462] transition-colors duration-300" />
              ) : (
                <FaRegHeart size={20} className="transition-colors duration-300" />
              )}
            </button>

            {/* Cart */}
            <button
              ref={cartIconRef}
              onClick={() => setCartOpen(true)}
              className={`relative p-2.5 rounded-full hover:bg-[#fe4462]/10 transition text-gray-700 dark:text-gray-300 ${cartAnimating ? "animate-cart-bounce" : ""}`}
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

              {/* Success tick — brief pop confirming the item was added */}
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
                onClick={() => (user ? setProfileOpen((v) => !v) : goToAuth("login"))}
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
                    className="absolute right-0 mt-3 w-60 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#1a0a0e] rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50"
                    role="menu"
                  >
                    <div className="flex items-center gap-3 p-4 border-b dark:border-white/10">
                      <span className="w-10 h-10 rounded-full bg-[#fe4462] text-white flex items-center justify-center font-bold">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="py-2">
                      {accountMenu.map(({ label, icon: Icon, action }) => (
                        <button
                          key={label}
                          role="menuitem"
                          onClick={() => { setProfileOpen(false); action(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#fe4462]/10 hover:text-[#fe4462] transition"
                        >
                          <Icon size={16} /> {label}
                        </button>
                      ))}
                      <button
                        role="menuitem"
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition border-t dark:border-white/10 mt-1"
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
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

      {/* ── Cart Drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[998]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-screen w-full max-w-[90vw] sm:max-w-[420px] bg-white dark:bg-[#1a0a0e] z-[999] flex flex-col shadow-2xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-6 border-b dark:border-white/10">
                <h2 className="text-xl font-bold dark:text-white">Shopping Cart ({cartCount})</h2>
                <button onClick={() => setCartOpen(false)} className="p-2.5 hover:text-[#fe4462] transition" aria-label="Close cart">
                  <FiX size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <LuShoppingBag size={48} className="text-gray-300" />
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                    <button onClick={() => { setCartOpen(false); navigate("/shop"); }} className="btn-primary text-sm">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 bg-gray-50 dark:bg-white/5 rounded-2xl p-3"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#f0e0e3] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate dark:text-white">{item.name}</p>
                        <p className="text-[#fe4462] text-sm font-bold">₹{item.price * item.qty}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-white/15 overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#fe4462] disabled:opacity-40"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              <FiMinus size={13} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold dark:text-white">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#fe4462]"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              <FiPlus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-[#fe4462] transition flex-shrink-0 self-start"
                        aria-label={`Remove ${item.name}`}
                      >
                        <FiX size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t dark:border-white/10 space-y-4">
                  {/* Coupon */}
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-500/10 rounded-xl px-3 py-2">
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        {couponCode} - {coupon.label}
                      </span>
                      <button onClick={removeCoupon} className="text-green-700 dark:text-green-400 hover:text-red-500" aria-label="Remove coupon">
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 bg-gray-100 dark:bg-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white uppercase placeholder:normal-case"
                      />
                      <button type="submit" className="btn-outline !py-2 !px-4 text-sm">Apply</button>
                    </form>
                  )}

                  {/* Totals */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Subtotal</span><span>₹{totals.subtotal}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span><span>−₹{totals.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <span>{totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t dark:border-white/10 font-bold text-base dark:text-white">
                      <span>Total</span>
                      <span className="text-[#fe4462]">₹{totals.total}</span>
                    </div>
                  </div>

                  <button onClick={goToCheckout} className="w-full btn-primary justify-center text-base">
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Wishlist Drawer ── */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[998]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-screen w-full max-w-[90vw] sm:max-w-[420px] bg-white dark:bg-[#1a0a0e] z-[999] flex flex-col shadow-2xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-6 border-b dark:border-white/10">
                <h2 className="text-xl font-bold dark:text-white">Wishlist</h2>
                <button onClick={() => setWishlistOpen(false)} className="p-2.5 hover:text-[#fe4462] transition" aria-label="Close wishlist">
                  <FiX size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <FaRegHeart size={48} className="text-gray-300" />
                    <p className="text-gray-500 dark:text-gray-400">No items in wishlist</p>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 rounded-2xl p-3"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#f0e0e3] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate dark:text-white">{item.name}</p>
                        <p className="text-[#fe4462] text-sm font-bold">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => toggleWishlist(item)}
                        aria-label="Remove from wishlist"
                        className="flex-shrink-0 grid place-items-center h-9 w-9 rounded-full hover:bg-[#fe4462]/10 transition-colors"
                      >
                        <FaHeart className="text-[#fe4462] transition-transform duration-200 hover:scale-110" size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              className="fixed top-0 right-0 h-screen w-[88vw] max-w-[340px] sm:w-[380px] sm:max-w-[380px] bg-[#0d0508] text-white z-[999] overflow-y-auto lg:hidden"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <img src="/header/logo.png" alt="logo" className="w-12 h-12 rounded-full" />
                  <span className="text-2xl font-black text-gradient">M&M</span>
                </div>
                <button
                  onClick={() => setOpenMenu(false)}
                  className="w-10 h-10 rounded-full bg-[#fe4462] flex items-center justify-center hover:bg-[#d93550] transition"
                  aria-label="Close menu"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); navigate(`/shop?search=${localSearch}`); setOpenMenu(false); }}
                  className="flex items-center gap-2 border-b border-gray-700 pb-4 mb-6"
                >
                  <input
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products…"
                    className="bg-transparent flex-1 text-sm placeholder-gray-500 outline-none focus:outline-none focus-visible:!outline-none"
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
                            : "text-gray-300 hover:bg-white/10"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </nav>

                {/* Account section (mobile) */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-11 h-11 rounded-full bg-[#fe4462] text-white flex items-center justify-center font-bold">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold truncate text-white">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {accountMenu.map(({ label, icon: Icon, action }) => (
                          <button
                            key={label}
                            onClick={() => { setOpenMenu(false); action(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition"
                          >
                            <Icon size={18} /> {label}
                          </button>
                        ))}
                        <button
                          onClick={() => { setOpenMenu(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition"
                        >
                          <FiLogOut size={18} /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <button onClick={() => goToAuth("login")} className="btn-primary w-full justify-center">Login</button>
                      <button onClick={() => goToAuth("register")} className="w-full py-3 rounded-xl border border-gray-700 text-gray-200 hover:border-[#fe4462] hover:text-[#fe4462] transition font-medium">
                        Register
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
                  <div className="space-y-4">
                    {[
                      { icon: FiMapPin, text: "Ganga Enclave, Roorkee, Uttarakhand, India" },
                      { icon: FiPhone, text: "+91 99567 48903" },
                      { icon: FiMail, text: "support@mohanmaya.in" },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-400">
                        <div className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#fe4462] hover:border-[#fe4462] hover:text-white transition cursor-pointer">
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
                      className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#fe4462] hover:border-[#fe4462] transition text-gray-400 hover:text-white"
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={toggleDarkMode}
                  className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-[#fe4462] hover:text-[#fe4462] transition w-full"
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                  <span className="text-sm font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}