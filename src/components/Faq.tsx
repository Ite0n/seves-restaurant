"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE } from "@/lib/motion";

export default function Faq() {
  const { t, data } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-ink-800 section-pad">
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          label={t("faq.label")}
          title={
            <>
              {t("faq.titlePrefix")}{" "}
              <span className="gold-gradient">{t("faq.titleHighlight")}</span>
            </>
          }
        />

        <ul className="mx-auto mt-16 max-w-2xl divide-y divide-cream/10">
          {data.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-gold"
                >
                  <span className="font-serif text-xl text-cream md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    className={`mt-1 shrink-0 font-display text-lg text-gold transition-transform duration-500 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE_LUXE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 font-light leading-relaxed text-cream/60">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
