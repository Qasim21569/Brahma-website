# BRAHMAS — Master Plan (Single Source of Truth)

> **Last updated:** 2026-08-13
> **Status:** ✅ Phases 0–4.2 COMPLETE. Next: 4.3 (re-enable intro/preloader).
> **This document supersedes** `elevation-plan.md`, `progress.md`, `execution-plan.md`,
> `elementis-replication-plan.md`, `session-progress.md`, and `BMIG-WEBSITE-ELEVATION-PLAN.md`.
> Those are archived in `docs/archive/` for reference only. **Do not follow them.**

---

> **➡ Building a section? Read `BUILD-PLAYBOOK.md` instead.** It carries the
> design grammar and the remaining-work plan. This document remains the source
> of truth for locked decisions (§2) and the design system (§4).

## 0. How to use this document

If you are a new session picking this up cold:

1. Read §1 (Context), §2 (Locked decisions), §3 (Audit).
2. Go to §6 (Execution) and find the first unchecked `[ ]` box.
3. Work top-to-bottom. Do not skip phases — Phase 0 fixes bugs that make later work invisible.
4. After each phase, run `npx next build` and update the checkboxes + "Status" line above.

**Verification rule:** the user does all visual/browser testing. Do not use preview or
screenshot tools. Verify with `npx next build` and by reading source. Leave the dev
server running for the user.

---

## 1. Context

**Company:** Brahmas Management and Investment Group (BMIG)
**Business:** Acquires underperforming hotel assets, renovates them, and operates them
directly under Brahmas Hospitality Management. No third-party handoff.
**Audience:** Institutional investors and banking partners.
**Tone:** Surgical precision, capital discipline, architectural integrity, enduring value.
Confident but understated. No superlatives.

**Working directory:** `brahma-web/` (this folder). Everything else in the parent
folder is a read-only reference codebase.

**Primary design reference:** `../Elementis-SOTD/` (~70% of the design DNA).
**Secondary references:** `../ochi.design-UI-Clone/`, `../otis-valen-next/`,
`../hetari-portfolio/`, `../the-line-awwwards-SOTM/`.

### Real content inventory (verified, not aspirational)

| Item | Reality |
|---|---|
| Properties | **12** — all in `src/data/properties.ts` with real names, addresses, phones (client-supplied 2026-08-13). See §7. |
| Photography | **2 of 12** have photos (32 `.webp` in `Public/properties/`). The other 10 are awaiting the enrichment script — see §7. |
| Copy | **10 of 12** properties carry placeholder prose (`contentStatus: "placeholder"`). |
| Logo | `Public/brahmas-vector-logo-preload.svg` (navy + blue, multi-path) |

> **Content philosophy:** structure is real, prose is placeholder. Layouts must not depend
> on specific text lengths or image counts — and must tolerate a property having **zero**
> photos, since 10 currently do.

### Stack (verified)

Next.js 16 (Turbopack) · React 19 · Tailwind **v4** (via `@config` bridge to
`tailwind.config.ts`) · Motion v12 (`motion/react`) · Lenis 1.3 · GSAP 3.15 · TypeScript 5.
Dev server: `npm run dev` → port 3000.

---

## 2. Locked decisions

These are settled. Do not re-litigate without the user.

| # | Decision | Value |
|---|---|---|
| D1 | **Base canvas** | **Light base, dark accent sections.** Ivory `#f4f1ec` is the default; navy `#0a1220` is used deliberately for hero, process, and CTA anchors. |
| D2 | ~~Hero: refined split~~ | **SUPERSEDED BY D11.** The split hero was tried and rejected three times; `HeroSplit.tsx` is deleted. |
| D3 | Reveal engine | **Motion** (`motion/react`). GSAP is for the preloader only. |
| D4 | Brand name order | **"Management and Investment Group"** (legal order). Never "Investment and Management". |
| D5 | Reveal vocabulary | `MaskText` for headlines · `Reveal` for supporting content · `RevealImage` for image clip-wipes · `ParallaxContainer` for depth. |
| D6 | Visual testing | User does all visual testing. Verify via `next build` + source reading only. |
| D7 | **Typography** | **Keep Newsreader (serif) for display + Manrope for body**, but adopt Elementis's *discipline*: `line-height: 1` on display, **no bold anywhere**, restrained scale, manual line breaks. |
| D8 | **Scaling** | **Adopt the Elementis fluid multiplier system** — all type and spacing expressed as `calc(N * var(--multiplier))`. See §4.1. |
| D9 | **Portfolio scope** | BMIG is a **diversified operator**: hospitality (10), education (1), residential (1). Copy says "operating assets", not "hotel assets". See §7. |
| D10 | **Photos** | Google Places API — photos published on each property's own Google Business Profile. See §7. |
| D11 | **Hero composition** | **Full-bleed, bottom-anchored, marquee-as-headline** — copied from Elementis `sections/Hero`. NOT a split, no oversized heading block, no paragraph. The homepage is the template all other pages follow. |

---

## 3. Audit — state as of 2026-08-12

**`npx next build` passes.** All 10 routes compile, typecheck, and prerender.
The site is not technically broken. It is **visually** broken, from two bugs:

### 🔴 BUG-1 — 29 elements are permanently invisible
`globals.css` defines `.reveal { opacity: 0; transform: translateY(30px) }`.
`ScrollRevealProvider` (which animated them to visible) is **orphaned** — the file
exists at `src/components/providers/ScrollRevealProvider.tsx` but is imported nowhere.
Nothing ever sets those elements back to `opacity: 1`.

| File | `.reveal` count |
|---|---|
| `src/app/page.tsx` | 12 |
| `src/app/services/page.tsx` | 6 |
| `src/app/careers/page.tsx` | 5 |
| `src/app/about/page.tsx` | 3 |
| `src/app/contact/page.tsx` | 3 |
| `src/app/portfolio/page.tsx` | 2 |

### 🔴 BUG-2 — dark text on dark background
`tailwind.config.ts` sets `background: #0a1220` (dark) and `primary: #0a1220` (dark).
Sections with **no explicit background class** inherit the dark body canvas while their
headlines use `text-primary` → navy on navy. Confirmed in the homepage About and
Selected Work sections. Fixed by D1.

### 🟡 Secondary drift
- `src/components/ui/HeroImageLoop.tsx` — 194 lines, built, **never imported**.
- `src/components/providers/ScrollRevealProvider.tsx` — orphaned, GSAP-based, superseded.
- `.hero-line` defined **twice** in `globals.css` (~line 137 and ~line 366).
- `HeroGate` + `.hero-line` remnants coexist with `MaskText` doing the same job.
- Material Symbols icon font still used in `page.tsx`, `careers`, `services`, `Button.tsx`.
- Mixed `Reveal` (old) and `MaskText` (new) patterns on the same pages.
- Six overlapping planning docs with contradictory claims.

---

## 4. Design system (target)

### Colors — light base, dark accents

```
/* Canvas */
background          #f4f1ec   stone white — DEFAULT page canvas
on-background       #0a1220   ink navy — default text

/* Surfaces */
surface             #f4f1ec
surface-container   #ebe7df   subtle raised/banded areas
on-surface          #0a1220
on-surface-variant  #4b5563   muted body text (readable on light)

/* Dark accent sections (explicit only) */
ink-deep            #0a1220   dark section background
cream               #f5f0e8   text on dark
cream-dim           #d4cfc6   muted text on dark

/* Structure + interactive */
mortar-grey         #6b7280   hairline borders, rules
muted-azure         #6b8cba   single accent, used sparingly
```

**Rule:** every dark section must explicitly set `bg-ink-deep` **and** `text-cream`.
Never rely on inherited color across a light/dark boundary.

### 4.1 The fluid multiplier system (D8) — implement FIRST

This is the single most important thing that makes Elementis feel precise. Every size is
a **proportion of viewport width**, not a breakpoint-stepped value. Add to `globals.css`:

```css
@layer base {
  :root {
    --multiplier: calc(100vw / 375);   /* mobile design width  */
  }
  @media only screen and (min-width: 768px) {
    :root {
      --multiplier: calc(100vw / 1440); /* desktop design width */
    }
  }
}
```

Then **every** type/spacing token is `calc(N * var(--multiplier))`, where `N` is the
pixel value at the design width. A `144px` headline is always exactly 10% of the viewport.
No `clamp()`. No breakpoint jumps. The design scales like a vector.

> Elementis also sets `--text-*: initial` to delete Tailwind's default sizes, forcing all
> type through their scale. Do the same — it enforces discipline.

**Body-copy guard:** because investor pages carry long copy, clamp body sizes to a
readable floor/ceiling (min 15px, max 19px) even inside the multiplier system.

### 4.2 Typography (D7)

Newsreader for display, Manrope for body. **No bold anywhere** — that's an Elementis rule
and it's why their type reads as confident rather than shouty.

```
Display    Newsreader 300   calc(96 * m) → calc(144 * m)   line-height: 1
Headline   Newsreader 300   calc(40 * m)                   line-height: 1
Sub-head   Newsreader 400   calc(24 * m)                   line-height: 1
Body lg    Manrope 400      calc(18 * m)  [15–19px clamp]  line-height: 1.3
Body       Manrope 400      calc(16 * m)  [15–18px clamp]  line-height: 1.3
Label      Manrope 500      calc(13 * m)  uppercase, tracking 0.15em
```

**Rules borrowed from Elementis:**
- `line-height: 1` on ALL display/headline type. `1.3` on body. Nothing in between.
- Weights **300 / 400 / 500 only**. Never 600/700.
- The giant type (`144`) appears **only in the marquee** — never in a headline.
  Drama comes from space and motion, not font size.
- **Break lines manually.** Headlines are arrays of lines passed to `MaskText`, with a
  **separate array for mobile and desktop**. Never let a headline auto-wrap.
- First line of a statement block may use an indent (`text-indent`) for editorial rag.

### 4.3 Spacing

All spacing follows the multiplier. Reference values at desktop design width (1440):

```
Page margin (x)   calc(60 * m)   → md:calc(60 * m), mobile calc(15 * m)
Section pad top   calc(225 * m)  generous — Elementis uses pt-56-25
Section pad bot   calc(200 * m)
Block gap         calc(80 * m)   between major text blocks
Grid gutter       calc(32 * m)
```

**Asymmetric grid (Elementis signature):** narrow label column + wide content column.
```
md:grid-cols-[1fr_1.9fr]     /* Introduction / Story sections */
md:grid-cols-[1fr_1.375fr]   /* denser variant */
```
`SectionTitle` sits in column 1; content occupies column 2.

### Motion

```
Ease            [0.24, 0.43, 0.15, 0.97]   (Elementis curve — use everywhere)
MaskText        0.8s duration, 80ms stagger
Image mask      scroll-linked, no fixed duration
Marquee         25–30s per loop
```

No bounce. No spring. Long durations. All motion respects `prefers-reduced-motion`
via the app-level `<MotionConfig reducedMotion="user">`.

### Section rhythm (homepage)

```
Hero            DARK    navy, split layout
Marquee         DARK    continues hero band
About / Story   LIGHT   ivory
Selected Work   LIGHT   ivory
Process         DARK    navy
Stats           LIGHT   ivory
CTA anchor      DARK    navy + ghost wordmark
```

---

### 4.6 Elementis DNA reference (extracted 2026-08-12)

Verified by reading `../Elementis-SOTD/`. Use this instead of re-analyzing that codebase.

| Trait | What they do | Where |
|---|---|---|
| Fluid multiplier | `calc(100vw/375)` → `calc(100vw/1440)`; every size `calc(N * m)` | `app/globals.css` |
| Type discipline | `--text-*: initial` wipes Tailwind defaults; ~12 sizes total | `app/globals.css` |
| Colors | **3 only**: `#2b3530` (59×), `#d1ccbf` (32×), `#ffffff` (13×) | sitewide |
| Weights | 300 / 400 / 500. **No bold.** | `layout.tsx` |
| Line height | `1` on display (18×), `1.3` body, `1.1–1.2` links | sitewide |
| Big type | `144px` used **only** in the marquee | `Marquee.tsx` |
| Manual line breaks | Separate `mobile[]` / `desktop[]` line arrays per headline | `Introduction/Server.tsx` |
| Asymmetric grid | `grid-cols-[1fr_1.9fr]`, label left / content right | `Introduction/Server.tsx` |
| First-line indent | `[&>:first-child]:indent-23` | `Introduction/Server.tsx` |
| Sticky centerpiece | `500vh` parent + `sticky` `110/130vh` child + quartile states | `Innovation.tsx` |
| Image transition | 28-bar gradient mask + `scale 1.075 → 1` | `hooks/useMaskImage.ts` |
| Button hover | SVG border draws via `pathLength 0 → 1`, 0.8s, 0.3s delay | `BorderedButton.tsx` |
| Link hover | Underline slides in from right (`x: 100% → -100% → 0%`) | `StyledLink.tsx` |
| Nav | Transparent → filled on scroll; hide down / show up | `NavBar.tsx` |
| Easing | `[0.24, 0.43, 0.15, 0.97]` — one curve, everywhere | sitewide |

**Section order (their homepage):** Hero → Introduction → WellnessSanctuary →
Innovation (sticky) → ElementisStory → SustainableRetreat → Form → Footer.

**Our mapping:** Hero → About/Story → Selected Work (sticky, = Innovation) → Process →
Stats → CTA → Footer.

### 4.7 Patterns worth stealing from the other references

Surveyed 2026-08-13 across `the-line-awwwards-SOTM`, `otis-valen-next`,
`ochi.design-UI-Clone`, `hetari-portfolio`, `Axel-Vanhessche`.
**Tier 1 = adopt. Tier 2 = optional polish.**

#### Tier 1 — adopt

| Pattern | Source | Why it fits BMIG | Use it for |
|---|---|---|---|
| **Scroll-linked card entrance** | `the-line/components/ProjectCard.tsx` | Cards drift in with `y/x/rotate` tied to scroll progress — sophisticated, not gimmicky | Property cards on `/portfolio` + Selected Work |
| **Accordion (layoutId)** | `the-line/components/AccordianItem.tsx` | Motion `layoutId` + `AnimatePresence`, hairline rule, arrow rotates 90°→-90° | Services detail · Process steps · investor FAQ · Careers roles |
| **Page transitions** | `otis-valen/app/template.tsx` + `TransitionOverlay.tsx` | 5 stacked overlay panels; `template.tsx` re-mounts per route and plays the reveal | Makes about/portfolio/services/contact feel like one continuous experience |
| **Hover text swap** | `the-line/components/HoverReveal.tsx` | Label cross-fades to different text on hover with a brief flicker | Property cards (`Tampa, FL` ⇄ `View Property`) · CTAs |
| **Image scale-down + text rise on hover** | `ochi/components/Featured.jsx` | Image scales to `0.95` while a title slides up from behind it | Selected Work / portfolio cards |
| **Desktop/Mobile component split** | `the-line` (`ContactDesktop`/`ContactMobile`, `FooterDesktop`/`FooterMobile`, `NavBarDesktop`/`NavBarMobile`) | Separate components where layouts genuinely differ, instead of one component drowning in breakpoint classes | Nav · Footer · Contact · Hero |

#### Tier 2 — optional

| Pattern | Source | Note |
|---|---|---|
| Custom cursor ("Discover More") | `Elementis/Cursor.tsx`, `the-line/Cursor.tsx` | Desktop only. Pairs well with the sticky Selected Work section. |
| Flicker/shift CTA | `the-line/FlickerText.tsx` | CTA slides on hover via a CSS var that changes per breakpoint. |
| Horizontal loop marquee | `hetari/horizontal-loop.js`, `ochi/Marquee.jsx` | We already have `MarqueeTicker`; only revisit if it needs seamless velocity control. |

> **Deliberately NOT taking:** Ochi's playful eyes/blob cursor, oversized rounded corners,
> and high-saturation orange (`#f15025`). Wrong register for institutional investors.

### 4.8 Mobile responsiveness strategy (explicit requirement)

Mobile is a first-class requirement, not a final pass. Rules:

**1. CSS-first by default.** Use Tailwind responsive classes (`md:`) for anything that is
purely layout. This renders correctly server-side, has no flash, and costs no JS.

**2. `useIsMobile()` only where behavior genuinely differs.** Both Elementis and The Line
use a `WindowSizeProvider` exposing `boolean | null` (`null` = undetermined).

> ⚠️ **Important caveat:** those references return `null` on first render, so the
> component renders **nothing** during SSR. That is acceptable for an awards showcase but
> **bad for an investor site** — it hurts SEO and causes a flash of empty space.
> **Our rule:** when a component must branch on viewport, render the **desktop variant as
> the SSR default** and swap after hydration. Never return `null`.

Legitimate uses of the JS branch:
- Different **line-break arrays** for `MaskText` (mobile vs desktop) — §4.2
- Different **mask math** in `useMaskImage` (mobile uses a simple sweep; desktop uses 28 bars)
- Swapping whole **Desktop/Mobile components** (nav, footer, contact)

**3. The multiplier system does most of the work.** Because everything is
`calc(N * var(--multiplier))` with a design-width switch at 768px, layouts scale
proportionally and most responsive bugs never occur. Mobile design width = **375**,
desktop = **1440**.

**4. Mobile-specific requirements**
- Test at **375 / 768 / 1024 / 1440**.
- Touch targets ≥ 44px.
- No horizontal overflow (`overflow-x: clip` on body).
- Sticky/`500vh` scroll sections must be **shortened or simplified on mobile** — a 500vh
  sticky section is punishing on a phone. Elementis drops to a simple sweep mask.
- Hover-only affordances need a non-hover fallback (state visible by default on touch).
- Marquee stays, but at a reduced type size.
- Images: correct `sizes` attribute once on `next/image`.

---

## 5. Component inventory

| Component | Path | Status | Action |
|---|---|---|---|
| `MaskText` | `ui/MaskText.tsx` | ✅ Good | Keep — primary headline reveal |
| `Reveal` | `ui/Reveal.tsx` | ✅ Good | Keep — supporting content |
| `RevealImage` | `ui/RevealImage.tsx` | ✅ Good | Keep — image clip-wipe |
| `ParallaxContainer` | `ui/ParallaxContainer.tsx` | ✅ Good | Keep |
| `CountUp` | `ui/CountUp.tsx` | ✅ Good | Wire into Stats |
| `MarqueeTicker` | `ui/MarqueeTicker.tsx` | ✅ Good | Keep |
| `SectionTitle` | `ui/SectionTitle.tsx` | ✅ Good | Apply to every section |
| `HeroSplit` | `ui/HeroSplit.tsx` | ⚠️ Refine | Fix proportions + type scale (D2) |
| `useMaskImage` | `hooks/useMaskImage.ts` | ✅ Good | Powers HeroSplit mask |
| `Navbar` | `layout/Navbar.tsx` | ✅ Good | Logo lockup + underline hover done |
| `Intro` | `components/Intro.tsx` | ⏸ Deferred | Logo reveal built; re-enable in Phase 4 |
| `HeroImageLoop` | `ui/HeroImageLoop.tsx` | ❌ Delete | Orphaned; D2 chose split hero |
| `ScrollRevealProvider` | `providers/…` | ❌ Delete | Orphaned; cause of BUG-1 |
| `HeroGate` | `components/HeroGate.tsx` | ❌ Delete | Superseded by MaskText |

---

## 6. Execution

### Phase 0 — Stabilize (fixes the "shambles") ⬅ **START HERE**

Goal: nothing invisible, one consistent canvas, no dead code. No new design work.

- [x] **0.1** Flip tokens in `tailwind.config.ts` to light base per §4
      (`background`/`surface` → `#f4f1ec`, `on-background`/`on-surface` → `#0a1220`,
      `on-surface-variant` → `#4b5563`). Keep `ink-deep`, `cream`, `cream-dim` for dark sections.
- [x] **0.2** Delete `.reveal` rule from `globals.css` (both the base rule and the
      reduced-motion override).
- [x] **0.3** Replace all **29** `.reveal` usages with `<Reveal>` / `<MaskText>`
      (page.tsx 12 · services 6 · careers 5 · about 3 · contact 3 · portfolio 2).
      Remove `style={{ transitionDelay }}` hacks — use the `delay` prop.
- [x] **0.4** Delete `src/components/providers/ScrollRevealProvider.tsx`.
- [x] **0.5** Delete `src/components/HeroGate.tsx`, remove its import/usage from
      `page.tsx`, and delete **both** `.hero-line` blocks from `globals.css`.
- [x] **0.6** Delete `src/components/ui/HeroImageLoop.tsx`.
- [x] **0.7** Audit every section for explicit background + text color. Any dark section
      must set `bg-ink-deep` + `text-cream`. No inherited color across boundaries.
- [x] **0.8** `npx next build` → clean. Update Status line.

**Acceptance:** every page renders all content visible, no dark-on-dark, no dead files.

### Phase 0.5 — Typographic foundation (D7 + D8)

Do this before any section design — every later phase depends on these tokens.

- [x] **0.5.1** Add the `--multiplier` block to `globals.css` (§4.1).
- [x] **0.5.2** Rebuild the type scale in `tailwind.config.ts` per §4.2 using
      `calc(N * var(--multiplier))`. Add the 15–19px body clamp guard.
- [x] **0.5.3** Set `line-height: 1` on all display/headline tokens, `1.3` on body.
- [x] **0.5.4** Remove every `font-bold` / weight ≥600 sitewide. Newsreader 300 for
      display, Manrope 400/500 for body and labels.
- [x] **0.5.5** Convert section paddings and page margins to multiplier values (§4.3).
- [x] **0.5.6** `npx next build` → clean.

**Acceptance:** resizing the browser scales the whole design proportionally; no bold
anywhere; display type sits on `line-height: 1`.

### Phase 1 — Hero (D2: refined split)

- [x] **1.1** Rework `HeroSplit`: full-viewport dark band, asymmetric split
      (text ~45% / image ~55%), generous left margin, vertical centering.
- [x] **1.2** Headline via `MaskText` with **manually broken lines** — separate mobile and
      desktop arrays (§4.2). Newsreader 300, `line-height: 1`. Must never clip
      (that is the current complaint — likely the `overflow-hidden` mask needs
      bottom padding for descenders).
- [x] **1.3** Verify the `useMaskImage` bar reveal runs on scroll and degrades gracefully.
- [x] **1.4** Add gradient scrim where text meets image; add a scroll cue at the bottom.
- [x] **1.5** Mobile: stack to image-behind-text with scrim, headline stays legible.
- [x] **1.6** Marquee directly below hero — the only place `144px` type is allowed.
- [x] **1.7** `npx next build` → clean.

### Phase 2 — Homepage sections

- [x] **2.1** `SectionTitle` on every section (hamburger + uppercase label).
- [x] **2.2** **About/Story** (light) — MaskText headline, restrained body, one image with
      `RevealImage`, link through to `/about`. Reads like a founder's letter.
- [x] **2.3** **Selected Work** (light) — the centerpiece. Sticky scroll-linked container,
      images crossfade per scroll progress, text overlay updates per property.
      Build for **2 properties**, tolerate N. Links through to `/portfolio`.
- [x] **2.4** **Process** (dark) — Acquire / Renovate / Operate, numbered, sparse.
- [x] **2.5** **Stats** (light) — wire `CountUp`. Only real, defensible numbers.
- [x] **2.6** **CTA anchor** (dark) — oversized BRAHMAS wordmark at ~3% opacity,
      one sentence, one button. Port the ghost-wordmark scale to Motion.
- [x] **2.7** Interaction layer (port from Elementis, §4.6):
      - `BorderedButton` — SVG border draws on hover (`pathLength 0→1`, 0.8s, 0.3s delay)
      - `StyledLink` — underline slides in from the right
      - All sections use the asymmetric `[1fr_1.9fr]` grid with `SectionTitle` in col 1
- [x] **2.8** Adopt Tier-1 patterns (§4.7):
      - `HoverReveal` on property cards (location ⇄ "View Property")
      - Ochi hover: image `scale(0.95)` + title rises from behind
- [x] **2.9** Mobile pass on every homepage section per §4.8 — shorten the sticky
      Selected Work section on mobile; verify no horizontal overflow.
- [x] **2.10** `npx next build` → clean.

### Phase 3 — Inner pages (same identity, placeholder-tolerant)

- [x] **3.0** `WindowSizeProvider` + `useIsMobile()` per §4.8 — **desktop as SSR default,
      never `null`**. Add `Accordion` (from `the-line/AccordianItem`) to `ui/`.
- [x] **3.1** `/portfolio` — grid of properties, clip-path cards, image reveals,
      scroll-linked card entrance (§4.7 ProjectCard pattern), hover scale.
- [x] **3.2** `/about` — full narrative, parallax imagery, MaskText statements,
      Acquire→Renovate→Operate, full legal name.
- [x] **3.3** `/services` — three pillars expanded, one section each. Use `Accordion`
      for the detail under each pillar (§4.7).
- [x] **3.4** `/contact` — architectural underline inputs (border-bottom only), phone +
      email prominent, no map.
- [x] **3.5** `/careers` — consistent with the system.
- [x] **3.6** `/privacy` + `/terms` — legal entity name, minimal editorial treatment.
- [x] **3.7** Footer — multi-column, hairline borders,
      "© {year} Brahmas Management and Investment Group."
- [x] **3.8** `npx next build` → clean.

### Phase 4 — Polish

- [x] **4.1** Replace Material Symbols with inline SVGs in `page.tsx`, `careers`,
      `services`, `Button.tsx`; drop the Google Fonts icon `<link>` from `layout.tsx`.
- [x] **4.2** Migrate `<img>` → `next/image` for automatic resize + lazy loading. All images
      sitewide now use `<Image>` with `fill` prop. Material Symbols replaced with inline
      SVG `Icon` component. No `<img>` tags remain in active code.
- [ ] **4.3** Re-enable the intro/preloader (`Intro.tsx` is built; boot script is in
      `layout.tsx`). Verify session-once behavior and the skip path.
- [ ] **4.4** **Page transitions** (§4.7, from `otis-valen`) — add `app/template.tsx` +
      overlay panels so route changes animate instead of hard-cutting.
- [ ] **4.4b** **Full mobile audit** per §4.8 — 375 / 768 / 1024 / 1440; touch targets
      ≥44px; no horizontal overflow; hover-only affordances have touch fallbacks;
      sticky sections shortened on mobile; `next/image` `sizes` correct.
- [ ] **4.4c** Optional Tier-2 polish (§4.7): custom cursor on the sticky section.
- [ ] **4.5** Brand-name sweep — no "BRAHMA" without the "S"; full legal name in footer,
      about, meta tags, legal pages.
- [ ] **4.6** Reduced-motion pass.
- [ ] **4.7** Final `npx next build` + production smoke test (`npm run start`).

---

## 7. Property data system (BUILT — 2026-08-13)

### Content philosophy
**Structure is real. Prose is placeholder.** Layouts break on structure (how many
properties, how long a name, how many photos) — not on wording. So all 12 properties
carry real names, addresses, phones, brands, and asset types, while marketing prose is
scaffolding flagged with `contentStatus: "placeholder"`.

Search `contentStatus: "placeholder"` to find every field awaiting client copy.
**10 of 12** properties are currently placeholder; `clarion-pointe-tampa-brandon` and
`hampton-inn-tampa-veterans-expwy` are `"final"`.

### Portfolio composition (D9)
BMIG operates **beyond hotels**. `assetType` splits the portfolio:

| Type | Count | Assets |
|---|---|---|
| `hospitality` | 10 | Choice ×5, Hilton ×2, Wyndham ×1, IHG ×1 |
| `residential` | 1 | Beach House, Weeki Wachee |
| `education` | 1 | Primrose School of Oldsmar |

> ⚠️ **Copy implication:** existing site copy says *"underperforming **hotel** assets."*
> That is inaccurate for 2 of 12. Change to *"operating assets"* / *"hospitality,
> education, and residential"* wherever the thesis is stated.

**Slug note:** two slugs are intentionally retained from the original dataset because
photography already lives at those paths — `clarion-pointe-tampa-brandon` (list #1) and
`hampton-inn-tampa-veterans-expwy` (list #6, now named *Hampton Inn & Suites Tampa
Airport Westshore*). Do not rename them.

### Architecture

```
src/data/properties.ts              hand-authored source of truth (prose + structure)
src/data/places.generated.json      generated; safe to delete and re-run
scripts/enrich-properties.mjs       Google Places API fetcher
src/app/portfolio/[slug]/page.tsx   individual property page (SSG, 12 routes)
```

**Merge rule:** `properties.ts` overlays the generated JSON at import time and
**hand-authored values always win**. Photos are only adopted when a property has none.
Re-running the script can never clobber approved copy.

**Exports:** `enrichedProperties` (all 12) · `featuredProperties` (typed
`FeaturedProperty`, guaranteed imagery — use where images are required) ·
`propertiesByType(type)` · `getProperty(slug)`.

### Enrichment script

Pulls verified address, phone, booking URL (`websiteUri`), coordinates, rating, and the
photos published on each property's own Google Business Profile.

```bash
node scripts/enrich-properties.mjs             # all 12
node scripts/enrich-properties.mjs --dry-run   # resolve only, no downloads
node scripts/enrich-properties.mjs --slug=...  # one property
```

**Requires** `GOOGLE_MAPS_API_KEY` in `brahma-web/.env.local` (gitignored).
Google Cloud → new project → enable **Places API (New)** → Credentials → API key.
12 properties is a trivial call volume and sits inside Google's free monthly credit.

Photos land in `Public/properties/<slug>/g-01.jpg…`; author attribution is captured in
the generated JSON — **surface it wherever Places photos are displayed**, per Places API
terms.

### Remaining work

- [ ] **7.1** Obtain the Google API key and run the enrichment script.
- [ ] **7.2** Review generated `bookingUrl`s — confirm each points at the property's own
      booking page, not a brand landing page.
- [ ] **7.3** Replace placeholder prose for the 10 flagged properties.
- [ ] **7.4** Add `assetType` filter pills to `/portfolio` (Hospitality / Education /
      Residential).
- [ ] **7.5** Update thesis copy sitewide from "hotel assets" → "operating assets".
- [ ] **7.6** Render photo attribution on property pages where Places photos are used.
- [ ] **7.7** Swap Places photos for official brand-portal photography as it arrives
      (drop into `Public/properties/<slug>/`, hand-authored gallery wins automatically).

---

## 7b. Company narrative & About page (BUILT — 2026-08-13)

**Source:** LODGING Magazine interview with **Sanjay Patel**, CEO/President —
`https://lodgingmagazine.com/starting-off-in-hospitality-with-an-owner-mindset/`
Facts verified from that interview; all prose on the site is **original**, not reproduced.

**Founder facts:** immigrated from India 1996 with $10 · uncle's Tampa hotel → night
auditor → GM in southwest Florida within 3 years (16-hour days, 3 years no day off) ·
2001 first ownership in Pinellas Park via sweat-equity partnership with a physician ·
year one revenue $250k → $650k, ~95% occupancy, loan repaid · founded Brahmas · hires for
passion not degrees · offers equity to top performers · banks later brought him
distressed assets.

**Files:** `src/data/company.ts` (founder narrative, quotes, team, affiliated companies)
· `src/app/about/page.tsx` (rebuilt) · `src/components/ui/StyledLink.tsx` (Elementis
underline-slide link) · homepage "Brahmas Story" section linking to `/about`,
`/about#team`, `/about#group`.

**About page structure:** hero → founder story (dark, 6 narrative blocks + pull quote
credited to LODGING) → approach + stats → team (`#team`, 5 members, monogram
placeholders) → affiliated companies (`#group`) → CTA.

### Open items

- [ ] **7b.1** ⚠️ **AWAITING CLIENT LIST** — the affiliated companies. `company.ts`
      has 3 structural placeholders. Replace with real name / sector / one-line
      description / URL. Only publish ventures the client has approved.
- [ ] **7b.2** Replace team names, roles, and headshots (currently monogram
      placeholders; `photo: null` renders initials).
- [ ] **7b.3** Client sign-off on the founder narrative and on publishing the two
      LODGING quotes with attribution.
- [ ] **7b.4** Reconcile counts: the article says **11 hotels / 7 Choice**; our data has
      **10 hospitality / 5 Choice** (+1 education, +1 residential). Confirm which is
      current before publishing any figure.

---

## 8. Guardrails

- **Dev-server slowness is not a perf bug.** Turbopack compiles routes on first request
  (~12s cold, ~50ms after). Judge performance only from `next build` + `npm run start`.
- **Never rely on inherited color** across a light/dark section boundary.
- **Never reintroduce a global CSS class that hides content** (`opacity: 0`) unless a
  mounted component is guaranteed to reveal it. That is exactly what caused BUG-1.
- **Placeholder-tolerant:** copy and photos will be swapped later. Layouts must not
  depend on specific text lengths or image counts.
- **Mobile is not a final pass.** Every section is built responsive as it is built (§4.8).
  Never ship a section that was only checked at desktop width.
- **Never return `null` from a viewport-branching component.** Render the desktop variant
  server-side and swap after hydration, or the content is invisible to crawlers.
- Match existing code style. Keep components small and single-purpose.
