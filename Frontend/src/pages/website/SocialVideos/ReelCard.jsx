import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FiPlay, FiExternalLink, FiHeart, FiMessageCircle } from "react-icons/fi";
import { formatVideoDate, formatCompact } from "../../../utils/format";

// Instagram brand gradient (matches the Community platform theme).
const IG_GRADIENT = "linear-gradient(135deg, #e1306c, #f77737)";

/**
 * A single Instagram post/reel card — thumbnail, media-type badge, like &
 * comment counts, truncated caption, publish date, and a "View on Instagram"
 * button. Mirrors VideoCard's premium treatment so the two feeds feel identical.
 * All data is real (from the Instagram API); nothing here is hardcoded.
 */
export default function ReelCard({ reel }) {
  const { caption, thumbnail, permalink, publishedAt, likes, comments, mediaType } = reel;
  const type = mediaType || "Post";
  const isReel = type === "Reel";
  const date = formatVideoDate(publishedAt);
  const [imgOk, setImgOk] = useState(true);

  return (
    <article className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_55px_-18px_rgba(225,48,108,0.4)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fbfefb] dark:bg-white/5">
        {thumbnail && imgOk ? (
          <img
            src={thumbnail}
            alt={caption ? `${type}: ${caption.slice(0, 80)}` : `Instagram ${type.toLowerCase()} thumbnail`}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          // Graceful fallback when a thumbnail is missing / fails to load.
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#e1306c]/15 to-[#f77737]/15 text-[#e1306c]">
            <FaInstagram size={44} />
          </div>
        )}

        {/* Cinematic gradient - strengthens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Play indicator - only for playable Reels */}
        {isReel && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="relative grid place-items-center h-16 w-16 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-0 group-hover:opacity-40" />
              <FiPlay className="relative ml-1" size={26} />
            </span>
          </span>
        )}

        {/* Media-type badge */}
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg backdrop-blur-sm"
          style={{ background: IG_GRADIENT }}
        >
          <FaInstagram size={13} /> {type}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Date + engagement (like / comment counts) */}
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          {date ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-400 dark:text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {date}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-3 font-medium text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1" title={`${likes} likes`}>
              <FiHeart size={12} /> {formatCompact(likes)}
            </span>
            <span className="inline-flex items-center gap-1" title={`${comments} comments`}>
              <FiMessageCircle size={12} /> {formatCompact(comments)}
            </span>
          </span>
        </div>

        {/* Caption - truncated to 3 lines; fixed min-height avoids layout shift */}
        <h3 className="font-semibold text-[14px] leading-snug text-gray-900 dark:text-white line-clamp-3 min-h-[3.75rem] group-hover:text-[var(--accent)] transition-colors">
          {caption || "View this post on Instagram"}
        </h3>

        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${type.toLowerCase()} on Instagram${caption ? `: ${caption.slice(0, 60)}` : ""}`}
          className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] hover:shadow-lg hover:shadow-[var(--ring)] text-white text-sm font-semibold px-4 py-3 rounded-full transition-all duration-300 group-hover:gap-3"
        >
          <FaInstagram size={16} /> View on Instagram <FiExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}
