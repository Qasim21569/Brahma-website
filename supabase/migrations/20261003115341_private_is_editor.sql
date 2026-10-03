-- Follow-up from the Supabase security advisor (lints 0028/0029).
--
-- `public.is_editor()` is SECURITY DEFINER, and everything in `public` is served
-- by the Data API — so it was callable as POST /rest/v1/rpc/is_editor. It only
-- ever answers "am I an editor?" about the caller, but nothing needs it as an
-- endpoint. It moves to a `private` schema, which the API does not expose;
-- policies can still call it (they need USAGE on the schema + EXECUTE).
--
-- Also indexes the three `updated_by` / `edited_by` foreign keys (advisor 0001).

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.editors where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_editor() from public;
grant execute on function private.is_editor() to anon, authenticated;

-- Re-point every policy at the private function.
alter policy "Editors can read revisions" on public.content_revisions
  using ((select private.is_editor()));

alter policy "Editors can insert site content" on public.site_content
  with check ((select private.is_editor()));
alter policy "Editors can update site content" on public.site_content
  using ((select private.is_editor())) with check ((select private.is_editor()));
alter policy "Editors can delete site content" on public.site_content
  using ((select private.is_editor()));

alter policy "Signed-in users read published, editors read all" on public.properties
  using (published or (select private.is_editor()));
alter policy "Editors can insert properties" on public.properties
  with check ((select private.is_editor()));
alter policy "Editors can update properties" on public.properties
  using ((select private.is_editor())) with check ((select private.is_editor()));
alter policy "Editors can delete properties" on public.properties
  using ((select private.is_editor()));

alter policy "Editors can list media" on storage.objects
  using (bucket_id = 'media' and (select private.is_editor()));
alter policy "Editors can upload media" on storage.objects
  with check (bucket_id = 'media' and (select private.is_editor()));
alter policy "Editors can replace media" on storage.objects
  using (bucket_id = 'media' and (select private.is_editor()));
alter policy "Editors can delete media" on storage.objects
  using (bucket_id = 'media' and (select private.is_editor()));

drop function public.is_editor();

create index if not exists content_revisions_edited_by_idx on public.content_revisions (edited_by);
create index if not exists properties_updated_by_idx on public.properties (updated_by);
create index if not exists site_content_updated_by_idx on public.site_content (updated_by);
