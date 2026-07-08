-- Sèves Restaurant — run in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

-- ─── Reservations ───────────────────────────────────────────────────────────
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  phone text not null,
  email text,
  date date not null,
  time text not null,
  guests text not null,
  notes text,
  experience_type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_reservations_date_time
  on public.reservations (date, time);

-- ─── Experience / event enquiries ───────────────────────────────────────────
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('experience', 'event', 'gift')),
  source_id text not null,
  source_title text not null,
  name text not null,
  email text not null,
  preferred_date date,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_enquiries_created_at
  on public.enquiries (created_at desc);

-- ─── Newsletter ─────────────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ─── RLS: service role only (API routes use SUPABASE_SERVICE_ROLE_KEY) ───────
alter table public.reservations enable row level security;
alter table public.enquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- No public policies — all access via service role from Next.js API routes.
