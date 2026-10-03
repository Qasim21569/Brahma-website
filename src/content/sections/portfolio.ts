import { defineSection, lines, text, url } from "../fields";
import { metaDescription, metaTitle } from "./shared";

export const portfolioHero = defineSection({
  key: "portfolio.hero",
  page: "portfolio",
  title: "Opening",
  description: "Use {assetCountWord} or {assetCount} for the number of properties — it updates itself.",
  fields: {
    metaTitle: metaTitle("Portfolio"),
    metaDescription: metaDescription(
      "{assetCountWord} operating assets across hospitality, education, and residential real estate in Florida — acquired, repositioned, and operated directly by Brahmas.",
    ),
    label: text("Section label", "Portfolio", { max: 30 }),
    heading: lines("Heading", [
      "{assetCountWord} operating assets.",
      "One thesis: structural",
      "quality earns long-term",
      "performance.",
    ]),
    body: lines("Text", [
      "Each asset is acquired for the performance it",
      "can be made to deliver, repositioned through",
      "capital investment, and then operated",
      "directly — never handed to a third party.",
    ]),
    assetsLabel: text("Stat label: operating assets", "Operating assets", { max: 30 }),
    classesLabel: text("Stat label: asset classes", "Asset classes", { max: 30 }),
  },
});

export const portfolioAssets = defineSection({
  key: "portfolio.assets",
  page: "portfolio",
  title: "Property grid",
  description: "The properties themselves are edited under Properties.",
  fields: {
    label: text("Section label", "The Assets", { max: 30 }),
    allLabel: text("“All” filter button", "All assets", { max: 24 }),
    viewLabel: text("Card link", "View property", { max: 24 }),
    emptyText: text("Shown when a filter has no matches", "No assets in this category.", {
      max: 80,
    }),
  },
});

export const portfolioCta = defineSection({
  key: "portfolio.cta",
  page: "portfolio",
  title: "Next steps",
  fields: {
    label: text("Section label", "Next Steps", { max: 30 }),
    heading: lines("Heading", ["Have an asset that fits", "the portfolio?"]),
    body: lines("Text", [
      "We evaluate operating assets in markets whose",
      "structural quality exceeds their current",
      "performance.",
    ]),
    buttonLabel: text("Button label", "Reach out to us", { max: 30 }),
    buttonHref: url("Button link", "/contact"),
  },
});

/** Labels on every property detail page — the template, not one property. */
export const propertyTemplate = defineSection({
  key: "property.template",
  page: "property",
  title: "Property page labels",
  description:
    "Wording shared by all property detail pages. Each property's own text and photos are edited under Properties.",
  fields: {
    backLabel: text("Back link", "← Portfolio", { max: 30 }),
    bookLabel: text("Booking button", "Book This Property", { max: 30 }),
    detailLabel: text("Facts section label", "Asset Detail", { max: 30 }),
    factLocation: text("Fact label: location", "Location", { max: 24 }),
    factType: text("Fact label: asset type", "Asset Type", { max: 24 }),
    factBrand: text("Fact label: brand", "Brand", { max: 24 }),
    factAcquired: text("Fact label: acquired", "Acquired", { max: 24 }),
    factOperator: text("Fact label: operator", "Operated By", { max: 24 }),
    factAddress: text("Fact label: address", "Address", { max: 24 }),
    independentLabel: text("Shown instead of a brand when there is none", "Independent", {
      max: 24,
    }),
    amenitiesLabel: text("Amenities section label", "Amenities", { max: 30 }),
    amenitiesHeadingHotel: lines("Amenities heading — hotels", ["What guests find", "on arrival."]),
    amenitiesHeadingOther: lines("Amenities heading — other assets", [
      "What the property",
      "provides.",
    ]),
    amenitiesGoogleNote: lines("Note under Google-sourced amenities", [
      "Amenity information as published by the",
      "property on Google. Confirm details at",
      "time of booking.",
    ]),
    amenitiesBrandLink: text("Amenities link — branded property", "Full amenity list at {brand}", {
      max: 50,
      help: "{brand} is replaced with the property's brand, e.g. Hampton Inn.",
    }),
    amenitiesLink: text("Amenities link — no brand", "View all amenities", { max: 40 }),
    galleryLabel: text("Gallery label", "Gallery", { max: 30 }),
    moreLabel: text("Other properties label", "More Assets", { max: 30 }),
    previousLabel: text("“Previous” label", "Previous", { max: 20 }),
    nextLabel: text("“Next” label", "Next", { max: 20 }),
    viewAllLabel: text("View-all link", "View all {assetCount} assets →", { max: 40 }),
    ctaHeading: lines("Closing heading", ["Discuss this asset", "with our team."]),
    ctaPrimaryLabel: text("Closing main button", "Contact Our Team", { max: 30 }),
    ctaSecondaryLabel: text("Closing second button", "View Full Portfolio", { max: 30 }),
  },
});

export const portfolioSections = [portfolioHero, portfolioAssets, portfolioCta, propertyTemplate] as const;
