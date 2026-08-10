# Media and asset runbook

This site relies on high-impact imagery, a muted hero video, and optimized
formats. The runtime behavior is intentionally conservative: rich media should
enhance the page without breaking reduced-motion, data-saver, or browser
rendering constraints.

## Source map

| Concern | Codepath |
| --- | --- |
| Hero video and poster layering | `src/components/Hero.tsx` |
| Autoplay binding and retries | `src/lib/video-autoplay.ts` |
| Data-saver media gate | `src/lib/connection.ts` |
| Critical image/video constants | `src/lib/critical-assets.ts` |
| Cinematic image wrapper | `src/components/ui/CinematicImage.tsx` |
| Image optimizer URL helper | `src/lib/image-url.ts` |
| Next image formats and qualities | `next.config.mjs` |
| PNG conversion workflow | `scripts/convert-images.mjs` |
| WebP upscaling workflow | `scripts/upscale-images.mjs` |
| Video placement notes | `public/video/README.md` |
| Ambient audio notes | `public/audio/README.md` |

## Hero video behavior

The hero attempts to load `/video/hero.mp4` only when all of these are true:

- The component has mounted on the client.
- The user has not requested `prefers-reduced-motion: reduce`.
- `navigator.connection.saveData` is not enabled.

There is no viewport-width gate for the hero video. If the user is on a phone
without reduced motion or data saver, the video path is eligible.

The poster image (`/images/hero-terrace-firewater.webp`) remains visible when:

- The component has not mounted yet.
- Reduced motion is active.
- Data saver is active.
- The video errors.
- The video has not reached the ready state used by `bindMutedAutoplay()`.

## Chrome and Edge video placement constraint

Keep the hero `<video>` outside transformed ancestors. In `Hero.tsx`, the video
is an absolute child of the hero section and sits before the Framer Motion image
parallax layer. Moving it inside the transformed `motion.div` can prevent
Chrome/Edge from painting the video.

The poster fades out only after `videoReady` is set by the autoplay binding, so
avoid tying poster opacity to the existence of the `<video>` element alone.

## Muted autoplay helper

`bindMutedAutoplay(video, options)` is the single place for resilient hero video
startup. It:

- Forces `muted`, `defaultMuted`, and inline playback attributes.
- Calls `video.play()` immediately.
- Retries at 300 ms and 1200 ms.
- Treats `readyState >= HAVE_CURRENT_DATA` as ready.
- Retries on page visibility/focus and first pointer, touch, or keyboard input.
- Replays if the video pauses while visible.
- Returns cleanup for retry timers and long-lived media/page listeners.

`preloadHeroVideo(src)` creates a detached muted video element to start buffering
before the visible element mounts. It is skipped when reduced motion is active or
`shouldLoadHeroVideo()` returns false.

## Image delivery conventions

Use `CinematicImage` for normal UI imagery when the shared grade treatment is
desired. It wraps `next/image`, defaults to `quality={80}`, and supports:

- `grade="soft"`
- `grade="rich"` (default)
- `grade="vivid"`

Use raw `next/image` when a section needs specialized priority, quality, or
layout control, such as the hero poster and tasting journey cards.

Use `optimizedImageUrl()` for non-React image consumers, especially WebGL
textures. It returns a `/_next/image` optimizer URL with an explicit width and
quality.

`next.config.mjs` allows AVIF/WebP output and a fixed set of image quality
values from 65 to 95. If a new component passes a quality outside that list,
update the config deliberately or choose an existing allowed value.

## Asset conversion workflow

### Convert PNGs to WebP and AVIF

```bash
npm run convert-images
```

The script:

- Scans `public/images/` recursively for `.png` files.
- Skips `public/images/_originals/`.
- Backs up each source PNG under `_originals/`, preserving subpaths.
- Emits sibling `.webp` and `.avif` files.
- Deletes the source PNG after conversion.
- Caps menu images at 1200 px width.
- Caps other images at 2400 px width.
- Uses lower AVIF quality and higher WebP quality tuned separately for menu and
  venue imagery.

Review the generated files before committing. The script mutates assets and is
not a read-only optimizer.

### Upscale selected venue images

```bash
npm run upscale-images
```

The script processes a fixed list of WebP venue/gallery assets in
`scripts/upscale-images.mjs`. It backs up originals to `_originals/`, resizes up
to 2x with a 3840 px width cap, applies light color/sharpening adjustments, and
overwrites the original WebP.

Because this overwrites tracked image assets, use it only when intentionally
refreshing the visual asset set.

## Video and audio assets

Video file placement and compression examples live in
`public/video/README.md`. Keep walkthrough-specific setup there because the
walkthrough can switch between WebGL and an optional video file.

Ambient audio placement lives in `public/audio/README.md`. Keep ambient loops
small; the current guidance is under 500 KB.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Hero video never appears | Confirm reduced motion and data saver are off, `/video/hero.mp4` exists, and the video has not fired `onError`. |
| Hero video works in Safari but not Chrome/Edge | Confirm the `<video>` is not inside a transformed Framer Motion ancestor. |
| Poster disappears before video is visible | Confirm poster opacity still depends on `showVideo && videoReady && !videoFailed`. |
| New image quality fails in production | Confirm the quality value is listed in `next.config.mjs`. |
| WebGL texture is blurry or oversized | Use `optimizedImageUrl(src, width, quality)` with an explicit width appropriate for the texture. |
| Converted assets include unwanted originals | Confirm `_originals/` is ignored by the conversion script and review staged files before commit. |
