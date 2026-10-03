import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireEditor } from "@/lib/admin/auth";
import { loadAdminProperties, loadContentRows } from "@/lib/admin/data";
import { pages, sectionsForPage } from "@/content/registry";
import { resolveValues, TOKEN_HELP, type PageKey } from "@/content/fields";
import { properties as seedProperties } from "@/data/properties";
import { SectionEditor } from "@/components/admin/SectionEditor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: pages.find((p) => p.key === page)?.label ?? "Page" };
}

export default async function PageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageKey } = await params;
  const page = pages.find((p) => p.key === pageKey);
  if (!page) notFound();

  const { supabase } = await requireEditor();
  const [rows, props] = await Promise.all([loadContentRows(supabase), loadAdminProperties(supabase)]);
  const sections = sectionsForPage(page.key as PageKey);

  // Pickers list every property the editor can see, hidden ones included —
  // falling back to the built-in list before the portfolio is imported.
  const propertyOptions = (
    props.length
      ? props.map((p) => ({ slug: p.slug, name: p.property.shortName + (p.published ? "" : " (hidden)") }))
      : seedProperties.map((p) => ({ slug: p.slug, name: p.shortName }))
  );

  const usesTokens = sections.some((s) => JSON.stringify(s.fields).includes("{asset"));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">{page.label}</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-mortar-grey">
            {page.blurb} Layout and animation are fixed; the wording and images below are yours to
            change. Each section saves separately.
          </p>
        </div>
        {page.path && (
          <a
            href={page.path}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-outline-variant bg-white px-3 py-1.5 text-[13px] font-medium hover:bg-surface-container-low"
          >
            Open page ↗
          </a>
        )}
      </div>

      {usesTokens && (
        <div className="rounded-lg border border-muted-azure/40 bg-muted-azure/10 p-4 text-[13px] leading-relaxed text-primary">
          <strong>Live numbers.</strong> Type these in curly brackets and the site fills them in, so
          they never go out of date:
          <ul className="mt-1 grid gap-x-6 sm:grid-cols-2">
            {Object.entries(TOKEN_HELP).map(([token, help]) => (
              <li key={token}>
                <code className="rounded bg-white px-1">{`{${token}}`}</code> — {help}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, i) => {
          const row = rows.get(section.key);
          return (
            <SectionEditor
              key={section.key}
              sectionKey={section.key}
              values={resolveValues(section.fields, row?.data)}
              edited={Boolean(row)}
              updatedAt={row?.updatedAt ?? null}
              context={{ propertyOptions }}
              defaultOpen={i === 0}
            />
          );
        })}
      </div>
    </div>
  );
}
