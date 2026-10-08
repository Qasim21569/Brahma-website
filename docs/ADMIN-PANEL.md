# ADMIN PANEL — how it works, and how to switch it on

> **Owner doc for the editable-content system** (`/admin`, `src/content/`,
> `supabase/`). Built 2026-10-03 on branch `feature/admin-panel`.
> Sits **outside** the HANDOFF precedence chain, like `PHOTO-PIPELINE.md` is
> the owner doc for imagery; HANDOFF records *state*, this records *how*.
> The option analysis that led here is `ADMIN-PANEL-OPTIONS.md` (now history).

---

## 1. Switching it on — the runbook

Nothing below needs a developer machine except step 4's `.env.local`.

### 1.1 Apply the database migrations — ✅ DONE 2026-10-03

Applied to `dynxjlgdoftzgfsuezwc` via the Supabase MCP. The three files in
`supabase/migrations/` match the project's migration history exactly:
`admin_panel` (tables, RLS, revision trigger, `media` bucket),
`private_is_editor` (moves the RLS helper out of the public API — security
advisor lint 0028/0029 — and indexes the audit FKs), and
`revoke_anon_private_tables`. Security advisor: 0 findings afterwards.
Verified from outside with the publishable key: anonymous reads of content
work; anonymous writes, uploads, `editors`, `content_revisions` and
`rpc/is_editor` are all refused.

`revoke_anon_content_writes` (2026-10-03, later the same day) removes the
default anon INSERT/UPDATE/DELETE/TRUNCATE grants on `site_content` and
`properties` — RLS already refused them, and TRUNCATE is not covered by RLS.
Probed afterwards as anon: reads work, update and truncate are refused.

For a fresh project, run the files in filename order.

### 1.2 Lock down sign-up

Dashboard → **Authentication → Sign In / Providers → Email**:
turn **off** "Allow new users to sign up". Signing up would not grant edit
rights anyway (see §3.3), but there is no reason to allow accounts to exist.

### 1.3 Create the editors

Dashboard → **Authentication → Users → Add user → Create new user**, with
**Auto Confirm User** ticked. Give the person a temporary password; they change
it under *Your account* in the admin.

Then grant access — signing in is not enough on its own:

```sql
insert into public.editors (user_id, email, role)
select id, email, 'admin' from auth.users where email = 'person@example.com';
-- role is 'admin' or 'editor'; both can edit everything today.
```

To remove someone: `delete from public.editors where email = '…';` (their
login then lands on "This account cannot edit the website").

⚠️ **Do not rely on emailed invites or password-reset links.** Supabase's
built-in mailer only delivers to members of the Supabase organisation, and is
rate-limited to a few per hour. Create users with a password as above; if one
is forgotten, set a new one from the dashboard. Configure custom SMTP later if
self-service reset is wanted.

### 1.4 Environment variables

| Name | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` **and** Vercel | `https://dynxjlgdoftzgfsuezwc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.local` **and** Vercel | Dashboard → Project Settings → API Keys → *publishable* (or the legacy *anon*) key |
| `CRON_SECRET` | Vercel only | any long random string |

Template: `.env.example`. **Never** add the service-role key — the app does not
use one, by design. Write `.env` files as UTF-8 (HANDOFF: the UTF-16 trap).

### 1.4b Password rules

Dashboard → **Authentication → Providers → Email** (or *Auth → Policies*):
set **minimum password length to 10**. The admin's change-password form
already asks for 10, but Supabase itself accepts 6 unless told otherwise.
*Leaked password protection* (HaveIBeenPwned) needs Supabase Pro — the only
remaining security-advisor warning on the free plan.

### 1.5 Deploy, then import the portfolio

Deploy. Sign in at **`/admin`**. The dashboard shows a one-time banner:
**Import the 12 properties from the website**. That copies `src/data/properties.ts`
into the database. It refuses to run if the table already has rows, so it can
never overwrite edits.

Until the import is done the site keeps showing the built-in portfolio, so
deploying before importing is safe.

### 1.6 Check the keep-alive

`vercel.json` schedules `GET /api/keepalive` daily at 06:17 UTC. After the
first day, Vercel → Project → **Cron Jobs** should show a 200. This is what
stops the free Supabase project pausing after a quiet week (§4.2).

---

## 1.7 Before handing over — checklist

- [ ] Only real people in `editors` (`node scripts/editors.mjs list`). Remove
      test or placeholder accounts with `remove <email> --delete-account`.
- [ ] Public sign-up off (§1.2); minimum password length 10 (§1.4b).
- [ ] One image uploaded, placed in a section, visible on the live site.
- [ ] One property edited, one hidden then re-published, order changed.
- [ ] One change restored from History.
- [ ] Vercel → Cron Jobs shows `/api/keepalive` returning 200.
- [ ] Vercel and Supabase accounts owned by (or transferred to) the client.
- [ ] Backup plan agreed (§4.4).

## 2. What the client can edit

| Area | Where in the admin | Notes |
|---|---|---|
| Every page's copy | Pages → Home / About / … | One card per section. Headings and paragraphs are edited **line by line** — each line in the box is one animated line on the page. |
| Browser-tab titles + search descriptions | each page's *Opening* card (Privacy/Terms: their *Page title*) | The site name is appended automatically. The home page title is brand, not content. |
| Repeatable cards | the list inside a card (FAQ, pillars, team, process stages, links…) | Add, remove, reorder (↑ ↓). Lists whose layout has a fixed shape carry a min/max, enforced in the editor. |
| Section images | the same cards | Upload (auto-resized), pick a previous upload, alt text, optional credit. |
| Founder, team, construction partner | Shared → Company | Used across About, Careers, Services. |
| Contact emails, region, form topics, footer tagline, site description | Shared → Site settings | Feeds navbar drawer, footer, Contact, Careers, legal pages. |
| Properties | Properties | Add, edit, reorder, hide/publish, delete. Gallery, cover, amenities, extra facts. |
| Undo | History | Every save and delete keeps the previous version; one click restores it. |

**Guard:** the last visible property cannot be hidden or deleted — an empty
public portfolio would otherwise fall back to the twelve shipped properties.

**Not editable, by decision ("content slots only"):** layout, section order,
animation, colours, the logo, navigation links, stats *figures* (derived — only
their labels are editable), the intro preloader.

**Live numbers.** Copy can contain `{assetCount}`, `{assetCountWord}`,
`{assetClassCount}`, `{assetClassList}`, `{year}`; the site fills them from the
published portfolio, so hiding a property updates every sentence that counts
them. This keeps the "figures are derived, never typed" rule (defect D-1) true
for client-written copy.

---

## 3. Architecture

### 3.1 Content model — defaults in code, edits in the database

- `src/content/fields.ts` — the field system (text, lines, image, gallery,
  list, …), validation, and `resolveValues()`.
- `src/content/sections/*.ts` — every editable section, **with the copy the site
  shipped with as its defaults.** This is the content audit, expressed as code.
- `public.site_content` stores **only what an editor saved**, one row per
  section. Read path: defaults ← saved values ← tokens. So:
  - an untouched section renders exactly the shipped copy;
  - **adding a field later needs no migration** — it just has a default;
  - a malformed stored value degrades that one field to its default.
- "Restore original" deletes the row (the deleted version goes to History).

**To make something new editable:** add a field to its section in
`src/content/sections/`, read it in the page via `getSection()`. To add a whole
section: `defineSection(...)`, add it to the page's array — the admin picks it
up automatically.

### 3.2 Properties

`public.properties` is authoritative once imported: `slug` (the URL and photo
path — **immutable**), `position`, `published`, and `data` (the `Property`
record). The read path (`src/content/server.ts → getPortfolio()`) applies the
**same Google Places overlay as before** (`enrich()` in `data/properties.ts`),
with the same rule: **a value set in the admin always wins over Google.**
Concretely, an empty gallery shows the Places photos; adding your own photos
replaces them. Amenities work the same way via the "Google / Custom" switch.

**Photos live in Supabase Storage (since 2026-10-08).** `npm run photos:migrate`
copied every property photo — the 60 downloaded Places photos and the two
hand-authored galleries, 74 photos + 1 cover, 17 MB — from `public/properties/`
into the `media` bucket and wrote them into each property's gallery, in the
order and with the alt text and credit the site already showed. So every photo
is now individually editable in the admin (reorder, remove, re-caption,
replace), and the Places overlay no longer supplies any gallery. The repo copies
in `public/properties/` stay as the seed/offline fallback; do not delete them.

`src/data/properties.ts` is now the **seed and offline fallback**, not the live
source. Editing it changes nothing on a connected site.

### 3.3 Security — three layers

1. **Proxy** (`src/proxy.ts`, `/admin` only): refreshes the session, bounces
   signed-out visitors. Optimistic only.
2. **`requireEditor()`** in every admin page and every server action: signed
   in **and** listed in `public.editors`.
3. **Row-level security** in Postgres: anonymous = read published content;
   writes require `is_editor()`. Even a bug in layers 1–2 cannot write.

Plus: every save is validated against the schema server-side, and only schema
fields are stored (no arbitrary JSON). Links must be `/`, `#`, `https://`,
`mailto:` or `tel:`. Images must be site files or this project's uploads (no
hotlinking — D-10). No service-role key exists anywhere in the app.

### 3.4 Rendering — the public site stays static

Public pages read Supabase with an anonymous, **cookie-less** client at build
time, so all 22 routes stay prerendered (○/●). Saving in the admin calls
`revalidatePath("/", "layout")`; pages regenerate on their next visit. Visitors
never wait on the database.

### 3.5 Failure policy

| Situation | Behaviour |
|---|---|
| Supabase env vars absent | Site renders the shipped defaults (developer machine). Admin login explains it is not connected. |
| Env present, query fails (paused project, wrong key, missing table) | **Build / regeneration fails loudly**; Vercel keeps serving the last good version. Falling back to defaults here would silently revert the client's edits. |
| `properties` table empty | Serves the repo portfolio — the pre-import state. |

### 3.6 Route layout

Public pages moved into the `app/(site)/` route group (URLs unchanged). Its
layout holds the intro curtain, Lenis and MotionConfig, so `/admin` gets none
of them. The intro boot script stays in the root `<head>` (it must run before
first paint) and now skips itself on `/admin`.

---

## 4. Operations

### 4.1 Free-tier limits that matter

| Limit | Exposure here |
|---|---|
| Pauses after 1 week inactive | Covered by the daily keep-alive (§1.6). |
| 1 GB storage / 5 GB egress | Uploads are resized in the browser to ≤2560 px WebP (~0.3–0.7 MB). Images are served through Vercel's image optimizer, which caches, so Supabase egress is only cache misses. |
| 500 MB database | Content is a few hundred KB. Revisions grow with every save — prune if it ever matters: `delete from content_revisions where edited_at < now() - interval '1 year';` |

**Vercel Hobby is non-commercial** — a client site needs Vercel Pro.

### 4.2 If the project ever pauses anyway

Symptoms: admin login fails; a deploy fails at "Generating static pages" with
*Could not load site content from Supabase*. The live site keeps working (it is
static). Fix: Supabase dashboard → project → **Restore**. Then check the cron.

### 4.3 Enrichment script

`scripts/enrich-properties.mjs` still reads slugs and addresses from
`src/data/properties.ts` and writes `places.generated.json`, which the read path
still overlays — but since the photo migration every property has its own
gallery, so a re-run can only affect phone/booking link/coordinates/amenities
where the admin has none, never photos. To push newly fetched photos into the
admin, run `npm run photos:migrate` afterwards *on a property whose gallery you
first empty* — it never overwrites a gallery that is already in Storage. **Open decision** (ADMIN-PANEL-OPTIONS §6): keep running it, or
treat the Places data as frozen. Note a property added in the admin is unknown
to the script until it is also added to `properties.ts`.

### 4.3b Photo migration script

```bash
npm run photos:migrate              # dry run — lists what would move, changes nothing
npm run photos:migrate -- --apply   # upload to Storage + write galleries
```

Needs `SUPABASE_SECRET_KEY` in `.env.local` (local only). Idempotent: files
already in Storage are skipped and a property whose photos are all in Storage
is left alone. Every record it changes keeps its previous version in History.
Writes made by this script (or any SQL) do **not** revalidate the live site —
redeploy, or save anything in the admin, to publish.

### 4.4 Backups

The free plan takes **no backups**. History covers bad edits, not a lost
project. Either move to Supabase Pro (daily backups, 7 days), or export now
and then: Dashboard → Table Editor → `site_content` / `properties` → *Export
to CSV*, and download the `media` bucket from Storage.

---

## 5. Verification

```bash
npx tsc --noEmit          # types
npm run content:check     # 60 offline checks: defaults valid, property round-trip lossless
npx next build            # public routes must stay ○/● ; admin routes ƒ
npm run enrich:check      # enrichment parser still reads properties.ts
```

`content:check` is the one to run after touching `src/content/`: it proves every
section's defaults validate (so an untouched section can always be saved), and
that every real property survives *open in editor → save* unchanged.
