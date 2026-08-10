# Cinematic scroll architecture

This site uses GSAP ScrollTrigger for the gallery, tasting journey,
experiences, and walkthrough storytelling sections. The system is intentionally
client-only because it depends on viewport measurements, image load state, and
the user's reduced-motion preference.

## Source map

| Concern | Codepath |
| --- | --- |
| Scroll mode selection | `src/hooks/useCinematicScrollMode.ts` |
| Shared GSAP hooks | `src/hooks/useGsapScroll.ts` |
| Smooth anchor scrolling | `src/components/SmoothScroll.tsx` |
| Gallery section | `src/components/Gallery.tsx` |
| Tasting journey section | `src/components/TastingJourney.tsx` |
| Experiences section | `src/components/Experiences.tsx` |
| Walkthrough snap | `src/components/Walkthrough.tsx` |

## Mode model

`useCinematicScrollMode()` returns:

- `null` before client mount.
- `"desktop"` when the user has not requested reduced motion.
- `"mobile"` when `prefers-reduced-motion: reduce` is active.

Despite the names, this mode is not a viewport breakpoint. Phone-sized
viewports still receive `"desktop"` when reduced motion is off, so the pinned
horizontal sections can run on touch devices. Treat `"mobile"` as the simplified
reduced-motion layout branch.

Section components render only the matching branch:

```tsx
{scrollMode === "desktop" && <PinnedHorizontalSection />}
{scrollMode === "mobile" && <SimplifiedStack />}
```

This avoids duplicate `next/image fill` trees and prevents server/client
hydration mismatches while the preference is being detected.

## Shared horizontal pattern

Gallery, tasting journey, and experiences share the same structure:

1. A section/container ref becomes the ScrollTrigger `trigger`.
2. A track ref is translated horizontally with `x`.
3. The section is pinned from `start: "top top"`.
4. The scroll distance is calculated from track width minus container width.
5. `SCRUB_LUXE` (`1.05`) gives each section a deliberate cinematic scrub.
6. A progress ref is updated in `onUpdate` with `scaleX(self.progress)`.
7. `refreshScrollOnImages()` calls `ScrollTrigger.refresh()` when images load,
   with a 1200 ms fallback refresh.

When reduced motion is active, these hooks skip the pinned scrub and use simple
vertical reveals/parallax where the simplified layout exists.

## Required animation hooks

The GSAP hooks target `data-*` attributes rather than component names. Preserve
these attributes when editing markup, extracting cards, or changing image
wrappers.

| Section | Required attributes |
| --- | --- |
| Gallery | `data-gallery-panel`, `data-gallery-parallax`, `data-gallery-float` |
| Tasting journey | `data-journey-card`, `data-journey-mask`, `data-journey-parallax` |
| Experiences | `data-experience-card`, `data-experience-parallax`, `data-experience-mask`, `data-experience-veil` |

If an attribute is removed, that part of the animation silently becomes a no-op
or loses its reveal/parallax treatment.

## Walkthrough behavior

The walkthrough uses a separate rule set:

- `useWalkthroughSnap()` runs only when WebGL mode is enabled.
- WebGL mode requires client mount, a `min-width: 768px` viewport, and no
  reduced-motion preference.
- Snap points are fixed at `[0, 0.22, 0.4, 0.58, 0.74, 0.9, 1]`.
- If WebGL is unavailable, outside the viewport warmup range, or reduced motion
  is active, the section uses still-image stations instead.

Do not assume walkthrough behavior matches gallery/journey/experiences. It is
viewport-gated because the WebGL scene is desktop-only.

## Smooth scrolling and accessibility

`SmoothScroll` initializes Lenis for non-reduced-motion users and handles
same-page anchor clicks through Lenis. When `prefers-reduced-motion: reduce` is
active, Lenis is skipped entirely and only the logo `#top` click handler is
registered.

Before changing scroll behavior:

- Verify keyboard and direct anchor navigation still work.
- Keep `prefers-reduced-motion` as a hard opt-out for Lenis and pinned
  cinematic motion.
- Avoid adding layout-only viewport checks to `useCinematicScrollMode()` unless
  all three horizontal sections are reviewed together.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| A horizontal section renders blank on first paint | Confirm the section handles `scrollMode === null` until client mount. |
| Cards no longer animate | Check that the required `data-*` attributes survived the markup change. |
| Scroll distance is wrong after image loading | Confirm images are inside the tracked element passed to `refreshScrollOnImages()`. |
| Reduced-motion users still see pinned scrub | Confirm the section gets `useCinematicScrollMode()` and the hook checks `prefers-reduced-motion`. |
| Walkthrough snap triggers on mobile | Confirm `useWalkthroughSnap()` is still gated by `useWebGL`, which includes the `min-width: 768px` check. |
