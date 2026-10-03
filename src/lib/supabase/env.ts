/**
 * Supabase connection settings.
 *
 * Both values are PUBLIC by design — the publishable (anon) key only carries
 * what row-level security allows anonymous visitors to do, which here is read
 * the published content. Write access comes from a signed-in session plus a
 * row in `public.editors`, never from a key in the bundle.
 *
 * No service-role key is used anywhere in this app. Keep it that way.
 */
export type SupabaseEnv = { url: string; key: string };

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).",
    );
  }
  return env;
}

/** Hostname of the project, for next/image remotePatterns. */
export function supabaseHostname(): string | null {
  const env = getSupabaseEnv();
  if (!env) return null;
  try {
    return new URL(env.url).hostname;
  } catch {
    return null;
  }
}
