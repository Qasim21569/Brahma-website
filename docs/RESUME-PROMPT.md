# RESUME-PROMPT — how to pick this project up anywhere

> For starting a fresh session, in this tool or another (Cursor, ChatGPT, a
> colleague). Attach the files listed below, paste the prompt, done.
> **Last updated:** 2026-08-17

---

## Which files to attach, in this order

| # | File | Why |
|---|---|---|
| 1 | `docs/HANDOFF.md` | Current state. What's done, next, blocked. **Always attach.** |
| 2 | `docs/BUILD-PLAYBOOK.md` | The design grammar + Section Recipe + defect table + phase list. **Always attach.** |
| 3 | `docs/MASTER-PLAN.md` §2 | Locked decisions D1–D11. Attach when the task touches design direction. |
| 4 | `docs/PHOTO-PIPELINE.md` | Attach **only** for imagery / property-data work. |

For a typical build task, **1 + 2 is enough.** Don't attach the whole `docs/`
folder — `docs/archive/` is obsolete and actively misleading.

Also worth attaching, if the task touches them:

- `src/data/properties.ts` — the 12 assets and the enrichment overlay
- `src/data/company.ts` — founder narrative, team, affiliated entities
- `src/app/page.tsx` — the reference implementation of the grammar
- `src/components/ui/MaskText.tsx` — the single most-used component

---

## The prompt

```
You are continuing work on the BRAHMAS website (Brahmas Management and
Investment Group) — a Florida hotel and real-estate investment company with 12
operating assets: 10 hospitality, 1 school, 1 residence.

Stack: Next 16 (App Router, Turbopack) · React 19 · Tailwind v4 via the @config
bridge · Motion v12 · Lenis · GSAP · TypeScript. Work in brahma-web/.

Read the attached docs/HANDOFF.md first for current state, then
docs/BUILD-PLAYBOOK.md for the design grammar (§2), the Section Recipe (§3), the
open defects (§4) and the phase list (§5).

RULES — these have all been learned the hard way:

1. I do ALL visual and browser testing. Never use preview, screenshot, or
   browser tools. Verify with `npx tsc --noEmit` and `npx next build`, and by
   reading source. To confirm something renders server-side, grep
   .next/server/app/<route>.html.
2. `npx next build` must stay at 22 routes unless you deliberately add a page.
3. Follow the Section Recipe in BUILD-PLAYBOOK §3 for EVERY new section. The
   homepage (src/app/page.tsx) is the reference implementation — match it.
4. Every headline AND every body paragraph reveals line by line via <MaskText>
   with HAND-SET line arrays. Never <p> inside <Reveal> for body copy. Keep
   lines under ~45 characters or they re-wrap and ruin the rag.
5. One easing everywhere: [0.24, 0.43, 0.15, 0.97]. Durations 0.6–0.8s.
6. Every dark section sets bg-* AND text-* explicitly. Never inherit colour
   across a light/dark boundary.
7. No page-level max-w-* container. Sections are full-bleed, inset only by
   px-margin-edge. Constrain text blocks, never sections.
8. No bold anywhere. Weights 300/400/500 only. Type sizes come from the --t-*
   variables in globals.css — never hardcode, and to resize edit those
   variables rather than the Tailwind config.
9. Never return null from a viewport-branching component — render desktop
   server-side and swap after hydration, or crawlers see nothing.
10. Delete dead code immediately. Orphaned files and dead data-* attributes have
    repeatedly broken this project.
11. Don't publish invented figures. Numbers must derive from src/data/*.ts or
    the cited LODGING Magazine article. No financial figures.
12. Locked decisions are MASTER-PLAN §2 (D1–D11). Don't re-litigate them.
13. I'm tight on tokens. Don't re-analyse the reference codebases in the parent
    folder; the extracted patterns are already in BUILD-PLAYBOOK §2.

Elementis-SOTD (../Elementis-SOTD/, read-only) is the primary design reference —
we copy its patterns near-verbatim rather than inventing. Everything else in the
parent folder is a read-only reference codebase.

Start with: <YOUR TASK HERE>
```

---

## Filling in the last line

**Check HANDOFF's "The client's own to-do list" first** — that table is the
live priority order and supersedes the phase numbering. As of 2026-08-13 the
next unblocked items are:

- `Start with: to-do #5 — Portfolio page hero and desktop view images rework.`
- `Start with: to-do #9 — Mobile navbar rework (components/layout/Navbar.tsx).`
- `Start with: to-do #7 — Bottom CTA and footer rework (also Phase E5).`

Or point it at a phase from BUILD-PLAYBOOK §5:

- `Start with: BUILD-PLAYBOOK §5 Phase E4 — legal pages.`
- `Start with: defect D-9 in BUILD-PLAYBOOK §4 — wire the remaining unused photos in public/site-photos/ into the two existing galleries.`

---

## Verification commands, for any session

```bash
npx tsc --noEmit          # types
npx next build            # must stay at 22 routes
npm run enrich:check      # offline checks on the enrichment script
```

If `next build` fails with repeated `Error while requesting resource`, that is
`next/font` failing to reach Google — transient network, not your change. Retry.

---

## Things a fresh session reliably gets wrong

- Reintroducing a `max-w-*` page container. Don't.
- Rebuilding the split hero. `HeroSplit.tsx` was deleted on purpose (D11).
- Using `<p>` for body copy instead of hand-broken `MaskText`.
- Trusting a green local build as proof images work — see D-7 in the defect
  table for why that was false for months.
- Renaming the two intentionally-mismatched slugs
  (`clarion-pointe-tampa-brandon`, `hampton-inn-tampa-veterans-expwy`).
  Photography lives at those paths. Do not rename.
- Assuming all 12 properties have images. **Ten do not.** Use
  `featuredProperties` where an image is required, and
  `ownPhotographyProperties` for chrome with no credit slot.
- **Redesigning `SectionTitle`.** It went through **five** treatments in one
  day and is now settled. Before touching it, read its file header — every
  rejected version and the reason is listed there. In particular:
  · no `w-full` / `flex-1` rule (reads as a flow diagram, and breaks
    `SelectedWork`'s centre card)
  · **no numbering of any kind** — the client rejected `( 01 )` outright
  · the label must NOT be the same colour as the headline it introduces;
    that's why it's fixed `text-muted-azure`.
- **Deleting `sections/ThresholdReveal.tsx` as an orphan.** It is built,
  verified, and deliberately commented out in `services/page.tsx` — the
  client is staging what they reveal, not rejecting it. Do not remove it;
  re-enabling is uncommenting one import and one block.
- **Adding a second pass over an already-drawn line** (e.g. a fill animation
  chasing a rule that already drew). Reads as "the line loading twice" —
  happened in the preloader. One line, one event, done.
- Publishing anything in `src/data/contact.ts` as fact. Every value there is
  flagged `CONTACT_DETAILS_UNCONFIRMED = true` for a reason — the page it
  replaced had invented offices and a phone number in the range reserved for
  fiction. Same caution applies to `company.ts` affiliate `sector`/
  `description` fields — inferred from entity names, not confirmed.
