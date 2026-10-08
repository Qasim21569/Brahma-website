import { defineSection, image, lines, list, text, textarea, url } from "../fields";
import { metaDescription, metaTitle } from "./shared";

export const aboutHero = defineSection({
  key: "about.hero",
  page: "about",
  title: "Opening",
  fields: {
    metaTitle: metaTitle("About"),
    metaDescription: metaDescription(
      "Brahmas Management and Investment Group acquires, repositions, and directly operates hospitality, education, and residential assets across Florida.",
    ),
    label: text("Section label", "Our Story", { max: 30 }),
    heading: lines("Heading", ["An operator first.", "An owner since."]),
    body: lines("Text", [
      "We acquire underperforming operating assets,",
      "reposition them through capital investment,",
      "and run them directly — across hospitality,",
      "education, and residential real estate.",
    ]),
    links: list(
      "Jump links",
      "Link",
      { label: text("Label", "", { max: 40 }), href: url("Link", "#") },
      [
        { label: "The founder", href: "#leadership" },
        { label: "Construction partners", href: "#construction-partners" },
      ],
      { titleField: "label", max: 4 },
    ),
  },
});

export const aboutBand = defineSection({
  key: "about.band",
  page: "about",
  title: "Full-width image",
  fields: {
    image: image("Image", {
      src: "/properties/quality-inn-conference-center-tampa-brandon/g-01.jpg",
      alt: "Quality Inn Conference Center, Tampa, Florida",
    }),
  },
});

export const aboutLeadership = defineSection({
  key: "about.leadership",
  page: "about",
  title: "Leadership",
  description:
    "The founder's name, portrait and story are edited under Company → Founder. This section holds the heading and the quote.",
  fields: {
    label: text("Section label", "Leadership", { max: 30 }),
    heading: lines("Heading", [
      "An operator before an owner —",
      "and an owner who never",
      "stopped operating.",
    ]),
    quoteLabel: text("Quote label", "In his words", { max: 30 }),
    quote: textarea(
      "Quote",
      "Every dollar that was coming in, I acted as if it was coming in for me as an owner.",
      { max: 240, help: "Verbatim from the interview. Quotation marks are added automatically." },
    ),
  },
});

export const aboutApproach = defineSection({
  key: "about.approach",
  page: "about",
  title: "Our Approach",
  fields: {
    label: text("Section label", "Our Approach", { max: 30 }),
    image: image("Image", {
      src: "/site-photos/Clarion-Pointe-5.webp",
      alt: "Interior of a Brahmas-operated hospitality asset",
    }, { help: "Portrait orientation (4:5)." }),
    heading: lines("Heading", ["We do not hand the keys", "to a third party."]),
    body: lines("Text", [
      "Acquisition, repositioning, and operation sit",
      "under one roof. The group underwrites the",
      "asset, deploys the capital, and then runs the",
      "building — so the people making the investment",
      "case are accountable for the result.",
    ]),
    assetsLabel: text("Stat label: operating assets", "Operating assets", { max: 30 }),
    classesLabel: text("Stat label: asset classes", "Asset classes", { max: 30 }),
    yearsLabel: text("Stat label: years", "Years in the industry", { max: 30 }),
    firstOwnershipLabel: text("Stat label: first ownership", "First ownership", { max: 30 }),
  },
});

export const aboutTeam = defineSection({
  key: "about.team",
  page: "about",
  title: "The Team",
  description: "The people themselves are edited under Company → Team.",
  fields: {
    label: text("Section label", "The Team", { max: 30 }),
    heading: lines("Heading", ["People who run", "what they underwrite."]),
    body: lines("Text", [
      "The group hires for disposition rather than",
      "credentials, and offers equity in new projects",
      "to those who prove it.",
    ]),
  },
});

export const aboutPartners = defineSection({
  key: "about.partners",
  page: "about",
  title: "Construction partners",
  description: "The partner's details are edited under Company → Construction partner.",
  fields: {
    label: text("Section label", "Construction partners", { max: 40 }),
  },
});

export const aboutCta = defineSection({
  key: "about.cta",
  page: "about",
  title: "Closing call to action",
  fields: {
    title: lines("Heading", ["Discuss an asset", "with our team."], { maxLineLength: 30 }),
    primaryLabel: text("Main button label", "Contact Our Team", { max: 30 }),
    primaryHref: url("Main button link", "/contact"),
    secondaryLabel: text("Second button label", "View Portfolio", { max: 30 }),
    secondaryHref: url("Second button link", "/portfolio"),
  },
});

export const aboutSections = [
  aboutHero,
  aboutBand,
  aboutLeadership,
  aboutApproach,
  aboutTeam,
  aboutPartners,
  aboutCta,
] as const;
