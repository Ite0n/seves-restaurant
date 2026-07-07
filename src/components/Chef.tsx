"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CHEF } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { fadeUp, slideInRight } from "@/lib/motion";

export default function Chef() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="chef"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 section-pad"
    >
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/[0.04] blur-[140px]" />

      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          label="The Chef"
          title={
            <>
              Meet <span className="gold-gradient">{CHEF.shortName}</span>
            </>
          }
          description={CHEF.quote}
        />

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
          >
            <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
              <Image
                src={CHEF.portrait}
                alt={CHEF.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                quality={80}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            <div className="img-frame absolute inset-0" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-xs uppercase tracking-luxe text-gold/80">
                {CHEF.title}
              </p>
              <p className="mt-1 font-serif text-2xl text-cream">{CHEF.name}</p>
            </div>
          </motion.div>

          <div>
            {CHEF.bio.map((para, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="font-light leading-relaxed text-cream/65 first:mt-0 mt-6">
                  {para}
                </p>
              </Reveal>
            ))}

            <motion.ul
              variants={slideInRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-12 space-y-4 border-t border-cream/10 pt-8"
            >
              {CHEF.accolades.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-4 text-sm font-light text-cream/70"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {a}
                </li>
              ))}
            </motion.ul>

            <Reveal delay={0.2}>
              <a href="#reservation" className="btn-outline mt-10 inline-block">
                Dine at the Chef&apos;s Table
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
