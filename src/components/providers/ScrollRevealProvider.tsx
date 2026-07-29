"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollRevealProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Make all reveal elements visible immediately
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.remove("reveal");
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Generic scroll reveal: any element with .reveal
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Parallax: elements with [data-parallax] get yPercent movement
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.2");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Count up: elements with [data-countup]
      gsap.utils.toArray<HTMLElement>("[data-countup]").forEach((el) => {
        const target = parseFloat(el.dataset.countup || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toString();
          },
        });
      });

      // Hero wordmark scale-in
      gsap.utils.toArray<HTMLElement>("[data-wordmark-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1,
            opacity: 0.05,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return <>{children}</>;
}
