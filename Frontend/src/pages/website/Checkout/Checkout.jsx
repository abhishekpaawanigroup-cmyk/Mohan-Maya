import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCreditCard, FiTruck, FiSmartphone, FiLock, FiShoppingBag, FiX } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: FiTruck },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: FiCreditCard },
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: FiSmartphone },
];

export default function Checkout() {
  usePageMeta("Checkout - Mohan Maya", "Securely complete your Mohan Maya order.");
  const navigate = useNavigate();
  const { cart, totals, coupon, couponCode, applyCoupon, removeCoupon, placeOrder, addToast } = useApp();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("cod");
  const [couponInput, setCouponInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const field = (name) =>
    `w-full bg-gray-50 dark:bg-white/5 border rounded-xl px-4 py-3 outline-none transition focus:border-[#fe4462] dark:text-white ${
      errors[name] ? "border-red-400" : "border-gray-200 dark:border-white/10"
    }`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a 6-digit pincode";
    return e;
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) setCouponInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      addToast("Please complete the highlighted fields", "error");
      return;
    }
    setSubmitting(true);
    const id = placeOrder({ ...form, payment });
    navigate(`/track?order=${id}`);
  };

  // Empty cart guard
  if (!cart.length) {
    return (
      <section className="pt-28 pb-20 bg-[#fbfefb] dark:bg-[#0d0508] min-h-screen flex items-center">
        <div className="max-w-md mx-auto text-center px-5">
          <FiShoppingBag size={56} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white">Your cart is empty</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Add some products before checking out.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-20 bg-[#fbfefb] dark:bg-[#0d0508] min-h-screen">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#fe4462]">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Almost there - just a few details to complete your order.</p>
        </ScrollReveal>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ── Left: details ── */}
          <div className="space-y-6">
            {/* Customer */}
            <ScrollReveal className="bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="text-lg font-bold dark:text-white mb-5">Customer Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1 dark:text-gray-200">Full Name</label>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className={field("fullName")} placeholder="Your name" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-gray-200">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={field("email")} placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1 dark:text-gray-200">Phone</label>
                  <input id="phone" name="phone" inputMode="numeric" value={form.phone} onChange={handleChange} className={field("phone")} placeholder="10-digit number" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </ScrollReveal>

            {/* Shipping */}
            <ScrollReveal className="bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="text-lg font-bold dark:text-white mb-5">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-1 dark:text-gray-200">Address</label>
                  <input id="address" name="address" value={form.address} onChange={handleChange} className={field("address")} placeholder="House no, street, area" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1 dark:text-gray-200">City</label>
                  <input id="city" name="city" value={form.city} onChange={handleChange} className={field("city")} placeholder="City" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1 dark:text-gray-200">State</label>
                  <input id="state" name="state" value={form.state} onChange={handleChange} className={field("state")} placeholder="State" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium mb-1 dark:text-gray-200">Pincode</label>
                  <input id="pincode" name="pincode" inputMode="numeric" value={form.pincode} onChange={handleChange} className={field("pincode")} placeholder="6-digit pincode" />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </ScrollReveal>

            {/* Payment */}
            <ScrollReveal className="bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="text-lg font-bold dark:text-white mb-5">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map(({ id, label, desc, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      payment === id
                        ? "border-[#fe4462] bg-[#fe4462]/5"
                        : "border-gray-200 dark:border-white/10 hover:border-[#fe4462]/50"
                    }`}
                  >
                    <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="h-4 w-4 accent-[#fe4462]" />
                    <Icon size={20} className="text-[#fe4462]" />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold dark:text-white">{label}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">{desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right: summary ── */}
          <ScrollReveal direction="left" className="lg:sticky lg:top-28">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="text-lg font-bold dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-[40vh] sm:max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#fbfefb] dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#fe4462]">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mt-5 pt-5 border-t dark:border-white/10">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-500/10 rounded-xl px-3 py-2">
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">{couponCode} - {coupon.label}</span>
                    <button type="button" onClick={removeCoupon} className="text-green-700 dark:text-green-400 hover:text-red-500" aria-label="Remove coupon">
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 bg-gray-100 dark:bg-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white uppercase placeholder:normal-case"
                    />
                    <button type="button" onClick={handleApplyCoupon} className="btn-outline !py-2 !px-4 text-sm">Apply</button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Try <strong>MOHAN10</strong>, <strong>WELCOME50</strong> or <strong>FREESHIP</strong>.</p>
              </div>

              {/* Totals */}
              <div className="mt-5 pt-5 border-t dark:border-white/10 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>₹{totals.subtotal}</span></div>
                {totals.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{totals.discount}</span></div>}
                <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Shipping</span><span>{totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}</span></div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>GST (18%)</span><span>₹{totals.gst}</span></div>
                <div className="flex justify-between pt-2 border-t dark:border-white/10 font-bold text-base dark:text-white"><span>Total</span><span className="text-[#fe4462]">₹{totals.total}</span></div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary justify-center mt-6 disabled:opacity-60"
              >
                <FiLock size={16} /> {submitting ? "Placing Order…" : "Place Order"}
              </motion.button>
              <p className="text-[11px] text-gray-400 text-center mt-3">Secure checkout · your data is protected</p>
            </div>
          </ScrollReveal>
        </form>
      </div>
    </section>
  );
}
