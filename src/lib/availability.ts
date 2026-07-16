export const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00"] as const;

export type SlotAvailability = {
  time: string;
  available: boolean;
  remaining: number;
};

const SLOT_CAPACITY = 8;
const RESTAURANT_TIME_ZONE = "Asia/Beirut";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTimeMinutes(time: string): number | null {
  const match = TIME_PATTERN.exec(time);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}

function getRestaurantNow(now: Date): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

export function isFutureRestaurantSlot(
  date: string,
  time: string,
  now = new Date()
): boolean {
  if (!DATE_PATTERN.test(date)) return false;

  const slotMinutes = parseTimeMinutes(time);
  if (slotMinutes === null) return false;

  const restaurantNow = getRestaurantNow(now);
  if (date < restaurantNow.date) return false;
  if (date > restaurantNow.date) return true;

  return slotMinutes > restaurantNow.minutes;
}

/** Base slot capacity - remaining seats are subtracted by real reservations in the API route. */
export function getAvailability(date: string, now = new Date()): SlotAvailability[] {
  return TIME_SLOTS.map((time) => ({
    time,
    available: isFutureRestaurantSlot(date, time, now),
    remaining: SLOT_CAPACITY,
  }));
}

export function isLimitedTonight(slots: SlotAvailability[]): boolean {
  const available = slots.filter((s) => s.available).length;
  return available <= 2;
}
