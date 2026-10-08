import { createPublicClient } from "@/lib/supabase/public";

/**
 * Daily keep-alive for the Supabase free tier, which pauses a project after a
 * week without activity. The public site is static and never queries the
 * database on a visit, so without this a quiet week would pause it — and the
 * next deploy or admin login would fail until someone un-paused it by hand.
 *
 * Called by the Vercel cron in vercel.json. Vercel sends
 * `Authorization: Bearer $CRON_SECRET` when that env var is set; anything else
 * is refused, so the route cannot be used to hammer the database.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createPublicClient({ fresh: true });
  if (!supabase) return Response.json({ ok: false, reason: "supabase not configured" }, { status: 500 });

  const { error } = await supabase.from("site_content").select("key").limit(1);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 502 });

  return Response.json({ ok: true, at: new Date().toISOString() });
}
