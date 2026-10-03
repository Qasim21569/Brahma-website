import type { Metadata } from "next";
import { requireEditor } from "@/lib/admin/auth";
import { PasswordForm } from "@/components/admin/controls";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const { editor } = await requireEditor();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Your account</h1>
        <p className="mt-1 text-[14px] text-mortar-grey">
          {editor.email} · {editor.role === "admin" ? "Administrator" : "Editor"}
        </p>
      </div>
      <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-[16px] font-semibold">Change password</h2>
        <p className="mb-4 text-[13px] text-mortar-grey">
          If you were given a temporary password, replace it here.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}
