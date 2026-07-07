"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAssetPreload } from "@/hooks/useAssetPreload";
import { EASE_LUXE } from "@/lib/motion";

export default function Preloader() {
  const { progress, ready } = useAssetPreload();

  return (
    <AnimatePresence>
      {!ready && (
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
              Beirut · Dbayeh · Fine Dining
            </p>
          </motion.div>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px w-48 overflow-hidden bg-cream/10">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-200"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
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
