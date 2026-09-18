"use client";

import { type DragEvent, useEffect, useState } from "react";

import Link from "next/link";

import { ArrowUpRight, GripVertical, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Provenance } from "@/data/company";
import { cn } from "@/lib/utils";

import { ProvenanceBadge } from "./screen-intro";

export type ColumnTone = "navy" | "gold" | "sky" | "emerald" | "amber" | "red" | "muted";

export interface BoardColumn {
  id: string;
  title: string;
  hint: string;
  tone: ColumnTone;
}

export interface BoardCard {
  id: string;
  column: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  badgeTone?: "ok" | "warning" | "critical" | "neutral";
  provenance: Provenance;
  href?: string;
}

const toneBar: Record<ColumnTone, string> = {
  navy: "bg-[#14284B]",
  gold: "bg-[#F2A900]",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  muted: "bg-slate-400",
};

const badgeTone: Record<NonNullable<BoardCard["badgeTone"]>, string> = {
  ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

interface KanbanProps {
  columns: BoardColumn[];
  cards: BoardCard[];
  /** localStorage key for moves made in the browser. Omit for a read-only board. */
  storageKey?: string;
  className?: string;
}

function readMoves(key: string): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeMoves(key: string, moves: Record<string, string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(moves));
  } catch {
    // storage unavailable; the board still works for this view
  }
}

/**
 * A Kanban board with native drag and drop. Cards remember the column they were dragged to in
 * this browser only; Reset puts every card back where the data says it is.
 */
export function Kanban({ columns, cards, storageKey, className }: KanbanProps) {
  const [moves, setMoves] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  useEffect(() => {
    if (storageKey) setMoves(readMoves(storageKey));
  }, [storageKey]);

  const columnOf = (c: BoardCard) => moves[c.id] ?? c.column;
  const moved = Object.keys(moves).length;

  function drop(e: DragEvent, columnId: string) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragging;
    setOver(null);
    setDragging(null);
    if (!id) return;
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    const next = { ...moves };
    if (card.column === columnId) delete next[id];
    else next[id] = columnId;
    setMoves(next);
    if (storageKey) writeMoves(storageKey, next);
  }

  function reset() {
    setMoves({});
    if (storageKey) writeMoves(storageKey, {});
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {storageKey ? (
        <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
          <span>Drag a card to move it. Moves stay in this browser.</span>
          <Button variant="ghost" size="xs" onClick={reset} disabled={!moved}>
            <RotateCcw data-icon="inline-start" />
            Reset {moved ? `(${moved})` : ""}
          </Button>
        </div>
      ) : null}
      <div className="overflow-x-auto pb-2">
        <ol className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))` }}>
          {columns.map((col) => {
            const items = cards.filter((c) => columnOf(c) === col.id);
            return (
              <li
                key={col.id}
                data-column={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (over !== col.id) setOver(col.id);
                }}
                onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
                onDrop={(e) => drop(e, col.id)}
                className={cn(
                  "flex min-h-[220px] flex-col overflow-hidden rounded-xl border bg-muted/30 transition-colors",
                  over === col.id && dragging && "border-primary bg-primary/5",
                )}
              >
                <div className={cn("h-1.5 w-full", toneBar[col.tone])} />
                <div className="flex items-baseline justify-between gap-2 px-3 pt-2 pb-1">
                  <span className="font-medium text-sm">{col.title}</span>
                  <span className="rounded-sm bg-background px-1.5 py-0.5 font-medium text-muted-foreground text-xs tabular-nums">
                    {items.length}
                  </span>
                </div>
                <p className="px-3 pb-2 text-[11px] text-muted-foreground leading-snug">{col.hint}</p>
                <ul className="flex max-h-[520px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
                  {items.map((c) => (
                    <li
                      key={c.id}
                      draggable={Boolean(storageKey)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", c.id);
                        e.dataTransfer.effectAllowed = "move";
                        setDragging(c.id);
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setOver(null);
                      }}
                      className={cn(
                        "group rounded-lg border bg-card p-2.5 text-card-foreground shadow-xs transition-shadow",
                        storageKey && "cursor-grab active:cursor-grabbing hover:shadow-md",
                        dragging === c.id && "opacity-50",
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        {storageKey ? (
                          <GripVertical
                            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm leading-snug">{c.title}</p>
                          {c.subtitle ? (
                            <p className="mt-0.5 text-muted-foreground text-xs leading-snug">{c.subtitle}</p>
                          ) : null}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <ProvenanceBadge kind={c.provenance} className="px-1 py-0 text-[10px]" />
                            {c.badge ? (
                              <Badge
                                variant="secondary"
                                className={cn("rounded-sm px-1 py-0 text-[10px]", badgeTone[c.badgeTone ?? "neutral"])}
                              >
                                {c.badge}
                              </Badge>
                            ) : null}
                            {c.meta ? <span className="text-[11px] text-muted-foreground">{c.meta}</span> : null}
                          </div>
                        </div>
                        {c.href ? (
                          <Link
                            prefetch={false}
                            href={c.href}
                            aria-label={`Open ${c.title}`}
                            className="rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
                          >
                            <ArrowUpRight className="size-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </li>
                  ))}
                  {!items.length ? (
                    <li className="rounded-lg border border-dashed px-2 py-4 text-center text-[11px] text-muted-foreground">
                      Nothing here
                    </li>
                  ) : null}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
