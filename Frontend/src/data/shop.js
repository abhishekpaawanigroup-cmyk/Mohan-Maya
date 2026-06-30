// Shopping configuration: coupons, shipping rules, and order status flow.

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 49;
export const GST_RATE = 0.18; // 18% GST applied to the taxable goods value

// Sample coupon codes (shown to users for testing).
export const COUPONS = {
  MOHAN10: { type: "percent", value: 10, label: "10% off your order" },
  WELCOME50: { type: "flat", value: 50, label: "₹50 off" },
  FREESHIP: { type: "shipping", value: 0, label: "Free shipping" },
  MAYA20: { type: "percent", value: 20, label: "20% off (members)" },
};

export const ORDER_STEPS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

// Compute cart money breakdown from items + an applied coupon.
export function computeTotals(cart, coupon) {
  const subtotal = cart.reduce((sum, i) => sum + (Number(i.price) || 0) * i.qty, 0);

  let discount = 0;
  let freeShipping = false;
  if (coupon && subtotal > 0) {
    if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
    else if (coupon.type === "flat") discount = Math.min(coupon.value, subtotal);
    else if (coupon.type === "shipping") freeShipping = true;
  }

  const baseShipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const shipping = freeShipping ? 0 : baseShipping;

  // Round each line to whole rupees and derive the total from those rounded
  // values, so the displayed lines always sum exactly to the total (no drift).
  const roundedSubtotal = Math.round(subtotal);
  const roundedDiscount = Math.round(discount);
  const taxable = Math.max(0, roundedSubtotal - roundedDiscount);
  const gst = Math.round(taxable * GST_RATE);
  const total = taxable + gst + shipping;

  return {
    subtotal: roundedSubtotal,
    discount: roundedDiscount,
    gst,
    shipping,
    total,
  };
}
