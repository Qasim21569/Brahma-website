/**
 * Shared .env.local loader for the Node scripts (editors, photo migration).
 * Tolerates a UTF-16 file — PowerShell's default for `>` — see HANDOFF.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvLocal(root) {
  const file = resolve(root, ".env.local");
  if (!existsSync(file)) return;
  const buf = readFileSync(file);
  const text =
    buf[0] === 0xff && buf[1] === 0xfe ? buf.toString("utf16le") : buf.toString("utf8");
  for (const raw of text.replace(/^﻿/, "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

/** Service-role connection, or exit with instructions. Local scripts only. */
export function requireAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const fail = (msg) => {
    console.error(`\n✗ ${msg}\n`);
    process.exit(1);
  };
  if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is missing from .env.local.");
  if (!secret)
    fail(
      "SUPABASE_SECRET_KEY is missing from .env.local.\n" +
        "  Supabase → project → Project Settings → API Keys → Secret keys → copy,\n" +
        "  then add a line:  SUPABASE_SECRET_KEY=sb_secret_…  (local only — never on Vercel)",
    );
  if (secret.startsWith("sb_publishable_"))
    fail("SUPABASE_SECRET_KEY holds the PUBLISHABLE key. It needs the secret key.");
  return { url, secret };
}
