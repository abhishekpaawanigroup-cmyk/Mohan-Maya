import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import SectionHeading from "../../../components/common/SectionHeading";
import { formatCompact } from "../../../utils/format";

/**
 * Premium platform "highlight" cards — each social channel presented as a
 * dashboard tile. YouTube shows the LIVE subscriber count from the channel API;
 * platforms without a connected API show a clear "Follow us" prompt instead of
 * fabricated numbers. Links stay in sync with the page's TABS / footer.
 */
export default function SocialHighlights({ platforms, channel, status }) {
  const subsLoading = status === "loading";

  return (
    <section className="relative py-16 sm:py-20 bg-[#f4edee] dark:bg-[#0d0508] overflow-hidden">
      {/* Decorative accents */}
      <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-[var(--soft)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[var(--glow)] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5">
        <SectionHeading
          badge="Connect"
          title="Follow Our Journey"
          subtitle="Join our community across every channel for behind-the-scenes moments, tutorials and fresh handcrafted miniature drops."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map(({ key, label, Icon, color, href, handle }, i) => {
            const isYouTube = key === "youtube";
            const metric = isYouTube && channel ? formatCompact(channel.subscriberCount) : null;
            const displayHandle = isYouTube ? channel?.title || handle : handle;

            return (
              <motion.a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl p-7 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.35)] transition-shadow duration-500"
              >
                {/* Brand gradient wash on hover */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${color}14, transparent 60%)` }}
                />
                <span
                  className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ backgroundColor: `${color}40` }}
                />

                <div className="relative flex items-center justify-between">
                  <span
                    className="grid place-items-center h-14 w-14 rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ backgroundColor: color }}
                  >
                    <Icon size={26} />
                  </span>
                  <span className="grid place-items-center h-9 w-9 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 transition-all duration-500 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:rotate-45">
                    <FiArrowUpRight size={18} />
                  </span>
                </div>

                <div className="relative mt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{label}</h3>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate">{displayHandle}</p>

                  <div className="mt-5 flex items-baseline gap-2 min-h-[2rem]">
                    {isYouTube ? (
                      subsLoading ? (
                        <span className="h-7 w-24 rounded-lg skeleton" />
                      ) : (
                        <>
                          <span className="text-2xl font-extrabold tracking-tight tabular-nums" style={{ color }}>
                            {metric ?? "—"}
                          </span>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">subscribers</span>
                        </>
                      )
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3.5 py-1.5"
                        style={{ color, backgroundColor: `${color}1a` }}
                      >
                        Follow us <FiArrowUpRight size={14} />
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
