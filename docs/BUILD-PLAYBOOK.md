# BRAHMAS — Build Playbook

> **Purpose:** the design grammar established on the homepage, plus every piece of
> remaining work, written so a **fresh session with zero context** can execute it.
> **This document is the *how*.** The whole homepage is now DONE and is the
> reference implementation; everything else follows its pattern.
>
> **Current state lives in [`HANDOFF.md`](./HANDOFF.md)** — read that first, and
> it wins if the two disagree. `MASTER-PLAN.md` is the *why* (§2 locked
> decisions, §4 design system). Imagery is [`PHOTO-PIPELINE.md`](./PHOTO-PIPELINE.md).

---

## 0. Fresh-session prompt

**Moved to [`RESUME-PROMPT.md`](./RESUME-PROMPT.md)**, which carries the full
prompt, the list of which files to attach in which order, and the mistakes a cold
session reliably makes. Use that.

---

## 1. Reference codebases — paths and what to take

**Project root:**
`C:\Users\qasim\Claude\Projects\BRAHMA Group Website Development\`

Working directory is `brahma-web/`. References sit as siblings, so from
`brahma-web/` they are `../<name>/`. **Read-only — never edit them.**

| Path | Use it for |
|---|---|
| `../Elementis-SOTD/` | **PRIMARY (~70%).** Section architecture, text reveal, image parallax, sticky scroll, marquee, hero, link/button hovers. |
| `../the-line-awwwards-SOTM/` | Accordion (`components/AccordianItem.tsx`), hover text swap (`HoverReveal.tsx`), scroll-linked card entrance (`ProjectCard.tsx`), Desktop/Mobile component split. |
| `../otis-valen-next/` | Page transitions (`app/template.tsx` + `components/chrome/TransitionOverlay.tsx`). |
| `../ochi.design-UI-Clone/` | Image hover: scale-down + title rise (`src/components/Featured.jsx`). |
| `../hetari-portfolio/` | **More useful than previously recorded.** `src/components/ServicesCard.vue` is the numbered-pillar pattern ported as `ui/PillarCard.tsx` + `ui/RotatingMark.tsx`. Also `MagneticEffect.vue` (unused so far) and marquee velocity (`src/components/design/horizontal-loop.js`). It is Vue — read it for the pattern, not the code. |
| `../sequent-media-house-main/` | **Closest stack to ours** — Next 16, React 19, Tailwind v4, Motion v12, GSAP, Lenis. Code ports almost verbatim. `src/app/home.jsx` is the reference for **pinned multi-layer scroll choreography**: one pinned container, one master timeline, stacked layers taking over in sequence. `ExpandingSection.jsx` opens by `height`, not by mask. Also worth mining: `RowAnimation` (multi-speed row parallax), `CursorTrail`, `CharReveal`, `Loader`, `hyper-text`. |
| `../Axel-Vanhessche/` | Origin of the aperture idea (`mask-size: 0% → 170%` scrubbed on a pinned trigger). **Superseded by sequent's height-based shutter** — see the E1 record for why. Read for the concept, not the implementation. |
| `../awwwards-collection/` | Not used. Ignore. |

### The Elementis files that matter most

| File | What it gives you |
|---|---|
| `../Elementis-SOTD/app/globals.css` | The `--multiplier` fluid scaling system |
| `../Elementis-SOTD/sections/Hero/Server.tsx` | Bottom-anchored hero composition |
| `../Elementis-SOTD/sections/Introduction/Server.tsx` | **The canonical text section** — asymmetric grid, hand-broken lines |
| `../Elementis-SOTD/sections/WellnessSanctuary/Server.tsx` | Image-one-side / text-other-side section |
| `../Elementis-SOTD/components/Client/Innovation.tsx` | Sticky 500vh scroll section |
| `../Elementis-SOTD/components/Client/ClipImageCard.tsx` | The card inside the sticky section |
| `../Elementis-SOTD/components/Server/MaskText.tsx` | Line-by-line text reveal |
| `../Elementis-SOTD/components/Client/ParallaxContainer.tsx` | Image moving inside its frame |
| `../Elementis-SOTD/components/Server/StyledLink.tsx` | Underline-sweep link |
| `../Elementis-SOTD/components/Server/BorderedButton.tsx` | SVG border-draw button |

---

## 2. The design grammar

This is what the finished homepage sections do. **Every new section follows it.**

### 2.1 Layout — the asymmetric grid

Every content section is the same two-column grid. Label left, content right.

```tsx
<section className="px-margin-edge py-section-gap">
  <div className="grid grid-cols-1 gap-gutter md:grid-cols-[1fr_1.9fr]">
    <SectionTitle>Label</SectionTitle>
    <div>{/* content */}</div>
  </div>
</section>
```

- **No page container.** No `max-w-*` wrapper, no `mx-auto`. Sections are
  full-bleed, inset only by `px-margin-edge`. Constrain *text blocks*
  (`max-w-xl`) — never the section. (Elementis has no page container at all.)
- `[1fr_1.9fr]` is the default. `[1fr_1.375fr]` is the denser variant.
- On mobile it collapses to one column. If a child must be `sticky` on mobile,
  use `flex flex-col md:grid` instead — grid puts stacked children in separate
  rows, and a row only as tall as its own content cannot stick. (This bit us in
  `Process.tsx`.)

### 2.2 Text reveal — line by line, hand-broken

**Every headline AND every body paragraph reveals line by line.** This is the
single most recognisable Elementis trait.

```tsx
<MaskText
  className="font-headline-lg text-headline-lg text-primary"
  lines={["Architectural integrity", "translated into enduring", "financial performance."]}
/>
```

- Lines are **hand-set arrays**, never auto-wrapped prose. You choose every break.
- Body copy uses `MaskText` too — not `<p>` inside `<Reveal>`.
- Different breaks per breakpoint → `ResponsiveMaskText` with `mobile` /
  `desktop` arrays (it renders desktop server-side; never returns `null`).
- Content that changes with scroll state → `SwapMaskText` (mask direction
  follows scroll direction).
- `Reveal` is only for things that are not text lines: buttons, images, cards.
- Keep lines ≲45 characters or they re-wrap and destroy the intended rag.

### 2.3 Motion vocabulary

| Need | Component | Notes |
|---|---|---|
| Headline / body reveal | `MaskText` | `y:100%→0%` + `clipPath` inset, `staggerChildren` |
| Per-breakpoint line breaks | `ResponsiveMaskText` | desktop is the SSR default |
| Text that swaps on scroll state | `SwapMaskText` | directional |
| Non-text entrance | `Reveal` | fade + travel |
| Image clip-wipe on entry | `RevealImage` | |
| Image moving inside its frame | `ResponsiveImage` | wraps `ParallaxContainer`; `parallaxAmount={8}` sections, `{20}` full-bleed |
| Layered image wipe (sticky sections) | `ClipImageContainer` | |
| Number counting up | `CountUp` | |
| List link | `StyledLink` | underline sweeps from right |
| Emphasised button | `BorderedButton` | SVG border draws on hover |
| Label swap on hover | `HoverReveal` | |
| Section label | `SectionTitle` | hamburger + uppercase |
| **Signature scroll sequence** | `sections/ThresholdReveal` | pinned 420vh; type splits → shutter opens by `height` → mark settles. Desktop only — see Phase E1 |
| Numbered capability pillar | `ui/PillarCard` + `ui/RotatingMark` | `( 01 )`, sub-rows, ghost numeral, slow-turning mark |
| Per-letter hover flicker | `ui/FlickerText` | **must** carry `aria-label` + `aria-hidden` letters |
| Slash-separated inline list | `ui/InlineList` | `staggerChildren: 0.06` |

**One easing everywhere:** `[0.24, 0.43, 0.15, 0.97]`. No bounce, no spring
(except the Process progress rail). Durations 0.6–0.8s. Stagger 0.05–0.1s.

### 2.4 Colour and rhythm

Light canvas `#f4f1ec` is the default. Dark sections are deliberate punctuation.

**Rule: every dark section sets `bg-*` AND `text-*` explicitly.** Never inherit
colour across a light/dark boundary — that caused the original invisible-text bug.

Current homepage rhythm — keep alternating:
```
Hero          DARK   (bg-ink-deep, full-bleed media)
About/Story   LIGHT
Process       DARK   (bg-ink-mid)
Selected Work DARK   (bg-ink-deep, sticky)
Philosophy    LIGHT
Stats         LIGHT  (bg-stone-white, hairline-bounded)
CTA           DARK   (bg-primary + ghost wordmark)
```

### 2.5 Typography

Newsreader (display) + Manrope (body). **No bold anywhere** — weights 300/400/500.
`line-height: 1` on display, `1.3` on body. Sizes come from `--t-*` variables in
`globals.css`, never hardcoded. To resize, edit those variables, not the config.

### 2.6 Mobile

- CSS-first (`md:`) for layout. Only branch in JS when behaviour genuinely differs.
- **Never return `null`** from a viewport-branching component — render desktop
  server-side, swap after hydration, or crawlers see nothing.
- Sticky/500vh sections need mobile-specific geometry; don't ship desktop values.
- Test 375 / 768 / 1024 / 1440. Touch targets ≥44px. No horizontal overflow.

---

## 3. Section Recipe — follow for every new section

1. Wrap in `<section className="px-margin-edge py-section-gap">` (+ explicit
   `bg-*` and `text-*` if dark).
2. Inside: `grid grid-cols-1 gap-gutter md:grid-cols-[1fr_1.9fr]`.
3. `<SectionTitle>` in column 1.
4. Column 2: headline via `MaskText` with hand-broken lines.
5. Body copy via `MaskText` with hand-broken lines (**not** `<p>`).
6. Images via `ResponsiveImage` (parallax) or `RevealImage` (clip-wipe).
7. Links via `StyledLink`; primary action via `BorderedButton`.
8. Alternate light/dark against the neighbouring sections.
9. Check the mobile collapse. If something sticks, use `flex flex-col md:grid`.
10. `npx tsc --noEmit && npx next build`. Delete anything you orphaned.

---

## 4. Known defects (verified 2026-08-13)

| # | Defect | Location | State |
|---|---|---|---|
| **D-1** | **Stats show `02` properties. There are 12** (10 hospitality, 1 education, 1 residential). Figures are hardcoded and wrong. | `src/app/page.tsx` Stats | ✅ fixed — all four derived from `enrichedProperties` / `company.ts` |
| **D-2** | **Duplicate copy** — "Our story begins on the floor of a hotel…" appears **twice** on the homepage (About/Story body *and* Philosophy headline). | `src/app/page.tsx` | ✅ fixed — Philosophy now carries the investment thesis |
| **D-3** | **Dead attribute** `data-wordmark-scale` — the GSAP provider that read it was deleted in Phase 0. Ghost wordmark is static. | `src/app/page.tsx` CTA | ✅ fixed — `ui/GhostWordmark.tsx` (Motion `useScroll`) |
| **D-4** | **Dead attribute** `data-parallax` — same cause. | `src/components/ui/Photo.tsx` | ✅ fixed — file deleted |
| **D-5** | `Photo.tsx` appears unused. Confirm, then delete. | `src/components/ui/Photo.tsx` | ✅ fixed — no importers; deleted |
| **D-6** | **`CountUp` server-rendered `00`**, not the target, contradicting its own docstring — every figure was invisible with JS off and to crawlers. | `src/components/ui/CountUp.tsx` | ✅ fixed — motion value seeded at `to`, reset to 0 on enter-view |
| **D-7** | 🚨 **LAUNCH BLOCKER — the static folder was `Public/`, not `public/`.** Git tracked it capitalised. Windows' case-insensitive filesystem hid this locally, but Vercel builds on Linux, where Next.js does not recognise `Public/` — every image, the logo and all property photography would have 404'd in production. | `brahma-web/public/` | ✅ fixed — case-only `git mv`; 32 renames staged, on-disk name verified lowercase, build re-run clean. **Not yet committed.** |
| **D-8** | `scripts/enrich-properties.mjs` **did not exist.** Both `HANDOFF.md` and this playbook name it as the thing that unblocks booking URLs; `src/data/places.generated.json` is `{}`. The overlay in `properties.ts` was already built and correct — only the generator was missing. | `brahma-web/scripts/` | ✅ written — facts by default, photographs behind an opt-in `--photos` flag. Both guards offline-tested via `npm run enrich:check`. See [PHOTO-PIPELINE.md](./PHOTO-PIPELINE.md). Still needs the client's API key to run. |
| **D-9** | **21 client-supplied photos were sitting unused** in `public/site-photos/` (11 Clarion Pointe, 10 Hampton Inn) — a superset of the 11 wired under `public/properties/`. Decide whether the rest join the galleries. | `public/site-photos/` | ⬅ **partly done** — 3 now in use (About ×2, Services ×1); 18 still unused |
| **D-10** | 🚨 **AI-generated placeholder images hotlinked from Google's CDN.** Five `<Image src="https://lh3.googleusercontent.com/aida-public/…">` — Google Stitch/AI Studio output served live from Google. Not owned, not licensed, and they break whenever Google expires the URL. This is also the only reason `next.config.mjs` whitelists that host. | services, `contact`, `careers` | ✅ **fixed** — all five removed 2026-08-13 and the `remotePatterns` entry deleted from `next.config.mjs`. Every image now comes from `public/`. |

---

## 5. Remaining work

### Phase A — finish the homepage ✅ (code complete 2026-08-13)

- [x] **A1 Philosophy** — D-2 resolved. Headline is now the thesis
      ("Operational excellence before financial engineering."); both body blocks
      are hand-broken `MaskText`; `bg-surface-container/50` dropped for the plain
      light canvas, so the rhythm reads DARK (SelectedWork) → LIGHT → stone-white.
- [x] **A2 Stats** — D-1 resolved. `stats[]` at module scope in `page.tsx` derives
      from `enrichedProperties.length` (12), `new Set(...assetType).size` (3),
      `founder.yearsInIndustryValue` (27+) and `founder.firstOwnershipYear` (2001).
      Two numeric fields were added to `company.ts` so nothing is typed twice.
      All four in `CountUp`; `SectionTitle` + `[1fr_1.9fr]` grid added.
      No financial figures published.
- [x] **A3 CTA** — D-3 resolved via `ui/GhostWordmark.tsx`. Headline and body are
      `MaskText`; one action. Copy corrected "hospitality assets" →
      "operating assets" (HANDOFF blocked-item 6).
- [x] **A4** `npx tsc --noEmit` clean · `npx next build` clean at 22 routes.
      Verified in `.next/server/app/index.html`: all four figures present as
      `12` / `03` / `27+` / `2001`, founder story appears exactly **once**, and
      `data-wordmark-scale` is gone.
- [ ] **A5** Mobile pass at 375px — **needs the user's eyes.** The two changed
      sections collapse via `grid-cols-1`; nothing sticky was introduced, so the
      `flex flex-col md:grid` caveat in §2.1 does not apply.

> ⚠️ Do **not** call the homepage shippable until **D-7** is fixed. Locally every
> image resolves; on Vercel none of them will.

### Phase B — About page ✅ (complete 2026-08-13)

- [x] **B1** Every section on the asymmetric grid with `SectionTitle`.
- [x] **B2** Headlines and all display-scale body copy → hand-broken `MaskText`.
      **Deliberate deviation:** the six `founder.story` narrative blocks stay
      `Reveal` + `<p>`. They are 60–90 word paragraphs; hand-breaking them at
      §2.2's ~45-character cap would mean ~84 hand-set lines whose breaks would
      not survive the column changing width at `sm:`. MaskText carries the
      display-scale copy instead.
- [x] **B3** Imagery added — **the page previously had none.** Founder portrait
      (`/founder-image.jpeg`), a full-bleed band (`parallaxAmount={20}`) and a
      supporting image in Approach (`parallaxAmount={8}`), both from
      `public/site-photos/`. No API calls required.
- [x] **B4** Hero rebuilt as an editorial variant — the forbidden
      oversized-heading-plus-paragraph shape is gone.
- [x] **B5** Team grid: `RevealImage` per portrait, monogram fallback retained,
      `HoverReveal` swapping role ⇄ focus with `min-h` so the grid cannot reflow.
- [x] **B6** Affiliated companies are `StyledLink` rows. **`sector` and
      `description` are no longer rendered** — both are inferred from entity
      names, and publishing an inferred business purpose for a real registered
      company is a risk not worth taking for layout. Still in `company.ts`;
      re-add the sector as a muted suffix once signed off.
- [x] **B7** Rhythm: Hero LIGHT → band → Founder DARK → Approach LIGHT → Team
      stone-white → Group LIGHT → CTA DARK.
- [ ] **B8** 375px mobile pass — **needs the user's eyes.**

Bundled in along the way:

- **`pt-[104px]` → `pt-[var(--nav-h)]` on all 8 pages.** `--nav-h` is 68px
  mobile / 78px desktop, so every page carried a 26–36px dead gap under the
  navbar. (This was Phase D's D1; it applied far wider than one file.)
- About's stats were separately hardcoded `03` / `2001` — now derived.
- `public/Site Photos/` → `public/site-photos/`; a space in a static asset path
  is an encoding footgun across dev and CDN.

### Phase C — Portfolio page ✅ (complete 2026-08-13)

Rebuilt as an **extension of SelectedWork's language**, so arriving from that
section reads as a scroll rather than a cut: dark `bg-ink-deep` hero, the same
`NN — 12` counter, name at `headline-md`, city as a small label, summary, and a
"View property" affordance.

- [x] **C1** All 12 via `enrichedProperties`. New `ui/PropertyCardMedia.tsx`
      renders a designed no-photo block — asset-type label, large monogram, brand
      — on the same aspect box as a real photograph, so the grid rhythm holds at
      2 photos or 12. **Verified: 12 names, exactly 10 fallbacks, server-side.**
- [x] **C2** Asset-type filter pills in `sections/PortfolioGrid.tsx`, driven by
      live counts so a pill can never advertise an empty category. `min-h-11`
      keeps the 44px touch floor.
- [x] **C3** Scroll-linked entrance drift per card (`useScroll` + `useTransform`,
      `["start end", "center center"]`), gated on `useReducedMotion`.
- [x] **C4** Hover: image `scale(0.95)` inside its frame + title rise, with
      `HoverReveal` swapping city ⇄ "View property".
- [x] **C5** Headings → `MaskText`; asymmetric grid + `SectionTitle` throughout.
- [x] **C6** 1 column on mobile, ≥44px targets.

Deleted with the rewrite: the `heroCuts` / `supportCutsByIndex` clip-path arrays
(hardcoded for exactly 2 properties — they would have thrown on the 3rd) and the
headline that read **"Two properties."** against a portfolio of 12.

### Phase D — Property detail pages ✅ (complete 2026-08-13)

12 SSG routes. All verified server-side.

- [x] **D1** Done in Phase B — `pt-[var(--nav-h)]` sitewide.
- [x] **D2** Headline and summary → `MaskText`. **Deliberate deviation:**
      `longform` stays `<p>` inside `<Reveal>`. Line arrays cannot be hand-set
      for copy that is still being rewritten — 10 of 12 are
      `contentStatus: "placeholder"`. Revisit once the client copy is final.
- [x] **D3** Hero → `ResponsiveImage` `parallaxAmount={20}`; gallery →
      `RevealImage`. Hero falls back to `PropertyCardMedia` rather than
      collapsing the page's anchor image.
- [x] **D4** Gallery hidden below 2 images rather than rendering an empty or
      one-cell grid. **Verified:** shown on photographed assets, absent on the
      other 10.
- [x] **D5** "Book This Property" renders only when `bookingUrl` exists.
      **Verified absent** — null for all 12 until enrichment runs.
- [x] **D6** Prev/next via `getAdjacentProperties()`, wrapping at both ends, plus
      a "View all 12 assets" link. **Verified:** asset 01 links back to 12 and
      12 forward to 01. Previously a detail page was a dead end — the only way
      out was the navbar.
- [ ] **D7** 375px mobile pass — **needs the user's eyes.**

### Phase E — remaining pages

- [x] **E1 Services** ✅ **complete 2026-08-13** — see the decision record below.
- [x] **E2 Contact** ✅ **complete 2026-08-13** — see the fabrication note below.
- [x] **E3 Careers** ✅ **complete 2026-08-13** — see the fabrication note below.

#### 🚨 E2/E3 — the pages were largely fabricated

Both pages published invented facts. This is the same class of error as the
"02 properties" stat and "Brahmas Capital Partners", but more serious, because
these were things a visitor could act on.

**Deleted from Contact:**

| Fabrication | Why it is provably false |
|---|---|
| Offices in **New York** and **London**, with full street addresses | BMIG is a Florida operator; all 12 assets are in Florida |
| `+1 (212) 555-0198` / `-0199` | 212 is Manhattan, and `555-01xx` is the range **reserved for fiction** |
| 2 hotlinked Google CDN images captioned as those offices | D-10 |

**Deleted from Careers:** three named vacancies — *Director of Acquisitions*
(New York, NY), *VP Asset Management* (Miami, FL), *Design Director*
(London, UK). **Publishing roles that do not exist is worse than a wrong
address, because people apply to them.** Replaced with the disciplines the group
actually operates in, plus an open application.

**Kept but flagged:** the `@brahmagroup.com` addresses. Unlike the above they
are *unconfirmed rather than provably false* — the domain may be real. Note it
has **no "s"**, which contradicts the F4 brand rule. Do not silently "correct"
the spelling: that would invent an address that may not resolve. All contact
values now live in `src/data/contact.ts` behind
`CONTACT_DETAILS_UNCONFIRMED = true`, so the client fills one file.

**What the pages are built from instead:**
- Contact — email routes, Florida as the stated operating region, and a "reach
  an asset" section pointing at the 12 property pages, which carry **real,
  confirmed phone numbers** from `properties.ts`.
- Careers — the sourced LODGING narrative in `company.ts`: the owner's-mindset
  and "How we hire" blocks, and the verbatim quote *"I don't look for a degree.
  I look at the passion the person has."*

**The form has no backend.** It posts via `mailto:` deliberately — there is no
handler and no form service configured, and a form that silently swallows
submissions is worse than one that opens a mail client. Replace the action if a
real endpoint is added. (`sequent-media-house` uses `@emailjs/browser` if a
no-backend service is wanted.)
- [ ] **E4 Privacy / Terms** (52 / 69 lines) — minimal editorial treatment,
      correct legal entity name.
- [ ] **E5 Footer** — multi-column, hairline borders,
      "© {year} Brahmas Management and Investment Group."
      Note it still uses `md:grid-cols-12` rather than the `[1fr_1.9fr]` grammar.

#### E1 Services — decision record

Brainstormed and agreed with the client 2026-08-13. Recorded here rather than in
a separate spec file so it lives where the rest of the project's decisions do.

**It is a capability page, not a services menu.** BMIG operates what it owns, so
a page selling services to third parties contradicts the thesis. The page exists
to prove end-to-end execution to sellers, lenders and franchisors. H1 and title
reframed to "What We Do".

**The three pillars run on a different axis from the homepage `Process`.** That
section is Acquire → Renovate → Operate — *what happens to an asset over time*.
The pillars are Capital / Repositioning / Operations — *what the group can do*.
Keeping them on separate axes is what stops this becoming the duplicate-copy
trap that put the founder story on the homepage twice (D-2). **If you edit
either, preserve the distinction.**

**Only `Brahmas Hospitality Management` is named as a subsidiary**, because all
12 properties carry it as `subunit` in `properties.ts`. The other registered
entities have real names but inferred business purposes — the same content
pulled from the About page — so they are not assigned to pillars.

**Heal Construct is credited as a preferred partner only.** Client-confirmed as
an affiliation, *not* a claim that they delivered a BMIG property. Their
published portfolio (read 2026-08-13) is entirely residential — a 90,000 sq ft
residence, a 15,000 sq ft clubhouse, a 6,500 sq ft remodel — with no hospitality
work, so they must not be described as a hotel contractor. "Design · Build · BIM"
are their own three stated capabilities. Full constraints in `data/services.ts`.

**Ported for this page** (all gated on reduced motion):

| New component | Ported from |
|---|---|
| `ui/PillarCard.tsx` | `../hetari-portfolio/src/components/ServicesCard.vue` — `( 01 )` numeral, title, numbered sub-rows with the middle row hairline-bounded |
| `ui/RotatingMark.tsx` | same file's `animate-[spin_10s_linear_infinite]`, slowed to 20s. CSS-only, so it needs `motion-reduce:animate-none` — the global `MotionConfig` does not cover CSS animations |
| `ui/FlickerText.tsx` | `../the-line-awwwards-SOTM/components/FlickerText.tsx` — simplified from its hand-built `times` array to per-letter delay; rule collapses right via `origin-right` |
| `ui/InlineList.tsx` | `../the-line-awwwards-SOTM/components/List.tsx` — slash-separated, `staggerChildren: 0.06`; made to wrap |

`FlickerText` sets `aria-label` on the wrapper and `aria-hidden` on every letter
span. Without that, splitting a heading per character makes assistive tech
announce it letter by letter and breaks text selection. **Any future per-letter
effect needs the same treatment.**

**REVERSED 2026-08-13 — there IS a second pinned section.** The first build of
this page followed "Elementis has exactly one sticky section, and the homepage
spends it on SelectedWork". The result was correct and completely flat, and the
client rejected it on exactly those grounds. The rule was a stylistic inference
of mine, not a client constraint, and enforcing it cost a rebuild.

**Then the signature itself was rebuilt a second time.** v2 was an *aperture* —
the Brahmas mark as a CSS mask scrubbing `mask-size: 0% → 320%`, ported from
Axel-Vanhessche. The client's verdict: right idea, wrong execution. They were
correct, and `../sequent-media-house-main/` shows why.

> 🅿️ **PARKED 2026-08-13 — built, verified, and deliberately not shipped yet.**
> The client is staging what they show, holding the upgrade back rather than
> playing every card at once. It is **commented out** in
> `src/app/services/page.tsx`, with a quiet full-bleed photo band standing in.
>
> **`sections/ThresholdReveal.tsx` is NOT an orphan. The "delete dead code
> immediately" rule in §7 does not apply to it. Do not delete the file.**
>
> To re-enable: uncomment the import and the `<ThresholdReveal />` block in
> `services/page.tsx`, remove the stand-in band, and drop the then-unused
> `Image` / `ResponsiveImage` imports.

`sections/ThresholdReveal.tsx` is the current signature — a 420vh pinned
section ported from sequent's `src/app/home.jsx` + `ExpandingSection.jsx`:

| | v2 aperture (deleted) | v3 threshold (current) |
|---|---|---|
| Mechanic | `mask-size` scrub | `height: 0svh → 100svh` shutter |
| Cost | repaints the masked area **every frame** | height on a clipping box — cheap |
| Beats | one: a shape grows | three: type splits → shutter opens → mark settles |
| "Passing through" | a shape grows toward you | the **headline splits and you fly between the lines** |
| Content in the reveal | scales with the mask | held at fixed `100svh`, revealed not squashed |

The `height`-not-`mask-size` swap is the substance of the fix. The three-beat
structure is what makes it feel authored rather than applied.

**Constraints that matter if you touch it:**
- **Motion, not GSAP — deliberately.** Sequent pins with GSAP ScrollTrigger. We
  do not, because `SmoothScrollProvider` runs Lenis on **its own RAF loop and is
  not wired to `ScrollTrigger.update()`**. A ScrollTrigger pin would desync and
  judder. Wiring them is a global change with sitewide blast radius. CSS
  `position: sticky` pins for free and `useScroll` reads the same native scroll
  Lenis writes — exactly how `SelectedWork` already works at 500vh.
  **If you ever do wire Lenis to ScrollTrigger, revisit this.**
- **Desktop only.** Mobile and `prefers-reduced-motion` get the headline, photo
  and caption stacked plainly — same content, no pin, no sequence.
- **Never returns `null`** — the desktop branch renders server-side.
- **A11y:** the split lines are two transformed spans, so they carry
  `aria-hidden` and the section has an `sr-only <h2>` with the full sentence.
  Same rule as `FlickerText`. Any effect that fragments text needs it.

The two pinned sections remain distinct in kind: homepage `SelectedWork` is a
500vh stepped carousel with a 28-bar `useMaskImage` wipe; this is a 420vh
three-beat sequence. Different height, mechanic and driver.

**Deleted with the rewrite:** both hotlinked Google images · the invented
subsidiary "Brahmas Capital Partners" · `grid-cols-12` · `Label` in favour of
`SectionTitle` · the one-off `.brand-overlay` class in favour of the existing
`GhostWordmark`. The accordion answer claiming "our construction team oversees
every phase" was rewritten — it asserted an in-house contracting arm the group
does not have and contradicted crediting an external partner.

### Phase F — global polish (MASTER-PLAN §6 Phase 4 remainder)

- [ ] **F1** Re-enable the intro/preloader — `Intro.tsx` and the boot script in
      `layout.tsx` are built and currently disabled. Verify session-once + skip.
- [ ] **F2** Page transitions from `../otis-valen-next/app/template.tsx`.
- [ ] **F3** Full mobile audit — 375/768/1024/1440.
- [ ] **F4** Brand sweep — no "BRAHMA" without the "S"; full legal name in
      footer, About, meta tags, legal pages.
- [ ] **F5** Reduced-motion pass — `MotionConfig reducedMotion="user"` is global,
      but verify CSS animations and the ticker/marquee also respect it.
- [ ] **F6** Delete dead code (**D-4**, **D-5**). Final `build` + `npm run start`.

### Phase G — blocked on the client

1. **Google Places API key** → `brahma-web/.env.local` as
   `GOOGLE_MAPS_API_KEY=…`, then `node scripts/enrich-properties.mjs`.
   Unblocks photos + booking URLs for the 10 assets that have neither.
2. Replace placeholder prose (10 of 12 properties, `contentStatus: "placeholder"`).
3. Confirm affiliated-company descriptions (currently inferred from entity names).
4. Team names + headshots.
5. Sign-off on founder narrative + the two LODGING quotes.
6. Reconcile counts — LODGING says 11 hotels / 7 Choice; data says 10 hospitality / 5 Choice.
7. Hero video → pass `videoSrc` to `<Hero>`; no layout change needed.

---

## 6. Verification

```bash
npx tsc --noEmit     # types
npx next build       # must stay at 22 routes unless you add pages
```

The user does **all** visual testing. Never use preview/screenshot/browser tools.
To confirm something renders server-side:

```bash
grep -o "Your text" .next/server/app/index.html
```

---

## 7. Landmines

- **Never add a global CSS class that hides content** (`opacity: 0`) unless a
  mounted component is guaranteed to reveal it. That caused 29 invisible
  elements across 6 pages.
- **Never rely on inherited colour** across a light/dark boundary.
- **Never return `null`** from a viewport-branching component.
- **Never reintroduce a page-level `max-w-*` container.**
- **Never resurrect the split hero.** `HeroSplit.tsx` is deleted (D11).
- **Delete orphans immediately.** Dead files and dead `data-*` attributes have
  repeatedly caused confusion here. **One deliberate exception:**
  `sections/ThresholdReveal.tsx` is parked, not dead — see Phase E1.
- `properties.ts` merges `places.generated.json` at import; **hand-authored
  values always win**, so re-running enrichment cannot clobber approved copy.
- Two slugs deliberately mismatch their names
  (`clarion-pointe-tampa-brandon`, `hampton-inn-tampa-veterans-expwy`) because
  photography lives at those paths. **Do not rename.**
- Use `featuredProperties` (typed `FeaturedProperty`) wherever images are
  required — 10 of 12 have `homeHeroSrc: null`.

---

## 8. Property photography

**Moved to [`PHOTO-PIPELINE.md`](./PHOTO-PIPELINE.md)** — one home per topic.

That doc is self-contained and covers: current state (2 of 12 assets have
photos, and 21 client photos sit unused), how the `properties.ts` overlay works,
the three exported views and when to use each, the attribution rule, all
sourcing routes, the enrichment script, and how to get the Google API key.

Quick pointers:

- To add photos: drop files in `public/properties/<slug>/`, fill `homeHeroSrc`
  and `gallery[]`. Hand-authored values always beat generated ones.
- Use `featuredProperties` where an image is required — 10 of 12 have
  `homeHeroSrc: null`.
- Use `ownPhotographyProperties` for chrome with no room for a photo credit
  (homepage hero, marquees). This is a guard, not a convenience.
- Any surface showing a Places-sourced photo must render
  `<PhotoAttribution>`.
