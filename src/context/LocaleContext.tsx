"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Locale, t as translate, getValidationMessages } from "@/lib/i18n";
import { getLocaleData, type LocaleData } from "@/lib/locale-data";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  data: LocaleData;
  validationMessages: ReturnType<typeof getValidationMessages>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    queueMicrotask(() => {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      if (fromUrl === "en" || fromUrl === "fr") {
        setLocaleState(fromUrl);
        return;
      }

      const saved = localStorage.getItem("seves-locale");
      if (saved === "en" || saved === "fr") {
        setLocaleState(saved);
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("seves-locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = "ltr";
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => translate(locale, key, vars),
    [locale]
  );

  const data = useMemo(() => getLocaleData(locale), [locale]);
  const validationMessages = useMemo(() => getValidationMessages(locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, data, validationMessages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
