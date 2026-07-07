# Sèves — Ultra-Premium Restaurant Experience

A cinematic, Michelin-star-grade website for **Sèves** — *"where every plate is
a piece of art."* Black canvas, warm gold accents, Apple-level motion, hero
video, and a live in-browser 3D walkthrough built from the venue's photography.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** — custom luxury design system
- **Framer Motion** — reveals, parallax, page choreography
- **GSAP ScrollTrigger** — walkthrough snap, tasting journey pin
- **React Three Fiber + Three.js** — hero gold-dust field & 3D walkthrough
- **Lenis** — buttery smooth scrolling

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Sections

1. **Cinematic hero** — looped terrace video (desktop) + gold dust + seasonal badge
2. **Press marquee** — logo-style accolades
3. **3D walkthrough** — scroll-driven WebGL with GSAP snap points
4. **Signature dishes** — ingredient reveal on hover
5. **Interactive menu** — category tabs with synced imagery
6. **Tasting journey** — pinned horizontal scroll through course chapters
7. **Wine cellar** — sommelier picks and featured bottles
8. **Chef & story** — brigade, philosophy, timeline
9. **Experiences** — private dining with enquiry modals
10. **Events calendar** — upcoming wine dinners and terrace evenings
11. **Gallery** — masonry grid, Ken Burns, swipe lightbox
12. **Testimonials** — auto-advancing carousel
13. **Gift experiences** — voucher enquiries
14. **Reservation** — live slot availability + WhatsApp fallback
15. **FAQ, contact** — embedded map, hours
16. **Footer** — newsletter signup

## Enhancements

- **Hero video** at `public/video/hero.mp4`
- **i18n** — EN / FR / AR toggle (navbar)
- **Custom cursor**, **sound toggle**, **mobile reserve bar**
- **Time-of-day theme** — Beirut evening/day tint
- **API routes** — `/api/reservations`, `/api/availability`, `/api/newsletter`
- **Analytics events** — `window` custom events for conversion tracking

### Optional assets

- Walkthrough film: see [`public/video/README.md`](public/video/README.md)
- Ambient audio: drop `ambient.mp3` in `public/audio/`

### Environment variables

```env
RESEND_API_KEY=           # Email notifications
RESERVATION_EMAIL=        # Maître d' inbox
NEWSLETTER_EMAIL=         # Newsletter signups
```

## Performance & SEO

- 3D libraries code-split (`next/dynamic`, `ssr:false`)
- `next/image` with responsive `sizes`, lazy loading
- Hero video on desktop; still poster on mobile
- `prefers-reduced-motion` respected throughout
- JSON-LD Restaurant + FAQPage, Open Graph video, hreflang alternates

## Customisation

- Brand, menu, hours, copy → `src/lib/data.ts`
- Translations → `src/lib/i18n.ts`
- Motion variants → `src/lib/motion.ts`
