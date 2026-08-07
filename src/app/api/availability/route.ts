import { NextResponse } from "next/server";
import {
  getAvailability,
  getClosedAvailability,
  isLimitedTonight,
} from "@/lib/availability";
import { getReservationsForDate } from "@/lib/db/reservations";

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
  let booked: Awaited<ReturnType<typeof getReservationsForDate>>;

  try {
    booked = await getReservationsForDate(date);
  } catch {
    const slots = getClosedAvailability(date);

    return NextResponse.json(
      {
        date,
        slots,
        limited: isLimitedTonight(slots),
        error:
          "Availability is temporarily unavailable. Please call us directly.",
      },
      { status: 503 }
    );
  }

  const slots = base.map((slot) => {
    const count = booked.filter((r) => r.time === slot.time).length;
    const remaining = Math.max(0, slot.remaining - count);
    return {
      ...slot,
      remaining,
      available: remaining > 0,
    };
  });

  const limited = isLimitedTonight(slots);

  return NextResponse.json({ date, slots, limited });
}
