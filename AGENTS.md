# AGENTS.md

## Cursor Cloud specific instructions

Sèves is a single Next.js 16 (App Router, Turbopack) restaurant website. There is no
separate backend service — API routes (`src/app/api/*`) run inside the same Next.js server.
There are no automated tests in this repo.

Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`). Node 22 is used.

### Environment / Supabase caveat (important)

The forms (reservations, enquiries, newsletter) use Supabase when configured, otherwise
reservations fall back to local file storage in `/data/reservations.json` (gitignored).

- `isSupabaseConfigured()` returns true whenever `NEXT_PUBLIC_SUPABASE_URL` **and**
  `SUPABASE_SERVICE_ROLE_KEY` are non-empty. If you copy `.env.example` verbatim, the
  placeholder URL (`https://your-project.supabase.co`) is treated as "configured" and every
  form / `GET /api/availability` request returns **500** (`getaddrinfo ENOTFOUND`).
- For local dev **without real Supabase credentials, leave those two vars empty** in
  `.env.local` so the file-storage fallback is used. `.env.local` is gitignored.
- Enquiries (`POST /api/enquiries`) require a real Supabase project; reservations,
  availability, and newsletter work without one via the fallback.

### Verifying reservations end-to-end

`POST /api/reservations` expects `guests` as a **string** (e.g. `"2"`, not `2`) — the Zod
schema in `src/lib/validations.ts` validates it as a string. A successful request returns a
reference like `SV-XXXXXXXX` and appends to `/data/reservations.json`.

The site defaults to a preloader animation and can toggle EN/FR in the navbar.
