import type { ReservationInput } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  getReservationsForDate as getLocalReservationsForDate,
  saveReservation as saveLocalReservation,
  type StoredReservation,
} from "@/lib/reservations-store";

export type { StoredReservation };

export async function saveReservation(
  entry: StoredReservation
): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("reservations").insert({
      reference: entry.reference,
      name: entry.name,
      phone: entry.phone,
      email: entry.email ?? null,
      date: entry.date,
      time: entry.time,
      guests: entry.guests,
      notes: entry.notes ?? null,
      experience_type: entry.experienceType ?? null,
    });

    if (error) throw error;
    return;
  }

  await saveLocalReservation(entry);
}

export async function getReservationsForDate(
  date: string
): Promise<StoredReservation[]> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("reservations")
      .select("reference, name, phone, email, date, time, guests, notes, experience_type, created_at")
      .eq("date", date);

    if (error) throw error;

    return (data ?? []).map((row) => ({
      reference: row.reference,
      name: row.name,
      phone: row.phone,
      email: row.email ?? undefined,
      date: row.date,
      time: row.time,
      guests: row.guests,
      notes: row.notes ?? undefined,
      experienceType: row.experience_type ?? undefined,
      createdAt: row.created_at,
    }));
  }

  return getLocalReservationsForDate(date);
}

export function formatReservationWhatsAppFromInput(
  data: ReservationInput,
  reference: string
): string {
  return [
    "🍽️ *New reservation — Sèves*",
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    `*Email:* ${data.email || "—"}`,
    `*Date:* ${data.date}`,
    `*Time:* ${data.time}`,
    `*Guests:* ${data.guests}`,
    `*Notes:* ${data.notes || "—"}`,
    `*Ref:* ${reference}`,
  ].join("\n");
}
