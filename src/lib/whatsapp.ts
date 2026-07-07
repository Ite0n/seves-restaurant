import type { ReservationInput } from "@/lib/validations";

/** International digits only, e.g. 96170553301 */
export const WHATSAPP_PHONE = "96170553301";

export function formatReservationWhatsAppMessage(
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

export function buildWhatsAppUrl(
  message: string,
  phone: string = WHATSAPP_PHONE
): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Sends a WhatsApp message to the restaurant via CallMeBot (requires CALLMEBOT_API_KEY). */
export async function sendWhatsAppNotification(message: string): Promise<boolean> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) return false;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const body = await res.text();
    return res.ok && !body.toLowerCase().includes("error");
  } catch {
    return false;
  }
}
