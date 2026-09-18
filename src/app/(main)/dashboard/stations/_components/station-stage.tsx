"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Box, Download, Layers3, RotateCcw, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
type Controller = ReturnType<typeof mountStationModel>;

export function StationStage({ station }: { station: StationSnapshot | null; daylight: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [state, setState] = useState<ViewerState>({ exploded: false, engineering: true, selected: null, view: "iso" });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
    controller.current?.update(state);
  }, [state]);

  useEffect(() => {
    // biome-ignore lint/suspicious/noUnnecessaryConditions: the DOM ref can be null before mount or after unmount.
    if (!host.current) return;
    const element = host.current;
    element.dataset.attempt = String(attempt);
    let cancelled = false;
    let instance: Controller | null = null;
    setStatus("loading");
    const fail = () => {
      if (!cancelled) setStatus("error");
    };
    void import("./station-model")
      .then(async ({ mountStationModel }) => {
        if (cancelled) return;
        instance = mountStationModel(element, (selected) => setState((s) => ({ ...s, selected })), fail);
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
  }, [attempt]);

  const selected = PARTS.find((p) => p.id === state.selected);
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
            <Box className="size-3" /> Engineering view
          </p>
          <h2 className="mt-1 truncate font-medium text-sm">Hybrid charging station</h2>
          <p className="mt-0.5 truncate text-muted-foreground text-xs">{station?.name ?? "SuryaTech"}</p>
        </div>
        <Badge
          variant="outline"
          className="rounded-sm border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          Concept
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3">
        <fieldset className="flex gap-1" aria-label="Camera view">
          {(
            [
              ["iso", "3D"],
              ["front", "Front"],
              ["side", "Side"],
              ["top", "Top"],
            ] as [ViewId, string][]
          ).map(([view, label]) => (
            <Button
              key={view}
              size="xs"
              variant={state.view === view ? "secondary" : "ghost"}
              aria-pressed={state.view === view}
              disabled={status !== "ready"}
              onClick={() => setState((s) => ({ ...s, view }))}
            >
              {label}
            </Button>
          ))}
        </fieldset>
        <div className="flex gap-1">
          <Button
            size="icon-xs"
            variant={state.engineering ? "secondary" : "ghost"}
            aria-label="Toggle engineering dimensions"
            aria-pressed={state.engineering}
            title="Dimensions and edges"
            disabled={status !== "ready"}
            onClick={() => setState((s) => ({ ...s, engineering: !s.engineering }))}
          >
            <Ruler />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Reset model view"
            title="Reset view"
            disabled={status !== "ready"}
            onClick={() => {
              setState({ exploded: false, engineering: true, selected: null, view: "iso" });
              controller.current?.reset();
            }}
          >
            <RotateCcw />
          </Button>
          <Button size="icon-xs" variant="ghost" asChild>
            <a
              href="/media/charging-station.glb"
              download
              aria-label="Download charging station GLB"
              title="Download 3D model"
            >
              <Download />
            </a>
          </Button>
        </div>
      </div>
      <div className="relative min-h-[410px] flex-1 bg-muted/15">
        <div
          ref={host}
          data-testid="station-model"
          className={cn("absolute inset-0 cursor-grab active:cursor-grabbing", status !== "ready" && "invisible")}
        />
        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6" role="status">
            <Image
              src="/media/charging-station-poster.png"
              alt="SuryaTech charging station engineering illustration"
              width={270}
              height={315}
              className="h-[300px] w-auto object-contain"
            />
            <p className="text-center text-muted-foreground text-xs">
              {status === "loading" ? "Loading 3D assembly…" : "3D view unavailable. Showing the station preview."}
            </p>
            {status === "error" && (
              <Button variant="outline" size="xs" onClick={() => setAttempt((n) => n + 1)}>
                Retry 3D view
              </Button>
            )}
          </div>
        )}
        {status === "ready" && (
          <p className="pointer-events-none absolute right-3 bottom-2 left-3 text-center text-[10px] text-muted-foreground">
            {state.exploded
              ? "Exploded assembly · illustrative internal layout"
              : "Drag to orbit · scroll to zoom · select a component"}
          </p>
        )}
      </div>
      <div className="border-t px-3 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">ST—01 / Assembly</p>
          <Button
            size="xs"
            variant={state.exploded ? "default" : "outline"}
            aria-pressed={state.exploded}
            disabled={status !== "ready"}
            onClick={() => setState((s) => ({ ...s, exploded: !s.exploded }))}
          >
            <Layers3 />
            {state.exploded ? "Assemble" : "Explode"}
          </Button>
        </div>
        <fieldset className="flex flex-wrap gap-1" aria-label="Station components">
          {PARTS.map((p) => (
            <Button
              key={p.id}
              size="xs"
              variant={state.selected === p.id ? "secondary" : "ghost"}
              className="text-[11px]"
              aria-pressed={state.selected === p.id}
              disabled={status !== "ready"}
              onClick={() => selectPart(p.id)}
            >
              {p.label}
            </Button>
          ))}
        </fieldset>
        <p aria-live="polite" className="mt-2 min-h-8 text-[11px] text-muted-foreground leading-relaxed">
          {selected?.description ??
            "Explore the solar, storage and charging assemblies. Select a component to highlight it."}
        </p>
      </div>
      <p className="border-t bg-muted/25 px-3 py-2 text-[10px] text-muted-foreground leading-relaxed">
        Concept geometry and dimensions. Not a fabrication drawing. Simulator readings represent the site, not this
        panel’s rated capacity.
      </p>
    </section>
  );
}
