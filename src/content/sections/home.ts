import { defineSection, gallery, image, lines, list, propertyRefs, text, url } from "../fields";

const link = (label: string, href: string) => ({ label, href });

export const homeHero = defineSection({
  key: "home.hero",
  page: "home",
  title: "Hero",
  description: "The full-screen opening image and headline.",
  fields: {
    headline: lines("Headline", ["Capital with conviction.", "Operation with precision."], {
      maxLines: 3,
      maxLineLength: 32,
    }),
    image: image(
      "Background image",
      {
        src: "/properties/clarion-pointe-tampa-brandon/01-hero.webp",
        alt: "Clarion Pointe Tampa Brandon exterior anchor shot",
      },
      {
        noCredit: true,
        help: "Full-bleed, so there is no room for a photo credit — use photography the group owns. Landscape, at least 2400px wide.",
      },
    ),
    buttonLabel: text("Button label", "Reach Out to Us", { max: 30 }),
    buttonHref: url("Button link", "/contact"),
  },
});

export const homeAbout = defineSection({
  key: "home.about",
  page: "home",
  title: "About Brahmas",
  fields: {
    label: text("Section label", "About Brahmas", { max: 40 }),
    heading: lines("Heading", [
      "Architectural integrity",
      "translated into enduring",
      "financial performance.",
    ]),
    body: lines("First paragraph", [
      "Brahmas Management and Investment Group",
      "acquires underperforming operating assets,",
      "repositions them through capital investment,",
      "and operates them directly under Brahmas",
      "Hospitality Management — maintaining full",
      "control from acquisition to performance.",
    ]),
    body2: lines("Second paragraph", [
      "Brahmas was founded by an operator rather",
      "than an investor — nearly three decades of",
      "running hotels before financing them. That",
      "order, operator first and owner second, is",
      "what sets the group apart.",
    ]),
    links: list(
      "Links",
      "Link",
      { label: text("Label", "", { max: 40 }), href: url("Link", "/") },
      [
        link("Discover Brahmas", "/about"),
        link("Meet the team", "/about#team"),
        link("Construction partners", "/about#construction-partners"),
      ],
      { titleField: "label", max: 4 },
    ),
    quote: lines("Quote", [
      "“We don’t buy hotels.",
      "We buy the gap between",
      "what an asset is and what",
      "it could be — then we",
      "close it.”",
    ], { maxLineLength: 30 }),
    slides: gallery(
      "Rotating images",
      [
        {
          src: "/properties/hampton-inn-tampa-veterans-expwy/01-hero.webp",
          alt: "Hampton Inn Tampa-Veterans Expwy exterior",
          attribution: null,
        },
        {
          src: "/properties/clarion-pointe-tampa-brandon/01-hero.webp",
          alt: "Clarion Pointe Tampa exterior",
          attribution: null,
        },
      ],
      { noCredit: true, min: 1, help: "Cycles beside the quote. No credit is shown here, so use owned photography." },
    ),
  },
});

export const homeProcess = defineSection({
  key: "home.process",
  page: "home",
  title: "Process",
  description: "The dark scroll-driven section with the three stages.",
  fields: {
    label: text("Section label", "Process", { max: 30 }),
    linkLabel: text("Link label", "Explore our thesis", { max: 40 }),
    linkHref: url("Link", "/services"),
    stages: list(
      "Stages",
      "Stage",
      {
        title: text("Title", "", { max: 24 }),
        body: lines("Text", [], { maxLineLength: 38 }),
        icon: image("Line drawing", { src: "" }, {
          help: "Cream line art on a transparent background (PNG).",
        }),
      },
      [
        {
          title: "Acquire",
          body: [
            "We buy assets whose structural",
            "quality already exceeds their",
            "operating performance — the gap",
            "is the opportunity.",
          ],
          icon: { src: "/acq.png", alt: "Acquire", attribution: null },
        },
        {
          title: "Renovate",
          body: [
            "Capital goes into the building, the",
            "operating model, and the brand",
            "position at the same time. A repaint",
            "is not a repositioning.",
          ],
          icon: { src: "/des.png", alt: "Renovate", attribution: null },
        },
        {
          title: "Operate",
          body: [
            "We hold and run the asset ourselves",
            "under Brahmas Hospitality",
            "Management. No third party, no",
            "handoff, no diluted accountability.",
          ],
          icon: { src: "/opr.png", alt: "Operate", attribution: null },
        },
      ],
      { titleField: "title", min: 1, max: 5 },
    ),
  },
});

export const homeSelectedWork = defineSection({
  key: "home.selectedWork",
  page: "home",
  title: "Selected Work",
  description: "The pinned scroll section featuring three properties.",
  fields: {
    label: text("Section label", "Selected Work", { max: 30 }),
    properties: propertyRefs(
      "Featured properties",
      [
        "rodeway-inn-port-richey-north",
        "hampton-inn-tampa-veterans-expwy",
        "hampton-inn-suites-tampa-east-seffner",
      ],
      { count: 3, help: "Exactly three, in the order they appear while scrolling." },
    ),
    cardLink: text("Card link label", "Discover more", { max: 30 }),
    scrollHint: text("Scroll hint", "( Keep Scrolling )", { max: 30 }),
  },
});

export const homePhilosophy = defineSection({
  key: "home.philosophy",
  page: "home",
  title: "Philosophy",
  fields: {
    label: text("Section label", "Philosophy", { max: 30 }),
    heading: lines("Heading", ["Operational excellence", "before financial", "engineering."]),
    body: lines("First paragraph", [
      "We acquire assets whose structural quality",
      "exceeds their current operating performance,",
      "deploy capital into the building and the brand,",
      "and then run them ourselves.",
    ]),
    body2: lines("Second paragraph", [
      "No handoffs, and no third-party management.",
      "The people who underwrite an asset are the",
      "same people who go on to run it. A",
      "projection here is written by whoever",
      "will have to deliver it.",
    ]),
    buttonLabel: text("Button label", "Read our full story", { max: 30 }),
    buttonHref: url("Button link", "/about"),
  },
});

export const homeStats = defineSection({
  key: "home.stats",
  page: "home",
  title: "By the numbers",
  description:
    "The figures themselves are calculated from the portfolio and founder records, so they can never drift. Only the labels are edited here.",
  fields: {
    label: text("Section label", "By the numbers", { max: 30 }),
    assetsLabel: text("Label: operating assets", "Operating assets", { max: 30 }),
    classesLabel: text("Label: asset classes", "Asset classes", { max: 30 }),
    yearsLabel: text("Label: years of experience", "Years operating experience", { max: 30 }),
    firstOwnershipLabel: text("Label: first ownership", "First ownership", { max: 30 }),
  },
});

export const homeCta = defineSection({
  key: "home.cta",
  page: "home",
  title: "Closing call to action",
  fields: {
    title: lines("Heading", ["Ready to discuss", "your portfolio?"], { maxLineLength: 30 }),
    body: lines("Text", [
      "We are always looking to evaluate operating",
      "assets that match our investment thesis.",
    ], { optional: true }),
    buttonLabel: text("Button label", "Get in touch", { max: 30 }),
    buttonHref: url("Button link", "/contact"),
  },
});

export const homeSections = [
  homeHero,
  homeAbout,
  homeProcess,
  homeSelectedWork,
  homePhilosophy,
  homeStats,
  homeCta,
] as const;
