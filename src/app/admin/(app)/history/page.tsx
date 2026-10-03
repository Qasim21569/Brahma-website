import type { Metadata } from "next";
import { requireEditor } from "@/lib/admin/auth";
import { findSection, pages } from "@/content/registry";
import { RestoreButton } from "@/components/admin/controls";

export const metadata: Metadata = { title: "History" };

/**
 * Every earlier version of every section and property, newest first. Each row
 * is the content as it was BEFORE a save or delete — restoring one makes it
 * current again, and the version it replaces joins this list in turn.
 */
export default async function HistoryPage() {
  const { supabase, editor } = await requireEditor();
  const { data, error } = await supabase
    .from("content_revisions")
    .select("id, table_name, record_key, operation, data, edited_by, edited_at")
    .order("edited_at", { ascending: false })
    .limit(150);

  if (error) throw new Error(`Could not load history: ${error.message}`);

  const labelFor = (table: string, key: string, data: Record<string, unknown>) => {
    if (table === "site_content") {
      const s = findSection(key);
      const page = pages.find((p) => p.key === s?.page)?.label;
      return s ? `${page ? `${page} → ` : ""}${s.title}` : key;
    }
    const d = (data.data ?? {}) as { shortName?: string };
    return `Property → ${d.shortName ?? key}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">History</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-mortar-grey">
          The previous version is kept every time something is saved, restored to the original, or
          deleted. Restoring puts that version back on the live site.
        </p>
      </div>

      {data.length === 0 ? (
        <p className="rounded-xl border border-outline-variant bg-white p-5 text-[14px] text-mortar-grey">
          Nothing has been changed yet.
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant/70 overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm">
          {data.map((rev) => {
            const label = labelFor(
              rev.table_name as string,
              rev.record_key as string,
              rev.data as Record<string, unknown>,
            );
            return (
              <li key={rev.id as number} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{label}</p>
                  <p className="text-[12px] text-mortar-grey">
                    Version before a {rev.operation === "delete" ? "delete" : "change"} on{" "}
                    {new Date(rev.edited_at as string).toLocaleString()}
                    {rev.edited_by === editor.id ? " · by you" : ""}
                  </p>
                </div>
                <details className="w-full sm:w-auto">
                  <summary className="cursor-pointer text-[13px] text-muted-azure-dim">Preview</summary>
                  <pre className="mt-2 max-h-64 max-w-full overflow-auto whitespace-pre-wrap rounded bg-surface-container-low p-3 text-[11px] leading-relaxed sm:max-w-xl">
                    {JSON.stringify((rev.data as { data?: unknown }).data, null, 2)}
                  </pre>
                </details>
                <RestoreButton id={rev.id as number} label={label} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
