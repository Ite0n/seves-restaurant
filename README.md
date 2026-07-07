# Sèves — Ultra-Premium Restaurant Experience

A cinematic, Michelin-star-grade website for **Sèves** — *"where every plate is
a piece of art."* Black canvas, warm gold accents, Apple-level motion, and a
live in-browser 3D walkthrough built from the venue's own photography.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — custom luxury design system
- **Framer Motion** — reveals, parallax, page choreography
- **GSAP** — available for advanced timelines
- **React Three Fiber + Three.js** — hero gold-dust field & the 3D walkthrough
- **Lenis** — buttery smooth scrolling

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Sections

1. **Fullscreen cinematic hero** — parallax terrace plate + animated gold dust (R3F) + kinetic wordmark
2. **The Experience** — scroll-driven WebGL 3D walkthrough through the real spaces
3. **Signature dishes** — alternating parallax showcase
4. **Interactive menu** — animated category tabs with synced imagery
5. **Story** — brigade & philosophy with layered parallax
6. **Gallery** — masonry grid with lightbox
7. **Reservation** — premium booking form with success state
8. **Testimonials** — auto-advancing quote carousel
9. **Contact + location** — hours, map link, details
10. **Footer**

## The 3D walkthrough

The walkthrough (`src/components/Walkthrough.tsx`) renders a **real WebGL scene**
(`walkthrough/WalkthroughScene.tsx`): the venue photos are mounted as framed
panels in 3D space with depth fog, a reflective floor, gold rim light, mouse
parallax and a scroll-controlled camera dolly — preserving the architecture and
visual language of the source media while staying performant and lazy-loaded.

To use a pre-rendered cinematic film instead (e.g. Higgsfield), see
[`public/video/README.md`](public/video/README.md).

## Performance & SEO

- 3D libraries are **code-split** (`next/dynamic`, `ssr:false`) and never block first paint
- `next/image` with AVIF/WebP, responsive `sizes`, lazy loading below the fold
- Hero image marked `priority` for a fast LCP
- `prefers-reduced-motion` respected (smooth scroll + heavy motion disabled)
- Mobile-first responsive layout across all breakpoints
- JSON-LD `Restaurant` schema, Open Graph, Twitter cards, `robots.ts`, `sitemap.ts`

## Assets

All imagery in `public/images/` is sourced from the provided Sèves photography
and renamed semantically (interior / dishes / exterior / brand / team).

## Customisation

- Brand, menu, hours, copy, testimonials → `src/lib/data.ts`
- Colors / fonts / easings → `tailwind.config.ts` and `src/app/globals.css`
- Motion variants → `src/lib/motion.ts`
