import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { StyledLink } from "@/components/ui/StyledLink";
import { CountUp } from "@/components/ui/CountUp";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { founder, SOURCES } from "@/data/company";
import { constructionPartner } from "@/data/services";
import { enrichedProperties } from "@/data/properties";

export const metadata: Metadata = {
  title: "About | Brahmas Management and Investment Group",
  description:
    "Brahmas Management and Investment Group acquires, repositions, and directly operates hospitality, education, and residential assets across Florida.",
};

/**
 * Derived, never typed by hand — same rule as the homepage Stats section, where
 * hardcoding produced "02 properties" against a portfolio of 12.
 */
const stats: { to: number; label: string; pad?: number; suffix?: string }[] = [
  { to: enrichedProperties.length, pad: 2, label: "Operating assets" },
  {
    to: new Set(enrichedProperties.map((p) => p.assetType)).size,
    pad: 2,
    label: "Asset classes",
  },
  { to: founder.yearsInIndustryValue, suffix: "+", label: "Years in the industry" },
  { to: founder.firstOwnershipYear, label: "First ownership" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {/* ─── Hero — LIGHT ───
            Editorial variant per BUILD-PLAYBOOK §5 B4: asymmetric grid, headline
            at headline-lg, a short hand-broken standfirst, and jump links.
            Deliberately NOT an oversized heading block above a paragraph — that
            is the shape the homepage hero was rebuilt three times to escape. */}
        <section className="px-margin-edge pt-16 pb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>
              Our Story
            </SectionTitle>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["An operator first.", "An owner since."]}
                />
              </h1>
              <MaskText
                delay={0.2}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "We acquire underperforming operating assets,",
                  "reposition them through capital investment,",
                  "and run them directly — across hospitality,",
                  "education, and residential real estate.",
                ]}
              />
              <Reveal delay={0.5}>
                <div className="mt-10 flex max-w-xl flex-col gap-2">
                  <StyledLink href="#leadership">The founder</StyledLink>
                  <StyledLink href="#team">Meet the team</StyledLink>
                  <StyledLink href="#construction-partners">
                    Construction partners
                  </StyledLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Full-bleed asset band ───
            parallaxAmount={20} is the full-bleed value per §2.3; sections use {8}. */}
        <section className="px-margin-edge pb-section-gap">
          <ResponsiveImage parallaxAmount={20}>
            <div className="relative aspect-[16/10] w-full bg-stone-white md:aspect-[21/9]">
              <Image
                src="/site-photos/Hampton-Inn-homepage.webp"
                alt="Hampton Inn & Suites Tampa Airport Westshore, held and operated by Brahmas"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          </ResponsiveImage>
        </section>

        {/* ─── Founder — DARK ─── sets bg AND text explicitly per §2.4. */}
        <section
          id="leadership"
          className="relative isolate bg-ink-deep py-section-gap text-cream"
        >
          <div className="editorial-grain" aria-hidden="true">
            <div className="editorial-grain__bar" />
          </div>
          <div className="relative z-10 px-margin-edge">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
              <SectionTitle tone="light">Leadership</SectionTitle>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  lines={[
                    "An operator before an owner —",
                    "and an owner who never",
                    "stopped operating.",
                  ]}
                />
              </h2>
            </div>

            {/* Portrait left, narrative right. The left column previously held an
                empty <div /> on this row and the next, which is why the section
                read as a wall of text. */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter md:mt-24">
              <div>
                <ResponsiveImage parallaxAmount={8}>
                  <div className="relative aspect-[3/4] w-full bg-white/5">
                    <Image
                      src="/founder-image.png"
                      alt={`${founder.name}, ${founder.role}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </ResponsiveImage>
                <Reveal delay={0.2}>
                  <p className="font-body-lg text-body-lg text-cream mt-6 leading-tight">
                    {founder.name}
                  </p>
                  <p className="font-label-caps text-label-caps text-muted-azure mt-2">
                    {founder.role}
                  </p>
                </Reveal>
              </div>

              {/* The six narrative blocks stay Reveal + <p> rather than MaskText.
                  §2.2 caps hand-set lines at ~45 characters; these are 60–90 word
                  narrative paragraphs, so hand-breaking them would mean ~84
                  hand-set lines whose breaks would not survive the column
                  changing width at sm:. MaskText carries the display-scale copy
                  on this page instead. */}
              <div className="grid max-w-4xl grid-cols-1 gap-x-gutter gap-y-12 sm:grid-cols-2">
                {founder.story.map((block, i) => (
                  <Reveal key={block.heading} delay={(i % 2) * 0.1}>
                    <div className="border-t border-white/15 pt-6">
                      <h3 className="font-label-caps text-label-caps text-muted-azure">
                        {block.heading}
                      </h3>
                      <p className="font-body-md text-body-md text-cream-dim mt-4 leading-relaxed">
                        {block.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Pull quote — the narrow column carries a label so the row is not
                half empty, matching the inverted block on the homepage. */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter md:mt-28">
              <SectionTitle tone="light">In his words</SectionTitle>
              <Reveal>
                <blockquote className="max-w-3xl">
                  <p className="font-headline-md text-headline-md text-cream leading-tight">
                    &ldquo;{founder.quotes[0].text}&rdquo;
                  </p>
                  <footer className="font-label-caps text-label-caps text-cream-dim/70 mt-6">
                    {founder.name} — interviewed in{" "}
                    <a
                      href={SOURCES.lodgingMagazine.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-cream-dim/40 underline-offset-4 transition-colors hover:text-cream"
                    >
                      {founder.quotes[0].source}
                    </a>
                  </footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Approach — LIGHT ─── */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <div>
              <SectionTitle>
                Our Approach
              </SectionTitle>
              <ResponsiveImage parallaxAmount={8}>
                <div className="relative mt-14 aspect-[4/5] w-full bg-stone-white md:mt-20">
                  <Image
                    src="/site-photos/Clarion-Pointe-5.webp"
                    alt="Interior of a Brahmas-operated hospitality asset"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </ResponsiveImage>
            </div>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["We do not hand the keys", "to a third party."]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "Acquisition, repositioning, and operation sit",
                  "under one roof. The group underwrites the",
                  "asset, deploys the capital, and then runs the",
                  "building — so the people making the investment",
                  "case are accountable for the result.",
                ]}
              />

              <div className="mt-16 grid grid-cols-2 gap-x-gutter gap-y-10 sm:grid-cols-4">
                {stats.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.08} distance={14}>
                    <div className="border-t border-mortar-grey pt-4">
                      <CountUp
                        to={stat.to}
                        pad={stat.pad}
                        suffix={stat.suffix}
                        className="font-stat-display text-stat-display text-primary block leading-none"
                      />
                      <div className="font-label-caps text-label-caps text-on-surface-variant mt-3">
                        {stat.label}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Team — LIGHT (stone-white, hairline-bounded) ─── */}
        <section
          id="team"
          className="bg-stone-white border-y border-mortar-grey py-section-gap"
        >
          <div className="px-margin-edge">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
              <SectionTitle>
                The Team
              </SectionTitle>
              <div>
                <h2>
                  <MaskText
                    className="font-headline-lg text-headline-lg text-primary"
                    lines={["People who run", "what they underwrite."]}
                  />
                </h2>
                <MaskText
                  delay={0.15}
                  className="font-body-lg text-body-lg text-on-surface-variant mt-6 max-w-xl"
                  lines={[
                    "The group hires for disposition rather than",
                    "credentials, and offers equity in new projects",
                    "to those who prove it.",
                  ]}
                />
              </div>
            </div>

            <TeamGrid />
          </div>
        </section>

        {/* ─── Construction partners — LIGHT ───
            Same partner data as /services; kept compact on About. */}
        <section id="construction-partners" className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>
              Construction partners
            </SectionTitle>
            <div>
              <MaskText
                className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
                lines={constructionPartner.body}
              />

              <Reveal delay={0.15}>
                <div className="mt-10 grid grid-cols-1 border-t border-mortar-grey sm:grid-cols-3">
                  {constructionPartner.capabilities.map((capability) => (
                    <div
                      key={capability}
                      className="border-b border-mortar-grey py-5 sm:border-b-0 sm:border-l sm:first:border-l-0 sm:py-6 sm:pl-6 sm:first:pl-0"
                    >
                      <span className="font-headline-md text-headline-md text-primary leading-tight">
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-8 max-w-xl">
                  <StyledLink
                    href={constructionPartner.url}
                    external
                  >
                    {constructionPartner.name}
                  </StyledLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── CTA — DARK ─── */}
        <section className="bg-ink-deep py-section-gap text-cream">
          <div className="px-margin-edge text-center">
            <h2>
              <MaskText
                className="font-headline-lg text-headline-lg text-cream"
                lines={["Discuss an asset", "with our team."]}
              />
            </h2>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-cream text-ink-deep px-8 py-3.5 rounded-full font-label-caps text-label-caps hover:opacity-90 transition-opacity"
                >
                  Contact Our Team
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center border border-cream/40 text-cream px-8 py-3.5 rounded-full font-label-caps text-label-caps hover:bg-cream/10 transition-colors"
                >
                  View Portfolio
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
