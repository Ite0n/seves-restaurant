"use client";

import { useRef, useState } from "react";
import CinematicImage from "./ui/CinematicImage";
import { RESTAURANT } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import ExperienceEnquiryModal from "./ExperienceEnquiryModal";
import { useLocale } from "@/context/LocaleContext";
import { useExperiencesScroll } from "@/hooks/useGsapScroll";
import { useCinematicScrollMode } from "@/hooks/useCinematicScrollMode";

export default function Experiences() {
  const { t, data } = useLocale();
  const [enquiry, setEnquiry] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollMode = useCinematicScrollMode();

  useExperiencesScroll(
    scrollContainerRef,
    trackRef,
    progressRef,
    cardRefs,
    scrollMode
  );

  const renderCard = (
    exp: (typeof data.experiences)[number],
    i: number,
    variant: "scroll" | "stack"
  ) => (
    <article
      key={exp.id}
      data-experience-card
      ref={
        variant === "stack"
          ? (el) => {
              cardRefs.current[i] = el;
            }
          : undefined
      }
      className={`experience-showcase group relative flex shrink-0 overflow-hidden rounded-sm bg-ink-900/50 ring-1 ring-gold/12 ${
        variant === "scroll"
          ? "w-[min(88vw,34rem)] flex-col sm:w-[30rem] md:w-[34rem] lg:w-[36rem]"
          : "w-full flex-col"
      }`}
      data-cursor="hover"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <div
          data-experience-veil
          className="pointer-events-none absolute inset-0 z-[5] bg-ink-900"
        />
        <div
          data-experience-mask
          className="absolute inset-0 overflow-hidden"
        >
          <div
            data-experience-parallax
            className="cinematic-frame absolute inset-0 scale-[1.15]"
          >
            <CinematicImage
              src={exp.image}
              alt={exp.title}
              fill
              sizes={
                variant === "scroll"
                  ? "(max-width: 640px) 88vw, 576px"
                  : "100vw"
              }
              loading="lazy"
              grade="vivid"
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-ink-900/20" />
        <div className="absolute inset-x-6 top-0 z-[4] h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
        <span className="absolute left-5 top-5 z-[4] font-display text-[0.65rem] tracking-[0.3em] text-gold/80">
          0{i + 1}
        </span>
      </div>

      <div className="relative z-[4] flex flex-1 flex-col px-6 py-6 sm:px-8 sm:py-7">
        <span className="text-[0.6rem] uppercase tracking-luxe text-gold/75">
          {exp.subtitle}
        </span>
        <h3 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">{exp.title}</h3>
        <p className="mt-3 max-w-xl flex-1 font-light text-sm leading-relaxed text-cream/60">
          {exp.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-5 text-xs uppercase tracking-wide2">
          <span className="text-cream/45">{exp.capacity}</span>
          <span className="font-serif text-lg text-gold">{exp.from}</span>
        </div>
        <button
          type="button"
          onClick={() => setEnquiry({ id: exp.id, title: exp.title })}
          className="mt-5 w-full rounded-full border border-gold/40 py-3 text-[0.65rem] uppercase tracking-luxe text-gold transition-all duration-500 hover:bg-gold hover:text-ink-900 md:max-w-xs"
        >
          {t("experiences.enquire")}
        </button>
      </div>
    </article>
  );

  return (
    <section id="experiences" className="relative overflow-hidden bg-ink-800">
      <SectionAtmosphere />

      {scrollMode === "desktop" && (
        <div ref={scrollContainerRef} className="relative">
          <div className="flex min-h-[100svh] flex-col justify-center px-4 py-14 sm:px-6 lg:px-10">
            <SectionHeading
              label={t("experiences.label")}
              title={
                <>
                  {t("experiences.titlePrefix")}{" "}
                  <span className="gold-gradient">{t("experiences.titleHighlight")}</span>
                </>
              }
              description={t("experiences.description")}
            />

            <div className="relative mt-10 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink-800 to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink-800 to-transparent sm:w-16" />
              <div
                ref={trackRef}
                className="flex items-stretch gap-5 pr-[14vw] will-change-transform sm:gap-6 sm:pr-[16vw] lg:gap-8"
              >
                {data.experiences.map((exp, i) => renderCard(exp, i, "scroll"))}
              </div>
            </div>

            <div className="mt-8 h-px w-full overflow-hidden bg-cream/10">
              <div
                ref={progressRef}
                className="gallery-scroll-progress h-full w-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-100"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            <p className="mt-6 text-center text-xs uppercase tracking-luxe text-cream/40">
              {t("experiences.enquiriesVia")}{" "}
              <a href={`mailto:${RESTAURANT.email}`} className="text-gold hover:text-cream">
                {RESTAURANT.email}
              </a>
            </p>
          </div>
        </div>
      )}

      {scrollMode === "mobile" && (
        <div className="section-pad">
          <div className="relative mx-auto max-w-content px-6">
            <SectionHeading
              label={t("experiences.label")}
              title={
                <>
                  {t("experiences.titlePrefix")}{" "}
                  <span className="gold-gradient">{t("experiences.titleHighlight")}</span>
                </>
              }
              description={t("experiences.description")}
            />

            <div className="mt-12 flex flex-col gap-7">
              {data.experiences.map((exp, i) => renderCard(exp, i, "stack"))}
            </div>

            <Reveal delay={0.15}>
              <p className="mt-14 text-center text-xs uppercase tracking-luxe text-cream/40">
                {t("experiences.enquiriesVia")}{" "}
                <a href={`mailto:${RESTAURANT.email}`} className="text-gold hover:text-cream">
                  {RESTAURANT.email}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      )}

      {enquiry && (
        <ExperienceEnquiryModal
          source="experience"
          sourceId={enquiry.id}
          sourceTitle={enquiry.title}
          open={!!enquiry}
          onClose={() => setEnquiry(null)}
        />
      )}
    </section>
  );
}
