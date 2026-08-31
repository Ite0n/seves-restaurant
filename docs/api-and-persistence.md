# API and persistence runbook

This site exposes a small set of public Next.js API routes for reservations,
slot availability, private-dining enquiries, and newsletter signups. The routes
live under `src/app/api/*/route.ts` and persist through Supabase when the
server-only service role key is configured.

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

RESEND_API_KEY=           # optional email notifications
RESERVATION_EMAIL=        # restaurant inbox for reservations/enquiries
NEWSLETTER_EMAIL=         # restaurant inbox for newsletter alerts
CALLMEBOT_API_KEY=        # optional WhatsApp push to the restaurant
```

- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only. Do not expose it from
  client components or `NEXT_PUBLIC_*` variables.
- Run `supabase/schema.sql` in the Supabase SQL Editor before enabling the
  production integrations.
- The schema enables row-level security and intentionally defines no public
  policies. All reads and writes go through the server-side API routes using the
  service role key.

## Route behavior

| Route | Source files | Persistence | Notes |
| --- | --- | --- | --- |
| `POST /api/reservations` | `src/app/api/reservations/route.ts`, `src/lib/db/reservations.ts` | Supabase `reservations`, then local fallback when Supabase is absent | Rejects past dates and unavailable slots. Returns `reference` and `whatsappSent`. |
| `GET /api/availability?date=YYYY-MM-DD` | `src/app/api/availability/route.ts`, `src/lib/availability.ts` | Reads `reservations` for the selected date | Requires a `YYYY-MM-DD` query value. |
| `POST /api/enquiries` | `src/app/api/enquiries/route.ts`, `src/lib/db/enquiries.ts` | Supabase `enquiries` only | Returns `503` when Supabase is not configured. |
| `POST /api/newsletter` | `src/app/api/newsletter/route.ts`, `src/lib/db/newsletter.ts` | Supabase `newsletter_subscribers` when configured | Normalizes email to lowercase and upserts by unique email. |

## Reservations and availability

Reservations are validated with `reservationSchema` in `src/lib/validations.ts`.
The server requires:

- `name`: at least 2 characters
- `phone`: at least 8 characters
- `date`: present, then checked server-side to avoid past dates
- `time`: present
- `guests`: present
- `email`: optional, but must be a valid email when provided
- `notes`: optional, max 500 characters

The availability model is intentionally simple:

- Fixed slots: `18:00`, `19:00`, `20:00`, `21:00`, `22:00`
- Base capacity: 8 per slot
- Remaining capacity subtracts the number of reservation rows for that slot
- Guest count is stored for staff context but is not currently used in the
  capacity calculation
- `limited` becomes `true` when two or fewer slots are still available

Example:

```bash
curl "http://localhost:3000/api/availability?date=2026-09-12"
```

```json
{
  "date": "2026-09-12",
  "slots": [
    { "time": "18:00", "available": true, "remaining": 8 }
  ],
  "limited": false
}
```

If Supabase is not configured, reservations fall back to
`data/reservations.json`. If that file cannot be written, they are kept in
process memory only. This is useful for local development but should not be
treated as durable production storage.

## Enquiries

Experience, event, and gift enquiry forms post to `/api/enquiries` through
`src/components/ExperienceEnquiryModal.tsx`.

Server validation accepts:

- `source`: one of `experience`, `event`, or `gift`
- `sourceId`: present
- `sourceTitle`: present
- `name`: at least 2 characters
- `email`: valid email
- `preferredDate`: optional
- `message`: optional, max 1000 characters

Unlike reservations, enquiries do not have a local persistence fallback. If
Supabase is missing, the route returns:

```json
{
  "error": "Enquiries are temporarily unavailable. Please email us directly."
}
```

with HTTP status `503`.

## Newsletter signups

`POST /api/newsletter` validates a single `email` field, lowercases and trims
it, then upserts into `newsletter_subscribers` on the `email` unique constraint.
When Supabase is not configured or an upsert fails, the helper returns `false`
but the route still responds with success after validation. This keeps the UI
flow non-blocking, but operators should monitor Supabase and notification
inboxes if newsletter capture is business-critical.

Example request:

```bash
curl -X POST "http://localhost:3000/api/newsletter" \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@example.com"}'
```

## Notifications

Two optional notification channels can run after successful form submissions:

1. **WhatsApp via CallMeBot**
   - Reservations and enquiries call `sendWhatsAppNotification()`.
   - Missing `CALLMEBOT_API_KEY` returns `whatsappSent: false`.
   - Reservation UI opens a manual `wa.me` link when automatic WhatsApp delivery
     is unavailable.
2. **Email via Resend**
   - Reservations and enquiries send to `RESERVATION_EMAIL` when
     `RESEND_API_KEY` is present.
   - Newsletter signups send to `NEWSLETTER_EMAIL` when configured.
   - The code does not inspect non-2xx Resend responses; network failures surface
     through the route catch blocks.

Do not log API keys, reservation contact details, or enquiry messages in server
logs. These payloads include customer contact data.

## Operational checks

When forms stop working, verify in this order:

1. Environment variables are present in the runtime environment.
2. `supabase/schema.sql` has been applied to the linked Supabase project.
3. The Supabase service role key is used only on the server.
4. RLS is enabled and there are no public policies on the three tables.
5. `idx_reservations_date_time` exists for availability lookups.
6. Optional notification services have valid keys and destination inboxes.
7. Local development fallback has write access to `data/reservations.json`, or
   the developer understands it is running in process-memory mode.

Run the standard verification before shipping API or schema changes:

```bash
npm run lint
npm run build
```
