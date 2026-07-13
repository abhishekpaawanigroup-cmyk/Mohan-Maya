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
      <div className="relative aspect-video overflow-hidden bg-[#fbfefb] dark:bg-white/5 bg-cover bg-center bg-no-repeat"  style={{ backgroundImage: `url(${imageUrl})` }}>
       <div class="absolute inset-0 w-full h-full bg-black/80"></div>
        {imageUrl && imgOk ? (
          <img
            src={imageUrl}
            alt={`Instagram ${type.toLowerCase()}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="relative h-full object-contain transition-transform duration-700 group-hover:scale-110 block mx-auto"
          
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#e1306c]/15 to-[#f77737]/15 text-[#e1306c]">
            <FaInstagram size={44} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {isReel && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="relative grid place-items-center h-12 w-12 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-0 group-hover:opacity-40" />
              <FiPlay className="relative ml-1" size={22} />
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
  
        <h3 className="font-bold text-[15px] leading-snug text-gray-900 dark:text-white line-clamp-2 overflow-hidden  transition-colors">
          {caption ? caption.replace(/\s+/g, " ").trim().slice(0, 210) : `Instagram ${type.toLowerCase()}`}
        </h3>

        <div className="flex justify-between items-center mt-4 ">

                {date && (
          <p className=" inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {date}
          </p>
        )}


        {permalink && (
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${type.toLowerCase()} on Instagram`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:bg-[#e95061] hover:text-white hover:ring-[#e95061] dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600 dark:hover:bg-[#e95061] dark:hover:text-white dark:hover:ring-[#e95061]"
          >
            <FaInstagram size={16} /> Watch
          </a>
        )}
        </div>
      </div>
    </article>
  );
}
