"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GALLERY } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { EASE_LUXE } from "@/lib/motion";

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative bg-ink-800 section-pad">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Gallery"
          title={
            <>
              Moments at <span className="gold-gradient">Sèves</span>
            </>
          }
          description="Light, texture, and the quiet drama of an evening unfolding."
        />

        <div className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[280px] md:grid-cols-4 md:gap-4">
          {GALLERY.map((item, i) => (
            <motion.button
              key={item.src}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: EASE_LUXE, delay: (i % 4) * 0.06 }}
              className={`group relative overflow-hidden rounded-sm ${item.span}`}
              aria-label={`View: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                quality={72}
                className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink-900/25 transition-colors duration-500 group-hover:bg-ink-900/0" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="translate-y-2 text-[0.6rem] uppercase tracking-wide2 text-cream/90 transition-transform duration-500 group-hover:translate-y-0">
                  {item.alt}
                </span>
              </div>
              <div className="img-frame absolute inset-0" />
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
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 z-10 text-xs uppercase tracking-luxe text-cream/60 hover:text-gold"
            >
              Close
            </button>
            <button
              onClick={() => setActive((i) => (i !== null && i > 0 ? i - 1 : GALLERY.length - 1))}
              className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full glass p-3 text-cream/70 hover:text-gold md:block"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={() => setActive((i) => (i !== null && i < GALLERY.length - 1 ? i + 1 : 0))}
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
              className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-sm"
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
