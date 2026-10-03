import "server-only";
import { normalizeProperty, type Property } from "@/data/properties";
import type { createServerSupabase } from "@/lib/supabase/server";

type Client = Awaited<ReturnType<typeof createServerSupabase>>;

export type ContentRow = { data: unknown; updatedAt: string | null };

/** Saved section rows, keyed by section key. Read under the editor's session. */
export async function loadContentRows(supabase: Client): Promise<Map<string, ContentRow>> {
  const { data, error } = await supabase.from("site_content").select("key, data, updated_at");
  if (error) throw new Error(`Could not load content: ${error.message}`);
  return new Map(
    data.map((r) => [r.key as string, { data: r.data, updatedAt: (r.updated_at as string) ?? null }]),
  );
}

export type AdminPropertyRow = {
  slug: string;
  position: number;
  published: boolean;
  updatedAt: string | null;
  property: Property;
};

/** Every property, published or not, in display order — editors see hidden ones. */
export async function loadAdminProperties(supabase: Client): Promise<AdminPropertyRow[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("slug, position, published, data, updated_at")
    .order("position", { ascending: true })
    .order("slug", { ascending: true });
  if (error) throw new Error(`Could not load properties: ${error.message}`);
  return data.map((r) => ({
    slug: r.slug as string,
    position: r.position as number,
    published: r.published as boolean,
    updatedAt: (r.updated_at as string) ?? null,
    property: normalizeProperty(r.slug as string, r.data as Partial<Property>),
  }));
}
