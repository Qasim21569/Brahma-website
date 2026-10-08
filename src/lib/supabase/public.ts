import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/** Cache tag on every public content read. Saving in the admin expires it. */
export const CONTENT_CACHE_TAG = "site-content";

/**
 * Identifies THIS build. Set once in next.config.mjs and inlined at compile
 * time, so it is constant for the life of a deployment and different for the
 * next one.
 *
 * ⚠️ Why it exists (found 2026-10-08): Next's fetch cache persists across
 * builds — locally in `.next/cache`, and on Vercel across deployments. The
 * first build, made before the portfolio was imported, cached Supabase's empty
 * answers for a YEAR, and every later build replayed them: the database held
 * 12 properties while builds reported the table empty. Sending the build stamp
 * as a header makes it part of the cache key, so a build can never read a
 * previous build's answers. Within one deployment, admin saves expire
 * CONTENT_CACHE_TAG.
 */
const BUILD_STAMP = process.env.CONTENT_BUILD_STAMP ?? "dev";

/**
 * Anonymous, cookie-less client for rendering the PUBLIC site.
 *
 * ⚠️ Deliberately not the cookie-aware SSR client. Reading `cookies()` is a
 * request-time API and would turn every page dynamic — the site would then
 * query the database on every visit instead of being served as static HTML
 * that is rebuilt only when an editor saves.
 *
 * `fresh: true` bypasses the cache entirely — for the keep-alive ping, which
 * is pointless unless it actually reaches the database.
 *
 * Returns null when Supabase is not configured, so the site still builds from
 * the in-repo defaults on a machine with no `.env.local`.
 */
export function createPublicClient({ fresh = false }: { fresh?: boolean } = {}) {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cachedFetch: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    headers.set("x-content-build", BUILD_STAMP);
    return fetch(
      input,
      fresh
        ? { ...init, headers, cache: "no-store" }
        : { ...init, headers, cache: "force-cache", next: { tags: [CONTENT_CACHE_TAG] } },
    );
  };

  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: cachedFetch },
  });
}
