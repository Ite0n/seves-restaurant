"use client";

import { useState } from "react";
import { RESTAURANT, NAV_LINKS } from "@/lib/data";
import Logo from "./ui/Logo";
import { useLocale } from "@/context/LocaleContext";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      trackEvent("newsletter_subscribe");
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-gold/10 bg-ink-900 pt-20">
      <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[28vw] leading-none text-cream/[0.025] md:text-[18vw]">
        SÈVES
      </div>

      <div className="relative mx-auto max-w-content px-6">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a href="#top" className="inline-block text-gold transition-opacity hover:opacity-80" aria-label="Back to top">
              <Logo />
            </a>
            <p className="mt-6 max-w-xs font-serif text-xl font-light italic text-cream/70">
              {t("restaurant.tagline")}
            </p>
            <p className="mt-4 text-sm font-light text-cream/45">{t("restaurant.descriptor")}</p>
          </div>

          <div>
            <h4 className="text-[0.6rem] uppercase tracking-luxe text-gold/70">{t("footer.explore")}</h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                  >
                    {t(l.i18nKey)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#reservation"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  {t("footer.reservations")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  {t("footer.faq")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[0.6rem] uppercase tracking-luxe text-gold/70">{t("footer.connect")}</h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={RESTAURANT.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${RESTAURANT.email}`}
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  {RESTAURANT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[0.6rem] uppercase tracking-luxe text-gold/70">{t("footer.journal")}</h4>
            <p className="mt-5 text-sm font-light text-cream/50">
              {t("footer.journalDesc")}
            </p>
            {subscribed ? (
              <p className="mt-4 text-sm text-gold">{t("footer.thanks")}</p>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.emailPlaceholder")}
                  className="flex-1 border-b border-cream/20 bg-transparent pb-2 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="shrink-0 text-xs uppercase tracking-luxe text-gold hover:text-cream"
                >
                  {t("footer.join")}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-8 text-center md:flex-row md:text-left">
          <p className="text-xs font-light text-cream/40">
            © {new Date().getFullYear()} {RESTAURANT.name}. {t("footer.rights")}
          </p>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <a
              href="/privacy"
              className="text-xs font-light text-cream/40 transition-colors hover:text-gold"
            >
              {t("footer.privacy")}
            </a>
            <p className="text-xs font-light text-cream/40">
              {RESTAURANT.city}, {RESTAURANT.country} · {t("footer.crafted")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
