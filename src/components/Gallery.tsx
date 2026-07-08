"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CinematicImage from "./ui/CinematicImage";
import SectionHeading from "./ui/SectionHeading";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import { useLocale } from "@/context/LocaleContext";
import { useGalleryScroll } from "@/hooks/useGsapScroll";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { EASE_LUXE } from "@/lib/motion";

const PANEL_WIDTHS = [
  "w-[52vw] lg:w-[46vw]",
  "w-[44vw] lg:w-[38vw]",
  "w-[56vw] lg:w-[50vw]",
  "w-[42vw] lg:w-[36vw]",
];

export default function Gallery() {
  const { t, data } = useLocale();
  const gallery = data.gallery;
  const [active, setActive] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { mounted, isDesktop } = useIsDesktop();

  useGalleryScroll(
    scrollContainerRef,
    trackRef,
    progressRef,
    mobileItemRefs,
    mounted ? (isDesktop ? "desktop" : "mobile") : null
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

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-ink-800"
    >
      <SectionAtmosphere />

      {/* Desktop — pinned horizontal cinematic scroll */}
      {mounted && isDesktop && (
      <div
        ref={scrollContainerRef}
        className="relative"
      >
        <div className="flex h-[100svh] flex-col justify-center px-6 py-14 lg:px-10">
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

          <div className="relative mt-10 h-[52vh] min-h-[20rem] overflow-hidden">
            <div
              ref={trackRef}
              className="flex h-[52vh] min-h-[20rem] items-stretch gap-5 pr-[18vw] will-change-transform lg:gap-7"
            >
              {gallery.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  data-gallery-panel
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 ${PANEL_WIDTHS[i % PANEL_WIDTHS.length]} h-[52vh] min-h-[20rem] overflow-hidden rounded-sm ring-1 ring-gold/15 transition-shadow duration-700 hover:ring-gold/40 hover:shadow-[0_40px_100px_-30px_rgba(201,169,106,0.35)]`}
                  aria-label={`${t("gallery.view")}: ${item.alt}`}
                  data-cursor="hover"
                >
                  <div
                    data-gallery-parallax
                    className="cinematic-frame absolute inset-0 scale-110"
                  >
                    <CinematicImage
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1200px) 55vw, 46vw"
                      loading="lazy"
                      grade="vivid"
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 z-[4] bg-gradient-to-t from-ink-900/90 via-ink-900/15 to-ink-900/25" />
                  <div className="absolute inset-x-0 top-0 z-[5] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <span className="absolute left-5 top-5 z-[6] font-display text-[0.7rem] tracking-[0.32em] text-cream/40 transition-colors duration-500 group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 z-[6] p-6 lg:p-8">
                    <span className="block max-w-sm translate-y-3 text-left text-[0.65rem] uppercase tracking-wide2 text-cream/0 transition-all duration-700 group-hover:translate-y-0 group-hover:text-cream/90">
                      {item.alt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-px w-full overflow-hidden bg-cream/10">
            <div
              ref={progressRef}
              className="gallery-scroll-progress h-full w-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-100"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
      )}

      {/* Mobile — vertical stack with scroll reveals */}
      {mounted && !isDesktop && (
      <div className="section-pad">
        <div className="relative mx-auto max-w-7xl px-6">
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

          <div className="mt-12 flex flex-col gap-4">
            {gallery.map((item, i) => (
              <button
                key={item.src}
                type="button"
                ref={(el) => {
                  mobileItemRefs.current[i] = el;
                }}
                onClick={() => setActive(i)}
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1 ring-gold/15"
                aria-label={`${t("gallery.view")}: ${item.alt}`}
              >
                <div
                  data-gallery-parallax
                  className="cinematic-frame absolute inset-0 will-change-transform"
                >
                  <CinematicImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="100vw"
                    loading="lazy"
                    grade="vivid"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-transparent" />
                <span className="absolute left-4 top-4 font-display text-[0.65rem] tracking-[0.28em] text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="absolute bottom-0 left-0 right-0 p-5 text-left text-xs uppercase tracking-wide2 text-cream/80">
                  {item.alt}
                </p>
              </button>
            ))}
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
              className="cinematic-frame relative h-[82vh] w-full max-w-6xl overflow-hidden rounded-sm ring-1 ring-gold/25"
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
                sizes="(max-width: 768px) 100vw, 90vw"
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
