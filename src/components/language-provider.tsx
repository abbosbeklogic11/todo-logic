"use client";

import * as React from "react";
import { translations, type Lang } from "@/lib/i18n/translations";

const LANG_KEY = "todo-logic-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("uz");

  React.useEffect(() => {
    const stored = (localStorage.getItem(LANG_KEY) as Lang | null) ?? "uz";
    setLangState(stored);
    document.documentElement.lang = stored;
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next;
    setLangState(next);
  }, []);

  const t = React.useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let str = translations[lang]?.[key] ?? translations.uz[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replaceAll(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
