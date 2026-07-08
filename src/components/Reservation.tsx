"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { RESTAURANT } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import {
  getReservationSchema,
  type ReservationInput,
} from "@/lib/validations";
import {
  buildWhatsAppUrl,
  formatReservationWhatsAppMessage,
} from "@/lib/whatsapp";

const GUESTS = ["2", "3", "4", "5", "6", "7+"];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.6rem] uppercase tracking-wide2 text-cream/45">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-ruby/90" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "w-full rounded-none border-b border-cream/20 bg-transparent pb-3 text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold";

type Slot = { time: string; available: boolean; remaining: number };

export default function Reservation() {
  const [reference, setReference] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [limited, setLimited] = useState(false);
  const [whatsappNotified, setWhatsappNotified] = useState(false);
  const [whatsappAutoSent, setWhatsappAutoSent] = useState(false);
  const { locale, t } = useLocale();
  const reservationSchema = useMemo(() => getReservationSchema(locale), [locale]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: "2",
      time: "20:00",
      email: "",
      notes: "",
    },
  });

  const guests = watch("guests");
  const time = watch("time");
  const date = watch("date");

  useEffect(() => {
    if (!date) return;
    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.slots) {
          setSlots(data.slots);
          setLimited(data.limited);
          const current = data.slots.find((s: Slot) => s.time === time);
          if (current && !current.available) {
            const first = data.slots.find((s: Slot) => s.available);
            if (first) setValue("time", first.time);
          }
        }
      })
      .catch(() => {});
  }, [date, setValue, time]);

  const onSubmit = async (data: ReservationInput) => {
    setApiError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? t("reservation.error"));
        return;
      }
      trackEvent("reservation_submit", { guests: data.guests, time: data.time });

      if (!json.whatsappSent) {
        const url = buildWhatsAppUrl(
          formatReservationWhatsAppMessage(data, json.reference)
        );
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setWhatsappNotified(true);
      } else {
        setWhatsappNotified(true);
        setWhatsappAutoSent(true);
      }

      setReference(json.reference);
    } catch {
      setApiError(t("reservation.offline"));
    }
  };

  const handleReset = () => {
    reset();
    setReference(null);
    setApiError(null);
    setWhatsappNotified(false);
    setWhatsappAutoSent(false);
  };

  const times = slots.length > 0 ? slots : [
    { time: "18:00", available: true, remaining: 4 },
    { time: "19:00", available: true, remaining: 4 },
    { time: "20:00", available: true, remaining: 4 },
    { time: "21:00", available: true, remaining: 4 },
    { time: "22:00", available: true, remaining: 4 },
  ];

  return (
    <section id="reservation" className="relative min-h-[36rem] overflow-hidden bg-ink-900 section-pad">
      <div className="absolute inset-0">
        <div className="relative size-full min-h-[36rem]">
          <Image
            src="/images/exterior-terrace-night.png"
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            quality={65}
            className="object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/70" />
      </div>

      <div className="relative mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            label={t("reservation.label")}
            title={
              <>
                {t("reservation.titlePrefix")}
                <br />
                <span className="gold-gradient">{t("reservation.titleHighlight")}</span>
              </>
            }
            description={t("reservation.description")}
          />
          {date && limited && (
            <p className="mt-4 text-sm text-gold/90">{t("reserve.limited")}</p>
          )}
          {date && !limited && slots.length > 0 && (
            <p className="mt-4 text-sm text-cream/50">{t("reserve.available")}</p>
          )}
          <Reveal delay={0.16}>
            <div className="mt-8 space-y-1 font-light text-cream/70">
              <p className="text-gold">{t("reservation.line")}</p>
              <a
                href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
                className="font-serif text-2xl transition-colors hover:text-gold"
              >
                {RESTAURANT.phone}
              </a>
              <a
                href={`https://wa.me/${RESTAURANT.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs uppercase tracking-luxe text-cream/50 hover:text-gold"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass-strong rounded-lg p-7 md:p-10">
            <AnimatePresence mode="wait">
              {!reference ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-7"
                  noValidate
                >
                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field label={t("reservation.name")} error={errors.name?.message}>
                      <input
                        {...register("name")}
                        placeholder={t("reservation.namePlaceholder")}
                        className={inputCls}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label={t("reservation.phone")} error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+961 …"
                        className={inputCls}
                        autoComplete="tel"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field label={t("reservation.date")} error={errors.date?.message}>
                      <input
                        {...register("date")}
                        type="date"
                        className={`${inputCls} [color-scheme:dark]`}
                      />
                    </Field>
                    <Field label={t("reservation.email")} error={errors.email?.message}>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@email.com"
                        className={inputCls}
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  <Field label={t("reservation.time")} error={errors.time?.message}>
                    <div className="flex flex-wrap gap-2">
                      {times.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setValue("time", slot.time)}
                          className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
                            time === slot.time
                              ? "border-gold bg-gold text-ink-900"
                              : "border-cream/20 text-cream/70 hover:border-gold/50"
                          }`}
                        >
                          {slot.time}
                          {slot.remaining <= 2 && slot.available && (
                            <span className="ml-1 text-[0.55rem] opacity-70">
                              · {slot.remaining}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label={t("reservation.guests")} error={errors.guests?.message}>
                    <div className="flex flex-wrap gap-2">
                      {GUESTS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setValue("guests", g)}
                          className={`h-10 w-10 rounded-full border text-xs transition-all duration-300 ${
                            guests === g
                              ? "border-gold bg-gold text-ink-900"
                              : "border-cream/20 text-cream/70 hover:border-gold/50"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label={t("reservation.notes")}>
                    <textarea
                      {...register("notes")}
                      rows={2}
                      placeholder={t("reservation.notesPlaceholder")}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {apiError && (
                    <p className="text-sm text-ruby/90" role="alert">
                      {apiError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden rounded-full bg-gold py-4 text-[0.7rem] uppercase tracking-luxe text-ink-900 disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? t("reservation.sending") : t("reservation.submit")}
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-cream transition-transform duration-700 ease-luxe group-hover:translate-x-0" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE_LUXE }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12.5l4.5 4.5L19 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-6 font-serif text-3xl text-cream">
                    {t("reservation.successTitle")}
                  </h3>
                  <p className="mt-3 max-w-xs font-light text-cream/60">
                    {t("reservation.successBody", { guests, time })}
                  </p>
                  {whatsappNotified && (
                    <p className="mt-2 max-w-xs text-xs font-light text-cream/45">
                      {whatsappAutoSent
                        ? t("reservation.whatsappAuto")
                        : t("reservation.whatsappManual")}
                    </p>
                  )}
                  {reference && (
                    <p className="mt-4 font-display text-xs tracking-luxe text-gold/70">
                      {t("reservation.ref")} · {reference}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 text-xs uppercase tracking-luxe text-gold hover:text-cream"
                  >
                    {t("reservation.another")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
