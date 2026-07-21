-- Tables created via raw SQL (SQL Editor) don't automatically get the
-- table-level GRANTs that Supabase's Table Editor applies for you. RLS
-- policies only filter rows -- without an underlying GRANT, PostgREST's
-- schema introspection (scoped to what the connecting role can access)
-- can't see the table at all, surfacing as "Could not find the table
-- 'public.events' in the schema cache" even though the table exists.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.events to anon, authenticated;
grant select, insert, update, delete on public.bookings to anon, authenticated;
