"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RESTAURANT } from "@/lib/data";
import { EASE_LUXE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/context/LocaleContext";
import type { EnquiryInput } from "@/lib/validations";

type Props = {
  source: EnquiryInput["source"];
  sourceId: string;
  sourceTitle: string;
  open: boolean;
  onClose: () => void;
};

export default function ExperienceEnquiryModal({
  source,
  sourceId,
  sourceTitle,
  open,
  onClose,
}: Props) {
  const { t } = useLocale();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      source,
      sourceId,
      sourceTitle,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      preferredDate: String(form.get("date") ?? "") || undefined,
      message: String(form.get("message") ?? "") || undefined,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? t("modal.error"));
        return;
      }
      trackEvent("experience_enquire_click", { type: sourceId });
      setSent(true);
    } catch {
      setError(t("modal.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setSent(false);
      setError(null);
    }, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-900/90 p-6 backdrop-blur-md"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${t("modal.enquiry")}: ${sourceTitle}`}
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
              onClick={handleClose}
              className="absolute right-6 top-6 text-xs uppercase tracking-luxe text-cream/50 hover:text-gold"
            >
              {t("modal.close")}
            </button>

            {!sent ? (
              <>
                <span className="text-[0.6rem] uppercase tracking-luxe text-gold/80">
                  {t("modal.enquiry")}
                </span>
                <h3 className="mt-2 font-serif text-3xl text-cream">{sourceTitle}</h3>
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
                  {error && (
                    <p className="text-xs text-ruby/90" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-gold py-3.5 text-[0.65rem] uppercase tracking-luxe text-ink-900 disabled:opacity-60"
                  >
                    {submitting ? t("modal.sending") : t("modal.send")}
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
