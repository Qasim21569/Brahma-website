/**
 * The editable-content field system.
 *
 * A SECTION is a fixed part of a page (the homepage hero, the About team intro).
 * Its FIELDS are the slots an editor may fill — text, hand-broken lines, images,
 * repeatable lists. The layout around them is code and is not editable: that is
 * the "content slots only" decision in docs/ADMIN-PANEL.md.
 *
 * Every field carries its `default` — the copy the site shipped with. The
 * database only stores what an editor has saved, and `resolveValues()` merges
 * the two, so:
 *   - a section nobody has touched renders exactly what is in the code;
 *   - adding a field later needs no data migration;
 *   - a malformed stored value falls back to the default instead of crashing a
 *     page.
 *
 * This module is shared by the server (rendering) and the admin forms
 * (editing), so it must stay free of server-only imports.
 */

export type ImageValue = {
  src: string;
  alt: string;
  /**
   * Credit that MUST be shown wherever the image appears — required for any
   * photo from Google Places. Null for photography the group owns.
   */
  attribution: string | null;
};

type Base = {
  label: string;
  /** One or two sentences shown under the label in the admin. */
  help?: string;
};

export type TextField = Base & {
  type: "text";
  default: string;
  max?: number;
  /** Empty allowed. Required fields refuse to save blank. */
  optional?: boolean;
};

export type TextareaField = Base & {
  type: "textarea";
  default: string;
  max?: number;
  optional?: boolean;
};

/**
 * Hand-broken lines (BUILD-PLAYBOOK §2.2). Each line becomes one masked reveal
 * line on the page, so the editor controls the line breaks. Edited as a text
 * box where every new line is a line on screen.
 */
export type LinesField = Base & {
  type: "lines";
  default: readonly string[];
  /** Soft limit — the admin warns past it but still saves. */
  maxLineLength?: number;
  maxLines?: number;
  optional?: boolean;
};

export type NumberField = Base & {
  type: "number";
  default: number;
  min?: number;
  max?: number;
};

/** A link target: `/about`, `#team`, `https://…` or `mailto:…`. */
export type UrlField = Base & {
  type: "url";
  default: string;
  optional?: boolean;
};

export type EmailField = Base & {
  type: "email";
  default: string;
};

export type SelectField = Base & {
  type: "select";
  default: string;
  options: readonly { value: string; label: string }[];
};

export type ImageField = Base & {
  type: "image";
  default: ImageValue;
  /** An empty `src` is allowed and means "no image". */
  optional?: boolean;
  /**
   * The surface has nowhere to print a credit (heroes, full-bleed bands), so
   * an image carrying an attribution must not be placed here.
   */
  noCredit?: boolean;
};

export type GalleryField = Base & {
  type: "gallery";
  default: readonly ImageValue[];
  /** As on ImageField — no photo here may carry a credit. */
  noCredit?: boolean;
  min?: number;
};

/** A pick of portfolio slugs, e.g. the homepage Selected Work trio. */
export type PropertyRefsField = Base & {
  type: "propertyRefs";
  default: readonly string[];
  count?: number;
};

export type ScalarField =
  | TextField
  | TextareaField
  | LinesField
  | NumberField
  | UrlField
  | EmailField
  | SelectField
  | ImageField
  | GalleryField
  | PropertyRefsField;

export type ListField<F extends Record<string, ScalarField> = Record<string, ScalarField>> =
  Base & {
    type: "list";
    /** Singular noun for one entry — "Question", "Team member". */
    itemLabel: string;
    /** Which sub-field titles an entry in the collapsed admin view. */
    titleField?: keyof F & string;
    fields: F;
    default: readonly ValuesOf<F>[];
    min?: number;
    max?: number;
  };

export type Field = ScalarField | ListField<Record<string, ScalarField>>;
export type FieldMap = Record<string, Field>;

type ScalarValue<F> = F extends { type: "text" | "textarea" | "url" | "email" | "select" }
  ? string
  : F extends { type: "lines" | "propertyRefs" }
    ? string[]
    : F extends { type: "number" }
      ? number
      : F extends { type: "image" }
        ? ImageValue
        : F extends { type: "gallery" }
          ? ImageValue[]
          : never;

export type FieldValue<F> = F extends ListField<infer G> ? ValuesOf<G>[] : ScalarValue<F>;

export type ValuesOf<F extends Record<string, Field>> = { [K in keyof F]: FieldValue<F[K]> };

// ── Constructors ────────────────────────────────────────────────────────────
// Thin, but they pin the literal `type` and let `list()` infer its item shape.

type Opts<F> = Omit<F, "type" | "label" | "default">;

export const text = (label: string, value: string, opts: Opts<TextField> = {}): TextField => ({
  type: "text",
  label,
  default: value,
  ...opts,
});

export const textarea = (
  label: string,
  value: string,
  opts: Opts<TextareaField> = {},
): TextareaField => ({ type: "textarea", label, default: value, ...opts });

export const lines = (
  label: string,
  value: readonly string[],
  opts: Opts<LinesField> = {},
): LinesField => ({ type: "lines", label, default: value, maxLineLength: 46, ...opts });

export const number = (label: string, value: number, opts: Opts<NumberField> = {}): NumberField => ({
  type: "number",
  label,
  default: value,
  ...opts,
});

export const url = (label: string, value: string, opts: Opts<UrlField> = {}): UrlField => ({
  type: "url",
  label,
  default: value,
  ...opts,
});

export const email = (label: string, value: string, opts: Opts<EmailField> = {}): EmailField => ({
  type: "email",
  label,
  default: value,
  ...opts,
});

export const select = (
  label: string,
  value: string,
  options: SelectField["options"],
  opts: Omit<Opts<SelectField>, "options"> = {},
): SelectField => ({ type: "select", label, default: value, options, ...opts });

export const image = (
  label: string,
  value: Partial<ImageValue> & { src: string },
  opts: Opts<ImageField> = {},
): ImageField => ({
  type: "image",
  label,
  default: { alt: "", attribution: null, ...value },
  ...opts,
});

export const gallery = (
  label: string,
  value: readonly ImageValue[],
  opts: Opts<GalleryField> = {},
): GalleryField => ({ type: "gallery", label, default: value, ...opts });

export const propertyRefs = (
  label: string,
  value: readonly string[],
  opts: Opts<PropertyRefsField> = {},
): PropertyRefsField => ({ type: "propertyRefs", label, default: value, ...opts });

export function list<const F extends Record<string, ScalarField>>(
  label: string,
  itemLabel: string,
  fields: F,
  value: readonly ValuesOf<F>[],
  opts: Omit<ListField<F>, "type" | "label" | "default" | "itemLabel" | "fields"> = {},
): ListField<F> {
  return { type: "list", label, itemLabel, fields, default: value, ...opts };
}

// ── Sections ────────────────────────────────────────────────────────────────

export type PageKey =
  | "global"
  | "home"
  | "about"
  | "services"
  | "portfolio"
  | "property"
  | "company"
  | "careers"
  | "contact"
  | "legal";

export type SectionDef<F extends FieldMap = FieldMap, K extends string = string> = {
  key: K;
  page: PageKey;
  title: string;
  /** Where this appears, in the editor's terms. */
  description?: string;
  fields: F;
};

export function defineSection<const K extends string, const F extends FieldMap>(
  def: SectionDef<F, K>,
): SectionDef<F, K> {
  return def;
}

export type SectionValues<S> = S extends SectionDef<infer F, string> ? ValuesOf<F> : never;

// ── Resolution: stored data → safe values ───────────────────────────────────

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === "string");

function coerceImage(v: unknown): ImageValue | undefined {
  if (!isRecord(v) || typeof v.src !== "string") return undefined;
  return {
    src: v.src,
    alt: typeof v.alt === "string" ? v.alt : "",
    attribution: typeof v.attribution === "string" && v.attribution.trim() ? v.attribution : null,
  };
}

/**
 * Coerce one stored value to the field's shape, or `undefined` if it cannot be
 * — the caller then falls back to the default. Never throws: a bad row in the
 * database must degrade one field, not take a page down.
 */
export function coerceValue(field: Field, v: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "url":
    case "email":
      return typeof v === "string" ? v : undefined;
    case "select":
      return typeof v === "string" && field.options.some((o) => o.value === v) ? v : undefined;
    case "lines":
      // Trailing spaces and blank lines are editing debris, never intended
      // output — a blank line would render as an empty animated line.
      return isStringArray(v) ? v.map((l) => l.replace(/\s+$/, "")).filter(Boolean) : undefined;
    case "propertyRefs":
      return isStringArray(v) ? v.filter(Boolean) : undefined;
    case "number":
      return typeof v === "number" && Number.isFinite(v) ? v : undefined;
    case "image":
      return coerceImage(v);
    case "gallery": {
      if (!Array.isArray(v)) return undefined;
      return v.map(coerceImage).filter((x): x is ImageValue => x !== undefined);
    }
    case "list": {
      if (!Array.isArray(v)) return undefined;
      return v.filter(isRecord).map((item) => resolveValues(field.fields, item));
    }
  }
}

/** Defaults overlaid with whatever valid values were stored. */
export function resolveValues<F extends FieldMap>(fields: F, stored: unknown): ValuesOf<F> {
  const data = isRecord(stored) ? stored : {};
  const out: Record<string, unknown> = {};
  for (const [name, field] of Object.entries(fields)) {
    const coerced = name in data ? coerceValue(field, data[name]) : undefined;
    out[name] = coerced !== undefined ? coerced : structuredClone(field.default);
  }
  return out as ValuesOf<F>;
}

// ── Validation (on save) ────────────────────────────────────────────────────

export type ValidationIssue = { path: string; message: string; level: "error" | "warning" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidHref(v: string): boolean {
  if (v.startsWith("/") || v.startsWith("#")) return true;
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Images must be a file the site serves (`/…`) or an upload in this project's
 * Supabase `media` bucket. next/image refuses any other host (see
 * next.config.mjs), so a pasted third-party URL would break the page's build —
 * and hotlinking images we do not hold is how this site once ended up showing
 * unlicensed Google CDN placeholders (defect D-10).
 */
export function isAllowedImageSrc(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  return src.startsWith(`${base.replace(/\/$/, "")}/storage/v1/object/public/media/`);
}

function validateField(field: Field, v: unknown, path: string, out: ValidationIssue[]) {
  const err = (message: string) => out.push({ path, message, level: "error" });
  const warn = (message: string) => out.push({ path, message, level: "warning" });

  switch (field.type) {
    case "text":
    case "textarea": {
      const s = String(v ?? "");
      if (!field.optional && !s.trim()) err(`${field.label} cannot be empty.`);
      if (field.max && s.length > field.max) err(`${field.label} is limited to ${field.max} characters.`);
      return;
    }
    case "lines": {
      const arr = (v as string[]) ?? [];
      if (!field.optional && arr.length === 0) err(`${field.label} needs at least one line.`);
      if (field.maxLines && arr.length > field.maxLines)
        warn(`${field.label} has ${arr.length} lines; the design was set for ${field.maxLines}.`);
      if (field.maxLineLength) {
        arr.forEach((line, i) => {
          if (line.length > field.maxLineLength!)
            warn(
              `${field.label}, line ${i + 1} is ${line.length} characters — over ~${field.maxLineLength} it may wrap and break the line rhythm.`,
            );
        });
      }
      return;
    }
    case "url": {
      const s = String(v ?? "").trim();
      if (!s) {
        if (!field.optional) err(`${field.label} cannot be empty.`);
        return;
      }
      if (!isValidHref(s)) err(`${field.label} must start with /, #, https://, mailto: or tel:.`);
      return;
    }
    case "email": {
      if (!EMAIL_RE.test(String(v ?? "").trim())) err(`${field.label} must be a valid email address.`);
      return;
    }
    case "number": {
      const n = v as number;
      if (typeof n !== "number" || !Number.isFinite(n)) return err(`${field.label} must be a number.`);
      if (field.min !== undefined && n < field.min) err(`${field.label} must be at least ${field.min}.`);
      if (field.max !== undefined && n > field.max) err(`${field.label} must be at most ${field.max}.`);
      return;
    }
    case "select":
      return;
    case "image": {
      const img = v as ImageValue;
      if (!img?.src) {
        if (!field.optional) err(`${field.label}: choose an image.`);
        return;
      }
      if (!isAllowedImageSrc(img.src))
        err(`${field.label}: upload the image here rather than linking to another website.`);
      if (!img.alt?.trim()) err(`${field.label}: describe the image (alt text) for screen readers.`);
      if (field.noCredit && img.attribution)
        err(
          `${field.label}: this spot has nowhere to show a photo credit. Use a photo the group owns (no credit needed).`,
        );
      return;
    }
    case "gallery": {
      const photos = v as ImageValue[];
      if (field.min && photos.length < field.min)
        err(`${field.label} needs at least ${field.min} photo(s).`);
      photos.forEach((img, i) => {
        if (!img.src) err(`${field.label}, photo ${i + 1}: missing image.`);
        else if (!isAllowedImageSrc(img.src))
          err(`${field.label}, photo ${i + 1}: upload the image rather than linking to another website.`);
        else if (!img.alt?.trim()) err(`${field.label}, photo ${i + 1}: add alt text.`);
        if (field.noCredit && img.attribution)
          err(`${field.label}, photo ${i + 1}: this spot cannot show a photo credit.`);
      });
      return;
    }
    case "propertyRefs": {
      const arr = v as string[];
      if (field.count && arr.length !== field.count)
        err(`${field.label}: choose exactly ${field.count} properties.`);
      return;
    }
    case "list": {
      const items = (v as Record<string, unknown>[]) ?? [];
      if (field.min !== undefined && items.length < field.min)
        err(`${field.label} needs at least ${field.min} ${field.itemLabel.toLowerCase()}(s).`);
      if (field.max !== undefined && items.length > field.max)
        err(`${field.label} allows at most ${field.max} ${field.itemLabel.toLowerCase()}(s).`);
      items.forEach((item, i) => {
        for (const [name, sub] of Object.entries(field.fields)) {
          validateField(sub, item[name], `${path}.${i}.${name}`, out);
        }
      });
      return;
    }
  }
}

/**
 * Coerce a submitted payload to the schema, then validate it. The returned
 * `values` are what gets stored — unknown keys are dropped, so a client cannot
 * smuggle arbitrary JSON into the database through a form.
 */
export function validateValues<F extends FieldMap>(
  fields: F,
  submitted: unknown,
): { values: ValuesOf<F>; issues: ValidationIssue[] } {
  const values = resolveValues(fields, submitted);
  const issues: ValidationIssue[] = [];
  for (const [name, field] of Object.entries(fields)) {
    validateField(field, (values as Record<string, unknown>)[name], name, issues);
  }
  return { values, issues };
}

// ── Tokens ──────────────────────────────────────────────────────────────────
// Figures in copy are DERIVED, never typed (the "02 properties against a
// portfolio of 12" defect). Editors write `{assetCount}` and the page fills it.

export const TOKEN_HELP: Record<string, string> = {
  assetCount: "number of published properties, e.g. 12",
  assetCountWord: "the same number as a word, e.g. Twelve",
  assetClassCount: "number of asset classes, e.g. 3",
  assetClassList: "e.g. Hospitality, Education, Residential",
  year: "the current year",
};

export function interpolate(s: string, tokens: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (match, name: string) => tokens[name] ?? match);
}

/** Apply tokens to every string in a resolved value tree. */
export function interpolateDeep<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === "string") return interpolate(value, tokens) as T;
  if (Array.isArray(value)) return value.map((v) => interpolateDeep(v, tokens)) as T;
  if (isRecord(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      // Image sources and link targets are never token-bearing.
      out[k] = k === "src" || k === "href" ? v : interpolateDeep(v, tokens);
    }
    return out as T;
  }
  return value;
}
