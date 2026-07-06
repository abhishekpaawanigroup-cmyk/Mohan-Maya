import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { FiPlay, FiExternalLink, FiClock, FiHeart, FiMessageCircle } from "react-icons/fi";
import { formatVideoDate, formatCompact } from "../../../utils/format";

const IG_GRADIENT = "linear-gradient(135deg, #e1306c, #f77737)";
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * Hero treatment for the account's most recent reel — the Instagram counterpart
 * to FeaturedVideo. Large split layout: prominent thumbnail beside the caption /
 * meta / CTA, with a pulsing "Latest" badge so it stands out from the grid.
 */
export default function FeaturedReel({ reel }) {
  const { caption, thumbnail, permalink, publishedAt, likes, comments, mediaType } = reel;
  const type = mediaType || "Post";
  const isReel = type === "Reel";
  const date = formatVideoDate(publishedAt);
  const [imgOk, setImgOk] = useState(true);

  const imageUrl = reel.proxyUrl
    ? `${API_BASE}${reel.proxyUrl}`
    : reel.display_url ||
      reel.displayUrl ||
      reel.thumbnail ||
      reel.thumbnailUrl ||
      reel.thumbnailSrc ||
      reel.imageUrl ||
      reel.image;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_70px_-30px_rgba(225,48,108,0.45)]"
    >
      {/* ── Thumbnail ── */}
      <a
        href={permalink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View the latest ${type.toLowerCase()} on Instagram`}
        className="relative block aspect-[4/5] lg:aspect-auto overflow-hidden bg-[#fbfefb] dark:bg-white/5"
      >
        {imageUrl && imgOk ? (
          <img
            src={imageUrl}
            alt={caption ? `${type}: ${caption.slice(0, 80)}` : `Instagram ${type.toLowerCase()}`}
            loading="eager"
            decoding="async"
            onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#e1306c]/15 to-[#f77737]/15 text-[#e1306c]">
            <FaInstagram size={56} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />

        {/* Play indicator - only for playable Reels */}
        {isReel && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="relative grid place-items-center h-20 w-20 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-40" />
              <FiPlay className="relative ml-1.5" size={34} />
            </span>
          </span>
        )}

        {/* Latest badge with live pulse */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wide shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Latest {type}
        </span>

        {/* Platform badge */}
        <span
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg"
          style={{ background: IG_GRADIENT }}
        >
          <FaInstagram size={13} /> Instagram
        </span>
      </a>

      {/* ── Content ── */}
      <div className="relative flex flex-col justify-center p-7 sm:p-9 lg:p-11">
        <span className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[var(--soft)] blur-3xl" />

        <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-[var(--ring)] bg-[var(--soft)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
          Just Posted
        </span>

        <h3 className="relative mt-5 text-xl sm:text-2xl lg:text-[1.75rem] font-bold leading-tight text-gray-900 dark:text-white line-clamp-4 group-hover:text-[var(--accent)] transition-colors">
          {caption || "View this post on Instagram"}
        </h3>

        <div className="relative mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {date && (
            <span className="inline-flex items-center gap-2">
              <FiClock size={15} className="text-[var(--accent)]" /> {date}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <FiHeart size={15} className="text-[var(--accent)]" /> {formatCompact(likes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiMessageCircle size={15} className="text-[var(--accent)]" /> {formatCompact(comments)}
          </span>
        </div>

        <div className="relative mt-7">
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-[var(--ring)] hover:shadow-xl hover:shadow-[var(--ring)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaInstagram size={20} /> View on Instagram <FiExternalLink size={15} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
