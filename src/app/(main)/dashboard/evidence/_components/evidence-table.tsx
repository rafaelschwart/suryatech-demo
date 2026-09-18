import { FileX2, Paperclip } from "lucide-react";

import { ProvenanceBadge } from "@/app/(main)/dashboard/_components/screen-intro";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Obligation, ObligationStatus } from "@/data/obligations";
import { cn } from "@/lib/utils";

const statusMeta: Record<ObligationStatus, { label: string; className: string }> = {
  due: { label: "Due", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  confirm: { label: "Confirm filed", className: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  unknown: { label: "Unknown", className: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  "on-file": { label: "On file", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
};

export function EvidenceTable({ obligations }: { obligations: Obligation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations</CardTitle>
        <CardDescription>The SDP row is first because it is the one with a hard public date.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-64">Obligation</TableHead>
                <TableHead className="min-w-[320px]">Rule</TableHead>
                <TableHead className="w-36">Cadence</TableHead>
                <TableHead className="w-28">Next date</TableHead>
                <TableHead className="w-36">Document</TableHead>
                <TableHead className="w-28">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obligations.map((o) => {
                const s = statusMeta[o.status];
                return (
                  <TableRow key={o.id}>
                    <TableCell className="whitespace-normal">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium leading-snug">{o.name}</span>
                        <span className="text-muted-foreground text-xs">{o.source}</span>
                        <ProvenanceBadge kind={o.provenance} className="w-fit" />
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm leading-snug">{o.rule}</TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground text-xs">{o.cadence}</TableCell>
                    <TableCell className="font-mono text-xs tabular-nums">{o.nextDate ?? "—"}</TableCell>
                    <TableCell>
                      {o.documentOnFile ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          <Paperclip className="size-3.5 text-muted-foreground" />
                          {o.documentOnFile}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <FileX2 className="size-3.5" />
                          Nothing attached
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("rounded-sm px-1.5 py-0.5", s.className)}>
                        {s.label}
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
  );
}
