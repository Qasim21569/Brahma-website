import Link from "next/link";
import type { Metadata } from "next";
import { requireEditor } from "@/lib/admin/auth";
import { loadAdminProperties } from "@/lib/admin/data";
import { assetTypeLabels, enrich, properties as seedProperties } from "@/data/properties";
import { MoveButtons, PublishToggle } from "@/components/admin/PropertyEditor";
import { ImportSeedButton } from "@/components/admin/controls";

export const metadata: Metadata = { title: "Properties" };

export default async function PropertiesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { supabase } = await requireEditor();
  const rows = await loadAdminProperties(supabase);
  const { deleted } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Properties</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-mortar-grey">
            The portfolio, in the order it appears on the website. Hidden properties stay here but
            disappear from the site, its counts and its menus.
          </p>
        </div>
        {rows.length > 0 && (
          <Link
            href="/admin/properties/new"
            className="rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-on-primary hover:opacity-90"
          >
            + Add property
          </Link>
        )}
      </div>

      {deleted && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-[14px] text-emerald-800">
          Property deleted. It can be restored from History.
        </p>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
          <p className="max-w-2xl text-[14px] text-amber-900">
            The portfolio has not been imported yet. The website is showing the{" "}
            {seedProperties.length} properties built into its code until you do.
          </p>
          <div className="mt-4">
            <ImportSeedButton count={seedProperties.length} />
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant/70 overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm">
          {rows.map((row, i) => {
            const p = row.property;
            const shown = enrich(p);
            const photo = shown.gallery[0]?.src ?? shown.homeHeroSrc;
            const ownPhotos = p.gallery.length;
            return (
              <li key={row.slug} className="flex flex-wrap items-center gap-4 px-4 py-3">
                <span className="w-6 text-right text-[13px] tabular-nums text-mortar-grey">{i + 1}</span>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={photo} alt="" className="h-12 w-16 rounded object-cover" />
                ) : (
                  <span className="flex h-12 w-16 items-center justify-center rounded bg-surface-container text-[10px] text-mortar-grey">
                    no photo
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/properties/${row.slug}`}
                    className="block truncate text-[15px] font-semibold hover:text-muted-azure-dim"
                  >
                    {p.shortName}
                  </Link>
                  <p className="flex flex-wrap gap-x-3 text-[12px] text-mortar-grey">
                    <span>
                      {p.city}, {p.state}
                    </span>
                    <span>{assetTypeLabels[p.assetType]}</span>
                    <span>
                      {ownPhotos ? `${ownPhotos} own photos` : `${shown.gallery.length} Google photos`}
                    </span>
                    {p.contentStatus === "placeholder" && (
                      <span className="font-medium text-amber-700">placeholder copy</span>
                    )}
                    {!row.published && <span className="font-semibold text-red-700">hidden</span>}
                  </p>
                </div>
                <MoveButtons slug={row.slug} first={i === 0} last={i === rows.length - 1} />
                <PublishToggle slug={row.slug} published={row.published} />
                <Link
                  href={`/admin/properties/${row.slug}`}
                  className="rounded-md border border-outline-variant px-3 py-1.5 text-[13px] font-medium hover:bg-surface-container-low"
                >
                  Edit
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
