"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { RESTAURANT } from "@/lib/data";
import MagneticButton from "./ui/MagneticButton";
import SeasonalBadge from "./ui/SeasonalBadge";
import { useLocale } from "@/context/LocaleContext";
import { useIsClient, usePrefersReducedMotion } from "@/hooks/useIsDesktop";
import { EASE_LUXE } from "@/lib/motion";
import {
  HERO_POSTER,
  HERO_POSTER_QUALITY,
  HERO_VIDEO,
} from "@/lib/critical-assets";
import { shouldLoadHeroVideo } from "@/lib/connection";
import { bindMutedAutoplay, preloadHeroVideo } from "@/lib/video-autoplay";

const GoldDust = dynamic(() => import("./hero/GoldDust"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mounted = useIsClient();
  const reducedMotion = usePrefersReducedMotion();
  const showVideo = mounted && !reducedMotion && shouldLoadHeroVideo();
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showDust, setShowDust] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (!mounted || reducedMotion || !shouldLoadHeroVideo()) return;
    return preloadHeroVideo(HERO_VIDEO);
  }, [mounted, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let idle: ReturnType<typeof setTimeout> | number;
    if ("requestIdleCallback" in window) {
      idle = window.requestIdleCallback(() => setShowDust(true), { timeout: 2000 });
    } else {
      idle = setTimeout(() => setShowDust(true), 1200);
    }

    return () => {
      if ("requestIdleCallback" in window) {
        window.cancelIdleCallback(idle as number);
      } else {
        clearTimeout(idle as ReturnType<typeof setTimeout>);
      }
    };
  }, [reducedMotion]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  const bindVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      cleanupRef.current?.();
      cleanupRef.current = null;

      if (!node || !showVideo || videoFailed) return;

      cleanupRef.current = bindMutedAutoplay(node, {
        onReady: () => setVideoReady(true),
        onPlaying: () => setVideoReady(true),
      });
    },
    [showVideo, videoFailed]
  );

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const title = RESTAURANT.name;

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-ink-900 grain"
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <Image
          src={HERO_POSTER}
          alt="Sèves garden terrace at blue hour with fire bowls and water features"
          fill
          priority
          quality={HERO_POSTER_QUALITY}
          sizes="100vw"
          className="object-cover object-center"
        />
        {showVideo && !videoFailed && (
          <video
            ref={bindVideoRef}
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            disablePictureInPicture
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/75 via-ink-900/35 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/70" />
        <div className="absolute inset-0 vignette-strong" />
      </motion.div>

      {showDust && (
        <div className="pointer-events-none absolute inset-0 z-[2] opacity-60">
          <GoldDust />
        </div>
      )}

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.12 }}
          className="mb-6"
        >
          <SeasonalBadge />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.18 }}
          className="mb-6 text-[0.7rem] uppercase tracking-luxe text-gold/90"
        >
          {t("restaurant.descriptor")} · {RESTAURANT.city}
        </motion.p>

        <h1 className="flex overflow-hidden font-display text-[22vw] leading-none md:text-[15vw] lg:text-[11rem]">
          {title.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: "120%", opacity: 0, rotateX: 40 }}
              animate={{ y: "0%", opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.85,
                ease: EASE_LUXE,
                delay: 0.22 + i * 0.035,
              }}
              className="inline-block gold-shimmer"
              style={{ perspective: 800 }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="mx-auto mt-6 h-px bg-gold/30"
          style={{ width: lineWidth }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.5 }}
          className="mt-5 max-w-md font-serif text-xl font-light italic text-cream/85 md:text-2xl"
        >
          {t("restaurant.tagline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.62 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            href="#reservation"
            className="bg-gold text-ink-900"
            strength={0.3}
          >
            {t("hero.reserve")}
          </MagneticButton>
          <MagneticButton
            href="#walkthrough"
            className="border border-cream/25 bg-transparent text-cream/80 hover:border-gold hover:text-gold"
            strength={0.25}
          >
            {t("hero.enter")}
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.6 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[0.6rem] uppercase tracking-luxe text-cream/50">
          {t("hero.scroll")}
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-cream/15">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-gold to-transparent"
          />
        </span>
      </motion.div>
    </section>
  );
}
