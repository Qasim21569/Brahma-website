# BRAHMAS — Site Elevation Plan

## The Goal

Move from a standard corporate hospitality website to an **editorial, architectural, investment-grade** digital presence. The kind of site that makes a sophisticated LP or institutional partner stop scrolling and think: *"This company operates differently."*

The site should feel like walking into a space designed by someone who understands restraint — where every element exists because it earns its place, and the confidence comes from what's left out as much as what's put in.

---

## Design Principles

### 1. Cinematic Restraint
Borrowed from Elementis. Large negative space. Slow, choreographed reveals. The hero doesn't shout — it unfolds. Images don't fill the screen out of obligation; they're staged, cropped, or masked with intent. Motion is a reveal, not decoration.

**In practice:** Scroll-linked image masks, MaskText line reveals, long easing curves (0.8s+), staggered timings measured in hundredths not milliseconds.

### 2. Typography as Architecture
Fonts aren't chosen for personality — they're chosen for weight, proportion, and how they carry information. Display type is architectural (Newsreader, 300 weight, massive scale). Body type is quiet and precise (Manrope, 400 weight, tight leading). Uppercase labels are sparse and intentional.

**In practice:** Headlines at `clamp(48px, 6vw, 96px)`. Body at 16–18px. Massive marquee tickers for tonal punctuation. Every font call has a job.

### 3. Dark / Light Alternation as Rhythm
Sections breathe through contrast. Dark sections (`#0a1220`) feel grounded, institutional, serious. Light sections (`#f4f1ec`) feel considered, editorial, open. The alternation isn't random — dark opens, light expands, dark grounds, light concludes. It's the visual equivalent of a pause between thoughts.

**In practice:** Hero (dark) → About (light) → Process (dark) → Selected Work (light) → Stats (dark) → CTA (dark anchor).

### 4. Motion as Evidence
Every animation should communicate something about the brand: control, precision, unhurried confidence. Not bouncy, not playful, not attention-seeking. The motion of the marquee says *"we move markets."* The scroll-linked mask says *"we reveal what matters."* The MaskText stagger says *"we think in sequence."*

**In practice:** `ease: [0.24, 0.43, 0.15, 0.97]` (Elementis's exact curve). No bounce. No spring. Long durations. Generous stagger gaps (80ms+).

### 5. Horizontal Punctuation
The marquee ticker is the site's exclamation point — but used sparingly. It breaks the vertical scroll rhythm with a horizontal wave of energy. It's the only place where the site says something loud. Everything else whispers.

**In practice:** One marquee per page, positioned between hero and first content section. Massive type, infinite loop, edge fades.

### 6. Restraint in Color
No gradients as decoration. No accent colors competing for attention. The palette is: deep navy (`#0a1220`), stone white (`#f4f1ec`), warm cream (`#f5f0e8`), muted azure (`#6b8cba`), and a single mortar grey (`#6b7280`) for structural lines. That's it. Every color has a role: background, text, structural, interactive, or muted.

---

## What "Elevated" Means on Each Page

### Homepage
- **Hero** (dark): Split layout. Left: MaskText-animated tagline with institutional confidence. Right: property image behind a scroll-linked horizontal bar mask that reveals as you scroll. Below: marquee ticker as tonal punctuation.
- **About/Story** (light): SectionTitle + MaskText headline + restrained body text + single image. Feels like reading a founder's letter, not a company description.
- **Selected Work** (dark → light): The centerpiece. A scroll-linked experience where images crossfade as the user scrolls, each with its own title and description. This is where the site earns its investment-grade feel.
- **Process** (dark): Three cards. Clean. Sparse. SectionTitle + numbered steps. No decoration.
- **Stats** (light): Four numbers. No chart junk. Let the figures speak.
- **CTA** (dark): Oversized BRAHMAS wordmark at 3% opacity. One sentence. One button.

### Portfolio Page
- Grid of 12 properties. Each card is an image with a minimal text overlay.
- No masonry, no hover effects that feel gimmicky.
- Filter by type (Resort, Urban, Wellness) — styled as pill toggles, not dropdowns.

### About Page
- Full story. Founder's letter + timeline + team.
- Uses MaskText on all headlines.
- Light section with dark anchor at the bottom.

### Services Page
- Three pillars as the homepage does, but expanded.
- Each pillar gets its own section: image, description, relevant stats.

### Contact Page
- Minimal form with architectural underline style inputs (border-bottom only, no borders, no backgrounds).
- Phone + email displayed prominently above form.
- No map (we're not a restaurant). Address only.

---

## Design Tokens (Final)

### Colors
```
Background (dark):   #0a1220
Background (light):  #f4f1ec
Text on dark:        #f5f0e8 (cream)
Text on light:       #0a1220 (ink)
Muted text:          #9ca3af (mortar grey)
Accent (interactive):#6b8cba (muted azure)
Surface (dark):      #111827
Surface (light):     #ebe7df
```

### Typography
```
Display:  Newsreader, 300 weight, 48–96px
Body:     Manrope, 400 weight, 16–18px
Label:    Manrope, 700 weight, 11–13px, uppercase, tracked 0.15em
```

### Spacing
```
Page margin:    clamp(24px, 5vw, 80px)
Section gap:    120px (desktop) / 80px (mobile)
Grid gutter:    32px (desktop) / 24px (tablet) / 16px (mobile)
```

### Animation
```
MaskText duration:  0.8s
MaskText ease:      [0.24, 0.43, 0.15, 0.97]
Stagger gap:        80ms
Image mask speed:   scroll-linked (no fixed duration)
Marquee speed:      25–30s per loop
```

---

## What's Built vs. What's Not

### Built ✅
- MaskText component (line reveal animation)
- MarqueeTicker component (infinite scroll)
- SectionTitle component (hamburger + label)
- HeroSplit component (split layout + scroll-linked mask)
- useMaskImage hook (horizontal bar mask)
- Hero section in page.tsx
- About, Process, Selected Work, Stats, CTA sections
- Design tokens in globals.css and tailwind.config.ts

### Not Built ❌
- Innovation-style sticky Selected Work section (currently static cards)
- Properties Grid page
- About page (full)
- Services page (expanded)
- Contact page
- Preloader (disabled, revisit later)
- Navbar fixes (logo size, font weight, lockup)

---

## Next Session

1. **Clean up HeroGate** — no longer needed with MaskText
2. **Replace Reveal → MaskText** in About and CTA sections
3. **Add SectionTitle** to every section
4. **Build Innovation-style Selected Work** — sticky container, scroll-linked image crossfade, text overlay per image. This is the homepage centerpiece.
5. **Build Properties Grid page**
6. **Build Contact page** with architectural underline inputs

---

*This document is the source of truth for the site's design direction. If a decision feels like it's deviating from these principles, it probably is.*
