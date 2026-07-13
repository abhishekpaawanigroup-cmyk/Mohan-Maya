// Pure conversion math. Every product price in the app is stored in INR;
// this never mutates that source value - it only computes what to *display*.

/**
 * Converts an amount stored in INR into `targetCurrency` using a rates map
 * shaped like `{ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 }` (each value =
 * how much 1 INR is worth in that currency, as returned by the exchange rate
 * service with base=INR).
 *
 * Falls back to the original INR amount if the target currency or its rate
 * is missing, so a transient/partial rates object never renders NaN.
 */
export function convertCurrency(amountInINR, targetCurrency, rates) {
  const amount = Number(amountInINR) || 0;
  if (!targetCurrency || targetCurrency === "INR") return amount;
  const rate = rates?.[targetCurrency];
  if (!Number.isFinite(rate)) return amount;
  return amount * rate;
}
