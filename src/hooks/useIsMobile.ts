"use client";

import { useEffect, useState } from "react";

/**
 * useIsMobile — returns true when viewport < 768px.
 *
 * SSR rule: defaults to false (desktop) so content is never hidden from
 * crawlers. Swaps after hydration when the real width is known.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
