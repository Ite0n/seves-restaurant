/** Build a next/image optimizer URL for non-Image consumers (e.g. WebGL textures). */
export function optimizedImageUrl(
  src: string,
  width = 2048,
  quality = 85
): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
