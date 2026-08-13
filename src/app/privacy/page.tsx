import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)] px-margin-edge py-section-gap">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-8">
          Privacy Policy
        </h1>
        <div className="font-body-md text-body-md text-on-surface-variant max-w-2xl space-y-6">
          <p>
            This Privacy Policy describes how Brahmas Management and Investment
            Group collects, uses, and protects personal information submitted
            through this website.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Information We Collect
          </h2>
          <p>
            We collect information you voluntarily provide when submitting an
            inquiry form — including your name, organization, email address, and
            message content. This data is used solely to respond to your inquiry.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Data Retention
          </h2>
          <p>
            Inquiry data is retained for the duration necessary to address your
            request and for legitimate business record-keeping purposes. We do
            not sell or share personal data with third parties.
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            Contact
          </h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:info@brahmagroup.com" className="underline decoration-ink-deep/30 underline-offset-4">
              info@brahmagroup.com
            </a>
            .
          </p>
          <p className="text-on-surface-variant/60 mt-12">
            Last updated: August 2025. This policy may be revised periodically.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
