import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./env";

/**
 * Cookie-aware client for the ADMIN — carries the editor's session, so every
 * query runs under their identity and row-level security decides what they
 * may write. Never use this in the public site's pages (see ./public.ts).
 */
export async function createServerSupabase() {
  // Read cookies FIRST: it marks the route as request-time, so admin pages are
  // never prerendered at build — even on a machine with no Supabase env.
  const cookieStore = await cookies();
  const { url, key } = requireSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // proxy refreshes the session on the next request, so this is safe.
        }
      },
    },
  });
}
