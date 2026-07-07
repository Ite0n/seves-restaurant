"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/context/LocaleContext";

const AMBIENT_SRC = "/audio/ambient.mp3";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const [available, setAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const getAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(AMBIENT_SRC);
      audio.loop = true;
      audio.volume = 0.25;
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const toggle = async () => {
    if (!available) return;

    const audio = getAudio();

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
        setAvailable(false);
      }
    }
  };

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-6 right-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-ink-900/80 text-cream/60 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold lg:flex"
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
