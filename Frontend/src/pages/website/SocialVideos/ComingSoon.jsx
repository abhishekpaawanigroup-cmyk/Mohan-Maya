import { FiExternalLink } from "react-icons/fi";

/** Professional placeholder shown for platforms whose API isn't connected yet. */
export default function ComingSoon({ platform }) {
  const { label, Icon, color, href } = platform;
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden text-center py-14 sm:py-16 px-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.3)]">
      {/* Brand-tinted decorative glows */}
      <span
        className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: `${color}40` }}
      />
      <span
        className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: `${color}33` }}
      />

      <div className="relative">
        <span
          className="mx-auto grid place-items-center h-20 w-20 rounded-3xl mb-6 shadow-lg"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <Icon size={38} />
        </span>
        <span
          className="inline-block text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1.5 mb-5"
          style={{ color, backgroundColor: `${color}1a` }}
        >
          ✦ Coming Soon
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {label} Content Is On Its Way
        </h3>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
          We're putting the finishing touches on our {label} integration. Soon you'll
          see our latest {label} posts right here. Until then, follow along directly.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          style={{ backgroundColor: color }}
        >
          <Icon size={18} /> Visit our {label} <FiExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
