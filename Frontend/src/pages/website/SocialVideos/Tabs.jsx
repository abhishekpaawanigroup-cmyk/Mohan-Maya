/** Segmented platform tabs (YouTube / Instagram / Facebook). */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" aria-label="Social platforms" className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {tabs.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "bg-[#fe4462] text-white shadow-md"
                : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[#fe4462] hover:text-[#fe4462]"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        );
      })}
    </div>
  );
}
