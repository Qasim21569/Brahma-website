/**
 * Offline checks for the admin content layer — no database, no network.
 *
 *   npm run content:check
 *
 * 1. Every section's shipped defaults pass its own validation (so a section
 *    can always be saved unchanged).
 * 2. Stored values overlay defaults; junk falls back instead of crashing.
 * 3. Every real property survives the edit form unchanged:
 *    record → form values → record is lossless for everything on the page.
 * 4. `{tokens}` fill in; unknown ones are left alone.
 */
import assert from "node:assert/strict";
import { allSections } from "../src/content/registry";
import {
  interpolateDeep,
  resolveValues,
  validateValues,
} from "../src/content/fields";
import {
  propertyFields,
  propertyToValues,
  slugify,
  valuesToPropertyData,
} from "../src/content/propertyFields";
import { enrich, normalizeProperty, properties } from "../src/data/properties";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

console.log("Sections");
for (const section of allSections) {
  check(`${section.key}: defaults are valid`, () => {
    const { issues } = validateValues(section.fields, resolveValues(section.fields, undefined));
    const errors = issues.filter((i) => i.level === "error");
    assert.deepEqual(errors, [], JSON.stringify(errors));
  });
}

check("stored values overlay defaults; bad types fall back", () => {
  const hero = allSections.find((s) => s.key === "home.hero")!;
  const v = resolveValues(hero.fields, {
    headline: ["One", "", "Two  "],
    buttonLabel: 42,
    image: { src: "/x.webp" },
    unknown: "dropped",
  }) as Record<string, unknown>;
  assert.deepEqual(v.headline, ["One", "Two"]);
  assert.equal(v.buttonLabel, "Reach Out to Us");
  assert.deepEqual(v.image, { src: "/x.webp", alt: "", attribution: null });
  assert.equal("unknown" in v, false);
});

check("validation blocks a credited photo on a no-credit surface", () => {
  const hero = allSections.find((s) => s.key === "home.hero")!;
  const { issues } = validateValues(hero.fields, {
    ...resolveValues(hero.fields, undefined),
    image: { src: "/a.jpg", alt: "A", attribution: "Photo: Google user" },
  });
  assert.ok(issues.some((i) => i.level === "error" && i.path === "image"));
});

check("validation rejects javascript: links", () => {
  const cta = allSections.find((s) => s.key === "home.cta")!;
  const { issues } = validateValues(cta.fields, {
    ...resolveValues(cta.fields, undefined),
    buttonHref: "javascript:alert(1)",
  });
  assert.ok(issues.some((i) => i.level === "error" && i.path === "buttonHref"));
});

check("validation refuses images hotlinked from other websites", () => {
  const band = allSections.find((s) => s.key === "about.band")!;
  const { issues } = validateValues(band.fields, {
    image: { src: "https://lh3.googleusercontent.com/x.jpg", alt: "A", attribution: null },
  });
  assert.ok(issues.some((i) => i.level === "error" && i.path === "image"));
});

check("tokens interpolate, unknown tokens survive, src untouched", () => {
  const out = interpolateDeep(
    { a: "We run {assetCount} assets {nope}", img: { src: "/{assetCount}.jpg" } },
    { assetCount: "12" },
  );
  assert.deepEqual(out, { a: "We run 12 assets {nope}", img: { src: "/{assetCount}.jpg" } });
});

console.log("Properties");
for (const p of properties) {
  check(`${p.slug}: form round-trip is lossless`, () => {
    const values = propertyToValues(p);
    const { issues } = validateValues(propertyFields, values);
    const errors = issues.filter((i) => i.level === "error");
    assert.deepEqual(errors, [], JSON.stringify(errors));

    const { slug, ...existing } = p;
    const back = normalizeProperty(slug, valuesToPropertyData(values, existing));
    const a = normalizeProperty(slug, existing);
    for (const key of Object.keys(a) as (keyof typeof a)[]) {
      assert.deepEqual(back[key], a[key], `${p.slug}.${String(key)} changed on save`);
    }
    // The enriched (rendered) record must match too.
    assert.deepEqual(enrich(back), enrich(a));
  });
}

check("slugify", () => {
  assert.equal(slugify("Hampton Inn & Suites — Tampa East"), "hampton-inn-and-suites-tampa-east");
  assert.equal(slugify("  Café Résidence  "), "cafe-residence");
});

console.log(`\n${passed} checks passed.`);
