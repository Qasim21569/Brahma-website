-- Defence in depth for the two content tables. Supabase's default privileges
-- give anon full DML (and TRUNCATE, which row-level security does not cover).
-- RLS already refuses anonymous writes; these grants are simply never needed.
-- The site reads as anon (SELECT); editors write as authenticated.
revoke insert, update, delete, truncate, references, trigger
  on public.site_content, public.properties from anon;
revoke truncate, references, trigger
  on public.site_content, public.properties from authenticated;
