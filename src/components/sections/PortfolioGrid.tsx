"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { HoverReveal } from "@/components/ui/HoverReveal";
import { PropertyCardMedia } from "@/components/ui/PropertyCardMedia";
import {
  assetTypeLabels,
  type AssetType,
  type Property,
} from "@/data/properties";

type Filter = AssetType | "all";

/**
 * PortfolioGrid — all 12 assets with asset-type filter pills.
 *
 * Client component because of the filter state. The cards deliberately reuse
 * SelectedWork's card language so the page reads as that section continued:
 * an `NN — 12` counter, name at headline-md, city as a small label, the summary,
 * and a "View property" affordance.
 */
export default function PortfolioGrid({ properties }: { properties: Property[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  // Counts drive the pill labels, so a pill can never advertise a category that
  // has no assets in it.
  const counts = useMemo(() => {
    const byType = new Map<AssetType, number>();
    for (const p of properties) {
      byType.set(p.assetType, (byType.get(p.assetType) ?? 0) + 1);
    }
    return byType;
  }, [properties]);

  const filters: Filter[] = useMemo(
    () => [
      "all",
      ...(Object.keys(assetTypeLabels) as AssetType[]).filter(
        (t) => (counts.get(t) ?? 0) > 0
      ),
    ],
    [counts]
  );

  const visible = useMemo(
    () => (filter === "all" ? properties : properties.filter((p) => p.assetType === filter)),
    [filter, properties]
  );

  return (
    <>
      {/* ── Filter pills — pills, not a dropdown (§5 C2) ── */}
      <div className="flex flex-wrap gap-3" role="group" aria-label="Filter by asset type">
        {filters.map((f) => {
          const active = filter === f;
          const label = f === "all" ? "All assets" : assetTypeLabels[f];
          const count = f === "all" ? properties.length : counts.get(f) ?? 0;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              /* min-h-11 keeps the touch target at the 44px floor (§2.6). */
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-6 font-label-caps text-label-caps transition-colors ${
                active
                  ? "border-primary bg-primary text-on-primary"
                  : "border-mortar-grey text-primary hover:bg-surface-container"
              }`}
            >
              {label}
              <span className={active ? "text-on-primary/60" : "text-on-surface-variant"}>
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-gutter gap-y-16 md:grid-cols-2 md:gap-y-24">
        {visible.map((property, i) => (
          <PropertyCard
            key={property.slug}
            property={property}
            index={properties.indexOf(property)}
            total={properties.length}
            /* Second column drops to create the staggered editorial rag. */
            offset={i % 2 === 1}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-16">
          No assets in this category.
        </p>
      )}
    </>
  );
}

function PropertyCard({
  property,
  index,
  total,
  offset,
}: {
  property: Property;
  index: number;
  total: number;
  offset: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-linked entrance drift (§5 C3). The card travels a little as it comes
  // up through the viewport rather than snapping in at a single trigger point.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.article
      ref={ref}
      style={reduceMotion ? undefined : { y, opacity }}
      className={offset ? "md:mt-24" : undefined}
    >
      <Link href={`/portfolio/${property.slug}`} className="group block">
        {/* Counter — SelectedWork's `NN — 12` language. */}
        <div className="mb-5 flex items-center gap-3 font-label-caps text-label-caps text-on-surface-variant">
          <span className="text-primary">{String(index + 1).padStart(2, "0")}</span>
          <span className="opacity-40">—</span>
          <span className="opacity-60">{String(total).padStart(2, "0")}</span>
          <span className="ml-auto">{assetTypeLabels[property.assetType]}</span>
        </div>

        <PropertyCardMedia property={property} priority={index < 2} />

        {/* Title rise on hover, paired with the image scaling down inside its
            frame — the ochi.design pattern (§5 C4). */}
        <div className="overflow-hidden">
          <h2 className="font-headline-md text-headline-md text-primary mt-6 leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-1">
            {property.shortName}
          </h2>
        </div>

        {/* Desktop: city/state swaps to "View property" on hover. Hidden on
            mobile — touch has no hover state, so this would otherwise be the
            ONLY on-page cue that the card leads anywhere, and it would never
            fire. The explicit button below replaces it there. */}
        <HoverReveal
          className="mt-2 hidden min-h-[1.6em] md:block"
          defaultText={
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {property.city}, {property.state}
            </span>
          }
          hoverText={
            <span className="font-label-caps text-label-caps text-primary">
              View property →
            </span>
          }
        />

        {/* Mobile-only: city/state as a plain label, since it has nowhere to
            swap to without hover. */}
        <span className="font-label-caps text-label-caps text-on-surface-variant mt-2 block md:hidden">
          {property.city}, {property.state}
        </span>

        <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-md leading-snug">
          {property.summary}
        </p>

        {/* Mobile-only explicit CTA. A real button visually, but a <span> —
            not a nested <Link>/<button> — because the whole card above is
            already the interactive <Link>; nesting a second interactive
            element inside it is invalid HTML and breaks hydration. min-h-11
            keeps it at the §2.6 44px touch-target floor. */}
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-mortar-grey px-5 font-label-caps text-label-caps text-primary md:hidden">
          View property
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </motion.article>
  );
}
