import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin, FiChevronDown, FiPackage, FiHelpCircle, FiX, FiCheck,
  FiTruck, FiRotateCcw, FiGift, FiShield,
} from "react-icons/fi";
import { useClickOutside, useLocalStorage } from "../../hooks/useHooks";
import { useI18n } from "../../context/I18nContext";
import ModalPortal from "../common/ModalPortal";
import LanguageSelector from "./LanguageSelector";

// Icon components (never images) + translation keys for the rotating text.
const ANNOUNCEMENTS = [
  { icon: FiTruck, key: "announce.freeShipping" },
  { icon: FiRotateCcw, key: "announce.returns" },
  { icon: FiGift, key: "announce.deals" },
  { icon: FiShield, key: "announce.secure" },
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Roorkee", "Kolkata", "Chennai", "Hyderabad", "Pune"];

// Utility button style for the (premium dark) top bar.
const ACTION_CLS =
  "flex items-center gap-1.5 rounded-md px-2 py-1.5 outline-none transition hover:bg-white/10";

export default function AnnouncementBar() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const [location, setLocation] = useLocalStorage("mm-location", "");
  const [currency, setCurrency] = useLocalStorage("mm-currency", "INR");

  const [locOpen, setLocOpen] = useState(false);
  const [curOpen, setCurOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const curRef = useClickOutside(() => setCurOpen(false));
  const helpRef = useClickOutside(() => setHelpOpen(false));

  // Rotate every 3.5s; pause on hover. Fixed-height track ⇒ no layout shift.
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIdx((v) => (v + 1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(timer);
  }, [paused]);

  const activeCur = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  const Active = ANNOUNCEMENTS[idx].icon;

  const HELP_LINKS = [
    { label: t("help.contact"), to: "/contact" },
    { label: t("help.faqs"), to: "/faq" },
    { label: t("help.shipping"), to: "/faq" },
    { label: t("help.returns"), to: "/faq" },
    { label: t("help.refund"), to: "/terms" },
  ];

  return (
    <div className="border-b border-white/10 bg-[#1b1819] text-gray-200 transition-colors dark:bg-[#0d0508]">
      <div className="mx-auto flex h-10 w-full max-w-[1600px] items-center justify-between gap-3 px-3 text-[11px] sm:px-4 lg:px-8 xl:text-xs">
        {/* Rotating announcement */}
        <div
          className="relative h-full min-w-0 flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center gap-2 font-medium tracking-wide"
            >
              <Active size={14} className="shrink-0 text-[#fe4462]" aria-hidden="true" />
              <span className="truncate">{t(ANNOUNCEMENTS[idx].key)}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right utilities */}
        <div className="flex shrink-0 items-center gap-0.5">
          {/* Location + Language + Currency + Track + Help (tablet/desktop) */}
          <div className="hidden items-center gap-0.5 md:flex">
            <button onClick={() => setLocOpen(true)} className={ACTION_CLS} aria-haspopup="dialog">
              <FiMapPin size={13} className="text-[#fe4462]" />
              <span className="max-w-[140px] truncate">
                {location ? `${t("topbar.deliverTo")} ${location}` : t("topbar.selectLocation")}
              </span>
            </button>

            <Divider />
            <LanguageSelector actionCls={ACTION_CLS} />
            <Divider />

            {/* Currency */}
            <div className="relative" ref={curRef}>
              <button onClick={() => setCurOpen((v) => !v)} aria-haspopup="menu" aria-expanded={curOpen} className={ACTION_CLS}>
                <span className="font-semibold">{activeCur.symbol} {activeCur.code}</span>
                <FiChevronDown size={12} className={`transition-transform ${curOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {curOpen && (
                  <motion.div
                    role="menu" aria-label="Currency"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl bg-white py-1 text-gray-700 shadow-xl ring-1 ring-black/5 dark:bg-[#1a0a0e] dark:text-gray-200 dark:ring-white/10"
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        role="menuitemradio"
                        aria-checked={c.code === currency}
                        onClick={() => { setCurrency(c.code); setCurOpen(false); }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs transition hover:bg-[#fe4462]/10"
                      >
                        <span><span className="font-semibold">{c.symbol} {c.code}</span> <span className="text-gray-400">· {c.label}</span></span>
                        {c.code === currency && <FiCheck size={14} className="shrink-0 text-[#fe4462]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Divider />

            <button onClick={() => navigate("/track")} className={ACTION_CLS}>
              <FiPackage size={13} className="text-[#fe4462]" /> {t("topbar.trackOrder")}
            </button>

            <Divider />

            {/* Help */}
            <div className="relative" ref={helpRef}>
              <button onClick={() => setHelpOpen((v) => !v)} aria-haspopup="menu" aria-expanded={helpOpen} className={ACTION_CLS}>
                <FiHelpCircle size={13} className="text-[#fe4462]" /> {t("topbar.help")}
                <FiChevronDown size={12} className={`transition-transform ${helpOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {helpOpen && (
                  <motion.div
                    role="menu" aria-label={t("topbar.help")}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl bg-white py-1 text-gray-700 shadow-xl ring-1 ring-black/5 dark:bg-[#1a0a0e] dark:text-gray-200 dark:ring-white/10"
                  >
                    {HELP_LINKS.map((h) => (
                      <button key={h.label} role="menuitem" onClick={() => { setHelpOpen(false); navigate(h.to); }} className="block w-full px-3 py-2 text-left text-xs transition hover:bg-[#fe4462]/10">
                        {h.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Location selector modal */}
      <AnimatePresence>
        {locOpen && (
          <LocationModal
            current={location}
            cities={CITIES}
            onClose={() => setLocOpen(false)}
            onSave={(loc) => { setLocation(loc); setLocOpen(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Divider() {
  return <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />;
}

function LocationModal({ current, cities, onClose, onSave }) {
  const { t } = useI18n();
  const [value, setValue] = useState(current || "");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <ModalPortal>
      <motion.div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          role="dialog" aria-modal="true" aria-labelledby="loc-title"
          className="relative max-h-full w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10"
        >
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462]">
            <FiX size={20} />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fe4462]/10 text-[#fe4462]">
              <FiMapPin size={22} />
            </span>
            <div>
              <h3 id="loc-title" className="text-lg font-bold text-gray-900 dark:text-white">{t("location.title")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("location.subtitle")}</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSave(value.trim()); }} className="mt-5">
            <label htmlFor="loc-input" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("location.field")}</label>
            <input
              id="loc-input"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. Roorkee or 247667"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:!outline-none focus-visible:!outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
            />

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">{t("location.popular")}</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    value === c
                      ? "border-[#fe4462] bg-[#fe4462]/10 text-[#fe4462]"
                      : "border-gray-200 text-gray-600 hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/10 dark:text-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 rounded-full border border-gray-200 px-5 py-2.5 font-semibold text-gray-600 transition hover:border-[#fe4462] hover:text-[#fe4462] dark:border-white/15 dark:text-gray-300">
                {t("location.cancel")}
              </button>
              <button type="submit" disabled={!value.trim()} className="flex-1 rounded-full bg-[#fe4462] px-5 py-2.5 font-semibold text-white transition hover:bg-[#d93550] active:scale-95 disabled:opacity-50">
                {t("location.save")}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}
