"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import Link from "next/link";

import { ArrowUpRight, Check, ExternalLink, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { buildDetails, type DetailEvent, type DetailStage, type ItemDetail } from "@/data/details";
import { cn } from "@/lib/utils";

import { ProvenanceBadge } from "./screen-intro";

interface DetailApi {
  open: (id: string) => void;
  close: () => void;
  has: (id: string) => boolean;
}

const DetailContext = createContext<DetailApi | null>(null);

/** Any row or card calls open(id); the sheet shows that item's stages, facts, timeline and next steps. */
export function useDetail(): DetailApi {
  const ctx = useContext(DetailContext);
  if (!ctx) throw new Error("useDetail must be used inside DetailProvider");
  return ctx;
}

export function DetailProvider({ children }: { children: ReactNode }) {
  const details = useMemo(() => buildDetails(new Date()), []);
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((next: string) => setId(next), []);
  const close = useCallback(() => setId(null), []);
  const has = useCallback((k: string) => details.has(k), [details]);
  const api = useMemo(() => ({ open, close, has }), [open, close, has]);
  const detail = id ? (details.get(id) ?? null) : null;

  return (
    <DetailContext.Provider value={api}>
      {children}
      <Sheet open={Boolean(detail)} onOpenChange={(o) => !o && close()}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {detail ? <DetailBody detail={detail} onNavigate={close} /> : null}
        </SheetContent>
      </Sheet>
    </DetailContext.Provider>
  );
}

const toneClass = {
  ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const;

const dotClass = {
  ok: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  neutral: "bg-slate-400",
} as const;

const kindLabel = { request: "Request", filing: "Filing", "work-order": "Work order" } as const;

function DetailBody({ detail, onNavigate }: { detail: ItemDetail; onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-6 px-4 pb-8">
      <SheetHeader className="px-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="rounded-sm text-[10px] uppercase tracking-wider">
            {kindLabel[detail.kind]}
          </Badge>
          <ProvenanceBadge kind={detail.provenance} />
          {detail.status ? (
            <Badge variant="secondary" className={cn("rounded-sm", toneClass[detail.status.tone])}>
              {detail.status.label}
            </Badge>
          ) : null}
        </div>
        <SheetTitle className="text-xl leading-tight">{detail.title}</SheetTitle>
        {detail.subtitle ? <SheetDescription>{detail.subtitle}</SheetDescription> : null}
      </SheetHeader>

      <section aria-label="Stages">
        <h3 className="mb-2 font-medium text-sm">Where it is</h3>
        <Stages stages={detail.stages} />
      </section>

      <section aria-label="What happens next">
        <h3 className="mb-2 font-medium text-sm">What happens next</h3>
        <ul className="flex flex-col gap-1.5">
          {detail.next.map((n) => (
            <li key={n.label}>
              {n.external ? (
                <a
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/60"
                >
                  <span>
                    <span className="block font-medium">{n.label}</span>
                    {n.hint ? <span className="block text-muted-foreground text-xs">{n.hint}</span> : null}
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
                </a>
              ) : (
                <Link
                  prefetch={false}
                  href={n.href}
                  onClick={onNavigate}
                  className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/60"
                >
                  <span>
                    <span className="block font-medium">{n.label}</span>
                    {n.hint ? <span className="block text-muted-foreground text-xs">{n.hint}</span> : null}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Timeline">
        <h3 className="mb-2 font-medium text-sm">What happened</h3>
        <Timeline events={detail.timeline} />
      </section>

      <section aria-label="Facts">
        <h3 className="mb-2 font-medium text-sm">The facts</h3>
        <dl className="divide-y rounded-md border text-sm">
          {detail.facts.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 px-3 py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="min-w-0 break-words">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {detail.docs.length ? (
        <section aria-label="Documents">
          <h3 className="mb-2 font-medium text-sm">Documents for this stage</h3>
          <ul className="flex flex-col gap-1.5">
            {detail.docs.map((d) => (
              <li key={d.file}>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href={d.file} target="_blank" rel="noreferrer">
                    <FileText data-icon="inline-start" />
                    {d.label}
                    <span className="ml-auto text-muted-foreground text-xs">PDF · sample</span>
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Stages({ stages }: { stages: DetailStage[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {stages.map((s, i) => (
        <li key={s.id} className="grid grid-cols-[1.5rem_1fr] gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
                s.state === "done" && "border-[#14284B] bg-[#14284B] text-white",
                s.state === "current" && "border-[#F2A900] bg-[#F2A900] font-semibold text-[#14284B]",
                s.state === "pending" && "border-border bg-card text-muted-foreground",
                s.state === "skipped" && "border-dashed border-border bg-card text-muted-foreground",
              )}
              aria-hidden="true"
            >
              {s.state === "done" ? <Check className="size-3.5" /> : i + 1}
            </span>
            {i < stages.length - 1 ? (
              <span className={cn("w-px flex-1", s.state === "done" ? "bg-[#14284B]" : "bg-border")} />
            ) : null}
          </div>
          <div className="pb-3">
            <div
              className={cn(
                "text-sm leading-6",
                s.state === "current" && "font-medium",
                s.state === "skipped" && "text-muted-foreground line-through",
              )}
            >
              {s.title}
              {s.state === "current" ? <span className="ml-2 text-[#b07a00] text-xs">now</span> : null}
            </div>
            {s.note ? <div className="text-muted-foreground text-xs">{s.note}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Timeline({ events }: { events: DetailEvent[] }) {
  return (
    <ol className="flex flex-col divide-y rounded-md border">
      {events.map((e, i) => (
        <li key={`${e.date}-${e.label}-${i}`} className="grid grid-cols-[6rem_1fr] gap-3 px-3 py-2 text-sm">
          <span className="font-mono text-muted-foreground text-xs leading-5 tabular-nums">{e.date}</span>
          <span className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className={cn("mt-1.5 size-2 shrink-0 rounded-full", dotClass[e.tone ?? "neutral"])}
            />
            <span className="min-w-0">
              <span className="block leading-5">{e.label}</span>
              {e.note ? <span className="block text-muted-foreground text-xs">{e.note}</span> : null}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
