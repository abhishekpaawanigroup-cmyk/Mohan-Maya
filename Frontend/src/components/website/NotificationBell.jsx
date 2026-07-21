import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiCheckCircle,
  FiX,
  FiTrash2,
  FiTruck,
  FiTag,
  FiGift,
  FiStar,
  FiUser,
  FiLock,
  FiMail,
  FiShoppingCart,
  FiPackage,
  FiRefreshCw,
  FiHeart,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";
import { useClickOutside } from "../../hooks/useHooks";
import { useI18n } from "../../context/I18nContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  formatNotificationTime,
  groupNotificationsByDate,
  getNotificationIconColor,
  getNotificationBgColor,
} from "../../utils/notificationUtils";
import {
  getNotificationNavigationPath,
  extractOrderIdFromMessage,
} from "../../utils/notificationNavigation";

/**
 * Get icon component based on notification type/title
 */
const getNotificationIcon = (title, category) => {
  const titleLower = title.toLowerCase();

  // Order-related
  if (
    titleLower.includes("order placed") ||
    titleLower.includes("order confirmed")
  )
    return FiShoppingCart;
  if (titleLower.includes("shipped")) return FiTruck;
  if (titleLower.includes("delivered")) return FiCheckCircle;
  if (titleLower.includes("packed")) return FiPackage;
  if (titleLower.includes("delivery")) return FiTruck;
  if (titleLower.includes("cancelled")) return FiX;
  if (titleLower.includes("return")) return FiRefreshCw;
  if (titleLower.includes("refund")) return FiRefreshCw;

  // Account-related
  if (
    titleLower.includes("account") ||
    titleLower.includes("profile") ||
    titleLower.includes("password")
  )
    return FiUser;
  if (titleLower.includes("verified") || titleLower.includes("email"))
    return FiMail;
  if (titleLower.includes("login")) return FiLock;

  // Shopping-related
  if (titleLower.includes("cart")) return FiShoppingCart;
  if (titleLower.includes("wishlist")) return FiHeart;
  if (titleLower.includes("price")) return FiTag;
  if (titleLower.includes("stock")) return FiAlertTriangle;
  if (titleLower.includes("back in stock")) return FiCheckCircle;

  // Promotional
  if (
    titleLower.includes("offer") ||
    titleLower.includes("sale") ||
    titleLower.includes("collection")
  )
    return FiTag;
  if (titleLower.includes("coupon")) return FiGift;

  // Review
  if (titleLower.includes("review")) return FiStar;

  // Payment
  if (titleLower.includes("payment")) return FiCheckCircle;

  // Timing
  if (titleLower.includes("delayed")) return FiClock;

  // Default based on category
  if (category === "order") return FiTruck;
  if (category === "shopping") return FiShoppingCart;
  if (category === "promotion") return FiGift;
  if (category === "review") return FiStar;
  if (category === "account") return FiUser;

  // Ultimate fallback
  return FiCheckCircle;
};

/**
 * Notification bell with an unread badge and dropdown panel.
 * Displays notifications from the NotificationContext with full support for:
 * - Multiple notification types with icons and categories
 * - Reverse chronological order (newest first)
 * - Date grouping (Today, Yesterday, Earlier)
 * - Mark as read / Mark all as read functionality
 * - Delete individual notifications / Clear all
 * - Scrolling when more than 4 notifications
 * - Empty state with "You're all caught up!" message
 */
export default function NotificationBell({ buttonClass = "", iconSize = 18 }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const {
    notifications,
    unreadCount,
    unreadIds,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  // Group notifications by date
  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  // Mark unread notifications as read when panel opens
  useEffect(() => {
    if (open && unreadIds.length > 0) {
      unreadIds.forEach((id) => markAsRead(id));
    }
  }, [open, unreadIds, markAsRead]);

  const handleNotificationClick = (notifId) => {
    markAsRead(notifId);
  };

  const handleDelete = (e, notifId) => {
    e.stopPropagation();
    deleteNotification(notifId);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t("notif.title")}${unreadCount ? `, ${unreadCount} new` : ""}`}
        className={buttonClass}
      >
        <FiBell size={iconSize} />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#fe4462] px-1 text-[9px] font-bold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
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
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-bold text-gray-900">
                {t("notif.title")}
              </p>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="shrink-0 text-[11px] font-semibold text-[#fe4462] transition hover:underline"
                      title="Mark all as read"
                    >
                      {t("notif.markAll")}
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={clearAll}
                      className="shrink-0 text-[11px] font-semibold text-red-500 transition hover:underline"
                      title="Clear all notifications"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <FiCheckCircle size={24} />
                </span>
                <p className="text-sm font-medium text-gray-600">
                  You're all caught up! No new notifications.
                </p>
              </div>
            ) : (
              <div className={`py-1 ${notifications.length > 4 ? "max-h-90 overflow-y-auto" : ""}`}>
                {/* Today */}
                {groupedNotifications.Today.length > 0 && (
                  <div>
                    <div className="sticky top-0 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-50">
                      Today
                    </div>
                    {groupedNotifications.Today.map((notif) => {
                      const Icon = getNotificationIcon(notif.title, notif.category);
                      const isUnread = unreadIds.includes(notif.id);
                      return (
                        <NotificationItem
                          key={notif.id}
                          notif={notif}
                          Icon={Icon}
                          isUnread={isUnread}
                          onDelete={handleDelete}
                          onClick={() => handleNotificationClick(notif.id)}
                          navigate={navigate}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Yesterday */}
                {groupedNotifications.Yesterday.length > 0 && (
                  <div>
                    <div className="sticky top-0 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-50">
                      Yesterday
                    </div>
                    {groupedNotifications.Yesterday.map((notif) => {
                      const Icon = getNotificationIcon(notif.title, notif.category);
                      const isUnread = unreadIds.includes(notif.id);
                      return (
                        <NotificationItem
                          key={notif.id}
                          notif={notif}
                          Icon={Icon}
                          isUnread={isUnread}
                          onDelete={handleDelete}
                          onClick={() => handleNotificationClick(notif.id)}
                          navigate={navigate}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Earlier */}
                {groupedNotifications.Earlier.length > 0 && (
                  <div>
                    <div className="sticky top-0 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-50">
                      Earlier
                    </div>
                    {groupedNotifications.Earlier.map((notif) => {
                      const Icon = getNotificationIcon(notif.title, notif.category);
                      const isUnread = unreadIds.includes(notif.id);
                      return (
                        <NotificationItem
                          key={notif.id}
                          notif={notif}
                          Icon={Icon}
                          isUnread={isUnread}
                          onDelete={handleDelete}
                          onClick={() => handleNotificationClick(notif.id)}
                          navigate={navigate}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Individual notification item component
 */
function NotificationItem({
  notif,
  Icon,
  isUnread,
  onDelete,
  onClick,
  navigate,
}) {
  const bgColor = getNotificationBgColor(notif.category);
  const iconColor = getNotificationIconColor(notif.category);

  // Determine the notification type from title for proper routing
  const getNotificationType = () => {
    const titleLower = notif.title.toLowerCase();
    if (titleLower.includes("order placed")) return "orderPlaced";
    if (titleLower.includes("order delivered")) return "orderDelivered";
    if (titleLower.includes("order shipped")) return "orderShipped";
    if (titleLower.includes("out for delivery")) return "outForDelivery";
    if (titleLower.includes("order packed")) return "orderPacked";
    if (titleLower.includes("order confirmed")) return "orderConfirmed";
    if (titleLower.includes("order cancelled")) return "orderCancelled";
    if (titleLower.includes("payment successful")) return "paymentSuccessful";
    if (titleLower.includes("payment failed")) return "paymentFailed";
    if (titleLower.includes("return")) return "returnRequested";
    if (titleLower.includes("refund")) return "refundInitiated";
    if (titleLower.includes("pickup")) return "pickupScheduled";
    if (titleLower.includes("back in stock")) return "wishlistItemBackInStock";
    if (titleLower.includes("price dropped")) return "priceDropped";
    if (titleLower.includes("added to cart")) return "addedToCart";
    if (titleLower.includes("added to wishlist")) return "addedToWishlist";
    if (titleLower.includes("offer") || titleLower.includes("sale")) return "offerAvailable";
    if (titleLower.includes("coupon")) return "couponAvailable";
    if (titleLower.includes("collection")) return "newCollectionLaunch";
    if (titleLower.includes("review")) return "reviewReminder";
    if (titleLower.includes("account") || titleLower.includes("profile")) return "accountCreated";
    return notif.category;
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (!navigate) return;

    const notificationType = getNotificationType();
    const orderId = extractOrderIdFromMessage(notif.message);
    const navPath = getNotificationNavigationPath(notificationType, orderId);

    if (navPath.isValid || navPath.fallback) {
      navigate(navPath.isValid ? navPath.path : navPath.fallback);
    }
  };

  return (
    <li
      key={notif.id}
      onClick={onClick}
      className={`group flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer ${
        isUnread
          ? "bg-[#fe4462]/5 hover:bg-[#fe4462]/8"
          : "hover:bg-gray-50"
      }`}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${bgColor} leading-none ${iconColor}`}>
        <Icon size={18} className="block" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {notif.title}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isUnread && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#fe4462]"
                role="status"
                aria-label="Unread"
              />
            )}
            <button
              onClick={(e) => onDelete(e, notif.id)}
              className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
              aria-label="Delete notification"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
          {notif.message}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            {formatNotificationTime(notif.timestamp)}
          </p>
          {notif.action && (
            <button
              onClick={handleActionClick}
              className="text-[11px] font-semibold text-[#fe4462] hover:underline bg-none border-none cursor-pointer p-0"
            >
              {notif.action.label}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
