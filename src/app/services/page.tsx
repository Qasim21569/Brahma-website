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
import { InlineList } from "@/components/ui/InlineList";
import { PillarCard } from "@/components/ui/PillarCard";
import { FlickerText } from "@/components/ui/FlickerText";
import { StyledLink } from "@/components/ui/StyledLink";
import { GhostWordmark } from "@/components/ui/GhostWordmark";
import Accordion from "@/components/ui/Accordion";
import { pillars, capabilityChips, constructionPartner } from "@/data/services";

export const metadata: Metadata = {
  title: "What We Do | Brahmas Management and Investment Group",
  description:
    "Brahmas acquires, repositions, and directly operates its own assets — capital, repositioning, and operations under one roof.",
};

export default function ServicesPage() {
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
            <SectionTitle className="text-on-surface-variant">
              What We Do
            </SectionTitle>
            <div>
              <h1>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["Capital, construction,", "and operations under", "one roof."]}
                />
              </h1>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "We do not assemble a chain of vendors around",
                  "an asset. The group underwrites it, funds it,",
                  "rebuilds it, and then runs it.",
                ]}
              />
              <InlineList
                className="font-label-caps text-label-caps text-on-surface-variant mt-10 max-w-2xl"
                items={capabilityChips}
              />
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
              src="/site-photos/Clarion-Pointe-8.webp"
              alt="Clarion Pointe Tampa, acquired and repositioned by Brahmas"
              caption="Clarion Pointe Tampa — acquired and repositioned, 2024"
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
                src="/site-photos/Clarion-Pointe-8.webp"
                alt="Clarion Pointe Tampa, acquired and repositioned by Brahmas"
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
            <SectionTitle className="text-on-surface-variant">
              Capabilities
            </SectionTitle>
            <div className="flex flex-col gap-20 md:gap-32">
              {pillars.map((pillar, i) => (
                <PillarCard key={pillar.title} pillar={pillar} delay={i * 0.05} />
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
            <SectionTitle className="text-cream-dim">
              {constructionPartner.role}
            </SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  lines={["Built with people who", "build for a living."]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-cream-dim mt-8 max-w-xl"
                lines={constructionPartner.body}
              />

              <Reveal delay={0.3}>
                {/* Hairline-divided, not numbered — these are three parallel
                    capabilities, not a sequence. */}
                <div className="mt-12 grid grid-cols-1 border-t border-white/15 sm:grid-cols-3">
                  {constructionPartner.capabilities.map((capability) => (
                    <div
                      key={capability}
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
                    href={constructionPartner.url}
                    tone="light"
                    external
                  >
                    {constructionPartner.name}
                  </StyledLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Methodology — LIGHT ─── */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle className="text-on-surface-variant">
              Methodology
            </SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={["The questions we get", "asked most."]}
                />
              </h2>
              <div className="mt-12">
                <Accordion
                  items={[
                    {
                      title: "How do you identify acquisition targets?",
                      body: "We evaluate assets against two criteria: structural permanence of the real estate, and a measurable gap between current operating performance and potential. We look for properties whose physical quality — location, construction, design intent — exceeds their current financial output, typically because of underinvestment or brand misalignment.",
                    },
                    {
                      /* Rewritten 2026-08-13. The previous answer claimed "our
                         construction team oversees every phase", which asserted
                         an in-house construction capability the group does not
                         have and contradicted crediting an external partner. */
                      title: "Who carries out the renovation work?",
                      body: "Scope is defined property by property — structural repairs, systems upgrades, interior repositioning, or brand alignment — and Brahmas directs it. Delivery is carried out with specialist design-build partners rather than an in-house contracting arm. What we do not delegate is the operating model: the asset is run by Brahmas once the work is complete.",
                    },
                    {
                      title: "Why operate properties directly rather than franchising out management?",
                      body: "Operating directly keeps accountability for the guest experience and the financial result in the same place. Operators who run an asset as though they already own it produce better outcomes, and that discipline only survives if the people who underwrote the investment are the people answering for it.",
                    },
                    {
                      title: "What types of properties are in the portfolio?",
                      body: "Hospitality is the core competency, but the group operates across asset classes — hotels, an early-education facility, and residential property. The unifying thread is structural quality that has been underleveraged, in a market position that rewards professional management.",
                    },
                    {
                      title: "How do you measure whether a repositioning worked?",
                      body: "Against the investment thesis set at acquisition, reviewed quarterly. Performance is measured relative to what the specific asset should be capable of given its location and construction — not against a market average that may be set by weaker competitors.",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA — DARK ───
            GhostWordmark rather than the one-off .brand-overlay class the old
            page used, so there is a single ghost-wordmark implementation. */}
        <section className="relative overflow-hidden bg-primary py-section-gap text-cream md:py-24">
          <GhostWordmark>BRAHMAS</GhostWordmark>
          <div className="relative z-10 px-margin-edge text-center">
            <h2 className="font-headline-lg text-headline-lg text-cream">
              <FlickerText>Start a conversation.</FlickerText>
            </h2>
            <MaskText
              delay={0.15}
              className="font-body-lg text-body-lg mx-auto mt-8 max-w-xl text-cream/70"
              lines={[
                "Whether you are selling an asset or financing",
                "one, we would rather talk early than late.",
              ]}
            />
            <Reveal delay={0.4}>
              <div className="mt-10 flex justify-center">
                <a
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-3 rounded-full bg-cream px-8 py-3.5 font-label-caps text-label-caps text-ink-deep transition-opacity hover:opacity-90"
                >
                  Reach out to us
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
        </section>
      </main>
      <Footer />
    </>
  );
}
