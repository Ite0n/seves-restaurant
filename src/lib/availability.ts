export const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00"] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

const TIME_SLOT_SET = new Set<string>(TIME_SLOTS);

export function isTimeSlot(time: string): time is TimeSlot {
  return TIME_SLOT_SET.has(time);
}

export type SlotAvailability = {
  time: TimeSlot;
  available: boolean;
  remaining: number;
};

const SLOT_CAPACITY = 8;

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
