import { defineSection, list, text, textarea } from "../fields";

const clause = { heading: text("Heading", "", { max: 80 }), body: textarea("Text", "") };

export const legalPrivacy = defineSection({
  key: "legal.privacy",
  page: "legal",
  title: "Privacy Policy",
  description:
    "Legal text — have changes reviewed before publishing. The contact email at the end comes from Site settings.",
  fields: {
    title: text("Page title", "Privacy Policy", { max: 60 }),
    intro: textarea(
      "Introduction",
      "This Privacy Policy describes how Brahmas Management and Investment Group collects, uses, and protects personal information submitted through this website.",
    ),
    clauses: list(
      "Sections",
      "Section",
      clause,
      [
        {
          heading: "Information We Collect",
          body: "We collect information you voluntarily provide when submitting an inquiry form — including your name, organization, email address, and message content. This data is used solely to respond to your inquiry.",
        },
        {
          heading: "Data Retention",
          body: "Inquiry data is retained for the duration necessary to address your request and for legitimate business record-keeping purposes. We do not sell or share personal data with third parties.",
        },
      ],
      { titleField: "heading" },
    ),
    contactHeading: text("Contact heading", "Contact", { max: 60 }),
    contactText: text("Contact sentence", "For privacy-related inquiries, contact us at", { max: 140 }),
    updated: text(
      "Last-updated note",
      "Last updated: August 2025. This policy may be revised periodically.",
      { max: 140 },
    ),
  },
});

export const legalTerms = defineSection({
  key: "legal.terms",
  page: "legal",
  title: "Terms of Service",
  description:
    "Legal text — have changes reviewed before publishing. The contact email at the end comes from Site settings.",
  fields: {
    title: text("Page title", "Terms of Service", { max: 60 }),
    intro: textarea(
      "Introduction",
      "These Terms of Service govern your use of the Brahmas Management and Investment Group website. By accessing this site, you agree to these terms.",
    ),
    clauses: list(
      "Sections",
      "Section",
      clause,
      [
        {
          heading: "Use of Site",
          body: "Content on this site is provided for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Past performance is not indicative of future results.",
        },
        {
          heading: "Intellectual Property",
          body: "All content, design, and materials on this site are the property of Brahmas Management and Investment Group and are protected by applicable intellectual property laws. Unauthorized reproduction or distribution is prohibited.",
        },
        {
          heading: "Limitation of Liability",
          body: "Brahmas Management and Investment Group shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website.",
        },
        {
          heading: "Governing Law",
          body: "These terms are governed by the laws of the State of Florida, United States, without regard to conflict of law principles.",
        },
      ],
      { titleField: "heading" },
    ),
    contactHeading: text("Contact heading", "Contact", { max: 60 }),
    contactText: text("Contact sentence", "For questions regarding these terms, contact us at", {
      max: 140,
    }),
    updated: text(
      "Last-updated note",
      "Last updated: August 2025. These terms may be revised periodically.",
      { max: 140 },
    ),
  },
});

export const legalSections = [legalPrivacy, legalTerms] as const;
