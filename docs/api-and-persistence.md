# API and persistence runbook

This site exposes a small set of Next.js App Router API routes for reservation,
availability, enquiry, and newsletter flows. The routes are public HTTP
interfaces used by the homepage UI, but persistence is intentionally server-only:
the browser never receives the Supabase service role key.

## Source map

| Concern | Codepath |
| --- | --- |
| Reservation submit | `src/app/api/reservations/route.ts` |
| Slot availability | `src/app/api/availability/route.ts` |
| Experience/event/gift enquiry submit | `src/app/api/enquiries/route.ts` |
| Newsletter subscribe | `src/app/api/newsletter/route.ts` |
| Request validation | `src/lib/validations.ts` |
| Supabase admin client | `src/lib/supabase/server.ts` |
| Reservation persistence | `src/lib/db/reservations.ts`, `src/lib/reservations-store.ts` |
| Enquiry persistence | `src/lib/db/enquiries.ts` |
| Newsletter persistence | `src/lib/db/newsletter.ts` |
| Availability rules | `src/lib/availability.ts` |
| WhatsApp notifications | `src/lib/whatsapp.ts` |
| Database schema | `supabase/schema.sql` |

## Environment variables

Copy `.env.example` to `.env.local` for local development.

| Variable | Required | Used by | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for Supabase-backed writes | Supabase admin client | Public project URL is safe to expose, but it is only used server-side here. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for Supabase-backed writes | Supabase admin client | Server-only secret. Never expose this in client components or logs. |
| `RESEND_API_KEY` | Optional | Reservation, enquiry, newsletter email notifications | Enables outbound email when paired with the relevant recipient variable. |
| `RESERVATION_EMAIL` | Optional | Reservation and enquiry email notifications | Restaurant inbox for reservation and enquiry notifications. |
| `NEWSLETTER_EMAIL` | Optional | Newsletter notification email | Inbox notified when a subscriber signs up. |
| `CALLMEBOT_API_KEY` | Optional | WhatsApp notifications | Enables automatic WhatsApp push. Without it, reservation UI opens a WhatsApp deep link as a fallback. |

Supabase is recommended for all production flows. Reservations can fall back to
local storage in development; enquiries require Supabase and return `503` when
it is not configured.

## Database model

Run `supabase/schema.sql` in the Supabase SQL editor before enabling the API in a
deployed environment. The script creates:

- `public.reservations`
- `public.enquiries`
- `public.newsletter_subscribers`
- `idx_reservations_date_time` for availability lookups by date/time
- `idx_enquiries_created_at` for back-office enquiry review

Row level security is enabled on every table, and the schema intentionally does
not define public policies. Access should go through the server-side API routes
using `SUPABASE_SERVICE_ROLE_KEY`.

## Route contracts

### `POST /api/reservations`

Stores a table reservation request, sends optional notifications, and returns a
reference number.

Request body:

```json
{
  "name": "Jane Guest",
  "phone": "+961 70 553 301",
  "email": "jane@example.com",
  "date": "2026-09-12",
  "time": "20:00",
  "guests": "2",
  "notes": "Terrace if available"
}
```

Validation and constraints:

- `name` must have at least 2 characters.
- `phone` must have at least 8 characters.
- `email` is optional, but must be valid when provided.
- `date`, `time`, and `guests` are required.
- `notes` is optional and capped at 500 characters.
- Past dates are rejected with `400`.
- If the requested slot is fully booked, the route returns `409`.

Success response:

```json
{
  "success": true,
  "message": "Your reservation request has been received.",
  "reference": "SV-LXABC123",
  "whatsappSent": false
}
```

Operational notes:

- References are generated as `SV-` plus the current timestamp encoded in base
  36.
- If Supabase is configured, reservations are inserted into
  `public.reservations`.
- If Supabase is not configured, reservations are written to
  `data/reservations.json` when the filesystem is writable; otherwise they are
  kept in process memory only. Treat this fallback as development-only.
- Resend notifications are sent only when both `RESEND_API_KEY` and
  `RESERVATION_EMAIL` exist. Guest confirmation email is sent only when the
  submitted reservation includes an email address.
- Automatic WhatsApp sends require `CALLMEBOT_API_KEY`. The response includes
  `whatsappSent` so the client can decide whether to open a manual WhatsApp URL.

### `GET /api/availability?date=YYYY-MM-DD`

Returns bookable slots for a date.

Example:

```bash
curl "http://localhost:3000/api/availability?date=2026-09-12"
```

Success response:

```json
{
  "date": "2026-09-12",
  "slots": [
    { "time": "18:00", "available": true, "remaining": 8 },
    { "time": "19:00", "available": true, "remaining": 8 },
    { "time": "20:00", "available": true, "remaining": 7 },
    { "time": "21:00", "available": true, "remaining": 8 },
    { "time": "22:00", "available": true, "remaining": 8 }
  ],
  "limited": false
}
```

Rules:

- `date` must match `YYYY-MM-DD`; missing or malformed dates return `400`.
- Base slots are fixed at `18:00`, `19:00`, `20:00`, `21:00`, and `22:00`.
- Each slot starts with a capacity of 8.
- Current availability subtracts the number of reservation rows for the slot,
  not the submitted guest count. A reservation for `7+` guests still consumes
  one slot unit.
- `limited` is `true` when two or fewer slots remain available.

### `POST /api/enquiries`

Stores enquiries for experiences, events, and gift experiences.

Request body:

```json
{
  "source": "experience",
  "sourceId": "chef-table",
  "sourceTitle": "Chef's Table",
  "name": "Jane Guest",
  "email": "jane@example.com",
  "preferredDate": "2026-09-12",
  "message": "Celebrating an anniversary"
}
```

Validation and constraints:

- `source` must be one of `experience`, `event`, or `gift`.
- `sourceId`, `sourceTitle`, `name`, and `email` are required.
- `name` must have at least 2 characters.
- `email` must be valid.
- `preferredDate` is optional.
- `message` is optional and capped at 1000 characters.

Behavior:

- Supabase must be configured; otherwise the route returns `503`.
- Valid enquiries are inserted into `public.enquiries`.
- Optional WhatsApp and Resend notifications follow the same environment
  variable pattern as reservations.
- Success response is `{ "success": true, "whatsappSent": boolean }`.

### `POST /api/newsletter`

Adds or updates a newsletter subscriber.

Request body:

```json
{ "email": "guest@example.com" }
```

Behavior:

- Email is normalized to lowercase and trimmed.
- With Supabase configured, the route upserts into
  `public.newsletter_subscribers` using `email` as the conflict target.
- Without Supabase, persistence is skipped but the route still returns success.
- Optional Resend notification requires both `RESEND_API_KEY` and
  `NEWSLETTER_EMAIL`.
- Invalid payloads return `400` with `{ "error": "Invalid email" }`.

## Local smoke checks

Start the app with `npm run dev`, then run:

```bash
curl "http://localhost:3000/api/availability?date=2026-09-12"

curl -X POST "http://localhost:3000/api/newsletter" \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@example.com"}'

curl -X POST "http://localhost:3000/api/reservations" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Guest","phone":"+96170553301","email":"jane@example.com","date":"2026-09-12","time":"20:00","guests":"2","notes":"Terrace if available"}'
```

For enquiry checks, configure Supabase first:

```bash
curl -X POST "http://localhost:3000/api/enquiries" \
  -H "Content-Type: application/json" \
  -d '{"source":"experience","sourceId":"chef-table","sourceTitle":"Chef Table","name":"Jane Guest","email":"jane@example.com"}'
```

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Enquiries return `503` | Confirm both Supabase environment variables exist and the schema was applied. |
| Reservations work locally but disappear after deploy | Supabase is missing; local file/process memory fallback is not durable on serverless hosts. |
| Availability does not decrease as expected | The API counts reservation rows per slot, not guests per reservation. |
| Reservation returns `409` | The selected slot has no remaining row capacity; fetch `/api/availability` again before retrying. |
| WhatsApp is not automatic | Confirm `CALLMEBOT_API_KEY`; otherwise the client should open a manual WhatsApp URL. |
| Notification emails are missing | Confirm `RESEND_API_KEY` plus `RESERVATION_EMAIL` or `NEWSLETTER_EMAIL`; the routes do not send email when the paired recipient variable is absent. |
| Supabase writes fail after deployment | Verify `SUPABASE_SERVICE_ROLE_KEY` is server-only, current, and has access to the project referenced by `NEXT_PUBLIC_SUPABASE_URL`. |
