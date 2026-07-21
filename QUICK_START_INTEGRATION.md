# Quick Start: Integrate Phone Input into Your Forms

## ⚡ 5-Minute Integration

### Step 1: Update Checkout Form

**File:** `src/pages/website/Checkout/Checkout.jsx`

Find the phone input section and replace it:

**BEFORE:**
```jsx
<input
  type="tel"
  name="phone"
  value={form.phone}
  onChange={(e) => setForm({...form, phone: e.target.value})}
  placeholder="Phone"
  className="input-field"
/>
```

**AFTER:**
```jsx
import AdvancedPhoneInput from "../../../components/phone/AdvancedPhoneInput";

// In your JSX:
<AdvancedPhoneInput
  value={form.phone}
  onChange={(newPhone) => setForm({...form, phone: newPhone})}
  onCountryChange={(newCountry) => {
    // Clear dependent fields when country changes
    setForm(prev => ({
      ...prev,
      country: newCountry,
      state: '',
      city: '',
      zipcode: '',
    }));
  }}
  label="Phone Number"
  placeholder="Enter your phone number"
  error={errors.phone}
  required
/>
```

### Step 2: Verify in Browser

1. Open dev tools → Application → Storage → LocalStorage
2. Look for `mm-detected-country` key (should have your country code)
3. Verify phone field shows correct dialing code (🇮🇳 +91 for India, 🇺🇸 +1 for USA, etc.)
4. Try clicking the flag to open country dropdown
5. Search for a country and select it
6. Verify it persists on page refresh

### Step 3: Profile Form (Optional)

**File:** `src/pages/website/Profile/Profile.jsx`

Same pattern as Checkout:

```jsx
import AdvancedPhoneInput from "../../../components/phone/AdvancedPhoneInput";

<AdvancedPhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  required
/>
```

---

## 🧪 Testing Checklist

### Desktop Testing
- [ ] Page loads with your country's flag and code
- [ ] Can click flag to open dropdown
- [ ] Can search for countries by name
- [ ] Can search for countries by code
- [ ] Can search for countries by phone code
- [ ] Country selection updates phone input code
- [ ] Refresh page - country persists
- [ ] Manual selection marked differently from auto-detected

### Mobile Testing
- [ ] Flag visible on mobile
- [ ] Phone code visible on mobile
- [ ] Dropdown scrollable and usable
- [ ] Touch-friendly sizing
- [ ] No layout issues

### Dark Mode Testing
- [ ] Dropdown visible in dark mode
- [ ] Text contrast sufficient
- [ ] Flags display clearly
- [ ] No visual glitches

### Validation Testing
- [ ] Can enter phone numbers
- [ ] Can submit form with phone
- [ ] Error message displays if needed
- [ ] Country change clears validation errors

---

## 📍 What You'll See

### For User in India
- Flag: 🇮🇳
- Code: +91
- Country Name: India
- Phone Input: Ready for 10-digit number

### For User in USA
- Flag: 🇺🇸
- Code: +1
- Country Name: United States
- Phone Input: Ready for 10-digit number

### For User in UK
- Flag: 🇬🇧
- Code: +44
- Country Name: United Kingdom
- Phone Input: Ready for 11-digit number

*Automatically detected based on IP address*

---

## 🔧 If Something Doesn't Work

### Country Not Detecting
1. Check browser console for errors
2. Verify you can make API requests to `ipapi.co/json/`
3. Check that CountryProvider is in App.jsx
4. Wait 2-3 seconds (detection takes time)

### Phone Dropdown Not Opening
1. Check browser console for JavaScript errors
2. Verify import path is correct: `../../../components/phone/AdvancedPhoneInput`
3. Check that component file exists
4. Test in fresh browser window

### Not Persisting on Refresh
1. Check DevTools → Application → Storage → LocalStorage
2. Look for `mm-phone-country-override` key
3. Verify localStorage is enabled in browser
4. Check privacy settings aren't blocking storage

### Wrong Country Showing
1. The IP API might return unexpected results in some regions
2. User can manually select their country from dropdown
3. Selection will persist for future visits

---

## 📱 Component Props Reference

```jsx
<AdvancedPhoneInput
  // Required
  value={phoneNumber}              // Current phone value
  onChange={handlePhoneChange}     // Called when phone changes
  
  // Optional - Recommended
  onCountryChange={handleCountryChange}  // Called when country changes
  label="Phone Number"              // Label text
  error={errorMessage}              // Error message to display
  
  // Optional - Nice to have
  placeholder="Enter phone"         // Placeholder text
  required={true}                   // HTML required attribute
  disabled={false}                  // Disable input
  hint="Format: XXXXXXXXXX"         // Hint text below input
  showLabel={true}                  // Show label
  className="custom-class"          // Additional CSS classes
/>
```

---

## ✨ Features Included

✅ Auto-detects country via IP  
✅ Shows country flag and dialing code  
✅ Searchable country dropdown  
✅ Remembers country selection  
✅ Responsive design  
✅ Dark mode support  
✅ Error messaging  
✅ Mobile-optimized  
✅ No API authentication needed  
✅ Works offline (after first detection)  

---

## 🎯 Complete Integration Example

Here's a complete form example:

```jsx
import { useState } from 'react';
import AdvancedPhoneInput from '../../../components/phone/AdvancedPhoneInput';
import { useCountry } from '../../../hooks/useCountry';

export default function CheckoutForm() {
  const { country: detectedCountry } = useCountry();
  
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

  const handlePhoneChange = (newPhone) => {
    setForm(prev => ({ ...prev, phone: newPhone }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  };

  const handleCountryChange = (newCountry) => {
    setForm(prev => ({
      ...prev,
      country: newCountry,
      state: '',
      city: '',
      zipcode: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name required';
    if (!form.phone) newErrors.phone = 'Phone required';
    if (!form.address.trim()) newErrors.address = 'Address required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit form
      console.log('Submitting:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1>Checkout</h1>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold">Full Name</label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* PHONE - NEW COMPONENT */}
      <AdvancedPhoneInput
        value={form.phone}
        onChange={handlePhoneChange}
        onCountryChange={handleCountryChange}
        label="Phone Number"
        error={errors.phone}
        required
      />

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#fe4462] text-white font-semibold py-2 rounded hover:bg-[#fd2d4a]"
      >
        Place Order
      </button>
    </form>
  );
}
```

---

## 🚀 Ready to Deploy

After integration:
1. Test on desktop
2. Test on mobile
3. Test in dark mode
4. Test with different countries
5. Deploy to production

The phone input component is production-ready and handles all edge cases!

---

**Need help?** Check these files for more details:
- `src/components/phone/README.md` - Full API reference
- `src/components/phone/INTEGRATION_CHECKLIST.md` - Step-by-step guide
- `src/components/phone/PHONE_INPUT_GUIDE.md` - Setup examples
