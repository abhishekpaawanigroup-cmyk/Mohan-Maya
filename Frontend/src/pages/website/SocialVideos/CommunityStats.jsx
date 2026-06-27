import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiUsers,
  FiVideo,
  FiEye,
  FiTrendingUp,
  FiGrid,
  FiFilm,
  FiHeart,
  FiThumbsUp,
  FiFileText,
} from "react-icons/fi";
import SectionHeading from "../../../components/common/SectionHeading";
import { formatCompact } from "../../../utils/format";

/**
 * "Community Highlights" -a premium, glassmorphism metrics band that adapts to
 * the currently selected platform. YouTube uses LIVE channel data; Instagram &
 * Facebook use curated figures (no public API). Colours, icons, labels, data and
 * animations all swap with the platform, with a smooth staggered crossfade.
 */
function buildStats(platform, channel) {
  if (platform.key === "instagram") {
    return [
      { Icon: FiUsers, value: 18500, label: "Followers", hint: "and growing" },
      { Icon: FiGrid, value: 326, label: "Posts", hint: "shared" },
      { Icon: FiFilm, value: 148, label: "Reels", hint: "created" },
      { Icon: FiHeart, value: 6.8, label: "Engagement", hint: "avg. rate", format: (n) => `${n.toFixed(1)}%` },
    ];
  }
  if (platform.key === "facebook") {
    return [
      { Icon: FiUsers, value: 12400, label: "Followers", hint: "on Facebook" },
      { Icon: FiThumbsUp, value: 9800, label: "Page Likes", hint: "total" },
      { Icon: FiFileText, value: 540, label: "Posts", hint: "shared" },
      { Icon: FiTrendingUp, value: 210000, label: "Monthly Reach", hint: "people" },
    ];
  }
  // YouTube -live channel data.
  const subs = channel?.subscriberCount ?? 0;
  const videos = channel?.videoCount ?? 0;
  const views = channel?.viewCount ?? 0;
  const avg = videos > 0 ? views / videos : 0;
  return [
    { Icon: FiUsers, value: subs, label: "Subscribers", hint: "on YouTube" },
    { Icon: FiVideo, value: videos, label: "Videos", hint: "published" },
    { Icon: FiEye, value: views, label: "Total Views", hint: "all-time" },
    { Icon: FiTrendingUp, value: avg, label: "Avg. Views", hint: "per video" },
  ];
}

/** Counts up to `value` (eased) the first time it scrolls into view. */
function CountUp({ value, duration = 1.6, format = formatCompact }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let start;
    const tick = (t) => {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return <span ref={ref}>{format(n)}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function StatCard({ Icon, value, label, hint, format, accent, accent2, glow, ring, loading, failed }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl p-4 sm:p-6 lg:p-7 shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      {/* Hover accent glow (platform-tinted) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: glow }}
      />

      <div className="relative flex items-center gap-3 sm:gap-4">
        <span
          className="grid place-items-center h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-2xl text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})`, boxShadow: `0 10px 24px -10px ${ring}` }}
        >
          <Icon size={22} />
        </span>

        <h3 className="text-2xl sm:text-4xl font-bold leading-none tracking-tight tabular-nums">
          {loading ? (
            <span className="inline-block h-8 w-16 rounded-md skeleton align-middle" />
          ) : failed ? (
            <span className="text-gray-400">—</span>
          ) : (
            <span
              style={{
                backgroundImage: `linear-gradient(90deg, ${accent}, ${accent2})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <CountUp value={value} format={format} />
            </span>
          )}
        </h3>
      </div>

      <p className="relative mt-5 text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
      <p className="relative mt-0.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>

      {/* Underline that draws in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-6 bottom-5 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </motion.div>
  );
}

export default function CommunityStats({ platform, channel, status }) {
  const stats = buildStats(platform, channel);
  const isYouTube = platform.key === "youtube";
  const loading = isYouTube && status === "loading";
  const failed = isYouTube && status === "error";
  const PIcon = platform.Icon;

  return (
    <section className="relative py-16 sm:py-20 bg-[#fbfefb] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Platform brand chip -crossfades on switch */}
        <div className="mb-6 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={platform.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
              style={{
                background: `linear-gradient(135deg, ${platform.accent}, ${platform.accent2})`,
                boxShadow: `0 10px 26px -10px ${platform.ring}`,
              }}
            >
              <PIcon size={14} /> {platform.name} Stats
            </motion.span>
          </AnimatePresence>
        </div>

        <SectionHeading
          title="Community Highlights"
          subtitle="A growing community across our channels -here's our reach on the selected platform."
          accent={platform.accent}
          className="mb-12"
        />

        {/* Stat grid -staggered crossfade whenever the platform changes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={platform.key}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((s) => (
              <StatCard
                key={s.label}
                {...s}
                accent={platform.accent}
                accent2={platform.accent2}
                glow={platform.glow}
                ring={platform.ring}
                loading={loading}
                failed={failed}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
