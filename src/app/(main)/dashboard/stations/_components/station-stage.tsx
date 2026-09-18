/* biome-ignore-all lint/a11y/useSemanticElements: role=group on button strips; a fieldset would add border and padding */
"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Box, Download, Layers3, RotateCcw, Ruler, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMediaAvailable } from "@/hooks/use-media-available";
import { cn } from "@/lib/utils";

import { RenderedUnit } from "./rendered-unit";
import type { mountStationModel, PartId, ViewerState, ViewId } from "./station-model";
import type { StationSnapshot } from "./types";

const PARTS: { id: PartId; label: string; description: string }[] = [
  { id: "solar", label: "01 Solar canopy", description: "Tilted photovoltaic panel, aluminum rails and junction box." },
  {
    id: "battery",
    label: "02 Battery bay",
    description: "Three removable storage modules on supported shelves. Open the assembly to inspect.",
  },
  {
    id: "electronics",
    label: "03 Power module",
    description: "Illustrative controller, converter, heat sink and protection module.",
  },
  {
    id: "connector",
    label: "04 Connector",
    description: "Docked handle, cable loop, strain relief and enclosure gland.",
  },
  {
    id: "enclosure",
    label: "05 Service panels",
    description: "Navy service covers, touchscreen, access lock and identification.",
  },
  {
    id: "frame",
    label: "06 Structure",
    description: "Cabinet chassis, cooling louvers, canopy posts and support braces.",
  },
  {
    id: "base",
    label: "07 Mounting plate",
    description: "Concept mounting plate with four anchors and isolation gasket.",
  },
];

const VIEWS: [ViewId, string][] = [
  ["iso", "3D"],
  ["front", "Front"],
  ["side", "Side"],
  ["top", "Top"],
];

type Controller = ReturnType<typeof mountStationModel>;
type Mode = "assembly" | "rendered";

const LOOP = "/media/charger-loop.mp4";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The station in 3D, two ways. Assembly: the concept model with exploded view, part selection and
 * engineering dimensions. Rendered: the Higgsfield unit on a turntable. If the browser has no
 * usable WebGL, the stage says why and plays the charger loop instead of an empty box.
 */
export function StationStage({ station }: { station: StationSnapshot | null; daylight: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [mode, setMode] = useState<Mode>("assembly");
  const [state, setState] = useState<ViewerState>({ exploded: false, engineering: true, selected: null, view: "iso" });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reason, setReason] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const hasLoop = useMediaAvailable(LOOP);
  const latest = useRef(state);

  useEffect(() => {
    latest.current = state;
    controller.current?.update(state);
  }, [state]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt re-runs the mount on Retry
  useEffect(() => {
    if (mode !== "assembly") return;
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let instance: Controller | null = null;
    setStatus("loading");
    setReason(null);
    if (!webglAvailable()) {
      setReason(
        "WebGL is off in this browser. Hardware acceleration may be disabled, or this is a remote-desktop session.",
      );
      setStatus("error");
      return;
    }
    const fail = (why?: unknown) => {
      if (cancelled) return;
      setReason(why instanceof Error && why.message ? why.message : "The 3D view could not start.");
      setStatus("error");
    };
    void import("./station-model")
      .then(async ({ mountStationModel }) => {
        if (cancelled) return;
        instance = mountStationModel(
          element,
          (selected) => setState((s) => ({ ...s, selected })),
          () => fail(new Error("The graphics context was lost. Retry to start it again.")),
        );
        controller.current = instance;
        instance.update(latest.current);
        await instance.ready;
        if (!cancelled) setStatus("ready");
      })
      .catch(fail);
    return () => {
      cancelled = true;
      instance?.dispose();
      controller.current = null;
    };
  }, [attempt, mode]);

  const selected = PARTS.find((p) => p.id === state.selected);
  const assembly = mode === "assembly";
  const ready = assembly && status === "ready";

  function selectPart(id: PartId) {
    setState((s) => ({
      ...s,
      selected: s.selected === id ? null : id,
      exploded: id === "battery" || id === "electronics" ? true : s.exploded,
    }));
  }

  return (
    <section
      aria-label="Station engineering model"
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground"
    >
      <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest">
            <Box className="size-3" /> {assembly ? "Engineering view" : "Rendered unit"}
          </p>
          <h2 className="mt-1 truncate font-medium text-sm">Hybrid charging station</h2>
          <p className="mt-0.5 truncate text-muted-foreground text-xs">{station?.name ?? "SuryaTech"}</p>
        </div>
        <Badge
          variant="outline"
          className="rounded-sm border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          {assembly ? "Concept" : "Illustration"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border p-0.5" role="group" aria-label="Model">
            <Button
              size="xs"
              variant={assembly ? "secondary" : "ghost"}
              aria-pressed={assembly}
              onClick={() => setMode("assembly")}
            >
              <Layers3 data-icon="inline-start" />
              Assembly
            </Button>
            <Button
              size="xs"
              variant={assembly ? "ghost" : "secondary"}
              aria-pressed={!assembly}
              onClick={() => setMode("rendered")}
            >
              <Sparkles data-icon="inline-start" />
              Rendered
            </Button>
          </div>
          {assembly ? (
            <div className="flex gap-1" role="group" aria-label="Camera view">
              {VIEWS.map(([view, label]) => (
                <Button
                  key={view}
                  size="xs"
                  variant={state.view === view ? "secondary" : "ghost"}
                  aria-pressed={state.view === view}
                  disabled={!ready}
                  onClick={() => setState((s) => ({ ...s, view }))}
                >
                  {label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex gap-1">
          {assembly ? (
            <>
              <Button
                size="icon-xs"
                variant={state.engineering ? "secondary" : "ghost"}
                aria-label="Toggle engineering dimensions"
                aria-pressed={state.engineering}
                title="Dimensions and edges"
                disabled={!ready}
                onClick={() => setState((s) => ({ ...s, engineering: !s.engineering }))}
              >
                <Ruler />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Reset model view"
                title="Reset view"
                disabled={!ready}
                onClick={() => {
                  setState({ exploded: false, engineering: true, selected: null, view: "iso" });
                  controller.current?.reset();
                }}
              >
                <RotateCcw />
              </Button>
            </>
          ) : null}
          <Button size="icon-xs" variant="ghost" asChild>
            <a
              href={assembly ? "/media/charging-station.glb" : "/media/charger.glb"}
              download
              aria-label="Download 3D model"
              title="Download 3D model (GLB)"
            >
              <Download />
            </a>
          </Button>
        </div>
      </div>

      <div className="relative min-h-[410px] flex-1 bg-muted/15">
        {assembly ? (
          <>
            <div
              ref={host}
              data-testid="station-model"
              className={cn("absolute inset-0 cursor-grab active:cursor-grabbing", status !== "ready" && "invisible")}
            />
            {status !== "ready" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6" role="status">
                {status === "error" && hasLoop ? (
                  <video
                    className="h-[300px] w-auto rounded-lg object-cover"
                    src={LOOP}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label="Charger loop"
                  />
                ) : (
                  <Image
                    src="/media/charging-station-poster.png"
                    alt="SuryaTech charging station engineering illustration"
                    width={270}
                    height={315}
                    className="h-[300px] w-auto object-contain"
                  />
                )}
                <p className="text-center text-muted-foreground text-xs">
                  {status === "loading" ? "Loading 3D assembly…" : (reason ?? "3D view unavailable.")}
                </p>
                {status === "error" ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="xs" onClick={() => setAttempt((n) => n + 1)}>
                      Retry 3D view
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => setMode("rendered")}>
                      Try the rendered unit
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}
            ready ? (
            <p className="pointer-events-none absolute right-3 bottom-2 left-3 text-center text-[10px] text-muted-foreground">
              {state.exploded
                ? "Exploded assembly · illustrative internal layout"
                : "Drag to orbit · click, then scroll to zoom · select a component"}
            </p>
            ) : null
          </>
        ) : (
          <div className="absolute inset-0">
            <RenderedUnit />
            <p className="pointer-events-none absolute right-3 bottom-2 left-3 text-center text-[10px] text-muted-foreground">
              Drag to orbit · turntable resumes when released
            </p>
          </div>
        )}
      </div>

      {assembly ? (
        <div className="border-t px-3 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">ST—01 / Assembly</p>
            <Button
              size="xs"
              variant={state.exploded ? "default" : "outline"}
              aria-pressed={state.exploded}
              disabled={!ready}
              onClick={() => setState((s) => ({ ...s, exploded: !s.exploded }))}
            >
              <Layers3 />
              {state.exploded ? "Assemble" : "Explode"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Station components">
            {PARTS.map((p) => (
              <Button
                key={p.id}
                size="xs"
                variant={state.selected === p.id ? "secondary" : "ghost"}
                className="text-[11px]"
                aria-pressed={state.selected === p.id}
                disabled={!ready}
                onClick={() => selectPart(p.id)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <p aria-live="polite" className="mt-2 min-h-8 text-[11px] text-muted-foreground leading-relaxed">
            {selected?.description ??
              "Explore the solar, storage and charging assemblies. Select a component to highlight it."}
          </p>
        </div>
      ) : (
        <div className="border-t px-3 py-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Image-to-3D render of the product cutout (Higgsfield, Tripo). Materials and proportions are illustrative.
            Switch to Assembly for the exploded view and part list.
          </p>
        </div>
      )}
      <p className="border-t bg-muted/25 px-3 py-2 text-[10px] text-muted-foreground leading-relaxed">
        Concept geometry and dimensions. Not a fabrication drawing. Simulator readings represent the site, not this
        panel’s rated capacity.
      </p>
    </section>
  );
}
