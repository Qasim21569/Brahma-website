"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

export type TickerItem = {
  name: string;
  city: string;
  state: string;
  type: string;
};

/**
 * PortfolioTicker — a departure-board strip for the hero.
 *
 * A static count on the left ("12 operating assets") anchors the claim; the
 * right side cycles through the actual portfolio, one asset at a time, with a
 * masked slide. It proves scale with real data rather than a slogan — which is
 * why this replaced the tagline marquee.
 *
 * SSR: renders the first item server-side. Never returns null (§4.8).
 */
export function PortfolioTicker({
  items,
  intervalMs = 3200,
  className = "",
}: {
  items: TickerItem[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  const current = items[index] ?? items[0];
  if (!current) return <div className={className} />;

  return (
    <div className={`flex items-center gap-5 md:gap-8 ${className}`}>
      <span className="font-label-caps text-label-caps whitespace-nowrap text-cream/75">
        {items.length} Operating Assets
      </span>

      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-cream/35 md:w-10" />

      {/* Fixed height + overflow keeps the swap from nudging layout. */}
      <div className="relative h-6 min-w-0 flex-1 overflow-hidden md:h-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="absolute inset-0 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="font-body-lg text-body-lg truncate text-cream">
              {current.name}
            </span>
            <span aria-hidden="true" className="text-cream/45">
              ·
            </span>
            <span className="font-label-caps text-label-caps hidden shrink-0 text-cream/70 sm:inline">
              {current.city}, {current.state}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
