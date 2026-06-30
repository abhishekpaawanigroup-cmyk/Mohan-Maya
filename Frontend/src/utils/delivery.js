// Expected-delivery estimation. Adds business days (skipping weekends) to the
// current date so the estimate stays accurate over time without any backend.

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Returns a new Date `days` business days after `from` (weekends skipped). */
function addBusinessDays(from, days) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added += 1; // skip Sun(0) / Sat(6)
  }
  return d;
}

/**
 * Estimate a delivery window.
 * @returns {{ minDays, maxDays, minDate, maxDate, rangeLabel }}
 */
export function getDeliveryEstimate(minDays = 3, maxDays = 5, from = new Date()) {
  const minDate = addBusinessDays(from, minDays);
  const maxDate = addBusinessDays(from, maxDays);
  return { minDays, maxDays, minDate, maxDate, rangeLabel: formatRange(minDate, maxDate) };
}

/** Human-friendly window, e.g. "Mon, 12 – Wed, 14 Jun". */
export function formatRange(minDate, maxDate) {
  const month = (d) => d.toLocaleDateString("en-IN", { month: "short" });
  const left = `${DAY[minDate.getDay()]}, ${minDate.getDate()}`;
  const sameMonth = minDate.getMonth() === maxDate.getMonth();
  const right = `${DAY[maxDate.getDay()]}, ${maxDate.getDate()} ${month(maxDate)}`;
  return sameMonth ? `${left} – ${right}` : `${left} ${month(minDate)} – ${right}`;
}
