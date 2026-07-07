"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import Logo from "./ui/Logo";
import MagneticButton from "./ui/MagneticButton";
import { EASE_LUXE } from "@/lib/motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_LUXE, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`mx-auto flex items-center justify-between px-5 transition-all duration-700 ease-luxe md:px-10 ${
            scrolled
              ? "my-3 max-w-6xl rounded-full glass py-2.5 shadow-2xl shadow-black/40 md:py-3"
              : "max-w-none bg-transparent py-5 md:py-6"
          }`}
        >
          <a href="#top" className="text-gold transition-opacity hover:opacity-80" aria-label="Sèves home">
            <Logo />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-[0.72rem] uppercase tracking-wide2 text-cream/70 transition-colors hover:text-cream"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 ease-luxe group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <MagneticButton
              href="#reservation"
              className="border border-gold/40 bg-transparent text-gold hover:bg-gold hover:text-ink-900"
              strength={0.25}
            >
              Reserve
            </MagneticButton>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`h-px w-6 bg-cream transition-all duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-cream transition-all duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center glass-strong lg:hidden"
          >
            <nav className="flex flex-col items-center gap-7" aria-label="Mobile navigation">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: EASE_LUXE, duration: 0.6 }}
                  className="font-serif text-3xl text-cream/90"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#reservation"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, ease: EASE_LUXE, duration: 0.6 }}
                className="mt-4 rounded-full border border-gold/50 px-8 py-3 text-xs uppercase tracking-luxe text-gold"
              >
                Reserve a table
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
