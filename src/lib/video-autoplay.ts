export type MutedAutoplayOptions = {
  onPlaying?: () => void;
  onReady?: () => void;
};

/** Attach resilient muted autoplay — mobile, desktop, iOS Safari, Chrome. */
export function bindMutedAutoplay(
  video: HTMLVideoElement,
  { onPlaying, onReady }: MutedAutoplayOptions = {}
): () => void {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  let disposed = false;

  const play = async () => {
    if (disposed || video.ended) return;
    try {
      video.muted = true;
      await video.play();
      onPlaying?.();
    } catch {
      /* blocked until user gesture — unlock handlers will retry */
    }
  };

  const handleReady = () => onReady?.();

  const handlePlaying = () => {
    onReady?.();
    onPlaying?.();
  };

  const resumeIfVisible = () => {
    if (document.visibilityState === "visible") void play();
  };

  const onPause = () => {
    if (!disposed && !video.ended && document.visibilityState === "visible") {
      void play();
    }
  };

  const unlock = () => {
    void play();
  };

  video.addEventListener("loadeddata", handleReady);
  video.addEventListener("canplay", handleReady);
  video.addEventListener("canplaythrough", handleReady);
  video.addEventListener("playing", handlePlaying);
  video.addEventListener("pause", onPause);
  video.addEventListener("stalled", unlock);
  video.addEventListener("waiting", unlock);
  document.addEventListener("visibilitychange", resumeIfVisible);
  window.addEventListener("pageshow", resumeIfVisible);
  window.addEventListener("focus", resumeIfVisible);
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("touchstart", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });

  void video.load();
  void play();

  const retry300 = window.setTimeout(() => void play(), 300);
  const retry1200 = window.setTimeout(() => void play(), 1200);
  const retry3000 = window.setTimeout(() => void play(), 3000);

  return () => {
    disposed = true;
    window.clearTimeout(retry300);
    window.clearTimeout(retry1200);
    window.clearTimeout(retry3000);
    video.removeEventListener("loadeddata", handleReady);
    video.removeEventListener("canplay", handleReady);
    video.removeEventListener("canplaythrough", handleReady);
    video.removeEventListener("playing", handlePlaying);
    video.removeEventListener("pause", onPause);
    video.removeEventListener("stalled", unlock);
    video.removeEventListener("waiting", unlock);
    document.removeEventListener("visibilitychange", resumeIfVisible);
    window.removeEventListener("pageshow", resumeIfVisible);
    window.removeEventListener("focus", resumeIfVisible);
  };
}

/** Start buffering hero video before the element mounts. */
export function preloadHeroVideo(src: string): () => void {
  if (typeof document === "undefined") return () => {};

  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.src = src;
  video.load();

  return () => {
    video.removeAttribute("src");
    video.load();
  };
}
