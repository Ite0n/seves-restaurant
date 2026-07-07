"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EXPERIENCES } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { EASE_LUXE, fadeUp } from "@/lib/motion";

export default function Experiences() {
  return (
    <section id="experiences" className="relative bg-ink-800 section-pad">
      <div className="absolute inset-0 grain opacity-40" />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          label="Private & Events"
          title={
            <>
              Beyond the <span className="gold-gradient">table</span>
            </>
          }
          description="Intimate salons, chef's table evenings, and terrace celebrations — each composed for your occasion."
        />

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <motion.article
              key={exp.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 1, ease: EASE_LUXE }}
              className="group relative flex flex-col overflow-hidden rounded-sm bg-ink-900/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                <div className="img-frame absolute inset-0" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <span className="text-[0.6rem] uppercase tracking-luxe text-gold/70">
                  {exp.subtitle}
                </span>
                <h3 className="mt-2 font-serif text-2xl text-cream">{exp.title}</h3>
                <p className="mt-3 flex-1 font-light text-sm leading-relaxed text-cream/55">
                  {exp.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-5 text-xs uppercase tracking-wide2">
                  <span className="text-cream/45">{exp.capacity}</span>
                  <span className="text-gold">{exp.from}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-14 text-center text-xs uppercase tracking-luxe text-cream/40">
            Enquiries via{" "}
            <a href="mailto:reserve@seves.restaurant" className="text-gold hover:text-cream">
              reserve@seves.restaurant
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
