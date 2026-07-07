import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { FiPlay, FiExternalLink } from "react-icons/fi";
import { formatVideoDate } from "../../../utils/format";

/** A single YouTube video card -thumbnail, title, publish date, watch button. */
export default function VideoCard({ video }) {
  const { title, thumbnail, videoId, publishedAt } = video;
  const href = `https://www.youtube.com/watch?v=${videoId}`;
  const date = formatVideoDate(publishedAt);
  const [imgOk, setImgOk] = useState(true);

  return (
    <article className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_55px_-18px_rgba(254,68,98,0.4)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="relative aspect-video overflow-hidden bg-[#fbfefb] dark:bg-white/5">
        {thumbnail && imgOk && (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        {/* Cinematic gradient -strengthens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Play indicator */}
        <span className="absolute inset-0 grid place-items-center">

          <a href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative grid place-items-center pointer-events-auto h-10 w-10 rounded-full bg-white/95 text-[var(--accent)] shadow-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">

            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-0 group-hover:opacity-40" />
            <FiPlay className="relative ml-1" size={20} />

          </a>

        </span>

        {/* Platform badge */}
        {/* <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#ff0000] text-white shadow-lg backdrop-blur-sm">
          <FaYoutube size={13} /> YouTube
        </span> */}
      </div>

      <div className="p-5 flex flex-col flex-1">

        <h3 className="font-bold text-[15px] leading-snug text-gray-900 dark:text-white line-clamp-2 min-h-[2.65rem] transition-colors">
          {title}
        </h3>

        <div className="flex justify-between items-center mt-2" >     
             {date && (
          <p className=" inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {date}
          </p>
        )}
          <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch "${title}" on YouTube`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:bg-red-600 hover:text-white hover:ring-red-600 dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:ring-red-600">
          <FaYoutube size={16} /> Watch 
        </a></div>

      
      </div>
    </article>
  );
}
