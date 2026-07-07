"use client";

import { LOCALES } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 rounded-full border border-cream/15 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          className={`rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-wide transition-colors ${
            locale === l.code
              ? "bg-gold text-ink-900"
              : "text-cream/50 hover:text-cream"
          }`}
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
