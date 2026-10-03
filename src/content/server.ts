import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import {
  adjacentIn,
  assetTypeLabels,
  enrich,
  normalizeProperty,
  properties as seedProperties,
  type Property,
} from "@/data/properties";
import { interpolateDeep, resolveValues } from "./fields";
import { sectionsByKey, type SectionKey, type ValuesFor } from "./registry";

/**
 * The public site's read path. Everything a page renders comes through here.
 *
 * ── Failure policy ──────────────────────────────────────────────────────────
 * Supabase NOT configured (no env vars): render the in-repo defaults. That is
 * a developer machine, and the defaults are the shipped site.
 *
 * Supabase configured but the query FAILS: throw. The build or the page
 * regeneration fails, and Vercel keeps serving the last good version. Falling
 * back to the defaults here would silently publish the pre-admin copy over the
 * client's edits — on a free-tier project that has paused, every deploy would
 * revert the site. A loud failure is the safe one.
 *
 * Calls are wrapped in React `cache()` so a page that reads ten sections makes
 * one query per table, not ten.
 */

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen", "Twenty",
];

const loadContentRows = cache(async (): Promise<Map<string, unknown>> => {
  const supabase = createPublicClient();
  if (!supabase) return new Map();

  const { data, error } = await supabase.from("site_content").select("key, data");
  if (error) {
    throw new Error(`Could not load site content from Supabase: ${error.message}`);
  }
  return new Map(data.map((row) => [row.key as string, row.data as unknown]));
});

/**
 * The hand-authored layer of the portfolio — the database rows, or the repo
 * literal when Supabase is not configured or has not been seeded yet.
 */
const loadRawProperties = cache(async (): Promise<Property[]> => {
  const supabase = createPublicClient();
  if (!supabase) return seedProperties;

  const { data, error } = await supabase
    .from("properties")
    .select("slug, data, position")
    .eq("published", true)
    .order("position", { ascending: true })
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(`Could not load properties from Supabase: ${error.message}`);
  }

  // An empty table means "not seeded yet", not "the group sold everything".
  // Serving the repo portfolio keeps the site whole across that first deploy.
  if (data.length === 0) {
    console.warn("[content] properties table is empty — serving the repo seed. Run the seed.");
    return seedProperties;
  }

  return data.map((row) => normalizeProperty(row.slug as string, row.data as Partial<Property>));
});

export type Portfolio = {
  /** Published properties, in display order, with the Places overlay applied. */
  all: Property[];
  get: (slug: string) => Property | undefined;
  adjacent: (slug: string) => { previous: Property | null; next: Property | null };
  assetClasses: Property["assetType"][];
  tokens: Record<string, string>;
};

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  const all = (await loadRawProperties()).map(enrich);
  const assetClasses = [...new Set(all.map((p) => p.assetType))];

  return {
    all,
    get: (slug) => all.find((p) => p.slug === slug),
    adjacent: (slug) => adjacentIn(all, slug),
    assetClasses,
    tokens: {
      assetCount: String(all.length),
      assetCountWord: NUMBER_WORDS[all.length] ?? String(all.length),
      assetClassCount: String(assetClasses.length),
      assetClassList: assetClasses.map((t) => assetTypeLabels[t]).join(", "),
      year: String(new Date().getFullYear()),
    },
  };
});

/**
 * One section's content: the code defaults, overlaid with whatever an editor
 * has saved, with `{tokens}` filled in from the live portfolio.
 */
export async function getSection<K extends SectionKey>(key: K): Promise<ValuesFor<K>> {
  const [rows, portfolio] = await Promise.all([loadContentRows(), getPortfolio()]);
  const section = sectionsByKey[key];
  const values = resolveValues(section.fields, rows.get(key));
  return interpolateDeep(values, portfolio.tokens) as ValuesFor<K>;
}

/** Several sections at once — `const [hero, cta] = await getSections("a", "b")`. */
export async function getSections<const K extends readonly SectionKey[]>(
  ...keys: K
): Promise<{ [I in keyof K]: ValuesFor<K[I]> }> {
  return (await Promise.all(keys.map((k) => getSection(k)))) as {
    [I in keyof K]: ValuesFor<K[I]>;
  };
}
