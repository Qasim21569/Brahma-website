"use client";

import { useEffect, useId, useRef, useState } from "react";
import type {
  Field,
  GalleryField,
  ImageField,
  ImageValue,
  LinesField,
  ListField,
  PropertyRefsField,
  ScalarField,
  ValidationIssue,
} from "@/content/fields";
import { listLibrary, uploadImage, type LibraryItem } from "./upload";

export type FieldContext = {
  /** For `propertyRefs` pickers. */
  propertyOptions: { slug: string; name: string }[];
};

type InputProps<F extends Field = Field> = {
  field: F;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string;
  issues: ValidationIssue[];
  context: FieldContext;
};

// ── Shared chrome ───────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-md border border-outline-variant bg-white px-3 py-2 text-[15px] text-primary shadow-sm outline-none transition focus:border-muted-azure-dim focus:ring-2 focus:ring-muted-azure/30";

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-md border border-outline-variant bg-white px-3 py-1.5 text-[13px] font-medium text-primary transition hover:bg-surface-container-low disabled:opacity-50";

export function issuesAt(issues: ValidationIssue[], path: string) {
  return issues.filter((i) => i.path === path || i.path.startsWith(`${path}.`));
}

function Issues({ issues, path }: { issues: ValidationIssue[]; path: string }) {
  const own = issues.filter((i) => i.path === path);
  if (!own.length) return null;
  return (
    <ul className="mt-1.5 space-y-1">
      {own.map((i, n) => (
        <li
          key={n}
          className={`text-[13px] ${i.level === "error" ? "text-red-700" : "text-amber-700"}`}
        >
          {i.level === "error" ? "⚠ " : "ℹ "}
          {i.message}
        </li>
      ))}
    </ul>
  );
}

function Shell({
  field,
  path,
  issues,
  htmlFor,
  children,
  aside,
}: {
  field: Field;
  path: string;
  issues: ValidationIssue[];
  htmlFor?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-semibold tracking-wide text-primary">
          {field.label}
          {"optional" in field && field.optional && (
            <span className="ml-1.5 font-normal text-mortar-grey">(optional)</span>
          )}
        </label>
        {aside}
      </div>
      {field.help && <p className="text-[13px] leading-snug text-mortar-grey">{field.help}</p>}
      {children}
      <Issues issues={issues} path={path} />
    </div>
  );
}

// ── Scalar inputs ───────────────────────────────────────────────────────────

function TextLike({ field, value, onChange, path, issues }: InputProps) {
  const id = useId();
  const s = typeof value === "string" ? value : "";
  const max = "max" in field ? field.max : undefined;
  const counter = max ? (
    <span className={`text-[12px] ${s.length > max ? "text-red-700" : "text-mortar-grey"}`}>
      {s.length}/{max}
    </span>
  ) : undefined;

  if (field.type === "textarea") {
    return (
      <Shell field={field} path={path} issues={issues} htmlFor={id} aside={counter}>
        <textarea
          id={id}
          className={`${inputClass} min-h-[120px] leading-relaxed`}
          value={s}
          rows={Math.min(14, Math.max(4, Math.ceil(s.length / 90)))}
          onChange={(e) => onChange(e.target.value)}
        />
      </Shell>
    );
  }

  return (
    <Shell field={field} path={path} issues={issues} htmlFor={id} aside={counter}>
      <input
        id={id}
        className={inputClass}
        type={field.type === "email" ? "email" : "text"}
        inputMode={field.type === "url" ? "url" : undefined}
        value={s}
        placeholder={field.type === "url" ? "/page, #anchor, https://… or mailto:…" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </Shell>
  );
}

function NumberInput({ field, value, onChange, path, issues }: InputProps) {
  const id = useId();
  return (
    <Shell field={field} path={path} issues={issues} htmlFor={id}>
      <input
        id={id}
        className={`${inputClass} max-w-[12rem]`}
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
      />
    </Shell>
  );
}

function SelectInput({ field, value, onChange, path, issues }: InputProps) {
  const id = useId();
  if (field.type !== "select") return null;
  return (
    <Shell field={field} path={path} issues={issues} htmlFor={id}>
      <select
        id={id}
        className={inputClass}
        value={typeof value === "string" ? value : field.default}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

/**
 * Hand-broken lines. Each line in the box is one animated line on the page, so
 * the editor sets the line breaks. Lines past the soft limit are flagged live.
 */
function LinesInput({ field, value, onChange, path, issues }: InputProps<LinesField>) {
  const id = useId();
  const arr = Array.isArray(value) ? (value as string[]) : [];
  // Local text so pressing Enter at the end of a line is not swallowed.
  const [text, setText] = useState(arr.join("\n"));
  const joined = arr.join("\n");
  const lastSent = useRef(joined);
  // Resync only when the value changes from outside (reset, restore).
  useEffect(() => {
    if (joined !== lastSent.current) {
      setText(joined);
      lastSent.current = joined;
    }
  }, [joined]);

  const limit = field.maxLineLength;
  const long = limit ? text.split("\n").filter((l) => l.length > limit).length : 0;

  return (
    <Shell
      field={field}
      path={path}
      issues={issues}
      htmlFor={id}
      aside={
        <span className="text-[12px] text-mortar-grey">
          {text.split("\n").filter((l) => l.trim()).length} line(s)
          {limit ? ` · aim ≤ ${limit} characters each` : ""}
        </span>
      }
    >
      <textarea
        id={id}
        className={`${inputClass} font-mono text-[14px] leading-7`}
        value={text}
        rows={Math.max(2, text.split("\n").length)}
        wrap="off"
        spellCheck
        onChange={(e) => {
          setText(e.target.value);
          lastSent.current = e.target.value;
          onChange(e.target.value.split("\n"));
        }}
      />
      <p className="text-[12px] text-mortar-grey">
        Each line here is one line on the page.
        {long > 0 && (
          <span className="text-amber-700">
            {" "}
            {long} line(s) are longer than {limit} characters and may wrap.
          </span>
        )}
      </p>
    </Shell>
  );
}

// ── Images ──────────────────────────────────────────────────────────────────

function Thumb({ src, className = "" }: { src: string; className?: string }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-md border border-dashed border-outline-variant bg-surface-container-low text-[12px] text-mortar-grey ${className}`}
      >
        No image
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary paths/URLs
  return (
    <img
      src={src}
      alt=""
      className={`rounded-md border border-outline-variant bg-surface-container-low object-cover ${className}`}
    />
  );
}

function LibraryPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<LibraryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listLibrary()
      .then(setItems)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Uploaded images"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-primary">Previously uploaded images</h3>
          <button type="button" className={buttonClass} onClick={onClose}>
            Close
          </button>
        </div>
        {error && <p className="text-[14px] text-red-700">{error}</p>}
        {!items && !error && <p className="text-[14px] text-mortar-grey">Loading…</p>}
        {items && items.length === 0 && (
          <p className="text-[14px] text-mortar-grey">Nothing uploaded yet.</p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items?.map((item) => (
            <button
              key={item.url}
              type="button"
              className="group text-left"
              onClick={() => {
                onPick(item.url);
                onClose();
              }}
            >
              <Thumb src={item.url} className="aspect-[4/3] w-full group-hover:ring-2 group-hover:ring-muted-azure" />
              <span className="mt-1 block truncate text-[11px] text-mortar-grey">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function useUpload() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (files: File[], onDone: (urls: string[]) => void) => {
    setBusy(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadImage(f));
      onDone(urls);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}

function ImageEditor({
  value,
  onChange,
  optional,
  compact = false,
}: {
  value: ImageValue;
  onChange: (v: ImageValue) => void;
  optional?: boolean;
  compact?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [library, setLibrary] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const { busy, error, run } = useUpload();
  const altId = useId();
  const creditId = useId();

  return (
    <div className={`flex flex-col gap-4 ${compact ? "" : "sm:flex-row"}`}>
      <Thumb src={value.src} className={compact ? "aspect-[4/3] w-full" : "aspect-[4/3] w-full sm:w-56 shrink-0"} />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? "Uploading…" : value.src ? "Replace…" : "Upload…"}
          </button>
          <button type="button" className={buttonClass} onClick={() => setLibrary(true)}>
            Choose uploaded
          </button>
          {optional && value.src && (
            <button
              type="button"
              className={buttonClass}
              onClick={() => onChange({ src: "", alt: "", attribution: null })}
            >
              Remove
            </button>
          )}
          <button type="button" className={`${buttonClass} border-transparent`} onClick={() => setAdvanced((a) => !a)}>
            {advanced ? "Hide address" : "Image address"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) run([file], ([src]) => onChange({ ...value, src }));
            }}
          />
        </div>
        {error && <p className="text-[13px] text-red-700">{error}</p>}
        {advanced && (
          <input
            className={inputClass}
            value={value.src}
            placeholder="/properties/… or https://…"
            onChange={(e) => onChange({ ...value, src: e.target.value.trim() })}
          />
        )}
        <div>
          <label htmlFor={altId} className="text-[12px] font-semibold text-primary">
            Description (alt text)
          </label>
          <input
            id={altId}
            className={inputClass}
            value={value.alt}
            placeholder="What the photo shows, for screen readers and search"
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor={creditId} className="text-[12px] font-semibold text-primary">
            Photo credit <span className="font-normal text-mortar-grey">(only if the photo is not the group&apos;s own)</span>
          </label>
          <input
            id={creditId}
            className={inputClass}
            value={value.attribution ?? ""}
            placeholder="e.g. Photo: Jane Smith / Google"
            onChange={(e) => onChange({ ...value, attribution: e.target.value || null })}
          />
        </div>
      </div>
      {library && (
        <LibraryPicker onPick={(src) => onChange({ ...value, src })} onClose={() => setLibrary(false)} />
      )}
    </div>
  );
}

function ImageInput({ field, value, onChange, path, issues }: InputProps<ImageField>) {
  const img = (value as ImageValue) ?? field.default;
  return (
    <Shell field={field} path={path} issues={issues}>
      {field.noCredit && (
        <p className="text-[12px] text-amber-800">
          No credit can be shown here — use photography the group owns.
        </p>
      )}
      <ImageEditor value={img} optional={field.optional} onChange={onChange} />
    </Shell>
  );
}

function GalleryInput({ field, value, onChange, path, issues }: InputProps<GalleryField>) {
  const photos = Array.isArray(value) ? (value as ImageValue[]) : [];
  const fileRef = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUpload();
  const set = (next: ImageValue[]) => onChange(next);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };

  return (
    <Shell
      field={field}
      path={path}
      issues={issues}
      aside={<span className="text-[12px] text-mortar-grey">{photos.length} photo(s)</span>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {photos.map((photo, i) => (
          <div key={`${i}-${photo.src}`} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-mortar-grey">
                {i === 0 ? "1 · Main image" : `${i + 1}`}
              </span>
              <div className="flex gap-1">
                <button type="button" className={buttonClass} aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}>
                  ←
                </button>
                <button type="button" className={buttonClass} aria-label="Move later" disabled={i === photos.length - 1} onClick={() => move(i, 1)}>
                  →
                </button>
                <button type="button" className={buttonClass} onClick={() => set(photos.filter((_, n) => n !== i))}>
                  Remove
                </button>
              </div>
            </div>
            <ImageEditor
              compact
              value={photo}
              onChange={(v) => set(photos.map((p, n) => (n === i ? v : p)))}
            />
            <Issues issues={issues} path={`${path}.${i}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button type="button" className={buttonClass} disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Uploading…" : "+ Add photos…"}
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length)
              run(files, (urls) => set([...photos, ...urls.map((src) => ({ src, alt: "", attribution: null }))]));
          }}
        />
        {error && <span className="text-[13px] text-red-700">{error}</span>}
      </div>
    </Shell>
  );
}

function PropertyRefsInput({ field, value, onChange, path, issues, context }: InputProps<PropertyRefsField>) {
  const picked = Array.isArray(value) ? (value as string[]) : [];
  const slots = field.count ?? Math.max(picked.length + 1, 1);
  const known = new Set(context.propertyOptions.map((o) => o.slug));

  return (
    <Shell field={field} path={path} issues={issues}>
      <div className="space-y-2">
        {Array.from({ length: slots }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-5 text-right text-[13px] text-mortar-grey">{i + 1}</span>
            <select
              className={inputClass}
              value={picked[i] ?? ""}
              onChange={(e) => {
                const next = [...picked];
                next[i] = e.target.value;
                onChange(next.filter((s, n) => s || n < slots).slice(0, slots));
              }}
            >
              <option value="">— Choose a property —</option>
              {picked[i] && !known.has(picked[i]) && (
                <option value={picked[i]}>{picked[i]} (hidden or removed)</option>
              )}
              {context.propertyOptions.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── Lists ───────────────────────────────────────────────────────────────────

export function defaultsFor(fields: Record<string, ScalarField>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, structuredClone(f.default)]));
}

function ListInput({ field, value, onChange, path, issues, context }: InputProps<ListField>) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const [open, setOpen] = useState<number | null>(items.length <= 3 ? -1 : null);
  const set = (next: Record<string, unknown>[]) => onChange(next);

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
    if (open === i) setOpen(j);
  };

  const titleOf = (item: Record<string, unknown>, i: number) => {
    const t = field.titleField ? item[field.titleField] : undefined;
    return typeof t === "string" && t.trim() ? t : `${field.itemLabel} ${i + 1}`;
  };

  const atMax = field.max !== undefined && items.length >= field.max;

  return (
    <Shell
      field={field}
      path={path}
      issues={issues}
      aside={
        <span className="text-[12px] text-mortar-grey">
          {items.length} {field.itemLabel.toLowerCase()}
          {items.length === 1 ? "" : "s"}
        </span>
      }
    >
      <div className="space-y-2">
        {items.map((item, i) => {
          const expanded = open === -1 || open === i;
          const hasError = issuesAt(issues, `${path}.${i}`).some((x) => x.level === "error");
          return (
            <div
              key={i}
              className={`rounded-lg border bg-surface-container-lowest ${hasError ? "border-red-300" : "border-outline-variant"}`}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left text-[14px] font-medium text-primary"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded && open !== -1 ? null : i)}
                >
                  <span className="mr-2 inline-block w-3 text-mortar-grey">{expanded ? "▾" : "▸"}</span>
                  {titleOf(item, i)}
                  {hasError && <span className="ml-2 text-[12px] text-red-700">needs attention</span>}
                </button>
                <button type="button" className={buttonClass} aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className={buttonClass} aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  className={buttonClass}
                  disabled={field.min !== undefined && items.length <= field.min}
                  onClick={() => {
                    if (!confirm(`Remove “${titleOf(item, i)}”?`)) return;
                    set(items.filter((_, n) => n !== i));
                    // Keep the same entry expanded — indexes after i shift down.
                    if (open !== null && open !== -1) setOpen(open === i ? null : open > i ? open - 1 : open);
                  }}
                >
                  Remove
                </button>
              </div>
              {expanded && (
                <div className="space-y-5 border-t border-outline-variant/70 px-4 py-4">
                  {Object.entries(field.fields).map(([name, sub]) => (
                    <FieldInput
                      key={name}
                      field={sub}
                      value={item[name]}
                      path={`${path}.${i}.${name}`}
                      issues={issues}
                      context={context}
                      onChange={(v) => set(items.map((it, n) => (n === i ? { ...it, [name]: v } : it)))}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className={`${buttonClass} mt-2`}
        disabled={atMax}
        onClick={() => {
          set([...items, defaultsFor(field.fields)]);
          setOpen(items.length);
        }}
      >
        + Add {field.itemLabel.toLowerCase()}
      </button>
    </Shell>
  );
}

// ── Dispatcher ──────────────────────────────────────────────────────────────

export function FieldInput(props: InputProps) {
  const { field } = props;
  switch (field.type) {
    case "text":
    case "textarea":
    case "url":
    case "email":
      return <TextLike {...props} />;
    case "number":
      return <NumberInput {...props} />;
    case "select":
      return <SelectInput {...props} />;
    case "lines":
      return <LinesInput {...(props as InputProps<LinesField>)} />;
    case "image":
      return <ImageInput {...(props as InputProps<ImageField>)} />;
    case "gallery":
      return <GalleryInput {...(props as InputProps<GalleryField>)} />;
    case "propertyRefs":
      return <PropertyRefsInput {...(props as InputProps<PropertyRefsField>)} />;
    case "list":
      return <ListInput {...(props as InputProps<ListField>)} />;
  }
}
