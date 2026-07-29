import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const capabilities = [
  "Asset Management",
  "Valuation & Advisory",
  "Development Planning",
  "Capital Restructuring",
  "Operational Turnaround",
  "Brand Positioning",
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <div aria-hidden="true" className="brand-overlay">
        BRAHMA
      </div>
      <main className="relative z-10 pt-[104px]">
        {/* ─── Hero ─── */}
        <header className="px-margin-edge max-w-container-max mx-auto mb-section-gap pt-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7">
              <Label withDot className="mb-4">
                OUR SERVICES
              </Label>
              <h1 className="font-display-hero text-display-hero text-primary mb-8 max-w-4xl reveal">
                Architectural approaches to hospitality investment.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                We deploy capital with structural precision. From initial
                acquisition to rigorous operational management, our
                methodologies are built to endure.
              </p>
            </div>
          </div>
        </header>

        {/* ─── Acquisition ─── */}
        <section className="px-margin-edge max-w-container-max mx-auto mb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter hairline-t pt-12">
            <div className="md:col-span-4 mb-8 md:mb-0">
              <h2 className="font-headline-md text-headline-md text-primary sticky top-32">
                Acquisition
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="aspect-[16/9] w-full bg-stone-white mb-8 overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply"
                  data-alt="Brutalist concrete building exterior intersecting with a serene natural landscape."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg2xlDwvsxDSo5RdnvAPxS7qg31sHS9m20Q1kMGDOhiJ3QSKNW048wBLCzHcfqIP_xamC2IuaU2hbor3i1vJPSotS8PJYHTvzaV6wyPC-No5bxLRcRwMLW3SoYtIO6pR-rZFxQgw-duDTUpRbDzXpH2U3wadpJ-GwhSQq65zytm1Sq6SLrSDcVbR8L1n1XEEVlPINGxHzuUchFS4y_AJrSlZRYdCj4nb7PADLsgfcFR5_UrHEhzwKh"
                  alt="Acquisition architectural photography"
                />
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">
                Identifying structural value.
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-2xl">
                Our acquisition strategy focuses on undermanaged assets with
                sound fundamental architecture. We look for structural integrity
                in markets demonstrating long-term demographic resilience.
              </p>
              <div className="bg-surface-variant p-8 w-full max-w-xl">
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                  LEADING SUBSIDIARY
                </span>
                <span className="font-body-lg text-body-lg text-primary">
                  Brahma Capital Partners
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Management (Dark Anchor) ─── */}
        <section className="bg-ink-navy text-on-primary w-full py-section-gap mb-section-gap">
          <div className="px-margin-edge max-w-container-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4 mb-8 md:mb-0">
                <h2 className="font-headline-md text-headline-md text-on-primary">
                  Management
                </h2>
              </div>
              <div className="md:col-span-8">
                <h3 className="font-headline-md text-headline-md text-on-primary mb-6 reveal">
                  Rigorous operational oversight.
                </h3>
                <p className="font-body-lg text-body-lg text-on-primary-container mb-12 max-w-2xl">
                  We implement institutional-grade management frameworks
                  designed to optimize asset performance while maintaining the
                  distinct character of each property.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 hairline-t border-on-primary-fixed-variant pt-8">
                  <div className="reveal">
                    <span
                      className="material-symbols-outlined text-[32px] text-muted-azure mb-4 block"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      monitoring
                    </span>
                    <h4 className="font-body-lg text-body-lg mb-2">
                      Performance Analytics
                    </h4>
                    <p className="font-body-md text-body-md text-on-primary-container">
                      Granular tracking of operational metrics against
                      investment thesis parameters.
                    </p>
                  </div>
                  <div className="reveal">
                    <span
                      className="material-symbols-outlined text-[32px] text-muted-azure mb-4 block"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      architecture
                    </span>
                    <h4 className="font-body-lg text-body-lg mb-2">
                      Capital Improvement
                    </h4>
                    <p className="font-body-md text-body-md text-on-primary-container">
                      Strategic deployment of renovation capital to maximize
                      return on structural enhancements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Operations ─── */}
        <section className="px-margin-edge max-w-container-max mx-auto mb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter hairline-t pt-12">
            <div className="md:col-span-4 mb-8 md:mb-0">
              <h2 className="font-headline-md text-headline-md text-primary">
                Operations
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="aspect-[4/3] w-full bg-stone-white mb-8 overflow-hidden md:w-3/4 float-none md:float-right ml-0 md:ml-8">
                <img
                  className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply"
                  data-alt="Interior view of a high-end minimalist hotel lobby with textured stone surfaces."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG1mnHazzZZ3k9hEA68fYJ7-fXopl3E6IROmErFd5GSyZEoyBVjhE3aQHjmp-lpwEVY8ZYZasi4KKgqW6cNpeDXaSagwknC_JtHIF8n5_Z8Y0-7UBx3O7miwuZoMK1uAEuWKYoJpnCkB_CJ-LS_NA4-S61yjPaAwjIIbiGS5YFU94K127XLHEuHJq_6EJxK7FemXoNTyUhA-wPvQP3BHMc8NUwYLcP4F_3Q5A_JA7ZZytuT0Yx-pmc"
                  alt="Hotel lobby interior"
                />
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">
                Delivering hospitality at scale.
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Execution is paramount. We operate assets with a focus on
                standardizing excellence without commoditizing the guest
                experience.
              </p>
              <div className="bg-surface-variant p-8 w-full clear-both mt-8">
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                  LEADING SUBSIDIARY
                </span>
                <span className="font-body-lg text-body-lg text-primary">
                  Brahma Hospitality Management
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Engagement Process ─── */}
        <section className="px-margin-edge max-w-container-max mx-auto mb-section-gap">
          <Label withDot className="mb-12">
            ENGAGEMENT PROCESS
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter hairline-t pt-8">
            {[
              { num: "01", title: "Discovery", desc: "Initial dialogue to align investment parameters and structural requirements." },
              { num: "02", title: "Diligence", desc: "Rigorous financial and physical asset evaluation against our architectural standards." },
              { num: "03", title: "Execution", desc: "Seamless transition into our management framework and operational integration." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`relative ${i > 0 ? "md:hairline-l md:pl-8 border-mortar-grey" : ""}`}
              >
                <span className="font-stat-display text-stat-display text-surface-dim md:absolute md:-top-8 md:-left-4 z-0 opacity-50 block mb-2 md:mb-0">
                  {step.num}
                </span>
                <div className="relative z-10 pt-0 md:pt-4 reveal">
                  <h4 className="font-headline-md text-headline-md text-primary mb-4">
                    {step.title}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Capabilities ─── */}
        <section className="px-margin-edge max-w-container-max mx-auto mb-section-gap">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-12">
            Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-0 hairline-t">
            {capabilities.map((cap, i) => (
              <div
                key={cap}
                className={`py-6 hairline-b flex justify-between items-start reveal ${
                  i % 2 === 1 ? "md:hairline-l md:pl-6 border-mortar-grey" : ""
                }`}
              >
                <span className="font-body-lg text-body-lg text-primary">
                  {cap}
                </span>
                <span className="material-symbols-outlined text-muted-azure">
                  arrow_outward
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="px-margin-edge max-w-container-max mx-auto mb-section-gap text-center pt-12">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-8 max-w-2xl mx-auto">
            Discuss an investment or management opportunity.
          </h2>
          <Button href="/contact" icon="arrow_forward">
            START A CONVERSATION
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
