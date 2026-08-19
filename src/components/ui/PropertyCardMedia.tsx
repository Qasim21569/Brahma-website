import Image from "next/image";
import { assetTypeLabels, type Property } from "@/data/properties";

/**
 * PropertyCardMedia — the image slot on a portfolio card, with a designed
 * fallback for assets that have no photography yet.
 *
 * **The fallback is permanent, not a stopgap.** 10 of 12 assets have no images,
 * and photography arrives asset by asset over weeks — so the portfolio has to
 * look deliberate at 2 photos or 12. It renders the asset-type label, a large
 * monogram, and the brand, on the same aspect box as a real photograph so the
 * grid rhythm never breaks.
 *
 * See docs/PHOTO-PIPELINE.md §4.4.
 */
export function PropertyCardMedia({
  property,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 45vw",
  priority = false,
}: {
  property: Property;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const photo = property.gallery[0];

  if (!photo) {
    return (
      <div
        className={`relative w-full overflow-hidden border border-mortar-grey bg-stone-white ${aspect}`}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {assetTypeLabels[property.assetType]}
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant/70">
            {property.brand ?? "Independent"}
          </span>
        </div>
        {/* Monogram, same treatment as the team-grid fallback on /about. */}
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="font-display-hero text-[56px] leading-none text-primary/15 md:text-[80px]">
            {monogram(property.shortName)}
          </span>
        </div>
        <span className="sr-only">
          Photography for {property.shortName} is not yet available.
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden bg-stone-white ${aspect}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[0.95]"
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}

/**
 * Up to three initials from a property name, skipping filler words so
 * "Quality Inn & Suites" reads QIS rather than QI&.
 */
function monogram(name: string): string {
  const skip = new Set(["and", "the", "of", "at", "by", "&", "inn", "suites"]);
  const words = name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const strong = words.filter((w) => !skip.has(w.toLowerCase()));
  const source = strong.length > 0 ? strong : words;
  return source.slice(0, 3).map((w) => w[0].toUpperCase()).join("");
}
