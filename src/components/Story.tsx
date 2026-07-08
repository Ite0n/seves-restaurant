"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { STORY_IMAGES } from "@/lib/locale-data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useLocale } from "@/context/LocaleContext";
import { fadeUp } from "@/lib/motion";

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, data } = useLocale();
  const story = data.story;
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
              label={t("story.label")}
              title={
                <>
                  {t("story.titlePrefix")}
                  <br />
                  <span className="gold-gradient">{t("story.titleHighlight")}</span>
                </>
              }
            />
            {story.paragraphs.map((para, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className={`max-w-md font-light leading-relaxed text-cream/65 ${i === 0 ? "mt-7" : "mt-5"}`}>
                  {para}
                </p>
              </Reveal>
            ))}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-cream/10 pt-8"
            >
              {story.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-3xl text-gold md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-[0.6rem] uppercase tracking-wide2 text-cream/45">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <ul className="mt-14 space-y-6 border-t border-cream/10 pt-10">
              {story.timeline.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.08}>
                  <li className="flex gap-6">
                    <span className="shrink-0 font-display text-sm tracking-wide2 text-gold">
                      {item.year}
                    </span>
                    <p className="font-light text-cream/60">{item.event}</p>
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
