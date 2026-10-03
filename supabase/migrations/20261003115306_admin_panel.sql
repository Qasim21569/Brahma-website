-- ════════════════════════════════════════════════════════════════════════════
-- BRAHMAS admin panel — schema, row-level security, revision history, media.
--
-- Model (see docs/ADMIN-PANEL.md):
--   site_content  one row per page section, keyed "home.hero" etc. `data` holds
--                 ONLY what an editor has saved; the code carries the defaults,
--                 so a section nobody has edited renders exactly as before.
--   properties    the portfolio. Authoritative once seeded. The Google Places
--                 overlay (places.generated.json) still applies on top at read
--                 time, and a value set here always wins over it.
--   content_revisions  the previous version of every row, on every update and
--                 delete — the editor's undo. Written by trigger only.
--   editors       the allow-list. Being signed in is NOT enough to edit; the
--                 user must also have a row here. Public sign-ups therefore
--                 cannot grant write access even if they are left enabled.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Editors ────────────────────────────────────────────────────────────────

create table public.editors (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.editors enable row level security;

-- SECURITY DEFINER so policies can call it without the caller needing read
-- access to `editors` itself. Empty search_path: every reference is qualified.
create or replace function public.is_editor()
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

create policy "Editors can see their own row"
  on public.editors for select to authenticated
  using (user_id = (select auth.uid()));

-- ── Shared triggers ─────────────────────────────────────────────────────────

create or replace function public.stamp_edit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := (select auth.uid());
  return new;
end;
$$;

create or replace function public.log_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb := to_jsonb(old);
begin
  insert into public.content_revisions (table_name, record_key, operation, data, edited_by)
  values (
    tg_table_name,
    coalesce(old_row ->> 'key', old_row ->> 'slug'),
    lower(tg_op),
    old_row,
    (select auth.uid())
  );
  return coalesce(new, old);
end;
$$;

-- ── Revisions ───────────────────────────────────────────────────────────────

create table public.content_revisions (
  id          bigint generated always as identity primary key,
  table_name  text not null check (table_name in ('site_content', 'properties')),
  record_key  text not null,
  operation   text not null check (operation in ('update', 'delete')),
  -- The row as it was BEFORE the change.
  data        jsonb not null,
  edited_by   uuid references auth.users (id) on delete set null,
  edited_at   timestamptz not null default now()
);

create index content_revisions_record_idx
  on public.content_revisions (table_name, record_key, edited_at desc);

alter table public.content_revisions enable row level security;

create policy "Editors can read revisions"
  on public.content_revisions for select to authenticated
  using ((select public.is_editor()));

-- ── Site content ────────────────────────────────────────────────────────────

create table public.site_content (
  key        text primary key check (key ~ '^[a-z]+(\.[a-zA-Z0-9]+)+$'),
  data       jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.site_content enable row level security;

create policy "Anyone can read site content"
  on public.site_content for select to anon, authenticated
  using (true);

create policy "Editors can insert site content"
  on public.site_content for insert to authenticated
  with check ((select public.is_editor()));

create policy "Editors can update site content"
  on public.site_content for update to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

create policy "Editors can delete site content"
  on public.site_content for delete to authenticated
  using ((select public.is_editor()));

create trigger site_content_stamp
  before insert or update on public.site_content
  for each row execute function public.stamp_edit();

create trigger site_content_revision
  after update or delete on public.site_content
  for each row execute function public.log_revision();

-- ── Properties ──────────────────────────────────────────────────────────────

create table public.properties (
  -- The slug is the public URL AND the photo directory path. Never changed
  -- after creation — the admin does not offer it.
  slug       text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  position   integer not null default 0,
  published  boolean not null default true,
  data       jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index properties_position_idx on public.properties (position);

alter table public.properties enable row level security;

create policy "Anyone can read published properties"
  on public.properties for select to anon
  using (published);

create policy "Signed-in users read published, editors read all"
  on public.properties for select to authenticated
  using (published or (select public.is_editor()));

create policy "Editors can insert properties"
  on public.properties for insert to authenticated
  with check ((select public.is_editor()));

create policy "Editors can update properties"
  on public.properties for update to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

create policy "Editors can delete properties"
  on public.properties for delete to authenticated
  using ((select public.is_editor()));

create trigger properties_stamp
  before insert or update on public.properties
  for each row execute function public.stamp_edit();

create trigger properties_revision
  after update or delete on public.properties
  for each row execute function public.log_revision();

-- ── Grants ──────────────────────────────────────────────────────────────────
-- Explicit, rather than relying on the project's default privileges: newer
-- Supabase projects can ship with tables NOT exposed to the Data API.

grant usage on schema public to anon, authenticated;
grant select on public.site_content, public.properties to anon, authenticated;
grant insert, update, delete on public.site_content, public.properties to authenticated;
grant select on public.content_revisions, public.editors to authenticated;
grant execute on function public.is_editor() to anon, authenticated;
revoke execute on function public.log_revision() from anon, authenticated, public;

-- ── Media bucket ────────────────────────────────────────────────────────────
-- Public read (the site serves these through next/image). 10 MB cap per file;
-- the admin resizes in the browser before upload, so real files are far
-- smaller. SVG deliberately excluded — it can carry script.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "Editors can list media"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_editor()));

create policy "Editors can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_editor()));

create policy "Editors can replace media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_editor()));

create policy "Editors can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_editor()));
