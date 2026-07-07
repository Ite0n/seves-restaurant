"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { STORY_IMAGES } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { fadeUp } from "@/lib/motion";

const STATS = [
  { value: "2019", label: "Established" },
  { value: "14", label: "Course tasting" },
  { value: "1", label: "Open kitchen" },
];

const TIMELINE = [
  { year: "2019", event: "Sèves opens on Bayeh — a garden terrace dream realised." },
  { year: "2021", event: "The grand dining room unveils beneath cascading light." },
  { year: "2023", event: "Chef's table and private salon launch for intimate gatherings." },
  { year: "2025", event: "Recognised among the world's most exciting fine-dining rooms." },
];

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section id="story" ref={ref} className="relative bg-ink-900 section-pad">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-24">
          <div className="relative h-[440px] lg:h-[680px]">
            <motion.div
              style={{ y: y1 }}
              className="absolute left-0 top-0 h-[68%] w-[70%] overflow-hidden rounded-sm"
            >
              <Image
                src={STORY_IMAGES.team}
                alt="The Sèves kitchen brigade"
                fill
                sizes="40vw"
                className="object-cover"
                quality={78}
              />
              <div className="img-frame absolute inset-0" />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              className="absolute bottom-0 right-0 h-[55%] w-[58%] overflow-hidden rounded-sm shadow-2xl shadow-black/50"
            >
              <Image
                src={STORY_IMAGES.ambience}
                alt="Table setting at Sèves"
                fill
                sizes="35vw"
                className="object-cover"
                quality={78}
              />
              <div className="img-frame absolute inset-0" />
            </motion.div>
            <motion.div
              style={{ y: y1 }}
              className="absolute -bottom-4 left-1/2 h-28 w-28 -translate-x-1/2 overflow-hidden rounded-full border-2 border-gold/30"
            >
              <Image
                src={STORY_IMAGES.plateArt}
                alt="Artful plating at Sèves"
                fill
                sizes="112px"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div>
            <SectionHeading
              align="left"
              label="Our Story"
              title={
                <>
                  The pursuit of the
                  <br />
                  <span className="gold-gradient">perfect plate</span>
                </>
              }
            />
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-md font-light leading-relaxed text-cream/65">
                Sèves — French for the lifeblood that rises through every living
                thing — is our devotion to the seasons. Our brigade sources from
                local growers and the morning catch, then composes each plate with
                the patience of an atelier.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-md font-light leading-relaxed text-cream/65">
                Beneath cascading light, between fire and water, we set a stage
                where dining becomes a quiet performance.
              </p>
            </Reveal>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-cream/10 pt-8"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-3xl text-gold md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-[0.6rem] uppercase tracking-wide2 text-cream/45">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <ul className="mt-14 space-y-6 border-t border-cream/10 pt-10">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.08}>
                  <li className="flex gap-6">
                    <span className="shrink-0 font-display text-sm tracking-wide2 text-gold">
                      {t.year}
                    </span>
                    <p className="font-light text-cream/60">{t.event}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
