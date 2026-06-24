import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { FiPlay, FiExternalLink } from "react-icons/fi";

function formatDate(value) {
  const ts = Date.parse(value);
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

/** A single YouTube video card — thumbnail, title, publish date, watch button. */
export default function VideoCard({ video }) {
  const { title, thumbnail, videoId, publishedAt } = video;
  const href = `https://www.youtube.com/watch?v=${videoId}`;
  const date = formatDate(publishedAt);
  const [imgOk, setImgOk] = useState(true);

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-[#f0e0e3] dark:bg-white/5">
        {thumbnail && imgOk && (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Play indicator */}
        <span className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="grid place-items-center h-14 w-14 rounded-full bg-white/90 text-[#fe4462] shadow-lg scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <FiPlay className="ml-0.5" size={24} />
          </span>
        </span>

        {/* Platform badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ff0000] text-white">
          <FaYoutube size={12} /> YouTube
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#fe4462] transition-colors">
          {title}
        </h3>
        {date && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{date}</p>}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch "${title}" on YouTube`}
          className="mt-4 inline-flex items-center justify-center gap-2 bg-[#fe4462] hover:bg-[#d93550] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <FaYoutube size={16} /> Watch on YouTube <FiExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}
