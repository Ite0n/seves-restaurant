"use client";

import { useIsClient, usePrefersReducedMotion } from "@/hooks/useIsDesktop";

/** Pinned horizontal scroll on all viewports; simple reveals when reduced motion. */
export function useCinematicScrollMode(): "desktop" | "mobile" | null {
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();

  if (!mounted) return null;
  return reduced ? "mobile" : "desktop";
}
