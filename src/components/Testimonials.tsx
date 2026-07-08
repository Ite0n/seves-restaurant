"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import { useLocale } from "@/context/LocaleContext";
import { useIsLargeScreen } from "@/hooks/useIsDesktop";
import { EASE_LUXE } from "@/lib/motion";

export default function Testimonials() {
  const { t, data } = useLocale();
  const { mounted, isLarge } = useIsLargeScreen();
  const testimonials = data.testimonials;
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next]);

  const item = testimonials[index];

  return (
    <section id="testimonials" className="relative overflow-hidden bg-ink-900 section-pad">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[140px]" />

      <div className="relative mx-auto max-w-content px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {mounted && isLarge && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/images/interior-pendant-room.webp"
              alt="Sèves dining room"
              fill
              sizes="40vw"
              className="object-cover"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
            <div className="img-frame absolute inset-0" />
          </div>
          )}

          <div className="text-center lg:text-left">
            <SectionHeading
              align="left"
              label={t("testimonials.label")}
              title={
                <>
                  {t("testimonials.titlePrefix")}{" "}
                  <span className="gold-gradient">{t("testimonials.titleHighlight")}</span>
                </>
              }
            />

            <div className="relative mt-12 min-h-[240px]">
              <span
                className="pointer-events-none absolute -left-2 top-0 font-serif text-[8rem] leading-none text-gold/10 lg:-left-8"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: EASE_LUXE }}
                  className="relative"
                >
                  <p className="font-serif text-2xl font-light italic leading-relaxed text-cream/90 md:text-3xl lg:text-4xl">
                    {item.quote}
                  </p>
                  <footer className="mt-9">
                    <div className="font-display tracking-wide2 text-gold">{item.author}</div>
                    <div className="mt-1 text-[0.65rem] uppercase tracking-wide2 text-cream/45">
                      {item.role}
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <button
                onClick={prev}
                aria-label={t("testimonials.prev")}
                className="rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/60 transition-colors hover:border-gold hover:text-gold"
              >
                {t("testimonials.prev")}
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`${t("testimonials.label")} ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: i === index ? 28 : 8,
                      background: i === index ? "#c9a96a" : "rgba(243,236,225,0.25)",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label={t("testimonials.next")}
                className="rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/60 transition-colors hover:border-gold hover:text-gold"
              >
                {t("testimonials.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
