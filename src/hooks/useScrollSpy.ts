"use client";

import { useEffect, useState } from "react";

const SECTION_IDS = [
  "top",
  "walkthrough",
  "dishes",
  "menu",
  "cellar",
  "chef",
  "story",
  "experiences",
  "gallery",
  "testimonials",
  "reservation",
  "contact",
];

export function useScrollSpy() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

export function hrefToSectionId(href: string) {
  return href.replace("#", "");
}
