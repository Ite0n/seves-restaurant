# API, persistence, and notification runbook

This site keeps public forms behind Next.js App Router API routes. The routes
validate inputs, persist submissions when configured, and optionally notify the
restaurant by WhatsApp and email.

## Source map

| Concern | Source |
| --- | --- |
| API handlers | `src/app/api/*/route.ts` |
| Validation | `src/lib/validations.ts` |
| Supabase server client | `src/lib/supabase/server.ts` |
| Reservation persistence | `src/lib/db/reservations.ts`, `src/lib/reservations-store.ts` |
| Enquiry/newsletter persistence | `src/lib/db/enquiries.ts`, `src/lib/db/newsletter.ts` |
| Availability rules | `src/lib/availability.ts` |
| WhatsApp integration | `src/lib/whatsapp.ts` |
| Database schema | `supabase/schema.sql` |

## Environment matrix

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase persistence | Used with the service role key on server routes. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase persistence | Server-only secret. Do not expose this in client code. |
| `RESEND_API_KEY` | Email notifications | Optional; routes still complete without it. |
| `RESERVATION_EMAIL` | Reservation and enquiry emails | Enquiries also use this inbox. |
| `NEWSLETTER_EMAIL` | Newsletter notification emails | Only used by `/api/newsletter`. |
| `CALLMEBOT_API_KEY` | Automatic WhatsApp push | Optional; missing or failed sends return `whatsappSent: false`. |

Run `supabase/schema.sql` in the Supabase SQL Editor before enabling Supabase in
production. The schema enables RLS and intentionally defines no public policies;
the Next.js API routes access data through `SUPABASE_SERVICE_ROLE_KEY`.

## Request flow

```text
Browser form
  -> Next.js API route
  -> Zod validation
  -> Supabase if configured
     -> local reservation fallback only for reservations
  -> optional CallMeBot WhatsApp notification
  -> optional Resend email notification
  -> JSON response consumed by the UI
```

### Persistence behavior by route

| Route | Persistence behavior without Supabase |
| --- | --- |
| `POST /api/reservations` | Saves to `data/reservations.json` when the filesystem is writable; otherwise keeps reservations in process memory. |
| `GET /api/availability` | Reads Supabase reservations when configured; otherwise reads the local reservation store above. |
| `POST /api/enquiries` | Returns `503` because enquiries require Supabase. |
| `POST /api/newsletter` | Returns success for valid email even when Supabase is unavailable; the subscriber is not persisted. |

`/data/` is gitignored. On serverless or read-only filesystems, the reservation
fallback is process-local and can disappear across deployments, cold starts, or
instances. Configure Supabase for any production environment where reservations,
availability, enquiries, or newsletter subscribers must be durable.

## Routes

### `POST /api/reservations`

Creates a reservation request and returns a generated reference.

```json
{
  "name": "Maya Haddad",
  "phone": "+961 70 553 301",
  "email": "maya@example.com",
  "date": "2026-08-12",
  "time": "20:00",
  "guests": "4",
  "notes": "Anniversary dinner"
}
```

Response:

```json
{
  "success": true,
  "message": "Your reservation request has been received.",
  "reference": "SV-LZ4YQ0AM",
  "whatsappSent": false
}
```

Constraints:

- `date` must not be in the past.
- `notes` is limited to 500 characters.
- The reference format is `SV-` plus the current timestamp in base 36.
- If a selected slot has no remaining capacity, the route returns `409`.
- Capacity is checked before saving, so concurrent submissions can still race.
- The database has an `experience_type` column, but the current public
  reservation form does not send it.

Notifications:

- When `CALLMEBOT_API_KEY` is configured, the route tries to push a WhatsApp
  message to `96170553301`.
- The client opens a pre-filled `wa.me` message when `whatsappSent` is `false`.
- When `RESEND_API_KEY` and `RESERVATION_EMAIL` are set, the route emails the
  restaurant. If the guest supplied an email address, it also emails a guest
  acknowledgement.

### `GET /api/availability?date=YYYY-MM-DD`

Returns the availability model used by the reservation form.

```json
{
  "date": "2026-08-12",
  "slots": [
    { "time": "18:00", "available": true, "remaining": 8 },
    { "time": "19:00", "available": true, "remaining": 8 }
  ],
  "limited": false
}
```

Rules:

- `date` is required and must match `YYYY-MM-DD`.
- Slots are fixed at `18:00`, `19:00`, `20:00`, `21:00`, and `22:00`.
- Base capacity is `8` per slot.
- The route subtracts the number of saved reservation rows for the selected
  time. It does not subtract by the guest count string.
- `limited` is `true` when two or fewer slots are still available.

### `POST /api/enquiries`

Persists experience, event, and gift enquiries. Supabase must be configured.

```json
{
  "source": "experience",
  "sourceId": "chef-table",
  "sourceTitle": "Chef's Table",
  "name": "Maya Haddad",
  "email": "maya@example.com",
  "preferredDate": "2026-08-12",
  "message": "Do you have availability for six guests?"
}
```

Constraints:

- `source` must be `experience`, `event`, or `gift`.
- `name`, `email`, `sourceId`, and `sourceTitle` are required.
- `message` is limited to 1000 characters.
- Without Supabase, the route returns `503` with a direct-email fallback message.

Notifications:

- Uses the same optional CallMeBot WhatsApp notification path as reservations.
- Uses `RESERVATION_EMAIL` for Resend email notifications.

### `POST /api/newsletter`

Subscribes a normalized email address.

```json
{
  "email": "guest@example.com"
}
```

Behavior:

- The email is lowercased and trimmed before persistence.
- Supabase uses `upsert(..., { onConflict: "email" })`, so repeated signups are
  idempotent.
- The route returns `{ "success": true }` for any valid email even if Supabase
  is not configured or the upsert fails.
- Invalid email input returns `400`.
- When `RESEND_API_KEY` and `NEWSLETTER_EMAIL` are configured, the route emails
  the newsletter inbox.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Enquiry modal says enquiries are unavailable | Confirm both Supabase env vars are set and `supabase/schema.sql` has been run. |
| Reservation succeeds locally but disappears later | The route is using `data/reservations.json` or process memory. Configure Supabase for durable storage. |
| Availability looks wrong in production | Confirm all instances point at the same Supabase project; local fallback state is not shared. Also remember capacity counts reservation rows, not guest totals. |
| WhatsApp does not auto-send | Check `CALLMEBOT_API_KEY`. The UI should still open a manual `wa.me` message when auto-send fails. |
| Email notifications are missing | Check `RESEND_API_KEY` and the appropriate recipient env var. Reservation/enquiry emails use `RESERVATION_EMAIL`; newsletter emails use `NEWSLETTER_EMAIL`. |
| Supabase requests fail despite env vars | Verify the service role key is server-only, tables exist, and RLS has no public policies. API routes rely on service role privileges. |

## Operational checklist

Before shipping a production deployment:

1. Run `supabase/schema.sql` against the production Supabase project.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the hosting
   environment.
3. Set `RESEND_API_KEY`, `RESERVATION_EMAIL`, and `NEWSLETTER_EMAIL` if email
   notifications are required.
4. Set `CALLMEBOT_API_KEY` if automatic WhatsApp notifications are required.
5. Submit one reservation, one enquiry, and one newsletter email in preview.
6. Confirm the rows appear in Supabase and optional notifications reach the
   expected inboxes/devices.
