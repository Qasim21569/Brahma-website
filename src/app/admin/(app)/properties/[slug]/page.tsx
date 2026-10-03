import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireEditor } from "@/lib/admin/auth";
import { loadAdminProperties } from "@/lib/admin/data";
import { enrich } from "@/data/properties";
import { propertyToValues } from "@/content/propertyFields";
import { DeleteProperty, PropertyEditor, PublishToggle } from "@/components/admin/PropertyEditor";

export const metadata: Metadata = { title: "Edit property" };

export default async function EditProperty({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { slug } = await params;
  const { created } = await searchParams;
  const { supabase } = await requireEditor();
  const row = (await loadAdminProperties(supabase)).find((r) => r.slug === slug);
  if (!row) notFound();

  const p = row.property;
  const shown = enrich(p);
  const usingGooglePhotos = p.gallery.length === 0 && shown.gallery.length > 0;
  const usingGoogleAmenities = !p.amenities && (shown.amenities?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/properties" className="text-[13px] text-mortar-grey hover:underline">
          ← All properties
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-semibold tracking-tight">{p.shortName}</h1>
          {!row.published && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[12px] font-semibold text-red-800">
              Hidden from the site
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PublishToggle slug={slug} published={row.published} />
          {row.published && (
            <a
              href={`/portfolio/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-muted-azure-dim hover:underline"
            >
              View on site ↗
            </a>
          )}
          <span className="text-[12px] text-mortar-grey">/portfolio/{slug}</span>
        </div>
      </div>

      {created && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-[14px] text-emerald-800">
          Created. It is hidden until you press Publish.
        </p>
      )}

      {(usingGooglePhotos || usingGoogleAmenities) && (
        <div className="rounded-lg border border-muted-azure/40 bg-muted-azure/10 p-4 text-[13px] leading-relaxed">
          {usingGooglePhotos && (
            <p>
              <strong>Photos:</strong> the site is showing {shown.gallery.length} photos from the
              property&apos;s Google listing, each with its required credit. Add photos to the
              gallery below to replace them with your own.
            </p>
          )}
          {usingGoogleAmenities && (
            <p className={usingGooglePhotos ? "mt-2" : ""}>
              <strong>Amenities:</strong> showing {shown.amenities?.length} from Google (
              {shown.amenities?.map((a) => a.label).join(", ")}). Switch the source to Custom to
              write your own list.
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-outline-variant bg-white px-5 pt-5 shadow-sm sm:px-6">
        <PropertyEditor slug={slug} values={propertyToValues(p)} />
      </div>

      <div className="flex justify-end">
        <DeleteProperty slug={slug} shortName={p.shortName} />
      </div>
    </div>
  );
}
