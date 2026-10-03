"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { FieldMap, ValidationIssue } from "@/content/fields";
import type { ActionResult } from "@/app/admin/actions";
import { FieldInput, type FieldContext } from "./FieldInput";

type Status =
  | { kind: "idle" }
  | { kind: "saved"; message: string; warnings: ValidationIssue[] }
  | { kind: "error"; message: string };

/**
 * A form over any field map. Owns the draft, the dirty flag, and the save
 * round-trip; the caller supplies what "save" means.
 */
export function FieldsForm({
  fields,
  initialValues,
  context,
  onSave,
  saveLabel = "Save and publish",
  extraActions,
  onDirtyChange,
}: {
  fields: FieldMap;
  initialValues: Record<string, unknown>;
  context: FieldContext;
  onSave: (values: Record<string, unknown>) => Promise<ActionResult>;
  saveLabel?: string;
  extraActions?: React.ReactNode;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialValues));
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  // A reset or restore elsewhere hands us new initial values.
  const incoming = JSON.stringify(initialValues);
  useEffect(() => {
    setValues(JSON.parse(incoming));
    setBaseline(incoming);
    setIssues([]);
  }, [incoming]);

  const dirty = useMemo(() => JSON.stringify(values) !== baseline, [values, baseline]);

  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = () =>
    startTransition(async () => {
      setStatus({ kind: "idle" });
      const result = await onSave(values);
      if (result.ok) {
        setBaseline(JSON.stringify(values));
        setIssues(result.warnings ?? []);
        setStatus({
          kind: "saved",
          message: result.message ?? "Saved. The live site updates on the next page load.",
          warnings: result.warnings ?? [],
        });
      } else {
        setIssues(result.issues ?? []);
        setStatus({ kind: "error", message: result.message });
      }
    });

  const errors = issues.filter((i) => i.level === "error");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
    >
      {Object.entries(fields).map(([name, field]) => (
        <FieldInput
          key={name}
          field={field}
          value={values[name]}
          path={name}
          issues={issues}
          context={context}
          onChange={(v) => {
            setValues((prev) => ({ ...prev, [name]: v }));
            if (status.kind !== "idle") setStatus({ kind: "idle" });
          }}
        />
      ))}

      <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-3 border-t border-outline-variant bg-white/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <button
          type="submit"
          disabled={pending || !dirty}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Saving…" : saveLabel}
        </button>
        {dirty && !pending && (
          <button
            type="button"
            className="text-[13px] text-mortar-grey underline-offset-2 hover:underline"
            onClick={() => {
              setValues(JSON.parse(baseline));
              setIssues([]);
              setStatus({ kind: "idle" });
            }}
          >
            Discard changes
          </button>
        )}
        <span className="text-[13px]" role="status" aria-live="polite">
          {status.kind === "saved" && <span className="text-emerald-700">✓ {status.message}</span>}
          {status.kind === "error" && (
            <span className="text-red-700">
              {status.message}
              {errors.length > 0 && ` (${errors.length} issue${errors.length === 1 ? "" : "s"})`}
            </span>
          )}
          {status.kind === "idle" && dirty && <span className="text-amber-700">Unsaved changes</span>}
        </span>
        <div className="ml-auto flex items-center gap-2">{extraActions}</div>
      </div>

      {status.kind === "saved" && status.warnings.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-900">
          Saved, with notes worth a look:
          <ul className="mt-1 list-disc pl-5">
            {status.warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
