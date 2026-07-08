export const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00"] as const;

export type SlotAvailability = {
  time: string;
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
