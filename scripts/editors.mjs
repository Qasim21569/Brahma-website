#!/usr/bin/env node
/**
 * Manage who can sign in to /admin — run on YOUR machine only.
 *
 *   npm run editor -- list
 *   npm run editor -- add someone@example.com            (asks for a password)
 *   npm run editor -- add someone@example.com --admin
 *   npm run editor -- add someone@example.com --generate (makes a temporary password)
 *   npm run editor -- password someone@example.com       (set a new password)
 *   npm run editor -- remove someone@example.com         (revoke editing access)
 *   npm run editor -- remove someone@example.com --delete-account
 *
 * Needs SUPABASE_SECRET_KEY in .env.local (Supabase → Project Settings →
 * API Keys → Secret keys). That key bypasses all security rules, so:
 *   - it lives ONLY in .env.local on a trusted machine;
 *   - it is NEVER added to Vercel and never given a NEXT_PUBLIC_ prefix;
 *   - the website itself never reads it. Only this script does.
 *
 * Passwords are typed into a hidden prompt (or generated and shown once in
 * your terminal); they are never written to disk or logged.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import readline from "node:readline";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ── env ─────────────────────────────────────────────────────────────────────

function loadEnvLocal() {
  const file = resolve(ROOT, ".env.local");
  if (!existsSync(file)) return;
  const buf = readFileSync(file);
  // Tolerate a UTF-16 file (PowerShell's default) — see HANDOFF.
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

loadEnvLocal();

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!URL_) fail("NEXT_PUBLIC_SUPABASE_URL is missing from .env.local.");
if (!SECRET)
  fail(
    "SUPABASE_SECRET_KEY is missing from .env.local.\n" +
      "  Supabase → project → Project Settings → API Keys → Secret keys → copy,\n" +
      "  then add a line:  SUPABASE_SECRET_KEY=sb_secret_…\n" +
      "  (local only — never add it to Vercel)",
  );
if (SECRET.startsWith("sb_publishable_"))
  fail("SUPABASE_SECRET_KEY holds the PUBLISHABLE key. It needs the secret key.");

const supabase = createClient(URL_, SECRET, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── helpers ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 10;

function ask(question, { hidden = false } = {}) {
  return new Promise((resolveAnswer) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden && process.stdin.isTTY) {
      // Echo nothing while the password is typed.
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(question);
      };
    } else if (hidden) {
      console.log("  (this terminal cannot hide input — the password will be visible as you type)");
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolveAnswer(answer);
    });
  });
}

async function choosePassword(generate) {
  if (generate) {
    // 18 random bytes → 24 URL-safe characters.
    const pw = randomBytes(18).toString("base64url");
    return { password: pw, generated: true };
  }
  for (;;) {
    const a = await ask("  New password: ", { hidden: true });
    if (a.length < MIN_PASSWORD) {
      console.log(`  Use at least ${MIN_PASSWORD} characters.`);
      continue;
    }
    const b = await ask("  Repeat it:    ", { hidden: true });
    if (a !== b) {
      console.log("  Those did not match — try again.");
      continue;
    }
    return { password: a, generated: false };
  }
}

async function findUser(email) {
  // listUsers is paginated; editor counts here are tiny.
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) fail(`Could not list users: ${error.message}`);
    const hit = data.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

function requireEmail(email) {
  if (!email || !EMAIL_RE.test(email)) fail("Give an email address, e.g. npm run editor -- add name@example.com");
  return email.trim().toLowerCase();
}

// ── commands ────────────────────────────────────────────────────────────────

async function list() {
  const { data, error } = await supabase
    .from("editors")
    .select("email, role, created_at, user_id")
    .order("created_at");
  if (error) fail(error.message);
  if (!data.length) {
    console.log("\nNo editors yet. Add one with:  npm run editor -- add you@example.com --admin\n");
    return;
  }
  console.log("");
  for (const e of data) {
    const { data: u } = await supabase.auth.admin.getUserById(e.user_id);
    const last = u?.user?.last_sign_in_at
      ? new Date(u.user.last_sign_in_at).toLocaleString()
      : "never signed in";
    console.log(`  ${e.email.padEnd(36)} ${e.role.padEnd(7)} last sign-in: ${last}`);
  }
  console.log("");
}

async function add(emailArg, flags) {
  const email = requireEmail(emailArg);
  const role = flags.has("--admin") ? "admin" : "editor";

  let user = await findUser(email);
  let generatedPassword = null;

  if (user) {
    console.log(`\n${email} already has an account — granting editor access only.`);
  } else {
    console.log(`\nCreating an account for ${email}.`);
    const { password, generated } = await choosePassword(flags.has("--generate"));
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // no confirmation email needed (Supabase's mailer is restricted)
    });
    if (error) fail(`Could not create the account: ${error.message}`);
    user = data.user;
    if (generated) generatedPassword = password;
  }

  const { error } = await supabase
    .from("editors")
    .upsert({ user_id: user.id, email, role }, { onConflict: "user_id" });
  if (error) fail(`Account exists, but granting access failed: ${error.message}`);

  console.log(`✓ ${email} can now sign in at /admin as ${role === "admin" ? "an administrator" : "an editor"}.`);
  if (generatedPassword) {
    console.log("\n  Temporary password (shown once — send it privately, then they change it");
    console.log("  under “Your account” in the admin):\n");
    console.log(`      ${generatedPassword}\n`);
  } else {
    console.log("");
  }
}

async function password(emailArg, flags) {
  const email = requireEmail(emailArg);
  const user = await findUser(email);
  if (!user) fail(`No account for ${email}. Add it with: npm run editor -- add ${email}`);
  console.log(`\nSetting a new password for ${email}.`);
  const { password: pw, generated } = await choosePassword(flags.has("--generate"));
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password: pw });
  if (error) fail(error.message);
  console.log(`✓ Password changed for ${email}.`);
  if (generated) console.log(`\n  Temporary password (shown once):\n\n      ${pw}\n`);
  else console.log("");
}

async function remove(emailArg, flags) {
  const email = requireEmail(emailArg);
  const user = await findUser(email);
  const { error } = await supabase.from("editors").delete().eq("email", email);
  if (error) fail(error.message);
  console.log(`\n✓ ${email} can no longer edit the website.`);

  if (flags.has("--delete-account")) {
    if (!user) {
      console.log("  (no login account existed)\n");
      return;
    }
    const sure = await ask(`  Delete the login account for ${email} as well? Type "delete": `);
    if (sure.trim() !== "delete") {
      console.log("  Kept the login account.\n");
      return;
    }
    const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
    if (delError) fail(delError.message);
    console.log("  ✓ Login account deleted. Their past edits stay in History.\n");
  } else {
    console.log("  Their login still exists but has no access. Add --delete-account to remove it.\n");
  }
}

// ── main ────────────────────────────────────────────────────────────────────

const [command, emailArg, ...rest] = process.argv.slice(2);
const flags = new Set([emailArg, ...rest].filter((a) => a?.startsWith("--")));
const email = emailArg?.startsWith("--") ? undefined : emailArg;

const commands = { list, add, password, remove };
if (!commands[command]) {
  console.log(`
Manage website editors.

  npm run editor -- list
  npm run editor -- add <email> [--admin] [--generate]
  npm run editor -- password <email> [--generate]
  npm run editor -- remove <email> [--delete-account]
`);
  process.exit(command ? 1 : 0);
}

await commands[command](email, flags);
