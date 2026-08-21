import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MaskText } from "@/components/ui/MaskText";
import { Hero } from "@/components/ui/Hero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StyledLink } from "@/components/ui/StyledLink";
import { CountUp } from "@/components/ui/CountUp";
import { BorderedButton } from "@/components/ui/BorderedButton";
import { CtaSection } from "@/components/sections/CtaSection";
import {
  ownPhotographyProperties as properties,
  enrichedProperties,
  assetTypeLabels,
} from "@/data/properties";
import {
  founder,
  BMIG_LOGO_FULL_SRC,
  BMIG_LOGO_FULL_SIZE,
} from "@/data/company";
import { AutoSlideImageContainer } from "@/components/ui/AutoSlideImageContainer";
import Process from "@/components/sections/Process";
import SelectedWork from "@/components/sections/SelectedWork";

/**
 * Every published figure is derived, never typed by hand — the section
 * previously claimed "02 properties" against a portfolio of 12. Only facts
 * supported by `properties.ts` or the LODGING interview appear here; no
 * financial figures.
 */
const stats: { to: number; label: string; pad?: number; suffix?: string }[] = [
  {
    to: enrichedProperties.length,
    pad: 2,
    label: "Operating assets",
  },
  {
    to: new Set(enrichedProperties.map((p) => p.assetType)).size,
    pad: 2,
    label: "Asset classes",
  },
  {
    to: founder.yearsInIndustryValue,
    suffix: "+",
    label: "Years operating experience",
  },
  {
    to: founder.firstOwnershipYear,
    label: "First ownership",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── */}
        <Hero
          imageSrc={properties[0].homeHeroSrc}
          imageAlt={properties[0].gallery[0].alt}
          headline={[
            "Capital with conviction.",
            "Operation with precision.",
          ]}
          action={
            <a
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-cream px-10 py-4 font-label-caps text-label-caps text-ink-deep transition-opacity hover:opacity-90"
            >
              Reach Out to Us
              <svg viewBox="0 0 16 16" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          }
        />

        {/* ─── About / Story ─── */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <div className="md:-mt-1.5">
              <SectionTitle>About Brahmas</SectionTitle>
              {/* Full client-supplied file, by request — see the note on
                  BMIG_LOGO_FULL_SRC for why this one usage keeps it while the
                  rest of the site uses the lightweight vector. */}
              <Reveal delay={0.15} distance={14}>
                <Image
                  src={BMIG_LOGO_FULL_SRC}
                  alt="Brahmas Management and Investment Group"
                  width={BMIG_LOGO_FULL_SIZE.width}
                  height={BMIG_LOGO_FULL_SIZE.height}
                  className="mt-14 h-auto w-52 md:mt-20 md:w-[30vw] md:max-w-[520px]"
                  unoptimized
                />
              </Reveal>
            </div>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={[
                    "Architectural integrity",
                    "translated into enduring",
                    "financial performance.",
                  ]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "Brahmas Management and Investment Group",
                  "acquires underperforming operating assets,",
                  "repositions them through capital investment,",
                  "and operates them directly under Brahmas",
                  "Hospitality Management — maintaining full",
                  "control from acquisition to performance.",
                ]}
              />
              <MaskText
                delay={0.2}
                className="font-body-lg text-body-lg text-on-surface-variant mt-10 max-w-xl"
                /* Rephrased 2026-08-17 on client feedback. The previous opening
                   — "Our story begins on the floor of a hotel" — was the only
                   line on the page written as storytelling rather than as a
                   statement of fact, and read soft against the paragraph above
                   it. Same substance, stated plainly. "Nearly three decades"
                   tracks `founder.yearsInIndustry` (27+); update both together. */
                lines={[
                  "Brahmas was founded by an operator rather",
                  "than an investor — nearly three decades of",
                  "running hotels before financing them. That",
                  "order, operator first and owner second, is",
                  "what sets the group apart.",
                ]}
              />
              <Reveal delay={0.5}>
                <div className="mt-10 flex flex-col gap-2 max-w-xl">
                  <StyledLink href="/about">Discover Brahmas</StyledLink>
                  <StyledLink href="/about#team">Meet the team</StyledLink>
                  <StyledLink href="/about#construction-partners">
                    Construction partners
                  </StyledLink>
                </div>
              </Reveal>
            </div>
          </div>
          {/* Inverted: quote in the narrow left column, image right —
              alternating against the block above, same [1fr_1.9fr] grammar. */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter md:mt-24">
            <div className="flex items-center">
              <MaskText
                className="font-headline-md text-headline-md text-primary max-w-sm"
                lines={[
                  "“We don’t buy hotels.",
                  "We buy the gap between",
                  "what an asset is and what",
                  "it could be — then we",
                  "close it.”",
                ]}
              />
            </div>

            <AutoSlideImageContainer
              images={properties
                .filter((p) => p.homeHeroSrc)
                .map((p) => ({
                  src: p.homeHeroSrc!,
                  alt: `${p.shortName} exterior`,
                }))}
              alt="Brahmas hospitality asset exterior"
            />
          </div>
        </section>

        {/* ─── Process ─── */}
        <Process />

        {/* ─── Selected Work ─── */}
        <SelectedWork />

        {/* ─── Philosophy ─── the investment thesis. The founder story lives in
             About/Story above and on /about; it must not be repeated here. */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>Philosophy</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={[
                    "Operational excellence",
                    "before financial",
                    "engineering.",
                  ]}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={[
                  "We acquire assets whose structural quality",
                  "exceeds their current operating performance,",
                  "deploy capital into the building and the brand,",
                  "and then run them ourselves.",
                ]}
              />
              <MaskText
                delay={0.2}
                className="font-body-lg text-body-lg text-on-surface-variant mt-10 max-w-xl"
                /* Rephrased 2026-08-17 on client feedback. The previous ending —
                   "the thesis survives contact with the property" — leaned on
                   a military idiom ("no plan survives contact with the enemy")
                   that reads obliquely if you don't know it, and framed the
                   claim defensively. Same point, stated as accountability. */
                lines={[
                  "No handoffs, and no third-party management.",
                  "The people who underwrite an asset are the",
                  "same people who go on to run it. A",
                  "projection here is written by whoever",
                  "will have to deliver it.",
                ]}
              />
              <Reveal delay={0.45}>
                <div className="mt-10">
                  <BorderedButton href="/about">Read our full story</BorderedButton>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Stats ─── every figure is derived from the data files so it can
             never drift from the portfolio. Do not hardcode these. */}
        <section className="bg-stone-white py-section-gap md:py-24 border-y border-mortar-grey">
          <div className="px-margin-edge grid grid-cols-1 gap-gutter md:grid-cols-[1fr_1.9fr]">
            <SectionTitle>
              By the numbers
            </SectionTitle>
            <div className="grid grid-cols-2 gap-x-gutter gap-y-12 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.05 * i} distance={14}>
                  <CountUp
                    to={stat.to}
                    pad={stat.pad}
                    suffix={stat.suffix}
                    className="font-stat-display text-stat-display text-primary block"
                  />
                  <span className="font-label-caps text-label-caps text-on-surface-variant mt-3 block">
                    {stat.label}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── dark band; sets bg AND text explicitly per §2.4. */}
        <CtaSection
          titleLines={["Ready to discuss", "your portfolio?"]}
          bodyLines={[
            "We are always looking to evaluate operating",
            "assets that match our investment thesis.",
          ]}
          actions={[{ label: "Get in touch", href: "/contact", icon: true }]}
        />
      </main>
      <Footer />
    </>
  );
}