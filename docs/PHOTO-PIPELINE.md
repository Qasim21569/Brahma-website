# PHOTO-PIPELINE — property imagery, end to end

> **Scope:** where property photographs come from, how they get into the repo,
> and the decisions already taken. Self-contained — you can hand this file to
> someone with no other context.
> **Owner doc for:** `scripts/enrich-properties.mjs`, `public/properties/`,
> the `gallery` field in `src/data/properties.ts`, `ui/PhotoAttribution.tsx`.
> **Last updated:** 2026-08-13

---

## 1. Current state

**2 of 12 assets have photography.** The other 10 render no images at all.

| Location | Contents | Wired up? |
|---|---|---|
| `public/properties/clarion-pointe-tampa-brandon/` | 5 `.webp` — hero, satellite, 3 gallery | ✅ yes |
| `public/properties/hampton-inn-tampa-veterans-expwy/` | 6 `.webp` — hero, satellite, 4 gallery | ✅ yes |
| `public/site-photos/` | **21 client `.webp`** — `Clarion-Pointe-1…11`, `Hampton-Inn-2…10`, `Hampton-Inn-homepage` | ❌ **unused — defect D-9** |
| The other 10 properties | nothing | `homeHeroSrc: null`, `gallery: []` |
| `src/data/places.generated.json` | `{}` | overlay works; never yet run |

Note the third row: the client already supplied **more photos than we are using**
for both photographed assets. That is free depth, already licensed, sitting on
disk. Wire those in before fetching anything from anywhere.

---

## 2. How the data layer works

`src/data/properties.ts` is the single source of truth.

1. The hand-authored `properties[]` array holds `homeHeroSrc`, `homeSatelliteSrc`
   and `gallery[]`, each pointing at a path under `public/`.
2. At **import time** it merges `places.generated.json` through `enrich()`.
3. **Hand-authored values always win** (`p.phone ?? g.phone`), and generated
   photos are used *only* when `p.gallery.length === 0`. Re-running any fetcher
   therefore **cannot** clobber approved photography or copy.
4. `enrichedProperties` is what pages import.

### The three exported views — pick the right one

| Export | Guarantees | Use for |
|---|---|---|
| `enrichedProperties` | all 12, images may be absent | listings, counts, tickers, detail routes |
| `featuredProperties` | `homeHeroSrc` non-null **and** gallery non-empty, typed `FeaturedProperty` so no null checks | any surface that must show an image |
| `ownPhotographyProperties` | as above **plus** every photo is attribution-free | **chrome with no room for a credit line** — the homepage hero, marquees, section backdrops |

That third one is a guard, not a convenience. `enrich()` falls back to
`homeHeroSrc: p.homeHeroSrc ?? gallery[0]?.src`, so once Places photos exist in
the data, that fallback can quietly promote an *attributed* photo onto the
homepage hero — a composition with nowhere to put the credit. Filtering by
construction makes that impossible instead of relying on memory.

### To add photos for a property

That is all you touch:

1. Drop files in `public/properties/<slug>/`.
2. Fill `homeHeroSrc` and `gallery[]` on that property's object.

```ts
gallery: [
  { src: "/properties/my-slug/01-hero.webp", alt: "…exterior anchor shot" },
  // attribution is optional; omit it for photography we own
],
```

---

## 3. Attribution — the rule

`GalleryPhoto.attribution` carries a required photo credit, or `null`.

- **Our own photography** (client-supplied, franchise media kits) → `null`. We
  hold the rights; no credit needed.
- **Google Places photos** → whatever `authorAttributions.displayName` returned.
  Google requires that credit be displayed **wherever the image appears**.

Render it with `<PhotoAttribution attribution={photo.attribution} />`. It returns
`null` when there is nothing to credit, so it is safe to drop next to every
image unconditionally. Already wired into:

- `src/app/portfolio/[slug]/page.tsx` — hero image and gallery grid
- `src/app/portfolio/page.tsx` — hero and supporting tiles

**Never** put an attributed photo on a surface with no credit slot. Use
`ownPhotographyProperties` there.

---

## 4. Sourcing routes

### 4.1 Client / franchise photography — best quality

Every hospitality asset runs under a major flag (Choice, Hilton, IHG, Wyndham),
and each brand holds professional shoots for its own booking pages. BMIG owns
these properties, so it can obtain that photography through the franchise
relationship. This is the only route that yields the consistent, editorial-grade
imagery the design grammar is built around — full-bleed parallax frames and
clip-wipe reveals are unforgiving of weak photography.

Free, already licensed, no attribution, correctly sized for web.

### 4.2 The client's own Google Business Profile — same files, full resolution

If BMIG uploaded photos to its own listings, **BMIG has the originals** and does
not need the API to get them back:

- **[takeout.google.com](https://takeout.google.com)** — signed in as the account
  managing the listings, deselect all, select **Google Business Profile**,
  export. Bulk, first-party, supported.
- **[business.google.com](https://business.google.com)** → each location →
  Photos → the **"By owner"** tab. This is the view that actually separates owner
  uploads from customer uploads — use it to confirm what you uploaded.

⚠️ **Check who manages each listing.** For franchised hotels the Business Profile
is often controlled by the *brand*, sometimes via a chain-level bulk account,
rather than the individual owner. BMIG may not control all 12.

### 4.3 Google Places API — implemented, opt-in, three caveats

**Decision record:** the operator chose this route on 2026-08-13 after the
caveats below were raised. It is implemented behind an explicit `--photos` flag
so it can never happen by accident.

**Caveat 1 — the API cannot identify owner uploads.**
Google's own Place Photos documentation says photos are "sourced from a variety
of locations, including business owners and user contributed photos", and the
`photos[]` object contains only four fields: `name`, `widthPx`, `heightPx`,
`authorAttributions[]`. **There is no owner flag.** The only available signal is
whether the attribution's `displayName` resembles the business.

`isLikelyOwnerPhoto()` implements that name match. It is a heuristic with known
error in both directions:
- *False positive* — a guest whose profile name contains the brand ("Hilton Fan
  Reviews") passes. There is a self-test case asserting this, so the behaviour is
  known rather than surprising.
- *False negative* — a genuine owner upload from a personal or management-company
  account fails.

**Always run `--photos --dry-run` and read the output before committing.**

**Caveat 2 — attribution is mandatory.** See §3. Handled.

**Caveat 3 — caching.** The Maps Platform terms permit storing place IDs
indefinitely but restrict retaining other Content, photos included. Downloading
and rehosting is the operator's call against their own rights in the images; the
script does not make that call for them.

### 4.4 The no-photo card — needed regardless

Photography arrives asset by asset over weeks. The portfolio must look
deliberate at 2 photos or 12, so the monogram/label fallback (Phase C1) is a
**permanent part of the system, not a stopgap.** It is also the only
photo-related item that is unblocked with no external dependency.

---

## 5. The enrichment script

`scripts/enrich-properties.mjs`. No dependencies beyond Node ≥18.

```bash
npm run enrich:check          # offline: both guards + parser. No key needed.
npm run enrich -- --dry-run   # facts only, show what would change
npm run enrich                # facts only, write
npm run enrich -- --photos --dry-run   # ALWAYS do this before --photos
npm run enrich -- --photos             # facts + download photographs
```

| Flag | Effect |
|---|---|
| *(none)* | facts only: `placeId`, `coordinates`, `phone`, `bookingUrl` |
| `--photos` | additionally download photographs (see §4.3) |
| `--dry-run` | print the result, write nothing |
| `--slug=<slug>` | one property only |
| `--force` | keep matches that fail the address guard |
| `--list` | parse `properties.ts` and stop — no key, no network |
| `--self-test` | run both guards offline |

### Design notes

- **One request per property.** Places API (New) Text Search
  (`places:searchText`) with an `X-Goog-FieldMask` returns everything in a single
  call. `places.photos` is only requested under `--photos`, since photos are a
  separately billed SKU.
- **Reads `properties.ts` by scraping the source**, so that file stays the single
  source of truth. It asserts it parsed exactly **12** properties and fails
  loudly if the file's shape changes, rather than silently enriching nothing.
- **Address-match guard.** Text Search always returns *something*, so a result is
  only persisted when the street number **and** the ZIP both match ours.
- **Merges into the existing JSON**, so a partial or failed run never discards
  earlier results. Photos already recorded survive a facts-only re-run.
- **Photos are not re-encoded** to `.webp`. That would need `sharp`, and
  `next/image` already optimises local files at build time. Extension comes from
  the response `content-type`, not an assumption.
- **`PHOTO_LIMIT = 6`** per property, so a busy listing cannot flood a gallery.
  `PHOTO_MAX_WIDTH = 1600`.

### Two bugs the self-test caught before the key existed

Worth knowing, because both would have looked like "it mostly works":

1. **ZIP parsed as the street number.** The guard originally took the *first*
   5-digit group as the ZIP. Three addresses have 5-digit street numbers — 10007
   Princess Palm, 11810 US Hwy 19, 11740 Tampa Gateway — so those three compared
   `33619` against `10007` and skipped silently. Now takes the *last* group.
2. **`&` vs "and".** `normalise()` stripped `&` to whitespace, so
   "Hampton Inn & Suites" never matched a Business Profile spelled
   "Hampton Inn and Suites". **Six of the twelve assets have an ampersand**, so
   this rejected most of the portfolio's genuine owner photos. Now expands
   `&` → `and`.

Keep `npm run enrich:check` passing.

---

## 6. Getting the API key

1. [console.cloud.google.com](https://console.cloud.google.com) — sign in,
   ideally as the account that manages the business listings.
2. Create a project, e.g. `brahmas-web`.
3. **Enable billing.** Places API serves nothing without a billing account
   attached; a card is required. Free monthly per-SKU allowances comfortably
   cover our 12 requests, but the account must exist.
4. **APIs & Services → Library →** search **"Places API (New)"** → Enable.
   It must be the **New** one — the script calls `places.googleapis.com/v1`, not
   the legacy `maps.googleapis.com/maps/api/place`. Enabling only the old API
   fails with a confusing permission error.
5. **Credentials → Create credentials → API key.**
6. **Restrict it.** API restrictions → *Restrict key* → Places API (New) only.
   Application restrictions → *None* is appropriate for a laptop-run script; an
   IP restriction breaks whenever your IP changes.
7. Add it to `brahma-web/.env.local`:
   ```
   GOOGLE_MAPS_API_KEY=AIza…
   ```
   Already gitignored via the `.env*` rule — verified.
8. **Do not** prefix it `NEXT_PUBLIC_`. That ships the key to every browser. The
   script reads it server-side only.
9. Set a budget alert and a quota cap so a runaway loop cannot bill you.

Verify with `npm run enrich -- --dry-run`.

---

## 7. Recommended order of work

1. ✅ ~~Rename `Public/` → `public/`~~ (defect D-7) — done. Nothing about images
   was real on Linux before this.
2. ✅ ~~Write the enrichment script~~ (D-8) — done, awaiting the key.
3. **Build the Phase C1 no-photo card** so all 12 assets can be shown
   immediately. Only unblocked item.
4. **Wire the 21 unused `public/site-photos/` files** into the two existing
   galleries (D-9) — free depth for the assets we can already show properly.
5. **Request franchise photography** for the other 10 (§4.1), and check who
   controls each Business Profile (§4.2).
6. When the key lands: `npm run enrich -- --photos --dry-run`, review, then run
   for real. This also unblocks the "Book This Property" button in Phase D5.
