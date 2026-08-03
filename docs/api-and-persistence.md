# API and persistence runbook

This runbook documents the public API routes, persistence behavior, and
operational constraints for Sèves reservations, enquiries, availability, and
newsletter signups. It is source-verified against `src/app/api/*`,
`src/lib/db/*`, `src/lib/availability.ts`, and `supabase/schema.sql`.

## Runtime dependencies

| Dependency | Env vars | Required for |
| --- | --- | --- |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Durable reservations, enquiries, newsletter subscribers, availability counts from database rows. |
| Resend | `RESEND_API_KEY`, `RESERVATION_EMAIL`, `NEWSLETTER_EMAIL` | Optional email notifications. |
| CallMeBot | `CALLMEBOT_API_KEY` | Optional WhatsApp push notifications to the restaurant number in `src/lib/whatsapp.ts`. |

The Supabase service role key is server-only. Do not expose it in client
components, `NEXT_PUBLIC_*` variables, analytics payloads, or logs.

## Route summary

| Route | Method | Success response | Validation / failure behavior |
| --- | --- | --- | --- |
| `/api/availability?date=YYYY-MM-DD` | `GET` | `{ date, slots, limited }` | Requires a `YYYY-MM-DD` query string. Supabase read errors are not caught in the route and surface as a server error. |
| `/api/reservations` | `POST` | `{ success, message, reference, whatsappSent }` | Zod validates fields; past dates return `400`; fully booked known slots return `409`; unexpected errors return `500`. |
| `/api/enquiries` | `POST` | `{ success, whatsappSent }` | Requires Supabase before parsing the body; missing Supabase returns `503`; invalid payloads return `400`. |
| `/api/newsletter` | `POST` | `{ success: true }` | Validates email; all caught failures return `400` with `Invalid email`. Supabase persistence is best-effort. |

## Supabase schema

Run `supabase/schema.sql` in the Supabase SQL Editor. It creates:

- `public.reservations`
- `public.enquiries`
- `public.newsletter_subscribers`

RLS is enabled on all three tables and the schema intentionally defines no
public policies. The Next.js API routes access the tables through the server
Supabase client in `src/lib/supabase/server.ts`, which uses the service role key
with Supabase auth session persistence disabled.

Indexes:

- `idx_reservations_date_time` supports availability lookups by date/time.
- `idx_enquiries_created_at` supports enquiry review by newest first.
- `newsletter_subscribers.email` is unique and used for upserts.

## Availability model

`src/lib/availability.ts` defines five fixed slots:

```ts
["18:00", "19:00", "20:00", "21:00", "22:00"]
```

Each slot starts with capacity `8`. `GET /api/availability` subtracts the
number of reservation rows for the requested date and time, not the number of
guests on those reservations. A party of 6 and a party of 2 both consume one
slot count.

`limited` is `true` when two or fewer slots remain available.

Example:

```bash
curl "http://localhost:3000/api/availability?date=2026-08-10"
```

## Reservation flow

1. Parse JSON and validate with `reservationSchema`.
2. Reject dates before today with `400`.
3. Load slot availability for the selected date.
4. If the submitted time matches a known slot and that slot is full, return
   `409`.
5. Generate a reference like `SV-ME7D4CE`.
6. Save the reservation.
7. Send optional WhatsApp and email notifications.
8. Return success with `whatsappSent`.

Example payload:

```bash
curl -X POST "http://localhost:3000/api/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mira Haddad",
    "phone": "+96170123456",
    "email": "mira@example.com",
    "date": "2026-08-10",
    "time": "20:00",
    "guests": "2",
    "notes": "Window table if possible"
  }'
```

Important constraints:

- The server schema currently requires a non-empty `time` but does not reject
  non-standard times unless they collide with a full known slot. UI clients
  should send one of the fixed slots above.
- Reservations are saved before notifications are sent. If a later notification
  request throws, the route can return an error after the reservation has
  already been persisted.
- The `guests` field is stored as text because the form schema treats it as a
  string.

## Reservation persistence fallback

`src/lib/db/reservations.ts` uses Supabase when both Supabase env vars exist.
Without Supabase it falls back to `src/lib/reservations-store.ts`:

1. Push the reservation into process memory.
2. Try to create/read/write `data/reservations.json`.
3. If the filesystem is read-only, keep memory-only data for the current
   process.

On Vercel or any serverless runtime, the local file fallback is not durable and
memory is per instance. Configure Supabase before treating reservations or
availability counts as operationally reliable.

## Enquiry flow

`POST /api/enquiries` is used by experience, event, and gift enquiry modals.

Payload constraints:

- `source`: `"experience" | "event" | "gift"`
- `sourceId`: non-empty string
- `sourceTitle`: non-empty string
- `name`: at least 2 characters
- `email`: valid email address
- `preferredDate`: optional string
- `message`: optional, max 1000 characters

Supabase is required. If it is missing, the route returns:

```json
{
  "error": "Enquiries are temporarily unavailable. Please email us directly."
}
```

with status `503`. After persistence, WhatsApp and Resend notifications are
best-effort integrations in the same request path.

## Newsletter flow

`POST /api/newsletter` accepts:

```json
{ "email": "guest@example.com" }
```

The route validates the email, normalizes it with lowercase/trim, and calls
`saveNewsletterSubscriber`. Supabase upserts into
`newsletter_subscribers(email)` with `onConflict: "email"`.

If Supabase is not configured, `saveNewsletterSubscriber` returns `false`, but
the route still returns `{ "success": true }` for a valid email. Treat
newsletter persistence as best-effort unless Supabase is configured and
monitored.

## Notification behavior

- WhatsApp uses CallMeBot through a `GET` request and returns `false` when
  `CALLMEBOT_API_KEY` is missing, the request fails, or the response body
  contains `error`.
- Reservation emails require `RESEND_API_KEY` and `RESERVATION_EMAIL`.
- Guest reservation confirmation email is sent only when the submitted payload
  includes `email`.
- Enquiry emails use `RESERVATION_EMAIL`.
- Newsletter emails use `NEWSLETTER_EMAIL`.

Do not include secrets, full API URLs with keys, or guest PII in logs.

## Operational checks

After changing API routes, schemas, or forms:

1. Run `npm run lint`.
2. Run `npm run build`.
3. With Supabase configured, submit one reservation and confirm it appears in
   `public.reservations`.
4. Check `GET /api/availability` for that date and confirm the matching slot
   decrements by one reservation row.
5. Submit one enquiry and confirm it appears in `public.enquiries`.
6. Submit the same newsletter email twice and confirm only one subscriber row
   exists.
7. Test missing optional notification env vars; requests should still complete
   where the source route treats notifications as optional.

## Common pitfalls

- Missing Supabase does not break reservations locally, but it makes production
  data and availability unreliable.
- Missing Supabase does break enquiries by design.
- Newsletter success does not prove the email was persisted.
- RLS has no public policies; browser-side Supabase clients cannot read or
  write these tables.
- Date validation is split: availability checks only the query format, while
  reservations also reject dates before today.
- Availability capacity counts reservations, not party size.
