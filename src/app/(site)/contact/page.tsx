import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { DrawnRule } from "@/components/ui/DrawnRule";
import { StyledLink } from "@/components/ui/StyledLink";
import { CtaSection } from "@/components/sections/CtaSection";
import { getSection, getSections } from "@/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription } = await getSection("contact.hero");
  return { title: metaTitle, description: metaDescription };
}

/** Topic values are derived from their labels, so editors only write labels. */
const topicValue = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "general";

export default async function ContactPage() {
  const [hero, direct, form, assets, cta, contact] = await getSections(
    "contact.hero",
    "contact.direct",
    "contact.form",
    "contact.assets",
    "contact.cta",
    "global.contact",
  );
  const { primaryEmail, operatingRegion, routes: contactRoutes, topics } = contact;

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

        {/* ─── Direct routes — DARK ───
            Email is prominent and comes before the form, per §5 E2: someone who
            already knows what they want should not have to fill anything in.
            ⚠️ Addresses were unconfirmed at build — see data/contact.ts.
            Edited in Admin → Site settings → Contact details. */}
        <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle tone="light">{direct.label}</SectionTitle>
            <div>
              <div className="flex flex-col">
                {contactRoutes.map((route, i) => (
                  <Reveal key={`${i}-${route.email}`} delay={i * 0.08}>
                    <div className="py-8">
                      <DrawnRule className="mb-8 bg-white/20" delay={i * 0.08} />
                      <div className="grid grid-cols-1 gap-x-gutter gap-y-3 md:grid-cols-[1fr_1.4fr]">
                        <div>
                          <span className="font-label-caps text-label-caps text-muted-azure">
                            {route.label}
                          </span>
                          <p className="font-body-md text-body-md text-cream-dim mt-2 max-w-xs">
                            {route.description}
                          </p>
                        </div>
                        <a
                          href={`mailto:${route.email}`}
                          className="font-headline-md text-headline-md text-cream leading-tight underline decoration-cream/25 underline-offset-[6px] transition-colors hover:decoration-cream"
                        >
                          {route.email}
                        </a>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <p className="font-label-caps text-label-caps text-cream-dim mt-10">
                  {direct.regionPrefix} {operatingRegion}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Enquiry form — LIGHT ───
            Architectural underline inputs (border-bottom only) per §5 E2.

            ⚠️ NO BACKEND. The form posts via `mailto:` because there is no
            handler and no form service configured. That is deliberate: a form
            that silently swallows submissions is worse than one that opens the
            visitor's mail client. If a real endpoint is added later, replace the
            action and drop `method="post"`. */}
        <section className="px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <div>
              <SectionTitle>{form.label}</SectionTitle>
              <p className="font-body-md text-body-md text-on-surface-variant mt-6 max-w-xs">
                {form.note}
              </p>
            </div>

            <form
              action={`mailto:${primaryEmail}`}
              method="post"
              encType="text/plain"
              className="max-w-2xl"
            >
              <div className="grid grid-cols-1 gap-x-gutter gap-y-10 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
                  >
                    {form.nameLabel}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={form.namePlaceholder || undefined}
                    className="architectural-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="organization"
                    className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
                  >
                    {form.orgLabel}
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    placeholder={form.orgPlaceholder || undefined}
                    className="architectural-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
                  >
                    {form.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={form.emailPlaceholder || undefined}
                    className="architectural-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="topic"
                    className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
                  >
                    {form.topicLabel}
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    defaultValue=""
                    className="architectural-select"
                  >
                    <option value="" disabled>
                      {form.topicPlaceholder}
                    </option>
                    {topics.map((topic, i) => (
                      <option key={`${i}-${topic.label}`} value={topicValue(topic.label)}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
                  >
                    {form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder={form.messagePlaceholder || undefined}
                    className="architectural-textarea"
                  />
                </div>
              </div>

              <Reveal delay={0.2}>
                <button
                  type="submit"
                  className="mt-12 inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-8 py-3.5 font-label-caps text-label-caps text-on-primary transition-opacity hover:opacity-90"
                >
                  {form.submitLabel}
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Reveal>
            </form>
          </div>
        </section>

        {/* ─── Reach an asset — LIGHT (stone-white) ───
            Real, verifiable routes: every property carries a confirmed phone
            number in properties.ts. This is the part of the page that is not
            waiting on client confirmation. */}
        <section className="bg-stone-white border-y border-mortar-grey px-margin-edge py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-gutter">
            <SectionTitle>{assets.label}</SectionTitle>
            <div>
              <h2>
                <MaskText
                  className="font-headline-lg text-headline-lg text-primary"
                  lines={assets.heading}
                />
              </h2>
              <MaskText
                delay={0.15}
                className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl"
                lines={assets.body}
              />
              <Reveal delay={0.35}>
                <div className="mt-10 flex max-w-xl flex-col gap-2">
                  {assets.links.map((link, i) => (
                    <StyledLink key={`${i}-${link.href}`} href={link.href}>
                      {link.label}
                    </StyledLink>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── CTA — DARK ─── */}
        <CtaSection
          titleLines={[cta.title]}
          reveal="flicker"
          actions={[{ label: primaryEmail, href: `mailto:${primaryEmail}` }]}
        />
      </main>
      <Footer />
    </>
  );
}
