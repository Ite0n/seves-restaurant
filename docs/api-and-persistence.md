# API and persistence runbook

This app exposes a small set of Next.js App Router API routes for reservation
requests, live availability, private enquiries, and newsletter signups. The
routes are used by the public landing page components and are designed to work
with Supabase in production.

## Source map

| Area | Source |
| --- | --- |
| Reservation form | `src/components/Reservation.tsx` |
| Enquiry modal | `src/components/ExperienceEnquiryModal.tsx` |
| Newsletter form | `src/components/Footer.tsx` |
| API routes | `src/app/api/*/route.ts` |
| Validation schemas | `src/lib/validations.ts` |
| Availability rules | `src/lib/availability.ts` |
| Supabase client | `src/lib/supabase/server.ts` |
| Database access | `src/lib/db/*.ts` |
| Local reservation fallback | `src/lib/reservations-store.ts` |
| Database schema | `supabase/schema.sql` |

## Environment variables

```env
# Required for Supabase persistence.
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional notification integrations.
RESEND_API_KEY=re_xxxxxxxx
RESERVATION_EMAIL=info@seveslb.com
NEWSLETTER_EMAIL=info@seveslb.com
CALLMEBOT_API_KEY=your_key_here
```

Constraints:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it to client
  components, browser bundles, analytics, logs, or public docs.
- Supabase is detected only when both `NEXT_PUBLIC_SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY` are present.
- The SQL schema enables RLS and intentionally defines no public policies.
  Server API routes use the service role client for all table access.

## Persistence model

| Data | Primary store | Fallback when Supabase is absent |
| --- | --- | --- |
| Reservations | `public.reservations` | `data/reservations.json`, then process memory if the filesystem is read-only |
| Enquiries | `public.enquiries` | None. The route returns `503` before validation or notifications. |
| Newsletter subscribers | `public.newsletter_subscribers` | None. The route still returns success unless validation or notification delivery throws. |

Local reservation fallback is useful for development only. On serverless
platforms the filesystem may be read-only or ephemeral, so production should be
configured with Supabase before accepting bookings.

## Public API routes

### `GET /api/availability?date=YYYY-MM-DD`

Returns the public slot inventory for one calendar date.

Example:

```bash
curl "http://localhost:3000/api/availability?date=2026-08-01"
```

Response:

```json
{
  "date": "2026-08-01",
  "slots": [
    { "time": "18:00", "available": true, "remaining": 8 },
    { "time": "19:00", "available": true, "remaining": 8 },
    { "time": "20:00", "available": true, "remaining": 8 },
    { "time": "21:00", "available": true, "remaining": 8 },
    { "time": "22:00", "available": true, "remaining": 8 }
  ],
  "limited": false
}
```

Rules:

- `date` is required and must match `YYYY-MM-DD`; otherwise the route returns
  `400`.
- Base slots are fixed in `src/lib/availability.ts`: `18:00`, `19:00`,
  `20:00`, `21:00`, and `22:00`.
- Each slot starts with capacity `8`.
- Availability subtracts the number of reservations for that date and time. It
  does not subtract the number of guests in each reservation.
- `limited` is `true` when two or fewer slots remain available.

### `POST /api/reservations`

Receives reservation requests from the public reservation form.

Example:

```bash
curl -X POST "http://localhost:3000/api/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maya Haddad",
    "phone": "+961 70 553 301",
    "email": "maya@example.com",
    "date": "2026-08-01",
    "time": "20:00",
    "guests": "2",
    "notes": "Window table if available"
  }'
```

Success response:

```json
{
  "success": true,
  "message": "Your reservation request has been received.",
  "reference": "SV-LZ...",
  "whatsappSent": false
}
```

Validation and behavior:

- `name` must be at least 2 characters.
- `phone` must be at least 8 characters.
- `email` is optional, but must be a valid email when provided.
- `date` is expected as the browser date input value (`YYYY-MM-DD`) and must
  not be in the past.
- `time` is expected to be one of the availability slots returned by
  `/api/availability`. The current server schema only requires a non-empty
  value, so keep clients constrained to the returned slot list.
- `guests` must be non-empty. The current UI sends `2`, `3`, `4`, `5`, `6`, or
  `7+`.
- `notes` is optional and capped at 500 characters.
- If the selected slot is known and unavailable, the route returns `409`.
- The route creates a reference in the form `SV-${timestampBase36}` and stores
  the reservation before sending notifications.

Notifications:

- If `CALLMEBOT_API_KEY` is configured, the route attempts an automatic
  WhatsApp notification and returns the result as `whatsappSent`.
- If CallMeBot is not configured or fails, the client opens a manual WhatsApp
  link with the same formatted message.
- If `RESEND_API_KEY` and `RESERVATION_EMAIL` are configured, the route sends
  an internal email. If the guest provided an email address, it also sends a
  guest acknowledgement.

### `POST /api/enquiries`

Receives private experience, event, and gift enquiries from the shared enquiry
modal.

Example:

```bash
curl -X POST "http://localhost:3000/api/enquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "event",
    "sourceId": "chef-table",
    "sourceTitle": "Chef Table",
    "name": "Maya Haddad",
    "email": "maya@example.com",
    "preferredDate": "2026-08-15",
    "message": "Private dinner for 10 guests."
  }'
```

Success response:

```json
{ "success": true, "whatsappSent": false }
```

Validation and behavior:

- Supabase is required. Without both Supabase environment variables, the route
  returns `503` with a temporary-unavailable message.
- `source` must be `experience`, `event`, or `gift`.
- `sourceId`, `sourceTitle`, `name`, and `email` are required.
- `email` must be valid.
- `preferredDate` is optional.
- `message` is optional and capped at 1000 characters.
- Successful requests are inserted into `public.enquiries`.
- WhatsApp and Resend notifications are attempted after persistence.

### `POST /api/newsletter`

Receives newsletter subscriptions from the footer form.

Example:

```bash
curl -X POST "http://localhost:3000/api/newsletter" \
  -H "Content-Type: application/json" \
  -d '{ "email": "maya@example.com" }'
```

Success response:

```json
{ "success": true }
```

Validation and behavior:

- `email` must be a valid email address.
- The email is lowercased and trimmed before storage.
- With Supabase configured, the route upserts into
  `public.newsletter_subscribers` using `email` as the conflict target.
- Without Supabase, no subscriber is stored, but the route still returns
  success.
- If `RESEND_API_KEY` and `NEWSLETTER_EMAIL` are configured, the route sends an
  internal notification email.

## Operational checks

After changing API, persistence, or schema code:

1. Run `npm run lint`.
2. Run `npm run build` for framework and type checking.
3. Verify the Supabase schema still matches the fields inserted by
   `src/lib/db/*.ts`.
4. Exercise the route you changed with a local `curl` request or through the
   relevant form.
5. For reservation changes, check both `/api/availability` and
   `/api/reservations` because availability reads from the same reservation
   store used by submissions.

## Troubleshooting

| Symptom | Likely cause | Check |
| --- | --- | --- |
| Enquiry form returns `503` | Supabase env vars missing | Confirm both Supabase variables are set in the runtime environment. |
| Reservations work locally but disappear after deploy | Local fallback is being used | Configure Supabase and run `supabase/schema.sql`. |
| Availability does not decrease as expected | Capacity subtracts reservation count, not guest count | Inspect rows for the date and slot in `public.reservations`. |
| Newsletter appears successful but no row is stored | Supabase is absent or upsert failed | Check Supabase env vars and the `newsletter_subscribers` table. |
| WhatsApp does not auto-send | `CALLMEBOT_API_KEY` missing or provider rejected the request | Check the `whatsappSent` response field and use the manual client link. |
| Emails are not delivered | Resend env vars missing, invalid, or provider delivery issue | Confirm `RESEND_API_KEY` and destination env vars are set. |

