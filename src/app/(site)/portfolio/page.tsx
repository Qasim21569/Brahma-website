import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { BorderedButton } from "@/components/ui/BorderedButton";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import { assetTypeLabels } from "@/data/properties";
import { getPortfolio, getSection, getSections } from "@/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getSection("portfolio.hero");
  return { title: "Portfolio", description: metaDescription };
}

export default async function PortfolioPage() {
  const [hero, assetsCopy, cta, template] = await getSections(
    "portfolio.hero",
    "portfolio.assets",
    "portfolio.cta",
    "property.template",
  );
  const portfolio = await getPortfolio();
  const total = portfolio.all.length;
  const assetClasses = portfolio.assetClasses;

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
              <SectionTitle tone="light">{hero.label}</SectionTitle>
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
                    {hero.assetsLabel}
                  </span>
                </div>
                <div>
                  <CountUp
                    to={assetClasses.length}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    {hero.classesLabel}
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
                  lines={hero.heading}
                />
              </h1>
              <MaskText
                delay={0.15}
                amount={0}
                className="font-body-lg text-body-lg text-cream-dim mt-8 max-w-xl"
                /* ⚠️ No absolute financial claims about the portfolio here
                   (e.g. "every asset is acquired below replacement cost") —
                   nothing in the data supports one. See BUILD-PLAYBOOK. */
                lines={hero.body}
              />

              <div className="mt-10 grid grid-cols-2 gap-x-gutter gap-y-8 sm:grid-cols-3 md:hidden">
                <div>
                  <CountUp
                    to={total}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    {hero.assetsLabel}
                  </span>
                </div>
                <div>
                  <CountUp
                    to={assetClasses.length}
                    pad={2}
                    className="font-stat-display text-stat-display text-cream block leading-none"
                  />
                  <span className="font-label-caps text-label-caps text-cream-dim mt-3 block">
                    {hero.classesLabel}
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
          <SectionTitle>{assetsCopy.label}</SectionTitle>
          <div className="mt-12">
            {/* Every published property. The grid renders a designed fallback
                for any without photography, so it is not gated on imagery. */}
            <PortfolioGrid
              properties={portfolio.all}
              labels={{
                all: assetsCopy.allLabel,
                view: assetsCopy.viewLabel,
                empty: assetsCopy.emptyText,
                independent: template.independentLabel,
              }}
            />
          </div>
        </section>

        {/* ─── CTA — LIGHT (stone-white, hairline-bounded) ─── */}
        <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{cta.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={cta.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={cta.body}
              />
              <Reveal delay={0.4}>
                <div className="mt-10">
                  <BorderedButton href={cta.buttonHref}>{cta.buttonLabel}</BorderedButton>
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
