"use client";

import { useLocale } from "@/context/LocaleContext";

export default function SeasonalBadge() {
  const { t } = useLocale();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5">
      <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
      <span className="text-[0.6rem] uppercase tracking-luxe text-gold/90">
        {t("season.badge")}
      </span>
    </div>
  );
}
