/**
 * The property editor's form — the same field system as page sections, mapped
 * to and from the `Property` record.
 *
 * Fields NOT listed here (placeId, coordinates, the legacy thesis prose,
 * homeSatelliteSrc) are machine-filled or unused; saving preserves whatever the
 * record already holds for them.
 *
 * Shared by the admin form (client) and the save action (server).
 */
import type { Amenity, Property } from "@/data/properties";
import {
  gallery,
  image,
  list,
  select,
  text,
  textarea,
  url,
  type ImageValue,
  type ValuesOf,
} from "./fields";

export const AMENITY_ICONS = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "breakfast", label: "Breakfast" },
  { value: "pool", label: "Pool" },
  { value: "fitness", label: "Fitness" },
  { value: "parking", label: "Parking" },
  { value: "shuttle", label: "Shuttle" },
  { value: "meeting", label: "Meeting space" },
  { value: "restaurant", label: "Restaurant" },
  { value: "bar", label: "Bar" },
  { value: "pets", label: "Pets" },
  { value: "family", label: "Family" },
  { value: "accessible", label: "Accessible" },
  { value: "accessible-parking", label: "Accessible parking" },
  { value: "waterfront", label: "Waterfront" },
  { value: "acreage", label: "Acreage" },
  { value: "dock", label: "Dock" },
  { value: "residence", label: "Residence" },
  { value: "porch", label: "Porch" },
  { value: "pond", label: "Pond" },
] as const;

export const propertyFields = {
  name: text("Full name", "", {
    max: 120,
    help: "As it appears on the property's own listing — enrichment matches on it.",
  }),
  shortName: text("Short name", "", { max: 60, help: "Used on cards and headings." }),
  assetType: select("Asset type", "hospitality", [
    { value: "hospitality", label: "Hospitality" },
    { value: "education", label: "Education" },
    { value: "residential", label: "Residential" },
  ]),
  brand: text("Brand / franchise", "", { optional: true, max: 60 }),
  acquiredYear: text("Year acquired", "", { max: 10 }),
  subunit: text("Operated by", "Brahmas Hospitality Management", { max: 80 }),
  contentStatus: select("Copy status", "placeholder", [
    { value: "placeholder", label: "Placeholder — not yet approved" },
    { value: "final", label: "Final — approved by the client" },
  ]),

  address: text("Street address", "", { max: 160 }),
  city: text("City", "", { max: 60 }),
  state: text("State", "Florida", { max: 40 }),
  phone: text("Phone", "", { optional: true, max: 30 }),
  bookingUrl: url("Booking link", "", { optional: true }),

  summary: textarea("Summary", "", {
    max: 240,
    help: "One sentence. Shown on the portfolio card and under the heading.",
  }),
  longform: textarea("Description", "", { help: "The paragraph on the property's page." }),

  cover: image("Cover image", { src: "" }, {
    optional: true,
    help: "Used on the homepage Selected Work. Leave empty to use the first gallery photo.",
  }),
  gallery: gallery("Gallery", [], {
    help: "The first photo is the large image at the top of the property page. Leave empty to show the Google photos.",
  }),

  amenitiesMode: select("Amenities source", "google", [
    { value: "google", label: "Google — use what the listing publishes" },
    { value: "custom", label: "Custom — use the list below" },
  ]),
  amenities: list(
    "Custom amenities",
    "Amenity",
    {
      label: text("Label", "", { max: 60 }),
      icon: select("Icon", "wifi", AMENITY_ICONS),
    },
    [],
    { titleField: "label", help: "Only used when the source above is Custom." },
  ),
  highlights: list(
    "Extra facts",
    "Fact",
    {
      label: text("Label", "", { max: 40 }),
      value: text("Value", "", { max: 80 }),
    },
    [],
    { titleField: "label" },
  ),
};

export type PropertyFormValues = ValuesOf<typeof propertyFields>;

const toImage = (src: string | null, alt: string): ImageValue => ({
  src: src ?? "",
  alt,
  attribution: null,
});

/** Record → form. Uses the RAW (hand-authored) record, not the enriched one. */
export function propertyToValues(p: Property): PropertyFormValues {
  return {
    name: p.name,
    shortName: p.shortName,
    assetType: p.assetType,
    brand: p.brand ?? "",
    acquiredYear: p.acquiredYear,
    subunit: p.subunit,
    contentStatus: p.contentStatus,
    address: p.address,
    city: p.city,
    state: p.state,
    phone: p.phone ?? "",
    bookingUrl: p.bookingUrl ?? "",
    summary: p.summary,
    longform: p.longform,
    cover: toImage(p.homeHeroSrc, `${p.shortName} exterior`),
    gallery: p.gallery.map((g) => ({ src: g.src, alt: g.alt, attribution: g.attribution ?? null })),
    amenitiesMode: p.amenities ? "custom" : "google",
    amenities: (p.amenities ?? []).map((a) => ({ label: a.label, icon: a.icon })),
    highlights: p.highlights ?? [],
  };
}

const orNull = (s: string) => (s.trim() ? s.trim() : null);

/** Form → record data, preserving the fields the form does not edit. */
export function valuesToPropertyData(
  v: PropertyFormValues,
  existing: Partial<Property> = {},
): Omit<Property, "slug"> {
  const amenities: Amenity[] | undefined =
    v.amenitiesMode === "custom" ? v.amenities.map((a) => ({ label: a.label, icon: a.icon })) : undefined;

  const { slug: _slug, amenities: _a, amenitiesSource: _s, highlights: _h, ...kept } = {
    ...existing,
  } as Partial<Property>;
  void _slug;
  void _a;
  void _s;
  void _h;

  return {
    category: "Acquisition",
    placeId: null,
    coordinates: null,
    acquisition: "",
    renovation: "",
    operations: "",
    outcomesNote: "",
    homeSatelliteSrc: null,
    ...kept,
    name: v.name.trim(),
    shortName: v.shortName.trim(),
    assetType: v.assetType as Property["assetType"],
    brand: orNull(v.brand),
    acquiredYear: v.acquiredYear.trim(),
    subunit: v.subunit.trim(),
    contentStatus: v.contentStatus === "final" ? "final" : "placeholder",
    address: v.address.trim(),
    city: v.city.trim(),
    state: v.state.trim(),
    phone: orNull(v.phone),
    bookingUrl: orNull(v.bookingUrl),
    summary: v.summary.trim(),
    longform: v.longform.trim(),
    homeHeroSrc: orNull(v.cover.src),
    gallery: v.gallery,
    ...(amenities ? { amenities, amenitiesSource: "client" as const } : {}),
    ...(v.highlights.length ? { highlights: v.highlights } : {}),
  };
}

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
