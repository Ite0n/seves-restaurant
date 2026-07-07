"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { RESTAURANT } from "@/lib/data";
import MagneticButton from "./ui/MagneticButton";
import SeasonalBadge from "./ui/SeasonalBadge";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE } from "@/lib/motion";

const GoldDust = dynamic(() => import("./hero/GoldDust"), { ssr: false });

const HERO_VIDEO = "/video/hero.mp4?v=3";
const HERO_POSTER = "/images/hero-terrace-firewater.png";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [useStatic, setUseStatic] = useState(false);
  const { t } = useLocale();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setUseStatic(true);
  }, []);

  const initVideo = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;

    node.muted = true;
    node.playsInline = true;

    const play = () => {
      node.play().catch(() => {
        /* autoplay blocked until user gesture */
      });
    };

    play();
    node.addEventListener("loadeddata", play, { once: true });
    node.addEventListener("canplay", play, { once: true });
  }, []);

  const title = RESTAURANT.name;

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-ink-900 grain"
    >
      {/* Video must NOT sit inside a transformed parent — breaks playback in Chrome/Safari */}
      <div className="absolute inset-0 overflow-hidden">
        {useStatic ? (
          <motion.div
            style={{ y: imgY, scale: imgScale }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_POSTER}
              alt="Sèves garden terrace at blue hour with fire bowls and water features"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        ) : (
          <video
            ref={initVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={() => setUseStatic(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/75 via-ink-900/35 to-ink-900" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/70" />
        <div className="pointer-events-none absolute inset-0 vignette-strong" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] opacity-60">
        <GoldDust />
      </div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.4 }}
          className="mb-6"
        >
          <SeasonalBadge />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.5 }}
          className="mb-6 text-[0.7rem] uppercase tracking-luxe text-gold/90"
        >
          {RESTAURANT.descriptor} · {RESTAURANT.city}
        </motion.p>

        <h1 className="flex overflow-hidden font-display text-[22vw] leading-none md:text-[15vw] lg:text-[11rem]">
          {title.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: "120%", opacity: 0, rotateX: 40 }}
              animate={{ y: "0%", opacity: 1, rotateX: 0 }}
              transition={{
                duration: 1.3,
                ease: EASE_LUXE,
                delay: 0.6 + i * 0.09,
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
          transition={{ delay: 1.2, duration: 0.8 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.2 }}
          className="mt-5 max-w-md font-serif text-xl font-light italic text-cream/85 md:text-2xl"
        >
          {RESTAURANT.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.45 }}
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
        transition={{ delay: 2, duration: 1 }}
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
