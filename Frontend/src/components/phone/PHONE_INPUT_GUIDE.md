/**
 * PHONE INPUT INTEGRATION GUIDE
 * 
 * How to integrate the international phone input with country detection
 */

/**
 * ============================================
 * INSTALLATION
 * ============================================
 * 
 * Option 1: Using react-international-phone (Recommended)
 * npm install react-international-phone
 * 
 * Option 2: Using react-phone-input-2
 * npm install react-phone-input-2 "react-phone-input-2/lib/style.css"
 * 
 * Option 3: Use our built-in component (no external library needed)
 * - Uses AdvancedPhoneInput.jsx
 * - Full control over styling
 * - Integrates seamlessly with existing design
 */

/**
 * ============================================
 * BASIC EXAMPLE - Simple Phone Input
 * ============================================
 * 
 * import { useState } from 'react';
 * import InternationalPhoneInput from '../components/phone/InternationalPhoneInput';
 * 
 * function MyForm() {
 *   const [phone, setPhone] = useState('');
 * 
 *   return (
 *     <form>
 *       <InternationalPhoneInput
 *         value={phone}
 *         onChange={setPhone}
 *         label="Phone Number"
 *         placeholder="10 digits"
 *         required
 *       />
 *     </form>
 *   );
 * }
 */

/**
 * ============================================
 * ADVANCED EXAMPLE - With Country Selection
 * ============================================
 * 
 * import { useState } from 'react';
 * import AdvancedPhoneInput from '../components/phone/AdvancedPhoneInput';
 * import { useCountry } from '../context/CountryContext';
 * 
 * function CheckoutForm() {
 *   const { country } = useCountry();
 *   const [phone, setPhone] = useState('');
 *   const [errors, setErrors] = useState({});
 * 
 *   const handlePhoneChange = (value) => {
 *     setPhone(value);
 *     if (errors.phone) {
 *       setErrors(prev => ({ ...prev, phone: null }));
 *     }
 *   };
 * 
 *   const handleCountryChange = (newCountry) => {
 *     console.log('Country changed to:', newCountry);
 *   };
 * 
 *   return (
 *     <div className="space-y-4">
 *       <AdvancedPhoneInput
 *         value={phone}
 *         onChange={handlePhoneChange}
 *         onCountryChange={handleCountryChange}
 *         label="Phone Number"
 *         placeholder="Enter your phone number"
 *         error={errors.phone}
 *         hint="Make sure to include the country code"
 *         required
 *       />
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE: Checkout Form Integration
 * ============================================
 * 
 * import AdvancedPhoneInput from '../components/phone/AdvancedPhoneInput';
 * import { useCountry } from '../hooks/useCountry';
 * 
 * function CheckoutPage() {
 *   const { country } = useCountry();
 *   const [formData, setFormData] = useState({
 *     phone: '',
 *     country: country,
 *   });
 *   const [errors, setErrors] = useState({});
 * 
 *   // Validate phone number
 *   const validatePhone = (phone, countryCode) => {
 *     if (!phone) return 'Phone number is required';
 *     
 *     // Remove non-digit characters
 *     const digits = phone.replace(/\D/g, '');
 *     
 *     // Country-specific validation
 *     const phoneLengths = {
 *       'IN': { min: 10, max: 10 },
 *       'US': { min: 10, max: 10 },
 *       'GB': { min: 11, max: 11 },
 *       'AE': { min: 9, max: 9 },
 *     };
 *     
 *     const config = phoneLengths[countryCode] || { min: 10, max: 15 };
 *     if (digits.length < config.min || digits.length > config.max) {
 *       return `Please enter a valid ${country} phone number`;
 *     }
 *     
 *     return null;
 *   };
 * 
 *   const handlePhoneChange = (newPhone) => {
 *     setFormData(prev => ({ ...prev, phone: newPhone }));
 *     if (errors.phone) {
 *       setErrors(prev => ({ ...prev, phone: null }));
 *     }
 *   };
 * 
 *   const handleCountryChange = (newCountry) => {
 *     setFormData(prev => ({ 
 *       ...prev, 
 *       country: newCountry,
 *       phone: '', // Clear phone when country changes
 *     }));
 *   };
 * 
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     
 *     // Validate phone
 *     const phoneError = validatePhone(formData.phone, formData.country);
 *     if (phoneError) {
 *       setErrors(prev => ({ ...prev, phone: phoneError }));
 *       return;
 *     }
 *     
 *     // Form is valid, proceed
 *     console.log('Submitting:', formData);
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit} className="space-y-6">
 *       <AdvancedPhoneInput
 *         value={formData.phone}
 *         onChange={handlePhoneChange}
 *         onCountryChange={handleCountryChange}
 *         label="Phone Number"
 *         error={errors.phone}
 *         required
 *       />
 *       
 *       <button
 *         type="submit"
 *         className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg"
 *       >
 *         Continue
 *       </button>
 *     </form>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE: Using useInternationalPhone Hook
 * ============================================
 * 
 * import { useInternationalPhone } from '../hooks/useInternationalPhone';
 * 
 * function PhoneInputWithHook() {
 *   const {
 *     phone,
 *     setPhone,
 *     selectedCountry,
 *     setSelectedCountry,
 *     resetToDetectedCountry,
 *     isManuallySelected,
 *     detectedCountry,
 *   } = useInternationalPhone();
 * 
 *   return (
 *     <div className="space-y-4">
 *       {/* Show if user manually selected a different country */}
 *       {isManuallySelected && (
 *         <button
 *           onClick={resetToDetectedCountry}
 *           className="text-xs text-blue-600 underline"
 *         >
 *           Detect Location ({detectedCountry})
 *         </button>
 *       )}
 *       
 *       <input
 *         type="tel"
 *         value={phone}
 *         onChange={(e) => setPhone(e.target.value)}
 *         placeholder="Enter phone number"
 *       />
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * REPLACING EXISTING PHONE INPUT
 * ============================================
 * 
 * OLD CODE (in your Checkout or Profile component):
 * 
 *   <input
 *     type="tel"
 *     value={phone}
 *     onChange={(e) => setPhone(e.target.value)}
 *     placeholder="Phone number"
 *     className="input-class"
 *   />
 * 
 * NEW CODE:
 * 
 *   import AdvancedPhoneInput from '../components/phone/AdvancedPhoneInput';
 * 
 *   <AdvancedPhoneInput
 *     value={phone}
 *     onChange={setPhone}
 *     label="Phone Number"
 *     placeholder="Enter your phone number"
 *     required
 *   />
 * 
 * That's it! The component automatically:
 * - Detects your country
 * - Shows the correct dialing code
 * - Allows country selection
 * - Saves selection to localStorage
 * - Remembers your choice on page refresh
 */

/**
 * ============================================
 * COMPONENT API
 * ============================================
 * 
 * AdvancedPhoneInput Props:
 * 
 * {
 *   value: string,              // Current phone value
 *   onChange: function,         // Called when phone changes
 *   onCountryChange: function,  // Called when country changes
 *   placeholder: string,        // Input placeholder
 *   className: string,          // Wrapper class
 *   required: boolean,          // Required field
 *   disabled: boolean,          // Disable input
 *   label: string,              // Input label
 *   showLabel: boolean,         // Show/hide label
 *   error: string,              // Error message
 *   hint: string,               // Helper text
 * }
 */

/**
 * ============================================
 * STYLING & CUSTOMIZATION
 * ============================================
 * 
 * The component uses Tailwind CSS and respects your dark mode.
 * All styling is built-in, no additional CSS needed.
 * 
 * To customize colors, modify these className values:
 * - Ring color: focus:ring-[#fe4462]
 * - Hover: hover:bg-gray-100 dark:hover:bg-white/10
 * - Selected: bg-[#fe4462]/10 text-[#fe4462]
 * - Error: text-red-600
 */

/**
 * ============================================
 * DATA FLOW
 * ============================================
 * 
 * 1. User visits website
 *    ↓
 * 2. Country detected automatically (CountryContext)
 *    ↓
 * 3. AdvancedPhoneInput loads with detected country
 *    ↓
 * 4. Phone code shows automatically (e.g., +91 for India)
 *    ↓
 * 5. User can:
 *    a. Type phone number → saved in state
 *    b. Click country button → opens dropdown
 *    c. Search and select country → saved to localStorage
 *    ↓
 * 6. Page refresh → country preference persists
 */

/**
 * ============================================
 * LOCALSTORAGE
 * ============================================
 * 
 * Key: mm-phone-country-override
 * 
 * Stores: Last selected country code (e.g., "US")
 * 
 * Cleared when: User hasn't used phone input for a while
 *              or manually resets to auto-detection
 */

/**
 * ============================================
 * COUNTRY AUTO-UPDATE
 * ============================================
 * 
 * The phone input automatically shows the detected country code:
 * 
 * 🇮🇳 +91        (India - default)
 * 🇺🇸 +1         (United States)
 * 🇬🇧 +44        (United Kingdom)
 * 🇦🇪 +971       (United Arab Emirates)
 * 🇨🇦 +1         (Canada)
 * 🇦🇺 +61        (Australia)
 * 🇸🇬 +65        (Singapore)
 * 🇩🇪 +49        (Germany)
 * 🇫🇷 +33        (France)
 * 🇯🇵 +81        (Japan)
 * 
 * ... and more countries as added to countryConstants.js
 */

/**
 * ============================================
 * VALIDATION EXAMPLE
 * ============================================
 * 
 * import { getPhoneCode } from '../data/countryConstants';
 * 
 * function validateInternationalPhone(phone, country) {
 *   const code = getPhoneCode(country);
 *   
 *   // Must start with country code or +
 *   if (!phone.startsWith(code) && !phone.startsWith('+')) {
 *     return `Phone must start with ${code}`;
 *   }
 *   
 *   // Remove all non-digits
 *   const digits = phone.replace(/\D/g, '');
 *   
 *   // Minimum length validation
 *   if (digits.length < 10) {
 *     return 'Phone number is too short';
 *   }
 *   
 *   return null; // Valid
 * }
 */

/**
 * ============================================
 * MOBILE RESPONSIVE
 * ============================================
 * 
 * The phone input is fully responsive:
 * 
 * Desktop:
 * [🇮🇳 +91] [Phone Input Field]
 * 
 * Mobile:
 * [🇮🇳] [Phone Input Field]
 * 
 * The dialing code is hidden on small screens to save space.
 */

export default {
  // Documentation only
};
