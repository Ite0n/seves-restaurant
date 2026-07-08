export const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00"] as const;

export type SlotAvailability = {
  time: string;
  available: boolean;
  remaining: number;
};

type ReservationLike = {
  time: string;
};

/** Deterministic pseudo-random availability per date+time (no DB required). */
export function getAvailability(date: string): SlotAvailability[] {
  const seed = date.split("-").reduce((a, b) => a + parseInt(b, 10), 0);

  return TIME_SLOTS.map((time, i) => {
    const hash = (seed * 31 + i * 17 + parseInt(time, 10)) % 100;
    const remaining = hash < 15 ? 0 : hash < 35 ? 1 : hash < 60 ? 2 : 4;
    return {
      time,
      available: remaining > 0,
      remaining,
    };
  });
}

export function getAvailabilityWithReservations(
  date: string,
  reservations: ReservationLike[]
): SlotAvailability[] {
  const base = getAvailability(date);

  return base.map((slot) => {
    const booked = reservations.filter((r) => r.time === slot.time).length;
    const remaining = Math.max(0, slot.remaining - booked);

    return {
      ...slot,
      remaining,
      available: remaining > 0,
    };
  });
}

export function isLimitedTonight(date: string): boolean {
  const slots = getAvailability(date);
  const available = slots.filter((s) => s.available).length;
  return available <= 2;
}
