import { GALLERY, SIGNATURE_DISHES } from "@/lib/data";
import { optimizedImageUrl } from "@/lib/image-url";

export const HERO_POSTER = "/images/hero-terrace-firewater.webp";
export const HERO_VIDEO = "/video/hero.mp4";
export const HERO_POSTER_WIDTH = 1920;
export const HERO_POSTER_QUALITY = 76;

const WALKTHROUGH_FIRST = "/images/exterior-facade-sign.webp";

export function heroPosterUrl(
  width = HERO_POSTER_WIDTH,
  quality = HERO_POSTER_QUALITY
): string {
  return optimizedImageUrl(HERO_POSTER, width, quality);
}

/** Prefetch only the next sections the user is likely to scroll into. */
export function getWarmupImages(): string[] {
  const next = [
    WALKTHROUGH_FIRST,
    SIGNATURE_DISHES[0]?.image,
    SIGNATURE_DISHES[1]?.image,
    GALLERY[0]?.src,
  ].filter((src): src is string => Boolean(src));

  return [...new Set(next)];
}
