import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiSend } from "react-icons/fi";
import { useApp } from "../../context/AppContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const { addToast } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim()) {
      setError("Please enter your email");
      addToast("Please enter your email", "error");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address");
      addToast("Enter a valid email address", "error");
      return;
    }

    setError("");
    setLoading(true);
    // Simulate an async subscribe request.
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      addToast("Subscribed! Check your inbox for a welcome treat.", "success");
    }, 1200);
  };

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-[#fbfefb] dark:bg-[#0d0508]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* Clean, minimal card -a subtle brand top accent sets it apart from
            the surrounding sections without being flashy. */}
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#160c11] border border-gray-200 dark:border-white/10 shadow-sm px-6 sm:px-10 lg:px-14 py-10 sm:py-14 text-center">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#fe4462]" aria-hidden="true" />

          {/* Icon */}
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#fe4462]/10 text-[#fe4462] mb-5">
            <FiMail size={22} />
          </span>

          {/* Heading + description */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Subscribe to Our Newsletter
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Get exclusive offers, new arrivals, and special discounts delivered
            straight to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  aria-invalid={Boolean(error)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg pl-11 pr-4 py-3.5 transition-shadow duration-200"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#fe4462] text-white font-semibold px-7 py-3.5 rounded-full shadow-sm hover:bg-[#fff] hover:border-[#fff] hover:text-[#fe4462] transition-all duration-300 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Subscribing…
                  </>
                ) : (
                  <>
                    <FiSend size={16} /> Subscribe
                  </>
                )}
              </motion.button>
            </div>

            {error && (
              <p role="alert" className="text-[#fe4462] text-sm mt-3 font-medium">
                {error}
              </p>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
