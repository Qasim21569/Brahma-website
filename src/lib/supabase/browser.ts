"use client";

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser client for the admin — sign-in and direct image uploads to Storage.
 * NEXT_PUBLIC_* values are inlined at build time.
 */
export function createBrowserSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured for the browser.");
  }
  client = createBrowserClient(url, key);
  return client;
}
