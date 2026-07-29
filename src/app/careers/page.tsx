import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const values = [
  {
    num: "01",
    title: "Calculated Precision",
    desc: "Every decision is grounded in data. We approach investments with a meticulous eye for detail, ensuring long-term viability and structural soundness.",
  },
  {
    num: "02",
    title: "Elevated Execution",
    desc: "We don't just allocate capital; we cultivate spaces. We value an aesthetic sensibility that elevates the guest experience and drives asset appreciation.",
  },
  {
    num: "03",
    title: "Enduring Vision",
    desc: "We build for the long term. Our perspective extends beyond immediate cycles, focusing on sustainable growth and generational asset preservation.",
  },
  {
    num: "04",
    title: "Collaborative Discipline",
    desc: "Rigorous debate is encouraged. We forge stronger strategies through diverse perspectives unified by a shared commitment to excellence.",
  },
];

const roles = [
  {
    title: "Director of Acquisitions",
    summary:
      "Lead identification and underwriting of premium hospitality assets across North American gateway markets.",
    location: "New York, NY",
  },
  {
    title: "VP, Asset Management",
    summary:
      "Drive operational excellence and execute value-add capital improvement programs for our flagship properties.",
    location: "Miami, FL",
  },
  {
    title: "Design Director",
    summary:
      "Oversee architectural standards and interior narratives for all new developments and major renovations.",
    location: "London, UK",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[120px]">
        {/* ─── Hero ─── */}
        <section className="px-margin-edge py-section-gap max-w-container-max mx-auto relative architectural-grid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-8 flex flex-col justify-center z-10">
              <Label withDot className="mb-4">
                Careers at Brahma Group
              </Label>
              <h1 className="font-display-hero text-display-hero text-ink-navy mb-8 max-w-4xl reveal">
                Building the foundations of modern hospitality.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
                We seek rigorous thinkers, strategic operators, and
                design-minded professionals who understand that enduring value
                requires both structural discipline and exceptional vision. Join
                us in shaping institutional-grade investments.
              </p>
              <div>
                <Button href="#open-roles" icon="arrow_downward">
                  View Open Roles
                </Button>
              </div>
            </div>
            <div className="lg:col-span-4 relative mt-12 lg:mt-0">
              <div className="aspect-[3/4] w-full bg-surface-container-highest relative overflow-hidden">
                <img
                  alt="Brahma Group Architecture"
                  className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-80"
                  data-alt="Architectural photograph of a modern institutional building interior with stone pillars and geometric shadows."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_yWaGsrHLg4VADg1a0U3M2G18zhRIt8xYH5-m94Foyr1beDZ_QC-c7UNCY8QHd6qGx-ZUVvcDrzrRX8AD2YrXK2GGjbd1Aw2VeR1dxrOYgzqQosGTAOJ5ar7RLFGwi2veY4KmZDXBYYjWCNOrYBkyfvEEoEvYf__OBrDwSVpsBmS3qoLAKBKoNZTx_pCr8F890YJnxcKUmraZlVpA28Fwbh-axS8UKml8-vkYvTRBTDuUZAtUmavh"
                />
                <div className="absolute right-8 top-0 bottom-0 w-px bg-mortar-grey opacity-50" />
                <div className="absolute bottom-8 left-0 right-0 h-px bg-mortar-grey opacity-50" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Values ─── */}
        <section className="bg-ink-navy text-stone-white py-section-gap px-margin-edge relative overflow-hidden bg-pattern-stone">
          <div className="absolute top-0 left-0 w-full h-px bg-on-primary-fixed-variant opacity-20" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-on-primary-fixed-variant opacity-20" />
          <div className="absolute top-0 left-[20%] w-px h-full bg-on-primary-fixed-variant opacity-10" />
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10">
            <div className="lg:col-span-4 lg:col-start-1 mb-16 lg:mb-0">
              <h2 className="font-headline-lg text-headline-lg mb-6 reveal">
                Structural Integrity in Action
              </h2>
              <p className="font-body-md text-body-md text-on-primary-container max-w-sm">
                Our culture is engineered for excellence. We operate with the
                precision of a blueprint, balancing rigorous analysis with an
                appreciation for the aesthetics of hospitality.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {values.map((value) => (
                <div
                  key={value.num}
                  className="border-t border-on-primary-fixed-variant pt-6 reveal"
                >
                  <Label className="mb-4 block">
                    {value.num}
                  </Label>
                  <h3 className="font-headline-md text-headline-md mb-4">
                    {value.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-primary-container">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Open Roles ─── */}
        <section
          className="py-section-gap px-margin-edge max-w-container-max mx-auto"
          id="open-roles"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-16">
            <div className="lg:col-span-5">
              <h2 className="font-headline-lg text-headline-lg text-ink-navy">
                Current Openings
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Explore opportunities to contribute to our portfolio. We are
                continually seeking exceptional talent across acquisitions,
                asset management, and design operations.
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-mortar-grey font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              <div className="col-span-5 md:col-span-4">Role</div>
              <div className="col-span-7 md:col-span-5">Summary</div>
              <div className="hidden md:block col-span-2 text-right">
                Location
              </div>
              <div className="hidden md:block col-span-1 text-right" />
            </div>
            {roles.map((role) => (
              <a
                key={role.title}
                href="#"
                className="grid grid-cols-12 gap-4 py-8 border-b border-mortar-grey group hover:bg-surface-variant transition-colors items-center -mx-4 px-4 reveal"
              >
                <div className="col-span-12 md:col-span-4 mb-2 md:mb-0" data-label="Role">
                  <h3 className="font-headline-md text-headline-md text-ink-navy group-hover:text-muted-azure transition-colors">
                    {role.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5 mb-4 md:mb-0 pr-8" data-label="Summary">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {role.summary}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 text-left md:text-right font-body-md text-body-md text-ink-navy" data-label="Location">
                  {role.location}
                </div>
                <div className="col-span-6 md:col-span-1 text-right flex justify-end items-center">
                  <span className="material-symbols-outlined text-muted-azure group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ─── Application Process ─── */}
        <section className="bg-surface-container py-section-gap px-margin-edge border-t border-mortar-grey">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4 lg:col-start-2">
              <Label withDot className="mb-4">
                The Process
              </Label>
              <h2 className="font-headline-lg text-headline-lg text-ink-navy mb-8">
                How to Apply
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                We value clarity and intent. If you do not see a role that fits
                your expertise but believe you align with our investment
                philosophy, we invite you to submit a general application.
              </p>
              <Button href="mailto:careers@brahmagroup.com" icon="mail">
                Email Curriculum Vitae
              </Button>
            </div>
            <div className="lg:col-span-5 lg:col-start-7 mt-12 lg:mt-0 flex flex-col gap-8">
              {[
                { num: "1", title: "Submission", desc: "Provide a comprehensive CV and a concise statement of intent detailing your relevant track record." },
                { num: "2", title: "Review", desc: "Our principal partners review all submissions. Expect correspondence within fourteen business days." },
                { num: "3", title: "Dialogue", desc: "Selected candidates will engage in a series of strategic discussions with leadership." },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className={`flex gap-6 ${i < 2 ? "border-b border-mortar-grey pb-8" : ""}`}
                >
                  <div className="font-stat-display text-stat-display text-muted-azure opacity-50">
                    {step.num}
                  </div>
                  <div className="reveal">
                    <h4 className="font-headline-md text-headline-md text-ink-navy mb-2">
                      {step.title}
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
