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
        <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-cream-dim">Portfolio</SectionTitle>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
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
                className="font-body-lg text-body-lg text-cream-dim mt-8 max-w-xl"
                lines={[
                  "Every asset is acquired below replacement cost,",
                  "repositioned through capital investment, and",
                  "operated directly — never handed to a",
                  "third-party manager.",
                ]}
              />

              <div className="mt-14 grid grid-cols-2 gap-x-gutter gap-y-8 sm:grid-cols-3">
                <Reveal distance={14}>
                  <CountUp
                    to={total}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    Operating assets
                  </span>
                </Reveal>
                <Reveal delay={0.08} distance={14}>
                  <CountUp
                    to={assetClasses.length}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    Asset classes
                  </span>
                </Reveal>
                <Reveal delay={0.16} distance={14} className="col-span-2 sm:col-span-1">
                  <span className="font-label-caps text-label-caps text-cream-dim block leading-relaxed">
                    {assetClasses.map((t) => assetTypeLabels[t]).join(" · ")}
                  </span>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The assets — LIGHT ─── */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-on-surface-variant">
              The Assets
            </SectionTitle>
            <div>
              {/* All 12 via enrichedProperties. The grid renders a designed
                  fallback for the 10 without photography, so this is not gated
                  on featuredProperties the way the old page was. */}
              <PortfolioGrid properties={enrichedProperties} />
            </div>
          </div>
        </section>

        {/* ─── CTA — LIGHT (stone-white, hairline-bounded) ─── */}
        <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-on-surface-variant">
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
