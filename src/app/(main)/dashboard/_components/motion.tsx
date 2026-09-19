"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";

import { animate, stagger } from "animejs";

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One orchestrated entrance per screen: the top-level blocks of the page rise into place with a
 * short stagger on every route change. Nothing else on the page moves on its own.
 */
export function PageMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname re-runs the entrance on every route change
  useEffect(() => {
    const root = ref.current?.firstElementChild;
    if (!root || reducedMotion()) return;
    const blocks = Array.from(root.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .slice(0, 12);
    if (!blocks.length) return;
    for (const b of blocks) b.style.opacity = "0";
    const anim = animate(blocks, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 520,
      delay: stagger(55),
      ease: "outCubic",
      onComplete: () => {
        for (const b of blocks) b.style.removeProperty("transform");
      },
    });
    return () => {
      anim.cancel();
      for (const b of blocks) {
        b.style.removeProperty("opacity");
        b.style.removeProperty("transform");
      }
    };
  }, [pathname]);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}

/**
 * A number that counts up to its value the first time it appears, then follows updates instantly.
 * Non-numeric text around the number (units, %, $) is kept as written.
 */
export function AnimatedNumber({ value, className }: { value: string; className?: string }) {
  const [shown, setShown] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || reducedMotion()) {
      setShown(value);
      done.current = true;
      return;
    }
    const m = /-?[\d,]*\.?\d+/.exec(value);
    if (!m) {
      setShown(value);
      done.current = true;
      return;
    }
    const target = Number(m[0].replace(/,/g, ""));
    const decimals = (m[0].split(".")[1] ?? "").length;
    const useGrouping = m[0].includes(",");
    const obj = { n: 0 };
    const anim = animate(obj, {
      n: target,
      duration: 900,
      ease: "outQuart",
      onUpdate: () => {
        const text = obj.n.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping,
        });
        setShown(value.slice(0, m.index) + text + value.slice(m.index + m[0].length));
      },
      onComplete: () => {
        done.current = true;
        setShown(value);
      },
    });
    return () => {
      anim.cancel();
    };
  }, [value]);

  return <span className={className}>{shown}</span>;
}

/** Below-the-fold sections rise in when they scroll into view. Used on the landing only. */
export function RevealOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    el.style.opacity = "0";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(el, { opacity: [0, 1], translateY: [24, 0], duration: 700, ease: "outCubic" });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Splits a headline into words that rise one after another. */
export function RevealWords({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    for (const w of words) w.style.opacity = "0";
    const anim = animate(words, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 600,
      delay: stagger(45, { start: 150 }),
      ease: "outCubic",
    });
    return () => {
      anim.cancel();
    };
  }, []);

  return (
    <span ref={ref} className={className} style={style}>
      {text.split(" ").map((w, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: words are static and may repeat
        <span key={i} data-word className="inline-block">
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Every element with data-reveal rises in when it scrolls into view. Call once per page. */
export function useScrollReveal() {
  useEffect(() => {
    if (reducedMotion()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;
    for (const el of els) el.style.opacity = "0";
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          animate(entry.target as HTMLElement, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            ease: "outCubic",
          });
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of els) io.observe(el);
    return () => {
      io.disconnect();
      for (const el of els) el.style.removeProperty("opacity");
    };
  }, []);
}
