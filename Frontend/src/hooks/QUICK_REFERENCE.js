/**
 * QUICK REFERENCE - Country Detection System
 * Copy & paste ready code snippets
 */

// ============================================
// 1. BASIC USAGE
// ============================================

import { useCountry } from '../hooks/useCountry';

function MyComponent() {
  const { country, setCountry, isLoading, error, isAutoDetected } = useCountry();
  
  return <div>Country: {country}</div>;
}

// ============================================
// 2. COUNTRY DROPDOWN
// ============================================

import { getAllCountries } from '../data/countryConstants';

function CountryDropdown() {
  const { country, setCountry } = useCountry();
  const countries = getAllCountries();
  
  return (
    <select value={country} onChange={(e) => setCountry(e.target.value)}>
      {countries.map(c => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.name}
        </option>
      ))}
    </select>
  );
}

// ============================================
// 3. PHONE INPUT WITH COUNTRY CODE
// ============================================

import { getPhoneCode } from '../data/countryConstants';

function PhoneInput() {
  const { country } = useCountry();
  const phoneCode = getPhoneCode(country);
  
  return (
    <div className="flex gap-2">
      <input type="text" disabled value={phoneCode} className="w-20" />
      <input type="tel" placeholder="Enter number" />
    </div>
  );
}

// ============================================
// 4. CURRENCY DISPLAY
// ============================================

import { getCurrency } from '../data/countryConstants';

function CurrencyDisplay() {
  const { country } = useCountry();
  const currency = getCurrency(country);
  
  return <p>Currency: {currency}</p>;
}

// ============================================
// 5. LOADING & ERROR HANDLING
// ============================================

function WithErrorHandling() {
  const { country, isLoading, error } = useCountry();
  
  if (isLoading) return <div>Detecting location...</div>;
  
  return (
    <>
      {error && <p className="text-red-600">{error}</p>}
      <p>Country: {country}</p>
    </>
  );
}

// ============================================
// 6. MANUAL OVERRIDE WITH RESET
// ============================================

function WithReset() {
  const { country, setCountry, isAutoDetected, resetToAutoDetection } = useCountry();
  
  return (
    <div>
      <input value={country} onChange={(e) => setCountry(e.target.value)} />
      
      {!isAutoDetected && (
        <button onClick={resetToAutoDetection}>
          Auto-detect Location
        </button>
      )}
    </div>
  );
}

// ============================================
// 7. GET ALL COUNTRY DETAILS
// ============================================

import { getCountryDetails } from '../data/countryConstants';

function CountryDetails() {
  const { country } = useCountry();
  const details = getCountryDetails(country);
  
  return (
    <div>
      <p>Name: {details?.name}</p>
      <p>Phone Code: {details?.phoneCode}</p>
      <p>Currency: {details?.currency}</p>
      <p>Flag: {details?.flag}</p>
    </div>
  );
}

// ============================================
// 8. FORM WITH AUTO-DETECTED DEFAULTS
// ============================================

import { useCountry } from '../hooks/useCountry';
import { getPhoneCode, getCurrency } from '../data/countryConstants';

function CheckoutForm() {
  const { country, setCountry, isAutoDetected } = useCountry();
  const phoneCode = getPhoneCode(country);
  const currency = getCurrency(country);
  
  return (
    <form>
      <div>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="IN">India</option>
          <option value="US">United States</option>
        </select>
        {isAutoDetected && <small>Auto-detected</small>}
      </div>
      
      <div>
        <label>Phone</label>
        <input 
          type="tel"
          placeholder={`${phoneCode} ...`}
        />
      </div>
      
      <p>Total: 100 {currency}</p>
    </form>
  );
}

// ============================================
// 9. CONDITIONAL RENDERING
// ============================================

function ConditionalUI() {
  const { country, isLoading } = useCountry();
  
  return (
    <>
      {!isLoading && country === 'IN' && (
        <p>Special offer for India customers!</p>
      )}
    </>
  );
}

// ============================================
// 10. STORAGE UTILITIES (if needed)
// ============================================

import {
  getStoredCountry,
  saveCountry,
  clearStoredCountry,
  resetToAutoDetection as resetStorage
} from '../utils/countryStorage';

// Get stored value directly (rarely needed)
const { country: stored } = getStoredCountry();

// Clear manually (rarely needed)
clearStoredCountry();

// ============================================
// USEFUL FUNCTIONS AT A GLANCE
// ============================================

/*
From useCountry Hook:
- country: string              → Current country code
- setCountry(code)             → Change country manually
- isLoading: boolean           → Loading status
- error: string|null           → Error message
- isAutoDetected: boolean      → Is it auto-detected?
- resetToAutoDetection()       → Reset to auto-detect

From countryConstants:
- getCountryDetails(code)      → Full country object
- getPhoneCode(code)           → "+91"
- getCurrency(code)            → "INR"
- getCountryName(code)         → "India"
- getAllCountries()            → Array of all countries
- getCountryCodeByPhoneCode(code) → Code from phone code
- isValidCountryCode(code)     → Boolean

From countryStorage:
- getStoredCountry()           → Get from localStorage
- saveCountry(code, isAuto)    → Save to localStorage
- clearStoredCountry()         → Clear from localStorage
- resetToAutoDetection()       → Full reset
*/

// ============================================
// CONSOLE DEBUGGING (Dev Only)
// ============================================

// In development, you'll see logs like:
// [LocationService] Detected: IN
// [CountryProvider] Loaded from cache: IN
// [CountryStorage] Saved country: IN

// To debug in DevTools:
localStorage.getItem('mm-detected-country')           // "IN"
localStorage.getItem('mm-country-auto-detected')      // "true"
localStorage.getItem('mm-country-timestamp')          // 1234567890

// ============================================
// COMMON PATTERNS
// ============================================

// Pattern 1: Update form when country changes
const { country } = useCountry();
useEffect(() => {
  // Reset form fields when country changes
  setForm({ ...form, country, state: '', city: '' });
}, [country]);

// Pattern 2: Disable shipping to certain countries
const canShipTo = (countryCode) => {
  const prohibited = ['XX', 'YY'];
  return !prohibited.includes(countryCode);
};

// Pattern 3: Apply country-specific fees
const getShippingFee = (country) => {
  const fees = {
    'IN': 50,
    'US': 100,
    'GB': 80,
  };
  return fees[country] || 0;
};

export {};
