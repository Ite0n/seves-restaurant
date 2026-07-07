"use client";

import { useEffect, useState } from "react";

const CRITICAL_ASSETS = [
  "/video/hero.mp4",
  "/images/hero-terrace-firewater.png",
];

export function useAssetPreload() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let loaded = 0;
    const total = CRITICAL_ASSETS.length;

    const bump = () => {
      loaded += 1;
      const pct = Math.round((loaded / total) * 100);
      setProgress(pct);
      if (loaded >= total) {
        setTimeout(() => setReady(true), reduce ? 100 : 300);
      }
    };

    CRITICAL_ASSETS.forEach((src) => {
      if (src.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.onloadeddata = bump;
        video.onerror = bump;
        video.src = src;
      } else {
        const img = new Image();
        img.onload = bump;
        img.onerror = bump;
        img.src = src;
      }
    });

    const fallback = setTimeout(() => {
      setProgress(100);
      setReady(true);
    }, 5000);

    return () => clearTimeout(fallback);
  }, []);

  return { progress, ready };
}
