"use client";

import Image from "next/image";
import { useRef } from "react";
import { TASTING_COURSES, TASTING_MENU } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { useTastingJourneyPin } from "@/hooks/useGsapScroll";

export default function TastingJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useTastingJourneyPin(containerRef, trackRef);

  return (
    <section
      id="tasting-journey"
      ref={containerRef}
      className="relative overflow-hidden bg-ink-900"
    >
      <div className="flex h-[100svh] flex-col justify-center px-6 py-16">
        <SectionHeading
          align="left"
          label="The Journey"
          title={
            <>
              {TASTING_MENU.courses} courses ·{" "}
              <span className="gold-gradient">{TASTING_MENU.title}</span>
            </>
          }
          description="Scroll through the choreographed progression — from garden to fire, cellar to sweet."
        />

        <div className="mt-12 overflow-hidden">
          <div ref={trackRef} className="flex w-max gap-6 pr-[20vw]">
            {TASTING_COURSES.map((course, i) => (
              <article
                key={course.chapter}
                className="relative w-[72vw] shrink-0 overflow-hidden rounded-sm bg-ink-800/80 md:w-[380px]"
                data-cursor="hover"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="380px"
                    className="object-cover"
                    quality={78}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                  <span className="absolute left-5 top-5 font-display text-[0.65rem] tracking-[0.3em] text-gold/80">
                    0{i + 1} · {course.chapter}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-cream">{course.title}</h3>
                  <p className="mt-2 font-light text-sm leading-relaxed text-cream/55">
                    {course.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-cream/10">
          <div className="h-full w-1/6 bg-gradient-to-r from-gold-600 to-gold-200" />
        </div>
      </div>
    </section>
  );
}
