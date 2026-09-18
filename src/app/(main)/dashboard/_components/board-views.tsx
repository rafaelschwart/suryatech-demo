"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowUpRight, KanbanSquare, List } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { useDetail } from "./item-detail";
import { type BoardCard, type BoardColumn, type ColumnTone, Kanban } from "./kanban";
import { ProvenanceBadge } from "./screen-intro";

type View = "list" | "board";

const toneDot: Record<ColumnTone, string> = {
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

interface BoardViewsProps {
  columns: BoardColumn[];
  cards: BoardCard[];
  storageKey: string;
  /** Column header for the item in list view, e.g. "Request" or "Work order". */
  itemLabel: string;
  defaultView?: View;
}

function readView(key: string, fallback: View): View {
  try {
    const v = window.localStorage.getItem(`${key}:view`);
    return v === "board" || v === "list" ? v : fallback;
  } catch {
    return fallback;
  }
}

/**
 * One dataset, two views. List is the plain reading: every item in stage order with its date and
 * status. Board is the same items as columns you can drag. A stage bar above both shows the shape
 * of the pipeline at a glance.
 */
export function BoardViews({ columns, cards, storageKey, itemLabel, defaultView = "list" }: BoardViewsProps) {
  const [view, setView] = useState<View>(defaultView);

  useEffect(() => {
    setView(readView(storageKey, defaultView));
  }, [storageKey, defaultView]);

  function choose(v: View) {
    setView(v);
    try {
      window.localStorage.setItem(`${storageKey}:view`, v);
    } catch {
      // storage unavailable; the toggle still works for this visit
    }
  }

  const counts = columns.map((c) => ({ column: c, n: cards.filter((k) => k.column === c.id).length }));
  const total = cards.length || 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StageBar counts={counts} total={total} />
        <div className="flex rounded-md border p-0.5" role="tablist" aria-label="View">
          <Button
            size="xs"
            variant={view === "list" ? "secondary" : "ghost"}
            role="tab"
            aria-selected={view === "list"}
            onClick={() => choose("list")}
          >
            <List data-icon="inline-start" />
            List
          </Button>
          <Button
            size="xs"
            variant={view === "board" ? "secondary" : "ghost"}
            role="tab"
            aria-selected={view === "board"}
            onClick={() => choose("board")}
          >
            <KanbanSquare data-icon="inline-start" />
            Board
          </Button>
        </div>
      </div>
      {view === "board" ? (
        <Kanban columns={columns} cards={cards} storageKey={storageKey} />
      ) : (
        <BoardList columns={columns} cards={cards} itemLabel={itemLabel} />
      )}
    </div>
  );
}

function StageBar({ counts, total }: { counts: { column: BoardColumn; n: number }[]; total: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className="flex h-2 w-full max-w-xl overflow-hidden rounded-full bg-muted">
        {counts
          .filter((c) => c.n)
          .map((c) => (
            <span
              key={c.column.id}
              className={cn("h-full", toneDot[c.column.tone])}
              style={{ width: `${(c.n / total) * 100}%` }}
              title={`${c.column.title}: ${c.n}`}
            />
          ))}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground text-xs">
        {counts.map((c) => (
          <li key={c.column.id} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-2 rounded-full", toneDot[c.column.tone])} />
            {c.column.title}
            <span className="font-medium text-foreground tabular-nums">{c.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Every card as a row, grouped in stage order. Nothing to drag, nothing hidden in a column. */
export function BoardList({
  columns,
  cards,
  itemLabel,
}: {
  columns: BoardColumn[];
  cards: BoardCard[];
  itemLabel: string;
}) {
  const detail = useDetail();
  const order = new Map(columns.map((c, i) => [c.id, i]));
  const rows = [...cards].sort((a, b) => (order.get(a.column) ?? 99) - (order.get(b.column) ?? 99));
  const byId = new Map(columns.map((c) => [c.id, c]));
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-40">Stage</TableHead>
            <TableHead>{itemLabel}</TableHead>
            <TableHead className="w-36">When</TableHead>
            <TableHead className="w-44">Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const col = byId.get(r.column);
            return (
              <TableRow
                key={r.id}
                className={cn(detail.has(r.id) && "cursor-pointer")}
                onClick={() => detail.has(r.id) && detail.open(r.id)}
              >
                <TableCell>
                  <span className="flex items-center gap-2 text-sm">
                    <span
                      aria-hidden="true"
                      className={cn("size-2 shrink-0 rounded-full", col ? toneDot[col.tone] : "")}
                    />
                    {col?.title ?? r.column}
                  </span>
                </TableCell>
                <TableCell className="whitespace-normal">
                  <div className="font-medium">{r.title}</div>
                  {r.subtitle ? <div className="text-muted-foreground text-xs">{r.subtitle}</div> : null}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{r.meta ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    <ProvenanceBadge kind={r.provenance} className="px-1 py-0 text-[10px]" />
                    {r.badge ? (
                      <Badge
                        variant="secondary"
                        className={cn("rounded-sm px-1 py-0 text-[10px]", badgeTone[r.badgeTone ?? "neutral"])}
                      >
                        {r.badge}
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {r.href ? (
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      asChild
                      aria-label={`Open ${r.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link prefetch={false} href={r.href}>
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
