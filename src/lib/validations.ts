import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  email: z.union([z.string().email("Please enter a valid email"), z.literal("")]).optional(),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  guests: z.string().min(1, "Please select number of guests"),
  notes: z.string().max(500).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
