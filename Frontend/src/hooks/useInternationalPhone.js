/**
 * International Phone Input Hook
 * Manages phone number state with automatic country detection integration
 * Persists selected country in localStorage
 */

import { useState, useEffect, useCallback } from "react";
import { useCountry } from "../context/CountryContext";
import { countryToFlag } from "country-flag-icons/react/3x2";

const PHONE_STORAGE_KEY = "mm-phone-country";

/**
 * Hook for managing international phone input with country detection
 * @returns {Object} - Phone state and handlers
 */
export const useInternationalPhone = (defaultPhone = "") => {
  const { country: detectedCountry } = useCountry();
  
  // Get initial country - from localStorage or detected country
  const getInitialCountry = () => {
    try {
      const stored = localStorage.getItem(PHONE_STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      console.warn("[PhoneInput] localStorage error:", e);
    }
    return detectedCountry || "IN";
  };

  const [phone, setPhone] = useState(defaultPhone);
  const [selectedCountry, setSelectedCountryState] = useState(getInitialCountry);

  // Update selected country when detected country changes (only if no manual override)
  useEffect(() => {
    // If user hasn't manually selected a different country, follow detected country
    try {
      const storedCountry = localStorage.getItem(PHONE_STORAGE_KEY);
      if (!storedCountry && detectedCountry) {
        setSelectedCountryState(detectedCountry);
      }
    } catch (e) {
      console.warn("[PhoneInput] localStorage error:", e);
    }
  }, [detectedCountry]);

  /**
   * Set country and save to localStorage
   */
  const setSelectedCountry = useCallback((newCountry) => {
    setSelectedCountryState(newCountry);
    try {
      localStorage.setItem(PHONE_STORAGE_KEY, newCountry);
      if (import.meta.env.DEV) {
        console.log("[PhoneInput] Selected country saved:", newCountry);
      }
    } catch (e) {
      console.warn("[PhoneInput] Failed to save country:", e);
    }
  }, []);

  /**
   * Reset to auto-detected country
   */
  const resetToDetectedCountry = useCallback(() => {
    try {
      localStorage.removeItem(PHONE_STORAGE_KEY);
      if (detectedCountry) {
        setSelectedCountryState(detectedCountry);
      }
      if (import.meta.env.DEV) {
        console.log("[PhoneInput] Reset to detected country:", detectedCountry);
      }
    } catch (e) {
      console.warn("[PhoneInput] Failed to reset country:", e);
    }
  }, [detectedCountry]);

  /**
   * Clear phone number
   */
  const clearPhone = useCallback(() => {
    setPhone("");
  }, []);

  /**
   * Check if country is manually selected (different from detected)
   */
  const isManuallySelected = selectedCountry !== detectedCountry;

  return {
    phone,
    setPhone,
    selectedCountry,
    setSelectedCountry,
    resetToDetectedCountry,
    clearPhone,
    isManuallySelected,
    detectedCountry,
  };
};

export default useInternationalPhone;
