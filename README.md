# Sèves — Ultra-Premium Restaurant Experience

A cinematic fine-dining website for **Sèves** in Dbayeh, Lebanon — black canvas, gold accents,
GSAP scroll storytelling, hero video, and Supabase-backed reservations & enquiries.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** — luxury design system
- **Framer Motion** + **GSAP ScrollTrigger** — cinematic motion
- **React Three Fiber** — hero gold dust & 3D walkthrough (desktop)
- **Lenis** — smooth scrolling
- **Supabase** — reservations, enquiries, newsletter subscribers
- **Vercel Analytics** — conversion tracking

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Supabase keys
npm run dev                  # http://localhost:3000
npm run build
npm run start
```

See [`docs/developer-workflows.md`](docs/developer-workflows.md) for API
payloads, environment behavior, local fallbacks, and troubleshooting.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql)
3. Copy **Project URL** and **service_role** key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> The service role key is server-only — never expose it in client code.

Without Supabase, reservations fall back to local file storage; enquiries require Supabase.

## Optional integrations

```env
RESEND_API_KEY=           # Email notifications
RESERVATION_EMAIL=        # Maître d' inbox
NEWSLETTER_EMAIL=         # Newsletter signups
CALLMEBOT_API_KEY=        # Auto WhatsApp to restaurant
```

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/reservations` | Table reservation requests |
| `GET /api/availability` | Live slot availability |
| `POST /api/enquiries` | Experience, event & gift enquiries |
| `POST /api/newsletter` | Newsletter signups |

Route contracts, example requests, persistence behavior, and notification
fallbacks are documented in
[`docs/developer-workflows.md`](docs/developer-workflows.md).

## Sections

Hero · Walkthrough · Menu · Tasting Journey · Cellar · Chef · Experiences · Events · Gallery ·
Reservations · FAQ · Contact · Gifts

## i18n

English and French — toggle in the navbar.

## Performance & SEO

- Code-split 3D and heavy sections
- `next/image` with responsive sizes
- Hero video on all devices (muted autoplay)
- JSON-LD Restaurant + FAQPage
- `/privacy` policy page
- Vercel Analytics events on key conversions

## Customisation

- Brand, menu, events → `src/lib/data.ts`
- French copy → `src/lib/locale-data.ts`
- UI strings → `src/lib/i18n.ts`
