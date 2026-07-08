"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RESTAURANT } from "@/lib/data";
import { EASE_LUXE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  experienceId: string;
  experienceTitle: string;
  open: boolean;
  onClose: () => void;
};

export default function ExperienceEnquiryModal({
  experienceId,
  experienceTitle,
  open,
  onClose,
}: Props) {
  const { t } = useLocale();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent("experience_enquire_click", { type: experienceId });
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-900/90 p-6 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${t("modal.enquiry")}: ${experienceTitle}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-md rounded-lg p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 text-xs uppercase tracking-luxe text-cream/50 hover:text-gold"
            >
              {t("modal.close")}
            </button>

            {!sent ? (
              <>
                <span className="text-[0.6rem] uppercase tracking-luxe text-gold/80">
                  {t("modal.enquiry")}
                </span>
                <h3 className="mt-2 font-serif text-3xl text-cream">{experienceTitle}</h3>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <input
                    required
                    name="name"
                    placeholder={t("modal.namePlaceholder")}
                    className="w-full border-b border-cream/20 bg-transparent pb-3 text-cream outline-none focus:border-gold"
                  />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder={t("modal.emailPlaceholder")}
                    className="w-full border-b border-cream/20 bg-transparent pb-3 text-cream outline-none focus:border-gold"
                  />
                  <input
                    name="date"
                    type="date"
                    className="w-full border-b border-cream/20 bg-transparent pb-3 text-cream [color-scheme:dark] outline-none focus:border-gold"
                  />
                  <textarea
                    name="message"
                    rows={3}
                    placeholder={t("modal.messagePlaceholder")}
                    className="w-full resize-none border-b border-cream/20 bg-transparent pb-3 text-cream outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-gold py-3.5 text-[0.65rem] uppercase tracking-luxe text-ink-900"
                  >
                    {t("modal.send")}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <h3 className="font-serif text-2xl text-cream">{t("modal.thanks")}</h3>
                <p className="mt-3 font-light text-cream/60">
                  {t("modal.thanksBody", { email: RESTAURANT.email })}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
