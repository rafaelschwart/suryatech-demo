"use client";

import { Fragment, useState } from "react";

import { ChevronDown, ExternalLink } from "lucide-react";

import { useDetail } from "@/app/(main)/dashboard/_components/item-detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUsd, type Opportunity } from "@/data/opportunities";
import { type FitResult, type FitVerdict, verdictLabel } from "@/lib/fit";
import { cn } from "@/lib/utils";

export interface OpportunityRow {
  opportunity: Opportunity;
  fit: FitResult;
}

const verdictStyle: Record<FitVerdict, string> = {
  chase: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  consider: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  pass: "bg-muted text-muted-foreground",
};

const statusLabel: Record<Opportunity["status"], string> = {
  open: "Open",
  opened: "Opened",
  closed: "Closed",
  "bid-to-po": "Awarded",
};

export function OpportunitiesTable({ rows }: { rows: OpportunityRow[] }) {
  const detail = useDetail();
  const [filter, setFilter] = useState<"all" | FitVerdict>("all");
  const [open, setOpen] = useState<string | null>(rows[0]?.opportunity.bidNumber ?? null);
  const visible = filter === "all" ? rows : rows.filter((r) => r.fit.verdict === filter);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests on the record</CardTitle>
        <CardDescription>
          Sorted by fit. Open a row to read why it got its verdict, then Full detail for its stages, timeline and next
          steps. The verdict is a recommendation with its reasoning exposed, and any row can be overridden.
        </CardDescription>
        <div className="pt-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList variant="line">
              <TabsTrigger value="all">All ({rows.length})</TabsTrigger>
              <TabsTrigger value="chase">Chase ({rows.filter((r) => r.fit.verdict === "chase").length})</TabsTrigger>
              <TabsTrigger value="consider">
                Consider ({rows.filter((r) => r.fit.verdict === "consider").length})
              </TabsTrigger>
              <TabsTrigger value="pass">Pass ({rows.filter((r) => r.fit.verdict === "pass").length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-8" />
                <TableHead className="w-24">Verdict</TableHead>
                <TableHead>Request</TableHead>
                <TableHead className="w-28">Ceiling</TableHead>
                <TableHead className="w-24">Closes</TableHead>
                <TableHead className="w-20 text-right">Amend.</TableHead>
                <TableHead className="w-24 text-right">Effort</TableHead>
                <TableHead className="w-28">Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(({ opportunity: o, fit }) => {
                const isOpen = open === o.bidNumber;
                return (
                  <Fragment key={o.bidNumber}>
                    <TableRow className="cursor-pointer" onClick={() => setOpen(isOpen ? null : o.bidNumber)}>
                      <TableCell>
                        <ChevronDown
                          className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("rounded-sm px-1.5 py-0.5", verdictStyle[fit.verdict])}
                        >
                          {verdictLabel[fit.verdict]}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <div className="flex flex-col">
                          <span className="font-medium leading-snug">{o.title}</span>
                          <span className="text-muted-foreground text-xs">
                            {o.buyer} · <span className="font-mono">{o.bidNumber}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">{formatUsd(o.ceilingUsd)}</TableCell>
                      <TableCell className="font-mono text-xs tabular-nums">{o.closes}</TableCell>
                      <TableCell className="text-right tabular-nums">{o.amendments}</TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        ~{fit.effortHours} h
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-sm px-1.5 py-0.5",
                            (o.status === "closed" || o.status === "bid-to-po") && "bg-destructive/10 text-destructive",
                          )}
                        >
                          {statusLabel[o.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {isOpen ? (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell />
                        <TableCell colSpan={7} className="whitespace-normal">
                          <div className="grid grid-cols-1 gap-4 py-1 lg:grid-cols-12">
                            <div className="lg:col-span-7">
                              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Why</p>
                              <ul className="mt-1 flex flex-col gap-1 text-sm">
                                {fit.reasons.map((r) => (
                                  <li key={r} className="leading-snug">
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex flex-col gap-2 lg:col-span-5">
                              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                What the buyer wanted
                              </p>
                              <p className="text-sm leading-snug">{o.summary}</p>
                              {o.requiredAttachments ? (
                                <p className="text-muted-foreground text-xs">
                                  Required: {o.requiredAttachments.join("; ")}.
                                </p>
                              ) : null}
                              <div className="flex flex-wrap gap-2 pt-1">
                                <Button asChild size="sm" variant="outline">
                                  <a href={o.sourceUrl} target="_blank" rel="noreferrer">
                                    <ExternalLink data-icon="inline-start" />
                                    Open on COMMBUYS
                                  </a>
                                </Button>
                                <Button size="sm" onClick={() => detail.open(o.bidNumber)}>
                                  Full detail
                                </Button>
                                <Button size="sm" variant="outline" disabled>
                                  Override verdict
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
