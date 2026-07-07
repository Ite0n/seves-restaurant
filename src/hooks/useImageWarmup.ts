"use client";

import { useEffect } from "react";
import { getWarmupImages, HERO_VIDEO } from "@/lib/critical-assets";

function preloadImage(src: string) {
  const img = new Image();
  img.src = src;
}

function preloadVideo() {
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.src = HERO_VIDEO;
  video.load();
}

/** Prefetch hero video and below-fold images without blocking the UI. */
export function useImageWarmup(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const images = getWarmupImages();

    const warm = () => {
      if (!mobile && !reduced) preloadVideo();

      let i = 0;
      const batch = () => {
        const end = Math.min(i + 4, images.length);
        for (; i < end; i++) preloadImage(images[i]);
        if (i < images.length) {
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(batch, { timeout: 1200 });
          } else {
            setTimeout(batch, 80);
          }
        }
      };
      batch();
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 800 });
      return () => window.cancelIdleCallback(id);
    }

    const t = setTimeout(warm, 300);
    return () => clearTimeout(t);
  }, [enabled]);
}
