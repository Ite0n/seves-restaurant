"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function refreshScrollOnImages(root: HTMLElement) {
  const images = root.querySelectorAll("img");
  if (!images.length) return () => {};

  let pending = 0;
  const done = () => {
    pending -= 1;
    if (pending <= 0) ScrollTrigger.refresh();
  };

  images.forEach((img) => {
    if (img.complete) return;
    pending += 1;
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });

  const fallback = window.setTimeout(() => ScrollTrigger.refresh(), 1200);

  return () => {
    window.clearTimeout(fallback);
    images.forEach((img) => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    });
  };
}

export function useWalkthroughSnap(
  sectionRef: React.RefObject<HTMLElement | null>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const el = sectionRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    if (reduced || mobile) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: [0, 0.22, 0.4, 0.58, 0.74, 0.9, 1],
        duration: { min: 0.4, max: 0.9 },
        ease: "power2.inOut",
      },
    });

    return () => st.kill();
  }, [sectionRef, enabled]);
}

export function useTastingJourneyPin(
  containerRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    if (reduced || mobile) return;

    const scrollWidth = track.scrollWidth - container.offsetWidth;

    const tween = gsap.to(track, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [containerRef, trackRef]);
}

export function useGalleryScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>,
  progressRef: React.RefObject<HTMLElement | null>,
  mobileItemRefs: React.RefObject<(HTMLElement | null)[]>,
  mode: "desktop" | "mobile" | null
) {
  useEffect(() => {
    if (!mode) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (mode === "mobile" || reduced) {
      const items = mobileItemRefs.current?.filter(Boolean) as HTMLElement[];
      if (items.length && mode === "mobile") {
        const batch = ScrollTrigger.batch(items, {
          start: "top 90%",
          onEnter: (els) => {
            gsap.fromTo(
              els,
              { opacity: 0, y: 48, scale: 0.94 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
              }
            );
          },
          once: true,
        });
        cleanups.push(() => batch.forEach((st) => st.kill()));
      }
      return () => cleanups.forEach((fn) => fn());
    }

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const getScrollDistance = () =>
      Math.max(track.scrollWidth - container.clientWidth, 0);

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance() * 1.35}`,
        pin: true,
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });
    cleanups.push(refreshScrollOnImages(track));
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });

    const panels = track.querySelectorAll<HTMLElement>("[data-gallery-panel]");
    panels.forEach((panel, i) => {
      const image = panel.querySelector("[data-gallery-parallax]");
      if (!image) return;

      const parallax = gsap.fromTo(
        image,
        { xPercent: -6 - i * 0.5, scale: 1.12 },
        {
          xPercent: 6 + i * 0.5,
          scale: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        }
      );
      cleanups.push(() => {
        parallax.scrollTrigger?.kill();
        parallax.kill();
      });

      const reveal = gsap.fromTo(
        panel,
        { clipPath: "inset(8% 6% 8% 6% round 2px)", opacity: 0.55 },
        {
          clipPath: "inset(0% 0% 0% 0% round 2px)",
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 92%",
            end: "left 38%",
            scrub: 0.5,
          },
        }
      );
      cleanups.push(() => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerRef, trackRef, progressRef, mobileItemRefs, mode]);
}

export function useExperiencesScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>,
  progressRef: React.RefObject<HTMLElement | null>,
  cardRefs: React.RefObject<(HTMLElement | null)[]>,
  mode: "desktop" | "mobile" | null
) {
  useEffect(() => {
    if (!mode) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (mode === "mobile" || reduced) {
      const cards = cardRefs.current?.filter(Boolean) as HTMLElement[];
      if (cards.length && mode === "mobile") {
        const batch = ScrollTrigger.batch(cards, {
          start: "top 88%",
          onEnter: (els) => {
            gsap.fromTo(
              els,
              { opacity: 0, y: 56 },
              {
                opacity: 1,
                y: 0,
                duration: 1.1,
                stagger: 0.14,
                ease: "power3.out",
              }
            );
          },
          once: true,
        });
        cleanups.push(() => batch.forEach((st) => st.kill()));
      }
      return () => cleanups.forEach((fn) => fn());
    }

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const getScrollDistance = () =>
      Math.max(track.scrollWidth - container.clientWidth, 0);

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance() * 1.25}`,
        pin: true,
        scrub: 0.7,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });
    cleanups.push(refreshScrollOnImages(track));
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });

    const cards = track.querySelectorAll<HTMLElement>("[data-experience-card]");
    cards.forEach((card) => {
      const image = card.querySelector("[data-experience-parallax]");
      if (image) {
        const parallax = gsap.fromTo(
          image,
          { yPercent: -10, scale: 1.14 },
          {
            yPercent: 10,
            scale: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
        cleanups.push(() => {
          parallax.scrollTrigger?.kill();
          parallax.kill();
        });
      }

      const focus = gsap.fromTo(
        card,
        { scale: 0.9, opacity: 0.65 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 78%",
            end: "left 42%",
            scrub: 0.6,
          },
        }
      );
      cleanups.push(() => {
        focus.scrollTrigger?.kill();
        focus.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerRef, trackRef, progressRef, cardRefs, mode]);
}
