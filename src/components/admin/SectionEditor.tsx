"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { findSection } from "@/content/registry";
import { LocalDate } from "./LocalDate";
import { resetSection, saveSection } from "@/app/admin/actions";
import { FieldsForm } from "./FieldsForm";
import type { FieldContext } from "./FieldInput";

/**
 * One page section as a collapsible card. The section definition is looked up
 * by key on the client rather than passed as a prop, because field definitions
 * are plain objects that already ship in the admin bundle via the registry.
 */
export function SectionEditor({
  sectionKey,
  values,
  edited,
  updatedAt,
  context,
  defaultOpen = false,
}: {
  sectionKey: string;
  values: Record<string, unknown>;
  /** True when a saved row exists, i.e. the section differs from the shipped copy. */
  edited: boolean;
  updatedAt: string | null;
  context: FieldContext;
  defaultOpen?: boolean;
}) {
  const section = findSection(sectionKey);
  const [open, setOpen] = useState(defaultOpen);
  const [dirty, setDirty] = useState(false);
  const [resetting, startReset] = useTransition();
  const router = useRouter();

  if (!section) return null;

  return (
    <section
      id={sectionKey}
      className="scroll-mt-24 rounded-xl border border-outline-variant bg-white shadow-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-5 py-4 text-left sm:px-6"
      >
        <span className="mt-0.5 text-mortar-grey">{open ? "▾" : "▸"}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[16px] font-semibold text-primary">{section.title}</span>
            {edited ? (
              <span className="rounded-full bg-muted-azure/15 px-2 py-0.5 text-[11px] font-semibold text-muted-azure-dim">
                Edited
                {updatedAt && (
                  <>
                    {" · "}
                    <LocalDate iso={updatedAt} />
                  </>
                )}
              </span>
            ) : (
              <span className="rounded-full bg-surface-container px-2 py-0.5 text-[11px] font-medium text-mortar-grey">
                Original
              </span>
            )}
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                Unsaved
              </span>
            )}
          </span>
          {section.description && (
            <span className="mt-1 block text-[13px] leading-snug text-mortar-grey">
              {section.description}
            </span>
          )}
        </span>
      </button>

      {/* Kept mounted when collapsed, so unsaved edits survive closing the card. */}
      <div hidden={!open} className="border-t border-outline-variant px-5 pt-5 sm:px-6">
        <FieldsForm
          fields={section.fields}
          initialValues={values}
          context={context}
          onDirtyChange={setDirty}
          onSave={(v) => saveSection(sectionKey, v)}
          extraActions={
            edited ? (
              <button
                type="button"
                disabled={resetting}
                className="text-[13px] text-mortar-grey underline-offset-2 hover:text-red-700 hover:underline"
                onClick={() => {
                  if (
                    !confirm(
                      `Put “${section.title}” back to the original website wording? Your current version stays in History.`,
                    )
                  )
                    return;
                  startReset(async () => {
                    const r = await resetSection(sectionKey);
                    if (!r.ok) alert(r.message);
                    router.refresh();
                  });
                }}
              >
                {resetting ? "Restoring…" : "Restore original"}
              </button>
            ) : null
          }
        />
      </div>
    </section>
  );
}
