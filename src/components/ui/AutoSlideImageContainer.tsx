"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

const SLIDE_INTERVAL = 1500; // ms each image stays visible
const WIPE_DURATION = 600; // ms for the bottom-to-top wipe transition

/**
 * AutoSlideImageContainer — cycles through images with the same
 * bottom-to-top wipe as ClipImageContainer, but driven by a timer
 * instead of scroll position.
 *
 * Architecture (matching ClipImageContainer exactly):
 *   - Multiple layers stacked with z-index
 *   - Current image clips away bottom-to-top via clipPath inset
 *   - Next image sits behind, revealed as current wipes away
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

      // Ensure next image is visible behind current
      if (nextEl) {
        nextEl.style.visibility = "visible";
        nextEl.style.zIndex = "1";
      }

      // Wipe current image away bottom-to-top
      if (currentEl) {
        currentEl.style.zIndex = "2";
        const anim = currentEl.animate(
          [
            { clipPath: "inset(0 0 0% 0)" },
            { clipPath: "inset(0 0 100% 0)" },
          ],
          {
            duration: WIPE_DURATION,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );

        anim.onfinish = () => {
          // Reset current layer
          currentEl.style.zIndex = "0";
          currentEl.style.visibility = "hidden";
          currentEl.style.clipPath = "";

          // Promote next to current
          if (nextEl) {
            nextEl.style.zIndex = "2";
          }
          currentIndex.current = next;
          wiping.current = false;
        };
      }
    };

    // Set initial state
    layerRefs.current.forEach((el, i) => {
      if (el) {
        el.style.visibility = i === 0 ? "visible" : "hidden";
        el.style.zIndex = i === 0 ? "2" : "0";
      }
    });

    const timer = setInterval(tick, SLIDE_INTERVAL);
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
