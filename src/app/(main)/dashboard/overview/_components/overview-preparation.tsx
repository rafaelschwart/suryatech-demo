import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type { DeadlineRow } from "@/app/(main)/dashboard/deadlines/_components/deadline-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleDocuments } from "@/data/documents";
import { mapcExportPack, mapcResponse } from "@/data/mapc-response";
import { formatUsd, type Opportunity } from "@/data/opportunities";
import { type FitResult, type FitVerdict, verdictLabel } from "@/lib/fit";
import { cn } from "@/lib/utils";

const verdictStyle: Record<FitVerdict, string> = {
  chase: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  consider: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  pass: "bg-muted text-muted-foreground",
};

interface OverviewPreparationProps {
  upcoming: DeadlineRow[];
  worth: { opportunity: Opportunity; fit: FitResult }[];
}

/**
 * The package-preparation half of the overview: what is due next, which requests are worth a
 * response, and how far the MAPC response and its export pack are. Every card links to its screen.
 */
export function OverviewPreparation({ upcoming, worth }: OverviewPreparationProps) {
  const fields = mapcResponse.flatMap((t) => t.fields);
  const ready = fields.filter((f) => f.state === "ready").length;
  const missing = fields.filter((f) => f.state === "missing").length;
  const packReady = mapcExportPack.filter((f) => f.state === "ready").length;
  const packBlocked = mapcExportPack.filter((f) => f.state === "blocked").length;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-5">
        <CardHeader>
          <CardTitle>Next deadlines</CardTitle>
          <CardDescription>Filings and closings still ahead, soonest first.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" asChild>
              <Link prefetch={false} href="/dashboard/deadlines">
                Deadline board
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {upcoming.length ? (
            <ul className="divide-y">
              {upcoming.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="w-20 shrink-0 font-mono text-muted-foreground text-xs">{r.due}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{r.item}</span>
                    <span className="block truncate text-muted-foreground text-xs">{r.source}</span>
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0 rounded-sm tabular-nums",
                      (r.daysLeft ?? 99) <= 14
                        ? "bg-destructive/10 text-destructive"
                        : (r.daysLeft ?? 99) <= 45
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    {r.daysLeft} days
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nothing dated is ahead. The board lists the filings whose dates are still to confirm.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-4">
        <CardHeader>
          <CardTitle>Requests worth a response</CardTitle>
          <CardDescription>Top of the triage, with the verdict the rules gave.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" asChild>
              <Link prefetch={false} href="/dashboard/opportunities">
                Opportunities
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {worth.map(({ opportunity: o, fit }) => (
              <li key={o.bidNumber} className="flex items-start gap-3 py-2 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{o.buyer}</span>
                  <span className="block truncate text-muted-foreground text-xs">{o.title}</span>
                  <span className="block text-muted-foreground text-xs">
                    Closed {o.closes}
                    {o.ceilingUsd ? ` · up to ${formatUsd(o.ceilingUsd)}` : ""}
                  </span>
                </span>
                <Badge variant="secondary" className={cn("shrink-0 rounded-sm", verdictStyle[fit.verdict])}>
                  {verdictLabel[fit.verdict]} · {fit.score}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Response pipeline</CardTitle>
          <CardDescription>The MAPC format, filled from the library.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <Step
            href="/dashboard/assembler"
            label="Assembler"
            value={`${ready} of ${fields.length} fields ready`}
            sub={`${missing} missing`}
          />
          <Step
            href="/dashboard/library"
            label="Answer library"
            value="Constants, scope blocks, rates"
            sub="Written once, reused"
          />
          <Step
            href="/dashboard/evidence"
            label="Evidence register"
            value="MBE, SDP, MassCEC"
            sub="Cadence and next date"
          />
          <Step
            href="/dashboard/export"
            label="Export pack"
            value={`${packReady} of ${mapcExportPack.length} files ready`}
            sub={packBlocked ? `${packBlocked} blocked` : "Builds locally"}
          />
          <Step
            href="/dashboard/documents"
            label="Documents"
            value={`${sampleDocuments.length} sample documents`}
            sub="One or more per stage"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Step({ href, label, value, sub }: { href: string; label: string; value: string; sub: string }) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 hover:bg-muted/60"
    >
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        <span className="block truncate text-muted-foreground text-xs">
          {value} · {sub}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
