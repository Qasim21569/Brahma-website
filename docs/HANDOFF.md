# HANDOFF — read this first

> **The single source of truth for current state.** What is done, what is next,
> what is blocked. Nothing else.
> **Last updated:** 2026-08-17 (amenities + property imagery)

## Which doc wins

Four live docs, one job each. **When they disagree, the one higher in this table
wins** — this ordering exists because they had already drifted apart once.

| Doc | Job |
|---|---|
| **HANDOFF.md** (this file) | **Current state.** Authoritative on what is done and what to do next. |
| **BUILD-PLAYBOOK.md** | The *how*. Design grammar (§2), Section Recipe (§3), defects (§4), phases (§5). |
| **PHOTO-PIPELINE.md** | Imagery, end to end. Owner doc for the enrichment script and `public/properties/`. |
| **MASTER-PLAN.md** | The *why*. Locked decisions D1–D11 (§2) and the design system (§4). |

`RESUME-PROMPT.md` is not a plan — it is the copy-paste prompt and file list for
starting a session elsewhere.

**`docs/archive/` is obsolete. Do not follow it.** Seven files, all superseded.

---

## Where the project stands

**Build is green:** `npx next build` → 22 static routes, TypeScript clean.

| Area | State |
|---|---|
| Stack | Next 16 · React 19 · Tailwind v4 (`@config` bridge) · Motion v12 · Lenis · GSAP · TS |
| Homepage | ✅ **Complete** — hero, About/Story, Process, Selected Work, Philosophy, Stats, CTA |
| About page | ✅ **Complete** — Phase B |
| Portfolio page | ✅ **Complete** — Phase C. All 12 assets, filter pills, no-photo cards, mobile CTA buttons |
| Property detail pages | ✅ **Complete** — Phase D. 12 SSG routes, prev/next, gallery 0-state |
| Services page | ✅ **Complete** — Phase E1. Capability framing, Heal Construct credited |
| Contact page | ✅ **Complete** — Phase E2. ⚠️ Email addresses need client confirmation |
| Careers page | ✅ **Complete** — Phase E3. Built on the sourced LODGING narrative |
| Legal pages + footer | ⚠️ **Built but pre-grammar.** Phase E4–E5. |
| Property data (12 assets) | ✅ Built. Prose is placeholder for 10 of 12. |
| Photography | ✅ **11 of 12 assets**, all API-sourced and credited except Clarion Pointe. Only the Weeki Wachee residence has none. |
| Amenities | ✅ **Live on 11 of 12 detail pages**, sourced from Google. Replaced "Our Approach". |
| Enrichment script | ✅ Written, self-tested, **key working**. Derives amenities as of 2026-08-17. |
| Preloader | ✅ **Live at 5000ms** — Phase F1. Was never actually disabled, just shorter |
| Page transitions | 🔲 Built but disabled. Phase F2. |

### Done this session (2026-08-17)

**Amenities + the two missing images.** Both of the client's open items, plus
three data conflicts found on the way.

- **`sections/PropertyAmenities.tsx`** replaces the "Our Approach" block on all
  12 detail pages. That block rendered the same Acquire/Renovate/Operate copy on
  every page — literally the shared `THESIS` constant for 10 of 12 — so it
  duplicated the homepage Process section and said nothing about the asset being
  viewed. Amenities are per-property and sourced. Dark section, so it holds the
  light/dark alternation the removed block used to provide.
- 🚨 **`name` was wrong for Holiday Inn Express Orlando.** It read "Holiday Inn
  Express & Suites Orlando at SeaWorld" — **a different hotel**, at 10771
  International Dr, phone (407) 996-4100. Our address (2776 Destination Pkwy)
  *and* phone ((407) 640-7500) both match **Holiday Inn Express Orlando – South
  Park** exactly. Two confirmed fields outvoted the third. **This single wrong
  field is why the asset had no photography** — enrichment searches on
  `name + address`, matched the other hotel, and the address guard correctly
  rejected it every run. Corrected; 6 owner photos now on disk. Slug left alone
  so the URL doesn't break.
- **`name` was near-missing for Quality Inn Conference Center** — ours said
  "Quality Inn Conference Center Tampa/Brandon", Google says "Quality Inn **and**
  Conference Center Tampa-Brandon". Same hotel (address + phone match), but the
  owner-photo heuristic compares the author name to this string, and the missing
  "and" rejected all 7 of the hotel's own photos. Aligned to the profile name.
- 🚨 **`enrich-properties.mjs` silently emptied every gallery on a facts-only
  run.** `out[slug] = record` replaces the record wholesale, and `photos` was
  only ever set inside the `--photos` branches — so the DEFAULT invocation wiped
  all photo references while the files sat untouched on disk. Hit for real this
  session. `photos` is now carried forward at record construction. **Worth
  knowing: a green build would not have caught this** — the galleries would just
  have been empty.
- **Attribution was wrong across the whole portfolio.** Every one of the ~60
  previously-fetched photos was stored `attribution: null`, which only happens
  under `--all-photos` (it sets `credit: null` unconditionally). Guest photos
  were therefore recorded as needing no credit. Re-fetched with the owner
  heuristic on: **every stored photo now carries a genuine owner credit**, and
  `PhotoAttribution` renders it.
- `deriveAmenities()` + 8 self-test cases added; `--self-test` is now 22 cases
  and all pass. `npx next build` still 22 routes.

**Then, same day — the manual images were replaced by API-sourced ones.** The
Clarion Pointe and Hampton galleries had been **hand-downloaded from Google
image search**, so they were never "our own photography" in the sense the code
assumed.

- **Hampton Inn switched to Places.** Same photographs Google serves the owner
  uploads from, now properly credited, and one at 1600x1067 (source 4800x3200,
  capped by `PHOTO_MAX_WIDTH`). Its `name` was **also wrong** — "Hampton Inn &
  Suites Tampa Airport Westshore", when the address, phone and the slug all say
  **"Hampton Inn Tampa-Veterans Expwy (Airport North)"**, no "& Suites".
  (#8 in `properties.ts` *is* a "Hampton Inn & Suites" — different asset.)
- **Clarion Pointe deliberately kept manual.** Places only serves **600x400**
  for it, against the 1360x1020 manual hero. Too soft for the detail page's
  16:9 band, and it is `properties[0]` — the full-bleed homepage hero.
- 🔑 **`ownPhotographyProperties` was redefined.** It inferred "creditless" from
  gallery attribution, which broke the moment Hampton kept its hand-held chrome
  stills but took its gallery from Places: the property dropped out and the
  homepage image band silently fell to one image. It now selects on a
  hand-authored `homeHeroSrc` in the RAW `properties` array — a direct statement
  that we hold the file, independent of the gallery's source.
- **Chrome and gallery are now separate concerns.** Hampton keeps
  `homeHeroSrc`/`homeSatelliteSrc` pointing at its manual webp files for the
  homepage, while `gallery: []` lets enrichment fill the detail page. Verified
  in the built HTML: the homepage references **only** the two hand-held
  `.webp`s and **no** `g-*.jpg`.
- **`readProperties()` fixed twice over.** Blocks now run slug-to-slug instead
  of a fixed 2000-char window, and `hasOwnPhotos` tests for a **non-empty
  hand-authored `gallery`** rather than `homeHeroSrc` — testing the latter meant
  any asset keeping a chrome still skipped its photo fetch entirely.
- ⚠️ **4 orphaned files left on disk on purpose:**
  `hampton-inn-tampa-veterans-expwy/03-gallery-1.webp` … `06-gallery-4.webp`.
  Superseded by the Places set, but they were **hand-collected and cannot be
  re-fetched by the script**, so they are not deleted without a decision.
  `01-hero.webp` and `02-satellite.webp` in that folder are still live chrome.

---

### Done previously (2026-08-13)

**Phase A — homepage finished.** Details in BUILD-PLAYBOOK §5 Phase A.

- Philosophy now carries the *investment thesis*; the founder story no longer
  appears twice on the page (D-2).
- Stats claimed **02 properties against a portfolio of 12**. Every figure now
  derives from `enrichedProperties` / `company.ts`, so it cannot drift (D-1).
- CTA ghost wordmark re-animated via `ui/GhostWordmark.tsx`; the dead
  `data-wordmark-scale` attribute is gone (D-3).
- Orphaned `ui/Photo.tsx` deleted (D-4, D-5).
- **`CountUp` server-rendered `00` instead of its target** — every figure was
  invisible with JS off and to crawlers. Fixed at the component (D-6).
- 🚨 **`Public/` → `public/` renamed (D-7).** The static folder was git-tracked
  capitalised. Windows hid this completely; **on Vercel's Linux build every image
  would have 404'd.** 32 renames staged, on-disk casing verified. A green local
  build was not evidence.
- Photo pipeline: `scripts/enrich-properties.mjs` written (D-8), attribution
  threaded through `properties.ts` → `ui/PhotoAttribution.tsx` → both portfolio
  surfaces, and `ownPhotographyProperties` added as a guard so an attributed
  photo cannot reach the homepage hero.

**Phase B — About page complete.**

- **The page had zero images**, and its narrow column held empty `<div />`
  placeholders on two rows — which is why it read as a wall of text. Now carries
  the founder portrait (`/founder-image.png`, previously unused), a full-bleed
  parallax band, and a supporting image in Approach. **No API calls needed** —
  every asset was already on disk.
- Hero rebuilt as an editorial variant; the oversized-heading-plus-paragraph
  shape is gone (B4).
- Team grid: `HoverReveal` swaps role ⇄ focus, with `min-h` reserving the taller
  state so the grid cannot reflow on hover.
- Affiliated companies are `StyledLink` rows (B6). **Their `sector` and
  `description` are deliberately no longer rendered** — both are inferred from
  entity names, and publishing an inferred business purpose for a real
  registered company is a risk not worth taking for layout. Still in
  `company.ts`; re-add once signed off (blocked-item 4).
- About's stats were separately hardcoded `03` / `2001`; now derived like the
  homepage.
- **`pt-[104px]` replaced with `pt-[var(--nav-h)]` on all 8 pages.** `--nav-h`
  is 68px mobile / 78px desktop, so every page had a 26–36px dead gap under the
  navbar.
- `public/Site Photos/` → `public/site-photos/`. A space in a static asset path
  is an encoding footgun across dev/CDN; the folder was unreferenced, so the
  rename was free.

---

**Phase E1 — Services page complete.** Rebuilt as a *capability* page rather
than a services menu, since BMIG operates what it owns. Full decision record in
BUILD-PLAYBOOK §5 Phase E.

- **Heal Construct credited as a preferred partner**, linked, with their own
  three capabilities (Design · Build · BIM). Deliberately claims **no joint
  project** — their published portfolio is entirely residential, so they are not
  described as a hotel contractor.
- Three pillars (Capital / Repositioning / Operations) run on a **different axis
  from the homepage Process** (Acquire → Renovate → Operate) so the two do not
  duplicate. Preserve that distinction if you edit either.
- Deleted: **"Brahmas Capital Partners"**, a subsidiary that does not exist in
  `company.ts`; and **2 AI-generated images hotlinked from Google's CDN** (D-10 —
  the other 3 went with the contact and careers rebuilds).
- The accordion claimed **"our construction team oversees every phase"** —
  an in-house contracting arm the group does not have, which also contradicted
  crediting an external partner. Rewritten.
- Components ported from the references: `PillarCard` (hetari), `FlickerText`
  and `InlineList` (the-line), `DrawnRule`.
- **The pillar numbering and the spinning mark were rejected and removed.** The
  card had three competing numbering systems — `( 01 )`, a ghost numeral, and
  `01/02/03` sub-rows — plus a perpetually turning mark. Scale contrast now
  comes from the pillar's own name set large and faint behind it, and the mark
  is replaced by `DrawnRule` as the card's top edge.

**Phase E1 v3 — the signature is `sections/ThresholdReveal.tsx`, and it is
🅿️ PARKED.** Built and verified, then deliberately commented out in
`services/page.tsx` on the client's instruction — they are staging what they
reveal rather than showing every upgrade at once. A quiet full-bleed photo band
stands in. **The file must not be deleted as an orphan**; re-enabling is
uncommenting one import and one block. A 420vh
pinned sequence: the headline **splits apart and you pass between the lines**,
then a shutter opens by `height` to reveal the asset, then the mark settles over
it. Ported from **`../sequent-media-house-main/`** — closest stack to ours
(Next 16 / React 19 / Tailwind v4 / Motion / GSAP / Lenis), so its code ports
almost verbatim. Full record in BUILD-PLAYBOOK §5 Phase E1.

Two earlier attempts, both rejected, both instructive:

1. **Flat.** No signature at all, because I enforced "Elementis has exactly one
   sticky section" as though it were a constraint. It was my own stylistic
   inference.
2. **An aperture** — the Brahmas mark as a `mask-size` scrub (Axel-Vanhessche).
   Right idea, wrong execution: `mask-size` repaints every frame, and one
   growing shape is a single beat. Replaced by the height-based shutter.

> **Lesson worth keeping:** both misses came from settling on the first
> plausible mechanic instead of reading the reference codebases properly. The
> reference table had `Axel-Vanhessche` marked "not used, ignore" and
> `hetari` as "rarely needed" — both wrong, both now corrected. **Read them
> before inventing.**

---

**`SectionTitle` — now v6 (2026-08-17), a readability fix.** v5's fixed
`text-muted-azure` measured **2.48:1** on the light canvas — a real WCAG AA
failure, not a preference. Colour is now tone-aware (`muted-azure-dim` 4.77:1 on
light, `muted-azure` 6.72:1 on dark), the type is up to 22px at the 1440
reference, and **tracking is cut 0.18em → 0.08em**, which helps more than the
size. All 33 call sites were audited — every `tone` already matched its canvas,
so nothing else needed touching. Full record in BUILD-PLAYBOOK §2.5.

**The v5 record, for context:** Went through five treatments in
one day; full history in BUILD-PLAYBOOK §2.5. The client rejected v4's
bracketed numeral (`( 01 )`) outright — no numbering on section labels at
all — so it was reverted the same day it shipped, including deleting the
`lib/sectionCounter.ts` it depended on. **Current: a small square mark + the
label, both fixed `text-muted-azure`, one line, nothing stretches, nothing
counts anything.**

**Portfolio page grid — fixed.** The asset grid was nested inside the
`[1fr_1.9fr]` text-content grammar, which squeezed the 2-column card grid into
66% of the section width and left a full-height empty gutter on the left —
visibly broken in a client screenshot. `SectionTitle` now sits full-width on
its own row; the grid spans the full section below it. This is now a
documented exception to the Section Recipe (BUILD-PLAYBOOK §3) — a card/media
grid never goes in the 1.9fr column.

**Portfolio cards — mobile CTA added.** The only "this card goes somewhere"
cue was `HoverReveal` swapping city/state to "View property" — which never
fires on touch. Desktop keeps the hover swap; mobile now gets an explicit
`View property →` pill button, styled as a button but a `<span>` (the card is
already one big `<Link>`; nesting another interactive element inside it is
invalid HTML). Same fix needed anywhere else `HoverReveal` is a card's only
CTA — see BUILD-PLAYBOOK §2.6.

**Property amenities — RESOLVED 2026-08-17, sourced from Google.** The blocker
was "no data that isn't invented". That still rules out the franchise-brand
assumption route, but Google turned out to publish two usable per-property
sources: the `editorialSummary` (which names amenities outright — *"an outdoor
pool & a fitness room, plus free breakfast & Wi-Fi"*) and the structured
`accessibilityOptions` / `allowsDogs` / `goodForChildren` booleans.
`deriveAmenities()` in the enrichment script maps both to labelled amenities.
**Every published amenity traces to a Google assertion; nothing is inferred
from the brand.** 5–8 items per hotel.

Why not the brand pages, which list ~18: **Choice, Hilton and IHG all block
automated fetching** — Choice drops the TLS connection outright, Hilton returns
403. Not a rate limit, not a header problem. The section links out to the
operator's page for the full list, and a hand-authored `amenities` array on a
property literal overrides the generated one if someone supplies the fuller
data by hand.

**Photography is now 11 of 12.** Holiday Inn Express Orlando was never an asset
problem — see the name correction below. **Beach House Weeki Wachee genuinely
cannot be solved this way**: 10492 Pine Island Dr is a private residence with no
Google business listing, so Places returns only a bare geocode. Searching
"Beach House" near that address returns *Alfred A. McKethan Pine Island Park*, a
public county park, with guest-uploaded photos. **Publishing those as the
group's residential asset would be a fabrication** — do not force this match.
It needs client-supplied photography. The `PropertyCardMedia` fallback renders
correctly meanwhile.

---

## Do next

### The client's own to-do list (their priority order, 2026-08-13)

Sent as a checklist; struck-through items are already done. **This supersedes
the phase ordering below** — work these first.

| # | Item | State |
|---|---|---|
| 1 | Highlight titles properly | ✅ **done** — `SectionTitle` v5, see above |
| 2 | Add amenities section to property detail pages | ✅ **done** — `sections/PropertyAmenities.tsx`, live on 11 of 12. Replaced "Our Approach" |
| 3 | Add proper buttons in mobile views linking to property pages | ✅ **done** for portfolio cards. **Audit other surfaces** — anywhere `HoverReveal` is the only CTA has the same touch problem |
| 4 | Add two missing property images | ⚠️ **half done** — Holiday Inn Express Orlando ✅ (6 owner photos). Beach House ❌ **not fetchable** — private residence, no Google listing. Needs client photography |
| 5 | Portfolio page hero + desktop view images rework | ⬅ **next, unblocked** |
| 6 | ~~Increase preload animation to 5 sec~~ | ✅ **done** — 5000ms, see Phase F1 |
| 7 | Bottom CTA and footer rework | ⬅ **unblocked** — overlaps Phase E5 |
| 8 | ~~Remove company groups, replace with construction partners~~ | ✅ **done** — About §"Construction partners" |
| 9 | Mobile navbar rework | ⬅ **unblocked** — `components/layout/Navbar.tsx`, mobile drawer at `md:hidden` |

### Then, remaining project phases

1. 🔑 **Unblock the API key** — see "Blocked on the client" item 1. Everything is
   wired and waiting; the only thing missing is one console setting.
2. **Phase E4** — legal pages (52/69 lines). Both still carry the unconfirmed
   `info@brahmagroup.com`.
3. **Defect D-9** — wire the remaining unused photos in `public/site-photos/`
   into the two existing galleries. Free depth, already licensed. Two are now in
   use on About.
4. **Mobile pass at 375px** across homepage, About, portfolio and a detail page
   (A5 / B8 / C6 / D7). *Needs the user's eyes; they do all visual testing.*
5. **Phase F2–F6** — page transitions, brand sweep, reduced-motion audit.
   (F1 preloader is done.)

**Not yet committed.** The working tree holds a staged case-rename plus ~30
untracked files — Phases 0–3 appear never to have been committed. Committing
soon is advisable; a case-only rename sitting on that much uncommitted work is
fragile.

---

## Blocked on the client

1. ✅ **Google Places API key — WORKING.** Resolved before 2026-08-17; all 12
   lookups return 200. Nothing to do here.

   ⚠️ Still true, if the key is ever replaced: write `.env` files as **UTF-8**.
   The file first arrived UTF-16 (PowerShell `>` / `Out-File` default), looked
   correct in an editor, and parsed as `￾GOO…`. **Next.js cannot read a UTF-16
   `.env` either.** `loadEnvLocal()` decodes both as a safety net.

1a. ✅ **Fort Myers is a La Quinta — confirmed by the client 2026-08-17.**
   `name` and `brand` corrected to **"La Quinta Inn and Suites Fort Myers
   I-75" / Wyndham**; 6 owner photos fetched. **The slug stays
   `sleep-inn-suites-fort-myers-airport`** — it is the live URL and the photo
   directory path. Clarion Pointe Lakeland also confirmed correct as-is,
   despite Google returning a Sleep Inn `websiteUri` for it.
2. 🚨 **Contact details — nothing on the site is confirmed.** The contact and
   careers pages published **invented** offices in New York and London,
   **reserved-fiction phone numbers** (`+1 212 555-01xx`), and **three job
   vacancies that do not exist**. All deleted. What remains is the
   `@brahmagroup.com` email domain, which is unconfirmed rather than provably
   false — note it has **no "s"**. Everything now lives in
   `src/data/contact.ts` behind `CONTACT_DETAILS_UNCONFIRMED = true`.
   **The client must supply: a real HQ address, a real phone number, and
   confirmation of the email domain.** The legal pages still carry the same
   unconfirmed address.
3. **A form backend.** The contact form posts via `mailto:` because none exists.
   Works, but it is not a real submission pipeline.
4. **Photography for the Weeki Wachee residence only.** The other 11 are done.
   A private house has no Google business listing, so the pipeline cannot help;
   this one has to come from the client. Higher-resolution originals for the
   other 11 are still worth requesting — franchise media kits, PHOTO-PIPELINE.md
   §4.1 — since the Places copies are capped at 1600px and carry a mandatory
   credit that client-owned originals would not.
5. **Property counts.** The LODGING article says 11 hotels / 7 Choice; our data
   has 10 hospitality / 5 Choice, +1 education, +1 residential. Reconcile before
   publishing.
6. **Affiliated company descriptions** — currently *inferred from entity names*.
   Do not publish an inferred business purpose for a legal entity without
   sign-off.
7. **Team names + headshots** — 5 placeholder roles, monogram fallbacks in place.
8. **Founder narrative + the 2 LODGING quotes** — need sign-off.
9. **Replace placeholder prose** — 10 of 12 properties are
   `contentStatus: "placeholder"`.

---

## Verification

```bash
npx tsc --noEmit          # types
npx next build            # must stay at 22 routes
npm run enrich:check      # offline checks on the enrichment script
```

To confirm something renders server-side (the user does all visual testing):

```bash
grep -o "Your text" .next/server/app/index.html
```

`next build` failing with repeated `Error while requesting resource` is
`next/font` failing to reach Google — transient, retry.

---

## Landmines

- **Never add a global CSS class that hides content** (`opacity: 0`) unless a
  mounted component is guaranteed to reveal it. This made 29 elements invisible
  across 6 pages.
- **Never rely on inherited colour** across a light/dark boundary.
- **Never return `null`** from a viewport-branching component.
- **Never reintroduce a page-level `max-w-*` container.**
- **Never resurrect the split hero.** `HeroSplit.tsx` is deleted (D11).
- **A green local build is not proof.** Windows' case-insensitive filesystem hid
  D-7 for months. Anything filesystem- or case-sensitive needs checking against
  Linux behaviour.
- **Delete orphans immediately.** Dead files and dead `data-*` attributes have
  repeatedly caused confusion here.
- `properties.ts` merges `places.generated.json` at import and **hand-authored
  values always win**, so re-running enrichment cannot clobber approved copy.
- Two slugs deliberately mismatch their names
  (`clarion-pointe-tampa-brandon`, `hampton-inn-tampa-veterans-expwy`) because
  photography lives at those paths. **Do not rename.**
- **1 of 12 properties has no images** (Weeki Wachee), and **1 is deliberately
  withheld** (Fort Myers, pending the brand question). Use `featuredProperties`
  where an image is required; `ownPhotographyProperties` for chrome with no
  credit slot. That second list is now doing real work: **every Places-sourced
  photo carries a mandatory credit**, so only the two hand-authored galleries
  qualify for the homepage hero and other creditless surfaces.
- **`enrich-properties.mjs` replaces each record wholesale.** Any field not set
  on every run is dropped. This already cost the galleries once — see the
  2026-08-17 notes. Add new fields at record construction, not inside a
  flag-guarded branch.
