import { motion } from "framer-motion";
import { FiUsers, FiVideo, FiEye, FiTrendingUp } from "react-icons/fi";
import { formatCompact } from "../../../utils/format";

/**
 * Dashboard-style community metrics driven by LIVE YouTube channel data
 * (subscribers, uploads, total views + derived avg. views). Each metric is a
 * glassmorphic card with a tinted icon, hover lift and accent glow. While the
 * channel request is in flight a shimmer placeholder keeps the layout stable.
 */
function buildStats(channel) {
  const subs = channel?.subscriberCount ?? 0;
  const videos = channel?.videoCount ?? 0;
  const views = channel?.viewCount ?? 0;
  const avgViews = videos > 0 ? views / videos : 0;

  return [
    { Icon: FiUsers, value: formatCompact(subs), label: "Subscribers", hint: "on YouTube", accent: "#fe4462" },
    { Icon: FiVideo, value: formatCompact(videos), label: "Videos Published", hint: "and counting", accent: "#d62976" },
    { Icon: FiEye, value: formatCompact(views), label: "Total Views", hint: "across our channel", accent: "#ff0000" },
    { Icon: FiTrendingUp, value: formatCompact(avgViews), label: "Avg. Views", hint: "per video", accent: "#1877f2" },
  ];
}

export default function CommunityStats({ channel, status }) {
  const stats = buildStats(channel);
  const isLoading = status === "loading";
  const failed = status === "error";

  return (
    <section className="relative -mt-16 sm:-mt-20 z-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ Icon, value, label, hint, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_40px_-15px_rgba(254,68,98,0.25)] hover:shadow-[0_20px_50px_-12px_rgba(254,68,98,0.4)] transition-shadow duration-500"
            >
              {/* Accent glow on hover */}
              <span
                className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: `${accent}33` }}
              />
              {/* Top accent bar */}
              <span
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />

              <span
                className="relative grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                style={{ backgroundColor: `${accent}1a`, color: accent }}
              >
                <Icon size={22} />
              </span>

              <div className="relative mt-auto">
                {isLoading ? (
                  <div className="h-9 sm:h-10 w-20 rounded-lg skeleton" />
                ) : (
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">
                    {failed ? "—" : value}
                  </h3>
                )}
                <p className="mt-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
