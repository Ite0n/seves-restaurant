"use client";

import Image from "next/image";
import { RESTAURANT } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import MagneticButton from "./ui/MagneticButton";
import { useLocale } from "@/context/LocaleContext";

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[0.65rem] uppercase tracking-luxe text-gold/80">{title}</h3>
      <div className="mt-3 font-light leading-relaxed text-cream/70">{children}</div>
    </div>
  );
}

export default function Contact() {
  const { t, data } = useLocale();

  return (
    <section id="contact" className="relative bg-ink-800 section-pad">
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          label={t("contact.label")}
          title={
            <>
              {t("contact.titlePrefix")}{" "}
              <span className="gold-gradient">{t("contact.titleHighlight")}</span>
            </>
          }
          description={`${RESTAURANT.streetAddress}, ${RESTAURANT.city} — ${data.restaurant.contactDescription}`}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex flex-col gap-4">
            <div className="group relative min-h-[280px] overflow-hidden rounded-sm lg:min-h-[360px]">
              <Image
                src={RESTAURANT.contactImage}
                alt={`${RESTAURANT.name} terrace — ${RESTAURANT.city}`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={78}
                className="object-cover object-[center_28%] transition-transform duration-[1.4s] ease-luxe group-hover:scale-105 md:object-[center_35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
              <div className="img-frame absolute inset-0" />
            </div>
            <div className="relative min-h-[240px] overflow-hidden rounded-sm ring-1 ring-gold/15 lg:min-h-[280px]">
              <iframe
                title="Sèves location on Google Maps"
                src={`https://maps.google.com/maps?q=${RESTAURANT.coordinates.lat},${RESTAURANT.coordinates.lng}&z=15&output=embed`}
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-[1.05] invert-[92%] hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={RESTAURANT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-[0.65rem] uppercase tracking-wide2 text-cream transition-colors hover:text-gold"
              >
                {t("contact.maps")}
              </a>
              <a
                href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-[0.65rem] uppercase tracking-wide2 text-cream transition-colors hover:text-gold"
              >
                {t("contact.call")}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center gap-9">
            <InfoBlock title={t("contact.address")}>
              <p>{RESTAURANT.address}</p>
            </InfoBlock>

            <InfoBlock title={t("contact.hours")}>
              <ul className="space-y-2">
                {data.restaurant.hours.map((h) => (
                  <li
                    key={h.d}
                    className="flex items-center justify-between border-b border-cream/10 pb-2 text-sm"
                  >
                    <span>{h.d}</span>
                    <span className="text-gold">{h.h}</span>
                  </li>
                ))}
              </ul>
            </InfoBlock>

            <div className="grid grid-cols-2 gap-8">
              <InfoBlock title={t("contact.reservations")}>
                <a
                  href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold"
                >
                  {RESTAURANT.phone}
                </a>
              </InfoBlock>
              <InfoBlock title={t("contact.email")}>
                <a href={`mailto:${RESTAURANT.email}`} className="transition-colors hover:text-gold">
                  {RESTAURANT.email}
                </a>
              </InfoBlock>
            </div>

            <div className="divider-gold" />

            <div className="flex flex-wrap gap-4">
              <MagneticButton href="#reservation" className="bg-gold text-ink-900" strength={0.25}>
                {t("contact.book")}
              </MagneticButton>
              <MagneticButton
                href="#experiences"
                className="border border-cream/25 bg-transparent text-cream/80"
                strength={0.2}
              >
                {t("contact.private")}
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
