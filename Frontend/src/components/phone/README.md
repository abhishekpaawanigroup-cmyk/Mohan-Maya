# International Phone Input Integration Guide

Production-ready international phone input system integrated with automatic country detection.

## 🌍 Features

- ✅ **Auto Country Detection**: Displays country-specific dialing code automatically
- ✅ **Searchable Dropdown**: Find countries quickly
- ✅ **Country Flags**: Visual country identification
- ✅ **localStorage Persistence**: Remember user's country selection
- ✅ **Manual Override**: User can change country anytime
- ✅ **Responsive Design**: Works on all devices
- ✅ **Dark Mode Support**: Matches your existing design
- ✅ **No External Libraries**: Built-in component (optional: use react-international-phone)
- ✅ **Tailwind CSS**: Styled with your existing framework
- ✅ **Validation Ready**: Easy to add phone number validation

## 📁 Files Created

```
src/components/phone/
├── InternationalPhoneInput.jsx          # Simple phone input
├── AdvancedPhoneInput.jsx               # Full-featured with dropdown
├── PHONE_INPUT_GUIDE.md                 # Detailed integration guide
├── PHONE_INPUT_EXAMPLES.jsx             # Code examples
└── README.md                            # This file

src/hooks/
└── useInternationalPhone.js             # Phone input management hook
```

## 🚀 Quick Start

### 1. **Import the Component**

```jsx
import AdvancedPhoneInput from "../components/phone/AdvancedPhoneInput";
```

### 2. **Add to Your Form**

```jsx
import { useState } from "react";
import AdvancedPhoneInput from "../components/phone/AdvancedPhoneInput";

function MyForm() {
  const [phone, setPhone] = useState("");

  return (
    <form>
      <AdvancedPhoneInput
        value={phone}
        onChange={setPhone}
        label="Phone Number"
        placeholder="Enter your phone number"
        required
      />
    </form>
  );
}
```

### 3. **That's It!**

The component automatically:
- Detects user's country
- Shows the correct dialing code (🇮🇳 +91, 🇺🇸 +1, etc.)
- Allows country selection
- Saves selection to localStorage
- Remembers choice on page refresh

## 📱 Display Examples

### Detected Country = India
```
[🇮🇳 +91] [Phone Number Input]
```

### Detected Country = United States
```
[🇺🇸 +1] [Phone Number Input]
```

### Detected Country = United Kingdom
```
[🇬🇧 +44] [Phone Number Input]
```

### Mobile View
```
[🇮🇳] [Phone Number Input]
(dialing code hidden to save space)
```

## 🎯 Component API

### AdvancedPhoneInput

```jsx
<AdvancedPhoneInput
  value={phone}                          // Current phone value
  onChange={(phone) => setPhone(phone)}  // Called when phone changes
  onCountryChange={(code) => {...}}      // Called when country changes
  label="Phone Number"                   // Input label
  placeholder="Enter your number"        // Input placeholder
  error="Phone is required"              // Error message (if any)
  hint="Include country code"            // Helper text
  required                               // Required field
  disabled={false}                       // Disable input
  showLabel={true}                       // Show/hide label
  className=""                           // Additional CSS classes
/>
```

### InternationalPhoneInput (Simpler Version)

For a simpler version without country dropdown:

```jsx
<InternationalPhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  placeholder="Enter your number"
  required
/>
```

### useInternationalPhone Hook

For custom implementations:

```jsx
import { useInternationalPhone } from "../hooks/useInternationalPhone";

function MyComponent() {
  const {
    phone,                    // Current phone value
    setPhone,                 // Update phone
    selectedCountry,          // Currently selected country code
    setSelectedCountry,       // Change country
    detectedCountry,          // Auto-detected country
    isManuallySelected,       // User changed country manually
    resetToDetectedCountry,   // Reset to auto-detected
  } = useInternationalPhone();

  return (
    // Your custom implementation
  );
}
```

## 💾 localStorage Integration

### Storage Key: `mm-phone-country-override`

Automatically saves when user selects a country:

```javascript
// Example: User selected USA
localStorage.setItem("mm-phone-country-override", "US");

// On next visit, component shows: 🇺🇸 +1
```

### Clear Storage (Reset to Auto-Detection)

```javascript
localStorage.removeItem("mm-phone-country-override");
```

## 🌐 Supported Countries & Dialing Codes

| Flag | Country | Code | Dialing Code |
|------|---------|------|--------------|
| 🇮🇳 | India | IN | +91 |
| 🇺🇸 | United States | US | +1 |
| 🇬🇧 | United Kingdom | GB | +44 |
| 🇦🇪 | United Arab Emirates | AE | +971 |
| 🇨🇦 | Canada | CA | +1 |
| 🇦🇺 | Australia | AU | +61 |
| 🇸🇬 | Singapore | SG | +65 |
| 🇩🇪 | Germany | DE | +49 |
| 🇫🇷 | France | FR | +33 |
| 🇯🇵 | Japan | JP | +81 |

**Add more countries in `src/data/countryConstants.js`**

## ✅ Validation Example

```jsx
function validatePhone(phone, country) {
  if (!phone) return "Phone number is required";

  const digits = phone.replace(/\D/g, "");

  // Country-specific validation
  const rules = {
    IN: { min: 10, max: 10 },      // India: 10 digits
    US: { min: 10, max: 10 },      // USA: 10 digits
    GB: { min: 11, max: 11 },      // UK: 11 digits
    AE: { min: 9, max: 9 },        // UAE: 9 digits
  };

  const rule = rules[country] || { min: 8, max: 15 };

  if (digits.length < rule.min || digits.length > rule.max) {
    return `Please enter a valid ${country} phone number`;
  }

  return null; // Valid
}

// Usage
const error = validatePhone("+91 9876543210", "IN");
```

## 🔄 Complete Checkout Form Example

```jsx
import { useState, useEffect } from "react";
import AdvancedPhoneInput from "../components/phone/AdvancedPhoneInput";
import { useCountry } from "../hooks/useCountry";

function CheckoutForm() {
  const { country: detectedCountry } = useCountry();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: detectedCountry,
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState({});

  // Sync detected country with form
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      country: detectedCountry,
    }));
  }, [detectedCountry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = (newPhone) => {
    setFormData((prev) => ({ ...prev, phone: newPhone }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
  };

  const handleCountryChange = (newCountry) => {
    // Clear dependent fields when country changes
    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      state: "",
      city: "",
      zipcode: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Name required";
    if (!formData.phone) newErrors.phone = "Phone required";
    if (!formData.address) newErrors.address = "Address required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    console.log("Submitting:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
        {errors.fullName && (
          <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      {/* Phone Input - NEW! */}
      <AdvancedPhoneInput
        value={formData.phone}
        onChange={handlePhoneChange}
        onCountryChange={handleCountryChange}
        label="Phone Number"
        error={errors.phone}
        hint="We'll use this to contact you about your order"
        required
      />

      <div>
        <label className="block text-sm font-semibold mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg"
      >
        Place Order
      </button>
    </form>
  );
}
```

## 🎨 Styling & Customization

The component uses Tailwind CSS and inherits your existing design:

- **Text**: Matches your dark mode
- **Borders**: Gray by default, red for errors
- **Focus**: Pink ring (`focus:ring-[#fe4462]`)
- **Hover**: Light gray background
- **Selected**: Highlighted in pink

To customize, edit the className values in `AdvancedPhoneInput.jsx`.

## 🔌 Integration with Existing Forms

### Before (Plain Input)

```jsx
<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone number"
  className="input-field"
/>
```

### After (Smart Input)

```jsx
<AdvancedPhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  required
/>
```

## 📊 Data Flow

```
User visits website
        ↓
CountryContext detects country (e.g., "IN")
        ↓
Phone component loads with 🇮🇳 +91
        ↓
User can:
  • Type phone number
  • Click flag to change country
  • Search for country
        ↓
Selection saved to localStorage
        ↓
On next visit → component shows saved country
        ↓
All automatic!
```

## 🐛 Troubleshooting

### Phone input not showing detected country

**Solution**: Make sure `CountryProvider` wraps your app in `App.jsx`

```jsx
<CountryProvider>
  <AppRoutes />
</CountryProvider>
```

### Country not persisting on refresh

**Solution**: Check browser DevTools → Application → Storage → localStorage

Look for key: `mm-phone-country-override`

### Need to add more countries

**Solution**: Edit `src/data/countryConstants.js`

```javascript
export const COUNTRY_LIST = {
  // ... existing countries
  NZ: {
    name: "New Zealand",
    code: "NZ",
    phoneCode: "+64",
    currency: "NZD",
    flag: "🇳🇿",
  },
};
```

## 🚫 What's NOT Included

- ❌ Browser geolocation popup (not needed - we use IP detection)
- ❌ Phone number formatting library (simple sanitization included)
- ❌ SMS validation (you add this on backend)
- ❌ International formatting (basic support included)

## ✨ Optional: Advanced Library Integration

For advanced features, install react-international-phone:

```bash
npm install react-international-phone
```

Then use the library's components while keeping our country detection context.

## 📝 Development Logging

In development mode (`npm run dev`), you'll see console logs:

```
[PhoneInput] Country selected: US
[PhoneInput] Selected country saved: US
```

Logs are automatically disabled in production build.

## 🎯 Best Practices

1. **Always include a label** for accessibility
2. **Provide error messages** when validation fails
3. **Use country change event** to reset dependent fields (like state/city)
4. **Validate on blur** for better UX
5. **Show helper text** like "We'll call you at this number"

## 📞 Example: Contact Form

```jsx
function ContactForm() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form>
      <AdvancedPhoneInput
        value={phone}
        onChange={setPhone}
        label="Your Phone"
        hint="So we can call you back"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        className="w-full p-3 border rounded-lg mt-4"
      />

      <button type="submit" className="mt-4 bg-[#fe4462] text-white px-6 py-2 rounded">
        Send
      </button>
    </form>
  );
}
```

## 🔒 Privacy & Security

- No tracking cookies
- No IP logging
- No personal data stored
- Uses country detection API (ipapi.co)
- Only phone format validation (no external verification)

## 📄 License

Part of your Mohan Maya eCommerce website.

---

**Ready to integrate?** Start with the Quick Start section above! 🚀
