"use client";

import { useIsClient, usePrefersReducedMotion } from "@/hooks/useIsDesktop";

/** Pinned horizontal scroll on capable clients; static mobile markup keeps SSR/no-JS content visible. */
export function useCinematicScrollMode(): "desktop" | "mobile" {
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();

  if (!mounted) return "mobile";
  return reduced ? "mobile" : "desktop";
}
