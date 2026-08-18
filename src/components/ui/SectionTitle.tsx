import type { ReactNode } from "react";

/**
 * SectionTitle — the label that introduces every section, on every page.
 *
 * ── History — keep this list growing rather than repeating an entry ──────────
 *
 * v1: `text-xs md:text-sm` (12/14px), muted colour, hamburger mark. 31 of 33
 * call sites *also* passed `text-on-surface-variant`/`text-cream-dim`, so it
 * was dimmed on top of being smaller than the body copy it introduced.
 *
 * v2: fixed size and colour, but added `w-full` and a `flex-1` hairline
 * running out to fill the column. In a grid cell — which stretches — that
 * rendered a long leader line pointing at the content, reading as a flow
 * diagram. `w-full` also broke `SelectedWork`, whose title is a flex child.
 *
 * v3: short fixed-width rule above the label instead. Fixed the diagram
 * problem, but the label was still the SAME colour as the headline it
 * introduced, so it read as "a smaller heading" rather than a distinct label.
 *
 * v4: tried a bracketed numeral, `( 01 )`, extending the `01 — 12` counter
 * language already used on the portfolio grid. Required a render-time counter
 * (`lib/sectionCounter.ts`) so conditional sections (property Gallery, More
 * Assets) didn't skip numbers. **Reverted at the client's request — no
 * numbering wanted on section labels at all**, not even self-correcting ones.
 * `sectionCounter.ts` was deleted with it; if a numbered pattern is wanted
 * again, that file's git history has a working implementation.
 *
 * v5: ■ + label, both fixed `text-muted-azure` at every call site. No numeral,
 * nothing stretched. The accent colour differentiated the label from the
 * headline, which was v3's actual gap. **Its flaw was measurable rather than
 * stylistic:** `muted-azure` (#7b9ec4) on the light canvas (#f4f1ec) is a
 * contrast ratio of **2.48:1**. WCAG AA wants 4.5:1 for text this size. On the
 * 22 light sections the label was genuinely hard to read — not a matter of
 * taste. On dark it was always fine (6.72:1), which is why it survived review.
 *
 * ── v6, current ─────────────────────────────────────────────────────────────
 *      ■  CAPABILITIES     (larger, tighter, and readable on BOTH canvases)
 *
 * Three changes, each with a reason:
 *
 * 1. **Colour is now tone-aware**, which is what finally makes `tone` earn its
 *    place — it was threaded through all 33 call sites and then ignored.
 *      · light sections → `muted-azure-dim` #4a6d94 → **4.77:1** ✓ AA
 *      · dark sections  → `muted-azure`     #7b9ec4 → **6.72:1** ✓ AA
 *    Same accent identity at both ends, just the correct end of it. Keeping one
 *    fixed colour cannot satisfy both canvases: anything readable on cream is
 *    too dark for ink, and vice versa.
 *
 * 2. **Larger** — `--t-section-title` raised to 22px at the 1440 reference
 *    (was 19px), capped at 24px. Set in globals.css, not here.
 *
 * 3. **Tracking cut 0.18em → 0.08em** in the Tailwind config. This matters more
 *    than the size bump: wide tracking is a small-caps device, and at 22px it
 *    was pulling words apart into loose letters. Elementis' section label uses
 *    no tracking; the-line runs uppercase labels at negative tracking.
 *
 * The mark is now sized in `em`, so it tracks the label instead of needing its
 * own breakpoint — at 22px text it lands at ~12px, close to Elementis' 13px
 * burger mark. The gap scales the same way.
 *
 * ── Colour is owned here, not by callers ────────────────────────────────────
 * Still true, and still the point: **never pass a `text-*` class in**. The only
 * input is `tone`, which must match the section's canvas — `tone="light"` on a
 * dark section. Getting it wrong now costs contrast, not just hue, so it is
 * worth checking when adding a section.
 */
export function SectionTitle({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  /**
   * The canvas this label sits ON, not the colour of the label.
   * "dark" = dark text on a light section (the default).
   * "light" = light text on a dark section — pass this on every `bg-ink-*`
   * or `bg-primary` section, or the label drops to 2.48:1 against it.
   */
  tone?: "dark" | "light";
  className?: string;
}) {
  const accent = tone === "light" ? "text-muted-azure" : "text-muted-azure-dim";

  // The type is set on the CONTAINER, not on the label span, so the `em` units
  // below resolve against --t-section-title. On the span they would have
  // resolved against whatever font-size the section happened to inherit, and
  // the mark would have drifted out of proportion section by section.
  return (
    <div
      className={`flex items-center gap-[0.7em] font-section-title text-section-title ${accent} ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-[0.55em] w-[0.55em] shrink-0 bg-current"
      />
      <span className="uppercase">{children}</span>
    </div>
  );
}
