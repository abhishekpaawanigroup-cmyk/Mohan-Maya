import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiTruck,
  FiRefreshCw,
  FiRepeat,
  FiXCircle,
  FiCreditCard,
  FiPackage,
  FiSettings,
  FiHeadphones,
  FiPlus,
  FiMail,
  FiPhone,
  FiShield,
  FiGift,
  FiTag,
  FiUser,
  FiHelpCircle,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import PageHero from "../../../components/common/PageHero";
import ScrollReveal from "../../../components/common/ScrollReveal";
import { usePageMeta } from "../../../hooks/useHooks";

// Support contact details (kept in sync with the Contact / FAQ pages).
const SUPPORT_EMAIL = "support@mohanmaya.in";
const SUPPORT_PHONE_DISPLAY = "+91 99567 48903";
const SUPPORT_PHONE_TEL = "+919956748903";
const SUPPORT_WHATSAPP = "https://wa.me/919956748903";

// ── Quick help cards — each links to an existing route (no new flows). ──
const QUICK_HELP = [
  { icon: FiTruck, title: "Track Your Order", desc: "See real-time delivery status.", to: "/track" },
  { icon: FiRefreshCw, title: "Returns & Refunds", desc: "Start a return or refund request.", to: "/orders" },
  { icon: FiRepeat, title: "Replace an Item", desc: "Swap a damaged or wrong item.", to: "/orders" },
  { icon: FiXCircle, title: "Cancel an Order", desc: "Cancel before it's dispatched.", to: "/orders" },
  { icon: FiCreditCard, title: "Payment Issues", desc: "Failed payments & charges.", to: "/contact" },
  { icon: FiPackage, title: "Shipping Information", desc: "Delivery times & charges.", to: "/faq" },
  { icon: FiSettings, title: "Account Settings", desc: "Manage your profile & address.", to: "/profile" },
  { icon: FiHeadphones, title: "Contact Support", desc: "Reach our team directly.", to: "/contact" },
];

// ── Popular help topics — accordion; also searchable from the hero. ──
const HELP_TOPICS = [
  { q: "Where is my order?", a: "Once your order ships, we email and message you a tracking link. You can also open the Track Order page any time and enter your order ID to see its latest status." },
  { q: "How do I return a product?", a: "Go to My Orders, open the order, and choose Return. Ready-made items can be returned within 7 days of delivery if unused and in their original packaging. Custom pieces are eligible only if they arrive damaged or defective." },
  { q: "How long does delivery take?", a: "Standard orders arrive within 5-7 business days. Handcrafted and personalised pieces are made to order and may take 7-14 business days depending on the design." },
  { q: "How can I cancel my order?", a: "Ready-made orders can be cancelled free of charge before they are dispatched from My Orders. Custom orders can be cancelled only before production begins." },
  { q: "How do refunds work?", a: "Approved refunds are issued to your original payment method within 5-7 business days. For Cash on Delivery orders, we refund via UPI or bank transfer once the return is received." },
  { q: "What payment methods are accepted?", a: "We accept major credit and debit cards, UPI, popular wallets, and Cash on Delivery on eligible orders within India. All payments are processed through secure, encrypted gateways." },
  { q: "How do I change my address?", a: "Open Account Settings to add, edit, or set a default delivery address. For an order already placed, contact support before it ships and we'll update it where possible." },
  { q: "Is Cash on Delivery available?", a: "Yes, Cash on Delivery is available on eligible orders across most serviceable pincodes in India. Availability is confirmed at checkout based on your delivery location." },
];

// ── Contact support channels. ──
const CONTACT_CHANNELS = [
  { icon: FiMail, title: "Email Support", desc: "We reply to every email within 24 hours.", cta: "Send Email", href: `mailto:${SUPPORT_EMAIL}` },
  { icon: FiPhone, title: "Phone Support", desc: `Mon-Sat, 9 AM-6 PM · ${SUPPORT_PHONE_DISPLAY}`, cta: "Call Now", href: `tel:${SUPPORT_PHONE_TEL}` },
  { icon: FaWhatsapp, title: "WhatsApp Support", desc: "Quick answers on the go via chat.", cta: "Message Us", href: SUPPORT_WHATSAPP, external: true },
];

// ── Help categories. ──
const CATEGORIES = [
  { icon: FiPackage, label: "Orders", to: "/orders" },
  { icon: FiCreditCard, label: "Payments", to: "/faq" },
  { icon: FiTruck, label: "Delivery", to: "/track" },
  { icon: FiRefreshCw, label: "Returns", to: "/orders" },
  { icon: FiShield, label: "Warranty", to: "/faq" },
  { icon: FiGift, label: "Gift Cards", to: "/shop" },
  { icon: FiTag, label: "Coupons", to: "/cart" },
  { icon: FiUser, label: "Account", to: "/profile" },
  { icon: FiShield, label: "Security", to: "/privacy" },
  { icon: FiHeadphones, label: "Seller Support", to: "/contact" },
];

/** Single accordion row — smooth, layout-shift-free open/close. */
function TopicItem({ id, topic, isOpen, onToggle }) {
  const buttonId = `cs-topic-trigger-${id}`;
  const panelId = `cs-topic-panel-${id}`;
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
          className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fe4462] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="text-base font-semibold text-gray-800 dark:text-white sm:text-lg">
            {topic.q}
          </span>
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
              isOpen ? "rotate-45 bg-[#fe4462] text-white" : "bg-[#fe4462]/10 text-[#fe4462]"
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
            <p className="-mt-1 px-5 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:px-6 sm:pb-6 sm:text-base">
              {topic.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Section heading shared across this page for consistent hierarchy/spacing. */
function SectionTitle({ title, subtitle }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

export default function CustomerService() {
  usePageMeta(
    "Customer Service | Mohan Maya",
    "Get help with orders, returns, refunds, payments, delivery and your account. Search help topics or contact Mohan Maya support 24/7."
  );

  const [query, setQuery] = useState("");
  const [openQ, setOpenQ] = useState(HELP_TOPICS[0].q);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HELP_TOPICS;
    return HELP_TOPICS.filter(
      (t) => t.q.toLowerCase().includes(q) || t.a.toLowerCase().includes(q)
    );
  }, [query]);

  // SEO: FAQPage structured data for the help topics.
  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: HELP_TOPICS.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }),
    []
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* ── Hero with prominent search ── */}
      <PageHero
        title="Customer Service"
        subtitle="Hi! How can we help you today?"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Customer Service" }]}
      >
        <div className="w-full">
          <div className="relative mx-auto max-w-xl">
            <FiSearch
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for help, orders, returns, payments..."
              aria-label="Search customer service help topics"
              className="w-full rounded-full border border-white/20 bg-white py-4 pl-12 pr-4 text-gray-800 shadow-xl outline-none transition-shadow duration-200 placeholder:text-gray-400 focus:shadow-2xl focus:shadow-[#fe4462]/15 focus:outline-none focus:ring-0 focus:ring-transparent focus:!outline-none focus:!ring-0 focus:!rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!rounded-full"
            />
          </div>
          <p className="mt-3 text-center text-sm text-white/80" aria-live="polite">
            {query.trim()
              ? `${filteredTopics.length} matching ${filteredTopics.length === 1 ? "topic" : "topics"} below`
              : "Popular: returns, refund, tracking, delivery"}
          </p>
        </div>
      </PageHero>

      {/* ── Quick help cards ── */}
      <section className="bg-[#fbfefb] py-16 dark:bg-[#0d0508] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle
            title="How can we help?"
            subtitle="Jump straight to the most common requests."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_HELP.map(({ icon: Icon, title, desc, to }, i) => (
              <ScrollReveal key={title} direction="up" delay={Math.min(i * 0.05, 0.3)}>
                <Link
                  to={to}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#fe4462] hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                >
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#fe4462]/10 text-[#fe4462] transition-colors duration-300 group-hover:bg-[#fe4462] group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#fe4462] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Open <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular help topics (accordion, searchable) ── */}
      <section className="bg-white py-16 dark:bg-[#0b0409] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5">
          <SectionTitle
            title="Popular Help Topics"
            subtitle="Quick answers to the questions we hear most."
          />
          <div className="space-y-4" role="list">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, i) => (
                <ScrollReveal key={topic.q} direction="up" delay={Math.min(i * 0.04, 0.2)}>
                  <TopicItem
                    id={i}
                    topic={topic}
                    isOpen={openQ === topic.q}
                    onToggle={() => setOpenQ(openQ === topic.q ? null : topic.q)}
                  />
                </ScrollReveal>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#fe4462]/10 text-[#fe4462]">
                  <FiHelpCircle size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">No matching topics</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try another keyword, or{" "}
                  <Link to="/contact" className="font-semibold text-[#fe4462] hover:underline">
                    contact our team
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact support channels ── */}
      <section className="bg-[#fbfefb] py-16 dark:bg-[#0d0508] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle title="Contact Support" subtitle="Reach us the way that suits you best." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTACT_CHANNELS.map(({ icon: Icon, title, desc, cta, href, external, soon }, i) => (
              <ScrollReveal key={title} direction="up" delay={Math.min(i * 0.05, 0.3)}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
                  <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#fe4462]/10 text-[#fe4462]">
                    <Icon size={26} />
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-1 flex-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                  {soon ? (
                    <span className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-gray-200 bg-gray-100 py-2.5 text-sm font-semibold text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500">
                      {cta}
                    </span>
                  ) : (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fe4462] py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#d93550] hover:shadow-lg hover:shadow-[#fe4462]/25 active:scale-[0.98]"
                    >
                      {cta}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Help categories ── */}
      <section className="bg-white py-16 dark:bg-[#0b0409] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle title="Browse by Category" subtitle="Find help across every part of your experience." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {CATEGORIES.map(({ icon: Icon, label, to }, i) => (
              <ScrollReveal key={label} direction="up" delay={Math.min(i * 0.04, 0.28)}>
                <Link
                  to={to}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#fe4462] hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#fe4462]/10 text-[#fe4462] transition-colors duration-300 group-hover:bg-[#fe4462] group-hover:text-white">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      

      {/* ── Footer CTA ── */}
      <section className="bg-white py-16 dark:bg-[#0b0409] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <ScrollReveal direction="up">
            <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#fe4462]/10 text-[#fe4462]">
              <FiClock size={26} />
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Still need help?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-gray-500 dark:text-gray-400">
              We're here to help you 24/7.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#fe4462] px-7 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#d93550] hover:shadow-lg hover:shadow-[#fe4462]/25 active:scale-[0.98]"
              >
                Contact Support
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-[#fe4462] px-7 py-3.5 font-semibold text-[#fe4462] transition-all duration-200 hover:bg-[#fe4462] hover:text-white active:scale-[0.98]"
              >
                View FAQs
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
