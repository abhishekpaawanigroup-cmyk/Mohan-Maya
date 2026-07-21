/**
 * useCountry Hook
 * Custom hook for accessing country detection and management
 * Provides easy access to country context throughout the app
 */

import { useContext } from "react";
import { CountryContext } from "../context/CountryContext";

/**
 * Hook to access country context
 * @returns {Object} - Country context object with country, setCountry, loading, error, isAutoDetected, etc.
 */
export const useCountryContext = () => {
  const context = useContext(CountryContext);

  if (!context) {
    throw new Error(
      "useCountryContext must be used within CountryProvider. Make sure CountryProvider wraps your component."
    );
  }

  return context;
};

export default useCountryContext;
