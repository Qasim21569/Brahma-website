import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const featuredProjects = [
  {
    tag: "Development",
    year: "2023",
    title: "The Aurelia Grand",
    desc: "A cornerstone development project in downtown Chicago. This property redefines luxury hospitality with structurally imposing design and operational excellence, resulting in sustained asset value growth.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjZPRrvacJgkIG1au4I7lI9b7TnvornC1GBfhi9ZbgSNDjtjWVQTOsh73jUmooCuLyh3xKs4jtYYsqDyrUuf3sZ7NpJ9tlPpCWFH1JYrEPB68KjrDs1FbF1oX-nSxhemsJAaeeybLiZA7gzJF_1nfK9ZX1TEYisJHibKf_CnmqS1IhBSoukkA8KVYCn6gn_Grdfs9kwfFZAUYahFpOOSjqXhAhUUAiKsUsqz4Ky_ngJ0h8N22h5VKe",
    flip: false,
  },
  {
    tag: "Acquisition",
    year: "2021",
    title: "Vertex Towers",
    desc: "Strategic acquisition of a dual-tower property in Miami. Through rigorous management restructuring and physical enhancements, we established a new benchmark for regional market performance.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3lp4Ht0hKqZmvKDGe1s9yxA7TR4kW325narcmFChb22Pw51bHhRn5KZqOf6BY7hbhDvFSjimadZP4kHcwdRFn8B1-FTmklVzBMg-GMjtgqhyhGB8M11bxOlDt_em3NtFpUppoRyRFip-ZNd9tF_jF_8znQ_HAgitCmfMtlU29ySmz3uQ7y_cSWW7GSCXULatLiJts5QfI1g1N0s7NHCvVZF7UlN9QjCE1aMGTMN_p8nsihcco23Zr",
    flip: true,
  },
];

const allProjects = [
  {
    name: "Lumina Suites",
    location: "Austin, TX",
    category: "Management",
    year: "2024",
    thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuBht_-yXoe-qqePhUnuhW79C8ERk2GAuuhqlMO2YS3SlM5SKwNXlEnK_QKMCkCQC7jC4K9Ktd0sG6XemhLAKV-lqmERH0zZyWH0ennK0vLuMCl9mxd_nwHWMmy0wkWwL5qQuIz0QjPn61JKEDgF7fGm1LBwBwtS9HVCqXvE9zwEqBSOxC9KqZomlxbV8jW6OWaNoCgR1vAtG7obTRiz6KcQbH9gQLgT97O6dnXZp-jcxse-xd_BDC2j",
  },
  {
    name: "The Obsidian",
    location: "Denver, CO",
    category: "Acquisition",
    year: "2022",
    thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPWaWy9hK53M-IfnwbzVw8IoW8vuoCQ7GHblHifBN1pMqKCCPOcrcojAgpoqCX8e8TncuOGIqsSz6Cpzi2SLBQehtP2MWzXtJrqRWbwpR9TmPtzwAvx1ptltYNDiOUfL4JjIKeddjPLo7LqtcIewOXY4McYRPfo3hzG55r0cQkkDw8jP0HHUvC5CXgDTyiC1AIh-qKmrBeUhJvD37xN0XB4zyxl4l_L0pLhGOZnMrB62qWxUlWgLI9",
  },
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
                Our Track Record
              </Label>
              <h1 className="font-display-hero text-display-hero text-primary mb-8 reveal">
                A legacy of structural permanence and strategic hospitality
                investment.
              </h1>
            </div>
          </div>
          <div className="w-full h-px bg-mortar-grey mt-16" />
        </section>

        {/* ─── Featured Projects ─── */}
        <section className="px-margin-edge pb-section-gap max-w-container-max mx-auto">
          <div className="flex flex-col gap-24">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center"
              >
                <div
                  className={`md:col-span-7 h-[300px] md:h-[600px] w-full bg-stone-white border border-mortar-grey/50 relative overflow-hidden group ${
                    project.flip ? "md:col-start-6 order-1 md:order-2" : ""
                  }`}
                >
                  <img
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    data-alt={project.title}
                    src={project.img}
                    alt={project.title}
                    data-parallax={project.flip ? undefined : "0.1"}
                  />
                </div>
                <div
                  className={`md:col-span-4 md:col-start-9 flex flex-col justify-center ${
                    project.flip ? "order-2 md:order-1 md:col-start-1" : ""
                  }`}
                >
                  <Label className="mb-4">
                    {project.tag} {"•"} {project.year}
                  </Label>
                  <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
                    {project.title}
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                    {project.desc}
                  </p>
                  <Button href="#" icon="arrow_forward">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── All Projects Table ─── */}
        <section className="bg-surface-container-high py-section-gap border-y border-mortar-grey">
          <div className="px-margin-edge max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-12 border-b border-mortar-grey pb-4">
              <h2 className="font-headline-md text-headline-md text-primary">
                All Projects
              </h2>
              <div className="flex gap-4">
                <select className="bg-transparent border-b border-mortar-grey pb-2 font-label-caps text-label-caps text-primary focus:outline-none focus:border-primary uppercase">
                  <option>All Categories</option>
                  <option>Acquisition</option>
                  <option>Management</option>
                  <option>Development</option>
                </select>
                <select className="bg-transparent border-b border-mortar-grey pb-2 font-label-caps text-label-caps text-primary focus:outline-none focus:border-primary uppercase">
                  <option>Year</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-mortar-grey font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hidden md:grid">
                <div className="col-span-5">Property</div>
                <div className="col-span-3">Location</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2 text-right">Date</div>
              </div>
              {allProjects.map((project) => (
                <div
                  key={project.name}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-mortar-grey items-center hover:bg-stone-white transition-colors group cursor-pointer reveal"
                >
                  <div className="md:col-span-5 flex items-center gap-6" data-label="Property">
                    <div className="w-16 h-16 bg-mortar-grey/30 overflow-hidden hidden md:block">
                      <img
                        className="w-full h-full object-cover"
                        data-alt={project.name}
                        src={project.thumb}
                        alt={project.name}
                      />
                    </div>
                    <span className="font-body-lg text-body-lg text-primary font-bold">
                      {project.name}
                    </span>
                  </div>
                  <div className="md:col-span-3 font-body-md text-body-md text-on-surface-variant" data-label="Location">
                    {project.location}
                  </div>
                  <div className="md:col-span-2 font-body-md text-body-md text-on-surface-variant" data-label="Category">
                    {project.category}
                  </div>
                  <div className="md:col-span-2 text-left md:text-right font-body-md text-body-md text-primary" data-label="Acquired">
                    {project.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats CTA ─── */}
        <section className="bg-primary text-on-primary py-section-gap relative overflow-hidden">
          <div className="px-margin-edge max-w-container-max mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5">
              <h2 className="font-headline-lg text-headline-lg mb-8">
                Structural growth through disciplined investment.
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container mb-12">
                We invite institutional partners to engage in our next phase of
                strategic hospitality development.
              </p>
              <Button href="/contact" variant="light" icon="arrow_forward">
                Initiate Partnership
              </Button>
            </div>
            <div className="md:col-span-6 md:col-start-7 grid grid-cols-2 gap-8 pt-12 md:pt-0">
              <div className="border-t border-on-primary-container pt-4">
                <p className="font-stat-display text-stat-display mb-2">
                  $4.2B
                </p>
                <p className="font-label-caps text-label-caps text-on-primary-container uppercase tracking-widest">
                  Assets Under Management
                </p>
              </div>
              <div className="border-t border-on-primary-container pt-4">
                <p className="font-stat-display text-stat-display mb-2">
                  34
                </p>
                <p className="font-label-caps text-label-caps text-on-primary-container uppercase tracking-widest">
                  Properties Delivered
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
