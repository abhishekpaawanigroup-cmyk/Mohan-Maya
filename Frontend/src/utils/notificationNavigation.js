/**
 * Notification Navigation Helper
 * Handles all navigation for notification action links
 * Validates data and provides graceful fallbacks
 */

/**
 * Get the correct navigation path for a notification action
 * @param {string} notificationType - Type of notification (e.g., 'orderPlaced', 'wishlistBackInStock')
 * @param {string} id - The ID of the related item (orderId, productId, etc.)
 * @returns {object} - { path: string, isValid: boolean, fallback?: string }
 */
export const getNotificationNavigationPath = (notificationType, id) => {
  // Order-related notifications - pass orderId as query param for auto-opening
  if ([
    'orderPlaced',
    'paymentSuccessful',
    'paymentFailed',
    'orderConfirmed',
    'orderPacked',
    'orderShipped',
    'outForDelivery',
    'orderDelivered',
    'deliveryDelayed',
    'deliveryAttempted',
    'orderCancelled',
    'returnRequested',
    'returnApproved',
    'returnRejected',
    'pickupScheduled',
    'pickupCompleted',
    'refundInitiated',
    'refundCompleted',
    'reviewReminder',
  ].includes(notificationType)) {
    return {
      path: id ? `/orders?orderId=${id}` : '/orders',
      isValid: !!id,
      fallback: '/orders',
      description: 'My Orders',
    };
  }

  // Cart notifications
  if (['addedToCart', 'lowStockInCart'].includes(notificationType)) {
    return {
      path: '/cart',
      isValid: true,
      description: 'Shopping Cart',
    };
  }

  // Wishlist notifications
  if ([
    'addedToWishlist',
    'wishlistItemBackInStock',
    'priceDropped',
  ].includes(notificationType)) {
    return {
      path: '/wishlist',
      isValid: true,
      description: 'My Wishlist',
    };
  }

  // Promotional notifications
  if ([
    'offerAvailable',
    'couponAvailable',
    'saleStarted',
    'festivalPromotion',
    'newCollectionLaunch',
  ].includes(notificationType)) {
    return {
      path: '/shop',
      isValid: true,
      description: 'Shop',
    };
  }

  // Account notifications
  if ([
    'accountCreated',
    'loginNewDevice',
    'emailVerified',
    'phoneVerified',
    'passwordChanged',
    'profileUpdated',
  ].includes(notificationType)) {
    return {
      path: '/profile',
      isValid: true,
      description: 'My Profile',
    };
  }

  // Review notifications
  if (['reviewSubmitted'].includes(notificationType)) {
    return {
      path: id ? `/orders` : '/orders',
      isValid: !!id,
      fallback: '/orders',
      description: 'My Orders',
    };
  }

  // Default fallback
  return {
    path: '/',
    isValid: false,
    fallback: '/',
    description: 'Home',
  };
};

/**
 * Navigate to notification action with validation
 * Handles missing/invalid data gracefully
 */
export const handleNotificationNavigation = (navigate, notificationType, id) => {
  const navigation = getNotificationNavigationPath(notificationType, id);

  if (!navigation.isValid && navigation.fallback) {
    // Navigate to fallback page
    navigate(navigation.fallback);
    return navigation.fallback;
  }

  navigate(navigation.path);
  return navigation.path;
};

/**
 * Extract order ID from notification message
 * Examples: "Your order #MM-2024-001 has been delivered"
 */
export const extractOrderIdFromMessage = (message) => {
  if (!message) return null;
  const match = message.match(/#([A-Z0-9\-]+)/);
  return match ? match[1] : null;
};

/**
 * Extract product name/ID from notification message
 * Examples: "Blue Elephant Miniature has been added to your cart"
 */
export const extractProductNameFromMessage = (message) => {
  if (!message) return null;
  // For now, just extract the product name (first meaningful part)
  const parts = message.split(' has been ');
  return parts[0] || null;
};

/**
 * Get a user-friendly message for invalid navigation
 */
export const getNavigationErrorMessage = (notificationType) => {
  const messages = {
    orderPlaced: "The order information is no longer available. Redirecting to your orders.",
    orderDelivered: "The order information is no longer available. Redirecting to your orders.",
    paymentSuccessful: "The order information is no longer available. Redirecting to your orders.",
    wishlistBackInStock: "The product is no longer available. Redirecting to your wishlist.",
    priceDropped: "The product is no longer available. Redirecting to your wishlist.",
    offerAvailable: "The offer details are no longer available. Redirecting to shop.",
    accountCreated: "Redirecting to your profile.",
  };

  return messages[notificationType] || "Redirecting to the relevant page.";
};

export default {
  getNotificationNavigationPath,
  handleNotificationNavigation,
  extractOrderIdFromMessage,
  extractProductNameFromMessage,
  getNavigationErrorMessage,
};
