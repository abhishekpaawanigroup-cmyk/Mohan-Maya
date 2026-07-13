import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";

/**
 * Access the live currency conversion context.
 *
 * `format(amountInINR)` - localized, symbol-formatted string in the
 *   shopper's selected currency, e.g. format(2499) -> "$29.98".
 * `convert(amountInINR)` - raw converted number, for when you need to do
 *   further math (e.g. rounding a shipping fee) before display.
 * `currency` / `symbol` - the active ISO code ("USD") and its symbol ("$").
 * `loading` / `error` - exchange rate fetch status, for optional UI feedback.
 */
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
