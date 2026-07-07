"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GALLERY } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import { EASE_LUXE } from "@/lib/motion";

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative overflow-hidden bg-ink-800 section-pad">
      <SectionAtmosphere />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Gallery"
          title={
            <>
              Moments at <span className="gold-gradient">Sèves</span>
            </>
          }
          description="Light, texture, and the quiet drama of an evening unfolding."
        />

        <div className="mt-16 grid grid-flow-dense auto-rows-[148px] grid-cols-2 gap-2 sm:auto-rows-[180px] sm:gap-3 md:grid-cols-12 md:auto-rows-[minmax(190px,14vw)] md:gap-3">
          {GALLERY.map((item, i) => (
            <motion.button
              key={item.src}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: EASE_LUXE, delay: i * 0.04 }}
              className={`group relative overflow-hidden rounded-sm ring-1 ring-inset ring-gold/12 transition-[box-shadow,ring-color] duration-700 hover:ring-gold/35 hover:shadow-[0_24px_60px_-28px_rgba(201,169,106,0.45)] ${item.span}`}
              aria-label={`View: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                quality={72}
                className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.06]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/10 to-ink-900/20 transition-opacity duration-700 group-hover:from-ink-900/55" />

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <span className="absolute left-4 top-4 font-display text-[0.65rem] tracking-[0.28em] text-cream/35 transition-colors duration-500 group-hover:text-gold/80">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <span className="block translate-y-2 text-[0.62rem] uppercase tracking-wide2 text-cream/0 transition-all duration-700 group-hover:translate-y-0 group-hover:text-cream/85">
                  {item.alt}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-6 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 z-10 text-xs uppercase tracking-luxe text-cream/60 hover:text-gold"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setActive((idx) => (idx !== null && idx > 0 ? idx - 1 : GALLERY.length - 1))}
              className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full glass p-3 text-cream/70 hover:text-gold md:block"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setActive((idx) => (idx !== null && idx < GALLERY.length - 1 ? idx + 1 : 0))}
              className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full glass p-3 text-cream/70 hover:text-gold md:block"
              aria-label="Next image"
            >
              →
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE_LUXE }}
              className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-sm ring-1 ring-gold/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={GALLERY[active].src}
                alt={GALLERY[active].alt}
                fill
                sizes="90vw"
                className="object-contain"
                quality={88}
              />
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/90 to-transparent p-6 text-center text-sm text-cream/70">
                {GALLERY[active].alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
