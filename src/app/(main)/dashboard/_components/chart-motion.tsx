"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

/** Animate plotted marks after Recharts measures its container; axes and hit targets stay still. */
export function ChartMotion({ children, chartKey }: { children: ReactNode; chartKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = createScope({ root });
    let started = false;
    let visible = false;
    const restore: (() => void)[] = [];
    function remember(element: SVGElement, properties: string[]) {
      for (const property of properties) {
        const value = element.style.getPropertyValue(property);
        restore.push(() =>
          value ? element.style.setProperty(property, value) : element.style.removeProperty(property),
        );
      }
    }
    function finish() {
      scope.revert();
      restore.splice(0).forEach((fn) => fn());
      root!.dataset.chartMotion = "ready";
    }
    function reveal() {
      if (started || !visible || preference.matches) return;
      const bars = root!.querySelectorAll<SVGElement>(".recharts-bar-rectangle .recharts-rectangle");
      const lines = root!.querySelectorAll<SVGPathElement>(".recharts-line-curve, .recharts-area-curve");
      const areas = root!.querySelectorAll<SVGElement>(".recharts-area-area");
      if (!bars.length && !lines.length && !areas.length) return;
      started = true;
      mutation.disconnect();
      root!.dataset.chartMotion = "running";
      scope.execute(() => {
        bars.forEach((bar) => {
          remember(bar, ["transform-box", "transform-origin"]);
          bar.style.transformBox = "fill-box";
          bar.style.transformOrigin = "center bottom";
        });
        if (bars.length)
          animate(bars, { scaleY: [0, 1], opacity: [0.35, 1], duration: 480, delay: stagger(9), ease: "out(3)" });
        if (areas.length) animate(areas, { opacity: [0, 1], duration: 650, ease: "out(3)" });
        lines.forEach((line, index) => {
          const length = line.getTotalLength();
          remember(line, ["stroke-dasharray", "stroke-dashoffset"]);
          line.style.strokeDasharray = `${length} ${length}`;
          animate(line, { strokeDashoffset: [length, 0], duration: 700, delay: index * 45, ease: "out(3)" });
        });
        animate({ progress: 0 }, { progress: 1, duration: 850, onComplete: finish });
      });
    }
    const mutation = new MutationObserver(reveal);
    mutation.observe(root, { childList: true, subtree: true });
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && started) finish();
        else reveal();
      },
      { threshold: 0.1 },
    );
    intersection.observe(root);
    function change() {
      if (preference.matches) {
        started = true;
        mutation.disconnect();
        finish();
      } else reveal();
    }
    preference.addEventListener("change", change);
    if (preference.matches) {
      started = true;
      root.dataset.chartMotion = "ready";
      mutation.disconnect();
    }
    return () => {
      intersection.disconnect();
      mutation.disconnect();
      preference.removeEventListener("change", change);
      finish();
    };
  }, [chartKey]);
  return (
    <div ref={ref} className="min-w-0 w-full" data-chart-motion="pending">
      {children}
    </div>
  );
}
