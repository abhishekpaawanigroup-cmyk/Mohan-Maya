import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "../../../components/common/PageHero";
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

  // Active platform drives the content-section + stats theme via CSS variables.
  const theme = platformMap[tab];

  // Switch the in-page feed to a platform, then glide down to the content.
  const goToPlatform = (key) => {
    setTab(key);
    if (typeof document !== "undefined") {
      document.getElementById("community-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={themeVars(theme)} className="transition-colors duration-500">
      {/* ── Hero (matches the website's default page hero) ── */}
      <PageHero
        title="Our Community"
        subtitle="Explore the latest videos, tutorials, showcases and updates from Mohan Maya - fresh handcrafted content every week."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Community" }]}
        video="/social/bg.mp4"
        image="/social/bg.png"
      >
        {/* Platform switcher -picks the active feed (with a clear active state) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {PLATFORMS.map((p) => {
            const Icon = p.Icon;
            const isActive = tab === p.key;
            return (
              <button
                key={p.key}
                onClick={() => goToPlatform(p.key)}
                aria-pressed={isActive}
                aria-label={`Show ${p.label} content`}
                className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition-all duration-300 ${
                  isActive ? "scale-105 ring-2 ring-white/80" : "opacity-80 hover:opacity-100 hover:-translate-y-0.5"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`,
                  boxShadow: isActive ? `0 14px 32px -10px ${p.ring}` : `0 8px 20px -14px ${p.ring}`,
                }}
              >
                <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" /> {p.label}
              </button>
            );
          })}
        </div>
      </PageHero>

      {/* ── Videos content ── */}
      <div id="community-content" className="relative [display:flow-root] scroll-mt-24 bg-[#fbfefb] dark:bg-[#0d0508]">
        <section className="relative pt-16 sm:pt-20 pb-16 sm:pb-20 overflow-hidden">
          {/* Decorative accents -crossfade to the active platform colour */}
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

      {/* ── Community stats (now below the videos, themed per platform) ── */}
      <CommunityStats platform={theme} channel={channel} status={channelStatus} />

      {/* ── Platform highlight cards ── */}
      <SocialHighlights platforms={PLATFORMS} channel={channel} status={channelStatus} />

      {/* ── Stay Connected CTA (adopts the active platform gradient) ── */}
      <section className="px-4 py-14 sm:p-20 lg:p-24 bg-[#fbfefb] dark:bg-[#0d0508]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20 text-center shadow-2xl"
          >
            {/* Brand gradient backdrop */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#260b0b] to-[#bb0000]" />

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
