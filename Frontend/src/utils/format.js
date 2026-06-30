/**
 * Format a number into a short, human-friendly string with a single decimal
 * for thousands/millions/billions -e.g. 1234 → "1.2K", 2_500_000 → "2.5M".
 * Drops a trailing ".0" so round values read cleanly (12000 → "12K").
 */
export function formatCompact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  if (n < 1000) return String(Math.round(n));

  const units = [
    { v: 1e9, s: "B" },
    { v: 1e6, s: "M" },
    { v: 1e3, s: "K" },
  ];
  const { v, s } = units.find((u) => n >= u.v);
  const scaled = n / v;
  // One decimal under 100 (e.g. 12.3K), none above (e.g. 340K) for readability.
  const text = scaled >= 100 ? Math.round(scaled).toString() : scaled.toFixed(1);
  return `${text.replace(/\.0$/, "")}${s}`;
}

/**
 * Format an ISO date string as a short, readable date -e.g. "5 Jun 2026".
 * Returns "" for missing/unparseable values so callers can hide the line.
 */
export function formatVideoDate(value) {
  const ts = Date.parse(value);
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}
