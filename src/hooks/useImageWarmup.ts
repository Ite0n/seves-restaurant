"use client";

import { useEffect } from "react";
import { getWarmupImages } from "@/lib/critical-assets";
import { optimizedImageUrl } from "@/lib/image-url";

function preloadImage(src: string) {
  const img = new Image();
  img.src = optimizedImageUrl(src, 1200, 78);
}

/** Prefetch near-viewport images after first paint without blocking the UI. */
export function useImageWarmup(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const images = getWarmupImages();
    if (images.length === 0) return;

    const warm = () => {
      let i = 0;
      const batch = () => {
        const end = Math.min(i + 2, images.length);
        for (; i < end; i++) preloadImage(images[i]);
        if (i < images.length) {
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(batch, { timeout: 2000 });
          } else {
            setTimeout(batch, 120);
          }
        }
      };
      batch();
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const t = setTimeout(warm, 600);
    return () => clearTimeout(t);
  }, [enabled]);
}
