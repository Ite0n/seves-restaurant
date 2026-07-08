"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CELLAR } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE, fadeUp } from "@/lib/motion";

export default function Cellar() {
  const { t, data } = useLocale();
  const cellar = data.cellar;

  return (
    <section id="cellar" className="relative overflow-hidden bg-ink-900 section-pad">
      <SectionAtmosphere />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          label={t("cellar.label")}
          title={
            <>
              {t("cellar.titlePrefix")}{" "}
              <span className="gold-gradient">{t("cellar.titleHighlight")}</span>
            </>
          }
          description={cellar.description}
        />

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={CELLAR.image}
                alt="Wine service at Sèves"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                quality={80}
              />
              <div className="img-frame absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
              <blockquote className="absolute bottom-8 left-8 right-8">
                <p className="font-serif text-xl italic leading-relaxed text-cream/90 md:text-2xl">
                  &ldquo;{cellar.quote}&rdquo;
                </p>
                <footer className="mt-4 text-[0.65rem] uppercase tracking-luxe text-gold">
                  {CELLAR.sommelier} · {cellar.sommelierTitle}
                </footer>
              </blockquote>
            </div>
          </Reveal>

          <div className="space-y-0">
            {cellar.featured.map((wine, i) => (
              <motion.div
                key={wine.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.9, ease: EASE_LUXE }}
                className="group border-b border-cream/10 py-6 first:pt-0"
                data-cursor="hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-cream transition-colors group-hover:text-gold">
                      {wine.name}
                    </h3>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-wide2 text-gold/70">
                      {wine.vintage} · {wine.region}
                    </p>
                    <p className="mt-3 font-light text-sm leading-relaxed text-cream/55">
                      {wine.note}
                    </p>
                  </div>
                  <span className="shrink-0 font-serif text-xl text-gold">${wine.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
