/**
 * COUNTRY DETECTION INTEGRATION GUIDE
 * 
 * How to use the Country Detection System in your existing components
 * 
 * This file provides examples for integrating automatic country detection
 * with your existing eCommerce features.
 */

/**
 * ============================================
 * BASIC USAGE - Using the useCountry Hook
 * ============================================
 * 
 * In any component wrapped by CountryProvider (which wraps your entire app):
 * 
 * import { useCountry } from '../hooks/useCountry';
 * 
 * function MyComponent() {
 *   const { country, setCountry, isLoading, error, isAutoDetected } = useCountry();
 * 
 *   return (
 *     <div>
 *       <p>Current Country: {country}</p>
 *       <p>Auto-detected: {isAutoDetected ? 'Yes' : 'No'}</p>
 *       {isLoading && <p>Loading country...</p>}
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE 1: Phone Number Input Integration
 * ============================================
 * 
 * import { useCountry } from '../hooks/useCountry';
 * 
 * const COUNTRY_CODES = {
 *   'IN': { code: '+91', name: 'India' },
 *   'US': { code: '+1', name: 'United States' },
 *   'GB': { code: '+44', name: 'United Kingdom' },
 *   'AE': { code: '+971', name: 'United Arab Emirates' },
 *   // ... add more countries
 * };
 * 
 * function PhoneInput() {
 *   const { country } = useCountry();
 *   const [phone, setPhone] = useState('');
 *   const defaultCode = COUNTRY_CODES[country]?.code || '+91';
 * 
 *   return (
 *     <div>
 *       <label>Phone Number</label>
 *       <div className="flex gap-2">
 *         <input
 *           type="text"
 *           disabled
 *           value={defaultCode}
 *           className="w-20"
 *         />
 *         <input
 *           type="tel"
 *           value={phone}
 *           onChange={(e) => setPhone(e.target.value)}
 *           placeholder="Enter your number"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE 2: Currency Selector Integration
 * ============================================
 * 
 * import { useCountry } from '../hooks/useCountry';
 * import { useCurrency } from '../context/CurrencyContext';
 * 
 * const COUNTRY_CURRENCIES = {
 *   'IN': 'INR',
 *   'US': 'USD',
 *   'GB': 'GBP',
 *   'AE': 'AED',
 *   // ... add more countries
 * };
 * 
 * function CurrencySelector() {
 *   const { country } = useCountry();
 *   const { setCurrency } = useCurrency();
 *   const defaultCurrency = COUNTRY_CURRENCIES[country] || 'INR';
 * 
 *   useEffect(() => {
 *     // Automatically set currency based on detected country
 *     setCurrency(defaultCurrency);
 *   }, [country, setCurrency]);
 * 
 *   return (
 *     <div>
 *       <label>Currency: {defaultCurrency}</label>
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE 3: Shipping Country Integration
 * ============================================
 * 
 * import { useCountry } from '../hooks/useCountry';
 * 
 * function ShippingForm() {
 *   const { country, setCountry } = useCountry();
 *   const [formData, setFormData] = useState({
 *     country: country,
 *     state: '',
 *     city: '',
 *     zipcode: '',
 *   });
 * 
 *   useEffect(() => {
 *     // Update form when country changes
 *     setFormData(prev => ({
 *       ...prev,
 *       country: country,
 *       state: '', // Reset state when country changes
 *       city: '',
 *       zipcode: '',
 *     }));
 *   }, [country]);
 * 
 *   const handleCountryChange = (newCountry) => {
 *     setCountry(newCountry); // This triggers the context update
 *   };
 * 
 *   return (
 *     <div className="shipping-form">
 *       <select 
 *         value={country} 
 *         onChange={(e) => handleCountryChange(e.target.value)}
 *       >
 *         <option value="IN">India</option>
 *         <option value="US">United States</option>
 *         <option value="GB">United Kingdom</option>
 *         <option value="AE">United Arab Emirates</option>
 *       </select>
 *       {/* Other form fields */}
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE 4: Manual Country Override with Reset
 * ============================================
 * 
 * import { useCountry } from '../hooks/useCountry';
 * 
 * function CountrySelector() {
 *   const { country, setCountry, isAutoDetected, resetToAutoDetection } = useCountry();
 * 
 *   return (
 *     <div>
 *       <select 
 *         value={country} 
 *         onChange={(e) => setCountry(e.target.value)}
 *       >
 *         <option value="IN">India</option>
 *         <option value="US">United States</option>
 *         <option value="GB">United Kingdom</option>
 *         <option value="AE">United Arab Emirates</option>
 *       </select>
 * 
 *       {!isAutoDetected && (
 *         <button 
 *           onClick={resetToAutoDetection}
 *           className="text-sm text-blue-600"
 *         >
 *           Detect My Location
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * EXAMPLE 5: Loading & Error Handling
 * ============================================
 * 
 * import { useCountry } from '../hooks/useCountry';
 * 
 * function CountryDetectionStatus() {
 *   const { country, isLoading, error, isAutoDetected } = useCountry();
 * 
 *   if (isLoading) {
 *     return <div className="text-sm text-gray-500">Detecting location...</div>;
 *   }
 * 
 *   return (
 *     <div>
 *       <p className="text-sm text-gray-600">
 *         Country: <strong>{country}</strong>
 *       </p>
 *       {isAutoDetected && (
 *         <p className="text-xs text-green-600">✓ Auto-detected</p>
 *       )}
 *       {error && (
 *         <p className="text-xs text-red-600">Note: {error}</p>
 *       )}
 *     </div>
 *   );
 * }
 */

/**
 * ============================================
 * CONTEXT VALUE STRUCTURE
 * ============================================
 * 
 * The useCountry hook returns an object with:
 * 
 * {
 *   country: string,              // Current country code (e.g., "IN")
 *   setCountry: function,         // Set country manually (user override)
 *   isLoading: boolean,           // True while detecting country
 *   error: string|null,           // Error message if detection failed
 *   isAutoDetected: boolean,      // True if country is auto-detected
 *   resetToAutoDetection: function, // Reset to auto-detection
 * }
 */

/**
 * ============================================
 * STORAGE STRUCTURE
 * ============================================
 * 
 * Data stored in localStorage:
 * - mm-detected-country: Country code
 * - mm-country-auto-detected: Boolean flag
 * - mm-country-timestamp: When it was stored (for cache expiry)
 * 
 * Cache duration: 30 days
 * Fallback country: IN (India)
 */

/**
 * ============================================
 * API PROVIDERS USED
 * ============================================
 * 
 * Primary: ipapi.co (https://ipapi.co/json/)
 * - Fast, reliable, no authentication required
 * - Returns country_code in response
 * - Fallback provider: ipwho.is
 * 
 * Timeout: 5 seconds per request
 * If both fail: Defaults to India (IN)
 */

/**
 * ============================================
 * FEATURES
 * ============================================
 * 
 * ✓ Automatic country detection via IP
 * ✓ localStorage caching (30 days)
 * ✓ Manual country override
 * ✓ Reset to auto-detection
 * ✓ Error handling & fallback to India
 * ✓ Loading states
 * ✓ Development-only console logs
 * ✓ No browser location permission popup
 * ✓ Dual API provider with fallback chain
 * ✓ Request timeout protection
 * ✓ Production-ready error handling
 */

export default {
  // This file is for documentation only
  // Import and use useCountry in your components
};
