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
import { BMIG_LOGO_FULL_SRC, BMIG_LOGO_FULL_SIZE } from "@/data/company";
import { AutoSlideImageContainer } from "@/components/ui/AutoSlideImageContainer";
import Process from "@/components/sections/Process";
import SelectedWork, { type SelectedWorkItem } from "@/components/sections/SelectedWork";
import { getPortfolio, getSections } from "@/content/server";

/**
 * Homepage. All copy is editable in Admin → Home; defaults live in
 * `src/content/sections/home.ts`. Layout, motion and section order are code.
 */
export default async function HomePage() {
  const [hero, about, process, selected, philosophy, statsCopy, cta, founder] = await getSections(
    "home.hero",
    "home.about",
    "home.process",
    "home.selectedWork",
    "home.philosophy",
    "home.stats",
    "home.cta",
    "company.founder",
  );
  const portfolio = await getPortfolio();

  /**
   * Every published figure is derived, never typed by hand — the section once
   * claimed "02 properties" against a portfolio of 12. Only the labels are
   * editable. No financial figures.
   */
  const stats: { to: number; label: string; pad?: number; suffix?: string }[] = [
    { to: portfolio.all.length, pad: 2, label: statsCopy.assetsLabel },
    { to: portfolio.assetClasses.length, pad: 2, label: statsCopy.classesLabel },
    { to: founder.yearsInIndustry, suffix: "+", label: statsCopy.yearsLabel },
    { to: founder.firstOwnershipYear, label: statsCopy.firstOwnershipLabel },
  ];

  /* The editor's pick, in their order. A slug that no longer resolves (the
     property was hidden or deleted) is dropped rather than rendered empty. */
  const withPhotos = portfolio.all.filter((p) => p.gallery.length > 0);
  const selectedItems: SelectedWorkItem[] = selected.properties
    .map((slug, i) => {
      const p = portfolio.get(slug);
      if (!p) return null;
      return {
        slug: p.slug,
        name: p.shortName,
        city: `${p.city}, ${p.state}`,
        summary: p.summary,
        src: p.homeHeroSrc ?? withPhotos[i % Math.max(withPhotos.length, 1)]?.homeHeroSrc ?? "",
      };
    })
    .filter((item): item is SelectedWorkItem => item !== null && item.src !== "");

  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── the image is an explicit editor choice (Admin → Home →
             Hero), never a side effect of portfolio order. The admin refuses an
             image carrying a photo credit here — there is no room to print one. */}
        <Hero
          imageSrc={hero.image.src}
          imageAlt={hero.image.alt}
          headline={hero.headline}
          action={
            <a
              href={hero.buttonHref}
              className="inline-flex items-center gap-3 rounded-full bg-cream px-10 py-4 font-label-caps text-label-caps text-ink-deep transition-opacity hover:opacity-90"
            >
              {hero.buttonLabel}
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
              <SectionTitle>{about.label}</SectionTitle>
              {/* Full client-supplied file, by request — see the note on
                  BMIG_LOGO_FULL_SRC for why this one usage keeps it while the
                  rest of the site uses the lightweight vector. The logo is
                  brand, not content, so it is not editable. */}
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
                  lines={about.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={about.body}
              />
              <MaskText
                delay={0.2}
                className="font-body-lg text-body-lg text-on-surface-variant mt-10 max-w-xl"
                /* "Nearly three decades" tracks the founder's years in the
                   industry (27+); update both together. */
                lines={about.body2}
              />
              <Reveal delay={0.5}>
                <div className="mt-10 flex flex-col gap-2 max-w-xl">
                  {about.links.map((link, i) => (
                    <StyledLink key={`${i}-${link.href}`} href={link.href}>
                      {link.label}
                    </StyledLink>
                  ))}
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
                lines={about.quote}
              />
            </div>

            {/* Creditless surface — the admin only accepts owned photography. */}
            <AutoSlideImageContainer
              images={about.slides.map(({ src, alt }) => ({ src, alt }))}
              alt="Brahmas hospitality asset exterior"
            />
          </div>
        </section>

        {/* ─── Process ─── */}
        <Process
          label={process.label}
          linkLabel={process.linkLabel}
          linkHref={process.linkHref}
          stages={process.stages}
        />

        {/* ─── Selected Work ─── */}
        {selectedItems.length > 0 && (
          <SelectedWork
            items={selectedItems}
            label={selected.label}
            cardLink={selected.cardLink}
            scrollHint={selected.scrollHint}
          />
        )}

        {/* ─── Philosophy ─── the investment thesis. The founder story lives in
             About/Story above and on /about; it must not be repeated here. */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{philosophy.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={philosophy.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={philosophy.body}
              />
              <MaskText
                delay={0.2}
                className="font-body-lg text-body-lg text-on-surface-variant mt-10 max-w-xl"
                lines={philosophy.body2}
              />
              <Reveal delay={0.45}>
                <div className="mt-10">
                  <BorderedButton href={philosophy.buttonHref}>
                    {philosophy.buttonLabel}
                  </BorderedButton>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Stats ─── every figure is derived from the portfolio and founder
             records so it can never drift. Do not hardcode these. */}
        <section className="bg-stone-white py-section-gap md:py-24 border-y border-mortar-grey">
          <div className="px-margin-edge grid grid-cols-1 gap-gutter md:grid-cols-[1fr_1.9fr]">
            <SectionTitle>{statsCopy.label}</SectionTitle>
            <div className="grid grid-cols-2 gap-x-gutter gap-y-12 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={i} delay={0.05 * i} distance={14}>
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
          titleLines={cta.title}
          bodyLines={cta.body.length > 0 ? cta.body : undefined}
          actions={[{ label: cta.buttonLabel, href: cta.buttonHref, icon: true }]}
        />
      </main>
      <Footer />
    </>
  );
}
