import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiPlus, FiHelpCircle } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import PageHero from "../../../components/common/PageHero";
import ScrollReveal from "../../../components/common/ScrollReveal";
import { usePageMeta } from "../../../hooks/useHooks";

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Browse our collection, open any product to view its details, then select your options and click “Add to Cart”. When you’re ready, open the cart and proceed to checkout, where you’ll enter your shipping details and choose a payment method to confirm your order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, UPI, and popular digital wallets. Cash on Delivery (COD) is also available on eligible orders within India. All transactions are processed through secure, encrypted payment gateways.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard orders are typically delivered within 5–7 business days. Custom and personalized pieces are handcrafted to order and may take 7–14 business days depending on the complexity of the design. You’ll receive a tracking link as soon as your order ships.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "Yes. Ready-made items can be returned or exchanged within 7 days of delivery, provided they’re unused and in their original packaging. Personalized and custom-made pieces are made just for you and are generally not eligible for return unless they arrive damaged or defective.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order is dispatched, we’ll email and message you a tracking link. You can also visit the Track Order page on our website and enter your order ID at any time to see the latest delivery status.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes, we ship to most countries worldwide. International delivery times and shipping charges vary by destination and are calculated at checkout. Please note that any customs duties or import taxes are the responsibility of the recipient.",
  },
  {
    q: "How can I contact customer support?",
    a: "Our team is available Monday to Saturday, 9 AM–6 PM. You can reach us through the Contact page, by email at support@mohanmaya.in, or by phone at +91 99567 48903. We aim to respond to every query within 24 hours.",
  },
  {
    q: "Are my payment details secure?",
    a: "Absolutely. We never store your full card details on our servers. All payments are handled by PCI-DSS-compliant gateways using industry-standard SSL encryption, so your sensitive information stays protected end to end.",
  },
  {
    q: "What if I receive a damaged product?",
    a: "We’re sorry if that happens. Please contact us within 48 hours of delivery with photos of the damaged item and its packaging. We’ll arrange a free replacement or a full refund as quickly as possible - no lengthy back-and-forth.",
  },
  {
    q: "Can I cancel my order after placing it?",
    a: "Ready-made orders can be cancelled free of charge before they’re dispatched - just reach out to our support team. Custom and personalized orders can only be cancelled before production begins, since each piece is crafted specifically for you.",
  },
];

/** Single accordion row with a smooth, layout-shift-free open/close animation. */
function FaqItem({ id, item, isOpen, onToggle }) {
  const buttonId = `faq-trigger-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-white/5 transition-all duration-300 ${
        isOpen
          ? "border-[#fe4462] shadow-lg"
          : "border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#fe4462]/50"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fe4462] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white">
            {item.q}
          </span>
          <span
            className={`shrink-0 grid place-items-center h-9 w-9 rounded-full transition-all duration-300 ${
              isOpen
                ? "bg-[#fe4462] text-white rotate-45"
                : "bg-[#fe4462]/10 text-[#fe4462]"
            }`}
            aria-hidden="true"
          >
            <FiPlus size={18} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  usePageMeta(
    "FAQ | Mohan Maya",
    "Find answers to the most frequently asked questions about our products, services, shipping, payments, returns, and support."
  );

  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS.map((item, i) => ({ item, i }));
    return FAQS.map((item, i) => ({ item, i })).filter(
      ({ item }) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [query]);

  // SEO: FAQPage structured data (JSON-LD).
  const faqJsonLd = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }),
    []
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our handcrafted miniatures - from orders and payments to shipping, returns, and support. Can’t find it here? We’re only a message away."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
        cta={{ label: "Contact Us", to: "/contact" }}
      />

      <section className="py-16 sm:py-20 lg:py-24 bg-[[#fbfefb] dark:bg-[#0d0508]]">
        <div className="max-w-3xl mx-auto px-5">
          {/* Search */}
          <ScrollReveal direction="up">
            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions…"
                aria-label="Search frequently asked questions"
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full pl-11 pr-11 py-3.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-shadow duration-200 outline-none focus:!outline-none focus-visible:!outline-none focus:shadow-md"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-8 w-8 rounded-full text-gray-400 hover:text-[#fe4462] hover:bg-gray-100 dark:hover:bg-white/10 transition"
                  aria-label="Clear search"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Accordion */}
          <div className="mt-8 space-y-4" role="list">
            {filtered.length > 0 ? (
              filtered.map(({ item, i }) => (
                <ScrollReveal key={item.q} direction="up" delay={Math.min(i * 0.04, 0.25)}>
                  <FaqItem
                    id={i}
                    item={item}
                    isOpen={openId === i}
                    onToggle={() => setOpenId(openId === i ? null : i)}
                  />
                </ScrollReveal>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-[#fe4462]/10 text-[#fe4462] mb-4">
                  <FiHelpCircle size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  No matching questions
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try a different keyword, or{" "}
                  <Link to="/contact" className="text-[#fe4462] font-semibold hover:underline">
                    contact our team
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="p-16 sm:p-20 lg:p-24 bg-[#fbfefb] dark:bg-[#0d0508]">
        <div className="max-w-7xl mx-auto px-5">
          <ScrollReveal direction="up">
            <div className="group relative overflow-hidden rounded-3xl shadow-xl">
              {/* Background image - cover, centered, no repeat - with a subtle zoom */}
              <img
                src="/About/Hero/about-bg.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1500ms] ease-out motion-reduce:transform-none motion-reduce:transition-none"
              />
              {/* Dark overlay keeps text readable over any image */}
              <div className="absolute inset-0 bg-black/60" />

              <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Still Have Questions?
                </h2>
                <p className="mt-4 text-white/90 max-w-xl mx-auto text-base sm:text-lg">
                  Can’t find the answer you’re looking for? Our team is here to help.
                </p>
                <Link
                  to="/contact"
                  className="group mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#fe4462] border border-[#fe4462] text-white font-semibold hover:bg-transparent hover:text-[#fe4462] duration-200 shadow-xl cursor-pointer"
                >
                  Contact Us
                  <FaArrowRight className="group-hover:translate-x-1 duration-300" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
