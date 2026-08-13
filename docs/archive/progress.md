# BRAHMAS Website — Design Elevation Progress

## What We're Building
A complete sitewide identity overhaul adopting **Elementis (elementis.com)** as the design reference. The goal is cinematic, editorial, architectural — not template-like.

---

## What's Done

### 1. Core Design Components Created
- **`MaskText`** — Elementis's signature line-reveal animation. Each line slides up inside an `overflow:hidden` slot with `clip-path: inset()` wipe. Staggered delays. Used on every headline.
- **`MarqueeTicker`** — Infinite CSS-scroll ticker. Massive text (clamp 48–120px), Newsreader serif 300 weight. Two copies for seamless `translateX(-50%)` loop. Fades at edges.
- **`SectionTitle`** — Hamburger icon + uppercase section label. Elementis puts this above every section.
- **`HeroSplit`** — Split layout hero: text left (50%), image right (50%). Image has **scroll-linked horizontal bar mask reveal** (24 divisions, ported from Elementis's `useMaskImage` hook). Dark gradient edge blend where text meets image.
- **`useMaskImage`** — Custom hook from Elementis. Creates a `linear-gradient` mask with 24 horizontal bars that transition from transparent→opaque as scroll progresses. Staggered per-bar timing.

### 2. Hero Section (page.tsx)
- Replaced old hero with HeroSplit using first property image
- Hero text uses MaskText for each line (tagline, subtext, CTAs)
- MarqueeTicker below hero
- Still uses old `hero-line` spans and HeroGate — needs cleanup

### 3. Other Sections (page.tsx)
- **About** — Two-col grid (text + image), Label + MaskText headline + body
- **Timeline / Our Process** — Dark section, 3-pillar grid (Acquire/Renovate/Operate), SectionTitle
- **Selected Work** — Two property cards with clip-path shapes, hover effects
- **Stats** — White section, 4-col stat grid
- **CTA** — Dark section with oversized BRAHMAS wordmark watermark

### 4. Supporting Files
- `globals.css` — Updated with Elementis design tokens (colors, spacing, typography scale)
- `tailwind.config.ts` — Design system with custom colors and font families
- `docs/execution-plan.md` — Full section-by-section plan

---

## What Needs Work

### Immediate (next session)

| Priority | Task | Notes |
|----------|------|-------|
| **HIGH** | Clean up HeroGate / hero-line remnants | Hero now uses MaskText. The old `HeroGate` component, `.hero-line` spans, and boot-script preloader dependency can be removed or simplified |
| **HIGH** | Replace all `Reveal` components with `MaskText` | Currently About section and some CTAs still use old `Reveal` animation. Should be MaskText for consistency |
| **HIGH** | Add Elementis-style SectionTitle to every section | About, Selected Work, Stats, CTA — all need the hamburger + label header |
| **MED** | Selected Work → Innovation-style sticky section | Elementis does a 500vh sticky container with scroll-linked image crossfade. Currently we have static cards. This is the centerpiece |
| **MED** | Build Properties Grid page | 12 properties, 3-col desktop / 2-col tablet / 1-col mobile |
| **MED** | Build About page | Full company story |
| **LOW** | Re-enable preloader when ready | Currently disabled. Boot script sets `data-intro="done"` immediately |
| **LOW** | Navbar fixes | Bigger logo, BRAHMAS font weight revert, equal-width lockup |

### Design Decisions Needed
1. **Video vs image in hero** — Elementis uses video with scroll mask. We're using a static photo. Do you want video, or keep images?
2. **Preloader** — Disabled now. Revisit when ready.
3. **Property images** — Need real content. Currently using placeholder paths from `properties` data.

---

## File Map

```
brahma-web/src/
├── app/
│   ├── globals.css          ✅ Updated with Elementis tokens
│   ├── layout.tsx           ⚠️ Has disabled preloader boot script
│   └── page.tsx             ⚠️ Mixed old/new patterns (Reveal + MaskText)
├── components/
│   ├── ui/
│   │   ├── HeroSplit.tsx    ✅ Split hero with scroll-linked mask
│   │   ├── MaskText.tsx     ✅ Line reveal animation
│   │   ├── MarqueeTicker.tsx ✅ Infinite scroll ticker
│   │   ├── SectionTitle.tsx ✅ Hamburger + label
│   │   ├── Button.tsx       ✅ Existing
│   │   ├── Label.tsx        ✅ Existing
│   │   ├── Reveal.tsx       ⚠️ Old pattern, should be phased out
│   │   └── ...
│   ├── HeroGate.tsx         ⚠️ Old preloader-dependent, may be removable
│   └── layout/
│       ├── Navbar.tsx       ⚠️ Needs fixes (logo size, font weight, lockup)
│       └── Footer.tsx       ✅ Existing
├── hooks/
│   └── useMaskImage.ts      ✅ Horizontal bar mask hook
└── data/
    └── properties.ts        ✅ Property data (12 properties)
```

---

## Next Session Resume Point

Start with page.tsx cleanup:
1. Remove `Reveal` imports and replace all `Reveal` usage with `MaskText`
2. Add `SectionTitle` to each section
3. Remove HeroGate if no longer needed
4. Then build the Innovation-style sticky Selected Work section
