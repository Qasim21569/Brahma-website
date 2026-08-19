import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { PropertyCardMedia } from "@/components/ui/PropertyCardMedia";
import { StyledLink } from "@/components/ui/StyledLink";
import { PropertyAmenities } from "@/components/sections/PropertyAmenities";
import {
  enrichedProperties,
  getProperty,
  getAdjacentProperties,
  assetTypeLabels,
} from "@/data/properties";

export function generateStaticParams() {
  return enrichedProperties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: "Property Not Found | BMIG" };

  return {
    title: `${property.name} | Brahmas Management and Investment Group`,
    description: property.summary,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const {
    shortName,
    address,
    city,
    state,
    phone,
    assetType,
    brand,
    acquiredYear,
    subunit,
    bookingUrl,
    summary,
    longform,
    gallery,
  } = property;

  const { previous, next } = getAdjacentProperties(slug);
  const index = enrichedProperties.findIndex((p) => p.slug === slug);

  const facts = [
    { label: "Location", value: `${city}, ${state}` },
    { label: "Asset Type", value: assetTypeLabels[assetType] },
    ...(brand ? [{ label: "Brand", value: brand }] : []),
    { label: "Acquired", value: acquiredYear },
    { label: "Operated By", value: subunit },
  ];

  const hero = gallery[0];

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {/* ─── Header — LIGHT ─── */}
        <section className="px-margin-edge pt-16 pb-12">
          <Reveal>
            <Link
              href="/portfolio"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              ← Portfolio
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <div>
              <SectionTitle>
                {assetTypeLabels[assetType]}
              </SectionTitle>
              {/* Position in the portfolio — carries the NN — 12 counter through
                  from SelectedWork and the portfolio grid. */}
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-6 flex items-center gap-3">
                <span className="text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="opacity-40">—</span>
                <span className="opacity-60">
                  {String(enrichedProperties.length).padStart(2, "0")}
                </span>
              </p>
            </div>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={[shortName]}
                />
              </h1>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-6 max-w-xl"
                lines={[summary]}
              />

              <Reveal delay={0.35}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  {/* Only rendered when the enrichment script has supplied a
                      booking URL — null for all 12 until then (§5 D5). */}
                  {bookingUrl && (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-label-caps text-label-caps text-on-primary transition-opacity hover:opacity-90"
                    >
                      Book This Property
                      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M4 12L12 4M12 4H6M12 4v6"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-mortar-grey px-8 py-3.5 font-label-caps text-label-caps text-primary transition-colors hover:bg-surface-container"
                    >
                      {phone}
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Hero image ───
            Falls back to the designed no-photo block rather than collapsing the
            page's anchor image — 10 of 12 assets have no photography. */}
        <section className="px-margin-edge">
          {hero ? (
            <ResponsiveImage parallaxAmount={20}>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container md:aspect-[16/9]">
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </ResponsiveImage>
          ) : (
            <PropertyCardMedia
              property={property}
              aspect="aspect-[16/10] md:aspect-[16/9]"
              sizes="100vw"
            />
          )}
        </section>

        {/* ─── Facts — LIGHT ─── */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>
              Asset Detail
            </SectionTitle>
            <div>
              <dl className="grid grid-cols-1 gap-x-gutter gap-y-8 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-t border-mortar-grey pt-4">
                    <dt className="font-label-caps text-label-caps text-on-surface-variant">
                      {fact.label}
                    </dt>
                    <dd className="font-body-lg text-body-lg text-primary mt-2">
                      {fact.value}
                    </dd>
                  </div>
                ))}
                <div className="border-t border-mortar-grey pt-4 sm:col-span-2">
                  <dt className="font-label-caps text-label-caps text-on-surface-variant">
                    Address
                  </dt>
                  <dd className="font-body-lg text-body-lg text-primary mt-2">
                    {address}
                  </dd>
                </div>
              </dl>

              {/* Per-asset prose is client copy of varying length, so it stays a
                  <p> inside <Reveal> rather than hand-broken MaskText — line
                  arrays cannot be hand-set for text that is still being
                  rewritten (10 of 12 are contentStatus "placeholder"). */}
              <Reveal delay={0.2}>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-12 max-w-2xl">
                  {longform}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Amenities — DARK ───
            Replaced the "Our Approach" (Acquire / Renovate / Operate) block
            here on 2026-08-17. That section rendered the same three thesis
            stages on all 12 pages — the copy came from the shared THESIS
            constant for 10 of them — so it duplicated the homepage Process
            section and told a visitor nothing about the asset they were
            looking at. Amenities are per-property and sourced.

            Renders nothing when no amenity data exists; see the component. */}
        <PropertyAmenities property={property} />

        {/* ─── Gallery — LIGHT ───
            Hidden entirely below 2 images rather than rendering an empty or
            one-cell grid (§5 D4). 10 of 12 assets have no gallery at all. */}
        {gallery.length > 1 && (
          <section className="px-margin-edge py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
              <SectionTitle>Gallery</SectionTitle>
              <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
                {gallery.slice(1).map((photo, i) => (
                  <div key={photo.src}>
                    <RevealImage
                      delay={(i % 2) * 0.1}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </RevealImage>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Prev / next — LIGHT (stone-white, hairline-bounded) ───
            Without these a detail page is a dead end; the only way out was the
            navbar (§5 D6). Wraps at both ends. */}
        {(previous || next) && (
          <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
              <SectionTitle>
                More Assets
              </SectionTitle>
              <div className="flex flex-col">
                {previous && (
                  <StyledLink href={`/portfolio/${previous.slug}`}>
                    <span className="font-label-caps text-label-caps text-on-surface-variant mr-3">
                      Previous
                    </span>
                    {previous.shortName}
                  </StyledLink>
                )}
                {next && (
                  <StyledLink href={`/portfolio/${next.slug}`}>
                    <span className="font-label-caps text-label-caps text-on-surface-variant mr-3">
                      Next
                    </span>
                    {next.shortName}
                  </StyledLink>
                )}
                <Reveal delay={0.2}>
                  <div className="mt-8">
                    <Link
                      href="/portfolio"
                      className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
                    >
                      View all {enrichedProperties.length} assets →
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA — DARK ─── */}
        <section className="bg-primary px-margin-edge py-section-gap text-cream">
          <div className="text-center">
            <h2>
              <MaskText
                className="font-headline-lg text-headline-lg text-cream"
                lines={["Discuss this asset", "with our team."]}
              />
            </h2>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center rounded-full bg-cream px-8 py-3.5 font-label-caps text-label-caps text-ink-deep transition-opacity hover:opacity-90"
                >
                  Contact Our Team
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center rounded-full border border-cream/40 px-8 py-3.5 font-label-caps text-label-caps text-cream transition-colors hover:bg-cream/10"
                >
                  View Full Portfolio
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
