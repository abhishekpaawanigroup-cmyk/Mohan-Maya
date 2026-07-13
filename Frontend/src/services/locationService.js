/**
 * Location Service
 * Handles IP-based geolocation detection with caching and error handling
 * Uses ipapi.co as the primary provider (reliable, fast, no auth required)
 */

const API_PROVIDERS = {
  PRIMARY: {
    url: "https://ipapi.co/json/",
    timeout: 5000,
    countryField: "country_code",
  },
  FALLBACK: {
    url: "https://ipwho.is/",
    timeout: 5000,
    countryField: "country_code",
  },
};

const DEFAULT_COUNTRY = "IN"; // India as fallback
const REQUEST_TIMEOUT = 5000;

/**
 * Fetch with timeout capability
 * @param {string} url - URL to fetch
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = (url, timeout = REQUEST_TIMEOUT) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
};

/**
 * Try primary API provider
 * @returns {Promise<string|null>} - Country code or null if failed
 */
const tryPrimaryProvider = async () => {
  try {
    const response = await fetchWithTimeout(
      API_PROVIDERS.PRIMARY.url,
      API_PROVIDERS.PRIMARY.timeout
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (data && data[API_PROVIDERS.PRIMARY.countryField]) {
      const countryCode = data[API_PROVIDERS.PRIMARY.countryField].toUpperCase();

      if (import.meta.env.DEV) {
        console.log(
          "[LocationService] Primary API success:",
          countryCode,
          data
        );
      }

      return countryCode;
    }

    throw new Error("Country code not found in response");
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[LocationService] Primary API failed:", error.message);
    }
    return null;
  }
};

/**
 * Try fallback API provider
 * @returns {Promise<string|null>} - Country code or null if failed
 */
const tryFallbackProvider = async () => {
  try {
    const response = await fetchWithTimeout(
      API_PROVIDERS.FALLBACK.url,
      API_PROVIDERS.FALLBACK.timeout
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (data && data[API_PROVIDERS.FALLBACK.countryField]) {
      const countryCode = data[API_PROVIDERS.FALLBACK.countryField].toUpperCase();

      if (import.meta.env.DEV) {
        console.log(
          "[LocationService] Fallback API success:",
          countryCode,
          data
        );
      }

      return countryCode;
    }

    throw new Error("Country code not found in response");
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[LocationService] Fallback API failed:", error.message);
    }
    return null;
  }
};

/**
 * Detect user's country via IP geolocation
 * Tries multiple providers with fallback chain
 * @returns {Promise<Object>} - { country: string, error: string|null }
 */
export const detectCountry = async () => {
  try {
    // Try primary provider first
    let countryCode = await tryPrimaryProvider();

    // If primary fails, try fallback provider
    if (!countryCode) {
      if (import.meta.env.DEV) {
        console.log("[LocationService] Trying fallback provider...");
      }
      countryCode = await tryFallbackProvider();
    }

    // If all providers fail, use default
    if (!countryCode) {
      if (import.meta.env.DEV) {
        console.warn(
          "[LocationService] All providers failed, using default country:",
          DEFAULT_COUNTRY
        );
      }
      return {
        country: DEFAULT_COUNTRY,
        error: "All detection providers failed, using default country",
      };
    }

    return {
      country: countryCode,
      error: null,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[LocationService] Unexpected error:", error);
    }

    return {
      country: DEFAULT_COUNTRY,
      error: error.message || "Failed to detect country",
    };
  }
};

/**
 * Validate country code format
 * @param {string} code - Country code to validate
 * @returns {boolean}
 */
export const isValidCountryCode = (code) => {
  return (
    typeof code === "string" && /^[A-Z]{2}$/.test(code)
  );
};

export default {
  detectCountry,
  isValidCountryCode,
};
