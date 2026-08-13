"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MaskText } from "@/components/ui/MaskText";
import useMaskImage from "@/hooks/useMaskImage";

/**
 * Hero — full-bleed, bottom-anchored. Copied from Elementis `sections/Hero`.
 *
 * The reference hero is NOT a split. It is full-bleed media with every element
 * stacked at the bottom (`flex flex-col justify-end`):
 *   1. Headline text — MaskText reveal, the visual centerpiece
 *   2. CTA button — actionable entry point
 * The media parallaxes and dissolves as you scroll past.
 *
 * Media slot accepts an image now, a <video> later, without layout change.
 */
export function Hero({
  imageSrc,
  imageAlt,
  videoSrc,
  posterSrc,
  headline,
  action,
  className = "",
}: {
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
  posterSrc?: string;
  /** Headline lines — each string becomes a masked reveal line. */
  headline?: string[];
  /** CTA button or link. */
  action?: ReactNode;
  className?: string;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);

  // Exact Elementis values — sections/Hero/Client/Desktop.tsx.
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start start", "50vh start"],
  });

  const maskImage = useMaskImage(scrollYProgress, false, {
    divisions: 24,
    inset: 0.15,
    gap: 0.3,
    vh: 100,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      className={`relative overflow-hidden bg-ink-deep ${className}`}
      style={{
        marginTop: "var(--nav-h)",
        height: "calc(100svh - var(--nav-h))",
      }}
    >
      {/* ── Media ── */}
      <div ref={mediaRef} className="absolute inset-0 overflow-clip">
        <motion.div
          style={{ y, maskImage }}
          className="h-full w-full"
        >
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc ?? imageSrc}
            aria-label={imageAlt}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          )}
        </motion.div>
      </div>

      {/* Scrim — weighted to the bottom, where all the content sits. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,18,32,0.96) 0%, rgba(10,18,32,0.92) 22%, rgba(10,18,32,0.78) 40%, rgba(10,18,32,0.45) 62%, rgba(10,18,32,0.42) 100%)",
        }}
      />

      {/* ── Bottom-anchored stack ── */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end pb-8 md:pb-12 [&_a]:pointer-events-auto">
        <div className="relative flex flex-col items-center justify-between gap-6 border-t border-cream/20 py-5 md:mx-10 md:flex-row md:py-4 [&>*]:shrink-0">
          {headline && (
            <MaskText
              className="font-headline-lg text-headline-lg text-cream flex-1"
              delay={0.2}
              lines={headline}
            />
          )}
          {action && (
            <div className="flex-1 md:flex-none md:text-end">
              {action}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
