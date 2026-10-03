import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type Editor = { id: string; email: string; role: "admin" | "editor" };

/**
 * The real gate for every admin page and server action.
 *
 * Signed in is not enough — the user must also be on the `public.editors`
 * allow-list. A signed-in non-editor gets the "no access" screen, never a
 * form; and even if one reached a form, row-level security would reject the
 * write.
 */
export async function getEditor(): Promise<
  | { status: "signed-out" }
  | { status: "not-editor"; email: string }
  | { status: "ok"; editor: Editor; supabase: Awaited<ReturnType<typeof createServerSupabase>> }
> {
  // Not configured → nobody can be signed in; the login page explains why.
  if (!getSupabaseEnv()) {
    await cookies(); // keep the route request-time
    return { status: "signed-out" };
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };

  const { data, error } = await supabase
    .from("editors")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return { status: "not-editor", email: user.email ?? "" };

  return {
    status: "ok",
    editor: {
      id: user.id,
      email: user.email ?? "",
      role: data.role === "admin" ? "admin" : "editor",
    },
    supabase,
  };
}

/** For pages: redirect when signed out, render the no-access screen otherwise. */
export async function requireEditor() {
  const result = await getEditor();
  if (result.status === "signed-out") redirect("/admin/login");
  if (result.status === "not-editor") redirect("/admin/no-access");
  return result;
}
