import { Fragment } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSections } from "@/content/server";

export const metadata: Metadata = { title: "Terms of Service" };

/** Text is editable in Admin → Legal pages. Have changes reviewed before publishing. */
export default async function TermsPage() {
  const [page, contact] = await getSections("legal.terms", "global.contact");

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)] px-margin-edge py-section-gap">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-8">{page.title}</h1>
        <div className="font-body-md text-body-md text-on-surface-variant max-w-2xl space-y-6">
          <p>{page.intro}</p>
          {page.clauses.map((clause, i) => (
            <Fragment key={`${i}-${clause.heading}`}>
              <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
                {clause.heading}
              </h2>
              <p className="whitespace-pre-line">{clause.body}</p>
            </Fragment>
          ))}
          <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">
            {page.contactHeading}
          </h2>
          <p>
            {page.contactText}{" "}
            <a
              href={`mailto:${contact.primaryEmail}`}
              className="underline decoration-ink-deep/30 underline-offset-4"
            >
              {contact.primaryEmail}
            </a>
            .
          </p>
          <p className="text-on-surface-variant/60 mt-12">{page.updated}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
