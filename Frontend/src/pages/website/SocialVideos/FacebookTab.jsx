import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiInbox, FiRefreshCw, FiClock, FiHeart, FiMessageCircle, FiShare2, FiEye, FiExternalLink, FiPlay } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import ScrollReveal from "../../../components/common/ScrollReveal";
import Pagination from "./Pagination";
import { formatCompact, formatVideoDate } from "../../../utils/format";

const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 auto-rows-fr";
const PER_PAGE = 8;

function FacebookCard({ post }) {
  const [imgOk, setImgOk] = useState(true);
  const date = formatVideoDate(post.publishedAt);
  const href = post.permalink || post.url || post.postUrl || "";
  const isVideo = (post.type || "").toLowerCase() === "reel" || (post.type || "").toLowerCase() === "video";

  return (
    <article className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_55px_-18px_rgba(24,119,242,0.4)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="relative aspect-video overflow-hidden bg-[#fbfefb] dark:bg-white/5 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${post.thumbnail})` }}>
        <div class="absolute inset-0 w-full h-full bg-black/80"></div>
        {post.thumbnail && imgOk ? (
          <img
            src={post.thumbnail}
            alt={post.caption || "Facebook post"}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="relative h-full object-contain transition-transform duration-700 group-hover:scale-110 block mx-auto"

          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#1877f2]/15 to-[#0a5dc2]/15 text-[#1877f2]">
            <FaFacebookF size={42} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {isVideo && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="relative grid place-items-center h-12 w-12 rounded-full bg-white/95 text-[#1877f2] shadow-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-0 group-hover:opacity-40" />
              <FiPlay className="relative ml-1" size={20} />
            </span>
          </span>
        )}

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#1877f2] text-white shadow-lg backdrop-blur-sm">
          <FaFacebookF size={13} /> {post.type || "Post"}
        </span>
      </div>

          <div className="px-5 py-3 flex flex-col flex-1">
  <div className="mb-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
          {post.likes != null && post.likes > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiHeart size={13} /> {formatCompact(post.likes)}</span>
          )}
          {post.comments != null && post.comments > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiMessageCircle size={13} /> {formatCompact(post.comments)}</span>
          )}
          {post.shares != null && post.shares > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiShare2 size={13} /> {formatCompact(post.shares)}</span>
          )}
          {post.views != null && post.views > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiEye size={13} /> {formatCompact(post.views)}</span>
          )}
        </div>

        <h3 className="font-bold text-[15px] leading-snug text-gray-900 dark:text-white line-clamp-2">
          {post.caption ? post.caption.replace(/\s+/g, " ").trim().slice(0, 110) : "Facebook post"}
        </h3>

       


<div className="flex justify-between items-center mt-4">
         {date && (
          <p className=" inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {date}
          </p>
        )}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch this Facebook ${post.type || "post"}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:bg-red-600 hover:text-white hover:ring-red-600 dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:ring-red-600"
          >
            <FaFacebookF size={12} /> Watch
          </a>
        )}
        </div>
      </div>
    </article>
  );
}

function SocialProfileHeader({ profile, profileUrl }) {
  const href = profile?.profileUrl || profileUrl;
  const name = profile?.name || "Mohan Maya";
  const avatar = profile?.profilePicture;
  const followers = Number(profile?.followers ?? 0);
  const posts = Number(profile?.postCount ?? 0);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_14px_40px_-24px_rgba(24,119,242,0.45)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1877f2] text-white shadow-lg">
            {avatar ? (
              <img src={avatar} alt={`${name} profile`} className="h-full w-full object-cover" />
            ) : (
              <FaFacebookF size={32} />
            )}
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Facebook</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {followers > 0 ? `${followers.toLocaleString()} followers` : "Real-time community updates"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="rounded-3xl bg-[#eff6ff] dark:bg-white/5 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {posts.toLocaleString()} posts
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaFacebookF size={16} /> Follow
          </a>
        </div>
      </div>
    </div>
  );
}

function FeaturedFacebook({ post, profileUrl }) {
  const [imgOk, setImgOk] = useState(true);
  const date = formatVideoDate(post.publishedAt);
  const href = post.permalink || post.url || post.postUrl || "";
  const isVideo = (post.type || "").toLowerCase() === "reel" || (post.type || "").toLowerCase() === "video";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative grid lg:grid-cols-2 lg:items-stretch overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_70px_-30px_rgba(24,119,242,0.45)] "
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the latest Facebook ${post.type || "post"}`}
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 dark:from-amber-950/40 dark:via-pink-950/40 dark:to-purple-950/40 bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: `url(${post.thumbnail})` }}>
            <div class="absolute inset-0 w-full h-full bg-black/80"></div>

        {post.thumbnail && imgOk ? (
          <img
            src={post.thumbnail}
            alt={post.caption || "Facebook post"}
            loading="eager"
            decoding="async"
            onError={() => setImgOk(false)}
            className="relative h-full object-contain transition-transform duration-700 group-hover:scale-105 block mx-auto"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1877f2]/15 to-[#0a5dc2]/15 text-[#1877f2]">
            <FaFacebookF size={56} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />

        {isVideo && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="relative grid place-items-center h-20 w-20 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-40" />
              <FiPlay className="relative ml-1.5" size={34} />
            </span>
          </span>
        )}

        <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wide shadow-lg">
          {/* <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span> */}
          Latest {post.type || "Post"}
        </span>

        {/* <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#1877f2] text-white shadow-lg">
          <FaFacebookF size={13} /> Facebook
        </span> */}
      </a>

      <div className="relative flex flex-col justify-center p-7 sm:p-9 lg:p-11">
        <span className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[var(--soft)] blur-3xl" />

        <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-[var(--ring)] bg-[var(--soft)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
          Recently Uploaded
        </span>

        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            <FaFacebookF size={14} /> Open profile
          </a>
        )}

        <h3 className="relative mt-5 text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-[1.5] text-gray-900 dark:text-white line-clamp-3 ">
          {post.caption || "Open this post on Facebook"}
        </h3>

        <div className="relative mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {date && (
            <span className="inline-flex items-center gap-2">
              <FiClock size={15} className="text-[var(--accent)]" /> {date}
            </span>
          )}
          {post.likes != null && post.likes > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiHeart size={15} className="text-[var(--accent)]" /> {formatCompact(post.likes)}</span>
          )}
          {post.comments != null && post.comments > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiMessageCircle size={15} className="text-[var(--accent)]" /> {formatCompact(post.comments)}</span>
          )}
          {post.shares != null && post.shares > 0 && (
            <span className="inline-flex items-center gap-1.5"><FiShare2 size={15} className="text-[var(--accent)]" /> {formatCompact(post.shares)}</span>
          )}
        </div>

        {href && (
          <div className="relative mt-7">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-[var(--ring)] hover:shadow-xl hover:shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaFacebookF size={20} /> View Now
            </a>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function FacebookTab({ posts, profile, status, error, configured, retry, profileUrl }) {
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  const scrollToGrid = () => {
    const el = gridRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (status === "loading" && posts.length === 0) {
    return (
      <div className="space-y-10">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl">
          <div className="aspect-video lg:aspect-auto lg:min-h-[340px] skeleton" />
          <div className="p-7 sm:p-9 lg:p-11 space-y-4">
            <div className="h-6 w-40 skeleton rounded-full" />
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-8 w-1/2 skeleton rounded" />
            <div className="h-5 w-32 skeleton rounded" />
            <div className="h-12 w-44 skeleton rounded-full mt-2" />
          </div>
        </div>
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-full flex flex-col rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-sm">
              <div className="aspect-video skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-1/4 skeleton rounded-full" />
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-4 w-1/2 skeleton rounded" />
                <div className="h-11 w-full skeleton rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" && posts.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center py-14 px-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)]">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-[var(--soft)] text-[var(--accent)] mb-5">
          <FiAlertCircle size={28} />
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Couldn't load Facebook posts</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
          {error?.message || "Something went wrong while reaching the server."}
        </p>
        <button
          onClick={retry}
          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <FiRefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  if (status === "ready" && posts.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center py-14 px-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)]">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-[var(--soft)] text-[var(--accent)] mb-5">
          <FiInbox size={28} />
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Facebook posts yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">New updates will appear here automatically.</p>
      </div>
    );
  }

  const validPosts = (posts || []).filter(Boolean);
  const [featured, ...rest] = validPosts;
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagePosts = rest.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goTo = (p) => {
    setPage(p);
    scrollToGrid();
  };

  return (
    <div className="space-y-12">
      {(profile || profileUrl) && <SocialProfileHeader profile={profile} profileUrl={profileUrl} />}
      {featured && <FeaturedFacebook post={featured} profileUrl={profile?.profileUrl || profileUrl} />}

      {rest.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-7">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">More Posts</h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {validPosts.length} posts · Page {safePage} of {totalPages}
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
                {pagePosts.map((post, i) => (
                  <ScrollReveal key={post.id || post.postId || `${post.url}-${i}`} direction="up" delay={Math.min(i * 0.05, 0.25)} className="h-full">
                    <FacebookCard post={post} />
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
