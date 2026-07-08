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

/** Soft cinematic scrub — photos feel deliberate, not jittery. */
const SCRUB_LUXE = 1.05;

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
  trackRef: React.RefObject<HTMLElement | null>,
  progressRef?: React.RefObject<HTMLElement | null>,
  cardRefs?: React.RefObject<(HTMLElement | null)[]>,
  mode: "desktop" | "mobile" | null = "desktop"
) {
  useEffect(() => {
    if (!mode) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (mode === "mobile" || reduced) {
      const cards =
        (cardRefs?.current?.filter(Boolean) as HTMLElement[]) ??
        Array.from(
          containerRef.current?.querySelectorAll<HTMLElement>("[data-journey-card]") ?? []
        );

      if (cards.length && mode === "mobile") {
        cards.forEach((card) => {
          gsap.set(card, { opacity: 0, y: 64, scale: 0.96 });
          const image = card.querySelector("[data-journey-parallax]");

          const reveal = gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          });
          cleanups.push(() => {
            reveal.scrollTrigger?.kill();
            reveal.kill();
          });

          if (image) {
            gsap.set(image, { scale: 1.18, yPercent: 8 });
            const parallax = gsap.to(image, {
              scale: 1,
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: SCRUB_LUXE,
              },
            });
            cleanups.push(() => {
              parallax.scrollTrigger?.kill();
              parallax.kill();
            });
          }
        });
      }
      return () => cleanups.forEach((fn) => fn());
    }

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const getScrollDistance = () =>
      Math.max(track.scrollWidth - container.offsetWidth, 0);

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance() * 1.2}`,
        pin: true,
        scrub: SCRUB_LUXE,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef?.current) {
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

    const cards = track.querySelectorAll<HTMLElement>("[data-journey-card]");
    cards.forEach((card, i) => {
      const image = card.querySelector("[data-journey-parallax]");
      if (image) {
        const parallax = gsap.fromTo(
          image,
          { scale: 1.22, xPercent: -5 },
          {
            scale: 1.06,
            xPercent: 5,
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

      const reveal = gsap.fromTo(
        card,
        {
          opacity: 0.4,
          scale: 0.92,
          filter: "brightness(0.72)",
          rotateY: i % 2 === 0 ? -4 : 4,
        },
        {
          opacity: 1,
          scale: 1,
          filter: "brightness(1)",
          rotateY: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 88%",
            end: "left 42%",
            scrub: 0.7,
          },
        }
      );
      cleanups.push(() => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerRef, trackRef, progressRef, cardRefs, mode]);
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
        items.forEach((item) => {
          const image = item.querySelector("[data-gallery-parallax]");
          gsap.set(item, {
            opacity: 0,
            y: 80,
            clipPath: "inset(10% 6% 10% 6% round 2px)",
          });

          const reveal = gsap.to(item, {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0% round 2px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
          cleanups.push(() => {
            reveal.scrollTrigger?.kill();
            reveal.kill();
          });

          if (image) {
            gsap.set(image, { scale: 1.2, yPercent: 8 });
            const parallax = gsap.to(image, {
              scale: 1.02,
              yPercent: -5,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: SCRUB_LUXE,
              },
            });
            cleanups.push(() => {
              parallax.scrollTrigger?.kill();
              parallax.kill();
            });
          }
        });
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
        scrub: SCRUB_LUXE,
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
    panels.forEach((panel) => {
      const image = panel.querySelector("[data-gallery-parallax]");
      if (image) {
        const parallax = gsap.fromTo(
          image,
          { yPercent: -12, scale: 1.24, xPercent: -3 },
          {
            yPercent: 8,
            scale: 1.06,
            xPercent: 3,
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
      }

      const focus = gsap.fromTo(
        panel,
        {
          scale: 0.88,
          opacity: 0.45,
          filter: "brightness(0.7)",
          clipPath: "inset(6% 4% 6% 4% round 2px)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "brightness(1)",
          clipPath: "inset(0% 0% 0% 0% round 2px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 82%",
            end: "left 38%",
            scrub: 0.8,
          },
        }
      );
      cleanups.push(() => {
        focus.scrollTrigger?.kill();
        focus.kill();
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
        cards.forEach((card) => {
          const image = card.querySelector("[data-experience-parallax]");
          gsap.set(card, {
            opacity: 0,
            y: 80,
            clipPath: "inset(10% 6% 10% 6% round 2px)",
          });

          const reveal = gsap.to(card, {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0% round 2px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
          cleanups.push(() => {
            reveal.scrollTrigger?.kill();
            reveal.kill();
          });

          if (image) {
            gsap.set(image, { scale: 1.2, yPercent: 8 });
            const parallax = gsap.to(image, {
              scale: 1.02,
              yPercent: -5,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: SCRUB_LUXE,
              },
            });
            cleanups.push(() => {
              parallax.scrollTrigger?.kill();
              parallax.kill();
            });
          }
        });
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
        scrub: SCRUB_LUXE,
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
          { yPercent: -12, scale: 1.24, xPercent: -3 },
          {
            yPercent: 8,
            scale: 1.06,
            xPercent: 3,
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
        {
          scale: 0.88,
          opacity: 0.45,
          filter: "brightness(0.7)",
          clipPath: "inset(6% 4% 6% 4% round 2px)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "brightness(1)",
          clipPath: "inset(0% 0% 0% 0% round 2px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 82%",
            end: "left 38%",
            scrub: 0.8,
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
