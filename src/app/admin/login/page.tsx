import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/controls";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { getEditor } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const configured = getSupabaseEnv() !== null;
  if (configured) {
    const result = await getEditor();
    if (result.status === "ok") redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-[30px] leading-none tracking-tight text-primary">BRAHMAS</p>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-azure-dim">
            Website editor
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-white p-6 shadow-sm">
          {configured ? (
            <Suspense>
              <LoginForm />
            </Suspense>
          ) : (
            <p className="text-[14px] leading-relaxed text-primary">
              The editor is not connected to its database yet. Set{" "}
              <code className="rounded bg-surface-container px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="rounded bg-surface-container px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
              — see <code>docs/ADMIN-PANEL.md</code>.
            </p>
          )}
        </div>
        <p className="mt-6 text-center text-[13px] text-mortar-grey">
          Accounts are created by the site administrator.
        </p>
      </div>
    </main>
  );
}
