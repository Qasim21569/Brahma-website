# BRAHMAS Website — Elementis Replication Plan

## Reference Analysis (Elementis.com)
- **Hero**: Split layout — tagline/text on LEFT, image on RIGHT. Image changes as you scroll (fade/slide transitions). Marquee text ticker below hero. Two CTAs beneath tagline.
- **Transitions**: Sections flow into each other with scroll-triggered animations (fade, slide, reveal). No hard cuts.
- **Typography**: Clean, bold headlines. Strong hierarchy. Generous spacing. Headline font at large scale, body at comfortable reading size.
- **Color**: Dark navy base, white/cream text, blue accent for links and CTAs. Alternating dark/light sections for rhythm.
- **About section**: Small, focused — "Our Story" with key messaging. Not a full-page dump.
- **Innovation/Work section**: Grid or carousel of projects/case studies with images, titles, categories. Clean cards with hover effects.
- **Timeline**: Vertical or horizontal timeline showing the process/workflow.

---

## Hero Section Redesign

### Current (to be removed)
- Full-bleed image with text overlay
- Single static image
- Simple headline + tagline

### New Design (Elementis-style)
```
┌────────────────────────────────────────────────┐
│  [Navbar - slim, light, dark text]             │
├──────────────────────┬─────────────────────────┤
│                      │                         │
│   TAGLINE            │    IMAGE                │
│   (large headline)   │    (changes on scroll   │
│                      │     or viewport change)  │
│   Subtext            │                         │
│                      │                         │
│   [CTA 1]  [CTA 2]  │                         │
│                      │                         │
├──────────────────────┴─────────────────────────┤
│  [Marquee ticker - scrolling text strip]        │
│  "Acquire • Renovate • Operate • Repeat • ..."  │
└────────────────────────────────────────────────┘
```

**Implementation:**
- Grid layout: left 50-55% text, right 45-50% image
- HeroImageLoop component: `single={false}`, positioned on RIGHT side only (not full-bleed)
- Image crossfades every 5-6s (Ken-Burns zoom)
- Text: "Capital with conviction. / Operation with precision." + tagline
- Two CTAs: "View Portfolio" (solid) + "Our Thesis" (outline)
- Below hero: marquee strip with scrolling text (CSS animation, infinite loop)
- Marquee content: "ACQUIRE  •  RENOVATE  •  OPERATE  •  INSTITUTIONAL STANDARDS  •  NO THIRD-PARTY MANAGEMENT  •  REPEAT"

---

## Section-by-Section Plan

### 1. Hero (above) — DONE IN THIS PLAN

### 2. Marquee Ticker
- Full-width strip with scrolling text
- Dark background (ink-navy), cream text
- CSS `@keyframes marquee` — `translateX(0)` → `translateX(-50%)`
- Content duplicated for seamless loop
- Small padding (py-3), font-label-caps, tracking-wide

### 3. Standalone Statement (Light Section)
- Keep: "Every stage, one partner."
- Light bg (stone-white), dark text
- Centered, MaskText animation on scroll

### 4. Timeline / What We Do
- NEW SECTION — Elementis-style process timeline
- Three columns or vertical timeline
- 01 Acquire / 02 Renovate / 03 Operate
- Each with icon, title, description
- Dark bg (ink-deep), cream text, azure accents
- Scroll-triggered reveal animations

### 5. Selected Work (Portfolio Preview)
- NEW SECTION — Elementis-style innovation grid
- Grid of 3-4 featured properties
- Each: image + property name + location + category
- Hover: image scales, overlay appears
- Light section (stone-white bg)

### 6. About Section (Small)
- NEW SECTION — "Our Story"
- Two columns: text on left, image on right
- ~150 words: Brahma's founding thesis, approach, commitment
- Dark section (ink-deep)

### 7. Properties Grid (All 12)
- NEW SECTION — "Total Portfolio"
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile
- 12 property cards
- Each: image, name, location, year, status
- Light section

### 8. Stats + CTA (Keep existing, restyle)
- Dark anchor section with stats
- Contact CTA below

---

## Scroll Effects & Transitions

### Elementis-style transitions:
1. **Fade-up on scroll** — sections fade in as they enter viewport (Reveal component already does this)
2. **Image reveal** — images clip-wipe on scroll (RevealImage component)
3. **Parallax** — subtle parallax on hero image as user scrolls
4. **Sticky elements** — none planned for v1
5. **Section transitions** — smooth color transitions between dark/light sections

### Implementation:
- Use Motion (Framer Motion) `useInView` for scroll triggers
- GSAP for hero image transitions (if needed beyond CSS)
- Lenis for smooth scrolling (already configured)
- CSS transitions for color/section changes

---

## Typography (Elementis-inspired)

### Headlines:
- Font: Newsreader (serif) — already using
- Weight: 300 (light) for hero, 400 for sections
- Size: 84px hero, 48px section headers, 32px card titles
- Line-height: tight (0.92-1.1)

### Body:
- Font: Manrope (sans-serif) — already using
- Weight: 400 regular, 500 medium, 700 bold
- Size: 18px body, 16px small, 12px labels
- Line-height: 1.5-1.6

### Spacing:
- Generous section padding (120px top/bottom)
- 40px margin edges
- 1440px max container width
- 24px grid gutters

---

## Color Palette (Final)

| Token | Value | Usage |
|-------|-------|-------|
| ink-deep | #0a1220 | Base bg, dark sections |
| ink-navy | #1A2A3F | Slightly lighter dark, cards |
| ink-mid | #162035 | Hover states, elevated surfaces |
| stone-white | #f4f1ec | Light sections, text on dark |
| cream | #f5f0e8 | Primary text on dark bg |
| cream-dim | #d4cfc6 | Secondary text on dark bg |
| mortar-grey | #6b7280 | Borders, subtle dividers |
| mortar-light | #9ca3af | Light borders |
| muted-azure | #7b9ec4 | Accent, links, CTAs |
| muted-azure-dim | #4a6d94 | Hover states |

---

## Implementation Order

1. **Hero section** — split layout, image on right, marquee below
2. **Marquee ticker** — CSS-only scrolling text
3. **Timeline section** — what we do
4. **Selected Work section** — portfolio preview grid
5. **About section** — small story
6. **Properties grid** — all 12 properties
7. **Inner pages** — /about, /portfolio, /services, /contact
8. **Scroll effects polish** — parallax, smooth transitions

---

## Files to Create/Modify

### New Files:
- `src/components/ui/MarqueeTicker.tsx` — scrolling text strip
- `src/components/ui/HeroSplit.tsx` — split hero (text left, image right)
- `src/components/ui/Timeline.tsx` — process timeline
- `src/components/ui/PropertyGrid.tsx` — 12-property grid
- `src/components/ui/SelectedWork.tsx` — featured work section

### Modified Files:
- `src/app/page.tsx` — complete restructure
- `src/components/layout/Navbar.tsx` — already done
- `src/app/globals.css` — add marquee keyframes
- `tailwind.config.ts` — already updated

---

## Estimated Complexity

- Hero + Marquee: Medium (1-2 hours)
- Timeline: Low (30 mins)
- Selected Work: Low (30 mins)
- About: Low (20 mins)
- Properties Grid: Medium (1 hour)
- Inner pages: High (3-4 hours each)
- Scroll effects polish: Medium (1-2 hours)

**Total homepage: ~5-6 hours of focused work**
**Total site (including inner pages): ~15-20 hours**

---

## Next Steps

1. Approve this plan
2. Start with Hero section redesign
3. Build marquee ticker
4. Build timeline
5. Build selected work
6. Build about + properties
7. Move to inner pages
