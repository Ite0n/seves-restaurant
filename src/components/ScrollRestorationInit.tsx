"use client";

import { useEffect } from "react";

export default function ScrollRestorationInit() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      return;
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
