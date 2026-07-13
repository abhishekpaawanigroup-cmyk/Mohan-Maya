/**
 * Country Context
 * Provides global state management for country detection and selection
 * Integrates with location service and localStorage
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { detectCountry } from "../services/locationService";
import {
  getStoredCountry,
  saveCountry,
  clearStoredCountry,
} from "../utils/countryStorage";

const CountryContext = createContext(null);

// Re-export for use in hooks
export { CountryContext };

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within CountryProvider");
  }
  return context;
};

/**
 * Country Provider Component
 * Manages country detection, caching, and state
 */
export function CountryProvider({ children }) {
  const [country, setCountryState] = useState("IN"); // Default to India
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  /**
   * Initialize country detection on mount
   * Checks cache first, then calls API if needed
   */
  useEffect(() => {
    const initializeCountry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if country is already stored
        const { country: storedCountry, isAutoDetected: wasAutoDetected } =
          getStoredCountry();

        if (storedCountry) {
          setCountryState(storedCountry);
          setIsAutoDetected(wasAutoDetected);

          if (import.meta.env.DEV) {
            console.log(
              "[CountryProvider] Loaded from cache:",
              storedCountry
            );
          }

          setIsLoading(false);
          return;
        }

        // If not cached, detect country via IP
        if (import.meta.env.DEV) {
          console.log("[CountryProvider] Starting country detection...");
        }

        const result = await detectCountry();

        if (result.error) {
          setError(result.error);
          if (import.meta.env.DEV) {
            console.warn("[CountryProvider] Detection error:", result.error);
          }
        }

        const detectedCountry = result.country;
        setCountryState(detectedCountry);
        setIsAutoDetected(true);

        // Save to localStorage for future visits
        saveCountry(detectedCountry, true);

        if (import.meta.env.DEV) {
          console.log("[CountryProvider] Detected and saved:", detectedCountry);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[CountryProvider] Initialization error:", err);
        }
        setError(err.message);
        // Fallback is already set to "IN"
      } finally {
        setIsLoading(false);
      }
    };

    initializeCountry();
  }, []);

  /**
   * Set country manually (user override)
   * @param {string} newCountry - Country code
   */
  const setCountry = useCallback((newCountry) => {
    if (!newCountry || typeof newCountry !== "string") {
      if (import.meta.env.DEV) {
        console.warn("[CountryProvider] Invalid country code:", newCountry);
      }
      return;
    }

    const countryCode = newCountry.toUpperCase();
    setCountryState(countryCode);
    setIsAutoDetected(false); // User manually set, so not auto-detected anymore
    saveCountry(countryCode, false);

    if (import.meta.env.DEV) {
      console.log("[CountryProvider] Country manually set to:", countryCode);
    }
  }, []);

  /**
   * Reset to auto-detection
   * Clears manual override and re-detects
   */
  const resetToAutoDetection = useCallback(async () => {
    try {
      setIsLoading(true);
      clearStoredCountry();

      const result = await detectCountry();
      const detectedCountry = result.country;

      setCountryState(detectedCountry);
      setIsAutoDetected(true);
      setError(result.error);

      saveCountry(detectedCountry, true);

      if (import.meta.env.DEV) {
        console.log(
          "[CountryProvider] Reset to auto-detection:",
          detectedCountry
        );
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[CountryProvider] Reset error:", err);
      }
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const value = useMemo(
    () => ({
      country,
      setCountry,
      isLoading,
      error,
      isAutoDetected,
      resetToAutoDetection,
    }),
    [country, isLoading, error, isAutoDetected, setCountry, resetToAutoDetection]
  );

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
}

export default CountryProvider;
