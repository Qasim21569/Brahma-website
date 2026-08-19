import Link from "next/link";
import Image from "next/image";
import { BMIG_LOGO_SRC, BMIG_LOGO_SIZE } from "@/data/company";
import { operatingRegion } from "@/data/contact";
import { enrichedProperties } from "@/data/properties";

/**
 * Footer — oversized wordmark + columns.
 *
 * Structure runs brand row → link columns → meta rule → oversized wordmark,
 * the pattern both `../the-line-awwwards-SOTM/` and `../sequent-media-house-main/`
 * use to close a page: the columns do the work, the wordmark does the signing.
 *
 * ⚠️ EVERY value here is confirmed. There are deliberately NO social links and
 * NO street address — `contact.ts` has neither, and inventing them is the exact
 * failure that put fictional New York and London offices on the contact page.
 * A "Connect" column slots in below once the client supplies handles.
 */

const exploreLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Join Our Team" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const LEGAL_NAME = "Brahmas Management and Investment Group";

/** Column heading — footer-local, so it never collides with SectionTitle. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-muted-azure">
      {children}
    </span>
  );
}

/** Underline sweeps in from the left on hover — the StyledLink gesture. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-block font-body-md text-body-md text-cream-dim transition-colors duration-300 hover:text-cream"
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-px w-0 bg-cream transition-all duration-500 ease-[cubic-bezier(0.24,0.43,0.15,0.97)] group-hover:w-full"
      />
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const assetCount = enrichedProperties.length;

  return (
    <footer className="relative w-full overflow-hidden bg-primary text-cream">
      {/* Soft muted-azure arc accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-full overflow-hidden opacity-10 md:w-[800px]"
        style={{
          borderRadius: "100% 0 0 0",
          background: "radial-gradient(circle at bottom right, #7b9ec4, transparent 70%)",
          transform: "translate(20%, 30%)",
        }}
      />

      <div className="relative z-10 px-margin-edge pt-section-gap">
        {/* ── Brand row + columns ── */}
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-[1fr_1.9fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Brahmas — home">
              <Image
                src={BMIG_LOGO_SRC}
                alt=""
                width={BMIG_LOGO_SIZE.width}
                height={BMIG_LOGO_SIZE.height}
                className="h-12 w-auto"
                unoptimized
              />
              <span className="inline-flex flex-col leading-none" style={{ width: "max-content" }}>
                <span className="font-serif text-[22px] font-normal leading-none tracking-[-0.01em] whitespace-nowrap text-cream">
                  BRAHMAS
                </span>
                <span
                  className="mt-0.5 w-full font-sans text-[6px] font-medium uppercase text-cream/60"
                  style={{ textAlign: "justify", textAlignLast: "justify" }}
                >
                  Management and Investment Group
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs font-body-md text-body-md text-cream-dim">
              Architectural integrity translated into enduring operating performance.
            </p>

            <dl className="mt-8 flex flex-col gap-4">
              <div>
                <dt className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-muted-azure">
                  Operating region
                </dt>
                <dd className="mt-1.5 font-body-md text-body-md text-cream-dim">
                  {operatingRegion}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-muted-azure">
                  Portfolio
                </dt>
                <dd className="mt-1.5 font-body-md text-body-md text-cream-dim">
                  {assetCount} operating assets
                </dd>
              </div>
            </dl>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            <nav className="flex flex-col gap-4" aria-label="Explore">
              <ColumnLabel>Explore</ColumnLabel>
              {exploreLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>

            <nav className="flex flex-col gap-4" aria-label="Legal">
              <ColumnLabel>Legal</ColumnLabel>
              {legalLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
              <FooterLink href="/contact">Contact</FooterLink>
            </nav>
          </div>
        </div>

        {/* ── Meta rule ── */}
        <div className="mt-16 flex flex-col gap-3 border-t border-cream/12 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-sans text-[11px] tracking-[0.02em] text-cream-dim/60">
            &copy; {year} {LEGAL_NAME}. All rights reserved.
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-cream-dim/60">
            {operatingRegion}
          </p>
        </div>
      </div>

      {/* ── Oversized wordmark ──
          Signs the page off. Decorative: the legal name is already stated
          above, so this carries aria-hidden rather than being read twice.
          Clamped off the viewport so it spans the full measure at any width
          without overflowing the edge inset. */}
      <div className="relative z-10 mt-14 px-margin-edge pb-8" aria-hidden>
        <div className="select-none border-t border-cream/12 pt-6">
          <span
            className="block whitespace-nowrap font-serif font-light leading-[0.82] tracking-[-0.02em] text-cream/15"
            style={{ fontSize: "clamp(3.5rem, 19vw, 20rem)" }}
          >
            BRAHMAS
          </span>
          <span
            className="mt-2 block w-full font-sans text-[9px] font-medium uppercase tracking-[0.1em] text-cream/25 md:text-[12px]"
            style={{ textAlign: "justify", textAlignLast: "justify" }}
          >
            Management and Investment Group
          </span>
        </div>
      </div>
    </footer>
  );
}
