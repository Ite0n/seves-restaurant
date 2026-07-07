"use client";

import { useEffect, useState, type RefObject } from "react";

export function useNearViewport(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "400px 0px"
) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return near;
}
