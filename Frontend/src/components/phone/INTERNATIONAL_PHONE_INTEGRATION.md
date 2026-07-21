# International Phone Input - Production Integration Guide

## Overview

This guide explains how to use the new `InternationalPhone` component, which integrates the production-ready `react-international-phone` library with your automatic country detection system.

## Features

✅ **Automatic Country Detection**
- Detects user's country via IP geolocation
- Auto-displays correct international dialing code (🇮🇳 +91, 🇺🇸 +1, etc.)
- No manual configuration needed

✅ **Persistent Country Selection**
- Remembers manual country selection in localStorage
- Uses manual selection on future visits instead of re-detecting
- Can reset to auto-detection anytime

✅ **Production-Ready**
- Uses `react-international-phone` library
- Includes libphonenumber validation
- Works offline after first detection

✅ **Beautiful UI**
- Full Tailwind CSS dark mode support
- Error state styling
- Responsive design for mobile/desktop
- Smooth animations and transitions

✅ **No Breaking Changes**
- Existing UI and styling preserved
- Drop-in replacement for phone input

## Installation

The library is already installed. If you need to reinstall:

```bash
npm install react-international-phone libphonenumber-js
```

## Basic Usage

```jsx
import { useState } from 'react';
import InternationalPhone from '../components/phone/InternationalPhone';

export default function Checkout() {
  const [phone, setPhone] = useState('');

  return (
    <form>
      <InternationalPhone
        value={phone}
        onChange={setPhone}
        label="Phone Number"
        placeholder="Enter your phone number"
        required
      />
      <button type="submit">Place Order</button>
    </form>
  );
}
```

## Component Props

```jsx
<InternationalPhone
  // Required
  value={phoneNumber}           // Current phone value with country code
  onChange={handlePhoneChange}  // Called when phone changes

  // Optional
  label="Phone Number"          // Input label (default: "Phone Number")
  placeholder="..."             // Input placeholder
  error={errorMessage}          // Error message to display
  required={true}               // HTML required attribute
  disabled={false}              // Disable input
  className="custom-class"      // Additional CSS classes
/>
```

## How It Works

### Step 1: User Visits Your Website

The system automatically:
1. Detects user's country via IP (e.g., "IN" for India)
2. Displays country flag + dialing code (🇮🇳 +91)
3. User sees the correct format for their country

### Step 2: User Changes Country

If user clicks the flag and selects a different country:
1. Manual selection is saved to localStorage
2. On future visits, manual selection is used
3. Flag and dialing code update accordingly

### Step 3: User Resets

User can always reset by clearing their browser's localStorage
- Key: `mm-phone-country-override`
- Next visit will auto-detect again

## Complete Checkout Example

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InternationalPhone from '../../../components/phone/InternationalPhone';
import { useApp } from '../../../context/AppContext';
import { useCountry } from '../../../hooks/useCountry';

export default function Checkout() {
  const navigate = useNavigate();
  const { country: detectedCountry } = useCountry();
  const { placeOrder } = useApp();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: detectedCountry,
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form country with detected country
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      country: detectedCountry,
    }));
  }, [detectedCountry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhoneChange = (newPhone) => {
    setForm(prev => ({ ...prev, phone: newPhone }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!form.email.trim()) newErrors.email = 'Email required';
    if (!form.phone) {
      newErrors.phone = 'Phone number required';
    } else if (form.phone.length < 10) {
      newErrors.phone = 'Phone number too short';
    }
    if (!form.address.trim()) newErrors.address = 'Address required';
    if (!form.city.trim()) newErrors.city = 'City required';
    if (!form.state.trim()) newErrors.state = 'State required';
    if (!form.zipcode.trim()) newErrors.zipcode = 'Postal code required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await placeOrder(form);
      navigate('/orders');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to place order',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleInputChange}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: dark:bg-gray-800 dark:text-white ${
            errors.fullName
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errors.fullName && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: dark:bg-gray-800 dark:text-white ${
            errors.email
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errors.email && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone - PRODUCTION LIBRARY */}
      <div>
        <InternationalPhone
          value={form.phone}
          onChange={handlePhoneChange}
          label="Phone Number"
          placeholder="Enter your phone number"
          error={errors.phone}
          required
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleInputChange}
          placeholder="123 Main Street"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: dark:bg-gray-800 dark:text-white ${
            errors.address
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errors.address && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {errors.address}
          </p>
        )}
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: dark:bg-gray-800 dark:text-white ${
              errors.city
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          {errors.city && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: dark:bg-gray-800 dark:text-white ${
              errors.state
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          {errors.state && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.state}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            name="zipcode"
            value={form.zipcode}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: dark:bg-gray-800 dark:text-white ${
              errors.zipcode
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          {errors.zipcode && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.zipcode}
            </p>
          )}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg hover:bg-[#fd2d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

## Integration Steps

### 1. Import the Component

```jsx
import InternationalPhone from '../../../components/phone/InternationalPhone';
```

### 2. Replace Phone Input

Find your current phone input and replace with:

```jsx
<InternationalPhone
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  required
/>
```

### 3. Test in Browser

- Load page and verify flag displays for your country
- Check DevTools → Application → LocalStorage for `mm-detected-country` key
- Click flag and select different country
- Refresh page - should remember your selection

## Common Use Cases

### Use Case 1: Checkout Form

```jsx
<InternationalPhone
  value={form.phone}
  onChange={(newPhone) => setForm({...form, phone: newPhone})}
  label="Phone Number"
  error={errors.phone}
  required
/>
```

### Use Case 2: Profile Edit Form

```jsx
<InternationalPhone
  value={userPhone}
  onChange={setUserPhone}
  label="Contact Number"
/>
```

### Use Case 3: Registration Form

```jsx
<InternationalPhone
  value={phone}
  onChange={setPhone}
  label="Mobile Number"
  placeholder="Enter your mobile"
  required
/>
```

### Use Case 4: With Manual Country Override

```jsx
const [phone, setPhone] = useState('');

<InternationalPhone
  value={phone}
  onChange={setPhone}
  label="Work Phone"
  error={errors.phone}
/>
```

## Phone Number Format

The library automatically handles phone number formatting. Examples:

- **India:** `+919876543210` (displayed as 🇮🇳 +91 9876543210)
- **USA:** `+12025551234` (displayed as 🇺🇸 +1 202-555-1234)
- **UK:** `+442071838750` (displayed as 🇬🇧 +44 20 7183 8750)
- **UAE:** `+971501234567` (displayed as 🇦🇪 +971 50 123 4567)

## Supported Countries

The component supports all countries with international dialing codes. Here are some examples:

- 🇮🇳 India (+91)
- 🇺🇸 United States (+1)
- 🇬🇧 United Kingdom (+44)
- 🇦🇪 UAE (+971)
- 🇨🇦 Canada (+1)
- 🇦🇺 Australia (+61)
- 🇯🇵 Japan (+81)
- 🇩🇪 Germany (+49)
- 🇫🇷 France (+33)
- 🇸🇬 Singapore (+65)

Plus 190+ more countries.

## Dark Mode

Dark mode is fully supported and automatic based on your Tailwind configuration:

```jsx
@media (prefers-color-scheme: dark) {
  // Automatically applied
}

// Or with Tailwind class
<div className="dark">
  <InternationalPhone ... />
</div>
```

## Error Handling

Display validation errors above or below the input:

```jsx
const [phone, setPhone] = useState('');
const [error, setError] = useState(null);

const handleValidation = (value) => {
  if (!value) {
    setError('Phone number is required');
  } else if (value.length < 10) {
    setError('Phone number must be at least 10 digits');
  } else {
    setError(null);
  }
};

<InternationalPhone
  value={phone}
  onChange={(value) => {
    setPhone(value);
    handleValidation(value);
  }}
  error={error}
/>
```

## localStorage Keys

The system uses these localStorage keys:

```
mm-detected-country           // Auto-detected country (e.g., "IN")
mm-country-auto-detected      // Boolean flag for auto-detection
mm-country-timestamp          // Timestamp for cache expiry
mm-phone-country-override     // Manual country selection (e.g., "US")
```

To reset everything:

```javascript
localStorage.removeItem('mm-detected-country');
localStorage.removeItem('mm-country-auto-detected');
localStorage.removeItem('mm-country-timestamp');
localStorage.removeItem('mm-phone-country-override');
```

## Troubleshooting

### Issue: Flag not showing

**Solution:** Wait 2-3 seconds for country detection to complete

### Issue: Wrong country showing

**Solution:** Check if you're using a VPN or proxy

### Issue: Styles not applying

**Solution:** Verify imports are correct:
```jsx
import InternationalPhone from '../components/phone/InternationalPhone';
```

### Issue: Phone not persisting on form submit

**Solution:** Ensure `value` and `onChange` are properly connected:
```jsx
<InternationalPhone
  value={form.phone}    // ✓ Correct
  onChange={(phone) => setForm({...form, phone})}  // ✓ Correct
/>
```

## Performance

- **First Load:** 2-3 seconds (country detection via IP API)
- **Subsequent Loads:** Instant (cached in localStorage)
- **Country Selection:** Instant (no API calls)
- **Bundle Size:** ~80KB (library included)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 8+)

## License

- Component: MIT (your project)
- `react-international-phone`: MIT
- `libphonenumber-js`: ISC

---

**Questions?** Check the component source code at:
`src/components/phone/InternationalPhone.jsx`

**Need more customization?** See the [react-international-phone docs](https://www.npmjs.com/package/react-international-phone)
