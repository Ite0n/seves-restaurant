"use client";

import { useEffect, useState } from "react";

const HERO_POSTER = "/images/hero-terrace-firewater.png";

export function useAssetPreload() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setProgress(100);
      setTimeout(() => setReady(true), 200);
    };
    img.onerror = () => {
      if (cancelled) return;
      setProgress(100);
      setReady(true);
    };

    const tick = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + 12));
    }, 120);

    img.src = HERO_POSTER;

    const fallback = setTimeout(() => {
      if (cancelled) return;
      setProgress(100);
      setReady(true);
    }, 2500);

    return () => {
      cancelled = true;
      clearInterval(tick);
      clearTimeout(fallback);
    };
  }, []);

  return { progress, ready };
}
