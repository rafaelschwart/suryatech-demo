"use client";

import { useEffect, useState } from "react";

/**
 * The Higgsfield-rendered unit (image-to-3D from the product cutout) shown through <model-viewer>.
 * Loads the web component on first use only; the assembly view does not pay for it.
 */
export function RenderedUnit() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    void import("@google/model-viewer")
      .then(() => {
        if (!cancelled) setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-xs" role="status">
        Loading rendered unit…
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground text-xs">
        The rendered unit could not start in this browser.
      </div>
    );
  }
  return (
    <model-viewer
      src="/media/charger.glb"
      alt="Rendered concept of the SuryaTech hybrid solar and battery charger"
      camera-controls
      auto-rotate
      auto-rotate-delay="600"
      rotation-per-second="16deg"
      shadow-intensity="1"
      exposure="1.05"
      environment-image="neutral"
      interaction-prompt="none"
      touch-action="pan-y"
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
    />
  );
}
