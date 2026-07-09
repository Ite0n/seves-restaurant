"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CinematicImage from "./ui/CinematicImage";
import SectionHeading from "./ui/SectionHeading";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import { useLocale } from "@/context/LocaleContext";
import { useGalleryScroll } from "@/hooks/useGsapScroll";
import { useCinematicScrollMode } from "@/hooks/useCinematicScrollMode";
import { EASE_LUXE } from "@/lib/motion";

/** Compact editorial frames — varied size, not full-bleed panels. */
const FRAMES = [
  { width: "w-[9.25rem] sm:w-[11rem] md:w-[12.5rem]", aspect: "aspect-[3/4]", lift: "translate-y-5" },
  { width: "w-[7.75rem] sm:w-[9.5rem] md:w-[10.5rem]", aspect: "aspect-square", lift: "-translate-y-3" },
  { width: "w-[10.25rem] sm:w-[12rem] md:w-[14rem]", aspect: "aspect-[5/4]", lift: "translate-y-8" },
  { width: "w-[8.25rem] sm:w-[10rem] md:w-[11rem]", aspect: "aspect-[4/5]", lift: "-translate-y-5" },
] as const;

export default function Gallery() {
  const { t, data } = useLocale();
  const gallery = data.gallery;
  const [active, setActive] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const scrollMode = useCinematicScrollMode();

  useGalleryScroll(
    scrollContainerRef,
    trackRef,
    progressRef,
    mobileItemRefs,
    scrollMode
  );

  const next = useCallback(() => {
    setActive((idx) =>
      idx !== null && idx < gallery.length - 1 ? idx + 1 : 0
    );
  }, [gallery.length]);

  const prev = useCallback(() => {
    setActive((idx) =>
      idx !== null && idx > 0 ? idx - 1 : gallery.length - 1
    );
  }, [gallery.length]);

  useEffect(() => {
    if (active === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev]);

  const touchStartX = useRef(0);

  const renderFrame = (
    item: (typeof gallery)[number],
    i: number,
    variant: "strip" | "grid"
  ) => {
    const frame = FRAMES[i % FRAMES.length];

    return (
      <button
        key={item.src}
        type="button"
        data-gallery-panel
        ref={
          variant === "grid"
            ? (el) => {
                mobileItemRefs.current[i] = el;
              }
            : undefined
        }
        onClick={() => setActive(i)}
        className={`gallery-frame group relative shrink-0 overflow-hidden rounded-sm ring-1 ring-gold/10 transition-shadow duration-500 hover:shadow-[0_28px_70px_-24px_rgba(201,169,106,0.35)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold/50 ${
          variant === "strip"
            ? `${frame.width} ${frame.aspect} ${frame.lift}`
            : `${frame.aspect} w-full`
        }`}
        aria-label={`${t("gallery.view")}: ${item.alt}`}
        data-cursor="hover"
      >
        <div data-gallery-float className="absolute inset-0">
          <div
            data-gallery-parallax
            className="cinematic-frame absolute inset-0 scale-[1.12]"
          >
            <CinematicImage
              src={item.src}
              alt={item.alt}
              fill
              sizes={
                variant === "strip"
                  ? "(max-width: 640px) 148px, 200px"
                  : "(max-width: 640px) 45vw, 220px"
              }
              loading="lazy"
              grade="vivid"
              className="object-cover ken-burns"
            />
          </div>
        </div>

        <div className="absolute inset-0 z-[6] bg-gradient-to-t from-ink-900/75 via-transparent to-ink-900/10" />

        <span className="absolute left-2.5 top-2.5 z-[7] font-display text-[0.55rem] tracking-[0.26em] text-cream/35 transition-colors duration-500 group-hover:text-gold sm:text-[0.6rem]">
          {String(i + 1).padStart(2, "0")}
        </span>

        <span className="absolute bottom-0 left-0 right-0 z-[7] px-2.5 pb-2.5 pt-6 text-left text-[0.55rem] uppercase leading-snug tracking-wide2 text-cream/0 transition-all duration-500 group-hover:text-cream/85 sm:text-[0.6rem]">
          {item.alt}
        </span>
      </button>
    );
  };

  return (
    <section id="gallery" className="relative overflow-hidden bg-ink-800">
      <SectionAtmosphere />

      {scrollMode === "desktop" && (
        <div ref={scrollContainerRef} className="relative">
          <div className="flex min-h-[100svh] flex-col justify-center px-4 py-14 sm:px-6 lg:px-10">
            <SectionHeading
              label={t("gallery.label")}
              title={
                <>
                  {t("gallery.titlePrefix")}{" "}
                  <span className="gold-gradient">{t("gallery.titleHighlight")}</span>
                </>
              }
              description={t("gallery.description")}
            />

            <div className="relative mt-10 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ink-800 to-transparent sm:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink-800 to-transparent sm:w-20" />

              <div
                ref={trackRef}
                className="flex min-h-[min(38vh,17.5rem)] items-center gap-3 py-4 pr-[28vw] will-change-transform sm:min-h-[min(42vh,20rem)] sm:gap-4 md:gap-5 lg:gap-6"
              >
                {gallery.map((item, i) => renderFrame(item, i, "strip"))}
              </div>
            </div>

            <p className="mt-6 text-center text-[0.6rem] uppercase tracking-luxe text-cream/35">
              {t("gallery.view")} · scroll
            </p>

            <div className="mx-auto mt-5 h-px w-full max-w-md overflow-hidden bg-cream/10">
              <div
                ref={progressRef}
                className="gallery-scroll-progress h-full w-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-100"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      )}

      {scrollMode === "mobile" && (
        <div className="section-pad">
          <div className="relative mx-auto max-w-lg px-6">
            <SectionHeading
              label={t("gallery.label")}
              title={
                <>
                  {t("gallery.titlePrefix")}{" "}
                  <span className="gold-gradient">{t("gallery.titleHighlight")}</span>
                </>
              }
              description={t("gallery.description")}
            />

            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4">
              {gallery.map((item, i) => renderFrame(item, i, "grid"))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/96 p-4 backdrop-blur-xl md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={t("gallery.lightbox")}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 z-10 text-xs uppercase tracking-luxe text-cream/60 hover:text-gold"
            >
              {t("gallery.close")}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full glass p-3 text-cream/70 hover:text-gold md:left-6"
              aria-label={t("gallery.prev")}
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full glass p-3 text-cream/70 hover:text-gold md:right-6"
              aria-label={t("gallery.next")}
            >
              →
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease: EASE_LUXE }}
              className="cinematic-frame relative h-[min(78vh,42rem)] w-full max-w-4xl overflow-hidden rounded-sm ring-1 ring-gold/25"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 50) {
                  if (dx < 0) next();
                  else prev();
                }
              }}
            >
              <CinematicImage
                src={gallery[active].src}
                alt={gallery[active].alt}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                grade="vivid"
                quality={85}
                className="object-contain"
              />
              <p className="absolute bottom-0 left-0 right-0 z-[5] bg-gradient-to-t from-ink-900/95 to-transparent p-6 text-center text-sm text-cream/80">
                {gallery[active].alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
