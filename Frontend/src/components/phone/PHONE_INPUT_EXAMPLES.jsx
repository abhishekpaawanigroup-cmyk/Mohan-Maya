/**
 * QUICK START - Phone Input Integration
 * 
 * Copy and paste this code into your checkout form
 */

/**
 * ============================================
 * STEP 1: Import the component
 * ============================================
 */

import AdvancedPhoneInput from "../phone/AdvancedPhoneInput";
import { useCountry } from "../../hooks/useCountry";

/**
 * ============================================
 * STEP 2: Use in your form
 * ============================================
 */

export function QuickStartExample() {
  const { country } = useCountry();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [phoneError, setPhoneError] = useState(null);

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (phoneError) setPhoneError(null);
  };

  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    setPhone(""); // Clear phone when country changes
  };

  const validatePhone = () => {
    if (!phone) {
      setPhoneError("Phone number is required");
      return false;
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) {
      setPhoneError("Phone number must be at least 8 digits");
      return false;
    }

    return true;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (validatePhone()) {
          console.log("Phone:", phone);
          console.log("Country:", selectedCountry);
        }
      }}
      className="space-y-6"
    >
      <AdvancedPhoneInput
        value={phone}
        onChange={handlePhoneChange}
        onCountryChange={handleCountryChange}
        label="Phone Number"
        placeholder="Enter your phone number"
        error={phoneError}
        hint="We'll use this number to contact you about your order"
        required
      />

      <button
        type="submit"
        className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg hover:bg-[#fd2d4a] transition-colors"
      >
        Continue to Checkout
      </button>
    </form>
  );
}

/**
 * ============================================
 * STEP 3: How it works
 * ============================================
 * 
 * 1. Component loads with detected country
 * 2. Shows flag + dialing code: 🇮🇳 +91
 * 3. User types phone number
 * 4. User can click flag to change country
 * 5. Selection saved to localStorage
 * 6. On next visit, shows saved country
 * 
 * All automatically!
 */

/**
 * ============================================
 * COMPLETE CHECKOUT FORM EXAMPLE
 * ============================================
 */

import { useState } from "react";
import AdvancedPhoneInput from "../phone/AdvancedPhoneInput";
import { useCountry } from "../../hooks/useCountry";

export function CheckoutFormComplete() {
  const { country: detectedCountry } = useCountry();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: detectedCountry,
    state: "",
    city: "",
    zipcode: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // Update country in form when detected country changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      country: detectedCountry,
    }));
  }, [detectedCountry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      state: "", // Reset state when country changes
      city: "",
      zipcode: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 8) {
        newErrors.phone = "Phone number is too short";
      }
    }

    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipcode) newErrors.zipcode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form valid:", formData);
      // Submit to API
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Shipping Address</h2>

        {/* Name */}
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

        {/* Email */}
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
          hint="For order updates and delivery confirmation"
          required
        />

        {/* Address */}
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
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* City, State, Zipcode */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            {errors.state && (
              <p className="text-red-600 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Postal Code</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            {errors.zipcode && (
              <p className="text-red-600 text-sm mt-1">{errors.zipcode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg hover:bg-[#fd2d4a] transition-colors"
      >
        Place Order
      </button>
    </form>
  );
}

export default QuickStartExample;
