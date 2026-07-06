import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FiPlay, FiExternalLink, FiClock } from "react-icons/fi";
import { formatVideoDate } from "../../../utils/format";

// Instagram brand gradient
const IG_GRADIENT = "linear-gradient(135deg, #e1306c, #f77737)";

// Backend base URL (same as instagramApi.js uses).
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * A single Instagram post/reel card.
 * Styled to be visually identical to YouTube's VideoCard (same width, height,
 * spacing, border radius, shadow, hover translate).
 * All text content, metadata, and buttons are removed. Only the image is visible.
 * The entire card is clickable and links directly to the Instagram post.
 *
 * Images are loaded via the backend /api/instagram/img proxy which fetches
 * Instagram CDN images server-to-server, bypassing the session-bound 403
 * that blocks browser direct access to Instagram CDN URLs.
 */
export default function ReelCard({ reel }) {
  const { permalink, mediaType, caption, publishedAt } = reel;
  const type = mediaType || "Post";
  const isReel = type === "Reel";
  const date = formatVideoDate(publishedAt);
  const [imgOk, setImgOk] = useState(true);

  // Primary: use the backend proxy URL (resolves Instagram CDN 403 issues).
  // Fallback chain: direct display_url → thumbnail → other available fields.
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
    <article className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_55px_-18px_rgba(254,68,98,0.4)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="relative aspect-video overflow-hidden bg-[#fbfefb] dark:bg-white/5">
        {imageUrl && imgOk ? (
          <img
            src={imageUrl}
            alt={`Instagram ${type.toLowerCase()}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#e1306c]/15 to-[#f77737]/15 text-[#e1306c]">
            <FaInstagram size={44} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {isReel && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="relative grid place-items-center h-16 w-16 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-0 group-hover:opacity-40" />
              <FiPlay className="relative ml-1" size={26} />
            </span>
          </span>
        )}

        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg backdrop-blur-sm"
          style={{ background: IG_GRADIENT }}
        >
          <FaInstagram size={13} /> {type}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {date && (
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {date}
          </p>
        )}

        <h3 className="font-bold text-[15px] leading-snug text-gray-900 dark:text-white line-clamp-2 min-h-[2.65rem] group-hover:text-[var(--accent)] transition-colors">
          {caption ? caption.replace(/\s+/g, " ").trim().slice(0, 110) : `Instagram ${type.toLowerCase()}`}
        </h3>

        {permalink && (
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${type.toLowerCase()} on Instagram`}
            className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] hover:shadow-lg hover:shadow-[var(--ring)] text-white text-sm font-semibold px-4 py-3 rounded-full transition-all duration-300 group-hover:gap-3"
          >
            <FaInstagram size={16} /> Watch on Instagram <FiExternalLink size={13} />
          </a>
        )}
      </div>
    </article>
  );
}
