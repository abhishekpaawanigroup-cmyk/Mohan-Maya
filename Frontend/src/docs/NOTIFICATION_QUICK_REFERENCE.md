# Notification System - Quick Reference

## 30-Second Setup

The notification system is **already integrated** into the app. It's ready to use!

## How to Trigger Notifications

### In Any Component:

```jsx
import { useNotificationTrigger } from '../hooks/useNotificationTrigger';

function MyComponent() {
  const trigger = useNotificationTrigger();

  // Trigger any notification
  trigger.orderPlaced('ORD-123');
  trigger.emailVerified();
  trigger.priceDropped('Product Name', 2999, 1999);
}
```

## All Available Triggers

### 🔐 Account Events
```js
trigger.accountCreated()
trigger.loginNewDevice('device info')
trigger.emailVerified()
trigger.phoneVerified()
trigger.passwordChanged()
trigger.profileUpdated()
```

### 📦 Order Events
```js
trigger.orderPlaced('orderId')
trigger.paymentSuccessful('orderId', amount)
trigger.paymentFailed('orderId')
trigger.orderConfirmed('orderId')
trigger.orderPacked('orderId')
trigger.orderShipped('orderId', 'trackingId')
trigger.outForDelivery('orderId')
trigger.orderDelivered('orderId')
trigger.deliveryDelayed('orderId')
trigger.deliveryAttempted('orderId')
trigger.orderCancelled('orderId')
```

### 🔄 Return & Refund Events
```js
trigger.returnRequested('orderId')
trigger.returnApproved('orderId')
trigger.returnRejected('orderId')
trigger.pickupScheduled('orderId')
trigger.pickupCompleted('orderId')
trigger.refundInitiated('orderId', amount)
trigger.refundCompleted('orderId', amount)
```

### 🛒 Cart & Wishlist Events
```js
trigger.addedToCart('productName')
trigger.addedToWishlist('productName')
trigger.wishlistItemBackInStock('productName')
trigger.priceDropped('productName', oldPrice, newPrice)
trigger.lowStockInCart('productName')
```

### 🎁 Promotional Events
```js
trigger.offerAvailable('offerName', discountPercent)
trigger.couponAvailable('couponCode', discountPercent)
trigger.saleStarted('saleName')
trigger.festivalPromotion('festivalName')
trigger.newCollectionLaunch('collectionName')
```

### ⭐ Review Events
```js
trigger.reviewReminder('orderId')
trigger.reviewSubmitted()
```

## Access Notifications Context

```jsx
import { useNotifications } from '../context/NotificationContext';

function MyComponent() {
  const {
    notifications,      // Array of all notifications
    unreadCount,        // Number of unread notifications
    unreadIds,          // Array of unread notification IDs
    addNotification,    // Add notification manually
    markAsRead,         // Mark single notification as read
    markAllAsRead,      // Mark all as read
    deleteNotification, // Delete a notification
    clearAll,           // Delete all notifications
  } = useNotifications();
}
```

## Test the System

### Add Random Test Notifications

```jsx
import { generateDemoNotifications } from '../utils/demoNotifications';
import { useNotifications } from '../context/NotificationContext';

function TestComponent() {
  const { addNotification } = useNotifications();
  
  return (
    <button onClick={() => generateDemoNotifications(addNotification)}>
      Test All Notifications
    </button>
  );
}
```

### Add Single Test Notification

```jsx
import { addSampleNotification } from '../utils/demoNotifications';
import { useNotifications } from '../context/NotificationContext';

function TestComponent() {
  const { addNotification } = useNotifications();
  
  return (
    <button onClick={() => addSampleNotification(addNotification, 'order')}>
      Test Order Notification
    </button>
  );
}
```

## File Structure

```
Frontend/src/
├── context/
│   └── NotificationContext.jsx          (✅ State management)
├── components/website/
│   └── NotificationBell.jsx             (✅ UI component)
├── hooks/
│   └── useNotificationTrigger.js        (✅ Hook to trigger)
├── utils/
│   ├── notificationGenerators.js        (✅ Notification templates)
│   ├── notificationUtils.js             (✅ Helper functions)
│   └── demoNotifications.js             (✅ Test data)
└── docs/
    ├── NOTIFICATION_SYSTEM.md           (📖 Full documentation)
    └── NOTIFICATION_QUICK_REFERENCE.md  (📖 This file)
```

## Features Included

✅ 30+ notification types  
✅ Unread badge count  
✅ Mark as read / Mark all as read  
✅ Delete individual / Clear all  
✅ Date grouping (Today, Yesterday, Earlier)  
✅ Relative timestamps (Just now, 2h ago, etc.)  
✅ Scrolling for 5+ notifications  
✅ Professional empty state  
✅ localStorage persistence  
✅ Action links  
✅ Color-coded by category  
✅ Fully responsive  

## Integration Points

Add notifications to these pages/components:

| Page | Event | Trigger |
|------|-------|---------|
| Auth.jsx | Account creation | `trigger.accountCreated()` |
| Profile.jsx | Profile update | `trigger.profileUpdated()` |
| Checkout.jsx | Order placed | `trigger.orderPlaced(id)` |
| Cart.jsx | Item added | `trigger.addedToCart(name)` |
| Wishlist.jsx | Item added | `trigger.addedToWishlist(name)` |
| Shop.jsx | Sale starts | `trigger.saleStarted(name)` |
| MyOrders.jsx | Order status | `trigger.orderShipped(id)` |
| Reviews.jsx | Review done | `trigger.reviewSubmitted()` |

## Browser Support

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile browsers  

## That's It!

The system is **production-ready** and waiting to be used throughout the app.

Just import and call:
```jsx
import { useNotificationTrigger } from '../hooks/useNotificationTrigger';
const trigger = useNotificationTrigger();
trigger.orderDelivered('ORD-123');
```

See `NOTIFICATION_SYSTEM.md` for detailed documentation and examples.
