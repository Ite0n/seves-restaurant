# Developer workflows

This guide documents the runtime paths that are easy to miss when changing the
reservation, enquiry, newsletter, media, or analytics flows.

## Environment contract

Start from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=re_xxxxxxxx
RESERVATION_EMAIL=info@seveslb.com
NEWSLETTER_EMAIL=info@seveslb.com
CALLMEBOT_API_KEY=your_key_here
```

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase writes and availability backed by stored reservations | Public project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase admin client | Never expose this key to client components. API routes use it with RLS enabled and no public policies. |
| `RESEND_API_KEY` + `RESERVATION_EMAIL` | Reservation and enquiry email notifications | Both must be set before the route calls Resend. |
| `NEWSLETTER_EMAIL` | Newsletter notification emails | Used only when `RESEND_API_KEY` is also set. |
| `CALLMEBOT_API_KEY` | Automatic WhatsApp push to the restaurant | If absent or rejected, reservation UI opens a `wa.me` fallback for the guest to send manually. |

Run `supabase/schema.sql` in the Supabase SQL Editor before enabling the
Supabase variables. It creates `reservations`, `enquiries`, and
`newsletter_subscribers`, enables RLS, and intentionally adds no public policies;
all writes go through Next.js API routes with the service role key.

## Reservation flow

Codepaths:

- Client form: `src/components/Reservation.tsx`
- Route: `src/app/api/reservations/route.ts`
- Validation: `src/lib/validations.ts`
- Availability: `src/lib/availability.ts`
- Persistence: `src/lib/db/reservations.ts`
- Local fallback: `src/lib/reservations-store.ts`
- WhatsApp helper: `src/lib/whatsapp.ts`

### Availability

`GET /api/availability?date=YYYY-MM-DD` returns the fixed service slots from
`TIME_SLOTS` (`18:00`, `19:00`, `20:00`, `21:00`, `22:00`). Each starts with a
capacity of `8`; the API subtracts the number of stored reservation records for
that date/time and returns `limited: true` when two or fewer slots are available.

```bash
curl "http://localhost:3000/api/availability?date=2026-08-10"
```

```json
{
  "date": "2026-08-10",
  "slots": [
    { "time": "18:00", "available": true, "remaining": 8 }
  ],
  "limited": false
}
```

Constraints:

- `date` must match `YYYY-MM-DD`; invalid or missing values return `400`.
- Availability subtracts reservation records, not guest counts.
- External callers should use one of the published `TIME_SLOTS`; the server
  schema currently validates that `time` is present, while the UI constrains the
  value through the availability response.

### Create a reservation

```bash
curl -X POST "http://localhost:3000/api/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maya Haddad",
    "phone": "+961 70 123 456",
    "email": "maya@example.com",
    "date": "2026-08-10",
    "time": "20:00",
    "guests": "2",
    "notes": "Terrace if available"
  }'
```

Success response:

```json
{
  "success": true,
  "message": "Your reservation request has been received.",
  "reference": "SV-LABC123",
  "whatsappSent": false
}
```

Operational behavior:

- Past dates return `400`.
- A slot that is no longer available returns `409`.
- With Supabase configured, rows are inserted into `public.reservations`.
- Without Supabase, reservations fall back to `data/reservations.json`; if the
  filesystem is read-only, they remain in process memory only. This is useful for
  local development but is not durable enough for production.
- When `CALLMEBOT_API_KEY` is configured, the route attempts an automatic
  WhatsApp notification and returns whether it succeeded. If it fails, the client
  opens a manual WhatsApp URL built from the same reservation details.
- When `RESEND_API_KEY` and `RESERVATION_EMAIL` are configured, the route emails
  the restaurant. If the guest provided an email, it also sends a confirmation.

## Enquiry flow

Codepaths:

- Modal: `src/components/ExperienceEnquiryModal.tsx`
- Route: `src/app/api/enquiries/route.ts`
- Persistence and WhatsApp formatting: `src/lib/db/enquiries.ts`

Enquiries support experiences, events, and gift requests. They require Supabase;
without both Supabase variables the route returns `503` and asks the guest to
email directly.

```bash
curl -X POST "http://localhost:3000/api/enquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "experience",
    "sourceId": "chef-table",
    "sourceTitle": "Chef'\''s Table",
    "name": "Maya Haddad",
    "email": "maya@example.com",
    "preferredDate": "2026-08-10",
    "message": "Celebrating an anniversary"
  }'
```

Success response:

```json
{ "success": true, "whatsappSent": false }
```

Constraints:

- `source` must be `experience`, `event`, or `gift`.
- `sourceId`, `sourceTitle`, `name`, and a valid `email` are required.
- `message` is capped at 1000 characters.
- Resend notification uses `RESERVATION_EMAIL`; WhatsApp uses the same
  `CALLMEBOT_API_KEY` integration as reservations.

## Newsletter flow

Codepaths:

- Footer form: `src/components/Footer.tsx`
- Route: `src/app/api/newsletter/route.ts`
- Persistence: `src/lib/db/newsletter.ts`

```bash
curl -X POST "http://localhost:3000/api/newsletter" \
  -H "Content-Type: application/json" \
  -d '{ "email": "guest@example.com" }'
```

Behavior:

- The email is lowercased and trimmed before storage.
- Supabase writes use an upsert on `newsletter_subscribers.email`.
- Without Supabase, persistence returns `false`, but the API still responds with
  `{ "success": true }` so the marketing form remains low-friction.
- Invalid email payloads return `400`.

## Media and motion checks

Codepaths:

- Hero media constants: `src/lib/critical-assets.ts`
- Hero playback: `src/components/Hero.tsx`
- Autoplay helper: `src/lib/video-autoplay.ts`
- Walkthrough: `src/components/Walkthrough.tsx`
- GSAP scroll hooks: `src/hooks/useGsapScroll.ts`
- Media docs: `public/video/README.md`, `public/audio/README.md`

Important constraints:

- The source constants expect the hero video at `/video/hero.mp4` and the poster
  at `/images/hero-terrace-firewater.webp`; keep generated media filenames and
  source references in sync.
- `RootLayout` preloads the hero video. The `Hero` component renders it only on
  the client when `prefers-reduced-motion` is not set and data saver is not
  enabled.
- The `<video>` element sits outside transformed ancestors because desktop
  Chrome and Edge may fail to paint videos inside transformed layers.
- `bindMutedAutoplay` keeps the video muted/inline, retries after readiness
  events, resumes on visibility changes, and unlocks playback after the first
  user gesture.
- `Walkthrough` defaults to WebGL on desktop when reduced motion is off, and
  otherwise uses image stations. Set `WALKTHROUGH_VIDEO` to
  `/video/walkthrough.mp4` only after adding a compressed production video.
- Scroll-driven sections should keep the existing reduced-motion and mobile
  branches in `useGsapScroll.ts`; desktop paths use pinned horizontal tracks,
  while mobile paths use one-way reveal animations.

## Local verification

Use these checks after touching the documented flows:

```bash
npm run lint
npm run build
```

Manual smoke tests:

1. Run `npm run dev`.
2. Request availability for a future date and confirm the reservation form uses
   the returned slots.
3. Submit a reservation with Supabase configured and verify a row in
   `public.reservations`; repeat without Supabase to verify local fallback.
4. Submit an enquiry with Supabase disabled and confirm the route returns `503`.
5. Submit a newsletter email twice and confirm Supabase keeps one subscriber row.
6. Load the homepage with reduced motion enabled and confirm hero/walkthrough
   fallbacks render without autoplay or WebGL requirements.

## Troubleshooting

| Symptom | Likely cause | Check |
| --- | --- | --- |
| `POST /api/enquiries` returns `503` | Supabase URL or service role key missing | Confirm both Supabase variables are present in the runtime environment. |
| Reservations appear available after deploy restart | App is using local/in-memory fallback | Configure Supabase for durable production reservations. |
| WhatsApp opens for the guest after reservation | CallMeBot key missing, invalid, or API returned an error | Check `CALLMEBOT_API_KEY` and the route response `whatsappSent`. |
| Emails are not sent | Resend key or destination email missing | Set `RESEND_API_KEY` plus `RESERVATION_EMAIL` or `NEWSLETTER_EMAIL`. |
| Hero video does not appear | Reduced motion, data saver, missing asset, video load error, or playback block | Confirm `/video/hero.mp4` exists, source image paths match generated files, data saver is off, and browser console has no media errors. |
| ScrollTrigger measurements drift after image changes | Images changed dimensions or lazy-loaded late | Keep `refreshScrollOnImages` in the GSAP hooks and rerun the affected page in desktop and mobile widths. |
