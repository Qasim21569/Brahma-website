"use server";

import { revalidatePath, updateTag } from "next/cache";
import { CONTENT_CACHE_TAG } from "@/lib/supabase/public";
import { redirect } from "next/navigation";
import { getEditor } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { findSection } from "@/content/registry";
import { validateValues, type ValidationIssue } from "@/content/fields";
import {
  propertyFields,
  valuesToPropertyData,
  SLUG_RE,
  type PropertyFormValues,
} from "@/content/propertyFields";
import { properties as seedProperties, type Property } from "@/data/properties";

/**
 * Every write the admin makes goes through here. Each action:
 *   1. re-checks the editor (never trusts that the page was protected);
 *   2. validates against the schema — the stored JSON is whatever the schema
 *      says, never whatever the browser sent;
 *   3. writes under the editor's own session, so row-level security applies;
 *   4. rebuilds the public pages so the change is live on the next visit.
 */

export type ActionResult =
  | { ok: true; warnings?: ValidationIssue[]; message?: string }
  | { ok: false; message: string; issues?: ValidationIssue[] };

async function editorOrError() {
  const result = await getEditor();
  if (result.status !== "ok") {
    return { error: { ok: false as const, message: "Your session has ended. Sign in again." } };
  }
  return { supabase: result.supabase, editor: result.editor };
}

/**
 * Regenerate the public site. Every page reads shared content (navbar contact
 * routes, footer, portfolio counts), so a targeted revalidation would miss
 * pages; the whole tree is 22 static routes and rebuilds in seconds.
 */
function publish() {
  // Expire the cached content reads first, then the rendered pages — either
  // alone can leave a page rebuilt from stale data.
  updateTag(CONTENT_CACHE_TAG);
  revalidatePath("/", "layout");
}

const dbError = (what: string, message: string): ActionResult => ({
  ok: false,
  message: `Could not ${what}: ${message}`,
});

// ── Page sections ───────────────────────────────────────────────────────────

export async function saveSection(key: string, submitted: unknown): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  const section = findSection(key);
  if (!section) return { ok: false, message: `Unknown section "${key}".` };

  const { values, issues } = validateValues(section.fields, submitted);
  const errors = issues.filter((i) => i.level === "error");
  if (errors.length) return { ok: false, message: "Fix the highlighted fields.", issues };

  const { error } = await auth.supabase
    .from("site_content")
    .upsert({ key, data: values }, { onConflict: "key" });
  if (error) return dbError("save", error.message);

  publish();
  return { ok: true, warnings: issues.filter((i) => i.level === "warning") };
}

/** Delete the saved row, so the section falls back to the shipped copy. */
export async function resetSection(key: string): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;
  if (!findSection(key)) return { ok: false, message: `Unknown section "${key}".` };

  const { error } = await auth.supabase.from("site_content").delete().eq("key", key);
  if (error) return dbError("reset", error.message);

  publish();
  return { ok: true, message: "Restored the original wording." };
}

// ── Properties ──────────────────────────────────────────────────────────────

/**
 * At least one property must stay published. The public read path treats an
 * empty result as "not imported yet" and serves the repo portfolio — so
 * hiding or deleting the last visible property would bring all twelve
 * originals back onto the live site.
 */
async function isLastPublished(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  slug: string,
): Promise<boolean> {
  const { data } = await supabase.from("properties").select("slug").eq("published", true).limit(2);
  return (data ?? []).length === 1 && data![0].slug === slug;
}

const LAST_PUBLISHED_MESSAGE =
  "At least one property must stay visible on the site. Publish another one first.";

function validateProperty(submitted: unknown) {
  const { values, issues } = validateValues(propertyFields, submitted);
  if (values.amenitiesMode === "custom" && values.amenities.length === 0) {
    issues.push({
      path: "amenities",
      level: "error",
      message: "Add at least one amenity, or switch the source back to Google.",
    });
  }
  return { values: values as PropertyFormValues, issues };
}

export async function saveProperty(slug: string, submitted: unknown): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  const { values, issues } = validateProperty(submitted);
  if (issues.some((i) => i.level === "error"))
    return { ok: false, message: "Fix the highlighted fields.", issues };

  const { data: row, error: readError } = await auth.supabase
    .from("properties")
    .select("data")
    .eq("slug", slug)
    .maybeSingle();
  if (readError) return dbError("load the property", readError.message);
  if (!row) return { ok: false, message: "That property no longer exists." };

  const data = valuesToPropertyData(values, row.data as Partial<Property>);
  const { error } = await auth.supabase.from("properties").update({ data }).eq("slug", slug);
  if (error) return dbError("save", error.message);

  publish();
  return { ok: true, warnings: issues.filter((i) => i.level === "warning") };
}

export async function createProperty(
  slug: string,
  submitted: unknown,
): Promise<ActionResult & { slug?: string }> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  if (!SLUG_RE.test(slug)) {
    return {
      ok: false,
      message: "The web address may only use lowercase letters, numbers and single hyphens.",
    };
  }

  const { values, issues } = validateProperty(submitted);
  if (issues.some((i) => i.level === "error"))
    return { ok: false, message: "Fix the highlighted fields.", issues };

  const { data: last } = await auth.supabase
    .from("properties")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await auth.supabase.from("properties").insert({
    slug,
    position: (last?.position ?? 0) + 10,
    published: false,
    data: valuesToPropertyData(values),
  });
  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "A property already uses that web address. Choose another." };
    }
    return dbError("create the property", error.message);
  }

  publish();
  return { ok: true, slug, message: "Created as hidden. Publish it when it is ready." };
}

export async function setPropertyPublished(slug: string, published: boolean): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  if (!published && (await isLastPublished(auth.supabase, slug))) {
    return { ok: false, message: LAST_PUBLISHED_MESSAGE };
  }

  const { error } = await auth.supabase.from("properties").update({ published }).eq("slug", slug);
  if (error) return dbError("update", error.message);

  publish();
  return { ok: true, message: published ? "Now visible on the site." : "Hidden from the site." };
}

/** Swap with the neighbour above or below in display order. */
export async function moveProperty(slug: string, direction: "up" | "down"): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  const { data: rows, error } = await auth.supabase
    .from("properties")
    .select("slug, position")
    .order("position", { ascending: true })
    .order("slug", { ascending: true });
  if (error) return dbError("reorder", error.message);

  const i = rows.findIndex((r) => r.slug === slug);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= rows.length) return { ok: true };

  // Rewrite positions as a clean 10-step sequence with the pair swapped, so
  // duplicate or gappy positions from earlier edits are healed as a side effect.
  const order = rows.map((r) => r.slug);
  [order[i], order[j]] = [order[j], order[i]];
  const changed = order
    .map((s, idx) => ({ slug: s, position: (idx + 1) * 10 }))
    .filter((r) => rows.find((x) => x.slug === r.slug)?.position !== r.position);

  for (const r of changed) {
    const { error: e } = await auth.supabase
      .from("properties")
      .update({ position: r.position })
      .eq("slug", r.slug);
    if (e) return dbError("reorder", e.message);
  }

  publish();
  return { ok: true };
}

export async function deleteProperty(slug: string, confirmName: string): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  const { data: row } = await auth.supabase
    .from("properties")
    .select("data")
    .eq("slug", slug)
    .maybeSingle();
  const name = (row?.data as Partial<Property> | undefined)?.shortName ?? "";
  if (!row || confirmName.trim() !== name) {
    return { ok: false, message: `Type the property's short name exactly ("${name}") to confirm.` };
  }
  if (await isLastPublished(auth.supabase, slug)) return { ok: false, message: LAST_PUBLISHED_MESSAGE };

  const { error } = await auth.supabase.from("properties").delete().eq("slug", slug);
  if (error) return dbError("delete", error.message);

  publish();
  redirect("/admin/properties?deleted=1");
}

/**
 * One-time import of the portfolio that shipped in the repo
 * (`src/data/properties.ts`) into an empty table. Refuses if anything is
 * already there, so it can never overwrite edits.
 */
export async function importSeedProperties(): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  const { count, error: countError } = await auth.supabase
    .from("properties")
    .select("slug", { count: "exact", head: true });
  if (countError) return dbError("check the portfolio", countError.message);
  if ((count ?? 0) > 0) {
    return { ok: false, message: "The portfolio has already been imported." };
  }

  const rows = seedProperties.map((p, i) => {
    const { slug, ...data } = p;
    return { slug, position: (i + 1) * 10, published: true, data };
  });
  const { error } = await auth.supabase.from("properties").insert(rows);
  if (error) return dbError("import", error.message);

  publish();
  return { ok: true, message: `Imported ${rows.length} properties.` };
}

// ── History ─────────────────────────────────────────────────────────────────

export async function restoreRevision(id: number): Promise<ActionResult> {
  const auth = await editorOrError();
  if ("error" in auth) return auth.error!;

  const { data: rev, error } = await auth.supabase
    .from("content_revisions")
    .select("table_name, record_key, data")
    .eq("id", id)
    .maybeSingle();
  if (error) return dbError("load that version", error.message);
  if (!rev) return { ok: false, message: "That version no longer exists." };

  const old = rev.data as Record<string, unknown>;

  if (rev.table_name === "site_content") {
    const { error: e } = await auth.supabase
      .from("site_content")
      .upsert({ key: rev.record_key, data: old.data }, { onConflict: "key" });
    if (e) return dbError("restore", e.message);
  } else {
    const { error: e } = await auth.supabase.from("properties").upsert(
      {
        slug: rev.record_key,
        position: old.position,
        published: old.published,
        data: old.data,
      },
      { onConflict: "slug" },
    );
    if (e) return dbError("restore", e.message);
  }

  publish();
  return { ok: true, message: "Restored. The version it replaced is now in the history too." };
}

// ── Session ─────────────────────────────────────────────────────────────────

export async function signOut() {
  // Not gated on editor status — a signed-in non-editor must be able to leave.
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
