import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiLogOut,
  FiUser,
  FiMail,
  FiPhone,
  FiPackage,
  FiHeart,
  FiShoppingBag,
  FiCreditCard,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiLock,
  FiSettings,
  FiShield,
  FiChevronRight,
  FiMoon,
  FiSun,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";
import ScrollReveal from "../../../components/common/ScrollReveal";
import RecentlyViewed from "../../../components/product/RecentlyViewed";
import { AccountModals } from "./accountModals";

const card =
  "rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm transition-shadow duration-300 hover:shadow-lg";

/* Small labelled row used inside the info cards. */
function InfoRow({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fe4462]/10 text-[#fe4462]">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className={`truncate text-sm font-semibold ${muted ? "text-gray-400 dark:text-gray-500 italic font-normal" : "text-gray-800 dark:text-gray-100"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, value, label, to, accent = "#fe4462" }) {
  const inner = (
    <motion.div
      whileHover={{ y: -4 }}
      className={`${card} flex items-center gap-4 p-4 sm:p-5 ${to ? "cursor-pointer" : ""}`}
    >
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-md"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        <Icon size={22} />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none tabular-nums text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

/* Friendly empty state shared by the summary cards. */
function EmptyState({ icon: Icon, title, hint, cta }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10 py-8 px-4 text-center">
      <span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#fe4462]/10 text-[#fe4462]">
        <Icon size={26} />
      </span>
      <p className="font-semibold text-gray-800 dark:text-gray-100">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs">{hint}</p>}
      {cta && (
        <Link
          to={cta.to}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fe4462] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-[#d93550]"
        >
          {cta.label} <FiChevronRight />
        </Link>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
        <Icon className="text-[#fe4462]" size={20} /> {children}
      </h2>
      {action}
    </div>
  );
}

export default function Profile() {
  usePageMeta("My Profile - Mohan Maya", "Manage your Mohan Maya profile, addresses, orders and account settings.");

  const {
    user,
    logout,
    orders,
    wishlist,
    cartCount,
    addresses,
    removeAddress,
    setDefaultAddress,
    darkMode,
    toggleDarkMode,
  } = useApp();
  const navigate = useNavigate();

  // [modal, editingAddress] - only one modal is mounted at a time.
  const [modal, setModal] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  // Guard: profile is only for signed-in users.
  if (!user) return <Navigate to="/auth?mode=login" replace />;

  const initials = user.name?.trim()?.[0]?.toUpperCase() || "U";
  const totalSpent = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  const firstName = user.name?.trim()?.split(" ")[0] || "there";

  const openAddress = (addr = null) => {
    setEditingAddress(addr);
    setModal("address");
  };
  const closeModal = () => {
    setModal(null);
    setEditingAddress(null);
  };
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const fmtDate = (ts) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="bg-[#fbfefb] dark:bg-[#0d0508]">
      {/* ── Premium profile hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1b1016] via-[#23121a] to-[#0d0508] pt-28 pb-20 sm:pb-24 text-white">
        <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#fe4462]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[#c48212]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full bg-gradient-to-br from-[#fe4462] to-[#c48212] text-4xl font-black shadow-2xl ring-4 ring-white/15">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-[#1b1016]">
                <FiCheckCircle size={16} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#fe4462]/60 bg-[#fe4462]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#fe4462]">
                <HiSparkles size={13} /> Member
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome back, <span className="text-[#fe4462]">{firstName}</span>
              </h1>
              <p className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-white/70 text-sm">
                <span className="inline-flex items-center justify-center sm:justify-start gap-2"><FiUser size={14} /> {user.name}</span>
                <span className="inline-flex items-center justify-center sm:justify-start gap-2"><FiMail size={14} /> {user.email}</span>
              </p>
            </div>

            {/* Hero actions */}
            <div className="flex w-full sm:w-auto flex-col gap-3">
              <button
                onClick={() => setModal("edit")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#1b1016] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95"
              >
                <FiEdit2 size={16} /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white/90 transition-all duration-300 hover:border-[#fe4462] hover:text-[#fe4462] active:scale-95"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="relative -mt-12 sm:-mt-14 pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile icon={FiPackage} value={orders.length} label="Orders" to="/track" />
            <StatTile icon={FiHeart} value={wishlist.length} label="Wishlist" to="/wishlist" accent="#fe4462" />
            <StatTile icon={FiShoppingBag} value={cartCount} label="In Cart" to="/cart" accent="#c48212" />
            <StatTile icon={FiCreditCard} value={`₹${totalSpent}`} label="Total Spent" accent="#c48212" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal information */}
            <ScrollReveal className="lg:col-span-2">
              <div className={`${card} p-6`}>
                <SectionTitle
                  icon={FiUser}
                  action={
                    <button
                      onClick={() => setModal("edit")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/15 px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 transition hover:border-[#fe4462] hover:text-[#fe4462]"
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                  }
                >
                  Personal Information
                </SectionTitle>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InfoRow icon={FiUser} label="Full name" value={user.name} />
                  <InfoRow icon={FiMail} label="Email" value={user.email} />
                  <InfoRow icon={FiPhone} label="Phone" value={user.phone || "Add a phone number"} muted={!user.phone} />
                  <InfoRow icon={FiShield} label="Account type" value="Standard member" />
                </div>
              </div>
            </ScrollReveal>

            {/* Account details */}
            <ScrollReveal delay={0.05}>
              <div className={`${card} p-6 h-full`}>
                <SectionTitle icon={FiShield}>Account Details</SectionTitle>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Email verified</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <FiCheckCircle size={15} /> Verified
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Membership</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Standard</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Saved addresses</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{addresses.length}</span>
                  </li>
                </ul>
                <button
                  onClick={() => setModal("password")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-white/15 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:border-[#fe4462] hover:text-[#fe4462]"
                >
                  <FiLock size={15} /> Change Password
                </button>
              </div>
            </ScrollReveal>

            {/* Saved addresses */}
            <ScrollReveal className="lg:col-span-2">
              <div className={`${card} p-6`}>
                <SectionTitle
                  icon={FiMapPin}
                  action={
                    <button
                      onClick={() => openAddress(null)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#fe4462] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#d93550]"
                    >
                      <FiPlus size={14} /> Add
                    </button>
                  }
                >
                  Saved Addresses
                </SectionTitle>

                {addresses.length === 0 ? (
                  <EmptyState
                    icon={FiMapPin}
                    title="No saved addresses yet"
                    hint="Add an address for faster checkout next time."
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((a) => (
                      <div
                        key={a.id}
                        className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fe4462]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#fe4462]">
                            {a.label}
                          </span>
                          {a.isDefault && (
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-3 font-semibold text-gray-900 dark:text-white">{a.fullName}</p>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {a.line1}{a.city ? `, ${a.city}` : ""}{a.state ? `, ${a.state}` : ""} {a.pincode}
                        </p>
                        {a.phone && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{a.phone}</p>}
                        <div className="mt-4 flex items-center gap-3 text-sm">
                          <button onClick={() => openAddress(a)} className="font-semibold text-[#fe4462] hover:underline">Edit</button>
                          {!a.isDefault && (
                            <button onClick={() => setDefaultAddress(a.id)} className="font-medium text-gray-500 hover:text-[#fe4462]">Set default</button>
                          )}
                          <button
                            onClick={() => removeAddress(a.id)}
                            aria-label="Remove address"
                            className="ml-auto grid h-8 w-8 place-items-center rounded-full text-gray-400 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Account settings */}
            <ScrollReveal delay={0.05}>
              <div className={`${card} p-6 h-full`}>
                <SectionTitle icon={FiSettings}>Account Settings</SectionTitle>
                <div className="space-y-2">
                  <button
                    onClick={toggleDarkMode}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-[#fe4462]/5"
                  >
                    <span className="inline-flex items-center gap-2">
                      {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />} Appearance
                    </span>
                    <span className="text-xs text-gray-400">{darkMode ? "Dark" : "Light"}</span>
                  </button>
                  <button
                    onClick={() => openAddress(null)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-[#fe4462]/5"
                  >
                    <span className="inline-flex items-center gap-2"><FiMapPin size={16} /> Manage Address</span>
                    <FiChevronRight className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => setModal("password")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-[#fe4462]/5"
                  >
                    <span className="inline-flex items-center gap-2"><FiLock size={16} /> Change Password</span>
                    <FiChevronRight className="text-gray-400" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                  >
                    <span className="inline-flex items-center gap-2"><FiLogOut size={16} /> Logout</span>
                    <FiChevronRight className="text-red-400" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Order summary */}
            <ScrollReveal className="lg:col-span-2">
              <div className={`${card} p-6`}>
                <SectionTitle
                  icon={FiPackage}
                  action={
                    orders.length > 0 && (
                      <Link to="/track" className="text-xs font-semibold text-[#fe4462] hover:underline">View all</Link>
                    )
                  }
                >
                  Order Summary
                </SectionTitle>
                {orders.length === 0 ? (
                  <EmptyState
                    icon={FiPackage}
                    title="No orders yet"
                    hint="Your handcrafted treasures will appear here once you place an order."
                    cta={{ to: "/shop", label: "Start Shopping" }}
                  />
                ) : (
                  <ul className="divide-y divide-gray-100 dark:divide-white/5">
                    {orders.slice(0, 4).map((o) => (
                      <li key={o.id} className="flex items-center gap-4 py-3 first:pt-0">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fe4462]/10 text-[#fe4462]">
                          <FiPackage size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-900 dark:text-white">#{o.id}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
                            <FiClock size={12} /> {fmtDate(o.createdAt)} · {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? "" : "s"}
                          </p>
                        </div>
                        <span className="font-bold text-[#fe4462]">₹{o.totals?.total ?? 0}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollReveal>

            {/* Wishlist summary */}
            <ScrollReveal delay={0.05}>
              <div className={`${card} p-6 h-full`}>
                <SectionTitle
                  icon={FiHeart}
                  action={
                    wishlist.length > 0 && (
                      <Link to="/wishlist" className="text-xs font-semibold text-[#fe4462] hover:underline">View all</Link>
                    )
                  }
                >
                  Wishlist
                </SectionTitle>
                {wishlist.length === 0 ? (
                  <EmptyState
                    icon={FiHeart}
                    title="Your wishlist is empty"
                    hint="Save the pieces you love to find them here."
                    cta={{ to: "/shop", label: "Browse Collection" }}
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      {wishlist.slice(0, 4).map((p) => (
                        <Link
                          to="/wishlist"
                          key={p.id}
                          className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 grid place-items-center"
                        >
                          <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain p-1.5 transition-transform duration-500 hover:scale-110" />
                        </Link>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-white">{wishlist.length}</span> item{wishlist.length === 1 ? "" : "s"} saved
                    </p>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Recently viewed (reuses the shared, catalog-resolved section) */}
      <RecentlyViewed className="!py-0 pb-20" />

      <AccountModals open={modal} editingAddress={editingAddress} onClose={closeModal} />
    </div>
  );
}
