import { useState } from "react";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { FiPlay, FiExternalLink, FiClock } from "react-icons/fi";
import { formatVideoDate } from "../../../utils/format";

/**
 * Hero treatment for the channel's most recent upload. Large split layout —
 * a prominent thumbnail beside the title / meta / watch CTA — with a pulsing
 * "Latest Video" badge so it clearly stands out from the grid below.
 */
export default function FeaturedVideo({ video }) {
  const { title, thumbnail, videoId, publishedAt } = video;
  const href = `https://www.youtube.com/watch?v=${videoId}`;
  const date = formatVideoDate(publishedAt);
  const [imgOk, setImgOk] = useState(true);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_70px_-30px_rgba(254,68,98,0.45)]"
    >
      {/* ── Thumbnail ── */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch the latest video "${title}" on YouTube`}
        className="relative block aspect-video lg:aspect-auto overflow-hidden bg-[#f0e0e3] dark:bg-white/5"
      >
        {thumbnail && imgOk && (
          <img
            src={thumbnail}
            alt={title}
            loading="eager"
            decoding="async"
            onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />

        {/* Play indicator */}
        <span className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="relative grid place-items-center h-20 w-20 rounded-full bg-white/95 text-[#fe4462] shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-40" />
            <FiPlay className="relative ml-1.5" size={34} />
          </span>
        </span>

        {/* Latest badge with live pulse */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fe4462] text-white text-xs font-bold uppercase tracking-wide shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Latest Video
        </span>

        {/* Platform badge */}
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#ff0000] text-white shadow-lg">
          <FaYoutube size={13} /> YouTube
        </span>
      </a>

      {/* ── Content ── */}
      <div className="relative flex flex-col justify-center p-7 sm:p-9 lg:p-11">
        {/* Decorative accent */}
        <span className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#fe4462]/10 blur-3xl" />

        <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-[#fe4462]/30 bg-[#fe4462]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#fe4462]">
         Recently Uploaded
        </span>

        <h3 className="relative mt-5 text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-tight text-gray-900 dark:text-white line-clamp-3 group-hover:text-[#fe4462] transition-colors">
          {title}
        </h3>

        {date && (
          <p className="relative mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <FiClock size={15} className="text-[#fe4462]" /> Published {date}
          </p>
        )}

        <div className="relative mt-7">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#fe4462] to-[#d93550] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-[#fe4462]/30 hover:shadow-xl hover:shadow-[#fe4462]/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaYoutube size={20} /> Watch Now <FiExternalLink size={15} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}


