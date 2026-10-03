import { defineSection, lines, list, text, url } from "../fields";
import { metaDescription } from "./shared";

export const contactHero = defineSection({
  key: "contact.hero",
  page: "contact",
  title: "Opening",
  description: "Email addresses and enquiry topics are edited under Site settings → Contact details.",
  fields: {
    metaDescription: metaDescription(
      "Talk to Brahmas Management and Investment Group about an asset, a joint venture, or the group's operations in Florida.",
    ),
    label: text("Section label", "Contact", { max: 30 }),
    heading: lines("Heading", ["We would rather talk", "early than late."]),
    body: lines("Text", [
      "Whether you are selling an operating asset,",
      "financing one, or want to understand how the",
      "group works — start here.",
    ]),
  },
});

export const contactDirect = defineSection({
  key: "contact.direct",
  page: "contact",
  title: "Direct email routes",
  fields: {
    label: text("Section label", "Direct", { max: 30 }),
    regionPrefix: text("Text before the region", "Operating in", { max: 30 }),
  },
});

export const contactForm = defineSection({
  key: "contact.form",
  page: "contact",
  title: "Enquiry form",
  fields: {
    label: text("Section label", "Send a Note", { max: 30 }),
    note: text("Note beside the form", "This opens your own mail client with the details filled in.", {
      max: 140,
    }),
    submitLabel: text("Send button", "Send enquiry", { max: 30 }),
    nameLabel: text("Name — label", "Full name", { max: 40 }),
    namePlaceholder: text("Name — hint text", "First Last", { max: 60, optional: true }),
    orgLabel: text("Organisation — label", "Organisation", { max: 40 }),
    orgPlaceholder: text("Organisation — hint text", "Company name", { max: 60, optional: true }),
    emailLabel: text("Email — label", "Email", { max: 40 }),
    emailPlaceholder: text("Email — hint text", "you@example.com", { max: 60, optional: true }),
    topicLabel: text("Topic — label", "Reason for contact", { max: 40 }),
    topicPlaceholder: text("Topic — first option", "Select one", { max: 40 }),
    messageLabel: text("Message — label", "Message", { max: 40 }),
    messagePlaceholder: text("Message — hint text", "A sentence or two is plenty.", {
      max: 80,
      optional: true,
    }),
  },
});

export const contactAssets = defineSection({
  key: "contact.assets",
  page: "contact",
  title: "Reach an asset",
  fields: {
    label: text("Section label", "Reach an Asset", { max: 30 }),
    heading: lines("Heading", ["Booking, or calling", "a property directly?"]),
    body: lines("Text", [
      "Each of the {assetCount} assets lists its own address and",
      "phone number on its page.",
    ], { maxLineLength: 60 }),
    links: list(
      "Links",
      "Link",
      { label: text("Label", "", { max: 40 }), href: url("Link", "/") },
      [
        { label: "View all {assetCount} assets", href: "/portfolio" },
        { label: "Construction partners", href: "/about#construction-partners" },
      ],
      { titleField: "label", max: 4 },
    ),
  },
});

export const contactCta = defineSection({
  key: "contact.cta",
  page: "contact",
  title: "Closing statement",
  description: "The button shows the main email address from Site settings.",
  fields: {
    title: text("Heading", "Let’s talk.", { max: 32 }),
  },
});

export const contactSections = [
  contactHero,
  contactDirect,
  contactForm,
  contactAssets,
  contactCta,
] as const;
