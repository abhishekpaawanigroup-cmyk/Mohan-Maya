import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

const ABOUT_HERO_IMAGE = "/About/Hero/about-banner.jpeg";

/**
 * Reusable inner-page hero, styled to match the About page hero
 * (same background image, dark overlay, typography and spacing).
 *
 * Props:
 *  - title:      main heading (rendered as the page <h1>)
 *  - subtitle:   supporting line below the title
 *  - image:      background image (defaults to the About hero banner)
 *  - align:      "left" (default, matches About) or "center"
 *  - breadcrumb: optional [{ label, to? }] rendered above the title
 *  - cta:        optional { label, to } rendered as a primary button below the subtitle
 */
export default function PageHero({
  title,
  subtitle,
  image = ABOUT_HERO_IMAGE,
  align = "left",
  breadcrumb,
  cta,
}) {
  const alignment = align === "center" ? "text-center mx-auto items-center" : "text-left";

  return (
    <section
      className="relative h-screen max-h-[1000px] overflow-hidden"
      aria-label={title}
    >
      {/* Background video (poster falls back to the page image while it loads) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={image}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero/hero-all.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 text-white">
          <motion.div
            className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : alignment}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
          >
            {breadcrumb?.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className="mb-4"
              >
                <Breadcrumb items={breadcrumb} light className={align === "center" ? "flex justify-center" : ""} />
              </motion.div>
            )}

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
              }}
              className="text-4xl md:text-6xl font-bold leading-tight mb-4"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                }}
                className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}

            {cta?.to && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                }}
                className={`mt-8 ${align === "center" ? "flex justify-center" : ""}`}
              >
                <Link
                  to={cta.to}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#fe4462] border border-[#fe4462] text-white font-semibold hover:bg-transparent hover:text-[#fe4462] duration-200 shadow-xl cursor-pointer"
                >
                  {cta.label}
                  <FaArrowRight className="group-hover:translate-x-1 duration-300" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
