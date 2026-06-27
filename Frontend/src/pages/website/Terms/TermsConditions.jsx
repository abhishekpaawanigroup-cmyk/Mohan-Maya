import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiUserCheck,
  FiBox,
  FiCreditCard,
  FiClipboard,
  FiTruck,
  FiRefreshCw,
  FiUser,
  FiAward,
  FiSlash,
  FiExternalLink,
  FiAlertTriangle,
  FiShield,
  FiEdit,
  FiBook,
  FiMail,
  FiHome,
} from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import ScrollReveal from "../../../components/common/ScrollReveal";
import PageHero from "../../../components/common/PageHero";
import { usePageMeta } from "../../../hooks/useHooks";

const LAST_UPDATED = "June 13, 2026";

const sections = [
  {
    id: "acceptance",
    icon: FiCheckCircle,
    title: "Acceptance of Terms",
    body: (
      <>
        <p>
          By accessing or using the Mohan-Maya website, you agree to be bound by these Terms &amp;
          Conditions and all applicable laws. If you do not agree with any part of these terms, please
          discontinue use of the website.
        </p>
        <p>
          These terms apply to all visitors, users, and customers who access or use our services.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    icon: FiUserCheck,
    title: "Eligibility to Use the Website",
    body: (
      <>
        <p>To place an order, you must:</p>
        <ul>
          <li>Be at least 18 years of age, or use the site under the supervision of a parent or guardian.</li>
          <li>Provide accurate, current, and complete information during checkout.</li>
          <li>Have the legal capacity to enter into a binding contract.</li>
        </ul>
      </>
    ),
  },
  {
    id: "products",
    icon: FiBox,
    title: "Products and Services",
    body: (
      <>
        <p>
          We make every effort to display our handcrafted miniatures as accurately as possible. Because
          each piece is made by hand, slight variations in colour, texture, and finish may occur and are
          not considered defects.
        </p>
        <p>
          We reserve the right to modify, discontinue, or limit the availability of any product at any
          time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    icon: FiCreditCard,
    title: "Pricing and Payments",
    body: (
      <>
        <p>
          All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated
          otherwise. Prices and promotional offers may change without notice.
        </p>
        <ul>
          <li>Payment must be completed at checkout via the available payment methods.</li>
          <li>Orders are confirmed only after successful payment authorisation.</li>
          <li>We are not responsible for charges levied by your bank or payment provider.</li>
        </ul>
      </>
    ),
  },
  {
    id: "orders",
    icon: FiClipboard,
    title: "Order Processing and Cancellation",
    body: (
      <>
        <p>
          Once an order is placed, you will receive a confirmation with an order ID that can be used to{" "}
          <Link to="/track" className="text-[#fe4462] font-semibold hover:underline">track your order</Link>.
        </p>
        <ul>
          <li>Orders may be cancelled before they enter the processing stage.</li>
          <li>Custom or personalised orders cannot be cancelled once production begins.</li>
          <li>We reserve the right to refuse or cancel any order due to stock, pricing errors, or suspected fraud.</li>
        </ul>
      </>
    ),
  },
  {
    id: "shipping",
    icon: FiTruck,
    title: "Shipping and Delivery",
    body: (
      <>
        <p>
          This section serves as our <strong>Shipping Policy</strong>. Standard orders are typically
          delivered within 5–7 business days; custom orders may take 7–14 business days.
        </p>
        <ul>
          <li>Free shipping is available on eligible orders above ₹999.</li>
          <li>Delivery timelines are estimates and may vary due to location or courier delays.</li>
          <li>Risk of loss passes to you once the order is handed to the courier.</li>
        </ul>
      </>
    ),
  },
  {
    id: "returns",
    icon: FiRefreshCw,
    title: "Returns and Refunds",
    body: (
      <>
        <p>
          This section serves as our <strong>Refund Policy</strong>. Replacements are available for items
          that arrive damaged or defective, provided you contact us within 7 days of delivery.
        </p>
        <ul>
          <li>Personalised and custom-made items are not eligible for return or exchange.</li>
          <li>Approved refunds are processed to the original payment method within 5–10 business days.</li>
          <li>For any issue, reach our team via the{" "}
            <Link to="/contact" className="text-[#fe4462] font-semibold hover:underline">contact page</Link>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "accounts",
    icon: FiUser,
    title: "User Accounts and Responsibilities",
    body: (
      <>
        <p>
          You are responsible for maintaining the confidentiality of your account details and for all
          activity that occurs under your account.
        </p>
        <ul>
          <li>Keep your login credentials secure and do not share them.</li>
          <li>Notify us immediately of any unauthorised use of your account.</li>
          <li>Ensure that the information you provide remains accurate and up to date.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ip",
    icon: FiAward,
    title: "Intellectual Property Rights",
    body: (
      <>
        <p>
          All content on this website - including logos, product designs, images, text, and graphics - is
          the property of Mohan-Maya and protected by intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, or use any content for commercial purposes without our prior
          written consent.
        </p>
      </>
    ),
  },
  {
    id: "prohibited",
    icon: FiSlash,
    title: "Prohibited Activities",
    body: (
      <>
        <p>When using our website, you agree not to:</p>
        <ul>
          <li>Use the site for any unlawful or fraudulent purpose.</li>
          <li>Attempt to gain unauthorised access to our systems or other users' data.</li>
          <li>Introduce viruses, malware, or any harmful code.</li>
          <li>Copy, scrape, or resell our content without permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party",
    icon: FiExternalLink,
    title: "Third-Party Links",
    body: (
      <>
        <p>
          Our website may contain links to third-party websites or services that we do not own or control.
          We are not responsible for the content, privacy practices, or policies of any third-party sites.
        </p>
        <p>Accessing third-party links is at your own risk.</p>
      </>
    ),
  },
  {
    id: "liability",
    icon: FiAlertTriangle,
    title: "Limitation of Liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, Mohan-Maya shall not be liable for any indirect,
          incidental, or consequential damages arising from your use of the website or products.
        </p>
        <p>
          Our total liability for any claim shall not exceed the amount paid for the product giving rise
          to the claim.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    icon: FiShield,
    title: "Privacy and Data Protection",
    body: (
      <>
        <p>
          Your privacy is important to us. The collection and use of your personal information is governed
          by our{" "}
          <Link to="/privacy" className="text-[#fe4462] font-semibold hover:underline">Privacy Policy</Link>,
          which forms part of these Terms.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    icon: FiEdit,
    title: "Changes to Terms",
    body: (
      <>
        <p>
          We may update these Terms &amp; Conditions from time to time. Changes take effect as soon as they
          are posted on this page, and the "last updated" date will reflect the latest revision.
        </p>
        <p>Your continued use of the website constitutes acceptance of the revised terms.</p>
      </>
    ),
  },
  {
    id: "governing-law",
    icon: FiBook,
    title: "Governing Law",
    body: (
      <>
        <p>
          These Terms are governed by and construed in accordance with the laws of India. Any disputes
          shall be subject to the exclusive jurisdiction of the courts of Uttarakhand, India.
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
        <p>For questions about these Terms &amp; Conditions, contact us:</p>
        <ul>
          <li><strong>Email:</strong> support@mohanmaya.in</li>
          <li><strong>Phone:</strong> +91 99567 48903</li>
          <li><strong>Address:</strong> Ganga Enclave, Roorkee, Uttarakhand, India</li>
        </ul>
      </>
    ),
  },
];

export default function TermsConditions() {
  usePageMeta("Terms & Conditions - Mohan Maya", "The terms governing your use of the Mohan Maya website and purchases.");
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using Mohan-Maya or placing an order."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Terms & Conditions" }]}
        cta={{ label: "Contact Us", to: "/contact" }}
      />

      <section className="py-16 sm:py-20 bg-[#fbfefb] dark:bg-[#0d0508]">
        <div className="max-w-6xl mx-auto px-5">
          {/* Meta row */}
          <ScrollReveal className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#fe4462] hover:gap-3 transition-all"
            >
              <FiHome size={16} /> Back to Home
            </Link>
          </ScrollReveal>

          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
            {/* Sticky table of contents */}
            <ScrollReveal direction="right" className="hidden lg:block lg:sticky lg:top-28">
              <nav
                aria-label="Terms sections"
                className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10 max-h-[80vh] overflow-y-auto"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100 mb-3">
                  On this page
                </h2>
                <ol className="space-y-1">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#fe4462] py-1.5 transition-colors"
                      >
                        <span className="text-gray-300 dark:text-gray-600">{i + 1}.</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </ScrollReveal>

            {/* Content */}
            <div className="space-y-6">
              {sections.map((s, i) => (
                <ScrollReveal key={s.id} delay={i * 0.03}>
                  <article
                    id={s.id}
                    className="scroll-mt-28 bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="w-12 h-12 rounded-xl bg-[#fe4462]/10 text-[#fe4462] flex items-center justify-center shrink-0">
                        <s.icon size={22} />
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        <span className="text-[#fe4462]">{i + 1}.</span> {s.title}
                      </h2>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-gray-800 dark:[&_strong]:text-gray-100">
                      {s.body}
                    </div>
                  </article>
                </ScrollReveal>
              ))}

              {/* Footer CTA */}
              <ScrollReveal>
                <div className="bg-[#fbfefb] dark:bg-white/5 border border-[#ffd8df] dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center">
                  <h3 className="text-lg font-bold dark:text-white">Need clarification?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-5">
                    Our team is happy to walk you through any of these terms.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link to="/contact" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#fe4462] border border-[#fe4462] text-white font-semibold hover:bg-transparent hover:text-[#fe4462] duration-200 shadow-xl cursor-pointer">
                      Contact Us
                      <FaArrowRight className="group-hover:translate-x-1 duration-300" />
                    </Link>
                    <Link to="/privacy" className="btn-outline inline-flex">Privacy Policy</Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
