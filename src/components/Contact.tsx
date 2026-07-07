"use client";

import Image from "next/image";
import { RESTAURANT } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import MagneticButton from "./ui/MagneticButton";

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
  return (
    <section id="contact" className="relative bg-ink-800 section-pad">
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          label="Visit Us"
          title={
            <>
              Find your way to <span className="gold-gradient">Sèves</span>
            </>
          }
          description={`${RESTAURANT.streetAddress}, ${RESTAURANT.city} — where fire, water, and the Mediterranean sky meet.`}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="group relative min-h-[380px] overflow-hidden rounded-sm lg:min-h-[520px]">
            <Image
              src={RESTAURANT.contactImage}
              alt={`${RESTAURANT.name} — ${RESTAURANT.city} entrance at night`}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={78}
              className="object-cover object-center transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
            <div className="img-frame absolute inset-0" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
              <a
                href={RESTAURANT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-[0.65rem] uppercase tracking-wide2 text-cream transition-colors hover:text-gold"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s-7-6.3-7-11a7 7 0 1114 0c0 4.7-7 11-7 11z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                Open in Maps
              </a>
              <a
                href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-[0.65rem] uppercase tracking-wide2 text-cream transition-colors hover:text-gold"
              >
                Call us
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center gap-9">
            <InfoBlock title="Address">
              <p>{RESTAURANT.address}</p>
            </InfoBlock>

            <InfoBlock title="Opening Hours">
              <ul className="space-y-2">
                {RESTAURANT.hours.map((h) => (
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
              <InfoBlock title="Reservations">
                <a
                  href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold"
                >
                  {RESTAURANT.phone}
                </a>
              </InfoBlock>
              <InfoBlock title="Email">
                <a href={`mailto:${RESTAURANT.email}`} className="transition-colors hover:text-gold">
                  {RESTAURANT.email}
                </a>
              </InfoBlock>
            </div>

            <div className="divider-gold" />

            <div className="flex flex-wrap gap-4">
              <MagneticButton href="#reservation" className="bg-gold text-ink-900" strength={0.25}>
                Book a table
              </MagneticButton>
              <MagneticButton
                href="#experiences"
                className="border border-cream/25 bg-transparent text-cream/80"
                strength={0.2}
              >
                Private dining
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
