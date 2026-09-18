"use client";

import { useState } from "react";

import { FolderOutput, Lock } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExportFile } from "@/data/mapc-response";
import { cn } from "@/lib/utils";

const stateMeta: Record<ExportFile["state"], { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  partial: { label: "Partial", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  blocked: { label: "Blocked", className: "bg-destructive/10 text-destructive" },
};

export function ExportPack({ files }: { files: ExportFile[] }) {
  const [log, setLog] = useState<string[]>([]);
  const blocked = files.filter((f) => f.state === "blocked").length;

  function assemble() {
    const stamp = new Date().toLocaleTimeString();
    setLog((l) => [`${stamp} · Pack assembled: ${files.length} files, ${blocked} blocked. Nothing uploaded.`, ...l]);
    toast(`Pack assembled: ${files.length} files, named as the RFP names them.`, {
      description: `${blocked} are blocked on missing content. Upload it yourself on COMMBUYS when it is complete.`,
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-8">
        <CardHeader>
          <CardTitle>MAPC BD-26-1217 · response folder</CardTitle>
          <CardDescription>In the order the RFP lists them.</CardDescription>
          <CardAction>
            <Button size="sm" onClick={assemble}>
              <FolderOutput data-icon="inline-start" />
              Assemble pack
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ol className="divide-y rounded-lg border">
            {files.map((f, i) => {
              const s = stateMeta[f.state];
              return (
                <li key={f.name} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="w-6 text-right font-mono text-muted-foreground text-xs tabular-nums">{i + 1}</span>
                  <span className="w-12 rounded-sm bg-muted px-1.5 py-0.5 text-center font-mono text-[11px]">
                    {f.ext}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
                  <span className="hidden text-muted-foreground text-xs sm:block">{f.note}</span>
                  <Badge variant="secondary" className={cn("rounded-sm px-1.5 py-0.5", s.className)}>
                    {s.label}
                  </Badge>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
      <Card className="xl:col-span-4">
        <CardHeader>
          <CardTitle>What the button does</CardTitle>
          <CardDescription>And what it will never do.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <p>
            It builds the folder and names the files the way the RFP names them. It does not upload, email or file. On a
            contract administered by the Commonwealth, with an MBE certification attached to the company's name, that
            step stays a human decision.
          </p>
          <div className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
            <Lock className="mt-0.5 size-4 shrink-0" />
            <span>No write path into COMMBUYS, MassCEC, utility or municipal systems, in any phase.</span>
          </div>
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Audit</p>
            {log.length === 0 ? (
              <p className="mt-1 text-muted-foreground text-xs">No packs assembled this session.</p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1 font-mono text-xs">
                {log.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
