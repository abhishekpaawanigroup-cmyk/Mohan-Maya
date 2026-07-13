/**
 * Demo notification generator for testing the notification system
 * Uncomment and use these functions to test the notification system
 *
 * Usage:
 * import { generateDemoNotifications } from '../utils/demoNotifications';
 * import { useNotifications } from '../context/NotificationContext';
 *
 * const { addNotification } = useNotifications();
 * generateDemoNotifications(addNotification);
 */

export const generateDemoNotifications = (addNotification) => {
  const demoNotifications = [
    {
      title: "Order Delivered",
      message: "Your order #MM-2024-001 has been delivered successfully.",
      category: "order",
      action: { label: "View Order" },
    },
    {
      title: "Price Dropped",
      message: "Blue Elephant Miniature price dropped from ₹2999 to ₹1999. Great deal!",
      category: "shopping",
      action: { label: "View Wishlist" },
    },
    {
      title: "New Collection",
      message: "Monsoon Collection has just launched! Explore now.",
      category: "promotion",
      action: { label: "Explore" },
    },
    {
      title: "Coupon Code",
      message: "Use code SUMMER50 to get 50% off on your next purchase.",
      category: "promotion",
      action: { label: "Shop Now" },
    },
    {
      title: "Order Shipped",
      message: "Your order #MM-2024-002 has been shipped. Tracking ID: TRACK123456",
      category: "order",
      action: { label: "Track Order" },
    },
    {
      title: "Back in Stock",
      message: "Red Ox Figurine from your wishlist is now back in stock!",
      category: "shopping",
      action: { label: "View Product" },
    },
    {
      title: "Payment Successful",
      message: "Payment of ₹5999 for order #MM-2024-003 has been received.",
      category: "order",
      action: { label: "View Order" },
    },
    {
      title: "Review Reminder",
      message: "Your order #MM-2024-001 has been delivered. Please share your experience.",
      category: "review",
      action: { label: "Write Review" },
    },
  ];

  // Add each demo notification with a small delay
  demoNotifications.forEach((notif, index) => {
    setTimeout(() => {
      addNotification(notif);
    }, index * 300);
  });
};

/**
 * Generate a single sample notification for testing
 */
export const addSampleNotification = (addNotification, type = "order") => {
  const samples = {
    order: {
      title: "Order Placed",
      message: "Your order #MM-2024-999 has been placed successfully.",
      category: "order",
      action: { label: "View Order" },
    },
    promotion: {
      title: "New Offer",
      message: "Summer Sale: Get 50% off on selected items!",
      category: "promotion",
      action: { label: "Shop Now" },
    },
    account: {
      title: "Profile Updated",
      message: "Your profile information has been updated.",
      category: "account",
    },
  };

  if (samples[type]) {
    addNotification(samples[type]);
  }
};
