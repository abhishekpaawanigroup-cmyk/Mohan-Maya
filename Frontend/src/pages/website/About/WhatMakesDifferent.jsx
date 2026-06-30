import { motion } from "framer-motion";
import { LuHandHeart } from "react-icons/lu";
import { GiFlute, GiCheckedShield, GiLotus } from "react-icons/gi";
import SectionHeading from "../../../components/common/SectionHeading";
import ScrollReveal from "../../../components/common/ScrollReveal";

/**
 * "What Makes Mohan Maya Different" - a premium 2-column section: a softly
 * floating Krishna-inspired miniature on the left, three glassmorphism feature
 * cards on the right. Stacks vertically (image first) on mobile.
 */
const features = [
  {
    Icon: LuHandHeart,
    title: "Handcrafted With Love",
    body:
      "Every miniature is carefully crafted by skilled artisans who pay attention to even the smallest details. No two pieces are exactly alike, making every creation unique.",
    from: "#fe4462",
    to: "#d93550",
  },
  {
    Icon: GiFlute,
    title: "Inspired by Krishna's Divine World",
    body:
      "From Krishna's playful childhood to peaceful village life and timeless Indian traditions, our collections celebrate stories that continue to inspire millions.",
    from: "#c48212",
    to: "#e0a83a",
  },
  {
    Icon: GiCheckedShield,
    title: "Designed to Last",
    body:
      "We believe beautiful art should become a part of your family's memories. That's why we focus on quality materials, fine craftsmanship, and timeless designs that can be cherished for years.",
    from: "#fe4462",
    to: "#ff7f50",
  },
];

export default function WhatMakesDifferent() {
  return (
    <section className="relative overflow-hidden bg-[#fbfefb] dark:bg-[#0d0508]">

      <div className="relative max-w-7xl mx-auto px-5">
        <SectionHeading
          badge="Why Mohan Maya"
          title="What Makes Mohan Maya Different"
          accent="#c48212"
          className="mb-6 lg:mb-8"
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - floating Krishna-inspired miniature */}
          <ScrollReveal direction="up" className="relative order-1 flex justify-center">

            <div className="relative w-full max-w-md">
              {/* Subtle glow */}
              <div className="pointer-events-none absolute inset-0 m-auto h-2/3 w-2/3 rounded-full bg-[#fe4462]/20 blur-3xl" aria-hidden="true" />

              <motion.img
                src="/Featured-images/mm4.png"
                alt="Krishna-inspired handcrafted Mohan Maya miniature"
                loading="lazy"
                decoding="async"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 mx-auto w-full max-w-[340px] h-[80%] sm:max-w-md object-contain drop-shadow-2xl"
              />
            </div>
          </ScrollReveal>

          {/* Right - feature cards */}
          <div className="order-2 flex flex-col gap-5 sm:gap-6">
            {features.map(({ Icon, title, body, from, to }, i) => (
              <ScrollReveal key={title} direction="up" delay={0.1 + i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative flex h-full items-start gap-4 sm:gap-5 rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 shadow-sm transition-shadow duration-500 hover:shadow-xl"
                >
                  

                  <span
                    className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 12px 26px -10px ${from}99` }}
                  >
                    <Icon size={26} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
                      {body}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
