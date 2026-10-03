import type { Metadata } from "next";
import { getEditor } from "@/lib/admin/auth";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "No access" };

export default async function NoAccessPage() {
  const result = await getEditor();
  const email = result.status === "not-editor" ? result.email : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-outline-variant bg-white p-6 shadow-sm">
        <h1 className="text-[18px] font-semibold">This account cannot edit the website</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-on-surface-variant">
          {email ? (
            <>
              You are signed in as <strong>{email}</strong>, but that account has not been given
              editor access.
            </>
          ) : (
            <>You are not signed in with an editor account.</>
          )}{" "}
          Ask the site administrator to add you.
        </p>
        <form action={signOut} className="mt-5">
          <button className="rounded-md border border-outline-variant px-4 py-2 text-[14px] font-medium hover:bg-surface-container-low">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
