"use client";

import { useDetail } from "@/app/(main)/dashboard/_components/item-detail";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DeadlineRow {
  id: string;
  due: string | null;
  item: string;
  owner: string | null;
  status: "due" | "confirm" | "closed" | "awarded" | "unknown";
  daysLeft: number | null;
  source: string;
}

const statusStyle: Record<DeadlineRow["status"], { label: (r: DeadlineRow) => string; className: string }> = {
  due: {
    label: (r) => (r.daysLeft !== null && r.daysLeft >= 0 ? `${r.daysLeft} days` : "Overdue"),
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  confirm: { label: () => "Confirm filed", className: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  closed: { label: () => "Closed · no record", className: "bg-destructive/10 text-destructive" },
  awarded: { label: () => "Awarded to somebody", className: "bg-destructive/10 text-destructive" },
  unknown: { label: () => "Date unknown", className: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
};

export function DeadlineTable({ rows }: { rows: DeadlineRow[] }) {
  const detail = useDetail();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Every date that matters</CardTitle>
        <CardDescription>
          Red rows are requests that closed with no Suryatech response on the public record. Amber is owed. Violet is
          unknown until Discovery. Click a row for the detail.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[860px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-28">Due</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="w-32">Owner</TableHead>
                <TableHead className="w-44">Status</TableHead>
                <TableHead className="w-72">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const s = statusStyle[row.status];
                return (
                  <TableRow
                    key={row.id}
                    className={cn(detail.has(row.id) && "cursor-pointer")}
                    onClick={() => detail.has(row.id) && detail.open(row.id)}
                  >
                    <TableCell className="font-mono text-xs tabular-nums">{row.due ?? "—"}</TableCell>
                    <TableCell className="whitespace-normal font-medium">{row.item}</TableCell>
                    <TableCell className="text-muted-foreground">{row.owner ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("rounded-sm px-1.5 py-0.5", s.className)}>
                        {s.label(row)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground text-xs">{row.source}</TableCell>
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
