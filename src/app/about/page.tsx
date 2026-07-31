import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Label } from "@/components/ui/Label";

const leaders = [
  {
    role: "Founder & Managing Partner",
    caption: "Acquisition & Capital",
  },
  {
    role: "Director of Acquisitions",
    caption: "Underwriting & Diligence",
  },
  {
    role: "Head of Operations",
    caption: "Brahmas Hospitality Management",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[104px]">
        {/* ─── Hero ─── */}
        <section className="pt-8 pb-section-gap px-margin-edge max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7">
              <Label withDot className="mb-4">
                Our Story
              </Label>
              <h1 className="font-display-hero text-display-hero text-primary mb-8 reveal">
                Architectural Integrity in Hospitality Investment
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                We acquire, renovate, and operate underperforming hotel
                assets so that structural quality is matched by long-term
                financial performance.
              </p>
            </div>
            <div className="md:col-span-5 mt-12 md:mt-0 relative h-[400px] md:h-auto overflow-hidden bg-stone-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                data-alt="Architectural detail of a hospitality property after capital improvement"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYnpM9P6G5B9vHFE_MxNwmbKas914mcyWG9wGk6RdzE1S1Ml5NWfGaLevikC5bCF8EAhR7WI25xhulJb9UFxEYOQIFQB3Zc64bgyC3ULb4mgadnvsmJbRTaPTFd1XOlB9f6O4M9SX9vKAa90VHP8Xy7bqngdLTS7rvCFIDtWfO-o0YnVysfaYrgObMgg_ZClFyYM3X-hIfhbPDaRbRSb5YgQOkuWysB5BPjNZncEJrj7FvCpKe6QKk')",
                }}
              />
            </div>
          </div>
        </section>

        {/* ─── Philosophy ─── */}
        <section className="py-section-gap px-margin-edge bg-stone-white hairline-t hairline-b">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4">
                <Label>Philosophy</Label>
              </div>
              <div className="md:col-span-8">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6 reveal">
                  We believe in spaces that endure, designed with intention
                  and managed with exacting precision.
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Our investment strategy is not dictated by fleeting
                  trends. We focus on core assets characterized by superior
                  location, structural longevity, and the potential for
                  operational excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Leadership (titles only — owner fills at handover) ─── */}
        <section className="py-section-gap px-margin-edge max-w-container-max mx-auto">
          <div className="mb-12">
            <Label withLine>Leadership</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {leaders.map((person) => (
              <div
                key={person.role}
                className="reveal"
              >
                <div className="aspect-[3/4] bg-surface-container-highest relative overflow-hidden mb-6 flex items-end p-6">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-primary"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0))",
                    }}
                  />
                  <span className="font-headline-md text-headline-md text-white relative">
                    Brahmas
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  {person.role}
                </h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 uppercase">
                  {person.caption}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
