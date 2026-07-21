/**
 * Country Storage Utility
 * Handles localStorage operations for country detection with validation
 */

const STORAGE_KEYS = {
  COUNTRY: "mm-detected-country",
  COUNTRY_AUTO: "mm-country-auto-detected",
  COUNTRY_TIMESTAMP: "mm-country-timestamp",
};

const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Get stored country from localStorage
 * @returns {Object} - { country: string|null, isAutoDetected: boolean, isCacheValid: boolean }
 */
export const getStoredCountry = () => {
  try {
    const country = localStorage.getItem(STORAGE_KEYS.COUNTRY);
    const isAutoDetected =
      localStorage.getItem(STORAGE_KEYS.COUNTRY_AUTO) === "true";
    const timestamp = localStorage.getItem(STORAGE_KEYS.COUNTRY_TIMESTAMP);

    // Check if cache is still valid
    const isCacheValid = timestamp
      ? Date.now() - parseInt(timestamp) < CACHE_DURATION
      : false;

    if (country && isCacheValid) {
      if (import.meta.env.DEV) {
        console.log(
          "[CountryStorage] Retrieved from cache:",
          country,
          "Auto-detected:",
          isAutoDetected
        );
      }

      return {
        country,
        isAutoDetected,
        isCacheValid: true,
      };
    }

    if (country && !isCacheValid) {
      if (import.meta.env.DEV) {
        console.warn("[CountryStorage] Cache expired, clearing...");
      }
      clearStoredCountry();
    }

    return {
      country: null,
      isAutoDetected: false,
      isCacheValid: false,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[CountryStorage] Error retrieving country:", error);
    }
    return {
      country: null,
      isAutoDetected: false,
      isCacheValid: false,
    };
  }
};

/**
 * Save country to localStorage
 * @param {string} country - Country code (e.g., "IN")
 * @param {boolean} isAutoDetected - Whether it was auto-detected
 * @returns {boolean} - Success status
 */
export const saveCountry = (country, isAutoDetected = false) => {
  try {
    if (!country || typeof country !== "string") {
      throw new Error("Invalid country code");
    }

    localStorage.setItem(STORAGE_KEYS.COUNTRY, country.toUpperCase());
    localStorage.setItem(STORAGE_KEYS.COUNTRY_AUTO, String(isAutoDetected));
    localStorage.setItem(STORAGE_KEYS.COUNTRY_TIMESTAMP, String(Date.now()));

    if (import.meta.env.DEV) {
      console.log(
        "[CountryStorage] Saved country:",
        country,
        "Auto-detected:",
        isAutoDetected
      );
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[CountryStorage] Error saving country:", error);
    }
    return false;
  }
};

/**
 * Clear stored country from localStorage
 * @returns {boolean} - Success status
 */
export const clearStoredCountry = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.COUNTRY);
    localStorage.removeItem(STORAGE_KEYS.COUNTRY_AUTO);
    localStorage.removeItem(STORAGE_KEYS.COUNTRY_TIMESTAMP);

    if (import.meta.env.DEV) {
      console.log("[CountryStorage] Cleared stored country");
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[CountryStorage] Error clearing country:", error);
    }
    return false;
  }
};

/**
 * Reset to auto-detection (clears manual override)
 * Used when user wants to auto-detect again
 */
export const resetToAutoDetection = () => {
  try {
    clearStoredCountry();

    if (import.meta.env.DEV) {
      console.log("[CountryStorage] Reset to auto-detection");
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[CountryStorage] Error resetting:", error);
    }
    return false;
  }
};

export default {
  getStoredCountry,
  saveCountry,
  clearStoredCountry,
  resetToAutoDetection,
};
