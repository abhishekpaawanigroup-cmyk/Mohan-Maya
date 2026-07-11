import { useNotifications } from "../context/NotificationContext";
import { notificationGenerators } from "../utils/notificationGenerators";

/**
 * Hook to trigger notifications for various events throughout the app.
 * Usage in any component:
 *
 * const trigger = useNotificationTrigger();
 *
 * // Account events
 * trigger.accountCreated();
 * trigger.emailVerified();
 * trigger.passwordChanged();
 *
 * // Order events
 * trigger.orderPlaced("ORDER-123");
 * trigger.paymentSuccessful("ORDER-123", 5999);
 * trigger.orderShipped("ORDER-123", "TRACK123");
 *
 * // Wishlist/Cart events
 * trigger.addedToWishlist("Miniature Elephant");
 * trigger.priceDropped("Miniature Elephant", 1999, 1499);
 *
 * // Promotional events
 * trigger.offerAvailable("Festival Sale", 50);
 * trigger.couponAvailable("SAVE50", 50);
 *
 * // And many more...
 */
export const useNotificationTrigger = () => {
  const { addNotification } = useNotifications();

  return {
    // Account Events
    accountCreated: () => {
      addNotification(notificationGenerators.accountCreated());
    },

    loginNewDevice: (deviceInfo) => {
      addNotification(notificationGenerators.loginNewDevice(deviceInfo));
    },

    emailVerified: () => {
      addNotification(notificationGenerators.emailVerified());
    },

    phoneVerified: () => {
      addNotification(notificationGenerators.phoneVerified());
    },

    passwordChanged: () => {
      addNotification(notificationGenerators.passwordChanged());
    },

    profileUpdated: () => {
      addNotification(notificationGenerators.profileUpdated());
    },

    // Order Events
    orderPlaced: (orderId) => {
      addNotification(notificationGenerators.orderPlaced(orderId));
    },

    paymentSuccessful: (orderId, amount) => {
      addNotification(notificationGenerators.paymentSuccessful(orderId, amount));
    },

    paymentFailed: (orderId) => {
      addNotification(notificationGenerators.paymentFailed(orderId));
    },

    orderConfirmed: (orderId) => {
      addNotification(notificationGenerators.orderConfirmed(orderId));
    },

    orderPacked: (orderId) => {
      addNotification(notificationGenerators.orderPacked(orderId));
    },

    orderShipped: (orderId, trackingId) => {
      addNotification(notificationGenerators.orderShipped(orderId, trackingId));
    },

    outForDelivery: (orderId) => {
      addNotification(notificationGenerators.outForDelivery(orderId));
    },

    orderDelivered: (orderId) => {
      addNotification(notificationGenerators.orderDelivered(orderId));
    },

    deliveryDelayed: (orderId) => {
      addNotification(notificationGenerators.deliveryDelayed(orderId));
    },

    deliveryAttempted: (orderId) => {
      addNotification(notificationGenerators.deliveryAttempted(orderId));
    },

    orderCancelled: (orderId) => {
      addNotification(notificationGenerators.orderCancelled(orderId));
    },

    // Return & Refund Events
    returnRequested: (orderId) => {
      addNotification(notificationGenerators.returnRequested(orderId));
    },

    returnApproved: (orderId) => {
      addNotification(notificationGenerators.returnApproved(orderId));
    },

    returnRejected: (orderId) => {
      addNotification(notificationGenerators.returnRejected(orderId));
    },

    pickupScheduled: (orderId) => {
      addNotification(notificationGenerators.pickupScheduled(orderId));
    },

    pickupCompleted: (orderId) => {
      addNotification(notificationGenerators.pickupCompleted(orderId));
    },

    refundInitiated: (orderId, amount) => {
      addNotification(notificationGenerators.refundInitiated(orderId, amount));
    },

    refundCompleted: (orderId, amount) => {
      addNotification(notificationGenerators.refundCompleted(orderId, amount));
    },

    // Cart & Wishlist Events
    addedToCart: (productName) => {
      addNotification(notificationGenerators.addedToCart(productName));
    },

    addedToWishlist: (productName) => {
      addNotification(notificationGenerators.addedToWishlist(productName));
    },

    wishlistItemBackInStock: (productName) => {
      addNotification(notificationGenerators.wishlistItemBackInStock(productName));
    },

    priceDropped: (productName, oldPrice, newPrice) => {
      addNotification(
        notificationGenerators.priceDropped(productName, oldPrice, newPrice)
      );
    },

    lowStockInCart: (productName) => {
      addNotification(notificationGenerators.lowStockInCart(productName));
    },

    // Promotional Events
    offerAvailable: (offerName, discount) => {
      addNotification(notificationGenerators.offerAvailable(offerName, discount));
    },

    couponAvailable: (couponCode, discount) => {
      addNotification(notificationGenerators.couponAvailable(couponCode, discount));
    },

    saleStarted: (saleName) => {
      addNotification(notificationGenerators.saleStarted(saleName));
    },

    festivalPromotion: (festivalName) => {
      addNotification(notificationGenerators.festivalPromotion(festivalName));
    },

    newCollectionLaunch: (collectionName) => {
      addNotification(notificationGenerators.newCollectionLaunch(collectionName));
    },

    // Review Events
    reviewReminder: (orderId) => {
      addNotification(notificationGenerators.reviewReminder(orderId));
    },

    reviewSubmitted: () => {
      addNotification(notificationGenerators.reviewSubmitted());
    },
  };
};

export default useNotificationTrigger;
