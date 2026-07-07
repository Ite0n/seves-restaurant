"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RESTAURANT } from "@/lib/data";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE } from "@/lib/motion";

export default function MobileReserveBar() {
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_LUXE }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/20 bg-ink-900/95 px-4 py-3 backdrop-blur-md lg:hidden"
        >
          <div className="flex gap-3">
            <a
              href="#reservation"
              className="flex-1 rounded-full bg-gold py-3 text-center text-[0.65rem] uppercase tracking-luxe text-ink-900"
            >
              {t("nav.reserve")}
            </a>
            <a
              href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
              className="rounded-full border border-cream/25 px-5 py-3 text-[0.65rem] uppercase tracking-luxe text-cream/80"
            >
              Call
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
