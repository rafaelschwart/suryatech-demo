"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, createTimeline, stagger } from "animejs";

export function LandingMotion() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.parentElement;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    function setup() {
      dispose();
      if (preference.matches) return;
      const scope = createScope({ root: root! });
      const cleanups: (() => void)[] = [];
      scope.execute(() => {
        createTimeline({ defaults: { ease: "out(4)" } })
          .add("[data-hero-line]", { translateY: [80, 0], opacity: [0, 1], duration: 900, delay: stagger(115) }, 100)
          .add("[data-hero-item]", { translateY: [20, 0], opacity: [0, 1], duration: 650, delay: stagger(85) }, 450);
      });
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            scope.execute(() =>
              animate(entry.target, { opacity: [0, 1], translateY: [38, 0], duration: 850, ease: "out(4)" }),
            );
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
      );
      root!.querySelectorAll("[data-landing-reveal]").forEach((element) => observer.observe(element));
      root!.querySelectorAll<HTMLElement>("[data-landing-hover]").forEach((element) => {
        const image = element.querySelector("img");
        if (!image) return;
        const enter = () => scope.execute(() => animate(image, { scale: 1.045, duration: 700, ease: "out(4)" }));
        const leave = () => scope.execute(() => animate(image, { scale: 1, duration: 650, ease: "out(4)" }));
        element.addEventListener("pointerenter", enter);
        element.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          element.removeEventListener("pointerenter", enter);
          element.removeEventListener("pointerleave", leave);
        });
      });
      root!.querySelectorAll("details").forEach((detail) => {
        const reveal = () => {
          const paragraph = detail.querySelector("p");
          if (detail.open && paragraph)
            scope.execute(() =>
              animate(paragraph, { translateY: [-8, 0], opacity: [0, 1], duration: 260, ease: "out(3)" }),
            );
        };
        detail.addEventListener("toggle", reveal);
        cleanups.push(() => detail.removeEventListener("toggle", reveal));
      });
      dispose = () => {
        observer.disconnect();
        cleanups.forEach((cleanup) => cleanup());
        scope.revert();
      };
    }
    setup();
    preference.addEventListener("change", setup);
    return () => {
      dispose();
      preference.removeEventListener("change", setup);
    };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
