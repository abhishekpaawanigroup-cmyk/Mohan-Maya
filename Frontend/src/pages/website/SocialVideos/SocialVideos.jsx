import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";
import Breadcrumb from "../../../components/common/Breadcrumb";
import SectionHeading from "../../../components/common/SectionHeading";
import { usePageMeta } from "../../../hooks/useHooks";
import { useYouTubeVideos } from "../../../hooks/useYouTubeVideos";
import { useYouTubeChannel } from "../../../hooks/useYouTubeChannel";
import Tabs from "./Tabs";
import YouTubeTab from "./YouTubeTab";
import ComingSoon from "./ComingSoon";
import CommunityStats from "./CommunityStats";
import SocialHighlights from "./SocialHighlights";

// Official channels (kept in sync with the footer).
const LINKS = {
  instagram: "https://instagram.com/mohanmaya_",
  youtube: "https://www.youtube.com/results?search_query=mohanmaya",
  facebook: "https://www.facebook.com/share/18dgmfQ39U/",
};

// Tabs are data-driven so new platforms can be added in one place later.
// `handle` is the public profile name shown on the SocialHighlights cards.
const TABS = [
  { key: "youtube", label: "YouTube", Icon: FaYoutube, color: "#ff0000", href: LINKS.youtube, handle: "Mohan Maya" },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, color: "#d62976", href: LINKS.instagram, handle: "@mohanmaya_" },
  { key: "facebook", label: "Facebook", Icon: FaFacebookF, color: "#1877f2", href: LINKS.facebook, handle: "Mohan Maya" },
];

export default function SocialVideos() {
  usePageMeta(
    "Latest Videos & Social Content - Mohan Maya",
    "Explore the latest videos, tutorials, showcases and updates from Mohan Maya across YouTube and other social platforms."
  );

  const [tab, setTab] = useState("youtube");
  // Loaded once on mount; state persists while switching tabs (no refetch).
  const youtube = useYouTubeVideos(12);
  // Live channel stats (subscribers / videos / views) for the dashboard cards.
  const { channel, status: channelStatus } = useYouTubeChannel();
  const activePlatform = TABS.find((t) => t.key === tab);

  return (
    <>
      {/* ── Hero (video background, brand buttons, staggered animations) ── */}
      <section className="relative h-screen max-h-[1000px] bg-cover bg-center" aria-label="Latest Videos & Social Content">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero/hero-all.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black/80" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 text-white">
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="mb-4"
              >
                <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Community" }]} light />
              </motion.div>

              <motion.h1
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="text-4xl md:text-6xl font-bold leading-tight mb-4"
              >
                Latest Videos &amp; <span className="text-[#fe4462]">Social Content</span>
              </motion.h1>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed"
              >
                Explore the latest videos, tutorials, showcases, and updates from
                Mohan Maya across YouTube and other social platforms.
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="mt-8 flex flex-wrap gap-3 sm:gap-4"
              >
                {TABS.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#fe4462] border border-[#fe4462] text-white font-semibold hover:bg-transparent hover:border-[#fe4462] hover:text-[#fe4462] transition-all duration-300"
                  >
                    <Icon size={18} /> {label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Community stats + Videos (shared soft background) ──
          flow-root creates a new block formatting context so the stats'
          negative margin overlaps the hero without dragging this bg up. */}
      <div className="relative [display:flow-root] bg-[#f4edee] dark:bg-[#0d0508]">
        {/* Dashboard-style metrics that overlap the hero for a premium feel */}
        <CommunityStats channel={channel} status={channelStatus} />

        {/* ── Content ── */}
        <section className="relative pt-16 sm:pt-20 pb-16 sm:pb-20 overflow-hidden">
          {/* Subtle decorative accents */}
          <div className="pointer-events-none absolute top-24 -left-20 w-72 h-72 rounded-full bg-[#fe4462]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 -right-20 w-72 h-72 rounded-full bg-[#ed9ba8]/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-5">
            <SectionHeading
              badge="Latest"
              title="Social Media Videos"
              subtitle="The latest from our channels - fresh uploads appear here automatically."
              className="mb-10"
            />

            <Tabs tabs={TABS} active={tab} onChange={setTab} />

            <div className="mt-12">
              {tab === "youtube" ? (
                <YouTubeTab
                  videos={youtube.videos}
                  status={youtube.status}
                  error={youtube.error}
                  hasMore={youtube.hasMore}
                  loadMore={youtube.loadMore}
                  retry={youtube.retry}
                />
              ) : (
                <ComingSoon platform={activePlatform} />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Platform highlight cards ── */}
      <SocialHighlights platforms={TABS} channel={channel} status={channelStatus} />

      {/* ── Stay Connected CTA ── */}
      <section className="pb-16 sm:pb-20 lg:pb-24 bg-[#f4edee] dark:bg-[#0d0508]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20 text-center bg-gradient-to-br from-[#fe4462] via-[#e84d68] to-[#d93550] shadow-2xl shadow-[#fe4462]/30"
          >
            {/* Layered decorative glows + subtle grid */}
            <div className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-black/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                ✦ Join the community
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Stay Connected with Mohan Maya
              </h2>
              <p className="mt-4 text-white/90 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                Follow us across our channels for the latest videos, behind-the-scenes
                updates, and fresh handcrafted miniature content - every week.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-4">
                {TABS.map(({ key, label, Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-white text-[#fe4462] font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
                    {key === "youtube" ? "Subscribe on YouTube" : `Follow on ${label}`}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
