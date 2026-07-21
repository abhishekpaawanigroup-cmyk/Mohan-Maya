import { useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import './international-phone.css';
import { useCountry } from '../../context/CountryContext';

const OVERRIDE_KEY = 'mm-phone-country-override';

/**
 * InternationalPhone Component
 *
 * Production-ready phone input (react-international-phone) with automatic
 * country detection.
 * - Defaults to the detected country (CountryContext) on mount.
 * - If the user picks a different country from the dropdown, that choice is
 *   persisted to localStorage and wins over detection on future renders.
 * - Falls back to India (+91) if detection hasn't resolved yet / failed.
 *
 * @param {string} value - Phone number value (with or without country code)
 * @param {function} onChange - Called when phone changes
 * @param {string} [placeholder] - Input placeholder
 * @param {string} [label] - Input label
 * @param {string} [error] - Error message to display
 * @param {boolean} [required] - HTML required attribute
 * @param {boolean} [disabled] - Disable input
 * @param {string} [className] - Additional CSS classes
 */
export default function InternationalPhone({
  value = '',
  onChange = () => {},
  onBlur,
  name,
  autoComplete,
  placeholder = 'Enter your phone number',
  label = 'Phone Number',
  error = null,
  required = false,
  disabled = false,
  className = '',
}) {
  // Country auto-detected via IP (see CountryProvider)
  const { country: detectedCountry } = useCountry();

  // Manual override, read once on mount; kept in sync via handlePhoneChange
  const [countryOverride, setCountryOverride] = useState(() => {
    try {
      return localStorage.getItem(OVERRIDE_KEY);
    } catch {
      return null;
    }
  });

  // Manual override > detected country > fallback (India)
  const activeCountry = (countryOverride || detectedCountry || 'IN').toLowerCase();

  // react-international-phone only reads `defaultCountry` once, on mount, so
  // we remount it (via `key`) whenever the country we want it to show changes
  // - e.g. detection resolves after mount, or the user picks a new country.
  const lastCountryRef = useRef(activeCountry);

  const handlePhoneChange = (phone, meta) => {
    onChange(phone);

    const newIso2 = meta?.country?.iso2;
    if (!newIso2 || newIso2 === lastCountryRef.current) return;
    lastCountryRef.current = newIso2;

    // Country changed (user picked one, or digits were guessed into another
    // country) - remember it so it wins over auto-detection going forward.
    if (newIso2 !== activeCountry) {
      try {
        localStorage.setItem(OVERRIDE_KEY, newIso2);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[InternationalPhone] Failed to save to localStorage:', err);
        }
      }
      setCountryOverride(newIso2);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <PhoneInput
        key={activeCountry}
        defaultCountry={activeCountry}
        value={value}
        onChange={handlePhoneChange}
        onBlur={onBlur}
        name={name}
        inputProps={autoComplete ? { autoComplete } : undefined}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`react-international-phone-container ${className}`.trim()}
        inputClassName={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:
          dark:bg-gray-800 dark:text-white dark:border-gray-600
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}
        `.trim()}
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
