import Link from "next/link";
import type { Metadata } from "next";
import { requireEditor } from "@/lib/admin/auth";
import { resolveValues } from "@/content/fields";
import { propertyFields } from "@/content/propertyFields";
import { NewPropertyForm } from "@/components/admin/PropertyEditor";

export const metadata: Metadata = { title: "Add property" };

export default async function NewProperty() {
  await requireEditor();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/properties" className="text-[13px] text-mortar-grey hover:underline">
          ← All properties
        </Link>
        <h1 className="mt-2 text-[26px] font-semibold tracking-tight">Add a property</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-mortar-grey">
          New properties start hidden, so nothing appears on the website until you publish it.
        </p>
      </div>
      <div className="rounded-xl border border-outline-variant bg-white px-5 pt-5 shadow-sm sm:px-6">
        <NewPropertyForm values={resolveValues(propertyFields, {})} />
      </div>
    </div>
  );
}
