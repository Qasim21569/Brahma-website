import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Admin session upkeep (Next 16's "proxy", formerly middleware).
 *
 * Runs on /admin only — the public site never touches auth, which is what lets
 * it stay static. Two jobs:
 *   1. Refresh the Supabase session cookie so editors are not logged out
 *      mid-edit.
 *   2. Bounce signed-out visitors to the login page.
 *
 * This is an optimistic check only. Every admin page and server action calls
 * `requireEditor()` again, and row-level security enforces it a third time in
 * the database — the proxy is the convenience layer, not the lock.
 */
export async function proxy(request: NextRequest) {
  const env = getSupabaseEnv();
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!env) {
    // Not configured: let the login page render its own explanation.
    return isLogin
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not put code between client creation and getUser() — it is what
  // refreshes an expired token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Admin pages must never be cached by a CDN or indexed.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
