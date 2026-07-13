// Account Events
export const notificationGenerators = {
  // Account Events (no icon component - determined by title/category in NotificationBell)
  accountCreated: () => ({
    title: "Account Created",
    message: "Welcome! Your account has been successfully created.",
    category: "account",
  }),

  loginNewDevice: (deviceInfo) => ({
    title: "New Device Login",
    message: `Your account was logged in from a new device. Location: ${deviceInfo || "Unknown"}`,
    category: "account",
  }),

  emailVerified: () => ({
    title: "Email Verified",
    message: "Your email address has been successfully verified.",
    category: "account",
  }),

  phoneVerified: () => ({
    title: "Phone Verified",
    message: "Your phone number has been successfully verified.",
    category: "account",
  }),

  passwordChanged: () => ({
    title: "Password Changed",
    message: "Your password has been successfully updated.",
    category: "account",
  }),

  profileUpdated: () => ({
    title: "Profile Updated",
    message: "Your profile information has been updated.",
    category: "account",
  }),

  // Order Events
  orderPlaced: (orderId) => ({
    title: "Order Placed",
    message: `Your order #${orderId} has been placed successfully.`,
    category: "order",
    action: { label: "View Order" },
  }),

  paymentSuccessful: (orderId, amount) => ({
    title: "Payment Successful",
    message: `Payment of ₹${amount} for order #${orderId} has been received.`,
    category: "order",
    action: { label: "View Order" },
  }),

  paymentFailed: (orderId) => ({
    title: "Payment Failed",
    message: `Payment for order #${orderId} could not be processed. Please try again.`,
    category: "order",
    action: { label: "Retry Payment" },
  }),

  orderConfirmed: (orderId) => ({
    title: "Order Confirmed",
    message: `Your order #${orderId} has been confirmed by the seller.`,
    category: "order",
    action: { label: "Track Order" },
  }),

  orderPacked: (orderId) => ({
    title: "Order Packed",
    message: `Your order #${orderId} is being packed and will ship soon.`,
    category: "order",
    action: { label: "Track Order" },
  }),

  orderShipped: (orderId, trackingId) => ({
    title: "Order Shipped",
    message: `Your order #${orderId} has been shipped. Tracking ID: ${trackingId || "Available"}`,
    category: "order",
    action: { label: "Track Order" },
  }),

  outForDelivery: (orderId) => ({
    title: "Out for Delivery",
    message: `Your order #${orderId} is out for delivery today.`,
    category: "order",
    action: { label: "Track Order" },
  }),

  orderDelivered: (orderId) => ({
    title: "Order Delivered",
    message: `Your order #${orderId} has been delivered successfully.`,
    category: "order",
    action: { label: "View Order" },
  }),

  deliveryDelayed: (orderId) => ({
    title: "Delivery Delayed",
    message: `Your order #${orderId} has been delayed. We apologize for the inconvenience.`,
    category: "order",
    action: { label: "View Details" },
  }),

  deliveryAttempted: (orderId) => ({
    title: "Delivery Attempted",
    message: `Delivery attempt made for order #${orderId}. Please check and reschedule if needed.`,
    category: "order",
    action: { label: "Reschedule" },
  }),

  orderCancelled: (orderId) => ({
    title: "Order Cancelled",
    message: `Your order #${orderId} has been cancelled.`,
    category: "order",
    action: { label: "View Details" },
  }),

  // Return & Refund Events
  returnRequested: (orderId) => ({
    title: "Return Requested",
    message: `Your return request for order #${orderId} has been submitted.`,
    category: "order",
    action: { label: "Track Return" },
  }),

  returnApproved: (orderId) => ({
    title: "Return Approved",
    message: `Your return for order #${orderId} has been approved. A pickup will be scheduled.`,
    category: "order",
    action: { label: "View Details" },
  }),

  returnRejected: (orderId) => ({
    title: "Return Rejected",
    message: `Your return request for order #${orderId} could not be processed.`,
    category: "order",
    action: { label: "View Details" },
  }),

  pickupScheduled: (orderId) => ({
    title: "Pickup Scheduled",
    message: `A pickup has been scheduled for your return from order #${orderId}.`,
    category: "order",
    action: { label: "View Details" },
  }),

  pickupCompleted: (orderId) => ({
    title: "Pickup Completed",
    message: `Your return item from order #${orderId} has been picked up.`,
    category: "order",
    action: { label: "View Details" },
  }),

  refundInitiated: (orderId, amount) => ({
    title: "Refund Initiated",
    message: `Refund of ₹${amount} for order #${orderId} has been initiated.`,
    category: "order",
    action: { label: "View Details" },
  }),

  refundCompleted: (orderId, amount) => ({
    title: "Refund Completed",
    message: `Refund of ₹${amount} for order #${orderId} has been processed to your account.`,
    category: "order",
    action: { label: "View Details" },
  }),

  // Cart & Wishlist Events
  addedToCart: (productName) => ({
    title: "Added to Cart",
    message: `${productName} has been added to your cart.`,
    category: "shopping",
  }),

  addedToWishlist: (productName) => ({
    title: "Added to Wishlist",
    message: `${productName} has been added to your wishlist.`,
    category: "shopping",
    action: { label: "View Wishlist" },
  }),

  wishlistItemBackInStock: (productName) => ({
    title: "Back in Stock",
    message: `${productName} from your wishlist is now back in stock!`,
    category: "shopping",
    action: { label: "View Product" },
  }),

  priceDropped: (productName, oldPrice, newPrice) => ({
    title: "Price Dropped",
    message: `${productName} price dropped from ₹${oldPrice} to ₹${newPrice}. Great deal!`,
    category: "shopping",
    action: { label: "View Wishlist" },
  }),

  lowStockInCart: (productName) => ({
    title: "Low Stock",
    message: `${productName} in your cart is running low. Only a few left!`,
    category: "shopping",
    action: { label: "View Cart" },
  }),

  // Promotional Events
  offerAvailable: (offerName, discount) => ({
    title: "New Offer",
    message: `${offerName}: Get ${discount}% off on selected items!`,
    category: "promotion",
    action: { label: "Shop Now" },
  }),

  couponAvailable: (couponCode, discount) => ({
    title: "Coupon Code",
    message: `Use code ${couponCode} to get ${discount}% off on your next purchase.`,
    category: "promotion",
    action: { label: "Shop Now" },
  }),

  saleStarted: (saleName) => ({
    title: "Sale Started",
    message: `${saleName} is now live! Get up to 70% off.`,
    category: "promotion",
    action: { label: "Shop Now" },
  }),

  festivalPromotion: (festivalName) => ({
    title: `${festivalName} Offers`,
    message: `Check out exclusive ${festivalName} offers and discounts.`,
    category: "promotion",
    action: { label: "View Offers" },
  }),

  newCollectionLaunch: (collectionName) => ({
    title: "New Collection",
    message: `${collectionName} collection has just launched! Explore now.`,
    category: "promotion",
    action: { label: "Explore" },
  }),

  // Review Events
  reviewReminder: (orderId) => ({
    title: "Review Reminder",
    message: `Your order #${orderId} has been delivered. Please share your experience.`,
    category: "review",
    action: { label: "Write Review" },
  }),

  reviewSubmitted: () => ({
    title: "Review Submitted",
    message: "Thank you for your review! It will be visible soon.",
    category: "review",
  }),
};

export default notificationGenerators;
