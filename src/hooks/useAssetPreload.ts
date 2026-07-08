"use client";

import { useEffect, useState } from "react";
import { heroPosterUrl } from "@/lib/critical-assets";

const MIN_DISPLAY_MS = 280;

export function useAssetPreload() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setProgress(100);
      setTimeout(() => {
        if (!cancelled) setReady(true);
      }, wait);
    };

    const img = new Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = heroPosterUrl();

    const tick = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + 15));
    }, 80);

    const fallback = setTimeout(finish, 1800);

    return () => {
      cancelled = true;
      clearInterval(tick);
      clearTimeout(fallback);
    };
  }, []);

  return { progress, ready };
}
