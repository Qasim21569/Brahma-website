import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const pillars = [
  {
    num: "01",
    title: "Acquisition",
    desc: "Identifying structurally sound opportunities with intrinsic value in prime markets.",
  },
  {
    num: "02",
    title: "Management",
    desc: "Rigorous financial oversight and asset repositioning to maximize yield and longevity.",
  },
  {
    num: "03",
    title: "Operations",
    desc: "Executing exceptional guest experiences aligned with institutional investment goals.",
  },
];

const trackRecords = [
  {
    property: "The Mercer Estate",
    location: "New York",
    category: "Luxury Boutique",
    year: "2019",
  },
  {
    property: "Vespera Resort",
    location: "Los Angeles",
    category: "Lifestyle Resort",
    year: "2021",
  },
  {
    property: "Aura Tower",
    location: "Chicago",
    category: "Urban Core",
    year: "2023",
  },
];

const stats = [
  { num: "14", label: "Properties Managed" },
  { num: "25", label: "Years of Heritage" },
  { num: "6", label: "Global Regions" },
];

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
            </div>
            <div className="col-span-12 md:col-span-4 mt-12 md:mt-0 relative">
              <div
                className="absolute -left-12 -top-12 w-64 h-64 border border-mortar-grey opacity-20 pointer-events-none hidden md:block"
                style={{ borderRadius: "0 40% 0 0" }}
              />
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-white">
                <img
                  className="w-full h-full object-cover grayscale opacity-90 transition-opacity duration-700 hover:opacity-100 hover:grayscale-0"
                  data-alt="Modern luxury hotel lobby featuring brutalist stone elements, natural light casting strong structural shadows."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-ssHBVQeIHG0CGFlN-T6FRm7B85za77R065XVamDAjyIyXDPeIK5ng-TPFf-j8yAlcP7shmDwtbWDY35bvrCK5EQOvvg7nzDRJrVvsEoCJKDXIdPboQL-UrKalldT5DqhI1ZkrUGgE11YETuTGJbqyaRefzMS2yrbPdP0EdyiyszLzJAm-qnIcr_RaDA8LPjE450Ne9vHsSgdqVb4zYqUck5K1296gUQNWK_kTFCChJN-AaP9FRx7"
                  alt="Hotel lobby architectural photography"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-3 mt-12 hidden md:block reveal">
              <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover grayscale opacity-80"
                  data-alt="Abstract close up of raw concrete and smooth wood textures intersecting, architectural detail shot."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1My4tdT1LJfLwSEQGHbHTJh6MQdav90k2iA86ex_Br3tQgvyN1fwIHcL-XxxZ0Mat1MsmfynVC09r-bvktlIgzOlozLg5PMD7MmHh-2kQSDFil1HkcIKY0VfMGUk0PH2ybTS18b8nebkvW6T-rVmnQRKKBlJ9Fb6prHhdz62szfL06PYqpWuZL-FVxQ32GDZ8_zp4Yq6g5I6PzHwaq13J7n-2-Y1N27rzHh6oisAJzO8Eikvh40H0"
                  alt="Concrete and wood texture architectural detail"
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
            <span className="font-display-hero text-[300px] leading-none text-white whitespace-nowrap font-bold tracking-tighter opacity-5">
              BRAHMA
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

        {/* ─── Track Record ─── */}
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

        {/* ─── Stats Bar ─── */}
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
