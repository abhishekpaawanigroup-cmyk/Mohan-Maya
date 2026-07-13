// Live exchange rate service. Talks to the Frankfurter API (frankfurter.app) -
// a free, key-less, production-safe rate service backed by the European
// Central Bank's daily reference rates - and layers localStorage caching plus
// request de-duplication on top so the rest of the app never has to think
// about network calls.
//
// Base currency is always INR (all product prices are stored in INR); we ask
// the API for INR -> {USD, EUR, GBP} directly, one call covers every
// currency the selector supports.

// api.frankfurter.app now permanently redirects here - call it directly to
// avoid an extra cross-origin redirect hop on every request.
const API_BASE = "https://api.frankfurter.dev/v1";
const BASE_CURRENCY = "INR";
// Keep in sync with the currency codes offered by the Currency Selector
// (AnnouncementBar.jsx). INR needs no conversion so it isn't requested.
export const TARGET_CURRENCIES = ["USD", "EUR", "GBP"];

const CACHE_KEY = "mm-exchange-rates";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Rough, hand-maintained rates used ONLY when the API has never succeeded
// and no cache exists yet (e.g. first-ever load with no network). Keeps the
// site usable/never crashing instead of showing broken numbers.
const FALLBACK_RATES = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 };

let inFlightRequest = null; // de-dupes concurrent fetchExchangeRates() calls

/** Reads the cached rate bundle, if any, without checking freshness. */
function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.rates !== "object" || !parsed.timestamp) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persists a rate bundle `{ base, rates, timestamp }` to localStorage. */
export function cacheExchangeRates(rates, timestamp = Date.now()) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ base: BASE_CURRENCY, rates, timestamp })
    );
  } catch {
    /* ignore write errors (private mode / quota) */
  }
}

/** Cached rates plus whether they're still within the 12h TTL. */
export function getCachedRates() {
  const cached = readCache();
  if (!cached) return null;
  const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS;
  return { ...cached, isFresh };
}

async function requestLiveRates() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `${API_BASE}/latest?from=${BASE_CURRENCY}&to=${TARGET_CURRENCIES.join(",")}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Exchange rate API responded ${res.status}`);
    const data = await res.json();
    if (!data?.rates) throw new Error("Exchange rate API returned no rates");
    return { INR: 1, ...data.rates };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Resolves the freshest usable rate set for INR -> {USD, EUR, GBP}.
 *
 * Strategy (never throws - always resolves to *something* usable):
 *  1. Fresh cache (< 12h old)        -> return it, no network call.
 *  2. Otherwise fetch live rates     -> cache and return them.
 *  3. Live fetch fails, stale cache  -> return the stale cache (`stale: true`).
 *  4. Live fetch fails, no cache     -> return hand-maintained fallback rates.
 *
 * Concurrent calls share a single in-flight network request.
 *
 * @param {{ force?: boolean }} [options] - force=true skips the fresh-cache
 *   shortcut and always attempts a live refresh.
 */
export async function fetchExchangeRates({ force = false } = {}) {
  const cached = getCachedRates();
  if (!force && cached?.isFresh) {
    return { rates: cached.rates, timestamp: cached.timestamp, source: "cache" };
  }

  if (!inFlightRequest) {
    inFlightRequest = requestLiveRates().finally(() => {
      inFlightRequest = null;
    });
  }

  try {
    const rates = await inFlightRequest;
    const timestamp = Date.now();
    cacheExchangeRates(rates, timestamp);
    return { rates, timestamp, source: "live" };
  } catch (err) {
    if (cached) {
      return { rates: cached.rates, timestamp: cached.timestamp, source: "stale-cache", error: err };
    }
    return { rates: FALLBACK_RATES, timestamp: Date.now(), source: "fallback", error: err };
  }
}
