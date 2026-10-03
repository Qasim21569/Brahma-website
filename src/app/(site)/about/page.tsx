import type { Metadata } from "next";
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
import { CtaSection } from "@/components/sections/CtaSection";
import { getPortfolio, getSection, getSections } from "@/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription } = await getSection("about.hero");
  return { title: metaTitle, description: metaDescription };
}

export default async function AboutPage() {
  const [hero, band, leadership, approach, teamCopy, partners, cta, founder, team, partner] =
    await getSections(
      "about.hero",
      "about.band",
      "about.leadership",
      "about.approach",
      "about.team",
      "about.partners",
      "about.cta",
      "company.founder",
      "company.team",
      "company.partner",
    );
  const portfolio = await getPortfolio();

  /**
   * Derived, never typed by hand — same rule as the homepage Stats section, where
   * hardcoding produced "02 properties" against a portfolio of 12.
   */
  const stats: { to: number; label: string; pad?: number; suffix?: string }[] = [
    { to: portfolio.all.length, pad: 2, label: approach.assetsLabel },
    { to: portfolio.assetClasses.length, pad: 2, label: approach.classesLabel },
    { to: founder.yearsInIndustry, suffix: "+", label: approach.yearsLabel },
    { to: founder.firstOwnershipYear, label: approach.firstOwnershipLabel },
  ];

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
            <SectionTitle>{hero.label}</SectionTitle>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={hero.heading}
                />
              </h1>
              <MaskText
                delay={0.2}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={hero.body}
              />
              <Reveal delay={0.5}>
                <div className="mt-10 flex max-w-xl flex-col gap-2">
                  {hero.links.map((link, i) => (
                    <StyledLink key={`${i}-${link.href}`} href={link.href}>
                      {link.label}
                    </StyledLink>
                  ))}
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
                src={band.image.src}
                alt={band.image.alt}
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
              <SectionTitle tone="light">{leadership.label}</SectionTitle>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  lines={leadership.heading}
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
                      src={founder.portrait.src}
                      alt={founder.portrait.alt || `${founder.name}, ${founder.role}`}
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
                  <Reveal key={`${i}-${block.heading}`} delay={(i % 2) * 0.1}>
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
              <SectionTitle tone="light">{leadership.quoteLabel}</SectionTitle>
              <Reveal>
                <blockquote className="max-w-3xl">
                  <p className="font-headline-md text-headline-md text-cream leading-tight">
                    &ldquo;{leadership.quote}&rdquo;
                  </p>
                  <footer className="font-label-caps text-label-caps text-cream-dim/70 mt-6">
                    {founder.name} — interviewed in{" "}
                    <a
                      href={founder.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-cream-dim/40 underline-offset-4 transition-colors hover:text-cream"
                    >
                      {founder.sourceName}
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
              <SectionTitle>{approach.label}</SectionTitle>
              <ResponsiveImage parallaxAmount={8}>
                <div className="relative mt-14 aspect-[4/5] w-full bg-stone-white md:mt-20">
                  <Image
                    src={approach.image.src}
                    alt={approach.image.alt}
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
                  lines={approach.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={approach.body}
              />

              <div className="mt-16 grid grid-cols-2 gap-x-gutter gap-y-10 sm:grid-cols-4">
                {stats.map((stat, i) => (
                  <Reveal key={i} delay={i * 0.08} distance={14}>
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
              <SectionTitle>{teamCopy.label}</SectionTitle>
              <div>
                <h2>
                  <MaskText
                    className="font-headline-lg text-headline-lg text-primary"
                    lines={teamCopy.heading}
                  />
                </h2>
                <MaskText
                  delay={0.15}
                  className="font-body-lg text-body-lg text-on-surface-variant mt-6 max-w-xl"
                  lines={teamCopy.body}
                />
              </div>
            </div>

            <TeamGrid members={team.members} />
          </div>
        </section>

        {/* ─── Construction partners — LIGHT ───
            Same partner record as /services (Admin → Company); kept compact here. */}
        <section id="construction-partners" className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{partners.label}</SectionTitle>
            <div>
              <MaskText
                className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
                lines={partner.body}
              />

              <Reveal delay={0.15}>
                <div className="mt-10 grid grid-cols-1 border-t border-mortar-grey sm:grid-cols-3">
                  {partner.capabilities.map((capability, i) => (
                    <div
                      key={`${i}-${capability}`}
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
                    href={partner.url}
                    external
                  >
                    {partner.name}
                  </StyledLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── CTA — DARK ─── */}
        <CtaSection
          tone="ink-deep"
          titleLines={cta.title}
          actions={[
            { label: cta.primaryLabel, href: cta.primaryHref },
            { label: cta.secondaryLabel, href: cta.secondaryHref, variant: "outline" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
