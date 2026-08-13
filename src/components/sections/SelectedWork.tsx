"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SwapMaskText } from "@/components/ui/SwapMaskText";
import { ClipImageContainer } from "@/components/ui/ClipImageContainer";
import useMaskImage from "@/hooks/useMaskImage";
import { useIsMobile } from "@/hooks/useIsMobile";
import { enrichedProperties } from "@/data/properties";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/** How many assets the section steps through before linking to the portfolio. */
const COUNT = 5;

/** Photography exists for 2 assets; cycle it until the rest is shot. */
const withPhotos = enrichedProperties.filter((p) => p.gallery.length > 0);

const items = enrichedProperties.slice(0, COUNT).map((p, i) => ({
  slug: p.slug,
  name: p.shortName,
  city: `${p.city}, ${p.state}`,
  summary: p.summary,
  src:
    p.homeHeroSrc ??
    withPhotos[i % Math.max(withPhotos.length, 1)]?.homeHeroSrc ??
    "",
}));

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/**
 * SelectedWork — exact port of Elementis `components/Client/Innovation.tsx`.
 *
 * A 500vh parent with a sticky child. TWO image systems run at once, as in the
 * reference:
 *   1. full-bleed background layers revealed by the 28-bar `useMaskImage`,
 *      settling 1.075 → 1;
 *   2. images inside the centre card, wiped by `ClipImageContainer`.
 * Card text swaps with `SwapMaskText`, and the whole section is clickable
 * through to the portfolio.
 *
 * `step` is `1 / (n - 1)` — the reference's 0.25 for five items. It is NOT
 * `1 / n`; that mis-maps the final layer.
 */
export default function SelectedWork() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  // Elementis runs TWO thresholds. Innovation.tsx swaps the BACKGROUND layer
  // set at the step boundary (0.25, 0.5, …) so a layer only unmounts once it
  // has fully transitioned. ClipImageCard swaps the CARD TEXT half a step
  // earlier (0.125, 0.375, …) so the copy leads the image. Collapsing these
  // into one value is what made the image jump mid-transition.
  const [bgState, setBgState] = useState(0);
  const [cardState, setCardState] = useState(0);

  const n = items.length;
  const step = 1 / Math.max(n - 1, 1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["15vh 0", "485vh end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Background: boundary-aligned (ceil - 1), capped at n-2 since we render
    // this layer plus the next one.
    const bg = Math.min(
      Math.max(Math.ceil(latest / step) - 1, 0),
      Math.max(n - 2, 0),
    );
    setBgState(bg);

    // Card: half a step ahead.
    const card = Math.min(Math.max(Math.round(latest / step), 0), n - 1);
    setCardState(card);
  });

  const current = items[cardState] ?? items[0];

  return (
    <div
      ref={ref}
      onClick={() => router.push("/portfolio")}
      className="relative h-[500vh] cursor-pointer overflow-clip bg-ink-deep"
    >
      {/* The sticky frame pins at top:0 and fills the viewport, so the imagery
          is always edge-to-edge — offsetting it by var(--nav-h) left a strip of
          the parent's dark background exposed whenever the navbar auto-hid on
          scroll. The navbar clearance is applied to the CARD's padding instead
          (below), which keeps the card clear of the navbar without punching a
          gap in the background. */}
      <div className="sticky top-0 h-[100svh]">
        {/* ── Card (above the background layers) ── */}
        <motion.div
          initial="initial"
          whileInView="inView"
          viewport={{ amount: 0.5, once: true }}
          className="relative z-10 flex h-full flex-col items-center justify-between pb-[6vh] pt-[calc(var(--nav-h)+4vh)] text-cream backdrop-brightness-[60%] md:flex-row md:px-margin-edge md:pb-[8vh] md:pt-[calc(var(--nav-h)+6vh)]"
        >
          <SectionTitle className="text-cream">Selected Work</SectionTitle>

          <motion.div
            variants={{ initial: { y: "50%" }, inView: { y: "0%" } }}
            transition={{ ease: EASE, duration: 0.8 }}
            className="relative z-20 my-[5vh] flex h-[70vh] min-h-fit w-[90%] flex-col items-center gap-6 bg-stone-white p-6 text-ink-deep md:h-full md:max-h-[calc(688*var(--multiplier))] md:w-full md:max-w-[calc(472*var(--multiplier))] md:gap-8 md:px-8 md:py-6"
          >
            {/* Counter */}
            <div className="flex items-center gap-1 font-label-caps text-label-caps">
              <SwapMaskText
                state={cardState}
                lines={[pad(cardState + 1)]}
                className="leading-none"
              />
              <span className="opacity-60">—</span>
              <span className="opacity-60">{pad(n)}</span>
            </div>

            {/* Name + city as separate elements, not one block, so the city
                stays a small label rather than matching the name's size.
                Both wrap rather than forcing one line, so long property
                names stay inside the card instead of overflowing it. */}
            <div>
              <SwapMaskText
                state={cardState}
                lines={[current.name]}
                className="font-headline-md text-headline-md leading-tight"
              />
              <SwapMaskText
                state={cardState}
                lines={[current.city]}
                className="font-label-caps text-label-caps text-ink-deep/60 mt-2"
              />
            </div>

            {/* Card images — clip wipe, distinct from the background bar mask */}
            <div className="relative aspect-[1.62] w-full overflow-hidden md:aspect-[1.85]">
              {items.map((item, index) => (
                <ClipImageContainer
                  key={`card-${item.slug}-${index}`}
                  index={index}
                  step={step}
                  scrollYProgress={scrollYProgress}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 33vw"
                    className="object-cover"
                  />
                </ClipImageContainer>
              ))}
            </div>

            <SwapMaskText
              state={cardState}
              lines={[current.summary]}
              className="font-body-md text-body-md max-w-full text-center leading-snug"
            />

            <span className="mt-auto inline-flex items-center gap-2 font-label-caps text-label-caps text-ink-deep/70">
              Discover more
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </motion.div>

          <span className="font-body-md text-body-md text-cream/80">
            ( Keep Scrolling )
          </span>
        </motion.div>

        {/* ── Full-bleed background layers ── */}
        {Array.from({ length: 2 }, (_, i) => bgState + i)
          .filter((idx) => idx < n)
          .map((idx) => (
            <BackgroundLayer
              key={`bg-${idx}`}
              index={idx}
              step={step}
              isMobile={isMobile}
              scrollYProgress={scrollYProgress}
              src={items[idx].src}
              alt={items[idx].name}
            />
          ))}
      </div>
    </div>
  );
}

function BackgroundLayer({
  index,
  step,
  isMobile,
  scrollYProgress,
  src,
  alt,
}: {
  index: number;
  step: number;
  isMobile: boolean;
  scrollYProgress: MotionValue<number>;
  src: string;
  alt: string;
}) {
  const localProgress = useTransform(
    scrollYProgress,
    [index * step, (index + 1) * step],
    [0, 1],
    { ease: cubicBezier(0, 0, 1, 1) },
  );

  const maskImage = useMaskImage(localProgress, isMobile);

  const scale = useTransform(
    scrollYProgress,
    [(index - 1) * step, (index + 1) * step],
    [1.075, 1],
  );

  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      style={{ zIndex: -index, maskImage, scale }}
    >
      <div className="relative h-full w-full origin-bottom">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
    </motion.div>
  );
}
