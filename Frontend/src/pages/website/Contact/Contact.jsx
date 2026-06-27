import { useState } from "react";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import PageHero from "../../../components/common/PageHero";
import { useApp } from "../../../context/AppContext";
import { usePageMeta } from "../../../hooks/useHooks";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const details = [
  { icon: FiMapPin, label: "Address", value: "Ganga Enclave, Roorkee,\nUttarakhand, India" },
  { icon: FiMail, label: "Email", value: "support@mohanmaya.in" },
  { icon: FiPhone, label: "Phone", value: "+91 99567 48903" },
];

export default function Contact() {
  usePageMeta(
    "Contact Us - Mohan Maya",
    "Get in touch with the Mohan Maya team for custom orders, product questions, or support."
  );
  const { addToast } = useApp();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) next.message = "Message is required";
    else if (form.message.trim().length < 10) next.message = "Message is too short";
    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      addToast("Please fix the highlighted fields", "error");
      return;
    }
    addToast("Message sent! We'll get back to you soon.", "success");
    setForm(initialForm);
  };

  // Reference-style input: soft grey fill, no border, smooth brand focus ring.
  const inputBase =
    "w-full bg-gray-100 dark:bg-white/5 rounded-md px-4 py-3.5 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#fe4462]/30 focus-visible:!outline-none";
  const errRing = "ring-2 ring-red-400/60";

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We're here to help. Reach out to us for any questions, support, or feedback."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      {/* Map - ~50% overlaps the hero for a modern "emerging" layered look.
          The negative top margin equals half the map's height at each
          breakpoint (250/280/300px → 125/140/150px), so exactly half sits
          inside the hero and half below. Shifts the content below up with it,
          keeping spacing consistent and introducing no horizontal scroll. */}
      <div className="relative z-20 -mt-[90px] sm:-mt-[140px] lg:-mt-[150px] bg-[linear-gradient(to_bottom,transparent_50%,#fbfefb_50%)] dark:bg-[linear-gradient(to_bottom,transparent_50%,#0d0508_50%)]">
        <div className="max-w-[1440px] mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 ">
          <iframe
            title="Mohan Maya location - Ganga Enclave, Roorkee, Uttarakhand, India"
            src="https://maps.google.com/maps?q=Paawani%20Group,%20Ganga%20Enclave,%20Canal%20Rd,%20near%20Ganeshpur,%20Ganesh%20Pur,%20Roorkee,%20Uttarakhand%20247667&z=15&output=embed"
            className="block w-full h-[220px] sm:h-[280px] lg:h-[300px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 bg-[#fbfefb] dark:bg-[#0d0508]">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal>
            {/* Brand-bordered frame (matches the reference card) */}
            <div className="rounded-lg bg-white dark:bg-white/5 shadow-xl p-6 sm:p-10 lg:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* ── Left: intro + contact info ── */}
                <div>
                  <p className="text-[#fe4462] text-lg font-semibold mb-2">How we work</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                    Send us a <span className="text-[#fe4462]">Message</span>
                  </h2>
                  <p className="mt-4 text-gray-500 dark:text-gray-300 leading-relaxed max-w-md">
                    Have a question about a product, want a custom order, or just want to
                    say hello? Reach out and our team will get back to you shortly.
                  </p>

                  <div className="mt-8 space-y-6">
                    {details.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#fe4462] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#fe4462]/30">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[#fe4462] font-bold text-lg leading-tight">{label}</h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line break-words">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Right: form ── */}
                <div>
                  <p className="text-[#fe4462] text-lg font-semibold mb-2">Free Estimate</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                    Contact for <span className="text-[#fe4462]">Services</span>
                  </h2>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="sr-only">Your Name</label>
                        <input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your Name *"
                          aria-invalid={Boolean(errors.name)}
                          className={`${inputBase} ${errors.name ? errRing : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="sr-only">Your Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Your Email *"
                          aria-invalid={Boolean(errors.email)}
                          className={`${inputBase} ${errors.email ? errRing : ""}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="sr-only">Your Phone</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Your Phone *"
                          aria-invalid={Boolean(errors.phone)}
                          className={`${inputBase} ${errors.phone ? errRing : ""}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="sr-only">Subject</label>
                        <input
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Subject *"
                          aria-invalid={Boolean(errors.subject)}
                          className={`${inputBase} ${errors.subject ? errRing : ""}`}
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="sr-only">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Your Message *"
                        aria-invalid={Boolean(errors.message)}
                        className={`${inputBase} resize-none ${errors.message ? errRing : ""}`}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-start pt-2">
                      <button type="submit" className="border border-[#fe4462] bg-[#fe4462] rounded-[30px] text-white font-medium !px-12 !py-3.5 text-base hover:bg-transparent hover:text-[#fe4462] hover:border-[#fe4462] duration-200 cursor-pointer">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
