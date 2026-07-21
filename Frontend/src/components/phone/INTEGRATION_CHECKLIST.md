/**
 * PHONE INPUT INTEGRATION CHECKLIST
 * 
 * Step-by-step instructions to integrate international phone input
 * into your existing Checkout, Profile, and other forms
 */

// ============================================
// ✅ STEP 1: VERIFY SETUP (5 minutes)
// ============================================

/*
1. Open App.jsx
   ✓ Verify CountryProvider is wrapped
   
   Example:
   <CountryProvider>
     <AppRoutes />
   </CountryProvider>

2. Verify components/phone/ folder exists with:
   ✓ AdvancedPhoneInput.jsx
   ✓ InternationalPhoneInput.jsx
   ✓ README.md
   ✓ PHONE_INPUT_GUIDE.md

3. Verify hooks/useInternationalPhone.js exists
*/

// ============================================
// ✅ STEP 2: INTEGRATE INTO CHECKOUT (10 minutes)
// ============================================

/*
FILE: src/pages/website/Checkout/Checkout.jsx

BEFORE:
--------
<input
  type="tel"
  name="phone"
  value={form.phone}
  onChange={(e) => setForm({...form, phone: e.target.value})}
  placeholder="Phone"
  className="input-field"
/>

AFTER:
------
import AdvancedPhoneInput from "../../../components/phone/AdvancedPhoneInput";

// In your JSX:
<AdvancedPhoneInput
  value={form.phone}
  onChange={(newPhone) => setForm({...form, phone: newPhone})}
  onCountryChange={(newCountry) => setForm({...form, country: newCountry})}
  label="Phone Number"
  placeholder="Enter your phone number"
  error={errors.phone}
  required
/>

// Optional: Clear phone when country changes
const handleCountryChange = (newCountry) => {
  setForm(prev => ({
    ...prev,
    country: newCountry,
    phone: '', // Clear phone to avoid format mismatch
    state: '', // Clear state too
    city: '',
  }));
};
*/

// ============================================
// ✅ STEP 3: INTEGRATE INTO PROFILE (10 minutes)
// ============================================

/*
FILE: src/pages/website/Profile/Profile.jsx

BEFORE:
--------
<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone"
/>

AFTER:
------
import AdvancedPhoneInput from "../../../components/phone/AdvancedPhoneInput";

<AdvancedPhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  required
/>
*/

// ============================================
// ✅ STEP 4: ADD VALIDATION (5 minutes)
// ============================================

/*
Function: Validate phone number by country

Add this function to your component or utils:
*/

export function validatePhoneByCountry(phone, countryCode) {
  if (!phone) return "Phone number is required";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Country-specific validation rules
  const countryRules = {
    IN: { min: 10, max: 10, name: "India" }, // 10 digits
    US: { min: 10, max: 10, name: "USA" }, // 10 digits
    GB: { min: 11, max: 11, name: "UK" }, // 11 digits
    AE: { min: 9, max: 9, name: "UAE" }, // 9 digits
    CA: { min: 10, max: 10, name: "Canada" }, // 10 digits
    AU: { min: 9, max: 9, name: "Australia" }, // 9 digits
  };

  const rule = countryRules[countryCode] || { min: 8, max: 15 };

  if (digits.length < rule.min) {
    return `Phone number too short for ${rule.name}`;
  }

  if (digits.length > rule.max) {
    return `Phone number too long for ${rule.name}`;
  }

  return null; // Valid!
}

/*
Usage in form:
*/

const validateForm = () => {
  const phoneError = validatePhoneByCountry(phone, country);
  if (phoneError) {
    setErrors((prev) => ({ ...prev, phone: phoneError }));
    return false;
  }
  return true;
};

// ============================================
// ✅ STEP 5: TEST INTEGRATION (10 minutes)
// ============================================

/*
1. Open browser DevTools
   → Application → Storage → LocalStorage
   → Look for 'mm-detected-country' (auto-detected)
   → Look for 'mm-phone-country-override' (manual selection)

2. Test functionality:
   □ Page loads with detected country's code
   □ Can click flag to open dropdown
   □ Can search for countries
   □ Can select different country
   □ Selection saved to localStorage
   □ Refresh page - country persists
   □ Phone validation works
   □ Error messages display

3. Test mobile responsive:
   □ Flag visible on mobile
   □ Dialing code hidden on small screens
   □ Dropdown scrollable on mobile
   □ Input full width on mobile
*/

// ============================================
// ✅ STEP 6: CUSTOMIZE AS NEEDED (varies)
// ============================================

/*
Optional customizations:

1. Change default error color:
   Edit AdvancedPhoneInput.jsx, change:
   "text-red-600" → "text-orange-600"

2. Add more countries:
   Edit src/data/countryConstants.js

3. Custom validation:
   Create validatePhoneByCountry function
   Pass via error prop

4. Custom styling:
   Wrap component in custom className
   Or edit Tailwind classes directly

5. Add phone formatting:
   Use react-phone-input-2 library
   Or implement custom formatter
*/

// ============================================
// ✅ STEP 7: DEPLOYMENT CHECKLIST
// ============================================

/*
Before deploying to production:

□ All phone inputs replaced with AdvancedPhoneInput
□ Validation implemented and tested
□ Error messages display correctly
□ Mobile responsive looks good
□ Dark mode works
□ localStorage works
□ Country detection working
□ No console errors
□ No unused imports
□ Performance acceptable
□ Accessibility good (labels, aria-labels)
*/

// ============================================
// COMPONENT COMPARISON
// ============================================

/*
Choose between these components:

InternationalPhoneInput:
  ✓ Simple, lightweight
  ✓ Just country flag + code display
  ✗ No country selection dropdown
  Use when: You just need to show the code

AdvancedPhoneInput:
  ✓ Full-featured
  ✓ Country dropdown
  ✓ Search functionality
  ✓ localStorage persistence
  ✓ Professional appearance
  ✓ Recommended for checkout
  Use when: Users need to select country

useInternationalPhone Hook:
  ✓ Maximum flexibility
  ✓ Full control over UI
  ✗ Requires custom implementation
  Use when: Building custom component
*/

// ============================================
// EXAMPLE: CHECKOUT FORM WITH PHONE
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdvancedPhoneInput from "../../../components/phone/AdvancedPhoneInput";
import { useCountry } from "../../../hooks/useCountry";
import { useApp } from "../../../context/AppContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { country: detectedCountry } = useCountry();
  const { placeOrder } = useApp();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep country in sync with detected country
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      country: detectedCountry,
    }));
  }, [detectedCountry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhoneChange = (newPhone) => {
    setFormData((prev) => ({ ...prev, phone: newPhone }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 8)
        newErrors.phone = "Phone number must be at least 8 digits";
    }

    if (!formData.address.trim())
      newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipcode.trim())
      newErrors.zipcode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Place order
      await placeOrder(formData);
      navigate("/orders");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to place order",
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: ${
            errors.fullName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          required
        />
        {errors.fullName && (
          <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: ${
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          required
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone - NEW COMPONENT */}
      <AdvancedPhoneInput
        value={formData.phone}
        onChange={handlePhoneChange}
        onCountryChange={handleCountryChange}
        label="Phone Number"
        error={errors.phone}
        hint="We'll use this number to contact you about your order"
        required
      />

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main Street"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: ${
            errors.address
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          required
        />
        {errors.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* City, State, Zipcode */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: ${
              errors.city
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: ${
              errors.state
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus: ${
              errors.zipcode
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {errors.zipcode && (
            <p className="text-red-600 text-sm mt-1">{errors.zipcode}</p>
          )}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg hover:bg-[#fd2d4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}

// ============================================
// COMMON ERRORS & SOLUTIONS
// ============================================

/*
Error: "useCountry must be used within CountryProvider"
Solution: Verify CountryProvider wraps the component in App.jsx

Error: "AdvancedPhoneInput not found"
Solution: Verify file exists at src/components/phone/AdvancedPhoneInput.jsx

Error: Phone country not persisting
Solution: Check browser localStorage, verify 'mm-phone-country-override' key exists

Error: Detected country not showing
Solution: 
  1. Wait 2-3 seconds (detection takes time)
  2. Check console for errors
  3. Try clearing localStorage and refreshing

Error: Country dropdown not opening
Solution: Verify all event handlers are properly connected
*/

export {};
