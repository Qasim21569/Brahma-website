#!/usr/bin/env node
/**
 * enrich-properties.mjs — fills the FACTUAL gaps in the portfolio data from the
 * Google Places API (New), writing `src/data/places.generated.json`.
 *
 * ── SCOPE ────────────────────────────────────────────────────────────────────
 * Default run fetches facts only: placeId, coordinates, phone, bookingUrl (and
 * the verified address, for the mismatch guard).
 *
 * `--photos` additionally downloads photographs into public/properties/<slug>/.
 * This is OPT-IN because of three caveats the operator must weigh each time.
 * They are recorded here so the decision stays informed, not accidental —
 * see docs/PHOTO-PIPELINE.md for the full decision record.
 *
 *   1. The API cannot identify owner uploads. Google's docs state photos come
 *      from "business owners and user contributed photos" with NO field
 *      distinguishing them. `isLikelyOwnerPhoto()` below is a name-matching
 *      heuristic over `authorAttributions.displayName` — it has both false
 *      positives and false negatives. ALWAYS review --dry-run output.
 *   2. Attribution is mandatory. Where a photo carries `authorAttributions`,
 *      Google requires the credit be shown wherever the image is displayed.
 *      The pipeline threads it into `gallery[].attribution`, and
 *      <PhotoAttribution> renders it. Never put an attributed photo on a
 *      surface with no credit slot — that is what `ownPhotographyProperties`
 *      in properties.ts exists to prevent.
 *   3. Caching. The Maps Platform terms permit storing place IDs indefinitely
 *      but restrict retaining other Content, photos included. Downloading and
 *      rehosting is the operator's call to make against their own rights in
 *      the images; this script does not make it for them.
 *
 * Higher-quality alternative, preferred where available: originals from the
 * client's own Google Business Profile export (Takeout) or the franchise media
 * kit. Same images, full resolution, no attribution requirement.
 *
 * ── USAGE ────────────────────────────────────────────────────────────────────
 *   GOOGLE_MAPS_API_KEY must be set, in the environment or in .env.local.
 *
 *   node scripts/enrich-properties.mjs              # facts only, all 12
 *   node scripts/enrich-properties.mjs --photos     # facts + download photographs
 *   node scripts/enrich-properties.mjs --photos --dry-run   # ALWAYS do this first
 *   node scripts/enrich-properties.mjs --slug=beach-house-weeki-wachee
 *   node scripts/enrich-properties.mjs --force      # keep low-confidence matches
 *   node scripts/enrich-properties.mjs --list       # parse only, no key or network needed
 *   node scripts/enrich-properties.mjs --self-test  # check both guards offline
 *
 * The generated file is safe to delete and regenerate: `properties.ts` merges it
 * so that hand-authored values always win. This script can never overwrite
 * approved copy.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROPERTIES_TS = resolve(ROOT, "src/data/properties.ts");
const OUT_JSON = resolve(ROOT, "src/data/places.generated.json");
const ENV_LOCAL = resolve(ROOT, ".env.local");

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const BASE_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  // ── Amenity source fields ──────────────────────────────────────────────────
  // Added 2026-08-17 to unblock the property Amenities section. These move the
  // request into a higher Place Details SKU tier, so a run costs more than it
  // did when only the six fields above were requested. That is deliberate:
  // the brand sites (Choice, Hilton, IHG) all block automated fetching, so
  // Google is the only machine-readable amenity source we actually have.
  "places.editorialSummary",
  "places.accessibilityOptions",
  "places.allowsDogs",
  "places.goodForChildren",
];
/** Only requested under --photos; photos are a separately billed SKU. */
const PHOTO_FIELDS = ["places.photos"];

/** Longest edge requested from the Place Photo endpoint. Google's cap is 4800. */
const PHOTO_MAX_WIDTH = 1600;
/** Ceiling on photos kept per property, so a busy listing can't flood a gallery. */
const PHOTO_LIMIT = 6;

/** Properties we expect to find in properties.ts. Guards against a silent regex break. */
const EXPECTED_COUNT = 12;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const LIST_ONLY = args.includes("--list");
const SELF_TEST = args.includes("--self-test");
const WITH_PHOTOS = args.includes("--photos");
const ONLY_SLUG = args.find((a) => a.startsWith("--slug="))?.slice("--slug=".length);
/** --all-photos skips the owner heuristic and saves every photo Google returns. */
const ALL_PHOTOS = args.includes("--all-photos");

/* ── env ─────────────────────────────────────────────────────────────────── */

/**
 * Minimal .env.local reader — avoids adding a dotenv dependency for one key.
 *
 * Handles UTF-16 and a UTF-8 BOM. PowerShell's `>` and `Out-File` write UTF-16
 * LE by default, which is how this file arrived the first time: the key looked
 * perfectly correct in an editor but parsed as `￾G\0O\0O\0...`, so the
 * script reported the key as missing. Next.js cannot read a UTF-16 .env either,
 * so this would have failed in the app as well — the fix is to store UTF-8, and
 * this decode is the safety net.
 */
function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL)) return;

  const buf = readFileSync(ENV_LOCAL);
  let text;
  if (buf[0] === 0xff && buf[1] === 0xfe) text = buf.toString("utf16le").slice(1);
  else if (buf[0] === 0xfe && buf[1] === 0xff) text = swap16(buf).toString("utf16le").slice(1);
  else text = buf.toString("utf8").replace(/^﻿/, "");

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

/** Byte-swap a UTF-16 BE buffer so it can be decoded as LE. */
function swap16(buf) {
  const out = Buffer.from(buf);
  for (let i = 0; i < out.length - 1; i += 2) {
    const t = out[i];
    out[i] = out[i + 1];
    out[i + 1] = t;
  }
  return out;
}

/* ── read the portfolio ──────────────────────────────────────────────────── */

/**
 * Pulls slug/name/shortName/brand/address straight out of properties.ts source.
 *
 * properties.ts is TypeScript importing JSON, so it cannot be required from a
 * plain .mjs script without adding a transpiler. Scraping the source keeps
 * properties.ts as the single source of truth — the alternative, restating the
 * 12 addresses here, would drift the moment one is corrected. The
 * EXPECTED_COUNT assertion below is what makes this safe: if the shape of the
 * file changes, this fails loudly instead of silently enriching nothing.
 */
function readProperties() {
  const src = readFileSync(PROPERTIES_TS, "utf8");
  const found = [];
  const slugRe = /(?:^|\s)slug:\s*"([^"]+)"/g;

  // Each literal runs from its own `slug:` to the next one, so a block can
  // never bleed into the following property. This replaced a fixed 2000-char
  // window, which was sized to reach `address` and therefore stopped short of
  // `gallery` — fine while the only flag read here came from `homeHeroSrc`,
  // wrong as soon as the gallery had to be inspected.
  const starts = [];
  let match;
  while ((match = slugRe.exec(src)) !== null) starts.push({ index: match.index, slug: match[1] });

  for (const [i, start] of starts.entries()) {
    const block = src.slice(start.index, starts[i + 1]?.index ?? src.length);
    const name = /(?:^|\s)name:\s*"([^"]+)"/.exec(block)?.[1];
    const address = /(?:^|\s)address:\s*"([^"]+)"/.exec(block)?.[1];
    const shortName = /(?:^|\s)shortName:\s*"([^"]+)"/.exec(block)?.[1] ?? null;
    const brand = /(?:^|\s)brand:\s*"([^"]+)"/.exec(block)?.[1] ?? null;
    /**
     * A NON-EMPTY hand-authored `gallery` is what makes generated photos
     * unusable — `enrich()` keeps `p.gallery` whenever it has entries, so
     * downloading Place photos for those assets burns quota on images that can
     * never be displayed.
     *
     * This used to test `homeHeroSrc` instead, which is a different question.
     * `homeHeroSrc` is the hand-held still used for creditless chrome (the
     * homepage hero and image band); a property can legitimately keep that
     * while taking its detail-page gallery from Places. Testing the wrong
     * field made those assets skip their photo fetch entirely.
     */
    const hasOwnPhotos = /(?:^|\s)gallery:\s*\[\s*\{/.test(block);
    if (name && address) {
      found.push({ slug: start.slug, name, shortName, brand, address, hasOwnPhotos });
    }
  }

  if (found.length !== EXPECTED_COUNT) {
    throw new Error(
      `Parsed ${found.length} properties from properties.ts, expected ${EXPECTED_COUNT}.\n` +
        "The file's shape has changed — fix readProperties() rather than adjusting " +
        "EXPECTED_COUNT, or the enrichment will silently skip assets."
    );
  }
  return found;
}

/* ── match confidence ────────────────────────────────────────────────────── */

/** Street number — the FIRST number group in a US address. */
const streetNumberOf = (s) => /\b(\d{2,6})\b/.exec(s)?.[1] ?? null;

/**
 * ZIP — the LAST 5-digit group, never the first.
 *
 * Three of our twelve addresses have 5-digit street numbers (10007 Princess
 * Palm, 11810 US Hwy 19, 11740 Tampa Gateway). Taking the first 5-digit match
 * would read the street number as the ZIP and fail the comparison for exactly
 * those assets. Google also appends ", USA", so trailing-segment tricks are out.
 */
const zipOf = (s) => {
  const all = s.match(/\b\d{5}\b/g);
  return all ? all[all.length - 1] : null;
};

/**
 * Google's text search will always return *something*. Confirm it returned the
 * right building before we persist its place ID: the street number and the ZIP
 * must both agree with our own address.
 */
function confidence(ours, theirs) {
  if (!theirs) return { ok: false, why: "no result" };

  const ourZip = zipOf(ours);
  const theirZip = zipOf(theirs);
  const ourNum = streetNumberOf(ours);
  const theirNum = streetNumberOf(theirs);

  const zipMatch = Boolean(ourZip && theirZip && ourZip === theirZip);
  const numMatch = Boolean(ourNum && theirNum && ourNum === theirNum);

  if (zipMatch && numMatch) return { ok: true, why: "street number + ZIP match" };
  if (zipMatch) return { ok: false, why: `ZIP matches but street number differs (${ourNum} vs ${theirNum})` };
  if (numMatch) return { ok: false, why: `street number matches but ZIP differs (${ourZip} vs ${theirZip})` };
  return { ok: false, why: `address mismatch (ours "${ours}" vs theirs "${theirs}")` };
}

/**
 * Exercises the two pure guards — `confidence()` and `isLikelyOwnerPhoto()` —
 * against the shapes Google actually returns. Everything else in this script
 * needs a live API key, so this is the only part testable before Phase G.1
 * unblocks. Keep it passing.
 */
function selfTest() {
  let failures = 0;
  failures += testConfidence();
  failures += testOwnerHeuristic();
  failures += testAmenities();
  console.log(failures === 0 ? "\nAll self-test cases pass." : `\n${failures} FAILED`);
  return failures === 0;
}

/**
 * Exercises deriveAmenities() against the exact editorialSummary strings Google
 * returned for this portfolio on 2026-08-17, plus the traps in the wording.
 */
function testAmenities() {
  const labels = (place) => deriveAmenities(place).map((a) => a.label);
  const sum = (text) => ({ editorialSummary: { text } });

  const cases = [
    // Real summaries from our own 12 assets.
    [
      sum("Simple low-rise hotel with an outdoor pool & a fitness room, plus free breakfast & Wi-Fi."),
      ["Free WiFi", "Free Breakfast", "Outdoor Pool", "Fitness Center"],
      "clarion pointe tampa",
    ],
    [
      sum("Casual hotel offering free continental breakfast, WiFi & parking, plus meeting space & a pool."),
      ["Free WiFi", "Free Continental Breakfast", "Swimming Pool", "Meeting Space", "Free Parking"],
      "quality inn suites — 'free' distributes across the list",
    ],
    [
      sum("Streamlined quarters in a relaxed hotel featuring a 24-hour gym & an outdoor pool, plus breakfast."),
      ["Breakfast", "Outdoor Pool", "24-Hour Fitness Center"],
      "holiday inn express — unqualified breakfast stays unqualified",
    ],
    [
      sum("Traditional lodging with free airport shuttle service, breakfast & WiFi, plus an indoor pool."),
      ["Free WiFi", "Free Breakfast", "Indoor Pool", "Airport Shuttle"],
      "indoor pool must beat the generic pool rule",
    ],
    [
      sum("Relaxed budget hotel offering an outdoor pool, a bar & a restaurant, plus a gym & meeting space."),
      ["Outdoor Pool", "Fitness Center", "Meeting Space", "Restaurant", "Bar"],
      "bar and restaurant both detected",
    ],
    // The guard that makes the 60-char "free" window safe to use.
    [
      sum("Casual hotel with free breakfast, plus paid parking and a pool."),
      ["Free Breakfast", "Swimming Pool", "Parking"],
      "'paid' between qualifier and term blocks Free Parking",
    ],
    // Nothing stated → nothing emitted. The Primrose school case.
    [{}, [], "no editorial summary at all"],
    // Structured fields only.
    [
      { allowsDogs: true, goodForChildren: true, accessibilityOptions: { wheelchairAccessibleEntrance: true, wheelchairAccessibleParking: true } },
      ["Pet Friendly", "Family Friendly", "Accessible Entrance", "Accessible Parking"],
      "structured booleans only",
    ],
    // allowsDogs:false must NOT become "Pet Friendly", and must not emit at all.
    [{ allowsDogs: false }, [], "allowsDogs false emits nothing"],
  ];

  let failures = 0;
  for (const [place, expected, label] of cases) {
    const got = labels(place);
    const pass = JSON.stringify(got) === JSON.stringify(expected);
    if (!pass) failures++;
    console.log(`${pass ? "PASS" : "FAIL"}  amenities  ${label}`);
    if (!pass) console.log(`        expected ${JSON.stringify(expected)}\n        got      ${JSON.stringify(got)}`);
  }
  return failures;
}

function testOwnerHeuristic() {
  const hampton = {
    name: "Hampton Inn & Suites Tampa Airport Westshore",
    shortName: "Hampton Inn & Suites Tampa Airport",
    brand: "Hilton",
  };
  const beachHouse = { name: "Beach House", shortName: "Beach House", brand: null };

  const cases = [
    // Accept: no attribution at all — Google-supplied, no credit needed.
    [hampton, { authorAttributions: [] }, true, "no attribution"],
    [hampton, {}, true, "photos[] with attributions absent entirely"],
    // Accept: the author IS the business, under various renderings.
    [hampton, attr("Hampton Inn & Suites Tampa Airport Westshore"), true, "exact business name"],
    [hampton, attr("Hampton Inn and Suites Tampa Airport"), true, "punctuation differs"],
    [hampton, attr("Hilton"), true, "brand name"],
    // Reject: ordinary guest uploads.
    [hampton, attr("Dave Wilson"), false, "guest name"],
    [hampton, attr("A Google User"), false, "anonymous Google user"],
    // The documented false positive — a guest whose name contains the brand.
    [hampton, attr("Hilton Fan Reviews"), true, "KNOWN false positive, brand in guest name"],
    // Short/generic names must not match loosely: "Beach House" is 10 chars and
    // could appear inside unrelated author names, so verify it stays exact-ish.
    [beachHouse, attr("Beach House"), true, "short business name, exact"],
    [beachHouse, attr("Mike Torres"), false, "short business name, unrelated author"],
  ];

  let failures = 0;
  for (const [property, photo, expected, label] of cases) {
    const got = isLikelyOwnerPhoto(photo, property).owner;
    const pass = got === expected;
    if (!pass) failures++;
    console.log(`${pass ? "PASS" : "FAIL"}  ${expected ? "owner" : "guest"}  ${label}`);
  }
  return failures;
}

const attr = (displayName) => ({ authorAttributions: [{ displayName }] });

function testConfidence() {
  const cases = [
    // 5-digit street number + ", USA" suffix — the case that was broken.
    ["10007 Princess Palm Ave, Tampa, FL 33619", "10007 Princess Palm Ave, Tampa, FL 33619, USA", true],
    ["11810 US Hwy 19, Port Richey, FL 34668", "11810 US Hwy 19, Port Richey, FL 34668, USA", true],
    ["11740 Tampa Gateway Blvd, Seffner, FL 33584", "11740 Tampa Gateway Blvd, Seffner, FL 33584, USA", true],
    // 4-digit street number.
    ["3760 Tampa Rd, Oldsmar, FL 34677", "3760 Tampa Rd, Oldsmar, FL 34677, USA", true],
    // Google normalises the suite/street wording but the building is the same.
    ["4955 E 18th Ave, Tampa, FL 33605", "4955 E 18th Avenue, Tampa, FL 33605, USA", true],
    // Genuine misses that must be rejected.
    ["3760 Tampa Rd, Oldsmar, FL 34677", "3762 Tampa Rd, Oldsmar, FL 34677, USA", false],
    ["3760 Tampa Rd, Oldsmar, FL 34677", "3760 Tampa Rd, Palm Harbor, FL 34683, USA", false],
    ["3760 Tampa Rd, Oldsmar, FL 34677", null, false],
  ];

  let failures = 0;
  for (const [ours, theirs, expected] of cases) {
    const got = confidence(ours, theirs).ok;
    const pass = got === expected;
    if (!pass) failures++;
    console.log(`${pass ? "PASS" : "FAIL"}  ${expected ? "accept" : "reject"}  ${theirs ?? "(no result)"}`);
  }
  return failures;
}

/* ── owner-photo heuristic ───────────────────────────────────────────────── */

/**
 * Lowercase, expand "&" to "and", collapse everything else to single spaces.
 *
 * The "&" → "and" step matters more than it looks: six of the twelve assets
 * have an ampersand in their name ("Hampton Inn & Suites", "Quality Inn &
 * Suites", "Microtel Inn & Suites", "Sleep Inn & Suites", "Holiday Inn Express
 * & Suites"). Google Business Profile names routinely spell it "and". Stripping
 * "&" to whitespace instead of expanding it made the two spellings fail to
 * match, so most of the portfolio's genuine owner photos were rejected.
 */
const normalise = (s) =>
  (s ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Best-effort guess at whether a Place photo was uploaded by the business.
 *
 * ⚠️ THIS IS A HEURISTIC, NOT A GUARANTEE. The Places API has **no field**
 * identifying who uploaded a photo — Google's own docs say photos come from
 * "business owners and user contributed photos" with nothing distinguishing
 * them. The `photos[]` object carries only name/widthPx/heightPx/
 * authorAttributions. So the only signal available is whether the attribution's
 * displayName resembles the business or its brand.
 *
 * Consequences to keep in mind:
 *   - A guest who happens to include the hotel name in their profile name will
 *     pass this filter.
 *   - A genuine owner upload made from a personal or management-company account
 *     will fail it.
 * Review `--dry-run` output before committing anything this selects.
 *
 * An empty attribution array is treated as owner/Google-supplied, because those
 * are the photos Google states need no separate credit.
 */
function isLikelyOwnerPhoto(photo, property) {
  const attributions = photo.authorAttributions ?? [];
  if (attributions.length === 0) return { owner: true, credit: null, why: "no attribution" };

  const candidates = [property.name, property.shortName, property.brand]
    .filter(Boolean)
    .map(normalise)
    .filter((c) => c.length >= 4);

  for (const attribution of attributions) {
    const author = normalise(attribution.displayName);
    if (!author) continue;
    const hit = candidates.some((c) => author.includes(c) || c.includes(author));
    if (hit) {
      return { owner: true, credit: attribution.displayName ?? null, why: `author "${attribution.displayName}" matches business` };
    }
  }

  return {
    owner: false,
    credit: attributions[0]?.displayName ?? null,
    why: `author "${attributions[0]?.displayName ?? "?"}" does not match business`,
  };
}

/* ── amenities ───────────────────────────────────────────────────────────── */

/**
 * Derives a per-property amenity list from what Google actually states.
 *
 * ── WHY THIS EXISTS, AND WHAT IT IS NOT ──────────────────────────────────────
 * The obvious source is the property's own brand page — the Choice/Hilton/IHG
 * "Featured Amenities" grid. **All three block automated fetching**: Choice
 * drops the TLS connection outright, Hilton returns 403. So they are not
 * reachable from a script, and hand-copying 12 lists would go stale silently.
 *
 * This function therefore reads only two Google-supplied sources:
 *   1. `editorialSummary` — Google's own one-line description, which names
 *      amenities explicitly ("an outdoor pool & a fitness room, plus free
 *      breakfast & Wi-Fi").
 *   2. The structured booleans (`accessibilityOptions`, `allowsDogs`,
 *      `goodForChildren`).
 *
 * **Every emitted amenity traces to a Google assertion. Nothing is inferred
 * from the franchise brand.** That distinction is the whole point: this project
 * has repeatedly shipped and then had to retract invented facts, and
 * "it's a Hampton Inn, so it must have a business centre" is exactly that
 * mistake. If Google does not say it, this returns nothing for it.
 *
 * Consequence to expect: these lists are SHORTER than the brand pages' (5–9
 * items against Choice's 18). That is the honest floor. To publish the fuller
 * list, someone must supply the brand data by hand — `properties.ts` already
 * lets a hand-authored `amenities` array win over this one.
 *
 * Order is specific-before-generic ("indoor pool" before "pool") because the
 * first rule that matches a concept wins and the rest of that group is skipped.
 */
/**
 * Does "free"/"complimentary" apply to `term` in this summary?
 *
 * Google writes these as distributed lists — "free airport shuttle service,
 * breakfast & WiFi" means all three are free, with 38 characters between the
 * qualifier and the last item it governs. So the window has to be generous.
 * The `PAID_SIGNAL` check is what makes a generous window safe: if anything
 * between the qualifier and the term reverses it ("free breakfast, paid
 * parking"), the match is rejected rather than silently publishing "Free
 * Parking" for a hotel that charges for it. Non-greedy, so the NEAREST
 * qualifier wins.
 */
const PAID_SIGNAL = /\b(paid|fee|fees|surcharge|charge|extra)\b/;

function isFree(summary, termSource) {
  const match = new RegExp(`(?:free|complimentary)([^.]{0,60}?)${termSource}`).exec(summary);
  return match ? !PAID_SIGNAL.test(match[1]) : false;
}

function deriveAmenities(place) {
  const summary = (place.editorialSummary?.text ?? "").toLowerCase();
  const found = [];
  const seen = new Set();

  const add = (label, icon, why) => {
    if (seen.has(icon)) return;
    seen.add(icon);
    found.push({ label, icon, why });
  };

  // ── from the editorial summary ──
  if (/wi-?\s?fi/.test(summary)) {
    add(isFree(summary, "wi-?\\s?fi") ? "Free WiFi" : "WiFi", "wifi", "editorialSummary");
  }
  if (/breakfast/.test(summary)) {
    const continental = /continental breakfast/.test(summary);
    const free = isFree(summary, "breakfast");
    const label = continental
      ? free
        ? "Free Continental Breakfast"
        : "Continental Breakfast"
      : free
        ? "Free Breakfast"
        : "Breakfast";
    add(label, "breakfast", "editorialSummary");
  }
  if (/indoor pool/.test(summary)) add("Indoor Pool", "pool", "editorialSummary");
  else if (/outdoor pool/.test(summary)) add("Outdoor Pool", "pool", "editorialSummary");
  else if (/\bpool\b/.test(summary)) add("Swimming Pool", "pool", "editorialSummary");

  if (/24-hour gym|24 hour gym/.test(summary)) {
    add("24-Hour Fitness Center", "fitness", "editorialSummary");
  } else if (/\bgym\b|fitness room|exercise room|fitness cent/.test(summary)) {
    add("Fitness Center", "fitness", "editorialSummary");
  }

  if (/airport shuttle|shuttle service/.test(summary)) {
    add("Airport Shuttle", "shuttle", "editorialSummary");
  }
  if (/meeting space|conference/.test(summary)) add("Meeting Space", "meeting", "editorialSummary");
  if (/restaurant/.test(summary)) add("Restaurant", "restaurant", "editorialSummary");
  if (/\bbar\b/.test(summary)) add("Bar", "bar", "editorialSummary");
  if (/parking/.test(summary)) {
    add(isFree(summary, "parking") ? "Free Parking" : "Parking", "parking", "editorialSummary");
  }

  // ── from the structured fields ──
  if (place.allowsDogs === true) add("Pet Friendly", "pets", "allowsDogs");
  if (place.goodForChildren === true) add("Family Friendly", "family", "goodForChildren");

  const access = place.accessibilityOptions ?? {};
  if (access.wheelchairAccessibleEntrance === true) {
    add("Accessible Entrance", "accessible", "accessibilityOptions");
  }
  if (access.wheelchairAccessibleParking === true) {
    add("Accessible Parking", "accessible-parking", "accessibilityOptions");
  }

  return found;
}

const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Downloads one photo's bytes into public/properties/<slug>/.
 *
 * The media endpoint 302s to the actual image; Node's fetch follows redirects,
 * so a plain GET yields the bytes. Extension comes from the response
 * content-type rather than being assumed — Google serves JPEG or PNG depending
 * on the source. We do not re-encode to .webp: that would need `sharp`, and
 * next/image already optimises local files at build time.
 */
async function downloadPhoto(photo, slug, index, apiKey, maxWidthPx) {
  const url = `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=${maxWidthPx}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`photo download ${res.status} ${res.statusText}`);
  }

  const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  const ext = EXT_BY_MIME[mime];
  if (!ext) throw new Error(`unexpected content-type "${mime}"`);

  const dir = resolve(ROOT, "public/properties", slug);
  mkdirSync(dir, { recursive: true });

  const filename = `g-${String(index + 1).padStart(2, "0")}.${ext}`;
  writeFileSync(resolve(dir, filename), Buffer.from(await res.arrayBuffer()));

  return `/properties/${slug}/${filename}`;
}

/* ── fetch ───────────────────────────────────────────────────────────────── */

async function lookup(property, apiKey) {
  const fields = WITH_PHOTOS ? [...BASE_FIELDS, ...PHOTO_FIELDS] : BASE_FIELDS;
  const res = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fields.join(","),
    },
    body: JSON.stringify({
      textQuery: `${property.name}, ${property.address}`,
      maxResultCount: 1,
      regionCode: "US",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Places API ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 300)}` : ""}`);
  }

  const json = await res.json();
  return json.places?.[0] ?? null;
}

/* ── main ────────────────────────────────────────────────────────────────── */

async function main() {
  loadEnvLocal();

  if (SELF_TEST) {
    process.exit(selfTest() ? 0 : 1);
  }

  // --list verifies the properties.ts parser without a key or any network call.
  if (LIST_ONLY) {
    const parsed = readProperties();
    for (const p of parsed) console.log(`${p.slug}\n    ${p.name}\n    ${p.address}`);
    console.log(`\n${parsed.length} properties parsed from properties.ts.`);
    return;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error(
      "GOOGLE_MAPS_API_KEY is not set.\n\n" +
        "Add it to brahma-web/.env.local:\n" +
        "  GOOGLE_MAPS_API_KEY=your-key-here\n\n" +
        "The key needs the Places API (New) enabled. This is the client-blocked\n" +
        "item in docs/BUILD-PLAYBOOK.md §5 Phase G.1."
    );
    process.exit(1);
  }

  let properties = readProperties();
  if (ONLY_SLUG) {
    properties = properties.filter((p) => p.slug === ONLY_SLUG);
    if (properties.length === 0) {
      console.error(`No property with slug "${ONLY_SLUG}".`);
      process.exit(1);
    }
  }

  // Start from the existing file so a partial run never discards earlier results.
  const existing = existsSync(OUT_JSON)
    ? JSON.parse(readFileSync(OUT_JSON, "utf8") || "{}")
    : {};
  const out = { ...existing };

  let written = 0;
  let skipped = 0;
  let failed = 0;

  for (const property of properties) {
    process.stdout.write(`· ${property.slug} … `);
    let place;
    try {
      place = await lookup(property, apiKey);
    } catch (error) {
      console.log(`FAILED — ${error.message}`);
      failed++;
      continue;
    }

    const verdict = confidence(property.address, place?.formattedAddress);
    if (!verdict.ok && !FORCE) {
      console.log(`skipped — ${verdict.why}`);
      console.log("    re-run with --force to keep it, or correct the address in properties.ts");
      skipped++;
      continue;
    }

    const record = {
      placeId: place.id ?? null,
      verifiedAddress: place.formattedAddress ?? null,
      phone: place.nationalPhoneNumber ?? null,
      bookingUrl: place.websiteUri ?? null,
      coordinates:
        place.location?.latitude != null && place.location?.longitude != null
          ? { lat: place.location.latitude, lng: place.location.longitude }
          : null,
      /**
       * Carried forward BEFORE the --photos branches below can touch it.
       *
       * `out[slug] = record` replaces the record wholesale, so anything absent
       * here is dropped. Photos used to be set only inside the `WITH_PHOTOS`
       * branches, which meant an ordinary facts-only run — the DEFAULT
       * invocation — silently emptied every gallery in the file while the image
       * files sat untouched on disk. Hit for real on 2026-08-17. Preserving at
       * construction time is what makes the default run non-destructive.
       */
      photos: existing[property.slug]?.photos ?? [],
    };

    // Amenities are derived, never invented — see deriveAmenities(). Stored
    // without the `why` field, which is a run-time audit aid only.
    const amenities = deriveAmenities(place);
    record.amenities = amenities.map(({ label, icon }) => ({ label, icon }));

    console.log(
      `ok${verdict.ok ? "" : " (forced)"} — ${record.placeId}` +
        (record.bookingUrl ? "" : "  [no website returned]")
    );
    if (amenities.length > 0) {
      console.log(`    amenities: ${amenities.length} derived`);
      for (const a of amenities) console.log(`      · ${a.label}  (${a.why})`);
    } else {
      console.log("    amenities: none — Google states nothing itemisable");
    }

    if (WITH_PHOTOS && property.hasOwnPhotos) {
      console.log("    photos: skipped — hand-authored gallery already wins here");
    } else if (WITH_PHOTOS) {
      // record.photos already holds the previously-saved list; a failed download
      // pass below leaves it in place rather than emptying the gallery.
      const all = place.photos ?? [];
      let owned;
      if (ALL_PHOTOS) {
        owned = all.map((photo, i) => ({ photo, credit: null, why: `all-photos [${i + 1}]` }));
      } else {
        owned = [];
        for (const photo of all) {
          const check = isLikelyOwnerPhoto(photo, property);
          if (check.owner) owned.push({ photo, credit: check.credit, why: check.why });
        }
      }

      console.log(
        `    photos: ${all.length} returned, ${owned.length} kept${ALL_PHOTOS ? " (all-photos)" : ""}` +
          (owned.length > PHOTO_LIMIT ? `, keeping ${PHOTO_LIMIT}` : "")
      );

      const keep = owned.slice(0, PHOTO_LIMIT);
      if (DRY_RUN) {
        for (const [i, entry] of keep.entries()) {
          console.log(`      [${i + 1}] ${entry.why}`);
        }
      } else {
        const saved = [];
        for (const [i, entry] of keep.entries()) {
          try {
            const src = await downloadPhoto(entry.photo, property.slug, i, apiKey, PHOTO_MAX_WIDTH);
            saved.push({ src, attribution: entry.credit });
            console.log(`      [${i + 1}] ${src}${entry.credit ? ` — credit: ${entry.credit}` : ""}`);
          } catch (error) {
            console.log(`      [${i + 1}] FAILED — ${error.message}`);
          }
        }
        if (saved.length > 0) record.photos = saved;
      }
    }

    out[property.slug] = record;
    written++;
  }

  console.log(
    `\n${written} enriched · ${skipped} skipped · ${failed} failed` +
      ` (of ${properties.length})`
  );

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written. Result would have been:\n");
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  if (written === 0) {
    console.log("Nothing to write.");
    return;
  }

  writeFileSync(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${OUT_JSON}`);
  console.log(
    "Hand-authored values in properties.ts still win over everything above.\n" +
      "Run `npx tsc --noEmit && npx next build` to confirm."
  );
}

main().catch((error) => {
  console.error(`\n${error.stack ?? error.message}`);
  process.exit(1);
});
