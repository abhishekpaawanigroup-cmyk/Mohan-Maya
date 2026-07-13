import { createContext, useContext, useState, useCallback, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

// Seed notifications for initial display (no icon component - will be determined by category)
const SEED_NOTIFICATIONS = [
  {
    id: "seed-1",
    title: "Order Delivered",
    message: "Your order #MM-2024-001 has been delivered successfully.",
    category: "order",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    action: { label: "View Order" },
  },
  {
    id: "seed-2",
    title: "Price Dropped",
    message: "Blue Elephant Miniature price dropped from ₹2999 to ₹1999. Great deal!",
    category: "shopping",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    action: { label: "View Wishlist" },
  },
  {
    id: "seed-3",
    title: "Coupon Code",
    message: "Use code SUMMER50 to get 50% off on your next purchase.",
    category: "promotion",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    action: { label: "Shop Now" },
  },
  {
    id: "seed-4",
    title: "Order Shipped",
    message: "Your order #MM-2024-002 has been shipped. Tracking ID: TRACK123456",
    category: "order",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    action: { label: "Track Order" },
  },
  {
    id: "seed-5",
    title: "New Collection",
    message: "Monsoon Collection has just launched! Explore now.",
    category: "promotion",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    action: { label: "Explore" },
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [readIds, setReadIds] = useState([]);

  // Load notifications and read state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mm-notifications");
      const savedReadIds = localStorage.getItem("mm-notif-read-ids");
      if (saved) setNotifications(JSON.parse(saved));
      if (savedReadIds) setReadIds(JSON.parse(savedReadIds));
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("mm-notifications", JSON.stringify(notifications));
    } catch (err) {
      console.error("Failed to save notifications:", err);
    }
  }, [notifications]);

  // Save read IDs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("mm-notif-read-ids", JSON.stringify(readIds));
    } catch (err) {
      console.error("Failed to save read IDs:", err);
    }
  }, [readIds]);

  // Add a new notification
  const addNotification = useCallback(
    (notification) => {
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...notification,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return newNotif;
    },
    []
  );

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setReadIds((prev) => {
      if (!prev.includes(notificationId)) {
        return [...prev, notificationId];
      }
      return prev;
    });
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => [
      ...new Set([...prev, ...notifications.map((n) => n.id)]),
    ]);
  }, [notifications]);

  // Delete a notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setReadIds((prev) => prev.filter((id) => id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setReadIds([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id))
    .length;

  // Get unread notification IDs
  const unreadIds = notifications
    .filter((n) => !readIds.includes(n.id))
    .map((n) => n.id);

  const value = {
    notifications,
    readIds,
    unreadCount,
    unreadIds,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
