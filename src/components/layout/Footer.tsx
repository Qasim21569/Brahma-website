import Link from "next/link";

const footerLinks = {
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
  ],
  Work: [{ href: "/portfolio", label: "Portfolio" }],
  Engage: [
    { href: "/careers", label: "Join Our Team" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-primary">
      {/* Soft blue arc accent */}
      <div
        className="absolute bottom-0 right-0 w-full md:w-[800px] h-[400px] pointer-events-none opacity-20 overflow-hidden"
        style={{
          borderRadius: "100% 0 0 0",
          background:
            "radial-gradient(circle at bottom right, #cfe5ff, transparent 70%)",
          transform: "translate(20%, 30%)",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-edge py-section-gap max-w-container-max mx-auto relative z-10">
        <div className="col-span-12 md:col-span-4 mb-12 md:mb-0">
          <div className="font-headline-lg text-headline-lg text-on-primary mb-6">
            BRAHMA
          </div>
          <p className="text-on-primary-container font-body-md text-body-md max-w-xs">
            &copy; 2024 Brahma Group. Architectural Integrity in Hospitality
            Investment.
          </p>
        </div>

        <div className="col-span-12 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-4">
              <span className="font-label-caps text-label-caps text-on-primary-container opacity-50">
                {category}
              </span>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-body-md text-body-md text-on-primary-container hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
