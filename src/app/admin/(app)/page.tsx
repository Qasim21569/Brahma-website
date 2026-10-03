import Link from "next/link";
import type { Metadata } from "next";
import { requireEditor } from "@/lib/admin/auth";
import { loadAdminProperties, loadContentRows } from "@/lib/admin/data";
import { findSection, pages, sectionsForPage } from "@/content/registry";
import { LocalDate } from "@/components/admin/LocalDate";
import { properties as seedProperties } from "@/data/properties";
import { ImportSeedButton } from "@/components/admin/controls";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const { supabase, editor } = await requireEditor();
  const [rows, props] = await Promise.all([loadContentRows(supabase), loadAdminProperties(supabase)]);

  const recent = [
    ...[...rows.entries()].map(([key, r]) => ({
      label: findSection(key)?.title ?? key,
      where: pages.find((p) => p.key === findSection(key)?.page)?.label ?? "",
      href: `/admin/pages/${findSection(key)?.page ?? "home"}#${key}`,
      at: r.updatedAt,
    })),
    ...props.map((p) => ({
      label: p.property.shortName,
      where: "Properties",
      href: `/admin/properties/${p.slug}`,
      at: p.updatedAt,
    })),
  ]
    .filter((r) => r.at)
    .sort((a, b) => (b.at! > a.at! ? 1 : -1))
    .slice(0, 8);

  const published = props.filter((p) => p.published).length;
  const placeholder = props.filter((p) => p.property.contentStatus === "placeholder").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-[14px] text-mortar-grey">
          Signed in as {editor.email}. Changes go live on the website as soon as you save.
        </p>
      </div>

      {props.length === 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="text-[16px] font-semibold text-amber-900">One-time setup: import the portfolio</h2>
          <p className="mt-1 max-w-2xl text-[14px] text-amber-900">
            The website is still showing the {seedProperties.length} properties built into its code.
            Import them once so they can be edited here. This only works while the list is empty, so it
            can never overwrite your edits.
          </p>
          <div className="mt-4">
            <ImportSeedButton count={seedProperties.length} />
          </div>
        </div>
      )}

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[18px] font-semibold">Pages</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pages.map((page) => {
            const sections = sectionsForPage(page.key);
            const edited = sections.filter((s) => rows.has(s.key)).length;
            return (
              <Link
                key={page.key}
                href={`/admin/pages/${page.key}`}
                className="group rounded-xl border border-outline-variant bg-white p-4 shadow-sm transition hover:border-muted-azure"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold group-hover:text-muted-azure-dim">{page.label}</span>
                  <span className="text-[12px] text-mortar-grey">
                    {edited ? `${edited}/${sections.length} edited` : `${sections.length} sections`}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-mortar-grey">{page.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold">Properties</h2>
            <Link href="/admin/properties" className="text-[13px] font-medium text-muted-azure-dim hover:underline">
              Manage →
            </Link>
          </div>
          {props.length ? (
            <dl className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-[12px] text-mortar-grey">On the site</dt>
                <dd className="text-[24px] font-semibold">{published}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-mortar-grey">Hidden</dt>
                <dd className="text-[24px] font-semibold">{props.length - published}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-mortar-grey">Copy still placeholder</dt>
                <dd className={`text-[24px] font-semibold ${placeholder ? "text-amber-700" : ""}`}>
                  {placeholder}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-[14px] text-mortar-grey">Not imported yet — see above.</p>
          )}
        </section>

        <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold">Recent changes</h2>
            <Link href="/admin/history" className="text-[13px] font-medium text-muted-azure-dim hover:underline">
              History →
            </Link>
          </div>
          {recent.length ? (
            <ul className="mt-3 divide-y divide-outline-variant/60">
              {recent.map((r, i) => (
                <li key={i} className="flex items-baseline justify-between gap-3 py-2">
                  <Link href={r.href} className="min-w-0 truncate text-[14px] hover:underline">
                    {r.label}
                    <span className="ml-2 text-[12px] text-mortar-grey">{r.where}</span>
                  </Link>
                  <span className="shrink-0 text-[12px] text-mortar-grey">
                    <LocalDate iso={r.at!} withTime />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14px] text-mortar-grey">Nothing edited yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
