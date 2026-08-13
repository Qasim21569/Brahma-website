# BMIG — Brahmas Management and Investment Group
## Website Elevation Plan & Build Instructions

> **Full Company Name:** Brahmas Management and Investment Group (BMIG)
> **Current Stack:** Next.js 16 · React 19 · Tailwind CSS v3 · GSAP v3.12 · Framer Motion v11 · Lenis v1.1
> **Target Stack:** Next.js 15/16 · React 19 · Tailwind CSS v4 · Motion v12 · Lenis v1.2+ · GSAP (preloader only)
> **Primary Reference:** Elementis-SOTD (70% of design DNA)
> **Secondary References:** Ochi.design · Otis Valen · Hetari Portfolio · The Line (Awwwards SOTM)

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Reference Websites & What to Extract](#2-reference-websites--what-to-extract)
3. [Technology Stack](#3-technology-stack)
4. [Preloader Animation — How It Works](#4-preloader-animation--how-it-works)
5. [Build Plan — Phase by Phase](#5-build-plan--phase-by-phase)
6. [Brand Name Enforcement Checklist](#6-brand-name-enforcement-checklist)
7. [Design Direction for BMIG](#7-design-direction-for-bmig)
8. [Initial Claude Code Prompt](#8-initial-claude-code-prompt)

---

## 1. Project Context

The foundational draft of the BMIG website is built and approved by the client. Colors, typography, and overall direction are locked. The client has provided a round of changes. What remains is to bring the site to life — real photography, scroll effects, animations, refined copy, mobile responsiveness, and the full editorial feel of the reference sites.

**The Business:** BMIG acquires underperforming hotel assets, renovates them to institutional standards, and operates them under Brahmas Hospitality Management.

**The Audience:** Institutional investors and banking partners. The site's tone must convey surgical precision, capital discipline, architectural integrity, and enduring value.

**Current State of `brahma-web/`:**
- Homepage has all major sections (Hero, Properties, Pillars, Dark Anchor, Track Record, Stats, Contact)
- About, Portfolio, Services, Contact pages exist but are basic
- Colors and typography are locked (Newsreader + Manrope, warm ivory + navy palette)
- Real property data is wired in (`src/data/properties.ts`)
- Brand name has been updated from BRAHMA → BRAHMAS across the codebase

---

## 2. Reference Websites & What to Extract

All reference codebases are in the project folder at `../` relative to `brahma-web/`. Full rights and licenses are held.

### 2.1 Primary: Elementis-SOTD (70% of inspiration)

**Stack:** Next.js 15 · React 19 · Motion (Framer Motion v12) · Lenis · Tailwind CSS v4

**Why primary:** This is the site to replicate end-to-end. The section architecture, scroll-triggered clip-path image reveals, text masking, parallax containers, marquee strips, cinematic loader, smooth Lenis scroll, and the way sections arrive — all of it maps directly to BMIG.

#### Key Patterns to Extract

| Pattern | Source File | What It Does |
|---------|------------|--------------|
| **Loader animation** | `components/Client/Loader.tsx` | Full-screen branded curtain that lifts on load. Logo + company name animate in, then the curtain splits/slides away. |
| **Image reveal on scroll** | `hooks/useImageReveal.ts` | `useAnimate` + `clipPath` animation. Images expand from inset on scroll. Directional — different clip paths based on scroll direction. |
| **Mask text animation** | `components/Client/MaskTextClient.tsx` | Text animates in with clip-path + translateY on scroll. Used for section headlines. |
| **Responsive mask text** | `components/Client/ResponsiveMaskTextVariant.tsx` | Mobile-adapted version of mask text animation. |
| **Parallax container** | `components/Client/ParallaxContainer.tsx` | Images that shift at a different rate than scroll, creating depth. |
| **Marquee strip** | `components/Client/Marquee.tsx` | Infinite horizontal scrolling text/logo band. |
| **Responsive marquee** | `components/Client/ResponsiveMarquee.tsx` | Mobile-adapted marquee. |
| **Sidebar** | `components/Client/ResponsiveSideBar.tsx` | Sticky sidebar content that follows scroll within a section. |
| **Image container with clip** | `components/Client/ClipImageContainer.tsx` | Image wrapper with configurable clip-path shapes. |
| **Image card** | `components/Client/ClipImageCard.tsx` | Card component combining clip container + reveal animation. |
| **Lenis smooth scroll** | `utils/lenis.ts` | React Lenis wrapper with RAF loop, integrated with scroll triggers. |
| **Custom cursor** | `components/Client/Cursor.tsx` | Desktop-only custom cursor effect. |
| **Section architecture** | `sections/` | Each section is a self-contained component with its own scroll-triggered entry animations. |

#### Elementis Sections → BMIG Mapping

| Elementis Section | BMIG Equivalent |
|---|---|
| **Hero** | Hero — "From acquisition to operation, we build hospitality that lasts." with property image |
| **Introduction** | Standalone Statement — "Every stage, one partner." |
| **Wellness Sanctuary** | About / Philosophy — BMIG's investment approach |
| **Innovation** | Three Pillars — Acquire / Renovate / Operate |
| **Elementis Story** | About Page (full version) — deeper company narrative |
| **Sustainable Retreat** | Track Record / Selected Investments |
| **Form** | Contact CTA |
| **Footer** | Footer — full nav, legal, social |

### 2.2 Secondary References

| Site | Folder | What to Take |
|---|---|---|
| **Ochi.design** | `ochi.design-UI-Clone/` | Horizontal scroll sections, bold typography scale, image grid layouts, scroll-triggered text animations. GSAP + Locomotive Scroll patterns. |
| **Otis Valen** | `otis-valen-next/` | Smooth scroll feel, elegant transitions between sections, dark/light contrast sections, preloader concept. |
| **Hetari Portfolio** | `hetari-portfolio/` | Clean portfolio grid, image hover effects, minimal navigation, editorial typography. |
| **The Line** | `the-line-awwwards-SOTM/` | Micro-interactions, hover state design, button animations, cinematic feel. |

---

## 3. Technology Stack

### Current Stack (`brahma-web/`)
```
Next.js 16 (React 19)
Tailwind CSS v3
GSAP v3.12.5
Framer Motion v11
Lenis v1.1.18
TypeScript v5
```

### Target Stack (aligned with Elementis)
```
Next.js 15/16 (stay on current or match Elementis 15 — both stable)
Tailwind CSS v4 (upgrade from v3)
Motion v12 (Framer Motion successor, upgrade from v11)
Lenis v1.2+ (upgrade)
GSAP v3.12+ (keep for preloader + complex timelines)
TypeScript v5
```

### Recommendation: Hybrid Animation Approach

Elementis uses Motion for scroll reveals and clip-path animations. GSAP is already in `brahma-web` and you know it well.

**Recommended approach:** Use **Motion** for scroll-triggered reveals (cleaner React 19 integration) and keep **GSAP** for complex timelines (preloader, cinematic sequences, marquee). This hybrid is what most Awwwards-winning sites actually do.

---

## 4. Preloader / Intro Curtain — CSS-Based Approach (IMPLEMENTED)

The preloader uses a **CSS-first architecture** that runs *before* React loads. No SSR issues, no hydration mismatch, no dynamic imports.

### Why This Approach

The boot script in `<head>` runs synchronously before any paint. It sets `data-intro` attributes on `<html>` that CSS uses to show/hide the curtain. React never controls the curtain — it's pure markup + CSS animations + sessionStorage. This is the pattern used by Awwwards SOTM sites.

### Architecture (4 files)

| File | Type | Role |
|---|---|---|
| `src/components/Intro.tsx` | **Server Component** (no `"use client"`) | The curtain markup — BMIG logo SVG + brand text lockup |
| `src/app/layout.tsx` | Server Component | Inline boot `<script>` in `<head>` + `<Intro />` rendered in `<body>` |
| `src/lib/introGate.ts` | Pure DOM library | `heroReady()` promise, state detection, failsafe timer |
| `src/components/HeroGate.tsx` | Client Component | Waits for intro to finish via `heroReady()`, then triggers hero GSAP animation |
| `src/app/globals.css` | Styles | State gating, curtain styles, all keyframes, lift animation |

### How It Works (Timing Flow)

```
0ms       → Page starts loading, INTRO_BOOT runs in <head>
           → Checks sessionStorage — if already played, exits silently (data-intro="skip")
           → Checks prefers-reduced-motion — if on, exits silently
           → Sets data-intro="play" on <html>, locks scroll
           → Sheet appears (CSS: position fixed, full screen, z-index 9999)

100ms     → Logo fades in (CSS: intro-mark-in animation, 800ms, 100ms delay)
200ms     → "BRAHMAS" text slides up (CSS: intro-mark-in, 700ms, 200ms delay)
400ms     → Dotted thread draws between marks (CSS: stroke-dashoffset, 800ms, 400ms delay)
500ms     → × symbol fades in (CSS: intro-mark-in, 600ms, 500ms delay)

2150ms    → Sheet starts lifting (CSS: intro-lift animation, 800ms, 2150ms delay)
           → Curved bottom edge peels away as sheet translates up
2590ms    → RELEASE — heroReady() resolves → HeroGate triggers hero line animations
2950ms    → DONE — sessionStorage set to '1', sheet hidden by CSS
           → data-intro="done", display:none on .intro-sheet

SKIP PATH:
pointerdown/keydown → data-intro="exit" → sheet lifts fast (450ms, no delay) → done
```

### Skip / Interaction

- User can **click/tap** or **press any key** to dismiss instantly
- Sets `data-intro="exit"` which triggers a fast 450ms lift
- Clears the long timers, fires release + done immediately
- Session stored so intro never plays again on revisit

### Accessibility

- `prefers-reduced-motion: reduce` → intro exits silently, no animation plays
- `aria-hidden="true"` on the curtain (it's decorative)
- Hero content is never locked behind the curtain for screen readers

### File Details

#### `src/components/Intro.tsx` (Server Component)

```tsx
const EDGE_SAG = "M0 0 H100 Q50 40 0 0 Z";

export default function Intro() {
  return (
    <div className="intro-sheet" aria-hidden="true">
      {/* Curved bottom edge — flattens as sheet lifts */}
      <svg className="intro-edge" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path className="intro-edge-path" d={EDGE_SAG} />
      </svg>
      <div className="intro-stage">
        {/* BMIG Logo Mark */}
        <div className="intro-logo">
          <svg viewBox="0 0 150 147">
            {/* Lotus petals, key bars, key body, center diamond */}
          </svg>
        </div>
        {/* Brand text lockup */}
        <div className="intro-lockup">
          <span className="intro-slot--l">
            <span className="intro-mask">
              <span className="intro-mark">BRAHMAS</span>
            </span>
          </span>
          <span className="intro-link">
            <svg className="intro-thread"><path d="M0 6 H100" /></svg>
          </span>
          <span className="intro-x">&times;</span>
          <span className="intro-slot--r">
            <span className="intro-mask">
              <span className="intro-mark">Management and Investment Group</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
```

#### `src/app/layout.tsx` — Boot Script

The inline `<script>` in `<head>`:
1. Checks `sessionStorage.getItem('brahma:intro-played')` — if `'1'`, skips
2. Checks `window.matchMedia('(prefers-reduced-motion: reduce)')` — if true, skips
3. Sets `data-intro="play"` + `data-intro-lock` on `<html>`
4. Dispatches custom events: `brahma:intro-release` (2590ms) and `brahma:intro-done` (2950ms)
5. Listeners for `pointerdown` + `keydown` trigger fast exit

#### `src/lib/introGate.ts` — Hero Handshake

```ts
export function heroReady(): Promise<void>
// Returns a promise that resolves when the curtain lifts.
// Resolves instantly if intro was skipped or already played.
// 6-second failsafe guarantees resolution.

export function introAlreadySettled(): boolean
// True if data-intro="done" or data-intro-released attribute exists.

export function introMode(): "play" | "exit" | "skip" | "done"
// Returns current intro state from data-intro attribute.
```

#### `src/components/HeroGate.tsx` — Hero Animation Trigger

```tsx
useEffect(() => {
  if (introAlreadySettled()) {
    gsap.set(".hero-line", { yPercent: 0, opacity: 1 });
    return;
  }
  heroReady().then(() => {
    gsap.from(".hero-line", {
      yPercent: 115, opacity: 0,
      duration: 0.9, ease: "power4.out", stagger: 0.022,
    });
  });
}, []);
```

#### CSS Keyframes (`globals.css`)

| Keyframe | Purpose |
|---|---|
| `intro-mark-in` | Fade + slide up for text marks (700ms, cubic-bezier) |
| `intro-thread-draw` | stroke-dashoffset animation for dotted line |
| `intro-lift` | translateY(0) → translateY(-100%) for curtain exit |

#### CSS State Gating

| Selector | Effect |
|---|---|
| `html[data-intro="play"]` | `overflow: hidden` on root |
| `html[data-intro="skip"] .intro-sheet` | `display: none` |
| `html[data-intro="done"] .intro-sheet` | `display: none` |
| `html[data-intro="done"] .intro-sheet` | `animation: intro-lift 800ms ... 2150ms both` |
| `html[data-intro="exit"] .intro-sheet` | `animation: intro-lift 450ms ... both` |

### Customization Points

When you finish with Claude Code, these are the values you may want to tweak:

| Variable | Current Value | What It Controls |
|---|---|---|
| Boot script `tR` timeout | `2590` | When curtain starts lifting (ms) |
| Boot script `tD` timeout | `2950` | When intro fully completes (ms) |
| CSS lift delay | `2150ms` | Delay before curtain lifts (ms) |
| CSS lift duration | `800ms` | How fast curtain exits (ms) |
| Skip path duration | `450ms` | Fast exit animation speed (ms) |
| Logo fade delay | `100ms` | When logo appears (ms) |
| Text fade delay | `200ms` | When text appears (ms) |
| Thread draw delay | `400ms` | When dotted line draws (ms) |
| × symbol delay | `500ms` | When × appears (ms) |
| `sessionStorage` key | `brahma:intro-played` | Change to prevent cross-project conflicts |
| Custom event names | `brahma:intro-release`, `brahma:intro-done` | Change to match brand naming |
| Background color | `#19263A` | Curtain background (BMIG navy) |
| Text color | `#F4F1EC` | Brand text (BMIG ivory) |
| Accent color | `#6B8CAE` | Thread line + × symbol (BMIG muted blue) |

### Claude Code Prompt for Finishing the Intro

```
The BMIG preloader/intro curtain is partially built. Here's what exists:

FILES ALREADY CREATED:
- src/components/Intro.tsx — Server Component, curtain markup with BMIG logo + text
- src/components/HeroGate.tsx — Client Component, waits for intro then animates hero
- src/lib/introGate.ts — Pure DOM library (heroReady, introAlreadySettled, introMode)
- src/app/layout.tsx — Has boot script in <head> and <Intro /> in body
- src/app/globals.css — Has all intro CSS (state gating, keyframes, curtain lift)

WHAT NEEDS FINISHING:

1. Verify the Intro.tsx logo SVG is correct — the lotus petals and key should
   visually compose the complete BMIG logo mark. If the paths don't look right,
   fix them. The logo should look like the attached reference image.

2. In HeroGate.tsx — the hero animation uses .hero-line selectors. Go to
   src/app/page.tsx Hero section and wrap each line of the h1 in
   <span className="hero-line"> so the stagger animation works.

3. In globals.css — the intro-logo class has animation but no actual styles
   defined yet. Add the intro-logo animation CSS.

4. Test the timing: the intro should feel cinematic but not slow. Total duration
   should be ~3 seconds. Adjust the CSS animation delays if needed.

5. Make sure the Intro component renders OUTSIDE any scroll providers
   (it already does in layout.tsx — verify this is correct).

6. The curved bottom edge of the curtain should create a smooth peel-away
   effect. Verify the SVG path "M0 0 H100 Q50 40 0 0 Z" creates the right
   visual curve and adjust Q50 40 if needed.

Keep everything else as-is. Don't change the boot script or introGate.ts —
those are working correctly.
```

---

## 5. Build Plan — Phase by Phase

### Phase 0: Prep (Before any coding)

- [ ] Confirm final logo files (SVG, PNG dark/light variants)
- [ ] Confirm all property photography (hero images, gallery, about page)
- [ ] Gather all client copy changes — compile into a single document
- [ ] Decision: upgrade to Tailwind v4 + Motion v12, or stay on current stack? **Recommend: upgrade to match Elementis.**

### Phase 1: Stack Alignment

- [ ] Upgrade Tailwind CSS v3 → v4 (new config format, `@theme` directive)
- [ ] Upgrade Framer Motion v11 → Motion v12 (rename imports from `framer-motion` to `motion/react`)
- [ ] Upgrade Lenis to v1.2+
- [ ] Keep GSAP for preloader + complex timelines
- [ ] Update `tailwind.config.ts` → `@config` in CSS or new config format
- [ ] Update all import statements across components
- [ ] Verify dev server runs clean

### Phase 2: Preloader / Intro Curtain (CSS-Based — IMPLEMENTED)

The preloader uses a CSS-first architecture: boot script in `<head>` runs before React, sets `data-intro` attributes, CSS animations handle all motion. No SSR issues, no hydration mismatch.

- [x] Create `src/components/Intro.tsx` (Server Component — curtain markup with BMIG logo + brand text)
- [x] Create `src/lib/introGate.ts` (pure DOM — `heroReady()` promise, state detection, failsafe)
- [x] Create `src/components/HeroGate.tsx` (Client Component — waits for intro, triggers hero animation)
- [x] Integrate boot script into `src/app/layout.tsx` `<head>` (inline, blocking, no React)
- [x] Add all CSS to `globals.css` (state gating, keyframes, curtain lift, reduced-motion)
- [ ] Verify logo SVG paths visually — ensure lotus + key compose the correct mark
- [ ] Test timing — should feel cinematic, ~3s total. Adjust CSS delays if needed.
- [ ] Test on mobile + desktop
- [ ] Verify `Intro` renders OUTSIDE scroll providers (outside `<SmoothScrollProvider>`)

### Phase 3: Smooth Scroll + Scroll Reveal System

- [ ] Upgrade Lenis configuration (easing function, duration)
- [ ] Update `SmoothScrollProvider.tsx`
- [ ] Create reusable `Reveal` component (`src/components/ui/Reveal.tsx`)
  - Wraps any element
  - Uses Motion `useInView` for scroll-triggered entry
  - Configurable: direction (up/down/left/right), delay, duration, distance
- [ ] Create `useImageReveal` hook (port from Elementis `hooks/useImageReveal.ts`)
- [ ] Create `ParallaxContainer` component (port from Elementis)
- [ ] Test parallax depth on hero image

### Phase 4: Hero Section Redesign

- [ ] Apply Elementis Hero pattern:
  - Large serif headline (Newsreader, display size)
  - Subhead in Manrope
  - Hero image with clip-path reveal on load
  - Clean, spacious 12-column grid layout
- [ ] Add real hero photography from property data
- [ ] Implement image reveal animation (clip-path from inset)
- [ ] Add subtle parallax on hero image
- [ ] Add scroll-triggered text reveal

### Phase 5: Section-by-Section Elevation

Apply Elementis patterns to each homepage section in `src/app/page.tsx`:

**Standalone Statement:**
- Full-width band, centered serif text
- Subtle entrance: translateY + opacity on scroll

**Featured Properties:**
- Clip-path image containers (angular corners, like Elementis)
- Staggered grid layout (one card offset with `md:mt-24`)
- Image reveal on scroll (directional clip-path)
- Hover: scale + opacity shift

**Three Pillars:**
- Card-based layout with numbered labels (01, 02, 03)
- Hover state: background fill transition
- Staggered reveal on scroll (each card delays)

**Dark Anchor:**
- Deep navy (#1A2A3F) full-width band
- Oversized ghost wordmark "BRAHMAS" at 5% opacity
- Centered white text + CTA button
- Cinematic feel — this should feel like a breath between sections

**Track Record:**
- Clean data table with architectural hairline borders
- Hover row highlight
- Scroll reveal per row

**Stats Bar:**
- Three-column stat display
- Count-up animation on scroll (GSAP)

**Contact CTA:**
- Centered card with border
- Clean CTA button
- Scroll reveal

### Phase 6: About Page Redesign

- [ ] Full-page narrative structure (like ElementisStory)
- [ ] Large imagery with parallax
- [ ] Text masking animations for key statements
- [ ] Business model explanation: Acquire → Renovate → Operate
- [ ] Deep company narrative with editorial typography
- [ ] "Brahmas Management and Investment Group" full name prominently featured

### Phase 7: Portfolio Page

- [ ] Already has real properties wired in
- [ ] Add scroll-triggered image reveals per property
- [ ] Staggered grid with offset layout
- [ ] Clip-path containers for images
- [ ] Hover states with image scale + opacity

### Phase 8: Footer Redesign

- [ ] Multi-column footer (navigation, services, legal, social links)
- [ ] Bottom bar with copyright + **"Brahmas Management and Investment Group"**
- [ ] Clean, minimal design matching Elementis footer pattern
- [ ] Muted text colors, hairline borders

### Phase 9: Additional Sections & Polish

- [ ] **Marquee strip** — horizontal scrolling text strip (tagline: "Acquire · Renovate · Operate" or partner-focused)
- [ ] **Custom cursor** — desktop-only, subtle dot that scales on hover (port from Elementis `Cursor.tsx`)
- [ ] **Page transitions** — smooth transitions between pages
- [ ] **Image lazy loading** — blur placeholder + fade-in
- [ ] **Mobile responsive audit** — every section tested at 375px, 768px, 1024px, 1440px

### Phase 10: Content & Brand Finalization

- [ ] Replace ALL placeholder images with real property photography
- [ ] Finalize all copy (headlines, body, labels) per client feedback
- [ ] Ensure "Brahmas Management and Investment Group" full name appears in:
  - Footer (every page)
  - About page (hero + body)
  - Preloader
  - SEO meta tags (layout.tsx metadata)
  - Privacy / Terms pages (legal entity)
- [ ] All logo alt texts updated
- [ ] No remaining "BRAHMA" without the "S"

---

## 6. Brand Name Enforcement Checklist

**Full Legal Name:** Brahmas Management and Investment Group (BMIG)

Update everywhere:

| Location | What to Update |
|---|---|
| Preloader | Full name in Intro.tsx text lockup + boot script sessionStorage key |
| Navbar | Logo alt text, any tooltips |
| Hero section | Company name in copy if applicable |
| About page | Full legal name in body + meta |
| Footer (all pages) | "© [year] Brahmas Management and Investment Group. All rights reserved." |
| SEO / Meta tags | Title, description, OG title in `layout.tsx` |
| Privacy / Terms | Legal entity name |
| Contact page | Company name in address/header |
| Logo alt text | Every `<img alt="">` and SVG `<title>` |
| Page titles | `<title>` tags across all pages |

---

## 7. Design Direction for BMIG

### Audience Psychology
The visitors are investors and institutional partners. They think in terms of:
- Asset quality and location
- CapEx efficiency and IRR
- Operating discipline and brand positioning
- Risk mitigation and downside protection

### How the Design Communicates This

| Design Element | What It Says |
|---|---|
| **Deep navy (#1A2A3F)** | Gravitas, institutional trust, seriousness of capital |
| **Warm ivory (#F4F1EC)** | Warmth, approachability, human scale behind the numbers |
| **Generous whitespace** | Confidence — no need to fill every pixel. We know our value. |
| **Large serif headlines** | Editorial authority — we have something to say and we say it well |
| **Architectural grid + hairline borders** | Precision, structure, engineering mindset |
| **Oversized ghost wordmark** | Scale — we think in portfolios, not single assets |
| **Clip-path image reveals** | Refinement — attention to detail in presentation |
| **Slow, smooth scroll** | Composure — no urgency, no desperation. We move at our pace. |

### Tone of Voice for Copy
- **Confident but understated** — let the work speak
- **Precise** — specific numbers, specific locations, specific strategies
- **No superlatives** — no "best," "premier," "leading" unless backed by data
- **Architectural metaphors** — "structural quality," "foundational," "built to last"

---

## 8. Initial Claude Code Prompt

Copy the block below and paste it into Claude Code running in the `brahma-web` project directory.

```
You are building the BMIG (Brahmas Management and Investment Group) website.
Project path: . (current directory — brahma-web/)

Reference codebases (read-only, for pattern extraction):
- ../Elementis-SOTD/        — PRIMARY reference (Next.js 15 + Motion v12 + Lenis + Tailwind v4)
- ../ochi.design-UI-Clone/  — Secondary (Vite + Framer Motion + GSAP)
- ../otis-valen-next/       — Secondary (Next.js 14 + GSAP + Lenis)
- ../hetari-portfolio/      — Secondary (Vue + GSAP + Lenis)
- ../the-line-awwwards-SOTM/ — Secondary (Next.js 15 + Motion + Lenis)

COMPANY
- Full name: Brahmas Management and Investment Group (BMIG)
- Business: Acquire, renovate, and operate underperforming hotel assets
- Audience: Institutional investors, banking partners
- Logo: Check public/ for any logo files. If none, use text lockup.

CURRENT STATE
- Homepage (src/app/page.tsx): Hero, Standalone Statement, Featured Properties, Three Pillars, Dark Anchor, Track Record, Stats Bar, Contact CTA
- About, Portfolio, Services, Contact pages exist but are basic
- Colors locked: warm ivory #fff8f2, deep navy #1A2A3F, muted blue #6B8CAE
- Typography locked: Newsreader (serif/display) + Manrope (sans/body)
- Property data in src/data/properties.ts

WORK TO DO (in order)

STEP 1 — Stack Upgrade
- Upgrade Tailwind CSS v3 → v4 (update config format, globals.css)
- Upgrade Framer Motion → Motion v12 (rename imports to motion/react)
- Upgrade Lenis to latest (update config)
- Keep GSAP for preloader
- Verify dev server runs clean

STEP 2 — Preloader / Intro Curtain (CSS-Based — ALREADY BUILT, NEEDS FINISHING)

The preloader uses a CSS-first architecture: boot script in <head> runs before React,
sets data-intro attributes, CSS animations handle all motion. No SSR issues.

Already created:
- src/components/Intro.tsx — Server Component, curtain markup with BMIG logo + text
- src/components/HeroGate.tsx — Client Component, waits for intro then animates hero
- src/lib/introGate.ts — Pure DOM library (heroReady promise, state detection)
- src/app/layout.tsx — Boot script in <head> + Intro rendered in <body>
- src/app/globals.css — All intro CSS (state gating, keyframes, curtain lift)

Still needs:
- Verify logo SVG in Intro.tsx — lotus petals + key should compose the complete BMIG mark
- In HeroGate.tsx — .hero-line selectors need matching spans in page.tsx Hero section
- Add intro-logo animation CSS in globals.css (the animation declaration is referenced but not styled)
- Test timing (~3s total cinematic feel), adjust CSS delays if needed
- Verify Intro renders OUTSIDE scroll providers (outside SmoothScrollProvider)

STEP 3 — Scroll System
- Upgrade Lenis config (easing, duration)
- Create reusable Reveal component (src/components/ui/Reveal.tsx) using Motion useInView
- Create useImageReveal hook (port from ../Elementis-SOTD/hooks/useImageReveal.ts)
- Create ParallaxContainer component (port from ../Elementis-SOTD/components/Client/ParallaxContainer.tsx)

STEP 4 — Homepage Elevation (apply Elementis patterns to each section)
For each section in src/app/page.tsx:
- Add scroll-triggered entrance animations (Reveal component)
- Apply clip-path image reveals where images exist
- Add parallax to hero image
- Use staggered reveals for card grids
- Dark anchor: add oversized ghost "BRAHMAS" wordmark at 5% opacity
- Stats: add count-up animation on scroll (GSAP)

STEP 5 — About Page Redesign
- Full narrative layout with parallax imagery
- Text masking animations for key statements
- Business model: Acquire → Renovate → Operate
- Full company name "Brahmas Management and Investment Group"

STEP 6 — Portfolio Page
- Clip-path image containers
- Staggered grid with offset
- Scroll-triggered image reveals
- Hover: scale + opacity

STEP 7 — Footer Redesign
- Multi-column (nav, services, legal, social)
- Bottom bar: "© [year] Brahmas Management and Investment Group"
- Minimal, Elementis-style

STEP 8 — Additional Polish
- Marquee strip (horizontal scrolling text)
- Custom cursor (desktop only, port from ../Elementis-SOTD/components/Client/Cursor.tsx)
- Image lazy loading with blur placeholder
- Mobile responsive audit

STEP 9 — Content & Brand Finalization
- Replace all placeholder images with real photography
- Ensure "Brahmas Management and Investment Group" full name in: footer, about page, preloader, meta tags, legal pages
- No "BRAHMA" without the "S" anywhere

DESIGN PRINCIPLES
- Warm ivory base (#fff8f2), never stark white
- Deep navy (#1A2A3F) for dark sections
- Single muted blue accent (#6B8CAE) used sparingly
- Newsreader for headlines, Manrope for body
- Generous whitespace, architectural grid feel
- Every animation must respect prefers-reduced-motion
- Mobile-first responsive

Start with Phase 1. Work through each phase. Ask before making decisions that affect the whole project.
```

---

## Appendix: Elementis File Reference Map

```
../Elementis-SOTD/
├── app/
│   ├── layout.tsx          → Root layout (fonts, Lenis, providers)
│   ├── page.tsx            → Section composition order
│   ├── providers.tsx       → WindowSizeProvider (mobile detection)
│   ├── globals.css         → Global styles
│   └── fonts/              → BasisGrotesquePro (wght 300, 400, 500)
├── components/Client/
│   ├── Loader.tsx          → ★ Preloader animation
│   ├── Cursor.tsx          → ★ Custom cursor
│   ├── ClipImageContainer.tsx → ★ Image wrapper with clip-path
│   ├── ClipImageCard.tsx   → ★ Card with clip + reveal
│   ├── MaskTextClient.tsx  → ★ Text masking animation
│   ├── ResponsiveMaskTextVariant.tsx → ★ Mobile text mask
│   ├── ParallaxContainer.tsx → ★ Parallax image wrapper
│   ├── Marquee.tsx         → ★ Infinite scroll strip
│   ├── ResponsiveMarquee.tsx → ★ Mobile marquee
│   ├── ResponsiveSideBar.tsx → ★ Sticky sidebar
│   ├── NavBar.tsx          → Navigation
│   ├── Innovation.tsx      → Section component
│   ├── SustainableRetreat.tsx / Client.tsx → Section component
│   ├── StyledLinkClient.tsx → Animated link
│   ├── Checkbox.tsx / SelectClient.tsx → Form elements
│   └── VideoPlayer.tsx     → Video component
├── hooks/
│   ├── useImageReveal.ts   → ★ Scroll-triggered clip-path reveal
│   ├── useMaskImage.ts     → Image masking
│   └── useCursor.ts        → Cursor state
├── sections/
│   ├── Hero/               → Hero section
│   ├── Introduction/       → Intro section
│   ├── ElementisStory/     → About/narrative section
│   ├── WellnessSanctuary/  → Philosophy section
│   ├── SustainableRetreat/ → Portfolio section
│   ├── Form/               → Contact form
│   └── Footer/             → Footer (Server + Client)
├── utils/
│   └── lenis.ts            → ★ Lenis smooth scroll config
└── package.json            → Dependencies
```

★ = High-priority files to study and port
