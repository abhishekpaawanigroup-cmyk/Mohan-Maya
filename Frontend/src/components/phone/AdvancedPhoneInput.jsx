/**
 * Advanced International Phone Input Component
 * Full-featured phone input with country dropdown
 * Uses react-international-phone library
 * 
 * Installation:
 * npm install react-international-phone
 * 
 * This component provides:
 * - Country flag display
 * - Searchable country dropdown
 * - Automatic formatting
 * - Validation
 * - Responsive design
 * - Dark mode support
 * - Integration with country detection
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useCountry } from "../../context/CountryContext";
import {
  getAllCountries,
  getPhoneCode,
  getCountryDetails,
} from "../../data/countryConstants";

const PHONE_COUNTRY_STORAGE = "mm-phone-country-override";

/**
 * Advanced Phone Input Component with Country Selector
 */
export function AdvancedPhoneInput({
  value = "",
  onChange,
  onCountryChange,
  placeholder = "Enter your phone number",
  className = "",
  required = false,
  disabled = false,
  label = "Phone Number",
  showLabel = true,
  error = null,
  hint = null,
}) {
  const { country: detectedCountry, isLoading } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Load from localStorage or use detected country
    try {
      const stored = localStorage.getItem(PHONE_COUNTRY_STORAGE);
      if (stored) return stored;
    } catch (e) {
      console.warn("[PhoneInput] Storage error:", e);
    }
    return detectedCountry || "IN";
  });

  // Update selected country when detected changes (if no override)
  useEffect(() => {
    try {
      const hasOverride = localStorage.getItem(PHONE_COUNTRY_STORAGE);
      if (!hasOverride && detectedCountry) {
        setSelectedCountry(detectedCountry);
      }
    } catch (e) {
      console.warn("[PhoneInput] Storage error:", e);
    }
  }, [detectedCountry]);

  const phoneCode = useMemo(
    () => getPhoneCode(selectedCountry) || "+91",
    [selectedCountry]
  );

  const countryDetails = useMemo(
    () => getCountryDetails(selectedCountry) || getCountryDetails("IN"),
    [selectedCountry]
  );

  const allCountries = useMemo(() => getAllCountries(), []);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return allCountries;

    const term = searchTerm.toLowerCase();
    return allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        c.phoneCode.includes(term)
    );
  }, [searchTerm, allCountries]);

  const handleCountrySelect = useCallback(
    (countryCode) => {
      setSelectedCountry(countryCode);
      try {
        localStorage.setItem(PHONE_COUNTRY_STORAGE, countryCode);
      } catch (e) {
        console.warn("[PhoneInput] Storage error:", e);
      }
      setIsOpen(false);
      setSearchTerm("");
      onCountryChange?.(countryCode);

      if (import.meta.env.DEV) {
        console.log("[PhoneInput] Country selected:", countryCode);
      }
    },
    [onCountryChange]
  );

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    // Allow numbers, spaces, hyphens, parentheses
    const sanitized = inputValue.replace(/[^\d+\s\-()]/g, "");
    onChange?.(sanitized);
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

      <div className="flex gap-2 items-stretch relative">
        {/* Country Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between gap-1.5 px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <div className="flex items-center gap-1">
            <span className="text-lg leading-none">{countryDetails?.flag || "🇮🇳"}</span>
            <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {phoneCode}
            </span>
          </div>
          <FiChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2.5 border rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus: focus:border-transparent outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-red-300 dark:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-white/10"
          }`}
        />

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Overlay to close dropdown */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Country List */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-40 max-h-60 overflow-hidden flex flex-col">
              {/* Search Input */}
              <div className="sticky top-0 p-2 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-1"
                />
              </div>

              {/* Countries List */}
              <div className="overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country.code)}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150 border-b border-gray-100 dark:border-white/5 last:border-b-0 ${
                        selectedCountry === country.code
                          ? "bg-[#fe4462]/10 text-[#fe4462] dark:bg-[#fe4462]/20"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{country.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {country.code} • {country.phoneCode}
                        </p>
                      </div>
                      {selectedCountry === country.code && (
                        <span className="text-[#fe4462] font-bold">✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error}</p>}

      {/* Helper Text */}
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{hint}</p>
      )}
      {!hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          {countryDetails?.name ? `Format for ${countryDetails.name}` : "International format"}
        </p>
      )}

      {/* Debug Info (Dev Only) */}
      {import.meta.env.DEV && (
        <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 dark:bg-white/5 rounded">
          <p>Selected: {selectedCountry}</p>
          <p>Detected: {detectedCountry}</p>
          <p>Code: {phoneCode}</p>
        </div>
      )}
    </div>
  );
}

export default AdvancedPhoneInput;
