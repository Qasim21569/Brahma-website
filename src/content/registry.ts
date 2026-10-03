/**
 * Every editable section, and how the admin groups them.
 *
 * Shared by the public site and the admin, so no server-only imports.
 */
import type { PageKey, SectionDef, SectionValues } from "./fields";
import { globalSections } from "./sections/global";
import { homeSections } from "./sections/home";
import { aboutSections } from "./sections/about";
import { servicesSections } from "./sections/services";
import { portfolioSections } from "./sections/portfolio";
import { careersSections } from "./sections/careers";
import { contactSections } from "./sections/contact";
import { legalSections } from "./sections/legal";

const all = [
  ...globalSections,
  ...homeSections,
  ...aboutSections,
  ...servicesSections,
  ...portfolioSections,
  ...careersSections,
  ...contactSections,
  ...legalSections,
] as const;

type AnySection = (typeof all)[number];

export type SectionKey = AnySection["key"];

/** Map from key to section, typed so `getSection("home.hero")` is exact. */
export type SectionByKey = { [S in AnySection as S["key"]]: S };

export type ValuesFor<K extends SectionKey> = SectionValues<SectionByKey[K]>;

export const sectionsByKey = Object.fromEntries(all.map((s) => [s.key, s])) as unknown as SectionByKey;

export const allSections: readonly SectionDef[] = all as unknown as readonly SectionDef[];

export function findSection(key: string): SectionDef | undefined {
  return allSections.find((s) => s.key === key);
}

/** Admin navigation — one entry per page, in the order an editor thinks of them. */
export const pages: readonly {
  key: PageKey;
  label: string;
  /** Live URL, for the "view page" link. */
  path: string | null;
  blurb: string;
}[] = [
  { key: "home", label: "Home", path: "/", blurb: "Hero, About, Process, Selected Work and more." },
  { key: "about", label: "About", path: "/about", blurb: "Story, leadership, approach and team intro." },
  { key: "services", label: "Services", path: "/services", blurb: "Capabilities, pillars and FAQs." },
  { key: "portfolio", label: "Portfolio page", path: "/portfolio", blurb: "The portfolio overview page." },
  {
    key: "property",
    label: "Property page labels",
    path: null,
    blurb: "Wording shared by every property detail page.",
  },
  { key: "careers", label: "Careers", path: "/careers", blurb: "Hiring philosophy and disciplines." },
  { key: "contact", label: "Contact", path: "/contact", blurb: "Contact page wording." },
  { key: "company", label: "Company", path: "/about", blurb: "Founder, team and construction partner." },
  { key: "global", label: "Site settings", path: "/", blurb: "Contact details, footer and search description." },
  { key: "legal", label: "Legal pages", path: "/privacy", blurb: "Privacy Policy and Terms of Service." },
];

export function sectionsForPage(page: PageKey): readonly SectionDef[] {
  return allSections.filter((s) => s.page === page);
}

// Fail fast in development if two sections share a key.
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const s of allSections) {
    if (seen.has(s.key)) throw new Error(`Duplicate content section key: ${s.key}`);
    seen.add(s.key);
  }
}
