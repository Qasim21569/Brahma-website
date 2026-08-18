"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

const HOLD_MS = 3000; // each image stays fully visible for 3 seconds
const WIPE_MS = 1200; // slow, smooth crossfade wipe

/**
 * AutoSlideImageContainer — timed image cycle with a smooth bottom-to-top wipe.
 *
 * Architecture:
 *   - All layers are always present and visible — no visibility toggling
 *   - clipPath controls what shows (inset clips from the chosen edge)
 *   - Outgoing image wipes away while incoming image wipes in — both animated
 *     simultaneously so there is never a blank frame
 *   - Uses Web Animations API for 60fps — no React re-renders
 */
export function AutoSlideImageContainer({
  images,
  alt,
  className = "",
}: {
  images: { src: string; alt: string }[];
  alt?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const currentIndex = useRef(0);
  const wiping = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length <= 1) return;

    const tick = () => {
      if (wiping.current) return;
      wiping.current = true;

      const current = currentIndex.current;
      const next = (current + 1) % images.length;
      const currentEl = layerRefs.current[current];
      const nextEl = layerRefs.current[next];

      if (!currentEl || !nextEl) {
        wiping.current = false;
        return;
      }

      // Ensure both are stacked correctly — incoming behind outgoing
      nextEl.style.zIndex = "1";
      currentEl.style.zIndex = "2";

      // Both animate simultaneously:
      //   - current wipes away bottom-to-top (clip shrinks)
      //   - next wipes in bottom-to-top (clip opens)
      const animOut = currentEl.animate(
        [
          { clipPath: "inset(0 0 0% 0)" },
          { clipPath: "inset(0 0 100% 0)" },
        ],
        {
          duration: WIPE_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      const animIn = nextEl.animate(
        [
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)" },
        ],
        {
          duration: WIPE_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      animOut.onfinish = () => {
        // Reset outgoing layer for its next turn
        currentEl.style.zIndex = "0";
        currentEl.style.clipPath = "";

        // Promote next to current
        nextEl.style.zIndex = "2";
        nextEl.style.clipPath = "";
        currentIndex.current = next;
        wiping.current = false;
      };

      // Safety fallback — if onfinish doesn't fire, unblock after WIPE_MS + 50ms
      setTimeout(() => {
        if (wiping.current) {
          currentEl.style.zIndex = "0";
          currentEl.style.clipPath = "";
          nextEl.style.zIndex = "2";
          nextEl.style.clipPath = "";
          currentIndex.current = next;
          wiping.current = false;
        }
      }, WIPE_MS + 100);
    };

    // Set initial state: first image fully visible, rest clipped away
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.zIndex = i === 0 ? "2" : "1";
      el.style.clipPath = i === 0 ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)";
    });

    const timer = setInterval(tick, HOLD_MS);
    return () => clearInterval(timer);
  }, [images.length, images]);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[16/10] w-full overflow-hidden ${className}`}
    >
      {images.map((img, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) layerRefs.current[index] = el;
          }}
          className="absolute inset-0"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 65vw"
          />
        </div>
      ))}
    </div>
  );
}
