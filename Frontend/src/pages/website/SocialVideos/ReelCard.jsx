import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FiPlay } from "react-icons/fi";

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
  const { permalink, mediaType } = reel;
  const type = mediaType || "Post";
  const isReel = type === "Reel";
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
    <a
      href={permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${type.toLowerCase()} on Instagram`}
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_55px_-18px_rgba(254,68,98,0.4)] hover:-translate-y-1.5 transition-all duration-500"
    >
      {/* 1. Image container: fills the entire card */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#fbfefb] dark:bg-white/5">
        {imageUrl && imgOk ? (
          <img
            src={imageUrl}
            alt={`Instagram ${type.toLowerCase()}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          // Graceful fallback when image is missing / fails to load.
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#e1306c]/15 to-[#f77737]/15 text-[#e1306c]">
            <FaInstagram size={44} />
          </div>
        )}
      </div>

      {/* 2. Cinematic gradient - strengthens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-10" />

      {/* 3. Play indicator - overlayed in the center for Reels */}
      {isReel && (
        <span className="absolute inset-0 grid place-items-center pointer-events-none z-20">
          <span className="relative grid place-items-center h-16 w-16 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-0 group-hover:opacity-40" />
            <FiPlay className="relative ml-1" size={26} />
          </span>
        </span>
      )}

      {/* 4. Platform badge (Instagram) */}
      <span
        className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg backdrop-blur-sm z-20"
        style={{ background: IG_GRADIENT }}
      >
        <FaInstagram size={13} /> {type}
      </span>

      {/* 5. Invisible structural elements to match VideoCard's exact height dynamically */}
      <div className="relative opacity-0 pointer-events-none z-0 flex flex-col flex-1 select-none">
        <div className="relative aspect-video overflow-hidden" />
        <div className="p-5 flex flex-col flex-1">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full" /> 00/00/00
          </p>
          <h3 className="font-bold text-[15px] leading-snug line-clamp-2 min-h-[2.65rem]">
            Placeholder text matching VideoCard's title min-height to compute layout height
          </h3>
          <div className="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-full">
            Placeholder Button
          </div>
        </div>
      </div>
    </a>
  );
}
