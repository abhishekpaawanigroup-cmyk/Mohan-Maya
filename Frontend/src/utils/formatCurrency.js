// Locale + symbol metadata and Intl.NumberFormat-based formatting for money
// values. Kept separate from conversion (convertCurrency.js) so each utility
// stays a small, pure, independently-testable function.

// The locale drives Intl's symbol placement/decimal style; chosen so each
// currency renders the way shoppers expect (₹2,499.00 · $29.15 · €26.80 ·
// £23.50 · AED 107.25), not necessarily the country's own locale.
const CURRENCY_META = {
  INR: { locale: "en-IN", symbol: "₹" },
  USD: { locale: "en-US", symbol: "$" },
  EUR: { locale: "en-IE", symbol: "€" },
  GBP: { locale: "en-GB", symbol: "£" },
  AED: { locale: "en-AE", symbol: "AED" },
};

const DEFAULT_CURRENCY = "INR";

/** ISO currency code -> display symbol (e.g. "USD" -> "$"). */
export function getCurrencySymbol(currencyCode) {
  return (CURRENCY_META[currencyCode] || CURRENCY_META[DEFAULT_CURRENCY]).symbol;
}

/**
 * Formats a numeric amount as localized currency text, e.g.
 * formatCurrency(2499, "INR") -> "₹2,499.00"
 * formatCurrency(29.146, "USD") -> "$29.15"
 */
export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY) {
  const meta = CURRENCY_META[currencyCode] || CURRENCY_META[DEFAULT_CURRENCY];
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    // Unknown/unsupported ISO code for Intl - fall back to a plain string.
    return `${meta.symbol}${value.toFixed(2)}`;
  }
}
