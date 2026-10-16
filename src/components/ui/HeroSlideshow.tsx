"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 3000; // one slide every 3 seconds
const FADE_MS = 1400; // the dissolve into the next one
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * HeroSlideshow — the hero's background: a few photographs that dissolve into
 * one another on a loop.
 *
 * Two details keep it from looking like a stock carousel:
 *   - The incoming slide fades in ON TOP of the outgoing one, which stays fully
 *     opaque until it is covered. Cross-fading both at once dips through the
 *     dark canvas halfway and reads as a flicker.
 *   - Whichever slide is showing (or fading out) pushes in slowly, so the frame
 *     is never still between changes.
 *
 * A slide is only advanced to once its image has finished loading, so a slow
 * connection holds on the current photograph instead of cutting to a blank.
 * Reduced motion keeps the first photograph and never cycles. The first slide
 * is server-rendered visible, so there is no flash before hydration.
 */
export function HeroSlideshow({ slides }: { slides: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      const current = activeRef.current;
      const next = (current + 1) % slides.length;
      const img = rootRef.current?.querySelectorAll("img")[next];
      if (!img || !img.complete || img.naturalWidth === 0) return; // not ready — try next tick
      activeRef.current = next;
      setPrevious(current);
      setActive(next);
    }, HOLD_MS);

    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      {slides.map((slide, i) => {
        const isActive = i === active;
        const isPrevious = i === previous;
        return (
          <div
            key={slide.src}
            aria-hidden={!isActive}
            className="absolute inset-0"
            style={{
              zIndex: isActive ? 2 : isPrevious ? 1 : 0,
              opacity: isActive || isPrevious ? 1 : 0,
              // Only the arriving slide animates; the one leaving just stays
              // put underneath until it is covered.
              transition: isActive && previous !== null ? `opacity ${FADE_MS}ms ${EASE}` : "none",
              willChange: "opacity",
            }}
          >
            <div
              className="absolute inset-0"
              style={
                isActive || isPrevious
                  ? { animation: `hero-push ${HOLD_MS + FADE_MS * 2}ms ease-out both` }
                  : undefined
              }
            >
              <Image
                src={slide.src}
                alt={i === 0 ? slide.alt : ""}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
