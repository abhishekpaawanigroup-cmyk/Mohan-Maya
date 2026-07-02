// Central order-domain logic shared by My Orders (/orders) and Admin (/admin/orders).
// The store is client-side (localStorage via AppContext), so status either comes
// from an explicit override (admin change or cancellation) or is derived from the
// time elapsed since the order was placed - keeping a live "demo" progression
// without a backend.

import { getDeliveryEstimate } from "./delivery";

// Canonical lifecycle. "Cancelled" is a terminal state outside this linear flow.
export const ORDER_STATUS_FLOW = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export const CANCELLED = "Cancelled";

// Advance one step roughly every 30 minutes (demo pacing, mirrors the old
// tracking page) when no explicit status is stored on the order.
const STEP_MS = 1000 * 60 * 30;

// Statuses from which a customer may still cancel. Shipped and beyond cannot.
const CANCELLABLE = new Set(["Pending", "Confirmed", "Packed"]);

// Visual metadata per status: badge colours (light + dark) and a short caption.
// Tailwind-safe literal class strings so they survive the JIT purge.
export const STATUS_META = {
  Pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20",
    dot: "bg-amber-500",
    caption: "We've received your order",
  },
  Confirmed: {
    label: "Confirmed",
    badge: "bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/20",
    dot: "bg-blue-500",
    caption: "Your order is confirmed",
  },
  Packed: {
    label: "Packed",
    badge: "bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/20",
    dot: "bg-indigo-500",
    caption: "Packed and ready to ship",
  },
  Shipped: {
    label: "Shipped",
    badge: "bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/20",
    dot: "bg-cyan-500",
    caption: "On its way to you",
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    badge: "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/20",
    dot: "bg-violet-500",
    caption: "Arriving today",
  },
  Delivered: {
    label: "Delivered",
    badge: "bg-green-100 text-green-700 ring-green-200 dark:bg-green-500/15 dark:text-green-300 dark:ring-green-500/20",
    dot: "bg-green-500",
    caption: "Delivered successfully",
  },
  Cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/20",
    dot: "bg-red-500",
    caption: "Order cancelled",
  },
};

/**
 * Effective status of an order.
 * Priority: cancellation → explicit stored status → time-derived progression.
 */
export function deriveStatus(order) {
  if (!order) return "Pending";
  if (order.cancellation || order.status === CANCELLED) return CANCELLED;
  if (order.status && ORDER_STATUS_FLOW.includes(order.status)) return order.status;
  const elapsed = Date.now() - (order.createdAt || Date.now());
  const idx = Math.min(ORDER_STATUS_FLOW.length - 1, Math.max(0, Math.floor(elapsed / STEP_MS)));
  return ORDER_STATUS_FLOW[idx];
}

/** Zero-based position of a status within the linear flow (Cancelled → -1). */
export function statusIndex(status) {
  return ORDER_STATUS_FLOW.indexOf(status);
}

/** Whether an order can still be cancelled by the customer. */
export function isCancellable(order) {
  return CANCELLABLE.has(deriveStatus(order));
}

export function getStatusMeta(status) {
  return STATUS_META[status] || STATUS_META.Pending;
}

// Payment method display labels.
export const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  upi: "UPI",
};

export function paymentLabel(order) {
  return PAYMENT_LABELS[order?.customer?.payment] || "—";
}

/**
 * Payment status text + a colour tone key ("paid" | "pending" | "refund").
 * COD is unpaid until delivered; online methods are treated as paid; a
 * cancelled order is refunded (online) or simply cancelled (COD).
 */
export function paymentStatus(order) {
  const method = order?.customer?.payment;
  const status = deriveStatus(order);
  if (status === CANCELLED) {
    return method === "cod"
      ? { label: "Cancelled", tone: "refund" }
      : { label: "Refund Initiated", tone: "refund" };
  }
  if (method === "cod") {
    return status === "Delivered"
      ? { label: "Paid", tone: "paid" }
      : { label: "Pending", tone: "pending" };
  }
  return { label: "Paid", tone: "paid" };
}

export const PAYMENT_TONE = {
  paid: "text-green-600 dark:text-green-400",
  pending: "text-amber-600 dark:text-amber-400",
  refund: "text-red-600 dark:text-red-400",
};

/** Total number of physical units across all line items. */
export function itemCount(order) {
  return order?.items?.reduce((sum, i) => sum + (i.qty || 0), 0) || 0;
}

/** Estimated delivery window derived from the placement date. */
export function deliveryEstimate(order) {
  return getDeliveryEstimate(3, 5, new Date(order?.createdAt || Date.now()));
}

// Cancellation reasons offered in the confirmation modal (order matters).
export const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Delivery is taking too long",
  "Want to change address",
  "Want to change payment method",
  "Ordered wrong product",
  "Product no longer needed",
  "Duplicate order",
  "Other",
];

// Date/time formatters (Indian locale) reused across the order UI.
export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const fmtDateTime = (ts) =>
  new Date(ts).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/**
 * Build a printable HTML invoice and trigger a download. Fully client-side -
 * no backend required. Returns nothing; opens a Blob download in the browser.
 */
export function downloadInvoice(order) {
  const t = order.totals || {};
  const c = order.customer || {};
  const rows = (order.items || [])
    .map(
      (i) => `<tr>
        <td>${escapeHtml(i.name)}</td>
        <td style="text-align:center">${i.qty}</td>
        <td style="text-align:right">₹${i.price}</td>
        <td style="text-align:right">₹${i.price * i.qty}</td>
      </tr>`
    )
    .join("");

  const line = (label, value) =>
    `<tr><td colspan="3" style="text-align:right;color:#555">${label}</td><td style="text-align:right">${value}</td></tr>`;

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${escapeHtml(
    order.id
  )}</title>
  <style>
    *{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a}
    body{max-width:720px;margin:32px auto;padding:0 24px}
    h1{color:#fe4462;margin:0}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th,td{padding:8px 10px;border-bottom:1px solid #eee;font-size:14px}
    th{text-align:left;background:#faf7f8}
    .muted{color:#777;font-size:13px}
    .total td{font-weight:bold;font-size:15px;border-top:2px solid #fe4462}
  </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><h1>Mohan Maya</h1><p class="muted">Handcrafted with love</p></div>
      <div style="text-align:right"><strong>Invoice</strong><br><span class="muted">#${escapeHtml(
        order.id
      )}</span><br><span class="muted">${fmtDate(order.createdAt)}</span></div>
    </div>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
    <div style="display:flex;gap:40px">
      <div><strong>Billed &amp; Shipped To</strong><p class="muted">
        ${escapeHtml(c.fullName || "")}<br>
        ${escapeHtml([c.address, c.city, c.state, c.pincode].filter(Boolean).join(", "))}<br>
        ${escapeHtml(c.phone || "")} ${c.email ? "· " + escapeHtml(c.email) : ""}
      </p></div>
      <div><strong>Payment</strong><p class="muted">${PAYMENT_LABELS[c.payment] || "—"}<br>Status: ${
    paymentStatus(order).label
  }</p></div>
    </div>
    <table>
      <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        ${line("Subtotal", `₹${t.subtotal ?? 0}`)}
        ${t.discount > 0 ? line(`Discount${order.coupon ? ` (${order.coupon})` : ""}`, `−₹${t.discount}`) : ""}
        ${line("Delivery Charges", t.shipping === 0 ? "Free" : `₹${t.shipping}`)}
        ${t.gst != null ? line("GST (18%)", `₹${t.gst}`) : ""}
        <tr class="total"><td colspan="3" style="text-align:right">Total</td><td style="text-align:right">₹${
          t.total ?? 0
        }</td></tr>
      </tfoot>
    </table>
    <p class="muted" style="margin-top:32px">Thank you for shopping with Mohan Maya.</p>
  </body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );
}
