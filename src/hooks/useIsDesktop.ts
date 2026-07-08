"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_MQ = "(min-width: 768px)";
const LARGE_MQ = "(min-width: 1024px)";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function subscribeMedia(query: string) {
  return (onStoreChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onStoreChange);
    return () => mq.removeEventListener("change", onStoreChange);
  };
}

function getMediaSnapshot(query: string) {
  return () => window.matchMedia(query).matches;
}

const subscribeClient = () => () => {};
const getClientSnapshot = () => true;
const getClientServerSnapshot = () => false;

export function useIsClient() {
  return useSyncExternalStore(
    subscribeClient,
    getClientSnapshot,
    getClientServerSnapshot
  );
}

/** Match Tailwind `md` — render one layout to avoid 0-height duplicate `fill` images. */
export function useIsDesktop() {
  const mounted = useIsClient();
  const isDesktop = useSyncExternalStore(
    subscribeMedia(DESKTOP_MQ),
    getMediaSnapshot(DESKTOP_MQ),
    () => false
  );
  return { mounted, isDesktop };
}

/** Match Tailwind `lg`. */
export function useIsLargeScreen() {
  const mounted = useIsClient();
  const isLarge = useSyncExternalStore(
    subscribeMedia(LARGE_MQ),
    getMediaSnapshot(LARGE_MQ),
    () => false
  );
  return { mounted, isLarge };
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMedia(REDUCED_MQ),
    getMediaSnapshot(REDUCED_MQ),
    () => true
  );
}
