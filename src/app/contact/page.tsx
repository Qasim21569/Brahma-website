import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const contacts = [
  {
    title: "Investment Relations",
    email: "investments@brahmagroup.com",
    phone: "+1 (212) 555-0198",
  },
  {
    title: "Media & Press",
    email: "press@brahmagroup.com",
    phone: "+1 (212) 555-0199",
  },
  {
    title: "Global Headquarters",
    email: "info@brahmagroup.com",
    desc: "General inquiries regarding corporate operations.",
  },
];

const offices = [
  {
    city: "New York",
    address: "120 Avenue of the Americas, Suite 4500, New York, NY 10013",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATjhzCQhP2eDSYwGrJ5dy_Z1w8DJqFpS1-kmfk6B6jVE4NMu7mLbuzPmYSE2zMMnMODqE5brapbPt46zT5ZzmJnLTM73_SJBLPShjdK_4RTZqe7VXifkImsea2RgxNPbdjChmZvzh2AzTT-l0b9h2uW7diMP5jmPxSaq_xvU8gpOWZJXUebP4UouMnAlafTUBor-K3giX5j6BszAsAhy95I0aSeB50rtlcjUnDkzR2bxvDTYQU9rOC",
  },
  {
    city: "London",
    address: "15 St Helen's Place, Floor 8, London EC3A 6DQ",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAPyUANnnUhr627pyHGwOTQblSHU3Lul-Y9h9sc1DPO4AxKXQh6PzX4eN5cUj3IKZAAlBvQJl5Qka_tR55dXFA7kVLxPc85q277QmmGDoTkdfrTho7Na0kSU6FlJIU4PkZ4j3_6PQiV_HUlccKOZ-WUtyVSdfhzkGWbj1_AP7x7yWx0s4qIEBc4XIzeblUapJI0bG5eRZ_CaMwMrZm35hFVEI4ctj-vTzQBJwt707tnh9NuQfrqXlk",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[104px] pb-section-gap">
        <div className="max-w-container-max mx-auto px-margin-edge">
          {/* ─── Header ─── */}
          <section className="mb-24 md:mb-32">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-7">
                <h1 className="font-display-hero text-display-hero text-primary mb-8 md:mb-0 reveal">
                  Connect with Brahma Group
                </h1>
              </div>
              <div className="md:col-span-5 flex items-end">
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  For investment inquiries, press relations, or architectural
                  consultations, please direct your correspondence to the
                  appropriate department.
                </p>
              </div>
            </div>
            <div className="w-full h-px bg-mortar-grey mt-16" />
          </section>

          {/* ─── Form + Contacts ─── */}
          <section className="mb-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Form */}
              <div className="md:col-span-7 pr-0 md:pr-12">
                <div className="mb-12">
                  <Label className="block mb-4 text-primary">
                    INQUIRIES
                  </Label>
                  <div className="w-8 h-px bg-muted-azure mb-8" />
                </div>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        placeholder="First Last"
                        required
                        className="architectural-input"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        ORGANIZATION
                      </label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        className="architectural-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        required
                        className="architectural-input"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                        AREA OF INTEREST
                      </label>
                      <select required className="architectural-select">
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        <option value="investment">
                          Investment Opportunities
                        </option>
                        <option value="press">Press & Media</option>
                        <option value="acquisitions">
                          Property Acquisitions
                        </option>
                        <option value="careers">Careers</option>
                        <option value="other">General Inquiry</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                      MESSAGE
                    </label>
                    <textarea
                      placeholder="How can we assist you?"
                      required
                      rows={4}
                      className="architectural-textarea"
                    />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" icon="arrow_forward">
                      SUBMIT INQUIRY
                    </Button>
                  </div>
                </form>
              </div>

              {/* Direct Contacts */}
              <div className="md:col-span-5 mt-16 md:mt-0 pt-16 md:pt-0 border-t md:border-t-0 md:border-l border-mortar-grey pl-0 md:pl-12">
                <div className="mb-12">
                  <Label className="block mb-4 text-primary">
                    DIRECT CONTACTS
                  </Label>
                  <div className="w-8 h-px bg-muted-azure mb-8" />
                </div>
                <div className="space-y-12">
                  {contacts.map((contact, i) => (
                    <div key={contact.title} className="reveal">
                      <h3 className="font-headline-md text-headline-md text-primary mb-2">
                        {contact.title}
                      </h3>
                      {contact.desc && (
                        <p className="font-body-md text-body-md text-on-surface-variant mb-1">
                          {contact.desc}
                        </p>
                      )}
                      <p className="font-body-md text-body-md text-on-surface-variant mb-1">
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {contact.phone}
                        </p>
                      )}
                      {i < contacts.length - 1 && (
                        <div className="w-full h-px bg-mortar-grey opacity-50 mt-12" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─── Offices ─── */}
          <section className="bg-surface-container-high py-section-gap md:py-24 -mx-margin-edge px-margin-edge">
            <div className="max-w-container-max mx-auto">
              <div className="mb-16">
                <Label className="block mb-4 text-primary">
                  GLOBAL PRESENCE
                </Label>
                <h2 className="font-headline-lg text-headline-lg text-primary">
                  Our Offices
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {offices.map((office) => (
                  <div key={office.city} className="reveal">
                    <div className="aspect-[16/9] mb-8 relative overflow-hidden bg-surface-dim">
                      <img
                        className="object-cover w-full h-full grayscale-[50%] hover:grayscale-0 transition-all duration-700"
                        data-alt={`${office.city} office building`}
                        src={office.img}
                        alt={`${office.city} office`}
                      />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-4">
                      {office.city}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                      {office.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
