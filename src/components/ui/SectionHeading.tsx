"use client";

import { motion } from "framer-motion";
import { EASE_LUXE } from "@/lib/motion";
import Reveal from "./Reveal";

type Props = {
  label: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className={`flex items-center gap-3 ${
          centered ? "justify-center" : "justify-start"
        }`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="text-[0.65rem] uppercase tracking-luxe text-gold/80">
          {label}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
      </motion.div>

      <Reveal>
        <h2
          className={`mt-6 font-serif text-4xl leading-[1.1] text-cream md:text-6xl ${
            centered ? "mx-auto max-w-3xl" : "max-w-xl"
          }`}
        >
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.1}>
          <p
            className={`mt-5 font-light leading-relaxed text-cream/55 ${
              centered ? "mx-auto max-w-lg" : "max-w-md"
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
