import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiInbox, FiRefreshCw, FiClock, FiExternalLink } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import ScrollReveal from "../../../components/common/ScrollReveal";
import ReelCard from "./ReelCard";
import ReelSkeleton from "./ReelSkeleton";
import FeaturedReel from "./FeaturedReel";
import Pagination from "./Pagination";

// Responsive grid: 1-up mobile, 2-up tablet, 4-up desktop (8 cards = 2 rows).
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 auto-rows-fr";
const PER_PAGE = 8;

/** Shared centered state panel (loading-error / empty / not-configured). */
function StateCard({ icon, title, body, children }) {
  return (
    <div className="mx-auto max-w-lg text-center py-14 px-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)]">
      <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-[var(--soft)] text-[var(--accent)] mb-5">
        {icon}
      </span>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">{body}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

/** "Follow on Instagram" pill used in empty / not-configured states. */
function FollowButton({ profileUrl }) {
  if (!profileUrl) return null;
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
    >
      <FaInstagram size={16} /> Follow on Instagram <FiExternalLink size={13} />
    </a>
  );
}

function SocialProfileHeader({ profile, profileUrl }) {
  const href = profile?.profileUrl || profileUrl;
  const name = profile?.name || "@mohanmaya_";
  const avatar = profile?.profilePicture;
  const followers = Number(profile?.followers ?? 0);
  const posts = Number(profile?.postCount ?? 0);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-[url('/social/yt-header.png')] bg-cover bg-center bg-no-repeat backdrop-blur-xl p-5 sm:py-14 sm:px-8 shadow-[0_14px_40px_-24px_rgba(225,48,108,0.45)]">
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e1306c] text-white shadow-lg">
            {avatar ? (
              <img src={avatar} alt={`${name} profile`} className="h-full w-full object-cover" />
            ) : (
              <FaInstagram size={32} />
            )}
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white">Instagram</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{name}</h2>
            <p className="mt-2 text-sm text-white">{profile?.followers ? `${followers.toLocaleString()} followers` : "Real-time updates from the community"}</p>
          </div>
        </div>
        

        <div className="flex flex-wrap gap-3 items-center">
          <div className="rounded-3xl bg-[#faf5f8] dark:bg-white/5 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {posts.toLocaleString()} reels
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaInstagram size={16} /> Follow
          </a>
        </div>
      </div>
    </div>
    
  );
}

/**
 * Instagram tab: a paginated grid of the latest reels, mirroring YouTubeTab's
 * loading / error / empty handling, plus a graceful "not configured" state so a
 * missing backend token never surfaces as a scary error.
 */
export default function InstagramTab({ reels, profile, status, error, configured, retry, profileUrl }) {
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  const scrollToGrid = () => {
    const el = gridRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // ── First load / not yet started → featured + grid skeletons. ──
  if ((status === "loading" || status === "idle") && reels.length === 0) {
    return (
      <div className="space-y-10">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl">
          <div className="aspect-[4/5] lg:aspect-auto lg:min-h-[360px] skeleton" />
          <div className="p-7 sm:p-9 lg:p-11 space-y-4">
            <div className="h-6 w-32 skeleton rounded-full" />
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-8 w-1/2 skeleton rounded" />
            <div className="h-5 w-40 skeleton rounded" />
            <div className="h-12 w-48 skeleton rounded-full mt-2" />
          </div>
        </div>
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ReelSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Backend has no token configured → gentle "soon", not an error. ──
  if (status === "ready" && !configured) {
    return (
      <StateCard
        icon={<FiClock size={28} />}
        title="Instagram feed connecting soon"
        body="Our latest reels will appear here automatically once the feed is live."
      >
        <FollowButton profileUrl={profileUrl} />
      </StateCard>
    );
  }

  // ── Hard error with nothing to show → retry. ──
  if (status === "error" && reels.length === 0) {
    return (
      <StateCard
        icon={<FiAlertCircle size={28} />}
        title="Couldn't load reels"
        body={error?.message || "Something went wrong while reaching the server."}
      >
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <FiRefreshCw size={16} /> Try again
        </button>
      </StateCard>
    );
  }

  // ── Loaded but empty. ──
  if (status === "ready" && reels.length === 0) {
    return (
      <StateCard
        icon={<FiInbox size={28} />}
        title="No reels yet"
        body="New reels will appear here automatically."
      >
        <FollowButton profileUrl={profileUrl} />
      </StateCard>
    );
  }

  // ── Loaded content: featured reel + client-paginated grid (mirrors YouTube). ──
  const [featured, ...rest] = reels;
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageReels = rest.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goTo = (p) => {
    setPage(p);
    scrollToGrid();
  };

  return (
    <div className="space-y-12">
      {(profile || profileUrl) && <SocialProfileHeader profile={profile} profileUrl={profileUrl} />}
      {featured && <FeaturedReel reel={featured} />}

      {rest.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-7">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">More Reels</h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {reels.length} reels · Page {safePage} of {totalPages}
            </span>
          </div>

          <div ref={gridRef} className="scroll-mt-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={safePage}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={GRID}
              >
                {pageReels.map((r, i) => (
                  <ScrollReveal key={r.id} direction="up" delay={Math.min(i * 0.05, 0.25)} className="h-full">
                    <ReelCard reel={r} />
                  </ScrollReveal>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <Pagination page={safePage} totalPages={totalPages} onChange={goTo} />
        </div>
      )}
    </div>
  );
}
