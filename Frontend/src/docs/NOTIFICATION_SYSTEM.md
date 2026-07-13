# Notification System Documentation

## Overview

This is a complete Amazon/Flipkart-style notification system that displays notifications based on user activities and order status changes.

## Features

✅ Multiple notification types for different events  
✅ Reverse chronological order (newest first)  
✅ Unread notification badge count  
✅ Mark as read / Mark all as read  
✅ Delete individual notifications  
✅ Clear all notifications  
✅ Date grouping (Today, Yesterday, Earlier)  
✅ Timestamp formatting (Just now, 2h ago, Yesterday, etc.)  
✅ Automatic scrolling for more than 4 notifications  
✅ Professional empty state  
✅ Persistent storage (localStorage)  
✅ Action links for relevant notifications  

## Architecture

### Core Files

1. **`context/NotificationContext.jsx`** - Central notification state management
2. **`components/website/NotificationBell.jsx`** - UI component
3. **`utils/notificationGenerators.js`** - Notification generator functions
4. **`utils/notificationUtils.js`** - Utility functions (timestamp formatting, grouping)
5. **`hooks/useNotificationTrigger.js`** - Hook to trigger notifications
6. **`utils/demoNotifications.js`** - Demo data for testing

## Usage Examples

### Basic Usage in Components

```jsx
import { useNotificationTrigger } from '../hooks/useNotificationTrigger';

function MyComponent() {
  const trigger = useNotificationTrigger();

  const handleOrderPlace = async () => {
    // ... place order logic
    trigger.orderPlaced('ORDER-123');
  };

  return <button onClick={handleOrderPlace}>Place Order</button>;
}
```

### Account Events

```jsx
trigger.accountCreated();
trigger.loginNewDevice('Chrome on Windows');
trigger.emailVerified();
trigger.phoneVerified();
trigger.passwordChanged();
trigger.profileUpdated();
```

### Order Events

```jsx
trigger.orderPlaced('ORD-001');
trigger.paymentSuccessful('ORD-001', 5999);
trigger.paymentFailed('ORD-001');
trigger.orderConfirmed('ORD-001');
trigger.orderPacked('ORD-001');
trigger.orderShipped('ORD-001', 'TRACK123');
trigger.outForDelivery('ORD-001');
trigger.orderDelivered('ORD-001');
trigger.deliveryDelayed('ORD-001');
trigger.deliveryAttempted('ORD-001');
trigger.orderCancelled('ORD-001');
```

### Return & Refund Events

```jsx
trigger.returnRequested('ORD-001');
trigger.returnApproved('ORD-001');
trigger.returnRejected('ORD-001');
trigger.pickupScheduled('ORD-001');
trigger.pickupCompleted('ORD-001');
trigger.refundInitiated('ORD-001', 5999);
trigger.refundCompleted('ORD-001', 5999);
```

### Cart & Wishlist Events

```jsx
trigger.addedToCart('Blue Elephant Miniature');
trigger.addedToWishlist('Red Ox Figurine');
trigger.wishlistItemBackInStock('Red Ox Figurine');
trigger.priceDropped('Blue Elephant', 2999, 1999);
trigger.lowStockInCart('Blue Elephant Miniature');
```

### Promotional Events

```jsx
trigger.offerAvailable('Summer Sale', 50);
trigger.couponAvailable('SUMMER50', 50);
trigger.saleStarted('Mid-Year Sale');
trigger.festivalPromotion('Diwali');
trigger.newCollectionLaunch('Monsoon Collection');
```

### Review Events

```jsx
trigger.reviewReminder('ORD-001');
trigger.reviewSubmitted();
```

## Implementation Locations

### 1. Auth Pages (Auth.jsx, ResetPassword.jsx, etc.)
```jsx
// After successful account creation
trigger.accountCreated();

// After email verification
trigger.emailVerified();

// After password change
trigger.passwordChanged();
```

### 2. Profile Page (Profile.jsx)
```jsx
// After profile update
trigger.profileUpdated();
```

### 3. Checkout (Checkout.jsx)
```jsx
// After order placement
trigger.orderPlaced(orderId);

// After payment success
trigger.paymentSuccessful(orderId, totalAmount);

// If payment fails
trigger.paymentFailed(orderId);
```

### 4. Cart Page (Cart.jsx)
```jsx
// When item added to cart
trigger.addedToCart(productName);

// When low stock warning
trigger.lowStockInCart(productName);
```

### 5. Wishlist Page (Wishlist.jsx)
```jsx
// When item added to wishlist
trigger.addedToWishlist(productName);

// When price drops
trigger.priceDropped(productName, oldPrice, newPrice);

// When item back in stock
trigger.wishlistItemBackInStock(productName);
```

### 6. Orders Page (MyOrders.jsx)
```jsx
// Simulate order status updates
// (In real app, fetch from API and trigger notifications)
trigger.orderConfirmed(orderId);
trigger.orderPacked(orderId);
trigger.orderShipped(orderId, trackingId);
trigger.outForDelivery(orderId);
trigger.orderDelivered(orderId);

// For returns
trigger.returnRequested(orderId);
trigger.returnApproved(orderId);
trigger.refundInitiated(orderId, refundAmount);
trigger.refundCompleted(orderId, refundAmount);
```

### 7. Shop/Product Page (Shop.jsx, ProductDetail.jsx)
```jsx
// Promotional notifications
trigger.newCollectionLaunch('Monsoon Collection');
trigger.offerAvailable('Festival Sale', 50);
trigger.couponAvailable('SAVE50', 50);
```

### 8. Reviews (Reviews.jsx)
```jsx
// After review submission
trigger.reviewSubmitted();

// Review reminder (triggered by order delivery)
trigger.reviewReminder(orderId);
```

## Testing the System

### Demo All Notifications

```jsx
import { generateDemoNotifications } from '../utils/demoNotifications';
import { useNotifications } from '../context/NotificationContext';

function TestNotifications() {
  const { addNotification } = useNotifications();

  const handleTestAll = () => {
    generateDemoNotifications(addNotification);
  };

  return <button onClick={handleTestAll}>Test All Notifications</button>;
}
```

### Add Single Test Notification

```jsx
import { addSampleNotification } from '../utils/demoNotifications';
import { useNotifications } from '../context/NotificationContext';

function TestNotifications() {
  const { addNotification } = useNotifications();

  return (
    <>
      <button onClick={() => addSampleNotification(addNotification, 'order')}>
        Test Order Notification
      </button>
      <button onClick={() => addSampleNotification(addNotification, 'promotion')}>
        Test Promotion Notification
      </button>
      <button onClick={() => addSampleNotification(addNotification, 'account')}>
        Test Account Notification
      </button>
    </>
  );
}
```

## Notification Structure

Each notification has the following structure:

```javascript
{
  id: 'notif-1234567890-abcdef',  // Auto-generated
  title: 'Order Delivered',        // Display title
  message: 'Your order...',        // Display message
  icon: FiCheckCircle,             // React icon component
  category: 'order',               // 'account'|'order'|'shopping'|'promotion'|'review'
  timestamp: '2024-01-15T10:30:00Z', // ISO string
  action: {                        // Optional
    label: 'View Order',
    link: '/orders/ORD-001'
  }
}
```

## Notification Categories & Colors

| Category   | Color  | Use For |
|------------|--------|---------|
| account    | Pink   | Account-related events |
| order      | Blue   | Order and delivery events |
| shopping   | Purple | Cart and wishlist events |
| promotion  | Amber  | Sales and promotions |
| review     | Orange | Reviews and ratings |

## Storage

- Notifications are stored in localStorage under key `mm-notifications`
- Read IDs are stored under key `mm-notif-read-ids`
- Data persists across page refreshes
- Maximum ~50KB per key (browser-dependent)

## API Integration (Future)

To integrate with a backend API:

1. Replace `localStorage` fetching with API calls in `NotificationContext`
2. Emit events from API responses to trigger notifications
3. Or fetch notifications from `/api/notifications` endpoint
4. Use WebSockets for real-time updates

```jsx
// Example API integration
useEffect(() => {
  const socket = io('https://api.mohanmaya.com');
  socket.on('order:shipped', (data) => {
    trigger.orderShipped(data.orderId, data.trackingId);
  });
  return () => socket.disconnect();
}, []);
```

## Performance Considerations

- Notifications are stored in localStorage (not infinite - ~50 max recommended)
- Delete old notifications periodically
- GroupNotificationsByDate() memoized to prevent unnecessary recalculations
- Timestamps formatted on-demand (not on every render)

## Accessibility

- Proper ARIA labels for unread badges
- Keyboard navigation support
- High contrast for unread notifications
- Semantic HTML structure

## Browser Support

Works in all modern browsers supporting:
- localStorage API
- React 18+
- Framer Motion animations
- ES2020+ JavaScript

## Customization

### Change Notification Colors
Edit `getNotificationIconColor()` and `getNotificationBgColor()` in `notificationUtils.js`

### Change Max Height
Edit `max-h-[360px]` in `NotificationBell.jsx` component

### Change Timestamp Format
Edit `formatNotificationTime()` in `notificationUtils.js`

### Add New Notification Types
1. Add generator function in `notificationGenerators.js`
2. Add trigger method in `useNotificationTrigger.js`
3. Use in your component via `useNotificationTrigger()`

## Troubleshooting

### Notifications not showing
- Check if `NotificationProvider` is wrapped around app in `main.jsx`
- Verify component imports `useNotifications` or `useNotificationTrigger`
- Check browser console for errors

### Notifications disappearing after refresh
- Check if localStorage is enabled
- Check localStorage keys: `mm-notifications`, `mm-notif-read-ids`
- Clear cache and retry

### Styling issues
- Ensure Tailwind CSS is configured properly
- Check if colors are in Tailwind config
- Verify no CSS conflicts with existing styles
