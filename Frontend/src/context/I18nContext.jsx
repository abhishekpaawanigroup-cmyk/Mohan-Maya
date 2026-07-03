import { createContext, useContext, useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useHooks";
import { LANGUAGES, TRANSLATIONS, DEFAULT_LANG } from "../data/i18n";

const I18nContext = createContext(null);

/**
 * App-wide translation provider. Persists the chosen language to localStorage
 * and exposes `t(key)` for looking up UI strings, with English fallback so a
 * partial translation never renders a blank label.
 */
export function I18nProvider({ children }) {
  const [lang, setLangRaw] = useLocalStorage("mm-lang", DEFAULT_LANG);

  const setLang = useCallback(
    (code) => {
      if (TRANSLATIONS[code]) setLangRaw(code);
    },
    [setLangRaw]
  );

  // Keep the document language in sync (a11y / SEO), on load and on change.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, fallback) => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
      return dict[key] ?? TRANSLATIONS[DEFAULT_LANG][key] ?? fallback ?? key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, languages: LANGUAGES }),
    [lang, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
