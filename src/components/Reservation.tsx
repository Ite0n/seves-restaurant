"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { RESTAURANT } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { EASE_LUXE } from "@/lib/motion";
import {
  reservationSchema,
  type ReservationInput,
} from "@/lib/validations";

const GUESTS = ["2", "3", "4", "5", "6", "7+"];
const TIMES = ["18:00", "19:00", "20:00", "21:00", "22:00"];

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

export default function Reservation() {
  const [reference, setReference] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

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
        setApiError(json.error ?? "Request failed. Please try again.");
        return;
      }
      setReference(json.reference);
    } catch {
      setApiError("Unable to connect. Please call us directly.");
    }
  };

  const handleReset = () => {
    reset();
    setReference(null);
    setApiError(null);
  };

  return (
    <section id="reservation" className="relative overflow-hidden bg-ink-900 section-pad">
      <div className="absolute inset-0">
        <Image
          src="/images/exterior-terrace-night.png"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          quality={65}
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/70" />
      </div>

      <div className="relative mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            label="Reservations"
            title={
              <>
                Reserve your
                <br />
                <span className="gold-gradient">evening</span>
              </>
            }
            description="We welcome bookings up to 60 days in advance. For parties larger than seven or private dining, kindly contact our maître d'."
          />
          <Reveal delay={0.16}>
            <div className="mt-8 space-y-1 font-light text-cream/70">
              <p className="text-gold">Reservations line</p>
              <a
                href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`}
                className="font-serif text-2xl transition-colors hover:text-gold"
              >
                {RESTAURANT.phone}
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
                    <Field label="Full name" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        placeholder="Your name"
                        className={inputCls}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Phone" error={errors.phone?.message}>
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
                    <Field label="Date" error={errors.date?.message}>
                      <input
                        {...register("date")}
                        type="date"
                        className={`${inputCls} [color-scheme:dark]`}
                      />
                    </Field>
                    <Field label="Email" error={errors.email?.message}>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@email.com"
                        className={inputCls}
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  <Field label="Time" error={errors.time?.message}>
                    <div className="flex flex-wrap gap-2">
                      {TIMES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setValue("time", t)}
                          className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-300 ${
                            time === t
                              ? "border-gold bg-gold text-ink-900"
                              : "border-cream/20 text-cream/70 hover:border-gold/50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Guests" error={errors.guests?.message}>
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

                  <Field label="Special requests">
                    <textarea
                      {...register("notes")}
                      rows={2}
                      placeholder="Allergies, celebrations, seating preferences…"
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
                      {isSubmitting ? "Sending…" : "Request Reservation"}
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
                    Request received
                  </h3>
                  <p className="mt-3 max-w-xs font-light text-cream/60">
                    Thank you. Our maître d&apos; will confirm your table for{" "}
                    {guests} at {time} shortly.
                  </p>
                  {reference && (
                    <p className="mt-4 font-display text-xs tracking-luxe text-gold/70">
                      Ref · {reference}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 text-xs uppercase tracking-luxe text-gold hover:text-cream"
                  >
                    Make another request
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
