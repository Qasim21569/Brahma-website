import { defineSection, image, lines, list, text, textarea } from "../fields";
import { metaDescription, metaTitle } from "./shared";

export const careersHero = defineSection({
  key: "careers.hero",
  page: "careers",
  title: "Opening",
  fields: {
    metaTitle: metaTitle("Careers"),
    metaDescription: metaDescription(
      "Brahmas hires for disposition rather than credentials, and offers equity in new projects to those who prove it.",
    ),
    label: text("Section label", "Careers", { max: 30 }),
    heading: lines("Heading", ["We hire for disposition,", "not credentials."]),
    body: lines("Text", [
      "The people who run an asset as though they",
      "already own it are the ones who produce the",
      "results. That is what we look for, and it is",
      "not something a degree tells us.",
    ]),
    image: image("Full-width image", {
      src: "/properties/holiday-inn-express-orlando-seaworld/g-01.jpg",
      alt: "Pool and building at Holiday Inn Express Orlando South Park",
    }),
  },
});

export const careersPath = defineSection({
  key: "careers.path",
  page: "careers",
  title: "The path",
  fields: {
    label: text("Section label", "The Path", { max: 30 }),
    heading: lines("Heading", ["From operator", "to owner."]),
    blocks: list(
      "Text blocks",
      "Block",
      { heading: text("Heading", "", { max: 40 }), body: textarea("Text", "") },
      [
        {
          heading: "The owner's mindset",
          body: "He ran the business like an owner years before he became one. Every unsold room registered as a personal loss; every dollar of revenue was treated as his own. That discipline is the origin of the company's operating philosophy — that ownership is a way of thinking about an asset, not merely a line on a title.",
        },
        {
          heading: "How we hire",
          body: "The company recruits for disposition rather than credentials. Employees who show genuine ownership instinct are trained against nearly three decades of operating knowledge, and the strongest performers are offered equity stakes in new projects — the same path that turned an operator into an owner.",
        },
      ],
      { titleField: "heading", max: 4 },
    ),
    quote: textarea(
      "Quote",
      "I don't look for a degree. I look at the passion the person has.",
      { max: 240, help: "Verbatim from the interview. Quotation marks are added automatically." },
    ),
  },
});

export const careersDisciplines = defineSection({
  key: "careers.disciplines",
  page: "careers",
  title: "Disciplines",
  description: "The areas the group hires into — not a list of open vacancies.",
  fields: {
    label: text("Section label", "Disciplines", { max: 30 }),
    heading: lines("Heading", ["Where the work sits."]),
    body: lines("Text", [
      "We operate {assetCount} assets across {assetClassCount} asset classes —",
      "{assetClassList}.",
      "These are the areas we hire into.",
    ], { maxLineLength: 60 }),
    items: list(
      "Disciplines",
      "Discipline",
      { title: text("Title", "", { max: 60 }), body: textarea("Description", "") },
      [
        {
          title: "Acquisitions and underwriting",
          body: "Sourcing assets whose structural quality exceeds their operating performance, and building the case for what they could be. Market selection, diligence, and the numbers behind an offer.",
        },
        {
          title: "Asset management and repositioning",
          body: "Defining scope property by property — the building, the systems, the brand position — and holding delivery to it. Works alongside specialist design-build partners rather than an in-house contracting arm.",
        },
        {
          title: "Hotel operations",
          body: "Running the assets day to day under Brahmas Hospitality Management. Front desk through to general management, across a portfolio operating under Choice, Hilton, IHG and Wyndham brand standards.",
        },
        {
          title: "Finance and franchise compliance",
          body: "Reporting, treasury, lender relationships, and keeping a multi-brand portfolio compliant with each franchisor's standards.",
        },
      ],
      { titleField: "title" },
    ),
  },
});

export const careersApply = defineSection({
  key: "careers.apply",
  page: "careers",
  title: "Applying",
  fields: {
    label: text("Section label", "Applying", { max: 30 }),
    heading: lines("Heading", ["No posting for the role", "you want? Write anyway."]),
    body: lines("Text", [
      "Tell us which discipline you belong in and what",
      "you have actually run. We would rather read that",
      "than a list of qualifications.",
    ]),
    buttonLabel: text("Button label", "Send an open application", { max: 40 }),
    emailSubject: text("Email subject line", "Careers — open application", { max: 80 }),
  },
});

export const careersCta = defineSection({
  key: "careers.cta",
  page: "careers",
  title: "Closing statement",
  fields: {
    title: text("Heading", "Run it like you own it.", { max: 32 }),
    body: lines("Text", ["The strongest performers are offered equity", "in new projects."], {
      optional: true,
    }),
  },
});

export const careersSections = [
  careersHero,
  careersPath,
  careersDisciplines,
  careersApply,
  careersCta,
] as const;
