import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useHooks";
import { fetchExchangeRates, getCachedRates } from "../services/currencyApi";
import { convertCurrency } from "../utils/convertCurrency";
import { formatCurrency, getCurrencySymbol } from "../utils/formatCurrency";

// eslint-disable-next-line react-refresh/only-export-components
export const CurrencyContext = createContext(null);

// Same localStorage key the (pre-built) Currency Selector in AnnouncementBar
// uses, so both read/write one shared value - see useLocalStorage's same-tab
// broadcast in hooks/useHooks.js for how they stay in sync without either
// one knowing the other exists.
const CURRENCY_STORAGE_KEY = "mm-currency";

/**
 * Live currency conversion provider. All product prices are stored in INR;
 * this exposes the selected currency, the latest INR-based exchange rates,
 * and convert/format helpers so any component can render a price in the
 * shopper's chosen currency - instantly, with no page refresh.
 *
 * Rates are fetched once per 12h cache window (see services/currencyApi.js)
 * regardless of how often the selected currency changes, since one INR-based
 * rate table covers every supported currency.
 */
export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useLocalStorage(CURRENCY_STORAGE_KEY, "INR");

  // Seed synchronously from cache (even if stale) so the first render already
  // has numbers to show instead of a loading flash for returning visitors.
  const [rates, setRates] = useState(() => getCachedRates()?.rates || null);
  const [loading, setLoading] = useState(!rates);
  const [error, setError] = useState(null);

  const loadRates = useCallback(async (opts) => {
    setLoading(true);
    const result = await fetchExchangeRates(opts);
    setRates(result.rates);
    setError(result.error ? result.error : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRates();
  }, [loadRates]);

  const convert = useCallback(
    (amountInINR) => convertCurrency(amountInINR, currency, rates),
    [currency, rates]
  );

  const format = useCallback(
    (amountInINR) => formatCurrency(convert(amountInINR), currency),
    [convert, currency]
  );

  const symbol = getCurrencySymbol(currency);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      loading,
      error,
      symbol,
      convert,
      format,
      refreshRates: () => loadRates({ force: true }),
    }),
    [currency, setCurrency, rates, loading, error, symbol, convert, format, loadRates]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}
