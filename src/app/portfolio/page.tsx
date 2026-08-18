import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { BorderedButton } from "@/components/ui/BorderedButton";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import { enrichedProperties, assetTypeLabels } from "@/data/properties";

export const metadata: Metadata = {
  title: "Portfolio | Brahmas Management and Investment Group",
  description:
    "Twelve operating assets across hospitality, education, and residential real estate in Florida — acquired, repositioned, and operated directly by Brahmas.",
};

const total = enrichedProperties.length;
const assetClasses = [...new Set(enrichedProperties.map((p) => p.assetType))];

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {/* ─── Hero — DARK ───
            Opens dark so the page reads as SelectedWork continued: arriving from
            that section's bg-ink-deep, the transition is a scroll rather than a
            cut. Sets bg AND text explicitly per §2.4. */}
        <section className="bg-ink-deep px-margin-edge pt-16 pb-section-gap text-cream">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <div>
              <SectionTitle tone="light">Portfolio</SectionTitle>
              {/* Stats sit in the narrow column on desktop — same editorial
                  grammar as About, and keeps the hero readable at rest without
                  clipping the figures below the fold. */}
              <div className="mt-14 hidden grid-cols-2 gap-x-gutter gap-y-8 md:mt-20 md:grid">
                <div>
                  <CountUp
                    to={total}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    Operating assets
                  </span>
                </div>
                <div>
                  <CountUp
                    to={assetClasses.length}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    Asset classes
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-label-caps text-label-caps text-cream-dim block leading-relaxed">
                    {assetClasses.map((t) => assetTypeLabels[t]).join(" · ")}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  amount={0}
                  lines={[
                    "Twelve operating assets.",
                    "One thesis: structural",
                    "quality earns long-term",
                    "performance.",
                  ]}
                />
              </h1>
              <MaskText
                delay={0.15}
                amount={0}
                className="font-body-lg text-body-lg text-cream-dim mt-8 max-w-xl"
                lines={[
                  "Every asset is acquired below replacement cost,",
                  "repositioned through capital investment, and",
                  "operated directly — never handed to a",
                  "third-party manager.",
                ]}
              />

              <div className="mt-10 grid grid-cols-2 gap-x-gutter gap-y-8 sm:grid-cols-3 md:hidden">
                <div>
                  <CountUp
                    to={total}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    Operating assets
                  </span>
                </div>
                <div>
                  <CountUp
                    to={assetClasses.length}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    Asset classes
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="font-label-caps text-label-caps text-cream-dim block leading-relaxed">
                    {assetClasses.map((t) => assetTypeLabels[t]).join(" · ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The assets — LIGHT ───
            Deliberately NOT the [1fr_1.9fr] text-content grid every other
            section uses. That grammar reserves the left third of the row for
            the label column, which is fine when the right column is a
            paragraph but leaves a full-height empty gutter beside a 2-column
            card grid — the whole grid gets squeezed into 66% of the section
            width for no reason. Label sits full-width on its own row instead,
            and the card grid gets the full section width below it. */}
        <section className="px-margin-edge py-section-gap">
          <SectionTitle>The Assets</SectionTitle>
          <div className="mt-12">
            {/* All 12 via enrichedProperties. The grid renders a designed
                fallback for the 10 without photography, so this is not gated
                on featuredProperties the way the old page was. */}
            <PortfolioGrid properties={enrichedProperties} />
          </div>
        </section>

        {/* ─── CTA — LIGHT (stone-white, hairline-bounded) ─── */}
        <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>
              Next Steps
            </SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["Have an asset that fits", "the thesis?"]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "We evaluate operating assets in markets whose",
                  "structural quality exceeds their current",
                  "performance.",
                ]}
              />
              <Reveal delay={0.4}>
                <div className="mt-10">
                  <BorderedButton href="/contact">Reach out to us</BorderedButton>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
