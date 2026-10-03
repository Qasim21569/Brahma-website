import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { DrawnRule } from "@/components/ui/DrawnRule";
import { CtaSection } from "@/components/sections/CtaSection";
import Accordion from "@/components/ui/Accordion";
import { getSection, getSections } from "@/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription } = await getSection("careers.hero");
  return { title: metaTitle, description: metaDescription };
}

/**
 * The disciplines are the areas the group operates across, NOT a list of open
 * vacancies (Admin → Careers → Disciplines).
 *
 * ⚠️ The page this replaced advertised three specific job openings in
 * "New York, NY", "Miami, FL" and "London, UK". BMIG is a Florida operator with
 * no New York or London presence, and there is no confirmed vacancy list.
 * Publishing roles that do not exist is worse than a wrong address, because
 * people apply to them.
 */
export default async function CareersPage() {
  const [hero, path, disciplines, apply, cta, founder, contact] = await getSections(
    "careers.hero",
    "careers.path",
    "careers.disciplines",
    "careers.apply",
    "careers.cta",
    "company.founder",
    "global.contact",
  );

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {/* ─── Hero — LIGHT ─── */}
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
            </div>
          </div>
        </section>

        {/* ─── Full-bleed band ─── */}
        <section className="px-margin-edge pb-section-gap">
          <ResponsiveImage parallaxAmount={20}>
            <div className="relative aspect-[16/10] w-full bg-stone-white md:aspect-[21/9]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                sizes="100vw"
                className="object-cover object-center"
                loading="lazy"
              />
            </div>
          </ResponsiveImage>
        </section>

        {/* ─── The path — DARK ───
            Copy is the sourced founder narrative, not invented employer
            branding — keep it that way when editing. */}
        <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle tone="light">{path.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-cream"
                  lines={path.heading}
                />
              </h2>

              <div className="mt-12 grid grid-cols-1 gap-x-gutter gap-y-10 sm:grid-cols-2">
                {path.blocks.map((block, i) => (
                  <Reveal key={`${i}-${block.heading}`} delay={(i % 2) * 0.1}>
                    <div>
                      <DrawnRule className="mb-6 bg-white/20" delay={(i % 2) * 0.1} />
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

              <Reveal delay={0.25}>
                <blockquote className="mt-16 max-w-3xl">
                  <p className="font-headline-md text-headline-md text-cream leading-tight">
                    &ldquo;{path.quote}&rdquo;
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

        {/* ─── Disciplines — LIGHT ───
            Accordion per §5 E3. These are the areas the group operates in, NOT
            open vacancies — see the note on `disciplines` above. */}
        <section id="disciplines" className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{disciplines.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={disciplines.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={disciplines.body}
              />
              <div className="mt-12">
                <Accordion items={disciplines.items} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Applying — LIGHT (stone-white) ───
            An open application, because there is no confirmed vacancy list.
            When the client supplies real openings, they belong here. */}
        <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{apply.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={apply.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={apply.body}
              />
              <Reveal delay={0.35}>
                <div className="mt-10">
                  <a
                    href={`mailto:${contact.primaryEmail}?subject=${encodeURIComponent(
                      apply.emailSubject,
                    )}`}
                    className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-8 py-3.5 font-label-caps text-label-caps text-on-primary transition-opacity hover:opacity-90"
                  >
                    {apply.buttonLabel}
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
        <CtaSection
          titleLines={[cta.title]}
          reveal="flicker"
          bodyLines={cta.body.length > 0 ? cta.body : undefined}
        />
      </main>
      <Footer />
    </>
  );
}
