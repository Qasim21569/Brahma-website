import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
// PARKED — see the commented section below. Held back deliberately, not dead.
// import { ThresholdReveal } from "@/components/sections/ThresholdReveal";
import { PillarCard } from "@/components/ui/PillarCard";
import { StyledLink } from "@/components/ui/StyledLink";
import { CtaSection } from "@/components/sections/CtaSection";
import Accordion from "@/components/ui/Accordion";
import { getSection, getSections } from "@/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { metaDescription } = await getSection("services.hero");
  return { title: "What We Do", description: metaDescription };
}

export default async function ServicesPage() {
  const [hero, band, pillarsCopy, partnerCopy, faq, cta, partner] = await getSections(
    "services.hero",
    "services.band",
    "services.pillars",
    "services.partner",
    "services.faq",
    "services.cta",
    "company.partner",
  );
  // PillarCard expects `subunit` only where one is named.
  const pillars = pillarsCopy.pillars.map(({ subunit, ...p }) =>
    subunit.trim() ? { ...p, subunit } : p,
  );

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {/* ─── Hero — LIGHT ───
            Capability framing, not a services menu. BMIG operates what it owns,
            so this page proves execution to sellers, lenders and franchisors
            rather than selling services to third parties. */}
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
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={hero.body}
              />
              {/* Was <InlineList> — the six capabilities set slash-separated on
                  one wrapping line. The client asked for a list, and they were
                  right: as running text the items read as one long phrase and
                  the wrap points landed arbitrarily, so "Capital structuring"
                  could break across lines. As rows they are scannable and the
                  count is legible at a glance.

                  ⚠️ No numerals. Numbering has been rejected twice on this
                  project — SectionTitle v4 and the PillarCard sub-rows — so
                  the row marker is the same square used by SectionTitle. */}
              <ul className="mt-10 grid max-w-2xl grid-cols-1 gap-x-gutter sm:grid-cols-2">
                {hero.capabilities.map((item, i) => (
                  <li key={`${i}-${item}`}>
                    <Reveal delay={(i % 2) * 0.08} distance={16}>
                      <div className="flex items-center gap-3 border-t border-mortar-grey/40 py-3.5">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 bg-muted-azure-dim"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {item}
                        </span>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── PARKED: the signature scroll sequence ─────────────────────────
            `sections/ThresholdReveal.tsx` is BUILT, VERIFIED AND INTENTIONALLY
            HELD BACK — the client is staging what they show, not rejecting it.

            ⚠️ It is therefore NOT an orphan. The playbook's "delete dead code
            immediately" rule does NOT apply to it. Do not remove the file.

            To re-enable: uncomment the import at the top of this file, swap the
            quiet band below for the block underneath, and drop the now-unused
            `Image` / `ResponsiveImage` imports.

            <ThresholdReveal
              src="/properties/hampton-inn-suites-tampa-east-seffner/g-01.jpg"
              alt="Hampton Inn & Suites Tampa East Seffner entrance"
              caption="Hampton Inn & Suites Tampa East — operated by Brahmas"
              topLine="Underwritten,"
              bottomLine="rebuilt, run."
            />
            ──────────────────────────────────────────────────────────────────── */}

        {/* ─── Full-bleed band ─── the quiet stand-in while the sequence is
            parked. parallaxAmount={20} is the full-bleed value per §2.3. */}
        <section className="px-margin-edge pb-section-gap">
          <ResponsiveImage parallaxAmount={20}>
            <div className="relative aspect-[16/10] w-full bg-stone-white md:aspect-[21/9]">
              <Image
                src={band.image.src}
                alt={band.image.alt}
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </ResponsiveImage>
        </section>

        {/* ─── Pillars — LIGHT ───
            A different axis from the homepage Process (Acquire → Renovate →
            Operate), which describes what happens to an asset over time. These
            describe what the group can do. Keep them distinct — see
            data/services.ts. */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{pillarsCopy.label}</SectionTitle>
            <div className="flex flex-col gap-20 md:gap-32">
              {pillars.map((pillar, i) => (
                <PillarCard
                  key={`${i}-${pillar.title}`}
                  pillar={pillar}
                  delay={i * 0.05}
                  operatedByLabel={pillarsCopy.operatedByLabel}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Construction partner — DARK ───
            ⚠️ Credited as a PREFERRED PARTNER only. The copy states the
            relationship and describes Heal Construct's own practice; it does
            NOT claim they delivered any BMIG property, and must not, without
            client confirmation. Their published portfolio is entirely
            residential — do not call them a hospitality contractor.
            See data/services.ts. */}
        <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle tone="light">{partner.role}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  /* Retitled 2026-08-17 on client feedback. Was "Built with
                     people who build for a living." — circular, and "built
                     with" edged toward implying a delivered joint project,
                     which this section must NOT claim (see the warning above
                     and data/services.ts). This version describes the group's
                     own selection discipline instead, so it says nothing about
                     what Heal Construct has or hasn't built for us. */
                  lines={partnerCopy.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-cream-dim mt-8 max-w-xl"
                lines={partner.body}
              />

              <Reveal delay={0.3}>
                {/* Hairline-divided, not numbered — these are three parallel
                    capabilities, not a sequence. */}
                <div className="mt-12 grid grid-cols-1 border-t border-white/15 sm:grid-cols-3">
                  {partner.capabilities.map((capability, i) => (
                    <div
                      key={`${i}-${capability}`}
                      className="border-b border-white/15 py-6 sm:border-b-0 sm:border-l sm:first:border-l-0 sm:py-8 sm:pl-6 sm:first:pl-0"
                    >
                      <span className="font-headline-md text-headline-md text-cream leading-tight">
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.45}>
                <div className="mt-10 max-w-xl">
                  <StyledLink
                    href={partner.url}
                    tone="light"
                    external
                  >
                    {partner.name}
                  </StyledLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Methodology — LIGHT ─── */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{faq.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={faq.heading}
                />
              </h2>
              <div className="mt-12">
                <Accordion items={faq.items}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA — DARK ───
            GhostWordmark rather than the one-off .brand-overlay class the old
            page used, so there is a single ghost-wordmark implementation. */}
        <CtaSection
          titleLines={[cta.title]}
          reveal="flicker"
          bodyLines={cta.body.length > 0 ? cta.body : undefined}
          actions={[{ label: cta.buttonLabel, href: cta.buttonHref, icon: true }]}
        />
      </main>
      <Footer />
    </>
  );
}
