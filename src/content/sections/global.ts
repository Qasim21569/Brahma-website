/**
 * Site-wide content: contact details, SEO, footer, and the company records
 * (founder, team, construction partner) that several pages draw on.
 *
 * Defaults are the values the site shipped with, moved here verbatim from
 * `src/data/company.ts`, `contact.ts` and `services.ts`. The provenance notes
 * that justified each value still live in those files.
 */
import {
  defineSection,
  email,
  image,
  lines,
  list,
  number,
  text,
  textarea,
  url,
} from "../fields";

export const globalSeo = defineSection({
  key: "global.seo",
  page: "global",
  title: "Search & sharing",
  description: "The description search engines and link previews show for the site as a whole.",
  fields: {
    description: textarea(
      "Site description",
      "Brahmas Management and Investment Group (BMIG) is a hospitality investment group handling acquisition, management, and operations across the full lifecycle of a hotel asset.",
      { max: 300, help: "Shown by Google under the site name. Aim for 150–160 characters." },
    ),
  },
});

export const globalContact = defineSection({
  key: "global.contact",
  page: "global",
  title: "Contact details",
  description:
    "Used on the Contact page, the mobile menu, the footer, the Careers page and the legal pages. Only publish details the group has confirmed — an earlier version of the site listed invented offices and phone numbers.",
  fields: {
    primaryEmail: email("Main email address", "info@brahmagroup.com", {
      help: "The address the contact form, CTAs and legal pages use.",
    }),
    operatingRegion: text("Operating region", "Florida, United States"),
    routes: list(
      "Email routes",
      "Route",
      {
        label: text("Label", "General", { max: 30 }),
        description: text("What it is for", "Anything else about the group and its operations.", {
          max: 120,
        }),
        email: email("Email", "info@brahmagroup.com"),
      },
      [
        {
          label: "Investment",
          description: "Assets for sale, joint ventures, and lender enquiries.",
          email: "investments@brahmagroup.com",
        },
        {
          label: "General",
          description: "Anything else about the group and its operations.",
          email: "info@brahmagroup.com",
        },
        {
          label: "Press",
          description: "Media enquiries and interview requests.",
          email: "press@brahmagroup.com",
        },
      ],
      { titleField: "label", min: 1, max: 6 },
    ),
    topics: list(
      "Enquiry topics (contact form)",
      "Topic",
      { label: text("Topic", "General enquiry", { max: 60 }) },
      [
        { label: "Investment or joint venture" },
        { label: "Selling an asset" },
        { label: "Press and media" },
        { label: "Careers" },
        { label: "General enquiry" },
      ],
      { titleField: "label", min: 1 },
    ),
  },
});

const navLink = { label: text("Label", "", { max: 30 }), href: url("Link", "/") };

export const globalNavigation = defineSection({
  key: "global.navigation",
  page: "global",
  title: "Navigation menu",
  description:
    "The links across the top of every page and in the mobile menu. The footer's Explore column uses the same list.",
  fields: {
    links: list(
      "Menu links",
      "Link",
      navLink,
      [
        { label: "About Us", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Join Our Team", href: "/careers" },
      ],
      { titleField: "label", min: 1, max: 6, help: "More than 5 will crowd the desktop bar." },
    ),
    contactLabel: text("Contact button", "Contact Us", { max: 24 }),
    contactHref: url("Contact button link", "/contact"),
  },
});

export const globalFooter = defineSection({
  key: "global.footer",
  page: "global",
  title: "Footer",
  fields: {
    tagline: textarea(
      "Tagline",
      "Architectural integrity translated into enduring operating performance.",
      { max: 140 },
    ),
    regionLabel: text("Label above the region", "Operating region", { max: 30 }),
    portfolioLabel: text("Label above the property count", "Portfolio", { max: 30 }),
    portfolioText: text("Property count", "{assetCount} operating assets", { max: 60 }),
    exploreLabel: text("First link column heading", "Explore", { max: 24 }),
    legalLabel: text("Second link column heading", "Legal", { max: 24 }),
    legalLinks: list(
      "Second column links",
      "Link",
      navLink,
      [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Contact", href: "/contact" },
      ],
      { titleField: "label", max: 6 },
    ),
  },
});

export const companyFounder = defineSection({
  key: "company.founder",
  page: "company",
  title: "Founder",
  description:
    "The founder's profile and story — the About page Leadership section. Facts come from the LODGING Magazine interview; do not add biographical details that are not sourced.",
  fields: {
    name: text("Name", "Sanjay Patel"),
    role: text("Title", "Chief Executive Officer & President"),
    portrait: image(
      "Portrait",
      { src: "/founder-image.png", alt: "Sanjay Patel, Chief Executive Officer & President" },
      { noCredit: true },
    ),
    yearsInIndustry: number("Years in the industry", 27, {
      min: 0,
      max: 80,
      help: "Drives the “27+” figure in the stats rows.",
    }),
    firstOwnershipYear: number("Year of first ownership", 2001, { min: 1900, max: 2100 }),
    sourceName: text("Interview publication", "LODGING Magazine", {
      help: "Credited under the founder's quotes.",
    }),
    sourceUrl: url(
      "Interview link",
      "https://lodgingmagazine.com/starting-off-in-hospitality-with-an-owner-mindset/",
    ),
    story: list(
      "Story",
      "Chapter",
      {
        heading: text("Heading", "Chapter", { max: 40 }),
        body: textarea("Text", ""),
      },
      [
        {
          heading: "Arrival",
          body: "Sanjay Patel arrived in the United States from India in 1996 with ten dollars and no capital behind him. What he had instead was a willingness to learn the business from its floor, on the conviction that a hotel is only ever understood by the people who run it.",
        },
        {
          heading: "The floor",
          body: "He began at a small Tampa hotel owned by an uncle, taking the controls whenever his uncle was away. From there he moved to an independent property as a night auditor, and made a point of learning every function in the building — housekeeping, front desk, maintenance, the ledger. Within three years he was general manager of a larger hotel in southwest Florida, working sixteen-hour days for three years without taking a day off.",
        },
        {
          heading: "The owner's mindset",
          body: "He ran the business like an owner years before he became one. Every unsold room registered as a personal loss; every dollar of revenue was treated as his own. That discipline is the origin of the company's operating philosophy — that ownership is a way of thinking about an asset, not merely a line on a title.",
        },
        {
          heading: "First ownership",
          body: "In 2001 a physician connected to his employer needed an experienced operator for a property in Pinellas Park, Florida. Patel had no money to contribute, so he contributed expertise instead, negotiating a partnership stake in place of capital. In the first year, revenue rose from $250,000 to $650,000, occupancy reached roughly 95 percent, and he repaid his share of the loan. The property was run by family members and two housekeeping employees. Two things made that possible: he knew every function in the building well enough to run the operation from the inside, and he had spent years treating revenue as his own before any of it was — which is what let a property run that lean without a guest noticing.",
        },
        {
          heading: "The group",
          body: "That first success became Brahmas Management and Investment Group. The portfolio has grown to a diversified set of operating assets across hospitality, education, and residential real estate — the majority midscale hotels operating under established franchise systems. As the group's record with lenders lengthened, banks began approaching it directly to take on distressed and bankrupt properties during downturns.",
        },
        {
          heading: "How we hire",
          body: "The company recruits for disposition rather than credentials. Employees who show genuine ownership instinct are trained against nearly three decades of operating knowledge, and the strongest performers are offered equity stakes in new projects — the same path that turned an operator into an owner.",
        },
      ],
      { titleField: "heading", min: 1 },
    ),
  },
});

export const companyTeam = defineSection({
  key: "company.team",
  page: "company",
  title: "Team",
  description: "The team grid on the About page.",
  fields: {
    members: list(
      "Team members",
      "Team member",
      {
        name: text("Name", "", { max: 60 }),
        role: text("Title", "", { max: 60 }),
        focus: text("Focus", "", { max: 120, help: "What they do day to day." }),
        photo: image("Headshot", { src: "" }, {
          optional: true,
          noCredit: true,
          help: "Leave empty to show the person's initials instead.",
        }),
      },
      [
        {
          name: "Rajiv Mehta",
          role: "Chief Investment Officer",
          focus: "Strategy, capital, and lender relationships",
          photo: { src: "/team-member1.png", alt: "Rajiv Mehta", attribution: null },
        },
        {
          name: "Vikram Shah",
          role: "Director of Acquisitions",
          focus: "Underwriting, diligence, and market selection",
          photo: { src: "/team-member2.png", alt: "Vikram Shah", attribution: null },
        },
        {
          name: "Neil Kapoor",
          role: "Director of Asset Management",
          focus: "Capital improvement and brand standards",
          photo: { src: "/team-member3.png", alt: "Neil Kapoor", attribution: null },
        },
        {
          name: "Ananya Rao",
          role: "Head of Hospitality Operations",
          focus: "Brahmas Hospitality Management",
          photo: { src: "/team-member4.png", alt: "Ananya Rao", attribution: null },
        },
        {
          name: "Meera Iyer",
          role: "Admin",
          focus: "Records, scheduling, and day-to-day office coordination",
          photo: { src: "/team-member5.png", alt: "Meera Iyer", attribution: null },
        },
        {
          name: "Priya Nair",
          role: "Head of Development",
          focus: "Ground-up development and major repositioning",
          photo: { src: "/team-member6.png", alt: "Priya Nair", attribution: null },
        },
      ],
      { titleField: "name" },
    ),
  },
});

export const companyPartner = defineSection({
  key: "company.partner",
  page: "company",
  title: "Construction partner",
  description:
    "Shown on About and Services. Credit the relationship only — do not claim a joint project the partner has not delivered.",
  fields: {
    name: text("Partner name", "Heal Construct"),
    role: text("Relationship", "Construction Partner", { max: 40 }),
    url: url("Website", "https://www.healconstruct.com/"),
    capabilities: lines("Their capabilities", ["Design", "Build", "BIM"], {
      maxLines: 3,
      maxLineLength: 24,
      help: "One per line. The layout is set for three.",
    }),
    body: lines("Description", [
      "Brahmas works with Heal Construct, a",
      "design-build and interior practice, as a",
      "preferred construction partner on",
      "repositioning work.",
    ]),
  },
});

export const globalSections = [
  globalSeo,
  globalContact,
  globalNavigation,
  globalFooter,
  companyFounder,
  companyTeam,
  companyPartner,
] as const;
