import { FiExternalLink } from "react-icons/fi";

/** Professional placeholder shown for platforms whose API isn't connected yet. */
export default function ComingSoon({ platform }) {
  const { label, Icon, color, href } = platform;
  return (
    <div className="text-center py-16 sm:py-20">
      <span
        className="mx-auto grid place-items-center h-16 w-16 rounded-2xl mb-6"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        <Icon size={30} />
      </span>
      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#fe4462] border border-[#fe4462] rounded-full px-3 py-1 mb-4">
        Coming Soon
      </span>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        {label} Content Is On Its Way
      </h3>
      <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        We're putting the finishing touches on our {label} integration. Soon you'll
        see our latest {label} posts right here. Until then, follow along directly.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 bg-[#fe4462] text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:bg-[#d93550] transition-colors"
      >
        <Icon size={18} /> Visit our {label} <FiExternalLink size={14} />
      </a>
    </div>
  );
}
