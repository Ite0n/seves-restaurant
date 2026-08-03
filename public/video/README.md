# Cinematic media and motion runbook

This directory holds production video assets for the Sèves homepage. Keep this
document in sync with the media and scroll systems so future visual changes do
not regress browser playback, reduced-motion behavior, or page performance.

## Source of truth

| Area | Primary files | Notes |
| --- | --- | --- |
| Hero media paths | `src/lib/critical-assets.ts` | `HERO_VIDEO` points to `/video/hero.mp4`; `HERO_POSTER` points to `/images/hero-terrace-firewater.webp`. |
| Hero playback | `src/components/Hero.tsx`, `src/lib/video-autoplay.ts`, `src/lib/connection.ts` | Handles data-saver checks, reduced motion, preloading, muted autoplay retries, and poster fallback. |
| Walkthrough media | `src/components/Walkthrough.tsx` | Defaults to WebGL on desktop and image stations elsewhere; optional video mode is currently opt-in via `WALKTHROUGH_VIDEO`. |
| Cinematic scroll | `src/hooks/useCinematicScrollMode.ts`, `src/hooks/useGsapScroll.ts` | Uses GSAP ScrollTrigger for pinned horizontal sections, parallax, masks, progress bars, and image-load refreshes. |
| Image processing | `scripts/convert-images.mjs`, `scripts/upscale-images.mjs`, `next.config.mjs` | Converts PNGs, preserves originals, and relies on allowed `next/image` quality values. |

## Hero video (`hero.mp4`)

The homepage hero expects:

```
public/video/hero.mp4
```

Playback flow:

1. `Hero.tsx` renders the video only after client mount, when
   `prefers-reduced-motion` is not enabled and `navigator.connection.saveData`
   is not enabled.
2. `preloadHeroVideo(HERO_VIDEO)` starts buffering before the visible video
   element mounts.
3. `bindMutedAutoplay` forces muted inline playback, retries after short
   delays, and retries again after visibility, focus, or first user gesture
   events.
4. The poster image remains visible until the video reaches a ready or playing
   state. If the video errors, `videoFailed` leaves the poster in place.

Important constraint: keep the `<video>` in `Hero.tsx` outside transformed
ancestors. Chrome and Edge can fail to paint an autoplaying video when it is
inside the parallax `motion.div`; the current implementation keeps video and
poster as sibling layers for that reason.

### Production encoding

Use an H.264 MP4 with no audio track and fast-start metadata. The checked-in
hero file is about 3.8 MB; keep replacement assets near that budget unless
there is a measured reason to increase it.

```bash
ffmpeg -i input.mov \
  -vf "scale=1920:-2:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -crf 24 -preset slow -movflags +faststart -an \
  public/video/hero.mp4
```

After replacing the file, verify:

- Chrome and Edge desktop paint the video above the poster.
- iOS Safari and Android Chrome autoplay muted and inline.
- Data Saver and reduced-motion both keep the poster-only experience.
- The poster still describes the scene accessibly through the `Image` alt text;
  the decorative video remains `aria-hidden="true"`.

## Walkthrough video (`walkthrough.mp4`) -- optional

Optional path:

```
public/video/walkthrough.mp4
```

Then set the constant in `src/components/Walkthrough.tsx`:

```ts
const WALKTHROUGH_VIDEO: string | null = "/video/walkthrough.mp4";
```

Current behavior is intentionally simple: when this constant is set, the
walkthrough section returns a fullscreen autoplaying video and bypasses the
WebGL scene, station images, captions, progress tracking, and reduced-motion
branch. Before enabling this for production, review the UX and accessibility
impact and add a poster or reduced-motion fallback if needed.

Suggested prompt for generating source footage:

> Slow cinematic dolly through an ultra-luxury fine-dining restaurant at blue
> hour. Emerald velvet banquettes, white marble tables, cascading teardrop
> pendant lights, herringbone oak floors, warm gold accent lighting, a backlit
> feather sculpture, an open kitchen glowing behind glass. Realistic
> reflections, soft shadows, shallow depth of field, gentle handheld motion,
> Michelin-star atmosphere. No people, no text.

Compress before shipping:

```bash
ffmpeg -i input.mp4 \
  -vf "scale=1920:-2:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -crf 24 -preset slow -movflags +faststart -an \
  public/video/walkthrough.mp4
```

## Cinematic scroll contracts

`useCinematicScrollMode()` returns:

- `null` during server render / before client mount.
- `"desktop"` for the cinematic pinned-scroll experience when reduced motion is
  not requested.
- `"mobile"` for the simplified reveal experience when reduced motion is
  requested.

The GSAP hooks in `src/hooks/useGsapScroll.ts` depend on component-owned refs
and `data-*` attributes:

- Tasting journey: `data-journey-card`, `data-journey-mask`,
  `data-journey-parallax`.
- Gallery: `data-gallery-panel`, `data-gallery-float`,
  `data-gallery-parallax`.
- Experiences: `data-experience-card`, `data-experience-mask`,
  `data-experience-veil`, `data-experience-parallax`.

When changing markup in `TastingJourney.tsx`, `Gallery.tsx`, or
`Experiences.tsx`, preserve these attributes or update the hook selectors at
the same time. The hooks refresh ScrollTrigger after images finish loading to
avoid stale pin distances.

## Image pipeline notes

- Run `npm run convert-images` after adding PNG files under `public/images`.
  The script creates WebP and AVIF variants, removes the PNG, and backs up the
  original under `public/images/_originals/`.
- Run `npm run upscale-images` only for the curated gallery/experience list in
  `scripts/upscale-images.mjs`; it overwrites those WebP files after backing up
  originals.
- `next.config.mjs` restricts accepted image quality values. If a component
  needs a new `quality` number, add it to `images.qualities` or Next.js builds
  can fail.

## Troubleshooting

### Hero stays on the poster

Check these first:

1. `public/video/hero.mp4` exists and is reachable at `/video/hero.mp4`.
2. The browser is not in Data Saver mode.
3. The OS/browser does not request reduced motion.
4. DevTools Network shows a playable MP4 response, not a 404 or unsupported
   codec.
5. The `<video>` element is still outside transformed ancestors in `Hero.tsx`.

### Scroll sections pin at the wrong distance

- Confirm the section refs still wrap the element that should pin.
- Confirm the expected `data-*` attributes still exist on animated elements.
- Check for late-loading images or markup changes that require
  `ScrollTrigger.refresh()`.
- Test with reduced motion enabled; the simplified path should remain usable
  without pinned horizontal motion.
