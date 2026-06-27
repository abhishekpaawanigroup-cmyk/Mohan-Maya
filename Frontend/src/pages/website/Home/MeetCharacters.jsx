import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";

/**
 * "Meet Our Characters" — a clean, premium horizontal slider placed directly
 * below the Hero. Shows 5 cards per view on desktop (responsive down to 1),
 * the rest reachable via a carousel. Navigation arrows sit at the bottom-right:
 * the left arrow only appears once you've scrolled forward, and the right arrow
 * fades out at the last set — both transition smoothly with position.
 */
const characters = [
  { name: "Krishna", image: "/Featured-images/mm4.png" },
  { name: "Radha", image: "/Featured-images/mm5.png" },
  { name: "Madhav", image: "/Featured-images/mm6.png" },
  { name: "Maya", image: "/Featured-images/mm7.png" },
  { name: "Shiva", image: "/trandy-images/mm4.png" },
  { name: "Mohini", image: "/trandy-images/mm6.png" },
  { name: "Govinda", image: "/bestseller-image/mm6.png" },
];

const GAP = 20; // px — must match the track's gap-5

// Cards visible per breakpoint (5 on desktop, fewer as the viewport narrows).
function getPerView(width) {
  if (width >= 1024) return 5;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

export default function MeetCharacters() {
  const [perView, setPerView] = useState(() =>
    typeof window !== "undefined" ? getPerView(window.innerWidth) : 5
  );
  const [index, setIndex] = useState(0);

  // Track the breakpoint so the slider stays responsive.
  useEffect(() => {
    const onResize = () => setPerView(getPerView(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(0, characters.length - perView);
  // Clamp during render so a resize that shrinks the range can't leave us
  // scrolled past the end (no state-sync effect needed).
  const safeIndex = Math.min(index, maxIndex);

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < maxIndex;

  const prev = () => setIndex(Math.max(0, safeIndex - 1));
  const next = () => setIndex(Math.min(maxIndex, safeIndex + 1));

  // One card = (100% − gaps) / perView; one step shifts by (100% + gap) / perView.
  const cardWidth = `calc((100% - ${(perView - 1) * GAP}px) / ${perView})`;
  const trackTransform = `translateX(calc(${safeIndex} * (100% + ${GAP}px) / ${perView} * -1))`;

  return (
    <section className="relative overflow-hidden py-20 bg-[#f4edee] dark:bg-[#0d0508]">
      {/* Soft blurred gradient orbs for depth (decorative, non-interactive) */}
     
      

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <SectionHeading
          badge="Our Characters"
          title="Meet Our Characters"
          subtitle="Explore the legendary characters that define our premium collection."
          className="mb-12"
        />

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Viewport (clips off-screen cards; vertical padding leaves room for hover lift) */}
          <div className="overflow-hidden px-1 py-4">
            <div
              className="flex gap-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              style={{ transform: trackTransform }}
            >
              {characters.map((char) => (
                <article
                  key={char.name}
                  style={{ width: cardWidth }}
                  className="group shrink-0"
                >
                  <div className="flex flex-col items-center rounded-xl border border-white/40 bg-white/70 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
                    {/* Portrait with subtle zoom on hover */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#f7eef0] to-[#efe2e5] dark:from-white/[0.07] dark:to-white/[0.02]">
                      <img
                        src={char.image}
                        alt={`${char.name} — handcrafted Mohan Maya figurine`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="mt-4 text-base font-bold tracking-tight text-gray-900 dark:text-white">
                      {char.name}
                    </h3>

                    {/* Transparent glass / outlined Explore button */}
                    <Link
                      to="/shop"
                      aria-label={`Explore the ${char.name} collection`}
                      className="group/btn mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-300/80 bg-white/10 px-5 py-2 text-xs font-semibold tracking-wide text-gray-800 backdrop-blur-md transition-all duration-300 hover:border-[#fe4462] hover:bg-[#fe4462] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fe4462]/60 active:scale-95 dark:border-white/25 dark:text-white"
                    >
                      Explore
                      <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Bottom navigation arrows: left at bottom-left, right at bottom-right,
              on the same line. Both stay mounted and justify-between pins each to
              its side, so one fading out never shifts the other. */}
          {maxIndex > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <motion.button
                type="button"
                onClick={prev}
                disabled={!canPrev}
                aria-label="Previous characters"
                aria-hidden={!canPrev}
                tabIndex={canPrev ? 0 : -1}
                animate={{ opacity: canPrev ? 1 : 0, scale: canPrev ? 1 : 0.85 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-md backdrop-blur-md transition-colors duration-300 hover:border-[#fe4462] hover:bg-[#fe4462] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fe4462]/60 dark:border-white/20 dark:bg-white/10 dark:text-white ${
                  canPrev ? "" : "pointer-events-none"
                }`}
              >
                <FiArrowLeft size={20} />
              </motion.button>

              <motion.button
                type="button"
                onClick={next}
                disabled={!canNext}
                aria-label="Next characters"
                aria-hidden={!canNext}
                tabIndex={canNext ? 0 : -1}
                animate={{ opacity: canNext ? 1 : 0, scale: canNext ? 1 : 0.85 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-md backdrop-blur-md transition-colors duration-300 hover:border-[#fe4462] hover:bg-[#fe4462] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fe4462]/60 dark:border-white/20 dark:bg-white/10 dark:text-white ${
                  canNext ? "" : "pointer-events-none"
                }`}
              >
                <FiArrowRight size={20} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
