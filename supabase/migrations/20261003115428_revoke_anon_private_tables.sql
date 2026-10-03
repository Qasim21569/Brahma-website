-- Defence in depth: Supabase default privileges grant anon/authenticated broad
-- table rights; RLS already hid these rows, but nobody needs the grants.
revoke all on public.editors, public.content_revisions from anon;
revoke insert, update, delete, truncate, references, trigger on public.editors, public.content_revisions from authenticated;
