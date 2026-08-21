import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { StyledLink } from "@/components/ui/StyledLink";
import { AmenityIcon } from "@/components/ui/AmenityIcon";
import type { Property } from "@/data/properties";

/**
 * PropertyAmenities — the per-asset amenities grid on a property detail page.
 *
 * Replaced the "Our Approach" (Acquire / Renovate / Operate) block, which was
 * removed from the detail pages on 2026-08-17 at the client's request: it
 * restated the homepage Process section verbatim on all 12 pages, so it carried
 * no per-asset information at all.
 *
 * ── Renders nothing when there is nothing sourced ────────────────────────────
 * Returns null on an empty list, the same guard the Gallery uses. Two assets
 * legitimately have no amenity data — the Weeki Wachee residence (a private
 * house, so no Google business listing exists) and any asset whose listing has
 * no editorial summary. An empty grid with a heading over it reads as broken;
 * no section reads as deliberate.
 *
 * ⚠️ This is NOT a viewport-branching component, so returning null here does
 * not trip the "never return null" rule — the decision is data-driven and
 * identical on server and client, so crawlers see exactly what visitors see.
 *
 * Dark by design: it sits between the light Facts section and the light
 * Gallery, holding the alternation the removed Approach block used to provide.
 * Sets both `bg-*` and `text-*` explicitly — nothing here inherits colour.
 */
export function PropertyAmenities({ property }: { property: Property }) {
  const amenities = property.amenities ?? [];
  if (amenities.length === 0) return null;

  const { assetType, brand, bookingUrl } = property;

  // Hand-set line arrays, both well under the ~45-character wrap threshold.
  // "Guests" is wrong for the school and the residence, so the non-hospitality
  // assets get their own phrasing rather than a single awkward compromise.
  const headline =
    assetType === "hospitality"
      ? ["What guests find", "on arrival."]
      : ["What the property", "provides."];

  return (
    <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-[1fr_1.9fr]">
        <SectionTitle tone="light">Amenities</SectionTitle>

        <div>
          <h2>
            <MaskText
              className="font-headline-md text-headline-md text-cream"
              lines={headline}
            />
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-x-gutter gap-y-4 sm:grid-cols-2">
            {amenities.map((amenity, i) => (
              <li key={amenity.icon}>
                {/* Stagger runs across the row pairs rather than the whole
                    list, so a 5-item and an 8-item grid finish at the
                    same moment instead of the longer one trailing. */}
                <Reveal delay={(i % 2) * 0.08} distance={16}>
                  <div className="flex items-center gap-4 border-t border-white/10 py-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-muted-azure"
                      aria-hidden="true"
                    >
                      <AmenityIcon name={amenity.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-body-md text-body-md text-cream">
                      {amenity.label}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* Provenance is stated on the page, not just in the source — but
              ONLY where it is true. The Google line and the operator link are
              right for the ten franchised hotels, whose lists are derived from
              a Places listing and are narrower than the brand site's own grid.
              They would be a false citation on an asset the group owns outright
              and wrote the list for, so a client-sourced list prints neither. */}
          {property.amenitiesSource !== "client" && (
            <>
              <MaskText
                delay={0.2}
                className="font-body-md text-body-md text-cream-dim/70 mt-12"
                lines={[
                  "Amenity information as published by the",
                  "property on Google. Confirm details at",
                  "time of booking.",
                ]}
              />

              {bookingUrl && (
                <div className="mt-6 max-w-md">
                  <StyledLink href={bookingUrl} tone="light" external>
                    {brand ? `Full amenity list at ${brand}` : "View all amenities"}
                  </StyledLink>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
