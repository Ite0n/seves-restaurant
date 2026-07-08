"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RESTAURANT } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

export default function GiftExperiences() {
  const { t, data } = useLocale();

  return (
    <section id="gifts" className="relative overflow-hidden bg-ink-900 section-pad">
      <SectionAtmosphere />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          label={t("gifts.label")}
          title={
            <>
              {t("gifts.titlePrefix")}{" "}
              <span className="gold-gradient">{t("gifts.titleHighlight")}</span>
            </>
          }
          description={t("gifts.description")}
        />

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {data.gifts.map((gift, i) => (
            <motion.article
              key={gift.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.9, ease: EASE_LUXE }}
              className="group overflow-hidden rounded-sm bg-ink-800/60"
              data-cursor="hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={gift.image}
                  alt={gift.title}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="font-serif text-2xl text-cream">{gift.title}</h3>
                <p className="mt-3 font-light text-sm leading-relaxed text-cream/55">
                  {gift.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-serif text-2xl text-gold">{gift.price}</span>
                  <a
                    href={`mailto:${RESTAURANT.email}?subject=Gift%20certificate%20—%20${encodeURIComponent(gift.title)}`}
                    onClick={() => trackEvent("gift_enquire", { type: gift.id })}
                    className="text-[0.65rem] uppercase tracking-luxe text-gold hover:text-cream"
                  >
                    {t("gifts.enquire")}
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
