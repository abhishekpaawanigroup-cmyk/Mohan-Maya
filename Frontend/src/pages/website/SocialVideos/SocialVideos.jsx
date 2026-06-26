import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../../../components/common/Breadcrumb";
import SectionHeading from "../../../components/common/SectionHeading";
import { usePageMeta } from "../../../hooks/useHooks";
import { useYouTubeVideos } from "../../../hooks/useYouTubeVideos";
import { useYouTubeChannel } from "../../../hooks/useYouTubeChannel";
import { PLATFORMS, platformMap, themeVars } from "./platforms";
import Tabs from "./Tabs";
import ChannelHeader from "./ChannelHeader";
import YouTubeTab from "./YouTubeTab";
import ComingSoon from "./ComingSoon";
import CommunityStats from "./CommunityStats";
import SocialHighlights from "./SocialHighlights";

// Shared rise-in for hero items.
const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
// Crossfade used whenever the active platform changes (premium theme switch).
const swap = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function SocialVideos() {
  usePageMeta(
    "Latest Videos & Social Content - Mohan Maya",
    "Explore the latest videos, tutorials, showcases and updates from Mohan Maya across YouTube and other social platforms."
  );

  const [tab, setTab] = useState("youtube");
  // Loads the channel's full upload history once on mount; pagination is
  // client-side, so state persists while switching tabs (no refetch).
  const youtube = useYouTubeVideos();
  // Live channel stats (subscribers / videos / views) for the dashboard cards.
  const { channel, status: channelStatus } = useYouTubeChannel();

  // Active platform drives the whole page theme via CSS variables.
  const theme = platformMap[tab];
  const ActiveIcon = theme.Icon;

  return (
    <div style={themeVars(theme)} className="transition-colors duration-500">
      {/* ── Hero ── */}
      <section
        className="relative h-screen max-h-[1000px] overflow-hidden bg-cover bg-center"
        aria-label="Latest Videos & Social Content"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero/hero-all.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black/80" />

        {/* Per-platform colour wash — crossfades on tab switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(120% 90% at 12% 18%, ${theme.glow}, transparent 55%)` }}
          />
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 text-white">
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            >
              <motion.div variants={fade} className="mb-4">
                <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Community" }]} light />
              </motion.div>

              {/* Animated platform chip */}
              <motion.div variants={fade} className="mb-5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tab}
                    {...swap}
                    transition={{ duration: 0.35 }}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                      boxShadow: `0 10px 26px -10px ${theme.ring}`,
                    }}
                  >
                    <ActiveIcon size={14} /> {theme.name}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              <motion.h1
                variants={fade}
                className="text-4xl md:text-6xl font-bold leading-tight mb-4"
              >
                Latest{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tab}
                    {...swap}
                    transition={{ duration: 0.35 }}
                    className="inline-block text-[var(--accent)] transition-colors duration-500"
                  >
                    {theme.name}
                  </motion.span>
                </AnimatePresence>{" "}
                Content
              </motion.h1>

              <motion.p
                variants={fade}
                className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed min-h-[3.5rem]"
              >
                <AnimatePresence mode="wait">
                  <motion.span key={tab} {...swap} transition={{ duration: 0.35 }} className="inline-block">
                    {theme.tagline}
                  </motion.span>
                </AnimatePresence>
              </motion.p>

              {/* External links to each channel — each in its own brand colour */}
              <motion.div variants={fade} className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                {PLATFORMS.map((p) => {
                  const Icon = p.Icon;
                  return (
                    <a
                      key={p.key}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white border border-transparent transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`,
                        boxShadow: `0 10px 28px -12px ${p.ring}`,
                      }}
                    >
                      <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" /> {p.label}
                    </a>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Community stats + content (shared soft background) ── */}
      <div className="relative [display:flow-root] bg-[#f4edee] dark:bg-[#0d0508]">
        <CommunityStats channel={channel} status={channelStatus} />

        <section className="relative pt-16 sm:pt-20 pb-16 sm:pb-20 overflow-hidden">
          {/* Decorative accents — crossfade to the active platform colour */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute top-24 -left-20 w-72 h-72 rounded-full blur-3xl" style={{ background: theme.glow }} />
              <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full blur-3xl" style={{ background: theme.glow }} />
            </motion.div>
          </AnimatePresence>

          <div className="relative max-w-7xl mx-auto px-5">
            <SectionHeading
              badge="Latest"
              title="Social Media Content"
              subtitle="The latest from our channels - fresh content appears here automatically."
              accent={theme.accent}
              className="mb-10"
            />

            <Tabs tabs={PLATFORMS} active={tab} onChange={setTab} />

            {tab === "youtube" && (
              <div className="mt-10">
                <ChannelHeader channel={channel} status={channelStatus} fallbackUrl={theme.href} />
              </div>
            )}

            <div className="mt-10">
              <AnimatePresence mode="wait">
                <motion.div key={tab} {...swap}>
                  {tab === "youtube" ? (
                    <YouTubeTab
                      videos={youtube.videos}
                      status={youtube.status}
                      error={youtube.error}
                      retry={youtube.retry}
                    />
                  ) : (
                    <ComingSoon platform={theme} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      {/* ── Platform highlight cards ── */}
      <SocialHighlights platforms={PLATFORMS} channel={channel} status={channelStatus} />

      {/* ── Stay Connected CTA (adopts the active platform gradient) ── */}
      <section className="p-16 sm:p-20 lg:p-24 bg-[#f4edee] dark:bg-[#0d0508]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20 text-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, rgb(22, 16, 16), rgb(204, 0, 0))`,
              boxShadow: `0 30px 70px -25px ${theme.ring}`,
            }}
          >
            {/* Layered decorative glows + subtle grid */}
            <div className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-black/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Join the community
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Stay Connected with Mohan Maya
              </h2>
              <p className="mt-4 text-white/90 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                Follow us across our channels for the latest videos, behind-the-scenes
                updates, and fresh handcrafted miniature content - every week.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-4">
                {PLATFORMS.map((p) => {
                  const Icon = p.Icon;
                  return (
                    <a
                      key={p.key}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 bg-white font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                      style={{ color: p.accent }}
                    >
                      <Icon size={18} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
                      {p.key === "youtube" ? "Subscribe on YouTube" : `Follow on ${p.label}`}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
