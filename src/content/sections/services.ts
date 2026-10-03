import { defineSection, image, lines, list, text, textarea, url } from "../fields";
import { metaDescription } from "./shared";

export const servicesHero = defineSection({
  key: "services.hero",
  page: "services",
  title: "Opening",
  fields: {
    metaDescription: metaDescription(
      "Brahmas acquires, repositions, and directly operates its own assets — capital, repositioning, and operations under one roof.",
    ),
    label: text("Section label", "What We Do", { max: 30 }),
    heading: lines("Heading", ["Capital, construction,", "and operations under", "one roof."]),
    body: lines("Text", [
      "We do not assemble a chain of vendors around",
      "an asset. The group underwrites it, funds it,",
      "rebuilds it, and then runs it.",
    ]),
    capabilities: lines(
      "Capability list",
      [
        "Sourcing",
        "Underwriting",
        "Capital Structuring",
        "Repositioning",
        "Brand Alignment",
        "Direct Operation",
      ],
      { maxLineLength: 32, help: "One per line. Shown as a two-column list — no numbering." },
    ),
  },
});

export const servicesBand = defineSection({
  key: "services.band",
  page: "services",
  title: "Full-width image",
  fields: {
    image: image("Image", {
      src: "/properties/hampton-inn-suites-tampa-east-seffner/g-01.jpg",
      alt: "Hampton Inn & Suites Tampa East Seffner entrance",
    }),
  },
});

export const servicesPillars = defineSection({
  key: "services.pillars",
  page: "services",
  title: "Services",
  description:
    "What the group can do — a different axis from the homepage Process (Acquire → Renovate → Operate), so keep the two distinct. No financial figures or return claims.",
  fields: {
    label: text("Section label", "Services", { max: 30 }),
    operatedByLabel: text("Text before the operating company", "Operated by", { max: 24 }),
    pillars: list(
      "Pillars",
      "Pillar",
      {
        title: text("Title", "", { max: 30 }),
        body: lines("Text", []),
        capabilities: lines("Capabilities", [], { maxLineLength: 34 }),
        subunit: text("Operating company (optional)", "", {
          optional: true,
          help: "Only name a subsidiary whose role is confirmed.",
        }),
      },
      [
        {
          title: "Capital Structuring",
          body: [
            "We source assets whose structural quality",
            "exceeds their operating performance, and",
            "structure the capital to acquire them.",
          ],
          capabilities: ["Sourcing and underwriting", "Capital Structuring", "Lender relationships"],
          subunit: "",
        },
        {
          title: "Repositioning",
          body: [
            "Capital goes into the building and the",
            "brand. Scope is defined asset by asset",
            "and delivered with specialist partners.",
          ],
          capabilities: [
            "Scope definition",
            "Design and build delivery",
            "Brand and franchise alignment",
          ],
          subunit: "",
        },
        {
          title: "Operations",
          body: [
            "We run what we buy. The team that",
            "underwrites an asset is the same team",
            "accountable for how it performs.",
          ],
          capabilities: ["Direct operation", "Quarterly performance review", "Franchise compliance"],
          subunit: "Brahmas Hospitality Management",
        },
      ],
      { titleField: "title", min: 1, max: 5 },
    ),
  },
});

export const servicesPartner = defineSection({
  key: "services.partner",
  page: "services",
  title: "Construction partner",
  description:
    "The partner's name, description and capabilities are edited under Company → Construction partner.",
  fields: {
    heading: lines("Heading", ["We choose our builders", "the way we choose assets."]),
  },
});

export const servicesFaq = defineSection({
  key: "services.faq",
  page: "services",
  title: "Frequently asked questions",
  fields: {
    label: text("Section label", "Frequently Asked Questions", { max: 40 }),
    heading: lines("Heading", ["The questions we get", "asked most."]),
    items: list(
      "Questions",
      "Question",
      {
        title: text("Question", "", { max: 120 }),
        body: textarea("Answer", ""),
      },
      [
        {
          title: "How do you identify acquisition targets?",
          body: "We evaluate assets against two criteria: structural permanence of the real estate, and a measurable gap between current operating performance and potential. We look for properties whose physical quality — location, construction, design intent — exceeds their current financial output, typically because of underinvestment or brand misalignment.",
        },
        {
          title: "Who carries out the renovation work?",
          body: "Scope is defined property by property — structural repairs, systems upgrades, interior repositioning, or brand alignment — and Brahmas directs it. Delivery is carried out with specialist design-build partners rather than an in-house contracting arm. What we do not delegate is the operating model: the asset is run by Brahmas once the work is complete.",
        },
        {
          title: "Why operate properties directly rather than franchising out management?",
          body: "Operating directly keeps accountability for the guest experience and the financial result in the same place. Operators who run an asset as though they already own it produce better outcomes, and that discipline only survives if the people who underwrote the investment are the people answering for it.",
        },
        {
          title: "What types of properties are in the portfolio?",
          body: "Hospitality is the core competency, but the group operates across asset classes — hotels, an early-education facility, and residential property. The unifying thread is structural quality that has been underleveraged, in a market position that rewards professional management.",
        },
        {
          title: "How do you measure whether a repositioning worked?",
          body: "Against the investment thesis set at acquisition, reviewed quarterly. Performance is measured relative to what the specific asset should be capable of given its location and construction — not against a market average that may be set by weaker competitors.",
        },
      ],
      { titleField: "title" },
    ),
  },
});

export const servicesCta = defineSection({
  key: "services.cta",
  page: "services",
  title: "Closing call to action",
  fields: {
    title: text("Heading", "Start a conversation.", {
      max: 32,
      help: "One line — letters flicker on hover, so keep it short.",
    }),
    body: lines("Text", [
      "Whether you are selling an asset or financing",
      "one, we would rather talk early than late.",
    ], { optional: true }),
    buttonLabel: text("Button label", "Reach out to us", { max: 30 }),
    buttonHref: url("Button link", "/contact"),
  },
});

export const servicesSections = [
  servicesHero,
  servicesBand,
  servicesPillars,
  servicesPartner,
  servicesFaq,
  servicesCta,
] as const;
