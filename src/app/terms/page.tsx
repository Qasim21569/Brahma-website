import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)] px-margin-edge py-section-gap">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-8">
          Terms of Service
        </h1>
        <div className="font-body-md text-body-md text-on-surface-variant max-w-2xl space-y-6">
          <p>
            These Terms of Service govern your use of the Brahmas Management and
            Investment Group website. By accessing this site, you agree to these
            terms.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Use of Site
          </h2>
          <p>
            Content on this site is provided for informational purposes only and
            does not constitute an offer to sell or a solicitation of an offer to
            buy any securities. Past performance is not indicative of future
            results.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Intellectual Property
          </h2>
          <p>
            All content, design, and materials on this site are the property of
            Brahmas Management and Investment Group and are protected by
            applicable intellectual property laws. Unauthorized reproduction or
            distribution is prohibited.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Limitation of Liability
          </h2>
          <p>
            Brahmas Management and Investment Group shall not be liable for any
            indirect, incidental, or consequential damages arising from the use
            of this website.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Governing Law
          </h2>
          <p>
            These terms are governed by the laws of the State of Florida, United
            States, without regard to conflict of law principles.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Contact
          </h2>
          <p>
            For questions regarding these terms, contact us at{" "}
            <a href="mailto:info@brahmagroup.com" className="underline decoration-ink-deep/30 underline-offset-4">
              info@brahmagroup.com
            </a>
            .
          </p>
          <p className="text-on-surface-variant/60 mt-12">
            Last updated: August 2025. These terms may be revised periodically.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
