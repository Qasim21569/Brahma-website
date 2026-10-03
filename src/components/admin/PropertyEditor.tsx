"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { propertyFields, slugify, SLUG_RE } from "@/content/propertyFields";
import {
  createProperty,
  deleteProperty,
  moveProperty,
  saveProperty,
  setPropertyPublished,
} from "@/app/admin/actions";
import { FieldsForm } from "./FieldsForm";
import type { FieldContext } from "./FieldInput";

const context: FieldContext = { propertyOptions: [] };

export function PropertyEditor({
  slug,
  values,
}: {
  slug: string;
  values: Record<string, unknown>;
}) {
  return (
    <FieldsForm
      fields={propertyFields}
      initialValues={values}
      context={context}
      onSave={(v) => saveProperty(slug, v)}
    />
  );
}

export function NewPropertyForm({ values }: { values: Record<string, unknown> }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const slugOk = SLUG_RE.test(slug);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-muted-azure/40 bg-muted-azure/10 p-4">
        <label className="block text-[13px] font-semibold text-primary" htmlFor="new-slug">
          Web address
        </label>
        <div className="mt-1 flex items-center gap-1 text-[14px] text-mortar-grey">
          <span>/portfolio/</span>
          <input
            id="new-slug"
            className="min-w-0 flex-1 rounded-md border border-outline-variant bg-white px-2 py-1.5 font-mono text-[14px] text-primary"
            value={slug}
            placeholder="hampton-inn-lakeland"
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            onBlur={() => setSlug((s) => slugify(s))}
          />
        </div>
        <p className={`mt-1 text-[12px] ${slugOk || !slug ? "text-mortar-grey" : "text-red-700"}`}>
          Lowercase letters, numbers and hyphens. It cannot be changed later — links and photos depend
          on it.
        </p>
      </div>

      <FieldsForm
        fields={propertyFields}
        initialValues={values}
        context={context}
        saveLabel="Create property"
        onSave={async (v) => {
          if (!slugOk) return { ok: false, message: "Enter a valid web address at the top first." };
          const r = await createProperty(slug, v);
          if (r.ok && r.slug) router.push(`/admin/properties/${r.slug}?created=1`);
          return r;
        }}
      />
    </div>
  );
}

const smallButton =
  "inline-flex items-center rounded-md border border-outline-variant bg-white px-3 py-1.5 text-[13px] font-medium text-primary transition hover:bg-surface-container-low disabled:opacity-40";

export function PublishToggle({ slug, published }: { slug: string; published: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className={
        published
          ? smallButton
          : "inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-40"
      }
      onClick={() =>
        start(async () => {
          const r = await setPropertyPublished(slug, !published);
          if (!r.ok) alert(r.message);
          router.refresh();
        })
      }
    >
      {pending ? "…" : published ? "Hide from site" : "Publish"}
    </button>
  );
}

export function MoveButtons({ slug, first, last }: { slug: string; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const go = (d: "up" | "down") =>
    start(async () => {
      const r = await moveProperty(slug, d);
      if (!r.ok) alert(r.message);
      router.refresh();
    });
  return (
    <span className="inline-flex gap-1">
      <button type="button" className={smallButton} aria-label="Move earlier" disabled={pending || first} onClick={() => go("up")}>
        ↑
      </button>
      <button type="button" className={smallButton} aria-label="Move later" disabled={pending || last} onClick={() => go("down")}>
        ↓
      </button>
    </span>
  );
}

export function DeleteProperty({ slug, shortName }: { slug: string; shortName: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-[13px] text-red-700 underline-offset-2 hover:underline disabled:opacity-40"
      onClick={() => {
        const typed = prompt(
          `This removes “${shortName}” from the site and the admin. It can be brought back from History.\n\nType the short name to confirm:`,
        );
        if (typed === null) return;
        start(async () => {
          const r = await deleteProperty(slug, typed);
          if (r && !r.ok) alert(r.message);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete property"}
    </button>
  );
}
