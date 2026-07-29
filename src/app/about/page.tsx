import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Label } from "@/components/ui/Label";

const leaders = [
  {
    name: "Julian Vance",
    role: "Managing Partner",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzLE2nJwOZlSmIWUi0IZMG1qkxVxHu9Uc9BpwexCvTeG9KBoEzRnZFmlU8Y5--WU-IYi0FMfCfUnH0cwfLDhyxrjrZrLngVtksroruUWZrvYBVW1dQ_eWOOjpYAfAKX70T9IaFQH2TPXDeuMk1DKVzyPs7pgHoLGs-scjK0Jn1FggCPuERYmz7Q0-MJ71wy3gxk5jggo2rM122wF18Z3nBRVinnr0HjwwYrcBxrtQcdfl97rbrZ5fi",
  },
  {
    name: "Elena Rostova",
    role: "Director of Acquisitions",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmVAZDDRsdjT2zchmnvVM-THaqQ8JvF9JLWvKqG6jOQoUfyofkwk91TqavnXv6wVbNQNQn0VB-zl2YS6uvgaISkl4t7FfyXovEEl61oKYdXsASxDzuplUrReG46rCYZtBQ4-PhOdJATlggbAVav6Pyh4JMn4TUlSTZ-EdjxDUqI1t6cafLldX-608ODgsqTVNuuA1cE6wQrq-t3plZWj7YMCNCRDQQdsWKLSWqK5JswFeL7mwdthcd",
  },
  {
    name: "Marcus Thorne",
    role: "Head of Operations",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpT4yiB2VfxsL3YHGSjkGEZbAw-cJBTwqQmb-fbK39Xhpg9MdiXGvdqJ_4rj5cCiN9uSA6liJ_A7h3vjJ8xOYM-8CN3wl7yGJSCFkpM3IygcUy6m8PzUqzEW-ao5Q6-cgwBHJhKVDuFn3Nk1lWpATdcu6hE4IKE9iks3_G4l16U3mkp9dE6mcqTgpzo7MMN8D4eKRvXSuaM2HENdAre-8wyO2kUA5nIxC0_i7-r57a2R2M_oO0jz9e",
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
                Brahma Group is built on a foundation of rigorous structural
                permanence and curated hospitality. We identify, acquire, and
                elevate properties that define regional prestige.
              </p>
            </div>
            <div className="md:col-span-5 mt-12 md:mt-0 relative h-[400px] md:h-auto overflow-hidden bg-stone-white">
              <div
                className="absolute inset-0 bg-cover bg-center grayscale opacity-80 mix-blend-multiply"
                data-alt="Black and white architectural photography of a brutalist concrete building facade."
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
                  We believe in spaces that endure, designed with intention and
                  managed with exacting precision.
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Our investment strategy is not dictated by fleeting trends. We
                  focus on core assets characterized by superior location,
                  structural longevity, and the potential for operational
                  excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Leadership ─── */}
        <section className="py-section-gap px-margin-edge max-w-container-max mx-auto">
          <div className="mb-12">
            <Label withLine>Leadership</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {leaders.map((person) => (
              <div key={person.name} className="group cursor-pointer reveal">
                <div className="aspect-[3/4] bg-surface-container-high relative overflow-hidden mb-6">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale transition-transform duration-700 group-hover:scale-105"
                    data-alt={`Professional editorial portrait of ${person.name}`}
                    style={{ backgroundImage: `url('${person.img}')` }}
                  />
                </div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  {person.name}
                </h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 uppercase">
                  {person.role}
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
