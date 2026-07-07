import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";
import { getReservationsForDate } from "@/lib/reservations-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Valid date parameter required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const base = getAvailability(date);
  const booked = await getReservationsForDate(date);

  const slots = base.map((slot) => {
    const count = booked.filter((r) => r.time === slot.time).length;
    const remaining = Math.max(0, slot.remaining - count);
    return {
      ...slot,
      remaining,
      available: remaining > 0,
    };
  });

  const limited = slots.filter((s) => s.available).length <= 2;

  return NextResponse.json({ date, slots, limited });
}
