"use client";

import { track as vercelTrack } from "@vercel/analytics";

type EventName =
  | "reservation_submit"
  | "walkthrough_complete"
  | "menu_category_switch"
  | "experience_enquire_click"
  | "newsletter_subscribe"
  | "sound_toggle"
  | "gift_enquire";

export function trackEvent(name: EventName, props?: Record<string, string>) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("seves-analytics", { detail: { name, ...props } })
  );

  try {
    vercelTrack(name, props);
  } catch {
    /* analytics optional */
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", name, props ?? "");
  }
}
