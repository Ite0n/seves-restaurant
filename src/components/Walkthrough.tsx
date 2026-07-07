"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import SectionLabel from "./ui/SectionLabel";
import { useWalkthroughSnap } from "@/hooks/useGsapScroll";
import { trackEvent } from "@/lib/analytics";

/**
 * Optional cinematic walkthrough video.
 * Drop a Higgsfield-generated file at /public/video/walkthrough.mp4
 * and set this to "/video/walkthrough.mp4" to use it instead of the
 * live WebGL walkthrough.
 */
const WALKTHROUGH_VIDEO: string | null = null;

const WalkthroughScene = dynamic(
  () => import("./walkthrough/WalkthroughScene"),
  { ssr: false }
);

const CAPTIONS = [
  { at: 0.04, title: "Arrival", text: "The illuminated façade welcomes you into Sèves." },
  { at: 0.22, title: "The Grand Room", text: "Cascading light over marble and emerald velvet." },
  { at: 0.4, title: "The Table", text: "Intimate banquettes framed by living botanicals." },
  { at: 0.58, title: "The Detail", text: "A backlit feather — craft in every surface." },
  { at: 0.74, title: "The Bar", text: "A curated cellar and barrel-aged signatures." },
  { at: 0.9, title: "The Terrace", text: "Fire and water beneath the Beirut sky." },
];

export default function Walkthrough() {
  const ref = useRef<HTMLDivElement>(null);
  useWalkthroughSnap(ref);
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
    for (let i = 0; i < CAPTIONS.length; i++) {
      if (v >= CAPTIONS[i].at) idx = i;
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

  return (
    <section
      id="walkthrough"
      ref={ref}
      className="relative h-[420vh] bg-ink-900"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* WebGL walkthrough */}
        <div className="absolute inset-0">
          <WalkthroughScene progress={progress} />
        </div>

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.85)_100%)]" />

        {/* intro overlay */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <SectionLabel>The Experience</SectionLabel>
          <h2 className="mt-6 max-w-3xl px-6 font-serif text-4xl leading-tight text-cream md:text-6xl">
            A cinematic walk through <span className="gold-gradient">Sèves</span>
          </h2>
          <p className="mt-4 text-xs uppercase tracking-luxe text-cream/50">
            Scroll to move through the space
          </p>
        </motion.div>

        {/* live caption */}
        <div className="pointer-events-none absolute bottom-16 left-0 right-0 px-8 md:bottom-20 md:px-16">
          <div className="mx-auto max-w-5xl">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[0.65rem] uppercase tracking-luxe text-gold/80">
                0{active + 1} — {CAPTIONS[active].title}
              </span>
              <p className="mt-2 max-w-md font-serif text-2xl text-cream/90 md:text-3xl">
                {CAPTIONS[active].text}
              </p>
            </motion.div>
          </div>
        </div>

        {/* progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cream/10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-gold-600 to-gold-200"
            style={{ scaleX: progress }}
          />
        </div>

        {/* outro fade to next section */}
        <motion.div
          style={{ opacity: outroOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-ink-900"
        />
      </div>
    </section>
  );
}
