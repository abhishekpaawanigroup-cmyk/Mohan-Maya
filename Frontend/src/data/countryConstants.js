/**
 * Country Constants
 * Centralized country codes, phone codes, and currency mappings
 * Can be extended with more countries as needed
 */

export const COUNTRY_LIST = {
  IN: {
    name: "India",
    code: "IN",
    phoneCode: "+91",
    currency: "INR",
    flag: "🇮🇳",
  },
  US: {
    name: "United States",
    code: "US",
    phoneCode: "+1",
    currency: "USD",
    flag: "🇺🇸",
  },
  GB: {
    name: "United Kingdom",
    code: "GB",
    phoneCode: "+44",
    currency: "GBP",
    flag: "🇬🇧",
  },
  AE: {
    name: "United Arab Emirates",
    code: "AE",
    phoneCode: "+971",
    currency: "AED",
    flag: "🇦🇪",
  },
  CA: {
    name: "Canada",
    code: "CA",
    phoneCode: "+1",
    currency: "CAD",
    flag: "🇨🇦",
  },
  AU: {
    name: "Australia",
    code: "AU",
    phoneCode: "+61",
    currency: "AUD",
    flag: "🇦🇺",
  },
  SG: {
    name: "Singapore",
    code: "SG",
    phoneCode: "+65",
    currency: "SGD",
    flag: "🇸🇬",
  },
  DE: {
    name: "Germany",
    code: "DE",
    phoneCode: "+49",
    currency: "EUR",
    flag: "🇩🇪",
  },
  FR: {
    name: "France",
    code: "FR",
    phoneCode: "+33",
    currency: "EUR",
    flag: "🇫🇷",
  },
  JP: {
    name: "Japan",
    code: "JP",
    phoneCode: "+81",
    currency: "JPY",
    flag: "🇯🇵",
  },
  // Add more countries as needed
};

/**
 * Get country details by code
 * @param {string} countryCode - Country code (e.g., "IN")
 * @returns {Object|null} - Country details or null if not found
 */
export const getCountryDetails = (countryCode) => {
  return COUNTRY_LIST[countryCode?.toUpperCase()] || null;
};

/**
 * Get phone code for a country
 * @param {string} countryCode - Country code
 * @returns {string} - Phone code (e.g., "+91")
 */
export const getPhoneCode = (countryCode) => {
  const country = getCountryDetails(countryCode);
  return country?.phoneCode || "+91"; // Default to India
};

/**
 * Get currency for a country
 * @param {string} countryCode - Country code
 * @returns {string} - Currency code (e.g., "INR")
 */
export const getCurrency = (countryCode) => {
  const country = getCountryDetails(countryCode);
  return country?.currency || "INR"; // Default to India
};

/**
 * Get country name for a code
 * @param {string} countryCode - Country code
 * @returns {string} - Country name
 */
export const getCountryName = (countryCode) => {
  const country = getCountryDetails(countryCode);
  return country?.name || "Unknown";
};

/**
 * Get list of all countries for dropdowns
 * @returns {Array} - Array of country objects
 */
export const getAllCountries = () => {
  return Object.values(COUNTRY_LIST);
};

/**
 * Get country code by phone code
 * @param {string} phoneCode - Phone code (e.g., "+91")
 * @returns {string|null} - Country code or null
 */
export const getCountryCodeByPhoneCode = (phoneCode) => {
  const country = Object.values(COUNTRY_LIST).find(
    (c) => c.phoneCode === phoneCode
  );
  return country?.code || null;
};

/**
 * Validate if a country code exists
 * @param {string} countryCode - Country code to validate
 * @returns {boolean}
 */
export const isValidCountryCode = (countryCode) => {
  return !!COUNTRY_LIST[countryCode?.toUpperCase()];
};

export default {
  COUNTRY_LIST,
  getCountryDetails,
  getPhoneCode,
  getCurrency,
  getCountryName,
  getAllCountries,
  getCountryCodeByPhoneCode,
  isValidCountryCode,
};
