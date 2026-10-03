"use client";

import { useEffect, useState } from "react";

/**
 * A timestamp shown in the viewer's own time zone.
 *
 * Never call `toLocaleString()` / `toLocaleDateString()` directly in admin
 * markup: the server (Vercel runs in UTC, with its own locale) and the browser
 * format differently, which is a hydration error in a client component and the
 * wrong time zone in a server one. Here the first render is fixed — one locale,
 * UTC — so server and browser agree; after mount it switches to local time.
 */
function format(date: Date, withTime: boolean, timeZone?: string): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    ...(timeZone ? { timeZone, timeZoneName: withTime ? "short" : undefined } : {}),
  });
}

export function LocalDate({ iso, withTime = false }: { iso: string; withTime?: boolean }) {
  const [local, setLocal] = useState<string | null>(null);
  useEffect(() => setLocal(format(new Date(iso), withTime)), [iso, withTime]);
  return <time dateTime={iso}>{local ?? format(new Date(iso), withTime, "UTC")}</time>;
}
