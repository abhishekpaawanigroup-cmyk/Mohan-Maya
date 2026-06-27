import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";

/**
 * "Our Story" - 50/50 content + image, stacks on mobile, fades up on scroll.
 */
export default function OurStory() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#fbfefb] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left - content */}
          <ScrollReveal direction="up">
            <span className="inline-block text-[#fe4462] border border-[#fe4462] px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
              Our Story
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-5 leading-tight">
              Crafting Tiny Worlds,{" "}
              <span className="text-[#fe4462]">One Detail at a Time</span>
            </h2>

            <div className="mt-5 space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Mohan Maya began as a small passion project in Vrindavan - a quiet
                dream to capture devotion, emotion, and storytelling inside the palm
                of your hand. What started on a single workbench soon grew into a
                studio of artists who live and breathe miniature craftsmanship.
              </p>
              <p>
                Every piece is sculpted, painted, and finished entirely by hand.
                We obsess over the tiniest details - the fold of a robe, the glint in
                an eye - because we believe true artistry lives in the things most
                people never notice.
              </p>
              <p>
                Today, collectors around the world bring our handcrafted characters
                into their homes - each one a timeless reminder that the smallest
                creations can hold the biggest stories.
              </p>
            </div>

            <Link to="/shop" className="px-6 py-3 bg-[#fe4462] text-[#fff] border border-[#fe4462] hover:bg-transparent hover:text-[#fe4462] rounded-full font-semibold transition cursor-pointer mt-8 inline-flex group items-center gap-1">
              Explore Collection
              <FiArrowRight className="group-hover:translate-x-1 duration-300" />
            </Link>
          </ScrollReveal>

          {/* Right - image */}
          <ScrollReveal direction="up" delay={0.1} className="relative">
            {/* Soft theme accents behind the image */}
            <div className="pointer-events-none absolute -bottom-5 -left-5 w-28 h-28 rounded-2xl bg-[#fe4462]/10 -z-10 hidden lg:block" />
            <div className="pointer-events-none absolute -top-5 -right-5 w-24 h-24 rounded-full bg-[#c48212]/15 -z-10 hidden lg:block" />

            <div className="relative rounded-lg overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 aspect-[4/3] lg:aspect-[5/4]">
              <img
                src="/About/Hero/about-banner.jpeg"
                alt="Handcrafted Mohan Maya miniature collectibles"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
