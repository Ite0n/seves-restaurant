import { promises as fs } from "fs";
import path from "path";
import { getAvailabilityWithReservations } from "./availability";

export type StoredReservation = {
  reference: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
  experienceType?: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "reservations.json");
const memory: StoredReservation[] = [];

export type ReservationSaveResult = "saved" | "invalid-time" | "unavailable";

let operationQueue: Promise<void> = Promise.resolve();

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FILE);
    } catch {
      await fs.writeFile(FILE, "[]", "utf-8");
    }
  } catch {
    /* read-only FS (e.g. Vercel) — fall back to memory */
  }
}

async function withStoreLock<T>(operation: () => Promise<T>): Promise<T> {
  const run = operationQueue.then(operation, operation);
  operationQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function getSlotState(
  reservations: StoredReservation[],
  date: string,
  time: string
): Exclude<ReservationSaveResult, "saved"> | "available" {
  const slots = getAvailabilityWithReservations(
    date,
    reservations.filter((r) => r.date === date)
  );
  const slot = slots.find((s) => s.time === time);

  if (!slot) return "invalid-time";
  return slot.available ? "available" : "unavailable";
}

export async function saveReservation(
  entry: StoredReservation
): Promise<void> {
  await withStoreLock(async () => {
    memory.push(entry);
    try {
      await ensureFile();
      const raw = await fs.readFile(FILE, "utf-8");
      const list: StoredReservation[] = JSON.parse(raw);
      list.push(entry);
      await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
    } catch {
      /* persisted in memory only */
    }
  });
}

export async function saveReservationIfAvailable(
  entry: StoredReservation
): Promise<ReservationSaveResult> {
  return withStoreLock(async () => {
    try {
      await ensureFile();
      const raw = await fs.readFile(FILE, "utf-8");
      const list: StoredReservation[] = JSON.parse(raw);
      const slotState = getSlotState(list, entry.date, entry.time);

      if (slotState !== "available") return slotState;

      list.push(entry);
      await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
      memory.push(entry);
      return "saved";
    } catch {
      const slotState = getSlotState(memory, entry.date, entry.time);

      if (slotState !== "available") return slotState;

      memory.push(entry);
      return "saved";
    }
  });
}

export async function getReservationsForDate(
  date: string
): Promise<StoredReservation[]> {
  return withStoreLock(async () => {
    try {
      await ensureFile();
      const raw = await fs.readFile(FILE, "utf-8");
      const list: StoredReservation[] = JSON.parse(raw);
      return list.filter((r) => r.date === date);
    } catch {
      return memory.filter((r) => r.date === date);
    }
  });
}
