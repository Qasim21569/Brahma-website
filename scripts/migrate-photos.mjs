#!/usr/bin/env node
/**
 * Move every property photo into the admin — run on YOUR machine.
 *
 *   npm run photos:migrate            dry run: shows what would happen, changes nothing
 *   npm run photos:migrate -- --apply do it
 *
 * WHY. For 10 of the 12 properties the database gallery is EMPTY: the site
 * fills it at build time from the photos the enrichment script downloaded into
 * `public/properties/<slug>/` (listed in `src/data/places.generated.json`).
 * The admin can therefore only say "showing 6 Google photos" — the client
 * cannot reorder, remove, re-caption or keep them as their own.
 *
 * WHAT IT DOES, per property:
 *   1. Works out the gallery the site shows TODAY — the database gallery if it
 *      has one, otherwise the downloaded photos — plus the cover image.
 *   2. Uploads each file from `public/` into Supabase Storage (`media` bucket,
 *      `uploads/` folder, so they appear under "Choose uploaded" in the admin).
 *   3. Writes that gallery into the property's record, in the same order, with
 *      the same alt text and — importantly — the same photo credit. Places
 *      photos carry a credit Google requires us to show; it is preserved.
 *
 * SAFE TO RE-RUN. Photos already in Storage are skipped, and a property whose
 * images all live in Storage is left alone. Every record it changes keeps its
 * previous version in the admin's History, so it can be undone from there.
 *
 * The site does not change visually: same photos, same order, same credits.
 * After `--apply`, redeploy (or save anything in the admin) to publish.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal, requireAdminEnv } from "./lib/env.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "media";
const FOLDER = "uploads";
const APPLY = process.argv.includes("--apply");

loadEnvLocal(ROOT);
const { url, secret } = requireAdminEnv();
const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const places = JSON.parse(readFileSync(resolve(ROOT, "src/data/places.generated.json"), "utf8"));
const storagePrefix = `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/`;
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

const isLocal = (src) => typeof src === "string" && src.startsWith("/") && !src.startsWith("//");

/** Storage object name for a repo file — slug-prefixed so names never collide. */
const objectName = (slug, src) => `${FOLDER}/${slug}-${basename(src)}`;

async function ensureUploaded(slug, src) {
  const file = resolve(ROOT, "public", src.replace(/^\//, ""));
  if (!existsSync(file)) throw new Error(`file not found in public/: ${src}`);
  const type = MIME[extname(file).toLowerCase()];
  if (!type) throw new Error(`unsupported image type: ${src}`);
  const name = objectName(slug, src);
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  if (!APPLY) return { publicUrl, uploaded: false };

  const { error } = await supabase.storage.from(BUCKET).upload(name, readFileSync(file), {
    contentType: type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error && !/exists|duplicate/i.test(error.message)) {
    throw new Error(`upload failed for ${src}: ${error.message}`);
  }
  return { publicUrl, uploaded: !error };
}

const { data: rows, error } = await supabase
  .from("properties")
  .select("slug, position, data")
  .order("position");
if (error) {
  console.error(`✗ Could not read properties: ${error.message}`);
  process.exit(1);
}
if (!rows.length) {
  console.error("✗ The properties table is empty — import the portfolio from the admin dashboard first.");
  process.exit(1);
}

console.log(`\n${APPLY ? "MIGRATING" : "DRY RUN — nothing will change"} · ${rows.length} properties\n`);

let changed = 0;
let uploads = 0;
let problems = 0;

for (const row of rows) {
  const data = row.data ?? {};
  const shortName = data.shortName || data.name || row.slug;
  const own = Array.isArray(data.gallery) ? data.gallery : [];
  const fromPlaces = (places[row.slug]?.photos ?? []).map((p, i) => ({
    src: p.src,
    alt: `${shortName} — photograph ${i + 1}`,
    attribution: p.attribution ?? null,
  }));

  // Exactly what enrich() renders today: own gallery wins, else the Places set.
  const current = own.length ? own : fromPlaces;
  const source = own.length ? "database" : fromPlaces.length ? "downloaded Google photos" : "none";
  const cover = data.homeHeroSrc ?? null;

  const needsWork =
    current.some((g) => isLocal(g.src)) || isLocal(cover) || (!own.length && current.length > 0);

  if (!needsWork) {
    console.log(`  ✓ ${shortName.padEnd(38)} already in the admin (${own.length} photos)`);
    continue;
  }

  try {
    const gallery = [];
    for (const g of current) {
      if (isLocal(g.src)) {
        const r = await ensureUploaded(row.slug, g.src);
        if (r.uploaded) uploads++;
        gallery.push({ src: r.publicUrl, alt: g.alt || shortName, attribution: g.attribution ?? null });
      } else {
        gallery.push({ src: g.src, alt: g.alt || shortName, attribution: g.attribution ?? null });
      }
    }

    let homeHeroSrc = cover;
    if (isLocal(cover)) {
      const r = await ensureUploaded(row.slug, cover);
      if (r.uploaded) uploads++;
      homeHeroSrc = r.publicUrl;
    }

    const credited = gallery.filter((g) => g.attribution).length;
    console.log(
      `  → ${shortName.padEnd(38)} ${String(gallery.length).padStart(2)} photos from ${source}` +
        (credited ? ` (${credited} keep their Google credit)` : "") +
        (isLocal(cover) ? " + cover image" : ""),
    );

    if (APPLY) {
      const next = { ...data, gallery, homeHeroSrc };
      const { error: upErr } = await supabase
        .from("properties")
        .update({ data: next })
        .eq("slug", row.slug);
      if (upErr) throw new Error(`database update failed: ${upErr.message}`);
    }
    changed++;
  } catch (e) {
    problems++;
    console.log(`  ✗ ${shortName.padEnd(38)} ${e.message}`);
  }
}

console.log(
  `\n${APPLY ? "Done" : "Would change"}: ${changed} properties` +
    (APPLY ? `, ${uploads} files uploaded` : "") +
    (problems ? `, ${problems} problem(s) — nothing was written for those` : "") +
    ".",
);
if (!APPLY && changed) console.log("Run again with --apply to do it:  npm run photos:migrate -- --apply");
if (APPLY && changed) console.log("Redeploy the site (or save anything in the admin) to publish.");
console.log("");
// exitCode, not exit(): exiting with fetch sockets still open trips a libuv
// assertion on Windows (Node 24).
process.exitCode = problems ? 1 : 0;
