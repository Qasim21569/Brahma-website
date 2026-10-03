# ADMIN PANEL — OPTIONS AND BUILD PLAN

> **Status: DECIDED 2026-10-03 — Supabase + a custom panel (Option C).** The
> user chose it, with Supabase's free tier, after this analysis. What was built
> is documented in **ADMIN-PANEL.md**; this file is now the decision record.
> The pause risk raised in §4 is handled by a daily keep-alive cron.
>
> Originally: a decision document, not a plan of
> record. It captures the options for making the site client-editable, the
> hosting economics behind each, and the work that can start before the choice
> is made.
>
> **Outside the HANDOFF precedence chain**, like `PRELOADER-SPEC.md`. It is not
> authoritative about what is shipped. When a store is chosen, the outcome gets
> recorded in `HANDOFF.md` and this file becomes history.
>
> **Last updated:** 2026-08-26

---

## 1. What was decided

| Question | Answer |
|---|---|
| Who edits | **Client staff, non-technical.** BMIG's own people, not developers. |
| What is editable | **Page/section text, property records, section images and their captions.** Effectively the whole content surface. |
| Edit depth | **Content slots only.** Locked layouts. No reordering, no hiding sections, no page builder. The design grammar (BUILD-PLAYBOOK §2) is not client-editable. |
| Account ownership | **BMIG-owned email owns Vercel and the CMS org from day one; developer added as a member.** Avoids a migration under time pressure at handover. |
| Content store | ✅ **Supabase (free tier) + custom admin** — chosen by the user 2026-10-03. |
| Enrichment's future | 🔲 **OPEN** — see §6. Deliberately parked until the property schema settles. |

---

## 2. Why this is not just "add a CMS"

The site is 22 static routes with no backend of any kind. All content is
TypeScript literals in `src/data/` — `properties.ts` (850 lines, 12 assets),
`company.ts`, `contact.ts`, `services.ts` — plus `places.generated.json` merged
at import. Images are files in `public/`. The contact form is a `mailto:`.

The content model is already typed and rich, which is a real head start. The
difficulty is that three project-specific rules are encoded in code today and
must survive the move to a store a client can write to:

1. **Hand-authored values always win over enrichment.** `properties.ts` merges
   `places.generated.json` at import so a re-run of the enrichment script cannot
   clobber approved copy. A client edit must beat the script by the same logic.

2. **Every Places-sourced photo carries a mandatory Google credit.**
   `ownPhotographyProperties` exists to keep credited images off the homepage
   hero and other surfaces with nowhere to put a credit. If the client can
   upload images, the store must carry an attribution field and the guard must
   still hold. This is a licensing obligation, not a preference.

3. **Content must stay pre-rendered.** The preloader runs on a fixed timer that
   never waits for an asset, and the motion work assumes a fast first paint.
   Fetching content per request would undo that. Every option below must build
   statically and revalidate on publish, not fetch on view.

A fourth, softer constraint: `contentStatus: "final" | "placeholder"` currently
marks 10 of 12 properties as unapproved prose. That distinction is useful to the
client and should surface in whatever admin UI is built.

---

## 3. Fixed costs, independent of the choice

**Vercel's Hobby tier is explicitly non-commercial.** This is a paid client
site, so **Vercel Pro at $20/month** is required regardless of which option is
chosen. Hosting therefore does not differentiate the options — what
differentiates them is how many *additional* services each one drags along.

---

## 4. The three options

### Option A — Sanity, Studio embedded at `/studio`

Content in Sanity's cloud. The editing UI mounts as a route inside the existing
Next app, so the client goes to `brahmagroup.com/studio` and logs in — it is not
a third-party site they visit. Schemas are TypeScript **in this repo**, so the
content model stays under version control even though the content does not.

- **Fit:** its image pipeline (CDN, hotspot/crop, transforms) directly addresses
  the area this project has lost the most time to. Custom fields can make
  attribution *required* on upload, enforcing rule 2 at the point of entry.
  Portable Text handles section copy without exposing layout.
- **Against:** content lives in a vendor's cloud. GROQ is a new query language to
  learn. One more vendor account in the handover.
- **Free tier:** 20 seats, 100GB bandwidth, 100GB asset storage, 1M CDN
  requests/month. A 12-property portfolio with ~60 photos will not approach any
  of these.
- **Cost:** **$20/mo total.** Growth is $15/seat/mo and is only needed for
  private datasets or scheduled publishing — neither is required here.
- **Effort:** ~2–3 weeks.

### Option B — Payload 3, self-hosted at `/admin`

Payload runs inside the Next app with its own admin UI, backed by Postgres.
Self-owned, and you still do not hand-build the editor.

- **Fit:** no vendor holds the content. Next-native, so it deploys to Vercel
  alongside the site. Admin UI quality is close to Sanity's.
- **Against:** you now run a database *and* a media store — file uploads on
  Vercel need S3, R2, or Supabase Storage wired separately. Heavier bundle, more
  operational surface.
- **Database choice matters:** use **Neon**, not Supabase. Supabase free projects
  are paused after 1 week of inactivity, and a build-time-fetch architecture
  leaves the database idle between deploys — precisely the condition that
  triggers a pause. Neon's free tier auto-suspends but resumes transparently on
  connect.
- **Cost:** $20–45/mo depending on database and media tiers.
- **Effort:** ~3–4 weeks.

### Option C — Supabase + a custom-built admin panel

Postgres, Supabase Auth, Supabase Storage, and an admin UI built by hand in the
site's own design language.

- **Fit:** total control. The panel can encode this project's exact rules — the
  attribution guard, enrichment precedence, the `placeholder`/`final` workflow.
  The result would look better than any off-the-shelf studio.
- **Against:** you are building auth flows, roughly 40 fields of forms,
  validation, image upload and optimization, and preview — rebuilding what the
  other two options include. Highest ongoing maintenance.
- **Cost:** $20–45/mo (Supabase Pro at $25/mo likely needed, for the pause reason
  above).
- **Effort:** ~5–7 weeks.

### Option D — git-based (Keystatic, Tina): considered and rejected

Edits commit back to the repo as JSON and trigger a rebuild. Rejected on two
grounds: it requires each client editor to hold a GitHub account, which is real
friction for non-technical staff; and client commits landing in a repo that is
still under active development is an avoidable hazard. Recorded here so it is
not re-proposed.

---

## 5. Recommendation

**Option A**, with the deciding argument being risk rather than cost.

Options B and C both make the developer responsible for an image pipeline, and
images are exactly where this project has bled: the 5.47 MB logo shipped on
every page, the enrichment script silently wiping every gallery, ~60 photos
stored with `attribution: null`, and the `Public/` → `public/` case rename that a
green local build could not catch. Sanity removes that entire category of
failure. It is also the cheapest, at two services and $20/mo.

**Option C is the one to actively avoid.** Five to seven weeks of bespoke CRUD
for twelve properties buys an admin panel that looks nicer than Sanity's. For a
brochure site, that is not a good trade.

**The legitimate case for Option B** is ownership: if BMIG or the developer feels
strongly that content must not live in a vendor's cloud, that justifies the extra
cost and effort. It is a business judgement, not a technical one, and it is the
only argument that should outweigh A.

---

## 6. Open question — the two-writer problem

The enrichment script and a CMS are two writers to the same property records.
Two ways to resolve it:

- **One-time seed (preferred).** Run enrichment once to populate the store, then
  retire the script. Client edits are final; nothing overwrites them. Simplest,
  and a client editing a property they own outright should not be second-guessed
  by Google.
- **Keep it running.** Enrichment refreshes photos and amenities into fields
  marked machine-owned and hidden from the client. Fresher data, but the merge
  precedence must be maintained indefinitely.

Deliberately deferred until the property schema is drafted (§7, step 1), because
the schema will make the cost of each obvious. Note that retiring the script does
not mean deleting it — the `--self-test` suite and the sourcing rules in its
header are the project's record of how amenities were derived.

---

## 7. Work that can start now, before the decision

Roughly the first third of this project is store-agnostic. Deferring the choice
in §4 costs very little.

1. **Content audit — define the editable surface.** Walk all 8 pages and list
   every field the client should be able to change: which headline, which body,
   which image, which caption. Produce a table of `section → field → type →
   constraints`. This is needed identically for A, B, and C, and it is the input
   to whichever schema gets written. It will also settle arguments later about
   whether a given string is content or design.

2. **Introduce a content-access layer.** Today components import literals from
   `src/data/*.ts` directly. Insert a typed interface — `src/content/` with
   getters like `getProperties()`, `getSection(page, id)` — and repoint every
   component at it, with the existing literals as the initial implementation.
   After this, swapping the backing store is a change in one directory rather
   than across the component tree. **This is the single highest-value step, and
   it is pure refactoring with no behaviour change**, so it can be verified
   against the existing build: `npx tsc --noEmit` and `npx next build` staying at
   22 routes.

3. **Set up BMIG-owned accounts and Vercel Pro.** Needs a client-owned email
   address, so it has a lead time — worth starting early. Required for every
   option.

4. **Resolve the blocked client items that block launch anyway.** Real contact
   details, the email domain, team names and headshots, affiliated-company
   sign-off (HANDOFF §"Blocked on the client"). These gate go-live regardless of
   the admin panel, and several of them are fields the client will be editing.

5. **Decide the form backend.** The contact form is a `mailto:`, which is not a
   submission pipeline. Whichever store is chosen will likely offer a home for
   submissions; worth settling alongside the CMS choice rather than after.

Steps 1 and 2 together are roughly a week, and none of it is wasted under any
option.

---

## 8. Shape of the build, once a store is chosen

Sketched at the level the decision needs; a full implementation plan follows the
choice.

1. Schema — model the content audit (§7.1) as documents. Properties as a
   collection; each page's sections as singletons. Attribution required on every
   image field.
2. Seed — migrate the 12 property records and all page copy out of
   `src/data/*.ts` into the store, preserving `contentStatus`.
3. Swap the content layer — reimplement `src/content/` against the store. No
   component changes, because of §7.2.
4. Static rendering — generate at build time, with on-demand revalidation fired
   by a publish webhook, so publishing is near-instant without per-request
   fetching.
5. Auth and roles — client editors; developer as admin.
6. Draft preview — the client sees changes before publishing.
7. Handover — a written guide, and a walkthrough with whoever will be editing.

---

## 9. Verification

Unchanged from HANDOFF, and applicable at every step above:

```bash
npx tsc --noEmit          # types
npx next build            # must stay at 22 routes
npm run enrich:check      # offline checks on the enrichment script
```

Step §7.2 in particular must leave route count and rendered output identical —
it is a refactor, and any diff in the built HTML is a defect.
