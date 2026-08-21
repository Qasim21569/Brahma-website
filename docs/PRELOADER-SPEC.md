# Preloader / Intro Curtain — full technical spec

> **This is a PORTABLE EXTRACT, not a project-state doc.** It is deliberately
> outside the HANDOFF → BUILD-PLAYBOOK → PHOTO-PIPELINE → MASTER-PLAN precedence
> chain. Nothing here is authoritative about what is currently shipped in
> brahma-web; HANDOFF.md is. This exists to be lifted into another project.
>
> Written 2026-08-17 against the 8000 ms implementation.

---

## 0. What this thing is

A full-screen curtain that covers the page on first visit, plays an ~8 s brand
animation (a logo that draws itself, a key that drops into it, a wordmark, a
progress rule), then lifts
off the top of the screen with a curved trailing edge.

Four properties define it, and they are the reason it is built the way it is:

1. **It cannot fail.** No hydration, no JS framework, no network fetch in the
   critical path. If the JS bundle never arrives, the animation still plays.
2. **It is a fixed-duration performance, not a real loading bar.** It does not
   measure anything. This is a deliberate trade — see §9.
3. **It plays once per session**, and never for `prefers-reduced-motion`.
4. **It is skippable** by any click or keypress.

---

## 1. Architecture at a glance

```
<html data-intro="skip">            ← state machine lives on the root element
  <head>
    <script>  inline, blocking, pre-paint  </script>   ← the ONLY JavaScript
  </head>
  <body>
    <Intro />                        ← static markup, no "use client"
    …page…
  </body>
</html>
```

| File | Role | Contains JS? |
|---|---|---|
| `app/layout.tsx` | Inline boot script: decides play/skip, owns timers, scroll lock, skip handling | Yes — the only JS |
| `components/Intro.tsx` | The curtain markup + inline SVG logo paths | **No** |
| `app/globals.css` | 100% of the motion, as `@keyframes` gated on `data-intro` | No |
| `lib/introGate.ts` | Optional consumer API for page content | Yes (⚠️ see §10) |

**The split that matters:** the script decides *whether and when*; CSS decides
*what it looks like*. They communicate through exactly one thing — an attribute
on `<html>`. That is what makes the animation independent of React.

---

## 2. The state machine

One attribute, four values, set on `document.documentElement`:

| `data-intro` | Meaning | CSS effect |
|---|---|---|
| `skip` | Never plays. SSR default, and the reduced-motion / already-played result. | `.intro-sheet { display: none }` |
| `play` | Full sequence running. | Sheet displayed; all keyframes run with their delays |
| `exit` | User skipped — fast 450 ms bail-out. | Sheet displayed; lift runs immediately, no delay |
| `done` | Finished. | Sheet hidden again |

Plus two flag attributes:

| Attribute | Purpose |
|---|---|
| `data-intro-lock` | Present only while covering. Drives `html[data-intro-lock] { overflow: hidden }`. Kept **separate from the state value** so the scroll lock can be released independently of which state you are in. |
| `data-intro-released` | Set when content is allowed to start. Lets a late-mounting component ask "did I miss the event?" without needing to have been listening. |

> **Why `skip` is the SSR default.** The server renders `data-intro="skip"`, so
> the curtain is `display: none` in the initial HTML. The boot script flips it to
> `play` before first paint. If the script fails, is stripped by a proxy, or the
> user has JS off, the page renders normally with no curtain — rather than being
> permanently covered by one that can never lift. **Fail open, never fail
> closed.** This is the single most important decision in the whole system.

---

## 3. The boot script

Ships minified into one `dangerouslySetInnerHTML` string. Here it is expanded —
port this version, then minify.

```js
(function () {
  try {
    var d = document.documentElement;
    var KEY = 'brahma:intro-played';
    var played = false, reduce = false;

    // Both reads are individually wrapped: sessionStorage throws in some
    // privacy modes, matchMedia is absent in very old engines. Neither should
    // be able to take down the whole boot.
    try { played = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    if (played || reduce) { d.setAttribute('data-intro', 'skip'); return; }

    d.setAttribute('data-intro', 'play');
    d.setAttribute('data-intro-lock', '');

    // Stop the browser restoring a previous scroll position underneath the
    // curtain — otherwise the page is revealed mid-article.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    try { window.scrollTo(0, 0); } catch (e) {}

    var tR = 7150;   // release: content may start, lift is beginning
    var tD = 8000;   // done: curtain fully off-screen
    var released = false, done = false, timerR, timerD;

    function fire(n) { try { document.dispatchEvent(new Event(n)); } catch (e) {} }

    function release() {
      if (released) return;
      released = true;
      d.setAttribute('data-intro-released', '');
      fire('brahma:intro-release');
    }

    function cleanup() {
      document.removeEventListener('pointerdown', onSkip);
      document.removeEventListener('keydown', onSkip);
    }

    function finish() {
      if (done) return;
      done = true;
      release();                                  // release is idempotent
      d.setAttribute('data-intro', 'done');
      d.removeAttribute('data-intro-lock');       // scroll unlocked here
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      fire('brahma:intro-done');
      cleanup();
    }

    function onSkip() {
      if (done) return;
      d.setAttribute('data-intro', 'exit');       // CSS swaps to the 450ms lift
      clearTimeout(timerR); clearTimeout(timerD);
      release();
      setTimeout(finish, 460);                    // 460 > 450, so CSS lands first
    }

    timerR = setTimeout(release, tR);
    timerD = setTimeout(finish, tD);
    document.addEventListener('pointerdown', onSkip);
    document.addEventListener('keydown', onSkip);
  } catch (e) {
    // Last resort: if ANYTHING above threw, make sure the page is visible.
    try { document.documentElement.setAttribute('data-intro', 'skip'); } catch (_) {}
  }
})();
```

### Details worth keeping when you port it

- **It must be in `<head>` and inline.** An external `<script src>` is a network
  request; if it loses the race the curtain never plays, or worse, flashes.
- **The outer `try/catch` sets `skip`.** Every failure path ends with a visible
  page. Reproduce this.
- **`release()` and `finish()` are idempotent** (`if (released) return`). `finish`
  calls `release`, and the skip path calls both — without the guards a skip
  double-fires the event.
- **`setTimeout(finish, 460)` vs the 450 ms exit animation.** The 10 ms margin
  means the CSS finishes before the element is hidden. If they are equal you can
  get a one-frame flash of un-lifted curtain.
- **`sessionStorage`, not `localStorage`.** Once per *session*: a returning
  visitor tomorrow sees the brand moment again; someone clicking around the site
  today does not sit through it repeatedly. `localStorage` would mean they see it
  once, ever.

---

## 4. The curtain

Three stacked layers:

```
.intro-sheet     position:fixed; inset:0; z-index:9999; pointer-events:none
  .intro-fill    the actual opaque surface (absolute, inset:0)
  .intro-edge    an SVG "skirt" sitting BELOW the sheet (top:100%)
  .intro-stage   the content (logo + wordmark), flex-centred
```

`pointer-events: none` on the sheet is deliberate — the skip listener is on
`document`, so clicks must pass through rather than be swallowed.

### The curved trailing edge — the signature move

The sheet does not lift as a flat rectangle. A separate SVG sits *just below* it
with a deep convex sag:

```jsx
const EDGE_SAG = "M0 0 H100 Q50 40 0 0 Z";
<svg className="intro-edge" viewBox="0 0 100 20" preserveAspectRatio="none">
  <path className="intro-edge-path" d={EDGE_SAG} />
</svg>
```

```css
.intro-edge { position:absolute; top:100%; left:0; width:100%; height:9vh;
              transform-origin: top center; }
```

As the sheet translates up, the edge **flattens** on an identical timeline:

```css
@keyframes intro-lift          { from { transform: translateY(0);  } to { transform: translateY(-100%); } }
@keyframes intro-edge-flatten  { from { transform: scaleY(1);      } to { transform: scaleY(0); } }
```

> **Why `scaleY` and not morphing `d`.** Path morphing needs JS (or SMIL) and
> forces geometry recalculation every frame. `scaleY` on a `transform-origin:
> top center` is GPU-composited and produces the same read: a curve relaxing
> into a straight line. `preserveAspectRatio="none"` lets the 100×20 viewBox
> stretch to any viewport without distorting the illusion.

Both animations share duration, easing and delay so they stay welded together.
Desync them by even 50 ms and the skirt visibly detaches.

---

## 5. The logo reveal — the interesting part

### 5.1 The mark must be inline SVG

Non-negotiable, and learned the hard way. The mark was originally
`<Image src="/logo.svg">`. Because **the intro runs on a fixed timer that never
waits for any asset**, a cold load could lift the curtain before the logo
arrived — the animation played to an empty stage. It looked intermittent, and
always worked once cached, which is what made it hard to pin down.

**A preloader that depends on a network fetch cannot be made reliable by
reordering or preloading it.** The fetch can always lose the race. Inlining the
paths into the HTML document removes the race entirely: the mark is present on
the first frame, every time.

*(Related: the original file was a 5.47 MB "SVG" that was really two base64 PNGs
with zero vector paths. Check what your logo actually contains before assuming
an `.svg` extension means it is small or drawable.)*

### 5.2 Shapes are declared in DRAW ORDER, not file order

```ts
const MARK_SHAPES: { d: string; fill: string }[] = [
  { fill: "#1B273C", d: "m75 21c-25.4…" },   // 1  enclosing ring
  { fill: "#6D8FB4", d: "m67.1 103.9…" },    // 2  inner arc (left)
  { fill: "#6D8FB4", d: "m82.9 103.9…" },    // 3  inner arc (right)
  …
  { fill: "#688BB1", d: "m75 107.9…" },      // 12 centre dot — LAST
];
```

Order the array the way a person would *draw* the emblem: enclosing shape first,
then the large interior forms, then fine detail, then the single accent last. In
our source file the centre dot was the 4th element — animating in file order put
the visual full-stop in the middle of the sentence.

### 5.3 `pathLength={1}` is the trick that makes this maintainable

```jsx
{MARK_SHAPES.map((shape, i) => (
  <path
    key={i}
    d={shape.d}
    pathLength={1}
    style={{ "--mark": shape.fill } as CSSProperties}
  />
))}
```

`pathLength={1}` tells the browser to *pretend* the path is 1 unit long,
whatever its real geometry. That means **one** CSS rule — `stroke-dasharray: 1;
stroke-dashoffset: 1` — drives every shape regardless of size or complexity.

Without it you must measure each path (`getTotalLength()`, i.e. JavaScript) or
hardcode a per-path length that silently desynchronises the moment anyone edits
the artwork.

Two gotchas:
- Use `<path>` for everything. `pathLength` support is reliable on `path` and
  patchier on `polygon`/`polyline`. Convert them:
  `points="74.2 99 74.2 104.5 …"` → `d="M74.2 99 L74.2 104.5 … Z"`.
- Scope your selector (`.intro-mark path`). We had an unrelated button component
  also using `pathLength="1"` for a hover border-draw.

### 5.4 Per-shape colour via a CSS custom property

Each shape has a different fill, but they share one keyframe. You cannot write
twelve keyframes for twelve colours — so the colour is passed *in* as `--mark`,
and the shared keyframe animates *to* `var(--mark)`.

The same variable drives the stroke, so the drawn outline is the colour the
shape is about to become. The line doesn't sit *on* the shape; it *becomes* it.

### 5.5 Draw, then flood

```css
.intro-mark path {
  fill: transparent;
  stroke: var(--mark);
  stroke-width: 0.9;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation:
    intro-mark-draw 900ms cubic-bezier(0.4, 0, 0.25, 1) var(--d) both,
    intro-mark-fill 700ms cubic-bezier(0.24, 0.43, 0.15, 0.97) calc(var(--d) + 550ms) both;
}

@keyframes intro-mark-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

@keyframes intro-mark-fill {
  from { fill: transparent; stroke-opacity: 1; }
  to   { fill: var(--mark); stroke-opacity: 0; }
}
```

Three things are happening:

1. **Two animations on one element**, comma-separated, with different delays.
2. **`--d` is the per-shape delay**, and the fill is offset from *that same
   variable* (`calc(var(--d) + 550ms)`). So each shape draws and then fills as a
   unit. The alternative — all shapes draw, then all shapes fill — reads as two
   separate mechanical passes rather than one act of drawing.
3. **`stroke-opacity: 1 → 0` as the fill arrives.** Without it the stroke stays
   and every shape carries a permanent heavier rim.

The stagger is a plain `nth-child` ladder:

```css
.intro-mark path:nth-child(1)  { --d: 300ms; }
.intro-mark path:nth-child(2)  { --d: 405ms; }   /* +105ms each */
…
.intro-mark path:nth-child(12) { --d: 1500ms; }  /* +150 — extra beat for the accent */
```

Twelve lines of CSS instead of a JS stagger. If your mark has a different shape
count, regenerate this ladder — that is the one place the CSS knows the artwork.

### 5.6 The container settle

```css
.intro-logo { animation: intro-logo-settle 2800ms cubic-bezier(0.24,0.43,0.15,0.97) both; }
@keyframes intro-logo-settle { from { transform: scale(0.94); } to { transform: scale(1); } }
```

Runs the full length of the draw underneath it, so the mark drifts *forward*
while assembling. Subtle — 6% — and it stops the sequence feeling like a
sticker being built in a flat plane.

---

## 6. The rest of the stage

**Wordmark** — mask wipe-up. A parent with `overflow: hidden`, a child starting
at `translateY(112%)`. The 112% (not 100%) clears descenders and the
`padding-bottom: 0.06em` on the mask.

**The rule** — a 1px bar, `transform: scaleX(0)` → `1`, `transform-origin: left`.
This is the psychological progress bar. Two rules learned:

- **Near-linear easing.** `cubic-bezier(0.4, 0, 0.25, 1)`. Ease it *out* and a
  progress line looks like it is stalling.
- **ONE line event only.** An earlier version drew a hairline and then ran a
  solid fill along the same path. On screen it read as the line loading twice.

**Subtitle** — split into `<span>`s per word so they stagger (100 ms apart)
rather than the block fading as one. `text-align: justify` +
`text-align-last: justify` makes the words fill the wordmark's width exactly,
which is why they are separate inline-blocks separated by real spaces.

---

## 7. The timing system

This is the part that bites when you change the duration.

```
   0 → 3400   mark settles 0.94 → 1
 300 → 2040   9 lotus shapes draw, staggered 105ms
 850 → 2390   each shape's fill floods, 550ms behind its own draw
2250 → 3350   the KEY descends into the centre and turns as it seats
3150 → 3570   its terminus pulses once — the click
3400 → 4220   wordmark rises
4100 → 5020   subtitle words stagger in
4350 → 7150   the rule draws  ← ends EXACTLY at the lift
7150 → 8000   curtain lifts + edge flattens
```

**Split the mark by MEANING, not by geometry.** Ours is a lotus enclosing a
key, and those halves say different things — identity, and what an investment
unlocks. Animating all twelve paths on one uniform stagger said neither. So the
lotus is DRAWN (constructed, stroke by stroke) and the key ARRIVES: it descends
into the centre the petals just closed around, turns as it seats, and its tip
pulses on contact. Two verbs for two ideas. If your mark has a similar internal
split, this is the single highest-leverage change in the whole sequence.

Mechanically the key is a `<g>` so the drop, the turn and the seat are one
transform. It needs `transform-box: fill-box` with a percentage
`transform-origin`, or the origin resolves against the SVG viewport and the
group swings in from off-centre like a hinge. And scope the shared draw rule to
`.intro-mark > path` so it cannot reach inside the group — the key is filled
from the start, not drawn.

**Four places encode this, and they are one system:**

| Where | Value |
|---|---|
| `globals.css` | every `animation-delay` |
| `layout.tsx` | `tR = 7150` — must equal the lift's delay |
| `layout.tsx` | `tD = 8000` — must equal lift delay + lift duration |
| `introGate.ts` | `FAILSAFE_MS` — must be comfortably **above** `tD` |

Change one, change all four. A mismatch means the curtain lifts before its
animation finishes, or hangs after it ends.

Two deliberate joins:

- **The rule ends at exactly the moment the lift starts.** It resolves *into*
  the exit rather than stopping and leaving a pause. The wait feels telegraphed
  instead of merely over.
- **Beats overlap on purpose.** The key starts descending at 2250 while the
  lotus fills are still resolving at 2390; its tip pulses at 3150 while the drop
  is still landing at 3350; the wordmark starts at 3400 as the key settles. A
  hard gap between two beats reads as two separate animations — the overlap is
  what makes each one a handoff into the next.

> **Verify it rather than eyeballing it.** We keep a small script that parses the
> CSS delays out of `globals.css`, parses `tR`/`tD` out of `layout.tsx` and
> `FAILSAFE_MS` out of `introGate.ts`, and asserts the joins line up and the
> total is what it claims. Worth 20 lines in any project where four files have
> to agree. Note that a CSS minifier will rewrite `300ms` as `.3s` — parse the
> source, not the build output.

---

## 8. Escape hatches and accessibility

| Hatch | Behaviour |
|---|---|
| `prefers-reduced-motion: reduce` | Never plays at all. Checked in the boot script, before anything is shown. |
| Already played this session | Never plays. `sessionStorage`. |
| Any `pointerdown` / `keydown` | Switches to `exit`: a 450 ms lift, then done. |
| Boot script throws | Falls through to `skip` — page visible. |
| JS disabled entirely | SSR default is `skip` — page visible. |

The global reduced-motion block in `globals.css` (`animation-duration: 0.01ms
!important`) is a second line of defence, but the boot script check is the real
one: it means a reduced-motion user never gets a 7.5 s cover at all, rather than
getting an instant-but-still-present curtain.

The whole curtain is `aria-hidden="true"`. It is decorative; the page content
underneath is what screen readers should see.

---

## 9. The honest limitation

**This is a fixed-duration performance, not a loading indicator.** The rule that
looks like a progress bar is measuring nothing — it is a 2850 ms `scaleX`. On a
fast connection the page has been ready for 7 seconds; on a slow one it may
still be loading when the curtain lifts.

That was an accepted trade here (a brand moment on a small marketing site), but
know that you are making it. If you want it to be *real*, the shape of the
change is:

- Replace `setTimeout(finish, tD)` with a resolve driven by actual readiness
  (`document.fonts.ready`, hero image `decode()`, a data promise).
- Keep a **minimum** display time so it cannot flash on a fast connection, and a
  **maximum** so it cannot hang forever.
- The rule then needs to be JS-driven, at which point the "no JS in the critical
  path" property is weakened — so gate it: CSS animation as the default, JS only
  upgrading it if it loads in time.

---

## 10. ⚠️ Known dead code in this implementation

`lib/introGate.ts` exports `heroReady()`, `introMode()` and
`introAlreadySettled()`, and the boot script faithfully dispatches
`brahma:intro-release` and `brahma:intro-done`.

**Nothing imports any of it.** Verified 2026-08-17: zero consumers in `src/`.
The events fire into the void and `FAILSAFE_MS` guards a promise nobody awaits.

It is included in this spec because the *pattern* is sound and you will probably
want it — but **wire it up or leave it out**; do not port it dormant. The
intended use is for below-the-curtain content to hold its entrance animation
until the curtain starts lifting:

```ts
useEffect(() => { heroReady().then(() => setCanAnimate(true)); }, []);
```

The design detail worth copying is `introAlreadySettled()`: it checks the
`data-intro-released` **attribute** as well as listening for the event, so a
component that mounts *after* the event fired still resolves immediately instead
of hanging until the failsafe. Event-only coordination has a race; the attribute
is the durable record.

---

## 11. Porting checklist

**Keep as-is (these are the load-bearing decisions):**

- [ ] SSR default `data-intro="skip"`, flipped to `play` by the boot script
- [ ] Outer `try/catch` → `skip`
- [ ] Inline boot script in `<head>`, never external
- [ ] Inline SVG mark, never an `<img>`/`<Image>`
- [ ] `pathLength="1"` + `stroke-dasharray: 1`
- [ ] Scroll lock as a separate attribute from the state value
- [ ] `sessionStorage` (not `localStorage`), reduced-motion check, click-to-skip
- [ ] Idempotent `release()` / `finish()`

**Change per project:**

- [ ] `MARK_SHAPES` — your paths, reordered into draw order
- [ ] The `nth-child` delay ladder — regenerate for your shape count
- [ ] `tR` / `tD` / `FAILSAFE_MS` / every `animation-delay` — as one system
- [ ] Colours: `.intro-fill` background, `--mark` per shape, text colours
- [ ] `EDGE_SAG` curve depth (`Q50 40` — raise for a deeper sag)
- [ ] The storage key namespace (`brahma:intro-played`)
- [ ] Fonts in `.intro-word` / `.intro-sub`

**Decide deliberately:**

- [ ] Fixed timer vs real readiness (§9)
- [ ] Whether to wire up `introGate` or drop it (§10)
- [ ] Whether a lockup (wordmark + rule + subtitle) suits your brand, or the
      mark alone is enough — the wordmark is what fills seconds 3–6

**Framework notes.** Nothing here is React-specific except where the markup is
authored. The boot script is vanilla; the CSS is vanilla; `Intro.tsx` is a
static tree. In Astro/Svelte/Vue/plain HTML the only change is how you emit the
`<script>` and the SVG. Do not reach for GSAP/Framer for the reveal: they are JS
chunks, a JS chunk is a network fetch, and a fetch can lose the race against a
fixed timer — the exact failure that forced the mark inline in the first place.
