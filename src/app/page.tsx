import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { properties } from "@/data/properties";

const pillars = [
  {
    num: "01",
    title: "Acquire",
    desc: "Identifying underperforming hotels in markets whose structural quality exceeds their current operating performance.",
  },
  {
    num: "02",
    title: "Renovate",
    desc: "Capital deployment into physical asset, operating model, and brand positioning. We do not hand the keys to a third party.",
  },
  {
    num: "03",
    title: "Operate",
    desc: "Held and operated under Brahmas Hospitality Management. Quarterly performance review against investment thesis.",
  },
];

const stats = [
  { num: "02", label: "Properties under Brahmas Management" },
  { num: "2024", label: "Year of First Acquisition" },
  { num: "02", label: "Active Operating Subsidiaries" },
];

const trackRecords = properties.map((p) => ({
  property: p.shortName,
  location: p.city,
  category: p.category,
  year: p.acquiredYear,
}));

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[104px]">
        {/* ─── Hero ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto relative">
          <div className="grid-12">
            <div className="col-span-12 md:col-span-8 relative z-10">
              <h1 className="font-display-hero text-display-hero text-primary reveal">
                From acquisition to operation, we build hospitality that
                lasts.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-2xl reveal">
                We acquire, renovate, and operate underperforming hotel
                assets to institutional standards of performance.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 mt-12 md:mt-0 relative">
              <div
                className="absolute -left-12 -top-12 w-64 h-64 border border-mortar-grey opacity-20 pointer-events-none hidden md:block"
                style={{ borderRadius: "0 40% 0 0" }}
              />
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-white">
                <img
                  className="w-full h-full object-cover transition-opacity duration-700 hover:opacity-95"
                  data-alt="Brahmas hospitality asset, exterior architectural photography"
                  src={properties[0].homeHeroSrc}
                  alt={properties[0].gallery[0].alt}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Standalone Statement ─── */}
        <section className="py-section-gap bg-stone-white border-y border-mortar-grey">
          <div className="max-w-container-max mx-auto px-margin-edge flex justify-center text-center">
            <h2 className="font-headline-lg text-headline-lg text-primary max-w-3xl reveal">
              Every stage, one partner.
            </h2>
          </div>
        </section>

        {/* ─── Featured Properties (NEW) ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto">
          <div className="mb-12">
            <Label withLine className="mb-4">
              SELECTED PORTFOLIO
            </Label>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Two properties. One thesis.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {properties.map((p, i) => (
              <a
                key={p.slug}
                href="/portfolio"
                className={`col-span-12 md:col-span-6 reveal group block ${
                  i === 1 ? "md:mt-24" : ""
                }`}
              >
                <div
                  className="aspect-[4/5] w-full overflow-hidden bg-stone-white"
                  style={{
                    clipPath:
                      i === 0
                        ? "polygon(0% 0%, 100% 0%, 100% 88%, 78% 100%, 0% 100%)"
                        : "polygon(0% 0%, 100% 0%, 100% 100%, 22% 100%, 0% 88%)",
                  }}
                >
                  <img
                    className="w-full h-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-95"
                    data-alt={p.gallery[0].alt}
                    src={p.homeHeroSrc}
                    alt={p.gallery[0].alt}
                  />
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary">
                      {p.shortName}
                    </h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">
                      {p.city} &middot; {p.category}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-muted-azure transition-transform duration-300 ease-out group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-md">
                  {p.summary}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* ─── Three Pillars ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="border border-mortar-grey p-8 flex flex-col group hover:bg-surface-container transition-colors duration-300 reveal"
              >
                <div className="mb-16">
                  <Label withDot>{p.num}</Label>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">
                  {p.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Dark Anchor ─── */}
        <section className="bg-ink-navy w-full py-section-gap relative overflow-hidden flex items-center justify-center min-h-[60vh]">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            data-wordmark-scale
          >
            <span className="font-display-hero text-[120px] md:text-[300px] leading-none text-white whitespace-nowrap font-bold tracking-tighter opacity-5">
              BRAHMAS
            </span>
          </div>
          <div className="relative z-10 px-margin-edge text-center max-w-4xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-white mb-8 reveal">
              Architectural integrity translated into enduring financial
              performance.
            </h2>
            <Button href="/services" variant="light" icon="arrow_forward">
              Explore Our Thesis
            </Button>
          </div>
        </section>

        {/* ─── Track Record (real props only) ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto">
          <div className="mb-12">
            <Label withLine className="mb-4">
              TRACK RECORD
            </Label>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Selected Investments
            </h2>
          </div>
          <div className="w-full flex flex-col">
            <div className="grid grid-cols-12 gap-gutter architectural-line py-4 hidden md:grid font-label-caps text-label-caps text-on-surface-variant">
              <div className="col-span-4">Property</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2 text-right">Acquired</div>
            </div>
            {trackRecords.map((record) => (
              <div
                key={record.property}
                className="grid grid-cols-1 md:grid-cols-12 gap-gutter architectural-line py-6 items-center hover:bg-surface-container-high transition-colors reveal"
              >
                <div className="col-span-12 md:col-span-4 font-headline-md text-headline-md text-primary">
                  {record.property}
                </div>
                <div className="col-span-12 md:col-span-3 font-body-md text-body-md text-on-surface-variant md:mt-0 mt-2">
                  {record.location}
                </div>
                <div className="col-span-12 md:col-span-3 font-body-md text-body-md text-on-surface-variant md:mt-0 mt-1">
                  {record.category}
                </div>
                <div className="col-span-12 md:col-span-2 md:text-right font-body-md text-body-md text-primary md:mt-0 mt-1">
                  {record.year}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Stats Bar (real, conservative) ─── */}
        <section className="bg-stone-white py-section-gap md:py-24 border-y border-mortar-grey">
          <div className="max-w-container-max mx-auto px-margin-edge grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="font-stat-display text-stat-display text-primary mb-2"
                  data-countup={stat.num}
                >
                  {stat.num}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Contact CTA ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto flex justify-center">
          <div className="bg-stone-white border border-mortar-grey p-16 md:p-24 text-center max-w-3xl w-full reveal">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-8">
              Get in touch
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
              Discuss investment opportunities or institutional partnerships.
            </p>
            <Button href="/contact" icon="arrow_forward">
              Contact Our Team
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
