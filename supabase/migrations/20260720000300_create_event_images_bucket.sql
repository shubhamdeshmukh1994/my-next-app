-- Public storage bucket for event images, uploaded server-side via
-- POST /api/events. Public (unlike the private `user_images` bucket used
-- for profile photos) since event images are meant to be publicly visible
-- content -- a plain public URL is stored in events.image, no signed-URL
-- refresh logic needed.

insert into storage.buckets (id, name, public)
values ('event_images', 'event_images', true)
on conflict (id) do nothing;

-- Public read + write, matching the events/bookings/users tables' access
-- pattern (client/server talk to Supabase directly with the anon key, no
-- auth gating).
drop policy if exists "Public read access for event_images" on storage.objects;
create policy "Public read access for event_images"
on storage.objects for select
using (bucket_id = 'event_images');

drop policy if exists "Public write access for event_images" on storage.objects;
create policy "Public write access for event_images"
on storage.objects for insert
with check (bucket_id = 'event_images');

drop policy if exists "Public update access for event_images" on storage.objects;
create policy "Public update access for event_images"
on storage.objects for update
using (bucket_id = 'event_images');

drop policy if exists "Public delete access for event_images" on storage.objects;
create policy "Public delete access for event_images"
on storage.objects for delete
using (bucket_id = 'event_images');
