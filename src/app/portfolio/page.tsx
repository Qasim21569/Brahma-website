import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { properties } from "@/data/properties";

// Per-tile clip-paths for the asymmetric editorial gallery.
// Each path is unique so the cuts read as hand-authored, not template.
const heroCuts = [
  "polygon(0% 0%, 100% 0%, 100% 92%, 88% 100%, 0% 100%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 92%)",
];

const supportCutsByIndex = [
  // Five supporting tiles per property. Each leans inward, alternating sides.
  [
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 96% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 100%, 8% 100%)",
    "polygon(0% 0%, 100% 6%, 100% 100%, 0% 100%)",
  ],
  [
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    "polygon(4% 0%, 100% 0%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 94%, 0% 100%)",
  ],
];

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[104px]">
        {/* ─── Hero ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-8 flex flex-col justify-center">
              <Label withDot className="mb-4">
                Selected Portfolio
              </Label>
              <h1 className="font-display-hero text-display-hero text-primary mb-8 reveal">
                Two properties. One thesis: structural permanence earns
                long-term yield.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Both assets were acquired below replacement cost. Both have
                completed Brahmas-led renovation. Both run under Brahmas
                Hospitality Management.
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-mortar-grey mt-16" />
        </section>

        {/* ─── Featured Projects ─── */}
        <section className="px-margin-edge pb-section-gap max-w-container-max mx-auto">
          <div className="flex flex-col gap-section-gap">
            {properties.map((property, pIndex) => (
              <article key={property.slug}>
                {/* ─── Photos: hero first, then asymmetric supporting tiles ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                  <div className="md:col-span-12 relative">
                    <div
                      className="aspect-[16/9] w-full overflow-hidden bg-stone-white"
                      style={{ clipPath: heroCuts[pIndex] }}
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                        data-alt={property.gallery[0].alt}
                        src={property.homeHeroSrc}
                        alt={property.gallery[0].alt}
                      />
                    </div>

                    {/* Asymmetric supporting tiles */}
                    <div className="mt-12 grid grid-cols-12 gap-gutter">
                      {property.gallery.slice(1, 5).map((img, i) => {
                        const tileCols = i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5";
                        const tileOffset = i % 2 === 1 ? "md:mt-16" : "";
                        return (
                          <div
                            key={img.src}
                            className={`col-span-6 ${tileCols} ${tileOffset}`}
                          >
                            <div
                              className="aspect-[4/3] w-full overflow-hidden bg-stone-white"
                              style={{
                                clipPath:
                                  supportCutsByIndex[pIndex][i] ||
                                  supportCutsByIndex[pIndex][0],
                              }}
                            >
                              <img
                                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                                data-alt={img.alt}
                                src={img.src}
                                alt={img.alt}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ─── Divider with property index ─── */}
                <div className="flex items-center gap-6 mt-24 mb-12">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    ASSET {String(pIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-px bg-mortar-grey" />
                </div>

                {/* ─── Copy block: comes AFTER the photos (after the scroll) ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                  <div className="md:col-span-8 md:col-start-1">
                    <Label className="mb-4">
                      {property.category} &middot; {property.acquiredYear}
                    </Label>
                    <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
                      {property.name}
                    </h2>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-8">
                      {property.address}
                    </p>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                      {property.longform}
                    </p>
                  </div>

                  <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-8 mt-16 hairline-t pt-12">
                    <div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        OPERATING ENTITY
                      </span>
                      <span className="font-body-lg text-body-lg text-primary block">
                        {property.subunit}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        ACQUISITION THESIS
                      </span>
                      <span className="font-body-lg text-body-lg text-primary block">
                        {property.acquisition}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        RENOVATION SCOPE
                      </span>
                      <span className="font-body-lg text-body-lg text-primary block">
                        {property.renovation}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        OUTCOMES
                      </span>
                      <span className="font-body-lg text-body-lg text-on-surface-variant italic block">
                        {property.outcomesNote}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-12 mt-12 flex justify-end">
                    <Button href="/contact" icon="arrow_forward">
                      Discuss This Asset
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── All Projects Table (real props only) ─── */}
        <section className="bg-surface-container-high py-section-gap border-y border-mortar-grey">
          <div className="px-margin-edge max-w-container-max mx-auto">
            <h2 className="font-headline-md text-headline-md text-primary mb-12">
              All Projects
            </h2>
            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-mortar-grey font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hidden md:grid">
                <div className="col-span-5">Property</div>
                <div className="col-span-3">Location</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2 text-right">Date</div>
              </div>
              {properties.map((p) => (
                <div
                  key={p.slug}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-mortar-grey items-center transition-colors reveal"
                >
                  <div className="md:col-span-5 flex items-center gap-6">
                    <div className="w-16 h-16 bg-mortar-grey/30 overflow-hidden hidden md:block">
                      <img
                        className="w-full h-full object-cover"
                        data-alt={p.gallery[0].alt}
                        src={p.homeSatelliteSrc}
                        alt={p.gallery[0].alt}
                      />
                    </div>
                    <span className="font-body-lg text-body-lg text-primary font-bold">
                      {p.shortName}
                    </span>
                  </div>
                  <div className="md:col-span-3 font-body-md text-body-md text-on-surface-variant">
                    {p.city}
                  </div>
                  <div className="md:col-span-2 font-body-md text-body-md text-on-surface-variant">
                    {p.category}
                  </div>
                  <div className="md:col-span-2 md:text-right font-body-md text-body-md text-primary">
                    {p.acquiredYear}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Investment CTA ─── */}
        <section className="bg-primary text-on-primary py-section-gap relative overflow-hidden">
          <div className="px-margin-edge max-w-container-max mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7">
              <h2 className="font-headline-lg text-headline-lg mb-8">
                Structural growth through disciplined acquisition.
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container mb-12">
                We invite institutional partners to engage in our next phase
                of strategic hospitality acquisition.
              </p>
              <Button href="/contact" variant="light" icon="arrow_forward">
                Initiate Conversation
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
