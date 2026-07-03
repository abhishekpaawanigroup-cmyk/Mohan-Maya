import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGlobe, FiChevronDown, FiCheck } from "react-icons/fi";
import { useClickOutside } from "../../hooks/useHooks";
import { useI18n } from "../../context/I18nContext";

/**
 * Globe language switcher for the top bar. Selection persists (localStorage via
 * the i18n provider) and re-renders every `t()` consumer instantly.
 */
export default function LanguageSelector({ actionCls = "" }) {
  const { lang, setLang, languages, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const active = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("topbar.language")}
        className={actionCls}
      >
        <FiGlobe size={13} className="text-[#fe4462]" />
        <span className="max-w-[72px] truncate">{active.native}</span>
        <FiChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t("topbar.language")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl bg-white py-1 text-gray-700 shadow-xl ring-1 ring-black/5 dark:bg-[#1a0a0e] dark:text-gray-200 dark:ring-white/10"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                role="menuitemradio"
                aria-checked={l.code === lang}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs transition hover:bg-[#fe4462]/10"
              >
                <span><span className="font-semibold">{l.native}</span> <span className="text-gray-400">· {l.label}</span></span>
                {l.code === lang && <FiCheck size={14} className="shrink-0 text-[#fe4462]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
