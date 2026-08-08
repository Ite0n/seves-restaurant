"use client";

import { useEffect, useState } from "react";
import { heroPosterUrl } from "@/lib/critical-assets";

const MIN_DISPLAY_MS = 280;

export function useAssetPreload() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    let readyTimer: ReturnType<typeof setTimeout> | undefined;
    const started = performance.now();

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      clearInterval(tick);
      clearTimeout(fallback);

      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setProgress(100);
      readyTimer = setTimeout(() => {
        if (!cancelled) setReady(true);
      }, wait);
    };

    const tick = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + 15));
    }, 80);

    const fallback = setTimeout(finish, 1800);

    const img = new Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = heroPosterUrl();

    return () => {
      cancelled = true;
      clearInterval(tick);
      clearTimeout(fallback);
      if (readyTimer) clearTimeout(readyTimer);
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return { progress, ready };
}
