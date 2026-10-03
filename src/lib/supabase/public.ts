import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * Anonymous, cookie-less client for rendering the PUBLIC site.
 *
 * ⚠️ Deliberately not the cookie-aware SSR client. Reading `cookies()` is a
 * request-time API and would turn every page dynamic — the site would then
 * query the database on every visit instead of being served as static HTML
 * that is rebuilt only when an editor saves.
 *
 * Returns null when Supabase is not configured, so the site still builds from
 * the in-repo defaults on a machine with no `.env.local`.
 */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
