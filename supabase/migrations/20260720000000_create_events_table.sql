-- Events table, mirroring the Mongoose `Event` schema (title, slug, description,
-- overview, image, venue, location, date, time, mode, audience, agenda,
-- organizer, tags, createdAt/updatedAt) as a Postgres table for Supabase.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_mode') then
    create type event_mode as enum ('online', 'offline', 'hybrid');
  end if;
end
$$;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),

  title varchar(100) not null,
  slug varchar not null,
  description varchar(1000) not null,
  overview varchar(500) not null,
  image text not null,
  venue text not null,
  location text not null,
  date date not null,
  time time not null,
  mode event_mode not null,
  audience text not null,
  agenda text[] not null,
  organizer text not null,
  tags text[] not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_agenda_not_empty check (array_length(agenda, 1) > 0),
  constraint events_tags_not_empty check (array_length(tags, 1) > 0)
);

create unique index if not exists events_slug_idx on events (slug);
create index if not exists events_date_mode_idx on events (date, mode);

-- Mirrors the Mongoose `generateSlug()` helper: lowercase, strip special
-- characters, collapse whitespace/hyphens, trim leading/trailing hyphens.
create or replace function generate_event_slug(title text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(
      regexp_replace(
        regexp_replace(lower(trim(title)), '[^a-z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
$$;

-- Mirrors the Mongoose pre('save') hook: regenerate slug when title changes
-- (or on insert), and bump updated_at on every write.
create or replace function events_before_write()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' or new.title is distinct from old.title then
    new.slug := generate_event_slug(new.title);
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists events_before_write_trigger on events;
create trigger events_before_write_trigger
before insert or update on events
for each row
execute function events_before_write();

-- Public read + write, matching the existing `users` table's access pattern
-- (client talks to Supabase directly with the anon key, no auth gating).
alter table events enable row level security;

drop policy if exists "Public read access" on events;
create policy "Public read access" on events
  for select using (true);

drop policy if exists "Public write access" on events;
create policy "Public write access" on events
  for all using (true) with check (true);
