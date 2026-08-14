import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { DrawnRule } from "@/components/ui/DrawnRule";
import { GhostWordmark } from "@/components/ui/GhostWordmark";
import { FlickerText } from "@/components/ui/FlickerText";
import Accordion from "@/components/ui/Accordion";
import { founder, SOURCES } from "@/data/company";
import { primaryEmail } from "@/data/contact";
import { enrichedProperties, assetTypeLabels } from "@/data/properties";

export const metadata: Metadata = {
  title: "Careers | Brahmas Management and Investment Group",
  description:
    "Brahmas hires for disposition rather than credentials, and offers equity in new projects to those who prove it.",
};

const assetCount = enrichedProperties.length;
const assetClasses = [...new Set(enrichedProperties.map((p) => p.assetType))];

/**
 * The disciplines the group operates across — derived from the portfolio and
 * the pillars, NOT a list of open vacancies.
 *
 * ⚠️ The page this replaced advertised three specific job openings in
 * "New York, NY", "Miami, FL" and "London, UK". BMIG is a Florida operator with
 * no New York or London presence, and there is no confirmed vacancy list.
 * Publishing roles that do not exist is worse than a wrong address, because
 * people apply to them. Do not add named vacancies without the client
 * supplying them.
 */
const disciplines = [
  {
    title: "Acquisitions and underwriting",
    body: "Sourcing assets whose structural quality exceeds their operating performance, and building the case for what they could be. Market selection, diligence, and the numbers behind an offer.",
  },
  {
    title: "Asset management and repositioning",
    body: "Defining scope property by property — the building, the systems, the brand position — and holding delivery to it. Works alongside specialist design-build partners rather than an in-house contracting arm.",
  },
  {
    title: "Hotel operations",
    body: "Running the assets day to day under Brahmas Hospitality Management. Front desk through to general management, across a portfolio operating under Choice, Hilton, IHG and Wyndham brand standards.",
  },
  {
    title: "Finance and franchise compliance",
    body: "Reporting, treasury, lender relationships, and keeping a multi-brand portfolio compliant with each franchisor's standards.",
  },
];

export default function CareersPage() {
  /* Two blocks of the founder narrative carry the hiring philosophy. Sourced
     from the LODGING interview — see company.ts SOURCES. */
  const hiringBlock = founder.story.find((b) => b.heading === "How we hire");
  const mindsetBlock = founder.story.find((b) => b.heading === "The owner's mindset");
  /* The second LODGING quote is the hiring one: "I don't look for a degree…" */
  const hiringQuote = founder.quotes[1];

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {/* ─── Hero — LIGHT ─── */}
        <section className="px-margin-edge pt-16 pb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-on-surface-variant">
              Careers
            </SectionTitle>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["We hire for disposition,", "not credentials."]}
                />
              </h1>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "The people who run an asset as though they",
                  "already own it are the ones who produce the",
                  "results. That is what we look for, and it is",
                  "not something a degree tells us.",
                ]}
              />
            </div>
          </div>
        </section>

        {/* ─── Full-bleed band ─── */}
        <section className="px-margin-edge pb-section-gap">
          <ResponsiveImage parallaxAmount={20}>
            <div className="relative aspect-[16/10] w-full bg-stone-white md:aspect-[21/9]">
              <Image
                src="/site-photos/Hampton-Inn-6.webp"
                alt="A Brahmas-operated hospitality asset"
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </ResponsiveImage>
        </section>

        {/* ─── The path — DARK ───
            All copy here is the sourced founder narrative, not invented
            employer branding. */}
        <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-cream-dim">The Path</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  lines={["From operator", "to owner."]}
                />
              </h2>

              <div className="mt-12 grid grid-cols-1 gap-x-gutter gap-y-10 sm:grid-cols-2">
                {mindsetBlock && (
                  <Reveal>
                    <div>
                      <DrawnRule className="mb-6 bg-white/20" />
                      <h3 className="font-label-caps text-label-caps text-muted-azure">
                        {mindsetBlock.heading}
                      </h3>
                      <p className="font-body-md text-body-md text-cream-dim mt-4 leading-relaxed">
                        {mindsetBlock.body}
                      </p>
                    </div>
                  </Reveal>
                )}
                {hiringBlock && (
                  <Reveal delay={0.1}>
                    <div>
                      <DrawnRule className="mb-6 bg-white/20" delay={0.1} />
                      <h3 className="font-label-caps text-label-caps text-muted-azure">
                        {hiringBlock.heading}
                      </h3>
                      <p className="font-body-md text-body-md text-cream-dim mt-4 leading-relaxed">
                        {hiringBlock.body}
                      </p>
                    </div>
                  </Reveal>
                )}
              </div>

              <Reveal delay={0.25}>
                <blockquote className="mt-16 max-w-3xl">
                  <p className="font-headline-md text-headline-md text-cream leading-tight">
                    &ldquo;{hiringQuote.text}&rdquo;
                  </p>
                  <footer className="font-label-caps text-label-caps text-cream-dim/70 mt-6">
                    {founder.name} — interviewed in{" "}
                    <a
                      href={SOURCES.lodgingMagazine.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-cream-dim/40 underline-offset-4 transition-colors hover:text-cream"
                    >
                      {hiringQuote.source}
                    </a>
                  </footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Disciplines — LIGHT ───
            Accordion per §5 E3. These are the areas the group operates in, NOT
            open vacancies — see the note on `disciplines` above. */}
        <section id="disciplines" className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-on-surface-variant">
              Disciplines
            </SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["Where the work sits."]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  `We operate ${assetCount} assets across ${assetClasses.length} asset classes —`,
                  `${assetClasses.map((t) => assetTypeLabels[t]).join(", ")}.`,
                  "These are the areas we hire into.",
                ]}
              />
              <div className="mt-12">
                <Accordion items={disciplines} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Applying — LIGHT (stone-white) ───
            An open application, because there is no confirmed vacancy list.
            When the client supplies real openings, they belong here. */}
        <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-on-surface-variant">
              Applying
            </SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["No posting for the role", "you want? Write anyway."]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "Tell us which discipline you belong in and what",
                  "you have actually run. We would rather read that",
                  "than a list of qualifications.",
                ]}
              />
              <Reveal delay={0.35}>
                <div className="mt-10">
                  <a
                    href={`mailto:${primaryEmail}?subject=${encodeURIComponent(
                      "Careers — open application"
                    )}`}
                    className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-8 py-3.5 font-label-caps text-label-caps text-on-primary transition-opacity hover:opacity-90"
                  >
                    Send an open application
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── CTA — DARK ─── */}
        <section className="relative overflow-hidden bg-primary py-section-gap text-cream md:py-24">
          <GhostWordmark>BRAHMAS</GhostWordmark>
          <div className="relative z-10 px-margin-edge text-center">
            <h2 className="font-headline-lg text-headline-lg text-cream">
              <FlickerText>Run it like you own it.</FlickerText>
            </h2>
            <MaskText
              delay={0.15}
              className="font-body-lg text-body-lg mx-auto mt-8 max-w-xl text-cream/70"
              lines={[
                "The strongest performers are offered equity",
                "in new projects.",
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
