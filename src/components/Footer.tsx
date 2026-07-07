"use client";

import { useState } from "react";
import { RESTAURANT, NAV_LINKS } from "@/lib/data";
import Logo from "./ui/Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden border-t border-gold/10 bg-ink-900 pt-20">
      <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[28vw] leading-none text-cream/[0.025] md:text-[18vw]">
        SÈVES
      </div>

      <div className="relative mx-auto max-w-content px-6">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a href="#top" className="inline-block text-gold transition-opacity hover:opacity-80" aria-label="Back to top">
              <Logo />
            </a>
            <p className="mt-6 max-w-xs font-serif text-xl font-light italic text-cream/70">
              {RESTAURANT.tagline}
            </p>
            <p className="mt-4 text-sm font-light text-cream/45">{RESTAURANT.descriptor}</p>
          </div>

          <div>
            <h4 className="text-[0.6rem] uppercase tracking-luxe text-gold/70">Explore</h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#reservation"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  Reservations
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[0.6rem] uppercase tracking-luxe text-gold/70">Connect</h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={RESTAURANT.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${RESTAURANT.email}`}
                  className="text-sm font-light text-cream/60 transition-colors hover:text-gold"
                >
                  {RESTAURANT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[0.6rem] uppercase tracking-luxe text-gold/70">Journal</h4>
            <p className="mt-5 text-sm font-light text-cream/50">
              Seasonal menus, terrace evenings, and stories from the kitchen.
            </p>
            {subscribed ? (
              <p className="mt-4 text-sm text-gold">Thank you for subscribing.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 border-b border-cream/20 bg-transparent pb-2 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="shrink-0 text-xs uppercase tracking-luxe text-gold hover:text-cream"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-8 text-center md:flex-row md:text-left">
          <p className="text-xs font-light text-cream/40">
            © {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.
          </p>
          <p className="text-xs font-light text-cream/40">
            {RESTAURANT.city}, {RESTAURANT.country} · Crafted with intention
          </p>
        </div>
      </div>
    </footer>
  );
}
