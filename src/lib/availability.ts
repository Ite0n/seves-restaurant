export const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00"] as const;

export type SlotAvailability = {
  time: string;
  available: boolean;
  remaining: number;
};

const SLOT_CAPACITY = 8;
const UNKNOWN_GUEST_COUNT = SLOT_CAPACITY;

type ReservationSeats = {
  time: string;
  guests: string;
};

export function parseGuestCount(guests: string): number | null {
  const match = /^(\d+)\+?$/.exec(guests.trim());
  if (!match) return null;

  const count = Number.parseInt(match[1], 10);
  return Number.isSafeInteger(count) && count > 0 ? count : null;
}

function getBookedSeatsForSlot(
  reservations: ReservationSeats[],
  time: string
): number {
  return reservations
    .filter((reservation) => reservation.time === time)
    .reduce(
      (total, reservation) =>
        total + (parseGuestCount(reservation.guests) ?? UNKNOWN_GUEST_COUNT),
      0
    );
}

export function getRemainingSeats(
  slot: SlotAvailability,
  reservations: ReservationSeats[]
): number {
  return Math.max(
    0,
    slot.remaining - getBookedSeatsForSlot(reservations, slot.time)
  );
}

/** Base slot capacity — remaining seats subtracted by real reservations in the API route. */
export function getAvailability(date: string): SlotAvailability[] {
  void date;
  return TIME_SLOTS.map((time) => ({
    time,
    available: true,
    remaining: SLOT_CAPACITY,
  }));
}

export function isLimitedTonight(slots: SlotAvailability[]): boolean {
  const available = slots.filter((s) => s.available).length;
  return available <= 2;
}
