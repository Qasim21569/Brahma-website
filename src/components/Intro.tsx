/**
 * The preload curtain — professional BRAHMAS logo reveal.
 *
 * Pure markup — no "use client", no state, no effects.
 * All motion is CSS keyframes in globals.css, orchestrated by the boot
 * script in layout.tsx via the `data-intro` attribute on <html>.
 * This must NOT depend on hydration.
 *
 * ── The mark is INLINE, and must stay inline ─────────────────────────────────
 * It used to be `<Image src={BMIG_LOGO_SRC}>`, pointing at
 * `/BMIG LOGO FINAL.svg` — **5.47 MB**: an SVG wrapper around two base64 PNGs
 * (a 3.7 MB blurred shadow layer under a 330 KB sharp mark), with zero vector
 * paths. The intro runs on a fixed 5000 ms timer in layout.tsx that **does not
 * wait for any asset**, so on a cold or slow load the curtain lifted before the
 * logo had arrived and the animation played with an empty stage. That is the
 * "logo sometimes doesn't load" report — it was a race, which is why it looked
 * intermittent and always worked once the file was cached.
 *
 * A preloader that depends on a network fetch cannot be made reliable by
 * reordering or preloading it; the fetch can always lose the race. Inlining
 * removes the race entirely: the mark is part of the HTML document, so it is
 * present the moment the curtain paints, on the first frame, every time.
 *
 * Fills are literal rather than the source file's `.cls-0`…`.cls-3` classes —
 * those names are generic enough to collide with anything else on the page once
 * the styles are inlined into the document.
 *
 * Mirrors the mvrk-orbit Intro structure:
 *   .intro-sheet (curtain)
 *     .intro-fill (background layer)
 *     .intro-edge (SVG curved bottom edge — flattens as sheet lifts)
 *     .intro-stage (logo + wordmark content)
 *
 * The curved edge is the key transition: it starts as a deep convex curve
 * below the sheet and flattens to zero as the sheet lifts, creating the
 * illusion of the curtain peeling off the floor.
 */

import type { CSSProperties } from "react";

/** Deep sag. Flattens by scaling to zero height, not by morphing `d`. */
const EDGE_SAG = "M0 0 H100 Q50 40 0 0 Z";

/**
 * The LOTUS — the mark's 9 enclosing shapes, in DRAW ORDER, which is not the
 * order they sat in the source file. The key is separate; see `KEY_SHAPES`.
 *
 * The reveal draws each shape's outline and then floods its fill, staggered
 * down this list, so the sequence builds the emblem the way someone would
 * actually draw it: the enclosing ring first, then the arcs inside it, then the
 * wings and the fine detail — finishing with an empty centre for the key to
 * drop into.
 *
 * `pathLength={1}` normalises every shape to a length of 1 regardless of its
 * real geometry, so one `stroke-dasharray: 1` rule drives all twelve. Without
 * it each path would need its own measured length, and any future edit to the
 * artwork would silently desynchronise the draw.
 *
 * The polygon from the source file is expressed as a `path` here: `pathLength`
 * is reliable on `path` across browsers and patchier on `polygon`, and one
 * element type keeps the CSS to a single selector.
 */
const MARK_SHAPES: { d: string; fill: string }[] = [
  // 1 — the enclosing ring. Everything else sits inside it.
  {
    fill: "#1B273C",
    d: "m75 21c-25.4-0.1-45.9 19.8-47 43.4-0.2 3.1-0.2 5.6 0.2 9.2 1.2 0 4.6-0.4 7.8-0.4 11-0.1 19.7 3.8 25.6 9 4.1 4.6 7.3 11.7 7.3 12.8-6.8-1.3-15.5-6.6-19.9-18l-3.8-1.1-0.6 0.1c0.8 6 7.4 20.7 26.8 22.8l1.9 0.2 0.1-0.2c-2.1-10.5-11.9-23.8-26.5-27.2-3.8-1-8.6-1.6-12.7-1.5h-3.2v-2.5c-0.1-21.8 19.1-43 43.8-43.4 24.5-0.3 44.1 19.1 44.2 43.7v1.8l-1.7 0.3c-14.1-0.7-26.2 4.1-34.1 14.3-1.2 1.6-2.8 3.4-3.7 5.7v5h-2.2c-0.5 0.5-0.8 3.8-0.8 3.8 13.1-0.5 25.9-9.2 28.8-22.9l-3.5 0.9c-2.2 7.4-10.2 15.7-21.2 18.2 4.2-11 15.6-20.6 31.2-21.7 3.6-0.4 7-0.1 10 0.3h0.1c0.2-1.3 0.4-3 0.4-4.8 0.2-25.6-21.3-47.7-47.3-47.8z",
  },
  // 2–3 — the two inner arcs, drawn as a symmetrical pair.
  {
    fill: "#6D8FB4",
    d: "m67.1 103.9c-12.3-2.7-26.2-13.4-28.8-30.6l-1.4-0.1c1.9 14.3 11.7 26.4 29.3 31.7l2.6 2.9 0.8-0.8 0.1-0.2-2.6-2.9z",
  },
  {
    fill: "#6D8FB4",
    d: "m82.9 103.9-2.9 2.7 0.9 1.3 2.6-2.7c12.5-2.9 26.8-11.7 29.8-32l-1.4 0.1c-2.2 15.1-14.1 26.6-28.8 30.3l-0.2 0.3z",
  },
  // 4 — the crown chevron.
  {
    fill: "#6D8FB4",
    d: "m75 30.2-1.2 2.9c-3.3 7.7-8.8 12-11.8 18.8l2.6 1.8h0.2c3.1-5.7 7.6-10 10.2-16 2.6 5.3 6.9 9.2 10.3 16l2.7-1.7v-0.2c-3.6-6.9-8-9.5-12.1-18.9l-0.9-2.7z",
  },
  // 5 — the wings.
  {
    fill: "#6D8FB4",
    d: "m109.7 47.4c-11.1 0-23.8 4.3-31.9 16.9l-2.8 4.7-2.1-3.6c-6.3-9.7-16.2-17.9-29.9-17.9h-3l-0.1 0.1c3.2 6.4 3.7 10.7 3.5 21.5l3.2 0.6v-8.7c0-3.6-0.8-7.5-1.6-9.8 6.5 0.3 14.8 3.4 20.5 9.5 5.4 5.6 7.2 11.1 9.3 16h0.3c2.3-4.6 4.5-10.7 9.9-15.4 5-4.7 12.1-9.1 19.7-10.1h-0.1 0.1-0.6 0.6l-0.2 0.1 0.2-0.3v0.2c-0.9 3.6-1.4 5.8-1.4 12.7v5.8l3.2-0.7v-4c-0.1-6.9 0.3-11 3.2-17.4v-0.2z",
  },
  // 6–7 — the outer sweeps, again a pair.
  {
    fill: "#19263A",
    d: "m67 111c-15-3-29.6-12.6-34.7-33l-0.3-0.3-3 0.6v0.3c3.7 16.4 16.6 30.7 37.9 35.6h0.4l-0.3-3.2z",
  },
  {
    fill: "#1B273C",
    d: "m82.6 111.1 0.1 3.2 0.3-0.1c18.8-2.7 34.3-16.7 37.8-35.6v-0.3l-3-0.6-0.2 0.8c-3.6 15.2-16.4 28.3-35 32.6z",
  },
  // 8–9 — inner detail pair.
  {
    fill: "#19263A",
    d: "m59.5 58.2c-1.8 4.5-2.2 10.6-0.9 16.8 1.3 0.8 3.4 2.2 4.3 3-1.9-5.7-2.5-11.4-0.8-18l-2.6-1.8z",
  },
  {
    fill: "#19263A",
    d: "m90.6 58.1-2.6 1.8c1.6 6.1 1.6 11.5-0.8 18 1.2-0.7 3.8-2.5 4.3-2.9 1.4-6.1 0.7-12.9-0.9-16.9z",
  },
];

/**
 * The key, as a separate actor — and the reason the sequence works.
 *
 * ── Why these three are not in MARK_SHAPES ───────────────────────────────────
 * The mark is a lotus enclosed by a ring with a key at its centre, and the two
 * halves mean different things: the petals are the group's identity, the key is
 * what it unlocks. Drawing all twelve shapes on one uniform stagger said
 * neither — the key was just shapes ten, eleven and twelve.
 *
 * So the lotus DRAWS itself (constructed, stroke by stroke) and then the key
 * ARRIVES already whole, descending into the seat the petals have made for it
 * and settling with a turn. Two different verbs for two different ideas.
 *
 * The three pieces are one object stacked vertically — the bow and shaft
 * (78.5→94), the bit (99→104.5) and the light-blue terminus (107.9→117.9) —
 * so they move together inside `.intro-key` rather than animating separately.
 *
 * ⚠️ These paths deliberately DO NOT get the `--mark` draw/fill treatment.
 * They are filled from the start and the group is what animates; see the
 * `.intro-key path` rule in globals.css, which overrides the shared one.
 */
const KEY_SHAPES: { d: string; fill: string }[] = [
  // Bow and shaft.
  {
    fill: "#19263A",
    d: "m75.1 78.5c-1.9 0-3.9 1.5-3.8 3.6s1.4 3.1 2.5 3.5v8.1c0 1.2 2.1 1.8 2.1-0.2h1.6c0.4 0 0.4-0.7 0.4-1.3l-1.9-0.2c-0.2-0.3-0.1-1.4 0.4-1.4h1.5c0-0.4 0.1-1.2-0.2-1.3h-1.7v-3.8c1.7-0.7 2.6-1.9 2.4-4-0.4-1.6-1.5-3-3.3-3zm-0.1 5.1c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.6 1.5-1.6 1.4 0.8 1.4 1.6-0.6 1.4-1.4 1.5z",
  },
  // The bit.
  { fill: "#19263A", d: "M74.2 99 L74.2 104.5 L75.6 104.5 L75.6 99 Z" },
  // Terminus — the one light-blue element in the mark. Gets the settle pulse.
  {
    fill: "#688BB1",
    d: "m75 107.9c-2.8 0-5 2.3-5 5.1s2.2 4.7 5 4.8c2.7 0 5-2 5-4.6 0-2.7-2.1-5.3-5-5.3z",
  },
];

export default function Intro() {
  return (
    <div className="intro-sheet" aria-hidden="true">
      <div className="intro-fill" />

      {/* Curved bottom edge — flattens via scaleY animation as the sheet lifts,
          creating the "curtain peeling off" effect. */}
      <svg
        className="intro-edge"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="intro-edge-path" d={EDGE_SAG} />
      </svg>

      <div className="intro-stage">
        {/* BMIG mark — inlined vector, 2.7 KB of paths. See the note above:
            this must not become a network request again. */}
        <div className="intro-logo">
          <svg
            viewBox="0 0 150 147"
            className="intro-mark h-full w-full"
            role="img"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            {MARK_SHAPES.map((shape, i) => (
              <path
                key={i}
                d={shape.d}
                pathLength={1}
                /* The shape's own colour drives BOTH its outline and its
                   eventual fill, so the stroke reads as the drawn edge of the
                   shape rather than an outline sitting on top of it. Passed as
                   a custom property because each path needs a different value
                   and `fill` is animated in a shared keyframe. */
                style={{ "--mark": shape.fill } as CSSProperties}
              />
            ))}

            {/* The key descends as one object once the lotus has formed. It is
                a <g> so the drop, the turn and the seat are a single transform
                rather than three synchronised ones — and so the CSS above,
                which targets `.intro-mark > path`, cannot reach inside it. */}
            <g className="intro-key">
              {KEY_SHAPES.map((shape, i) => (
                <path
                  key={i}
                  d={shape.d}
                  fill={shape.fill}
                  className={i === KEY_SHAPES.length - 1 ? "intro-key-tip" : undefined}
                />
              ))}
            </g>
          </svg>
        </div>


        {/* Wordmark lockup — width defined by BRAHMAS */}
        <div className="intro-lockup">
          <span className="intro-word-mask">
            <span className="intro-word">BRAHMAS</span>
          </span>
          {/* One line, drawn once, slowly — it IS the progress indicator.
              It previously drew as a hairline and then had a solid fill travel
              the same path, which read as the same line loading twice. */}
          <span className="intro-rule" aria-hidden="true" />

          {/* Split into words so the subtitle staggers in rather than fading as
              one block. That texture is what carries the middle of the 5s;
              justification still works because these are inline-level boxes
              separated by real spaces. */}
          <span className="intro-sub">
            <span className="intro-sub-word">Management</span>{" "}
            <span className="intro-sub-word">and</span>{" "}
            <span className="intro-sub-word">Investment</span>{" "}
            <span className="intro-sub-word">Group</span>
          </span>
        </div>
      </div>
    </div>
  );
}
