/**
 * EXAMPLE: Complete Country Integration Component
 * 
 * This is a complete example showing how to integrate the country detection
 * system with a typical checkout form. You can adapt this pattern to your
 * existing components.
 * 
 * Location: src/components/examples/CountryIntegrationExample.jsx
 * (This is just an example - delete or modify as needed)
 */

import { useState, useEffect } from "react";
import { useCountry } from "../../hooks/useCountry";
import {
  getAllCountries,
  getPhoneCode,
  getCurrency,
  getCountryName,
} from "../../data/countryConstants";

/**
 * Example: Address Form with Auto Country Detection
 * Shows how to use the country detection in a form
 */
export function CountryIntegrationExample() {
  const {
    country,
    setCountry,
    isLoading,
    error,
    isAutoDetected,
    resetToAutoDetection,
  } = useCountry();

  const [formData, setFormData] = useState({
    country: country,
    phone: "",
    state: "",
    city: "",
    zipcode: "",
  });

  // Update form when detected country changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      country: country,
      state: "", // Reset state when country changes
      city: "",
      zipcode: "",
    }));
  }, [country]);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const phoneCode = getPhoneCode(country);
  const currency = getCurrency(country);
  const countryName = getCountryName(country);
  const countries = getAllCountries();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Shipping Address
      </h2>

      {/* Detection Status */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">🔄 Detecting your location...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">⚠️ {error}</p>
        </div>
      )}

      {isAutoDetected && !isLoading && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <p className="text-sm text-green-700">
            ✓ Location detected: <strong>{countryName}</strong>
          </p>
          <button
            onClick={resetToAutoDetection}
            className="text-xs text-green-600 hover:text-green-700 underline"
          >
            Detect Again
          </button>
        </div>
      )}

      <form className="space-y-5">
        {/* Country Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country/Region
          </label>
          <select
            value={country}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe4462] focus:border-transparent"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {isAutoDetected ? "📍 Auto-detected from your IP" : "🔄 Manually selected"}
          </p>
        </div>

        {/* Phone Number with Country Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              disabled
              value={phoneCode}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center font-semibold text-gray-700"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe4462] focus:border-transparent"
            />
          </div>
        </div>

        {/* Currency Display */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Currency:</strong> {currency}
          </p>
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State/Province
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Enter your state"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe4462] focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter your city"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe4462] focus:border-transparent"
          />
        </div>

        {/* Postal Code / ZIP Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code / ZIP Code
          </label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleInputChange}
            placeholder="Enter your postal code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe4462] focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#fe4462] text-white font-semibold py-3 rounded-lg hover:bg-[#fd2d4a] transition-colors duration-200"
        >
          Continue to Shipping
        </button>
      </form>

      {/* Debug Info (Development Only) */}
      {import.meta.env.DEV && (
        <div className="mt-6 p-3 bg-gray-100 rounded border border-gray-300 text-xs">
          <p className="font-mono">
            <strong>Debug Info:</strong>
          </p>
          <p>Country: {country}</p>
          <p>Auto-detected: {isAutoDetected ? "Yes" : "No"}</p>
          <p>Loading: {isLoading ? "Yes" : "No"}</p>
          <p>Error: {error || "None"}</p>
          <p>Form Data: {JSON.stringify(formData, null, 2)}</p>
        </div>
      )}
    </div>
  );
}

export default CountryIntegrationExample;
