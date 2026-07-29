import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[140px] px-margin-edge max-w-container-max mx-auto py-section-gap">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-8">
          Privacy Policy
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          This is a placeholder page. Full privacy policy content will be added
          before launch.
        </p>
      </main>
      <Footer />
    </>
  );
}
