"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * ThresholdReveal — the Services page's signature moment.
 *
 * Ported from `../sequent-media-house-main/src/app/home.jsx` +
 * `src/components/ExpandingSection.jsx`, which pins one container and runs a
 * single master timeline over stacked layers. Three of their techniques matter,
 * and together they are why this replaced an earlier `mask-size` version:
 *
 *   1. THE TYPE SPLITS APART. Their hero scales H1 to 3 and throws it to
 *      `yPercent: -500` while H2 goes to `+500`, with a scrim darkening
 *      underneath. You pass *between* the lines. A shape growing toward you —
 *      what the first version did — never feels like passing through anything.
 *
 *   2. THE PANEL OPENS BY HEIGHT, NOT BY MASK. `height: 0vh → 100dvh` on a
 *      solid layer. The first version scrubbed `mask-size`, which repaints the
 *      masked area every frame; on a full-bleed 100vh panel that is the single
 *      most expensive way to do this. Height on a clipping box is cheap.
 *
 *   3. THE CONTENT INSIDE IS NEVER SQUEEZED. Their expanding div is
 *      `flex items-center justify-center` with `overflow-hidden`, and the child
 *      keeps its natural size — so it is revealed, not scaled. Ours holds the
 *      photograph at a fixed `100svh` so it opens like a shutter from the
 *      centre out.
 *
 * ── Motion, not GSAP ────────────────────────────────────────────────────────
 * Sequent drives this with GSAP ScrollTrigger `pin`. We deliberately do not.
 * `SmoothScrollProvider` runs Lenis on its own RAF loop and is **not** wired to
 * `ScrollTrigger.update()`, so a ScrollTrigger pin would desync and judder.
 * Wiring them is a global change with sitewide blast radius. CSS `position:
 * sticky` pins for free, and `useScroll` reads the same native scroll position
 * Lenis writes — which is exactly how `SelectedWork` already works at 500vh.
 *
 * ── Fallbacks ───────────────────────────────────────────────────────────────
 * Mobile and `prefers-reduced-motion` get the photograph, headline and caption
 * as a plain stacked section — same content, no pin, no sequence. It never
 * returns `null`: the desktop branch renders server-side.
 */
export function ThresholdReveal({
  src,
  alt,
  caption,
  topLine,
  bottomLine,
  label = "The Work",
}: {
  src: string;
  alt: string;
  caption: string;
  topLine: string;
  bottomLine: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Beat 1 — the type splits and the scrim darkens. */
  const topY = useTransform(scrollYProgress, [0, 0.32], ["0%", "-260%"]);
  const bottomY = useTransform(scrollYProgress, [0, 0.32], ["0%", "260%"]);
  const lineScale = useTransform(scrollYProgress, [0, 0.32], [1, 2.4]);
  const lineOpacity = useTransform(scrollYProgress, [0.18, 0.32], [1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.28], [0, 1]);

  /* Beat 2 — the shutter opens. Overlaps beat 1 so it feels continuous. */
  const panelHeight = useTransform(scrollYProgress, [0.22, 0.62], ["0svh", "100svh"]);

  /* Beat 3 — the mark and caption settle over the photograph. */
  const markOpacity = useTransform(scrollYProgress, [0.6, 0.74], [0, 1]);
  const markScale = useTransform(scrollYProgress, [0.6, 0.9], [1.15, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.76, 0.88], [0, 1]);

  if (isMobile || reduceMotion) {
    return (
      <section className="bg-ink-deep px-margin-edge py-section-gap text-cream">
        <SectionTitle tone="light">{label}</SectionTitle>
        <h2 className="font-headline-lg text-headline-lg text-cream mt-8">
          {topLine}
          <br />
          {bottomLine}
        </h2>
        <div className="relative mt-10 aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10]">
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        </div>
        <p className="font-label-caps text-label-caps text-cream-dim mt-4">{caption}</p>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[420vh] bg-ink-deep text-cream">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Scrim — sits under the type, over nothing. Darkens as the lines part. */}
        <motion.div
          className="absolute inset-0 bg-ink-deep"
          style={{ opacity: scrimOpacity }}
        />

        {/* Beat 1 — the two lines fly apart. */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-margin-edge text-center"
          style={{ opacity: lineOpacity }}
          /* Presentational — the real heading is the sr-only <h2> below.
             Without this the line is announced twice. */
          aria-hidden="true"
        >
          <motion.span
            style={{ y: topY, scale: lineScale }}
            className="font-headline-lg text-headline-lg text-cream block leading-none"
          >
            {topLine}
          </motion.span>
          <motion.span
            style={{ y: bottomY, scale: lineScale }}
            className="font-headline-lg text-headline-lg text-cream block leading-none"
          >
            {bottomLine}
          </motion.span>
        </motion.div>

        {/* Beat 2 — the shutter. The wrapper's height animates; the photograph
            inside is held at a fixed 100svh so it is revealed, never squashed. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <motion.div
            style={{ height: panelHeight }}
            className="flex w-full items-center justify-center overflow-hidden"
          >
            <div className="relative h-[100svh] w-full shrink-0">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {/* Keeps the mark and caption legible over any frame. */}
              <div className="absolute inset-0 bg-ink-deep/35" />
            </div>
          </motion.div>
        </motion.div>

        {/* Beat 3 — mark over the photograph. */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: markOpacity }}
        >
          <motion.div style={{ scale: markScale }}>
            <Image
              src="/bmig-logo.svg"
              alt=""
              width={150}
              height={147}
              className="h-auto w-[22vw] max-w-[240px] opacity-90 invert"
            />
          </motion.div>
        </motion.div>

        {/* Chrome — always above, so the label reads from the first frame. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-margin-edge py-[calc(var(--nav-h)+4vh)]">
          <SectionTitle tone="light">{label}</SectionTitle>
          <div className="flex items-end justify-between gap-6">
            <motion.p
              style={{ opacity: captionOpacity }}
              className="font-label-caps text-label-caps text-cream-dim max-w-xs"
            >
              {caption}
            </motion.p>
            <span className="font-body-md text-body-md text-cream/70">
              ( Keep Scrolling )
            </span>
          </div>
        </div>
      </div>

      {/* The real heading for assistive tech and crawlers. The animated copy
          above is presentational — it is split across two transformed spans. */}
      <h2 className="sr-only">{`${topLine} ${bottomLine}`}</h2>
    </section>
  );
}
