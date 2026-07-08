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
      className={`group relative flex shrink-0 flex-col overflow-hidden rounded-sm bg-ink-900/60 ring-1 ring-gold/12 transition-shadow duration-700 ${
        variant === "scroll"
          ? "experience-card-glow w-[88vw] sm:w-[80vw] md:w-[72vw] lg:w-[64vw]"
          : "experience-card-glow w-full"
      }`}
      data-cursor="hover"
    >
      <div className="relative aspect-[16/10] min-h-[11rem] w-full overflow-hidden sm:min-h-[12rem] md:aspect-[21/10]">
        <div
          data-experience-parallax
          className="cinematic-frame absolute inset-0 scale-110"
        >
          <CinematicImage
            src={exp.image}
            alt={exp.title}
            fill
            sizes={
              variant === "scroll"
                ? "(max-width: 640px) 88vw, (max-width: 1280px) 80vw, 64vw"
                : "100vw"
            }
            loading="lazy"
            grade="vivid"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-ink-900 via-ink-900/25 to-ink-900/10" />
        <div className="img-frame absolute inset-0 z-[3]" />
        <span className="absolute left-5 top-5 z-[4] font-display text-[0.65rem] tracking-[0.3em] text-gold/80 sm:left-6 sm:top-6">
          0{i + 1}
        </span>
      </div>

      <div className="relative z-[4] flex flex-1 flex-col p-6 sm:p-7 md:p-9 lg:p-10">
        <span className="text-[0.6rem] uppercase tracking-luxe text-gold/75">
          {exp.subtitle}
        </span>
        <h3 className="mt-2 font-serif text-2xl text-cream sm:text-3xl md:text-4xl">{exp.title}</h3>
        <p className="mt-4 max-w-2xl flex-1 font-light text-sm leading-relaxed text-cream/60 md:text-base">
          {exp.description}
        </p>
        <div className="mt-8 flex items-center justify-between border-t border-cream/10 pt-6 text-xs uppercase tracking-wide2">
          <span className="text-cream/45">{exp.capacity}</span>
          <span className="font-serif text-lg text-gold">{exp.from}</span>
        </div>
        <button
          type="button"
          onClick={() => setEnquiry({ id: exp.id, title: exp.title })}
          className="mt-6 w-full rounded-full border border-gold/40 py-3.5 text-[0.65rem] uppercase tracking-luxe text-gold transition-all duration-500 hover:bg-gold hover:text-ink-900 md:max-w-xs"
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
          <div className="flex h-[100svh] flex-col justify-center px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
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

            <div className="relative mt-8 h-[54vh] min-h-[18rem] overflow-hidden sm:mt-10 sm:h-[58vh] sm:min-h-[22rem]">
              <div
                ref={trackRef}
                className="flex h-[54vh] min-h-[18rem] items-stretch gap-4 pr-[10vw] will-change-transform sm:h-[58vh] sm:min-h-[22rem] sm:gap-6 sm:pr-[14vw] lg:gap-8"
              >
                {data.experiences.map((exp, i) => renderCard(exp, i, "scroll"))}
              </div>
            </div>

            <div className="mt-6 h-px w-full overflow-hidden bg-cream/10 sm:mt-8">
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

            <div className="mt-14 flex flex-col gap-8">
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
