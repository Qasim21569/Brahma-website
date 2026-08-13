"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MaskText } from "@/components/ui/MaskText";
import { SwapMaskText } from "@/components/ui/SwapMaskText";
import { StyledLink } from "@/components/ui/StyledLink";

const stages = [
  {
    num: "01",
    icon: "/acq.png",
    title: "Acquire",
    lines: [
      "We buy assets whose structural",
      "quality already exceeds their",
      "operating performance — the gap",
      "is the opportunity.",
    ],
  },
  {
    num: "02",
    icon: "/des.png",
    title: "Renovate",
    lines: [
      "Capital goes into the building, the",
      "operating model, and the brand",
      "position at the same time. A repaint",
      "is not a repositioning.",
    ],
  },
  {
    num: "03",
    icon: "/opr.png",
    title: "Operate",
    lines: [
      "We hold and run the asset ourselves",
      "under Brahmas Hospitality",
      "Management. No third party, no",
      "handoff, no diluted accountability.",
    ],
  },
];

/**
 * Process — scroll-driven stepper.
 *
 * A sticky left rail carries the section title, an oversized stage number that
 * swaps as you scroll (`SwapMaskText`, so the mask direction follows scroll
 * direction), and a progress line that fills across the section. The stages
 * themselves sit in the wide column and mask in line by line.
 *
 * No photography — an oversized line-art mark (client-supplied PNG,
 * `public/{acq,des,opr}.png`) sits beside each stage instead,
 * which fills the space without competing with the image-led sections either
 * side. Marks are desktop-only; on mobile the column collapses and they are
 * hidden. The source PNGs are already cream-on-transparent, so no recolour is
 * applied — only opacity, to keep them subordinate to the text.
 */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  const railScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.02, 1]),
    { stiffness: 120, damping: 30, restDelta: 0.001 },
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.max(Math.floor(latest * stages.length), 0),
      stages.length - 1,
    );
    setActive(idx);
  });

  return (
    <section ref={ref} className="bg-ink-mid text-cream">
      <div className="flex flex-col gap-gutter px-margin-edge py-section-gap md:grid md:grid-cols-[1fr_1.9fr]">
        {/* ── Sticky rail ── */}
        <div className="sticky top-[calc(var(--nav-h)+8px)] z-20 h-fit md:top-[calc(var(--nav-h)+10vh)]">
          <div className="rounded-full border border-cream/15 bg-ink-mid/90 px-4 py-2.5 backdrop-blur-md md:hidden">
            <div className="flex items-center justify-between gap-4">
              <span className="font-label-caps text-label-caps text-cream/60">
                Process
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-label-caps text-label-caps text-cream">
                  <SwapMaskText state={active} lines={[stages[active].num]} />
                </span>
                <span className="font-label-caps text-label-caps text-cream/40">
                  / {String(stages.length).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="relative mt-2 h-px w-full overflow-hidden bg-cream/20">
              <motion.div
                style={{ scaleX: railScale }}
                className="absolute inset-0 origin-left bg-muted-azure"
              />
            </div>
          </div>

          {/* Full rail — desktop only */}
          <div className="hidden md:block">
            <SectionTitle className="text-cream/60">Process</SectionTitle>

            <div className="mt-14 flex items-baseline gap-4">
              <span className="font-display-hero text-display-hero leading-none text-cream">
                <SwapMaskText state={active} lines={[stages[active].num]} />
              </span>
              <span className="font-label-caps text-label-caps text-cream/40">
                / {String(stages.length).padStart(2, "0")}
              </span>
            </div>

            <div className="relative mt-12 h-px w-full overflow-hidden bg-cream/20">
              <motion.div
                style={{ scaleX: railScale }}
                className="absolute inset-0 origin-left bg-muted-azure"
              />
            </div>

            <div className="mt-10">
              <StyledLink href="/services" tone="light">
                Explore our thesis
              </StyledLink>
            </div>
          </div>
        </div>

        {/* ── Stages ── */}
        <div className="mt-12 flex flex-col md:mt-0">
          {stages.map((stage, i) => (
            <div
              key={stage.num}
              className="border-t border-cream/20 py-12 first:border-t-0 first:pt-0 md:py-[9vh]"
            >
              <motion.div
                initial={{ opacity: 0.35 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.6, ease: [0.24, 0.43, 0.15, 0.97] }}
              >
                <div className="flex items-center gap-4">
                  <span className="font-label-caps text-label-caps text-muted-azure">
                    {stage.num}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-muted-azure/40 md:w-10 md:flex-none"
                  />
                  <div className="relative h-9 w-9 shrink-0 opacity-70 md:hidden">
                    <Image
                      src={stage.icon}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <h3>
                      <MaskText
                        className="font-headline-lg text-headline-lg text-cream"
                        lines={[stage.title]}
                        delay={i * 0.05}
                      />
                    </h3>

                    <MaskText
                      className="font-body-lg text-body-lg mt-6 max-w-xl text-cream-dim"
                      lines={stage.lines}
                      delay={0.1 + i * 0.05}
                    />
                  </div>

                  <div className="relative hidden aspect-square w-[clamp(160px,18vw,280px)] justify-self-end opacity-70 md:block">
                    <Image
                      src={stage.icon}
                      alt=""
                      fill
                      sizes="280px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}

          <div className="mt-10 md:hidden">
            <StyledLink href="/services" tone="light">
              Explore our thesis
            </StyledLink>
          </div>
        </div>
      </div>
    </section>
  );
}
