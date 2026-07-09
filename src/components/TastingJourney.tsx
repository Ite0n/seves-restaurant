"use client";

import Image from "next/image";
import { useRef } from "react";
import SectionHeading from "./ui/SectionHeading";
import { useTastingJourneyPin } from "@/hooks/useGsapScroll";
import { useCinematicScrollMode } from "@/hooks/useCinematicScrollMode";
import { useLocale } from "@/context/LocaleContext";

export default function TastingJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const { t, data } = useLocale();
  const scrollMode = useCinematicScrollMode();

  useTastingJourneyPin(
    containerRef,
    trackRef,
    progressRef,
    cardRefs,
    scrollMode
  );

  const renderCard = (
    course: (typeof data.tastingCourses)[number],
    i: number,
    variant: "strip" | "stack"
  ) => (
    <article
      key={course.chapter}
      data-journey-card
      ref={(el) => {
        cardRefs.current[i] = el;
      }}
      className={`journey-card group relative shrink-0 overflow-hidden rounded-sm bg-ink-800/70 ring-1 ring-gold/12 ${
        variant === "strip"
          ? "w-[min(72vw,20rem)] sm:w-[18.5rem] md:w-[20rem]"
          : "w-full"
      }`}
      data-cursor="hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[5/3]">
        <div
          data-journey-mask
          className="absolute inset-0 overflow-hidden"
        >
          <div
            data-journey-parallax
            className="absolute inset-0 scale-110 will-change-transform"
          >
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes={
                variant === "strip"
                  ? "(max-width: 640px) 72vw, 320px"
                  : "100vw"
              }
              className="object-cover"
              quality={80}
            />
          </div>
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-ink-900 via-ink-900/15 to-transparent" />
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 z-[3] font-display text-[0.6rem] tracking-[0.28em] text-gold/75">
          0{i + 1} · {course.chapter}
        </span>
      </div>
      <div className="relative z-[3] px-5 py-4 sm:px-6 sm:py-5">
        <h3 className="font-serif text-xl text-cream sm:text-2xl">{course.title}</h3>
        <p className="mt-1.5 font-light text-sm leading-relaxed text-cream/55">
          {course.desc}
        </p>
      </div>
    </article>
  );

  return (
    <section
      id="tasting-journey"
      ref={containerRef}
      className="relative overflow-hidden bg-ink-900"
    >
      {scrollMode === "desktop" && (
        <div className="flex min-h-[100svh] flex-col justify-center px-4 py-14 sm:px-6 sm:py-16">
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

          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink-900 to-transparent sm:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink-900 to-transparent sm:w-16" />
            <div
              ref={trackRef}
              className="flex w-max items-stretch gap-4 pr-[18vw] will-change-transform sm:gap-5 sm:pr-[22vw] md:gap-6"
            >
              {data.tastingCourses.map((course, i) =>
                renderCard(course, i, "strip")
              )}
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

      {scrollMode === "mobile" && (
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

            <div className="mt-12 flex flex-col gap-5">
              {data.tastingCourses.map((course, i) =>
                renderCard(course, i, "stack")
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
