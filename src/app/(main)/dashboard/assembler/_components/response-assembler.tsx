"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FieldState, ResponseTab } from "@/data/mapc-response";
import { cn } from "@/lib/utils";

const stateMeta: Record<FieldState, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  ready: { label: "Ready", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", icon: CheckCircle2 },
  sample: { label: "Sample", className: "bg-violet-500/10 text-violet-700 dark:text-violet-300", icon: CircleDashed },
  missing: { label: "Missing", className: "bg-destructive/10 text-destructive", icon: AlertTriangle },
};

export function ResponseAssembler({ tabs }: { tabs: ResponseTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const totalFields = tabs.reduce((n, t) => n + t.fields.length, 0);
  const missingFields = tabs.reduce((n, t) => n + t.fields.filter((f) => f.state === "missing").length, 0);
  const readyFields = tabs.reduce((n, t) => n + t.fields.filter((f) => f.state === "ready").length, 0);
  const completion = Math.round(((totalFields - missingFields) / totalFields) * 100);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>MAPC BD-26-1217, non-grid-tied charging and EV carshare</CardTitle>
          <CardDescription>
            {readyFields} ready, {missingFields} need a person, {totalFields} total.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Progress value={completion} className="h-2" />
            <span className="w-12 text-right font-medium text-sm tabular-nums">{completion}%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
            {tabs.map((t) => {
              const missing = t.fields.filter((f) => f.state === "missing").length;
              const isActive = t.id === active?.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-ring",
                    isActive && "border-primary bg-muted/60 ring-1 ring-primary",
                  )}
                >
                  <span className="font-mono text-muted-foreground text-xs">Tab {t.number}</span>
                  <span className="font-medium text-sm leading-tight">{t.title}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-sm px-1.5 py-0 text-[11px]",
                      missing
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    {missing ? `${missing} missing` : "Complete"}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {active ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Tab {active.number} · {active.title}
            </CardTitle>
            <CardDescription>{active.rule}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-72">Field</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="w-44">Filled from</TableHead>
                    <TableHead className="w-28">State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {active.fields.map((f) => {
                    const meta = stateMeta[f.state];
                    const Icon = meta.icon;
                    return (
                      <TableRow key={f.label}>
                        <TableCell className="whitespace-normal font-medium">{f.label}</TableCell>
                        <TableCell className={cn("whitespace-normal", f.state === "missing" && "text-destructive")}>
                          {f.value}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{f.source || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("gap-1 rounded-sm px-1.5 py-0.5", meta.className)}>
                            <Icon className="size-3" />
                            {meta.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
