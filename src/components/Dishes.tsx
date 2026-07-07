"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { SIGNATURE_DISHES, type Dish } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { fadeUp, maskReveal } from "@/lib/motion";

function DishRow({ dish, index }: { dish: Dish; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const reverse = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 md:grid-cols-2 md:gap-20 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      <motion.div
        variants={maskReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-sm [direction:ltr]"
        data-cursor="hover"
      >
        <motion.div style={{ y }} className="absolute inset-[-10%]">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            quality={80}
            priority={index === 0}
            loading={index < 2 ? "eager" : "lazy"}
          />
        </motion.div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-wrap items-end gap-2 bg-ink-900/60 p-6 backdrop-blur-[2px]"
            >
              {dish.ingredients.map((ing, i) => (
                <motion.span
                  key={ing}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[0.6rem] uppercase tracking-wide2 text-gold"
                >
                  {ing}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="img-frame absolute inset-0" />
        <span className="absolute left-5 top-5 rounded-full glass px-4 py-1.5 text-[0.6rem] uppercase tracking-luxe text-gold">
          {dish.tag}
        </span>
        <span className="absolute bottom-5 right-5 font-display text-6xl text-cream/10">
          0{index + 1}
        </span>
      </motion.div>

      <div className="[direction:ltr]">
        <Reveal variants={fadeUp}>
          <span className="font-display text-sm tracking-wide2 text-gold/70">
            Signature · 0{index + 1}
          </span>
          <h3 className="mt-3 font-serif text-4xl text-cream md:text-5xl lg:text-6xl">
            {dish.name}
          </h3>
          <p className="mt-5 max-w-md font-light leading-relaxed text-cream/65">
            {dish.blurb}
          </p>
          <div className="mt-8 flex items-center gap-5">
            <span className="font-serif text-3xl text-gold">${dish.price}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function Dishes() {
  return (
    <section id="dishes" className="relative bg-ink-900 section-pad">
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          label="Signature Plates"
          title={
            <>
              Compositions from the <span className="gold-gradient">kitchen</span>
            </>
          }
          description="Seasonal, sculptural, and quietly daring — each dish is plated to be admired before it is savoured."
        />

        <div className="mt-28 flex flex-col gap-28 md:gap-40">
          {SIGNATURE_DISHES.map((dish, i) => (
            <DishRow key={dish.name} dish={dish} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
