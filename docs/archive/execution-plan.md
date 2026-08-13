# BRAHMAS — Elementis Replication Execution Plan

## Architecture (from Elementis-SOTD analysis)

### Key Patterns to Adopt
1. **MaskText everywhere** — every headline animates on scroll (slide-up + clip-path reveal)
2. **Scroll-linked image transitions** — sticky container, images crossfade based on scroll progress
3. **Marquee ticker** — massive scrolling text, CSS-only for simplicity
4. **Section alternation** — dark (#0a1220) → light (#f4f1ec) → dark → light
5. **SectionTitle component** — hamburger icon + section label (Elementis signature)

### What We're Building (Homepage)

**Section 1: Hero**
- Left: tagline (MaskText animated), subtext, 2 CTAs
- Right: property image with scroll-linked horizontal bar mask reveal
- Below: marquee ticker strip

**Section 2: About/Story (Introduction)**
- Light section, stone-white bg
- SectionTitle "OUR STORY"
- MaskText paragraphs + image
- ~150 words

**Section 3: Selected Work (Innovation)**
- Dark section, 500vh tall with sticky container
- Scroll-linked image crossfade (4 properties)
- Text overlay updates per image

**Section 4: Properties Grid**
- Light section, all 12 properties
- 3-col desktop, 2-col tablet, 1-col mobile
- Cards with image, name, location, year

**Section 5: What We Do (Timeline)**
- Dark section, 3 pillars
- SectionTitle + 3 cards (Acquire/Renovate/Operate)

**Section 6: Stats + CTA**
- Dark anchor section
- Stats bar + contact CTA

---

## Execution Order

1. Create MarqueeTicker component (CSS-only)
2. Create SectionTitle component
3. Update MaskText to match Elementis pattern (y:100% + clipPath)
4. Redesign Hero section (split + mask reveal)
5. Build About/Story section
6. Build Selected Work (sticky scroll-linked)
7. Build Properties Grid
8. Build What We Do + Stats/CTA
9. Update page.tsx with all sections
10. Verify build

---

## File Changes

### New Files
- `src/components/ui/MarqueeTicker.tsx`
- `src/components/ui/SectionTitle.tsx`
- `src/components/ui/ClipImageCard.tsx` (for innovation section)
- `src/hooks/useMaskImage.ts` (from Elementis)

### Modified Files
- `src/app/page.tsx` — complete restructure
- `src/components/ui/MaskText.tsx` — update animation pattern
- `src/app/globals.css` — add marquee keyframes
