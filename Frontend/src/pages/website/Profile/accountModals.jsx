import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiHome,
} from "react-icons/fi";
import { useApp } from "../../../context/AppContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls = (invalid) =>
  `w-full bg-gray-50 dark:bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#fe4462]/30 focus:border-[#fe4462] focus-visible:!outline-none ${
    invalid ? "border-red-400 focus:ring-red-400/20" : "border-gray-200 dark:border-white/10"
  }`;

/* ── Reusable modal shell (backdrop + animated card, scroll-safe on mobile) ── */
export function ModalShell({ title, subtitle, onClose, children }) {
  // Close on Escape — keeps keyboard users in control.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#140a0d] shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        {/* Brand accent bar */}
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fe4462] to-[#c48212]" aria-hidden="true" />

        <div className="flex items-start justify-between gap-4 p-5 sm:p-7 pb-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gray-500 transition hover:bg-[#fe4462]/10 hover:text-[#fe4462]"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-7 pt-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Field({ icon: Icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input className={inputCls(Boolean(error))} {...props} />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const primaryBtn =
  "w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#fe4462] border border-[#fe4462] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-[#fe4462] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";
const ghostBtn =
  "w-full rounded-full border border-gray-200 dark:border-white/15 px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 transition hover:border-[#fe4462] hover:text-[#fe4462]";

/* ── Edit profile ── */
export function EditProfileModal({ onClose }) {
  const { user, updateProfile, addToast } = useApp();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email";
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      onClose();
    } catch (err) {
      if (err?.fields) setErrors((prev) => ({ ...prev, ...err.fields }));
      else addToast(err?.message || "Couldn't update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <ModalShell title="Edit Profile" subtitle="Update your personal details." onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field icon={FiUser} value={form.name} onChange={set("name")} placeholder="Full name" autoComplete="name" error={errors.name} />
        <Field icon={FiMail} type="email" value={form.email} onChange={set("email")} placeholder="Email address" autoComplete="email" error={errors.email} />
        <Field icon={FiPhone} value={form.phone} onChange={set("phone")} placeholder="Phone (optional)" autoComplete="tel" />
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="button" onClick={onClose} className={ghostBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ── Change password (verifies current password via the auth engine) ── */
export function ChangePasswordModal({ onClose }) {
  const { changePassword, addToast } = useApp();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = {};
    if (!form.current) errs.current = "Enter your current password";
    if (!form.next) errs.next = "Enter a new password";
    else if (form.next.length < 6) errs.next = "Use at least 6 characters";
    if (form.confirm !== form.next) errs.confirm = "Passwords don't match";
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      await changePassword({ current: form.current, next: form.next });
      onClose();
    } catch (err) {
      if (err?.fields) setErrors((prev) => ({ ...prev, ...err.fields }));
      else addToast(err?.message || "Couldn't change password.", "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <ModalShell title="Change Password" subtitle="Keep your account secure." onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field icon={FiLock} type={show ? "text" : "password"} value={form.current} onChange={set("current")} placeholder="Current password" autoComplete="current-password" error={errors.current} />
        <div className="relative">
          <Field icon={FiLock} type={show ? "text" : "password"} value={form.next} onChange={set("next")} placeholder="New password" autoComplete="new-password" error={errors.next} />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide passwords" : "Show passwords"}
            className="absolute right-3 top-3 p-1 text-gray-400 hover:text-[#fe4462] transition"
          >
            {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        <Field icon={FiLock} type={show ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="Confirm new password" autoComplete="new-password" error={errors.confirm} />
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="button" onClick={onClose} className={ghostBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>{saving ? "Updating…" : "Update Password"}</button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ── Add / edit address ── */
export function AddressModal({ address = null, onClose }) {
  const { addAddress, updateAddress } = useApp();
  const editing = Boolean(address);
  const [form, setForm] = useState({
    label: address?.label || "Home",
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    line1: address?.line1 || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    isDefault: address?.isDefault || false,
  });
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Name is required";
    if (!form.line1.trim()) errs.line1 = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.pincode.trim()) errs.pincode = "PIN code is required";
    if (Object.keys(errs).length) return setErrors(errs);
    const payload = { ...form, fullName: form.fullName.trim(), line1: form.line1.trim() };
    if (editing) updateAddress(address.id, payload);
    else addAddress(payload);
    onClose();
  };

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <ModalShell
      title={editing ? "Edit Address" : "Add New Address"}
      subtitle="Where should we deliver your miniatures?"
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {/* Label chooser */}
        <div className="flex gap-2">
          {["Home", "Work", "Other"].map((l) => {
            const active = form.label === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setForm((p) => ({ ...p, label: l }))}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#fe4462] text-white"
                    : "border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-[#fe4462] hover:text-[#fe4462]"
                }`}
              >
                <FiHome size={13} /> {l}
              </button>
            );
          })}
        </div>

        <Field icon={FiUser} value={form.fullName} onChange={set("fullName")} placeholder="Full name" autoComplete="name" error={errors.fullName} />
        <Field icon={FiPhone} value={form.phone} onChange={set("phone")} placeholder="Phone" autoComplete="tel" />
        <Field icon={FiMapPin} value={form.line1} onChange={set("line1")} placeholder="Address (house no, street, area)" error={errors.line1} />
        <div className="grid grid-cols-2 gap-3">
          <Field icon={FiMapPin} value={form.city} onChange={set("city")} placeholder="City" error={errors.city} />
          <Field icon={FiMapPin} value={form.state} onChange={set("state")} placeholder="State" />
        </div>
        <Field icon={FiMapPin} value={form.pincode} onChange={set("pincode")} placeholder="PIN code" inputMode="numeric" error={errors.pincode} />

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
            className="h-4 w-4 rounded accent-[#fe4462]"
          />
          Set as default address
        </label>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="button" onClick={onClose} className={ghostBtn}>Cancel</button>
          <button type="submit" className={primaryBtn}>{editing ? "Save Address" : "Add Address"}</button>
        </div>
      </form>
    </ModalShell>
  );
}

/* Tiny convenience wrapper so the page can mount one modal at a time. */
export function AccountModals({ open, editingAddress, onClose }) {
  return (
    <AnimatePresence>
      {open === "edit" && <EditProfileModal key="edit" onClose={onClose} />}
      {open === "password" && <ChangePasswordModal key="password" onClose={onClose} />}
      {open === "address" && <AddressModal key="address" address={editingAddress} onClose={onClose} />}
    </AnimatePresence>
  );
}
