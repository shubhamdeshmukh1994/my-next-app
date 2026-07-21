-- Bookings table, mirroring the Mongoose `Booking` schema (eventId, email,
-- createdAt/updatedAt) as a Postgres table for Supabase.
--
-- Where Mongoose validated `eventId` existence with an async pre('save')
-- lookup, Postgres enforces it natively via a foreign key -- no application
-- code needed for that check. `on delete cascade` is a Postgres-only addition
-- (the Mongoose schema had no delete behavior defined): deleting an event
-- removes its bookings instead of leaving them orphaned. Change to
-- `on delete restrict` if you'd rather block deleting events that still have
-- bookings.

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),

  event_id uuid not null references events(id) on delete cascade,
  email text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Same RFC 5322-ish pattern as the Mongoose validator.
  constraint bookings_email_format check (
    email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  ),

  -- One booking per event per email, matching Mongoose's `uniq_event_email` index.
  constraint uniq_event_email unique (event_id, email)
);

create index if not exists bookings_event_id_idx on bookings (event_id);
create index if not exists bookings_event_id_created_at_idx on bookings (event_id, created_at desc);
create index if not exists bookings_email_idx on bookings (email);

-- Mirrors Mongoose's `trim: true, lowercase: true` on email, and bumps
-- updated_at on every write.
create or replace function bookings_before_write()
returns trigger
language plpgsql
as $$
begin
  new.email := lower(trim(new.email));
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists bookings_before_write_trigger on bookings;
create trigger bookings_before_write_trigger
before insert or update on bookings
for each row
execute function bookings_before_write();

-- Public read + write, matching the events/users tables' access pattern
-- (client talks to Supabase directly with the anon key, no auth gating).
alter table bookings enable row level security;

drop policy if exists "Public read access" on bookings;
create policy "Public read access" on bookings
  for select using (true);

drop policy if exists "Public write access" on bookings;
create policy "Public write access" on bookings
  for all using (true) with check (true);
