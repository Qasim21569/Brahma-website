# BRAHMAS Website — Session Progress

## Stack
- Next.js 15.1.0 (Turbopack) · React Server Components
- Tailwind CSS v4 (@config bridge)
- Motion (Framer Motion) v12
- Lenis 1.3 (smooth scroll)
- GSAP (hero line entrance)
- Fonts: Newsreader (serif) + Manrope (sans)

## What We Built (Phase 1 → Ongoing)

### Preloader (CSS-first architecture)
- Boot script in `<head>` sets `data-intro` on `<html>` before React mounts
- Pure CSS keyframe animations: lotus petals, key unlock, curtain lift via `clip-path: polygon()`
- `HeroGate` component listens for `brahma:intro-done` event then GSAP-animates `.hero-line` spans
- **Status: TEMPORARILY DISABLED** — boot script stubbed to immediately set `data-intro="done"`
- To re-enable: restore original boot script in `layout.tsx` (has timing/skip handlers)

### Design Identity (Elementis-inspired)
- **Dark-first palette** (switched from light-first): ink-deep #0a1220 bg, cream #f5f0e8 text, muted-azure #7b9ec4 accent
- Typography: Newsreader 300 (display hero), 400 (headlines), Manrope 400 (body)
- Surface system: ink-navy, ink-mid, primary-container for hover/raised states
- Section alternation: dark → slightly lighter dark → darker dark for depth
- Architectural grid background pattern + stone noise texture
- Label caps system with dot/line variants
- Dashed animated underline hover on nav links (Elementis signature)

### UI Components
| Component | File | Purpose |
|-----------|------|---------|
| `Reveal` | `ui/Reveal.tsx` | Scroll-triggered fade+slide entrance |
| `RevealImage` | `ui/RevealImage.tsx` | Clip-path image wipe on scroll |
| `MaskText` | `ui/MaskText.tsx` | Per-line mask reveal (Elementis headline style) |
| `Button` | `ui/Button.tsx` | Pill CTA with solid/outline/light variants |
| `Label` | `ui/Label.tsx` | Section label with optional dot or line |

### Navbar
- Logo lockup: SVG mark + BRAHMAS (Newsreader 400) + subtitle (Manrope, justified)
- Elementis-style animated underline hover on nav links
- Scroll behaviors: glass fill+blur on scroll, hide-down/show-up, padding shrink
- Mobile drawer with backdrop overlay

### Homepage Sections
1. **Hero** — full-bleed image loop (HeroImageLoop), dark overlay, Ken-Burns, headline + CTA
2. **Standalone Statement** — centered MaskText: "Every stage, one partner."
3. **Featured Properties** — two-column asymmetric grid, clip-path image shapes
4. **Three Pillars** — Acquire / Renovate / Operate cards
5. **Dark Anchor** — ink-navy section with oversized BRAHMAS wordmark
6. **Track Record** — data table layout with property details
7. **Stats Bar** — 03 / 2024 / 02 counters
8. **Contact CTA** — centered card with button

## Session Tasks (2026-08-12)
- [x] Create session documentation (this file)
- [x] Navbar: bigger logo (h-14 md:h-[72px], wider gap)
- [x] Navbar: subtitle font-weight reduced (font-semibold → font-medium)
- [x] Navbar: equal-width lockup (max-content + text-align: justify on subtitle)
- [x] Hero: full-bleed image loop/carousel (HeroImageLoop component, 6s hold, 1.5s crossfade, Ken-Burns)
- [x] Hero: dark overlay + vignette + CTA button
- [x] Production build compiles cleanly (10 routes, all static)

## Design Decisions
- Keep official "Management and Investment Group" subtitle order
- Light-first aesthetic with dark anchor sections for contrast
- Editorial serif for all headlines, clean sans for body
- Images use WebP format, plain `<img>` (next/image migration planned)
- Material Symbols icon font: pinned to single static instance for size

## Dark Theme Shift (Elementis-inspired)
- Switched from light-first to dark-first palette
- Base colors: `ink-deep #0a1220` (bg), `cream #f5f0e8` (text), `muted-azure #7b9ec4` (accent)
- All sections converted: hero, statement, properties, pillars, dark anchor, track record, stats, contact CTA
- Surface layers: `ink-navy`, `ink-mid`, `primary-container` for hover/raised states
- Borders: `white/10` instead of mortar-grey for subtle separation
- Navbar: dark glass, slim padding (16px → 10px on scroll), cream text, muted-azure hover
- Mobile drawer: `bg-ink-deep`, cream nav links
- Button variants updated: solid = cream bg, outline = cream border
- Footer: cream text, muted-azure accent arc
- Overlay reduced to 0.42 for better tagline legibility
- `dark` class on `<html>` for Tailwind dark mode

## Known Issues
- Preloader disabled — needs re-enable when design is finalized
- Hero text had visibility bug (second line hidden) — fixed with CSS fallback
- Dev server 404s for stale chunks after cache clear — normal, fixed by rebuild
