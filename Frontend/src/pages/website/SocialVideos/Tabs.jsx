import { motion } from "framer-motion";

/** Premium segmented platform tabs (YouTube / Instagram / Facebook). */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Social platforms"
        className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)]"
      >
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(key)}
              className={`relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                isActive
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-[var(--accent)]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabPill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] shadow-md shadow-[var(--ring)]"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={16} /> {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
