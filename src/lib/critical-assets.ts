import { GALLERY, SIGNATURE_DISHES } from "@/lib/data";
import { MENU } from "@/lib/menu";

export const HERO_POSTER = "/images/hero-terrace-firewater.png";
export const HERO_VIDEO = "/video/hero.mp4";

/** Images to prefetch in the background after first paint. */
export function getWarmupImages(): string[] {
  const menu = MENU.flatMap((c) => c.items.map((i) => i.image));
  const gallery = GALLERY.map((g) => g.src);
  const dishes = SIGNATURE_DISHES.map((d) => d.image);

  return [...new Set([HERO_POSTER, ...dishes, ...gallery, ...menu])];
}
