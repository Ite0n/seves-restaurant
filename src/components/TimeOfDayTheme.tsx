"use client";

import { useEffect } from "react";

/** Shifts hero tint based on Beirut local hour — warm evening vs cool day. */
export default function TimeOfDayTheme() {
  useEffect(() => {
    const hour = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Beirut",
      hour: "numeric",
      hour12: false,
    })
      .format(new Date())
      .split(":")[0];

    const h = parseInt(hour, 10);
    const isEvening = h >= 17 || h < 6;
    document.documentElement.dataset.timeTheme = isEvening ? "evening" : "day";
  }, []);

  return null;
}
