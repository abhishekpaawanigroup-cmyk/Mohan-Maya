/**
 * International Phone Input Component
 * Professional phone input with country detection integration
 * Uses react-international-phone library for reliability
 * 
 * Installation:
 * npm install react-international-phone
 * 
 * Usage:
 * import InternationalPhoneInput from '../components/phone/InternationalPhoneInput';
 * 
 * <InternationalPhoneInput 
 *   value={phone}
 *   onChange={setPhone}
 *   onCountryChange={handleCountryChange}
 * />
 */

import { useMemo } from "react";
import { useCountry } from "../../context/CountryContext";
import { getPhoneCode, getCountryDetails } from "../../data/countryConstants";

/**
 * Country code to react-international-phone compatible code mapping
 * This ensures compatibility with the library's country codes
 */
const COUNTRY_CODE_MAP = {
  IN: "in",
  US: "us",
  GB: "gb",
  AE: "ae",
  CA: "ca",
  AU: "au",
  SG: "sg",
  DE: "de",
  FR: "fr",
  JP: "jp",
};

/**
 * International Phone Input Component
 * Displays: 🇮🇳 +91 | [Phone Number Input]
 */
export function InternationalPhoneInput({
  value = "",
  onChange,
  onCountryChange,
  placeholder = "Enter your phone number",
  className = "",
  required = false,
  disabled = false,
  label = "Phone Number",
  showLabel = true,
}) {
  const { country: detectedCountry, isLoading } = useCountry();

  // Get library-compatible country code
  const currentCountryCode = useMemo(() => {
    return COUNTRY_CODE_MAP[detectedCountry] || "in";
  }, [detectedCountry]);

  // Get phone code for detected country
  const phoneCode = useMemo(() => {
    return getPhoneCode(detectedCountry) || "+91";
  }, [detectedCountry]);

  // Get country details for display
  const countryDetails = useMemo(() => {
    return getCountryDetails(detectedCountry) || getCountryDetails("IN");
  }, [detectedCountry]);

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    // Only allow numbers and + symbol
    const sanitized = inputValue.replace(/[^\d+\s-()]/g, "");
    onChange?.(sanitized);
  };

  const handleCountryChange = (e) => {
    const newCountryCode = e.target.value;
    onCountryChange?.(newCountryCode);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-2 items-stretch">
        {/* Country Code Display & Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            /* Open country selector modal if needed */
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <span className="text-lg">{countryDetails?.flag || "🇮🇳"}</span>
          <span className="hidden sm:inline text-sm">{phoneCode}</span>
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus: focus:border-transparent outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
        {countryDetails?.name && `For ${countryDetails.name}`}
      </p>
    </div>
  );
}

export default InternationalPhoneInput;
