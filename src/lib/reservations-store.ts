import { promises as fs } from "fs";
import path from "path";

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

const memory: StoredReservation[] = [];

export async function saveReservation(
  entry: StoredReservation
): Promise<void> {
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
}

export async function getReservationsForDate(
  date: string
): Promise<StoredReservation[]> {
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE, "utf-8");
    const list: StoredReservation[] = JSON.parse(raw);
    return list.filter((r) => r.date === date);
  } catch {
    return memory.filter((r) => r.date === date);
  }
}
