import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { getValidationMessages } from "@/lib/i18n";

export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateOnlyString(value: string): boolean {
  if (!DATE_ONLY_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function getReservationSchema(locale: Locale) {
  const m = getValidationMessages(locale);
  return z.object({
    name: z.string().min(2, m.name),
    phone: z.string().min(8, m.phone),
    email: z.union([z.string().email(m.email), z.literal("")]).optional(),
    date: z
      .string()
      .min(1, m.date)
      .regex(DATE_ONLY_PATTERN, m.date)
      .refine(isValidDateOnlyString, { message: m.date }),
    time: z.string().min(1, m.time),
    guests: z.string().min(1, m.guests),
    notes: z.string().max(500).optional(),
  });
}

export type ReservationInput = z.infer<ReturnType<typeof getReservationSchema>>;

/** Server-side default schema (English messages). */
export const reservationSchema = getReservationSchema("en");

export const enquirySchema = z.object({
  source: z.enum(["experience", "event", "gift"]),
  sourceId: z.string().min(1),
  sourceTitle: z.string().min(1),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  preferredDate: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
