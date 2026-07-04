import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiTag,
  FiTruck,
  FiStar,
  FiGift,
  FiCheckCircle,
} from "react-icons/fi";
import { useClickOutside, useLocalStorage } from "../../hooks/useHooks";
import { useI18n } from "../../context/I18nContext";

// Seeded notifications (stand-in for a backend feed). `id` is a stable key used
// to persist read state - replace this array with an API response later and the
// unread/read logic keeps working unchanged.
const NOTIFICATIONS = [
  {
    id: "n-deal-01",
    icon: FiTag,
    title: "Exclusive deal unlocked",
    text: "Flat 20% off on the Festival Collection this week.",
    time: "2h ago",
  },
  {
    id: "n-ship-01",
    icon: FiTruck,
    title: "Your order is on the way",
    text: "Track your latest order for live delivery updates.",
    time: "1d ago",
  },
  {
    id: "n-new-01",
    icon: FiStar,
    title: "Fresh arrivals just dropped",
    text: "New handcrafted miniatures are now in the store.",
    time: "3d ago",
  },
  {
    id: "n-gift-01",
    icon: FiGift,
    title: "A gift for you",
    text: "Use code WELCOME50 for ₹50 off your first order.",
    time: "5d ago",
  },
];

/**
 * Notification bell with an unread badge and dropdown panel. Read state lives in
 * localStorage keyed by notification id, so opening the panel clears the "new"
 * count and read items never resurface as new after a refresh.
 */
export default function NotificationBell({ buttonClass = "", iconSize = 18 }) {
  const { t } = useI18n();
  const [readIds, setReadIds] = useLocalStorage("mm-notif-read", []);
  const [open, setOpen] = useState(false);
  // Ids that were unread at the moment this panel was opened - highlighted as
  // "New" for this viewing even though they're immediately marked read.
  const [highlight, setHighlight] = useState([]);
  const ref = useClickOutside(() => setOpen(false));

  const unreadIds = useMemo(
    () => NOTIFICATIONS.filter((n) => !readIds.includes(n.id)).map((n) => n.id),
    [readIds],
  );

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && unreadIds.length) {
        setHighlight(unreadIds);
        setReadIds((ids) => [...new Set([...ids, ...unreadIds])]);
      }
      return next;
    });
  };

  const markAllRead = () => {
    setReadIds(NOTIFICATIONS.map((n) => n.id));
    setHighlight([]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t("notif.title")}${unreadIds.length ? `, ${unreadIds.length} ${t("notif.new").toLowerCase()}` : ""}`}
        className={buttonClass}
      >
        <FiBell size={iconSize} />
        {unreadIds.length > 0 && (
          <motion.span
            key={unreadIds.length}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#fe4462] px-1 text-[9px] font-bold text-white"
          >
            {unreadIds.length}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t("notif.title")}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full translate-x-[20%] z-50 mt-2 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-gray-100 bg-white text-gray-700 shadow-[0_16px_48px_-12px_rgba(15,17,21,0.28)] ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-bold text-gray-900">
                {t("notif.title")}
              </p>
              {NOTIFICATIONS.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="shrink-0 text-[11px] font-semibold text-[#fe4462] transition hover:underline"
                >
                  {t("notif.markAll")}
                </button>
              )}
            </div>

            {NOTIFICATIONS.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <FiCheckCircle size={24} />
                </span>
                <p className="text-sm font-medium text-gray-600">
                  {t("notif.empty")}
                </p>
              </div>
            ) : (
              <ul className="max-h-[min(60vh,380px)] overflow-y-auto py-1">
                {NOTIFICATIONS.map((n) => {
                  const Icon = n.icon;
                  const isNew = highlight.includes(n.id);
                  return (
                    <li
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${isNew ? "bg-[#fe4462]/[0.05]" : "hover:bg-gray-50"}`}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fe4462]/10 leading-none text-[#fe4462]">
                        <Icon size={18} className="block" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {n.title}
                          </p>
                          {isNew && (
                            <span
                              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#fe4462]"
                              role="status"
                              aria-label={t("notif.new")}
                            />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          {n.text}
                        </p>
                        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                          {n.time}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
