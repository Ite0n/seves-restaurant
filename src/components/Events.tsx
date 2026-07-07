"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EVENTS } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import MagneticButton from "./ui/MagneticButton";
import { EASE_LUXE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Events() {
  return (
    <section id="events" className="relative overflow-hidden bg-ink-800 section-pad">
      <SectionAtmosphere />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          label="Calendar"
          title={
            <>
              Upcoming <span className="gold-gradient">evenings</span>
            </>
          }
          description="Wine dinners, guest chefs, and terrace celebrations — each composed as a singular event."
        />

        <div className="mt-20 flex flex-col gap-6">
          {EVENTS.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.9, ease: EASE_LUXE }}
              className="group grid overflow-hidden rounded-sm bg-ink-900/50 md:grid-cols-[280px_1fr]"
              data-cursor="hover"
            >
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[220px]">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-900/40 md:bg-gradient-to-t" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <time className="text-[0.6rem] uppercase tracking-luxe text-gold/80">
                  {formatDate(event.date)}
                </time>
                <h3 className="mt-2 font-serif text-3xl text-cream">{event.title}</h3>
                <p className="mt-1 text-sm text-gold/70">{event.subtitle}</p>
                <p className="mt-4 max-w-xl font-light leading-relaxed text-cream/55">
                  {event.description}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {event.price && (
                    <span className="font-serif text-xl text-gold">{event.price}</span>
                  )}
                  <MagneticButton
                    href="#reservation"
                    className="border border-gold/40 bg-transparent px-5 py-2.5 text-xs text-gold"
                    strength={0.2}
                    onClick={() =>
                      trackEvent("experience_enquire_click", { type: event.id })
                    }
                  >
                    Reserve
                  </MagneticButton>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
