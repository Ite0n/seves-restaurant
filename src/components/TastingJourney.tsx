"use client";

import Image from "next/image";
import { useRef } from "react";
import SectionHeading from "./ui/SectionHeading";
import { useTastingJourneyPin } from "@/hooks/useGsapScroll";
import { useLocale } from "@/context/LocaleContext";
import { useIsDesktop } from "@/hooks/useIsDesktop";

export default function TastingJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const { t, data } = useLocale();
  const { mounted, isDesktop } = useIsDesktop();

  useTastingJourneyPin(
    containerRef,
    trackRef,
    progressRef,
    cardRefs,
    mounted ? (isDesktop ? "desktop" : "mobile") : null
  );

  return (
    <section
      id="tasting-journey"
      ref={containerRef}
      className="relative overflow-hidden bg-ink-900"
      style={{ perspective: "1200px" }}
    >
      {/* Desktop — pinned cinematic horizontal journey */}
      {mounted && isDesktop && (
        <div className="flex h-[100svh] flex-col justify-center px-6 py-16">
          <SectionHeading
            align="left"
            label={t("tasting.label")}
            title={
              <>
                {t("tasting.titlePrefix")}{" "}
                <span className="gold-gradient">{data.tastingMenu.title}</span>
              </>
            }
            description={t("tasting.description")}
          />

          <div className="mt-12 overflow-hidden">
            <div
              ref={trackRef}
              className="flex w-max gap-7 pr-[20vw] will-change-transform [transform-style:preserve-3d]"
            >
              {data.tastingCourses.map((course, i) => (
                <article
                  key={course.chapter}
                  data-journey-card
                  className="relative w-[min(380px,72vw)] shrink-0 overflow-hidden rounded-sm bg-ink-800/80 ring-1 ring-gold/12"
                  data-cursor="hover"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <div
                      data-journey-parallax
                      className="absolute inset-0 scale-110 will-change-transform"
                    >
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="380px"
                        className="object-cover"
                        quality={82}
                      />
                    </div>
                    <div className="absolute inset-0 z-[2] bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                    <span className="absolute left-5 top-5 z-[3] font-display text-[0.65rem] tracking-[0.3em] text-gold/80">
                      0{i + 1} · {course.chapter}
                    </span>
                  </div>
                  <div className="relative z-[3] p-6">
                    <h3 className="font-serif text-2xl text-cream">{course.title}</h3>
                    <p className="mt-2 font-light text-sm leading-relaxed text-cream/55">
                      {course.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 h-px w-full overflow-hidden bg-cream/10">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-100"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      )}

      {/* Mobile — vertical reveals with photo parallax */}
      {mounted && !isDesktop && (
        <div className="section-pad">
          <div className="relative mx-auto max-w-content px-6">
            <SectionHeading
              align="left"
              label={t("tasting.label")}
              title={
                <>
                  {t("tasting.titlePrefix")}{" "}
                  <span className="gold-gradient">{data.tastingMenu.title}</span>
                </>
              }
              description={t("tasting.description")}
            />

            <div className="mt-12 flex flex-col gap-6">
              {data.tastingCourses.map((course, i) => (
                <article
                  key={course.chapter}
                  data-journey-card
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="relative overflow-hidden rounded-sm bg-ink-800/80 ring-1 ring-gold/12"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div
                      data-journey-parallax
                      className="absolute inset-0 will-change-transform"
                    >
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        quality={80}
                      />
                    </div>
                    <div className="absolute inset-0 z-[2] bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent" />
                    <span className="absolute left-5 top-5 z-[3] font-display text-[0.65rem] tracking-[0.3em] text-gold/80">
                      0{i + 1} · {course.chapter}
                    </span>
                  </div>
                  <div className="relative z-[3] p-6">
                    <h3 className="font-serif text-2xl text-cream">{course.title}</h3>
                    <p className="mt-2 font-light text-sm leading-relaxed text-cream/55">
                      {course.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
