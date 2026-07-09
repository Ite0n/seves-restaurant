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
        cards.forEach((card, i) => {
          const image = card.querySelector("[data-journey-parallax]");
          const mask = card.querySelector("[data-journey-mask]");

          gsap.set(card, { opacity: 0, x: i % 2 === 0 ? -28 : 28 });
          if (mask) gsap.set(mask, { clipPath: "inset(0 100% 0 0)" });

          const reveal = gsap.to(card, {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
          cleanups.push(() => {
            reveal.scrollTrigger?.kill();
            reveal.kill();
          });

          if (mask) {
            const wipe = gsap.to(mask, {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.05,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            });
            cleanups.push(() => {
              wipe.scrollTrigger?.kill();
              wipe.kill();
            });
          }

          if (image) {
            gsap.set(image, { scale: 1.12, xPercent: 6 });
            const drift = gsap.to(image, {
              scale: 1,
              xPercent: -3,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: SCRUB_LUXE,
              },
            });
            cleanups.push(() => {
              drift.scrollTrigger?.kill();
              drift.kill();
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
        end: () => `+=${getScrollDistance() * 1.15}`,
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
    cards.forEach((card) => {
      const image = card.querySelector("[data-journey-parallax]");
      const mask = card.querySelector("[data-journey-mask]");

      if (mask) {
        const wipe = gsap.fromTo(
          mask,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 92%",
              end: "left 55%",
              scrub: 0.55,
            },
          }
        );
        cleanups.push(() => {
          wipe.scrollTrigger?.kill();
          wipe.kill();
        });
      }

      if (image) {
        const drift = gsap.fromTo(
          image,
          { scale: 1.16, xPercent: 8 },
          {
            scale: 1.02,
            xPercent: -4,
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
          drift.scrollTrigger?.kill();
          drift.kill();
        });
      }

      const rise = gsap.fromTo(
        card,
        { opacity: 0.45, y: 28 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 90%",
            end: "left 50%",
            scrub: 0.6,
          },
        }
      );
      cleanups.push(() => {
        rise.scrollTrigger?.kill();
        rise.kill();
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
        items.forEach((item, i) => {
          const image = item.querySelector("[data-gallery-parallax]");
          gsap.set(item, {
            opacity: 0,
            y: 40,
            scale: 0.94,
            rotate: i % 2 === 0 ? -2 : 2,
          });

          const reveal = gsap.to(item, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            delay: (i % 3) * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 92%",
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
        end: () => `+=${getScrollDistance() * 1.55}`,
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
    panels.forEach((panel, i) => {
      const image = panel.querySelector("[data-gallery-parallax]");
      const float = panel.querySelector("[data-gallery-float]");
      const lift = i % 2 === 0 ? 14 : -10;

      if (float) {
        gsap.set(float, { y: lift });
      }

      if (image) {
        const parallax = gsap.fromTo(
          image,
          { scale: 1.14, xPercent: -4, yPercent: -3 },
          {
            scale: 1.02,
            xPercent: 4,
            yPercent: 3,
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
          scale: 0.82,
          opacity: 0.35,
          rotate: i % 2 === 0 ? -2.5 : 2.5,
          filter: "brightness(0.55) blur(1px)",
          clipPath: "inset(18% 12% 18% 12% round 3px)",
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          filter: "brightness(1) blur(0px)",
          clipPath: "inset(0% 0% 0% 0% round 3px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 88%",
            end: "left 46%",
            scrub: 0.65,
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
          const mask = card.querySelector("[data-experience-mask]");
          const veil = card.querySelector("[data-experience-veil]");

          gsap.set(card, { opacity: 0, y: 48 });
          if (mask) gsap.set(mask, { clipPath: "inset(100% 0 0 0)" });
          if (veil) gsap.set(veil, { opacity: 1 });

          const reveal = gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.95,
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

          if (mask) {
            const curtain = gsap.to(mask, {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.15,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
            cleanups.push(() => {
              curtain.scrollTrigger?.kill();
              curtain.kill();
            });
          }

          if (veil) {
            const fade = gsap.to(veil, {
              opacity: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
            cleanups.push(() => {
              fade.scrollTrigger?.kill();
              fade.kill();
            });
          }

          if (image) {
            gsap.set(image, { scale: 1.18, yPercent: 10 });
            const parallax = gsap.to(image, {
              scale: 1.02,
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
      Math.max(track.scrollWidth - container.clientWidth, 0);

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance() * 1.4}`,
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
      const mask = card.querySelector("[data-experience-mask]");
      const veil = card.querySelector("[data-experience-veil]");

      if (mask) {
        const curtain = gsap.fromTo(
          mask,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 90%",
              end: "left 48%",
              scrub: 0.7,
            },
          }
        );
        cleanups.push(() => {
          curtain.scrollTrigger?.kill();
          curtain.kill();
        });
      }

      if (veil) {
        const fade = gsap.fromTo(
          veil,
          { opacity: 0.85 },
          {
            opacity: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 86%",
              end: "left 45%",
              scrub: 0.6,
            },
          }
        );
        cleanups.push(() => {
          fade.scrollTrigger?.kill();
          fade.kill();
        });
      }

      if (image) {
        const parallax = gsap.fromTo(
          image,
          { scale: 1.2, yPercent: 12 },
          {
            scale: 1.04,
            yPercent: -6,
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
          opacity: 0.5,
          y: 36,
          filter: "brightness(0.75)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "brightness(1)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 88%",
            end: "left 42%",
            scrub: 0.75,
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
