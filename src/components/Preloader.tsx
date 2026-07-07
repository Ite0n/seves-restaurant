"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_LUXE } from "@/lib/motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(100);
      const t = setTimeout(() => setDone(true), 200);
      return () => clearTimeout(t);
    }

    let frame = 0;
    const start = performance.now();
    const duration = 2400;

    const tick = (now: number) => {
      const p = Math.min(((now - start) / duration) * 100, 100);
      setProgress(Math.floor(p));
      if (p < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 400);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE }}
            className="text-center"
          >
            <div className="font-display text-5xl tracking-[0.25em] text-gold md:text-7xl">
              S<span className="italic">è</span>VES
            </div>
            <p className="mt-4 text-[0.6rem] uppercase tracking-luxe text-cream/40">
              Beirut · Fine Dining
            </p>
          </motion.div>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px w-48 overflow-hidden bg-cream/10">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-200"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="font-display text-xs tabular-nums tracking-widest text-gold/60">
              {progress}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
