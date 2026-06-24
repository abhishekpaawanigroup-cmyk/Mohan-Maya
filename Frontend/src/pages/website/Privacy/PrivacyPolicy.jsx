import { Link } from "react-router-dom";
import {
  FiShield,
  FiDatabase,
  FiSettings,
  FiLock,
  FiCircle,
  FiShare2,
  FiUserCheck,
  FiMail,
  FiRefreshCw,
} from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import ScrollReveal from "../../../components/common/ScrollReveal";
import PageHero from "../../../components/common/PageHero";
import { usePageMeta } from "../../../hooks/useHooks";

const LAST_UPDATED = "June 13, 2026";

const sections = [
  {
    id: "introduction",
    icon: FiShield,
    title: "Introduction",
    body: (
      <>
        <p>
          At <strong>Mohan-Maya</strong>, your privacy matters to us. This Privacy Policy explains how
          we collect, use, protect, and share your information when you visit our website, browse our
          collections, or make a purchase.
        </p>
        <p>
          By using our website, you agree to the practices described in this policy. We encourage you
          to read it carefully to understand how your data is handled.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    icon: FiDatabase,
    title: "Information We Collect",
    body: (
      <>
        <p>We collect information to provide a better shopping experience, including:</p>
        <ul>
          <li><strong>Personal details</strong> - name, email address, phone number, and shipping address you provide at checkout or via our contact form.</li>
          <li><strong>Order information</strong> - products purchased, order value, and payment status (we never store full card details).</li>
          <li><strong>Usage data</strong> - pages visited, items viewed or added to your cart/wishlist, and approximate location.</li>
          <li><strong>Device data</strong> - browser type, operating system, and screen size used to optimise the experience.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    icon: FiSettings,
    title: "How We Use Information",
    body: (
      <>
        <p>The information we collect is used to:</p>
        <ul>
          <li>Process and deliver your orders accurately and on time.</li>
          <li>Personalise your browsing and product recommendations.</li>
          <li>Send order updates, and - with your consent - offers and announcements.</li>
          <li>Improve our website, products, and customer support.</li>
          <li>Prevent fraud and keep our platform secure.</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-protection",
    icon: FiLock,
    title: "Data Protection & Security",
    body: (
      <>
        <p>
          We use industry-standard safeguards - encrypted connections (HTTPS), secure payment gateways,
          and restricted access controls - to protect your data against unauthorised access, loss, or
          misuse.
        </p>
        <p>
          While we work hard to protect your information, no method of transmission over the internet is
          100% secure. We continually review our measures to keep your data safe.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    icon: FiCircle,
    title: "Cookies Policy",
    body: (
      <>
        <p>
          We use cookies and similar technologies (including your browser's local storage) to remember
          your cart, wishlist, and theme preference, and to understand how the site is used.
        </p>
        <ul>
          <li><strong>Essential cookies</strong> - required for core features like the cart.</li>
          <li><strong>Preference storage</strong> - remembers your dark/light mode and saved items.</li>
          <li><strong>Analytics</strong> - helps us improve performance and content.</li>
        </ul>
        <p>You can clear or block cookies in your browser settings at any time.</p>
      </>
    ),
  },
  {
    id: "third-party",
    icon: FiShare2,
    title: "Third-Party Services",
    body: (
      <>
        <p>
          We may share limited information with trusted partners who help us operate the business, such
          as payment processors, shipping & logistics providers, and analytics tools.
        </p>
        <p>
          These partners only receive the data needed to perform their service and are required to keep
          it confidential. We never sell your personal information to third parties.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    icon: FiUserCheck,
    title: "User Rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your data, subject to legal obligations.</li>
          <li>Opt out of marketing communications at any time.</li>
        </ul>
        <p>
          To exercise any of these rights, reach out to us through the{" "}
          <Link to="/contact" className="text-[#fe4462] font-semibold hover:underline">
            contact page
          </Link>.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    icon: FiMail,
    title: "Contact Information",
    body: (
      <>
        <p>If you have questions about this Privacy Policy or your data, contact us:</p>
        <ul>
          <li><strong>Email:</strong> support@mohanmaya.in</li>
          <li><strong>Phone:</strong> +91 99567 48903</li>
          <li><strong>Address:</strong> Ganga Enclave, Roorkee, Uttarakhand, India</li>
        </ul>
      </>
    ),
  },
  {
    id: "policy-updates",
    icon: FiRefreshCw,
    title: "Policy Updates",
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for
          legal reasons. The "last updated" date at the top of this page will always show the latest
          revision.
        </p>
        <p>We encourage you to review this page periodically to stay informed.</p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  usePageMeta("Privacy Policy - Mohan Maya", "How Mohan Maya collects, uses, and protects your information.");
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="Learn how we collect, use, and protect your information."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]}
        cta={{ label: "Contact Us", to: "/contact" }}
      />

      <section className="py-16 sm:py-20 bg-[#f4edee] dark:bg-[#0d0508]">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal className="mb-8">
            <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
          {/* Table of contents (sticky on desktop) */}
          <ScrollReveal direction="right" className="hidden lg:block lg:sticky lg:top-28">
            <nav
              aria-label="Privacy policy sections"
              className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100 mb-3">
                On this page
              </h2>
              <ul className="space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block text-sm text-gray-500 dark:text-gray-400 hover:text-[#fe4462] py-1.5 transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollReveal>

          {/* Content */}
          <div className="space-y-6">
            {sections.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 0.04}>
                <article
                  id={s.id}
                  className="scroll-mt-28 bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/10"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#fe4462]/10 text-[#fe4462] flex items-center justify-center shrink-0">
                      <s.icon size={22} />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {s.title}
                    </h2>
                  </div>
                  <div className="privacy-prose text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-gray-800 dark:[&_strong]:text-gray-100">
                    {s.body}
                  </div>
                </article>
              </ScrollReveal>
            ))}

            {/* CTA */}
            <ScrollReveal>
              <div className="bg-[#fff8f9] dark:bg-white/5 border border-[#ffd8df] dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center">
                <h3 className="text-lg font-bold dark:text-white">Still have questions?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-5">
                  We're happy to explain how your data is handled.
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#fe4462] border border-[#fe4462] text-white font-semibold hover:bg-transparent hover:text-[#fe4462] duration-200 shadow-xl cursor-pointer"
                >
                  Contact Us
                  <FaArrowRight className="group-hover:translate-x-1 duration-300" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
