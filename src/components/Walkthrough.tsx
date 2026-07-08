"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import SectionLabel from "./ui/SectionLabel";
import { useWalkthroughSnap } from "@/hooks/useGsapScroll";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useIsDesktop";
import { useNearViewport } from "@/hooks/useNearViewport";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/context/LocaleContext";

const WALKTHROUGH_VIDEO: string | null = null;

const WalkthroughScene = dynamic(
  () => import("./walkthrough/WalkthroughScene"),
  { ssr: false }
);

const FALLBACK_STATIONS = [
  "/images/exterior-facade-sign.png",
  "/images/interior-pendant-room.png",
  "/images/interior-dining-banquette.png",
  "/images/interior-feather-art.png",
  "/images/bar-bonsai-night.png",
  "/images/exterior-firewater-city.png",
];

export default function Walkthrough() {
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useLocale();
  const walkthrough = data.walkthrough;
  const captions = walkthrough.captions;
  const { mounted, isDesktop } = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const useWebGL = mounted && isDesktop && !reducedMotion;
  const sceneNear = useNearViewport(ref, "600px 0px");

  useWalkthroughSnap(ref, useWebGL);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0.05, 0.95], [0, 1], {
    clamp: true,
  });

  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    let idx = 0;
    for (let i = 0; i < captions.length; i++) {
      if (v >= captions[i].at) idx = i;
    }
    setActive(idx);
    if (v > 0.92 && !completed) {
      setCompleted(true);
      trackEvent("walkthrough_complete");
    }
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0]);
  const outroOpacity = useTransform(scrollYProgress, [0.92, 1], [0, 1]);

  if (WALKTHROUGH_VIDEO) {
    return (
      <section id="walkthrough" className="relative bg-ink-900">
        <video
          className="h-[100svh] w-full object-cover"
          src={WALKTHROUGH_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </section>
    );
  }

  const fallbackImage =
    FALLBACK_STATIONS[Math.min(active, FALLBACK_STATIONS.length - 1)];

  return (
    <section
      id="walkthrough"
      ref={ref}
      className={`relative bg-ink-900 ${useWebGL ? "h-[420vh]" : "h-[260vh] md:h-[420vh]"}`}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {useWebGL && sceneNear ? (
            <WalkthroughScene progress={progress} />
          ) : (
            <div className="relative h-full w-full">
              <Image
                key={fallbackImage}
                src={fallbackImage}
                alt={captions[active].title}
                fill
                sizes="100vw"
                priority={active === 0}
                className="object-cover"
                quality={85}
              />
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.85)_100%)]" />

        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <SectionLabel>{walkthrough.label}</SectionLabel>
          <h2 className="mt-6 max-w-3xl px-6 font-serif text-4xl leading-tight text-cream md:text-6xl">
            {walkthrough.title.split("Sèves")[0]}
            <span className="gold-gradient">Sèves</span>
            {walkthrough.title.split("Sèves")[1] ?? ""}
          </h2>
          <p className="mt-4 text-xs uppercase tracking-luxe text-cream/50">
            {walkthrough.scrollHint}
          </p>
        </motion.div>

        <div className="pointer-events-none absolute bottom-16 left-0 right-0 px-8 md:bottom-20 md:px-16">
          <div className="mx-auto max-w-5xl">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[0.65rem] uppercase tracking-luxe text-gold/80">
                0{active + 1} — {captions[active].title}
              </span>
              <p className="mt-2 max-w-md font-serif text-2xl text-cream/90 md:text-3xl">
                {captions[active].text}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cream/10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-gold-600 to-gold-200"
            style={{ scaleX: progress }}
          />
        </div>

        <motion.div
          style={{ opacity: outroOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-ink-900"
        />
      </div>
    </section>
  );
}
