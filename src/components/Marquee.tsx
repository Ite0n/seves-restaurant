"use client";

import { PRESS } from "@/lib/data";

export default function Marquee() {
  const items = [...PRESS, ...PRESS];

  return (
    <section
      aria-label="Press and accolades"
      className="relative overflow-hidden border-y border-gold/10 bg-ink-800 py-5"
    >
      <div className="mask-fade-x flex">
        <ul className="flex shrink-0 animate-marquee items-center gap-16 whitespace-nowrap px-8">
          {items.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="font-display text-sm tracking-[0.25em] text-cream/25 transition-colors hover:text-gold/50"
            >
              {name}
            </li>
          ))}
        </ul>
        <ul
          aria-hidden="true"
          className="flex shrink-0 animate-marquee items-center gap-16 whitespace-nowrap px-8"
        >
          {items.map((name, i) => (
            <li
              key={`dup-${name}-${i}`}
              className="font-display text-sm tracking-[0.25em] text-cream/25"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
