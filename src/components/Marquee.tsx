"use client";

import { PRESS_LOGOS } from "@/lib/data";

export default function Marquee() {
  const items = [...PRESS_LOGOS, ...PRESS_LOGOS];

  return (
    <section
      aria-label="Press and accolades"
      className="relative overflow-hidden border-y border-gold/10 bg-ink-800 py-5"
    >
      <div className="mask-fade-x flex">
        <ul className="flex shrink-0 animate-marquee items-center gap-12 whitespace-nowrap px-8">
          {items.map((logo, i) => (
            <li key={`${logo.abbr}-${i}`} className="group flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/10 font-display text-[0.55rem] tracking-wider text-cream/30 transition-colors group-hover:border-gold/40 group-hover:text-gold/70">
                {logo.abbr}
              </span>
              <span className="font-display text-sm tracking-[0.2em] text-cream/25 transition-colors group-hover:text-gold/50">
                {logo.name}
              </span>
            </li>
          ))}
        </ul>
        <ul
          aria-hidden="true"
          className="flex shrink-0 animate-marquee items-center gap-12 whitespace-nowrap px-8"
        >
          {items.map((logo, i) => (
            <li key={`dup-${logo.abbr}-${i}`} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/10 font-display text-[0.55rem] tracking-wider text-cream/30">
                {logo.abbr}
              </span>
              <span className="font-display text-sm tracking-[0.2em] text-cream/25">
                {logo.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
