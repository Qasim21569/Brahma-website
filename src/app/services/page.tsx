import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Icon } from "@/components/ui/Icon";
import Accordion from "@/components/ui/Accordion";
import Image from "next/image";

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
      <div aria-hidden="true" className="brand-overlay">BRAHMAS</div>
      <main className="relative z-10 pt-[var(--nav-h)]">
        {/* ─── Hero ─── */}
        <header className="px-margin-edge mb-section-gap pt-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7">
              <Label withDot className="mb-4">
                OUR SERVICES
              </Label>
              <h1 className="font-display-hero text-display-hero text-primary mb-8 max-w-4xl">
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
        <section className="px-margin-edge mb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter hairline-t pt-12">
            <div className="md:col-span-4 mb-8 md:mb-0">
              <h2 className="font-headline-md text-headline-md text-primary sticky top-32">
                Acquisition
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="aspect-[16/9] w-full bg-stone-white mb-8 overflow-hidden relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg2xlDwvsxDSo5RdnvAPxS7qg31sHS9m20Q1kMGDOhiJ3QSKNW048wBLCzHcfqIP_xamC2IuaU2hbor3i1vJPSotS8PJYHTvzaV6wyPC-No5bxLRcRwMLW3SoYtIO6pR-rZFxQgw-duDTUpRbDzXpH2U3wadpJ-GwhSQq65zytm1Sq6SLrSDcVbR8L1n1XEEVlPINGxHzuUchFS4y_AJrSlZRYdCj4nb7PADLsgfcFR5_UrHEhzwKh"
                  alt="Acquisition architectural photography"
                  fill
                  className="object-cover opacity-90"
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
                  Brahmas Capital Partners
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Management (Dark Anchor) ─── */}
        <section className="bg-ink-navy text-on-primary w-full py-section-gap mb-section-gap">
          <div className="px-margin-edge">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4 mb-8 md:mb-0">
                <h2 className="font-headline-md text-headline-md text-on-primary">
                  Management
                </h2>
              </div>
              <div className="md:col-span-8">
                <h3 className="font-headline-md text-headline-md text-on-primary mb-6">
                  Rigorous operational oversight.
                </h3>
                <p className="font-body-lg text-body-lg text-on-primary-container mb-12 max-w-2xl">
                  We implement institutional-grade management frameworks
                  designed to optimize asset performance while maintaining the
                  distinct character of each property.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 hairline-t border-on-primary-fixed-variant pt-8">
                  <div >
                    <Icon
                      name="monitoring"
                      className="text-[32px] text-muted-azure mb-4 block"
                    />
                    <h4 className="font-body-lg text-body-lg mb-2">
                      Performance Analytics
                    </h4>
                    <p className="font-body-md text-body-md text-on-primary-container">
                      Granular tracking of operational metrics against
                      investment thesis parameters.
                    </p>
                  </div>
                  <div >
                    <Icon
                      name="architecture"
                      className="text-[32px] text-muted-azure mb-4 block"
                    />
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
        <section className="px-margin-edge mb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter hairline-t pt-12">
            <div className="md:col-span-4 mb-8 md:mb-0">
              <h2 className="font-headline-md text-headline-md text-primary">
                Operations
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="aspect-[4/3] w-full bg-stone-white mb-8 overflow-hidden md:w-3/4 float-none md:float-right ml-0 md:ml-8 relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG1mnHazzZZ3k9hEA68fYJ7-fXopl3E6IROmErFd5GSyZEoyBVjhE3aQHjmp-lpwEVY8ZYZasi4KKgqW6cNpeDXaSagwknC_JtHIF8n5_Z8Y0-7UBx3O7miwuZoMK1uAEuWKYoJpnCkB_CJ-LS_NA4-S61yjPaAwjIIbiGS5YFU94K127XLHEuHJq_6EJxK7FemXoNTyUhA-wPvQP3BHMc8NUwYLcP4F_3Q5A_JA7ZZytuT0Yx-pmc"
                  alt="Hotel lobby interior"
                  fill
                  className="object-cover opacity-90"
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
                  Brahmas Hospitality Management
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Engagement Process ─── */}
        <section className="px-margin-edge mb-section-gap">
          <Label withDot className="mb-12">
            ENGAGEMENT PROCESS
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter hairline-t pt-8">
            {[
              { num: "01", title: "Discovery", desc: "Initial dialogue with the operating partner to align investment parameters." },
              { num: "02", title: "Diligence", desc: "Rigorous financial and physical asset evaluation against our investment framework." },
              { num: "03", title: "Renovation", desc: "Capital deployment under Brahmas-led scope: physical asset, brand position, operating model." },
              { num: "04", title: "Operation", desc: "Direct operation under Brahmas Hospitality Management. Quarterly performance review." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`relative ${i > 0 ? "md:hairline-l md:pl-8 border-mortar-grey" : ""}`}
              >
                <span className="font-stat-display text-stat-display text-surface-dim md:absolute md:-top-8 md:-left-4 z-0 opacity-50 block mb-2 md:mb-0">
                  {step.num}
                </span>
                <div className="relative z-10 pt-0 md:pt-4">
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
        <section className="px-margin-edge mb-section-gap">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-12">
            Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-0 hairline-t">
            {capabilities.map((cap, i) => (
              <div
                key={cap}
                className={`py-6 hairline-b flex justify-between items-start ${
 i % 2 === 1 ? "md:hairline-l md:pl-6 border-mortar-grey" : ""
 }`}
              >
                <span className="font-body-lg text-body-lg text-primary">
                  {cap}
                </span>
                <Icon name="arrow_outward" className="text-muted-azure" />
              </div>
            ))}
          </div>
        </section>

        {/* ─── Methodology Accordion ─── */}
        <section className="px-margin-edge mb-section-gap">
          <Label withDot className="mb-12">
            METHODOLOGY
          </Label>
          <Accordion
            className="max-w-3xl"
            items={[
              {
                title: "How do you identify acquisition targets?",
                body: "We evaluate assets against two criteria: structural permanence of the real estate and a measurable gap between current operating performance and potential. We look for properties whose physical quality — location, construction, design intent — exceeds their current financial output, typically due to underinvestment or brand misalignment.",
              },
              {
                title: "What does your renovation process look like?",
                body: "Renovation is scoped property by property. We assess what each asset requires to reach its potential — structural repairs, systems upgrades, interior repositioning, or brand alignment — and deploy capital directly. We do not delegate to third-party management. Our construction team oversees every phase.",
              },
              {
                title: "Why operate properties directly rather than franchising?",
                body: "Operating directly allows us to maintain full accountability for the guest experience and financial performance. We found that the operators who run every asset as though they already own it produce better results. That discipline, applied consistently, is the Brahmas difference.",
              },
              {
                title: "What types of properties are in your portfolio?",
                body: "While hospitality is our core competency, Brahmas operates across operating asset classes — hotels, educational facilities, and residential properties. The unifying thread is structural quality that has been underleveraged, combined with a market position that rewards professional management.",
              },
              {
                title: "How do you measure renovation success?",
                body: "We benchmark against the investment thesis established at acquisition. RevPAR growth, GOP improvement, occupancy stabilization, and brand repositioning outcomes are tracked quarterly. We also measure structural improvements against the property's potential — not just against industry averages.",
              },
            ]}
          />
        </section>

        {/* ─── CTA ─── */}
        <section className="px-margin-edge mb-section-gap text-center pt-12">
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
