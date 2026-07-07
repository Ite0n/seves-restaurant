"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/context/LocaleContext";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    audioRef.current = new Audio("/audio/ambient.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (on) {
      audio.pause();
      setOn(false);
      trackEvent("sound_toggle", { state: "off" });
    } else {
      try {
        await audio.play();
        setOn(true);
        trackEvent("sound_toggle", { state: "on" });
      } catch {
        /* file missing or autoplay blocked */
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-24 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-ink-900/80 text-cream/60 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold lg:bottom-6"
      aria-label={on ? t("sound.on") : t("sound.off")}
      title={on ? t("sound.on") : t("sound.off")}
    >
      {on ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
          <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" opacity="0.5" />
          <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}
