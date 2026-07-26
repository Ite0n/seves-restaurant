"use client";

import { useEffect } from "react";
import Lenis from "lenis";

function scrollTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function anchorOffset() {
  return window.innerWidth < 1024 ? -88 : -10;
}

function initialHashTarget() {
  const hash = window.location.hash;
  if (!hash || hash === "#top") return null;

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function hasTopInitialTarget() {
  return !window.location.hash || window.location.hash === "#top";
}

function hasSectionInitialTarget() {
  return Boolean(window.location.hash && window.location.hash !== "#top");
}

function scrollToElementInstant(el: HTMLElement) {
  const top = window.scrollY + el.getBoundingClientRect().top + anchorOffset();
  window.scrollTo({ top, left: 0, behavior: "auto" });
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onLogoClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'a[href="#top"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      e.preventDefault();
      scrollTopInstant();
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };

    if (reduced) {
      const restoreNativeInitialPosition = () => {
        const target = initialHashTarget();
        if (target) {
          scrollToElementInstant(target);
        } else if (hasTopInitialTarget()) {
          scrollTopInstant();
        }
      };

      const hashRestoreTimeouts = hasSectionInitialTarget()
        ? [0, 150, 500, 1000, 2000].map((delay) =>
            window.setTimeout(restoreNativeInitialPosition, delay)
          )
        : [];

      restoreNativeInitialPosition();

      document.addEventListener("click", onLogoClick);
      return () => {
        hashRestoreTimeouts.forEach((timeout) => window.clearTimeout(timeout));
        document.removeEventListener("click", onLogoClick);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    const restoreInitialHash = () => {
      const target = initialHashTarget();
      if (target) {
        lenis.scrollTo(target, { offset: anchorOffset(), immediate: true });
        return;
      }

      if (hasTopInitialTarget()) {
        lenis.scrollTo(0, { immediate: true });
        return;
      }
    };

    const hashRestoreTimeouts = hasSectionInitialTarget()
      ? [0, 150, 500, 1000, 2000].map((delay) =>
          window.setTimeout(restoreInitialHash, delay)
        )
      : [];

    restoreInitialHash();

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;

      e.preventDefault();

      if (id === "#top") {
        lenis.scrollTo(0, { immediate: true });
        history.replaceState(null, "", window.location.pathname + window.location.search);
        return;
      }

      const el = document.querySelector(id);
      if (el) {
        lenis.scrollTo(el as HTMLElement, { offset: anchorOffset(), duration: 1.6 });
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      hashRestoreTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
