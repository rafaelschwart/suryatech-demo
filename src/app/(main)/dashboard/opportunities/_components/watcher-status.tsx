"use client";

import { useState } from "react";

import { Globe, RefreshCw, ShieldOff } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { watcherQueries } from "@/data/opportunities";
import { deskFetch } from "@/lib/desk-api/client";

interface RunResult {
  ranAt: string;
  source: string;
  credentialsUsed: boolean;
  known: number;
  found: number;
  newBids: { bidNumber: string; buyer: string; title: string; closes: string }[];
  amendmentsChecked: number;
}

export function WatcherStatus() {
  const [simulateNew, setSimulateNew] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  async function run() {
    setRunning(true);
    try {
      const res = await deskFetch("/api/watcher/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulateNew }),
      });
      const data = (await res.json()) as RunResult;
      setResult(data);
      if (data.newBids.length > 0) {
        toast.warning(`${data.newBids.length} new VEH122 posting found`, {
          description: `${data.newBids[0].buyer}: closes ${data.newBids[0].closes}. Added to the board.`,
        });
      } else {
        toast.success("Search complete. No new postings.", {
          description: `${data.found} known bids re-checked, ${data.amendmentsChecked} open bids read for amendments.`,
        });
      }
    } catch {
      toast.error("The watcher could not reach the search.", { description: "Try again in a minute." });
    } finally {
      setRunning(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watcher</CardTitle>
        <CardDescription>Runs the COMMBUYS public search daily. Public postings only.</CardDescription>
        <CardAction>
          <Button size="sm" onClick={run} disabled={running}>
            <RefreshCw data-icon="inline-start" className={running ? "animate-spin" : undefined} />
            {running ? "Searching" : "Run search now"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Globe />
            Source: COMMBUYS public bid search
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <ShieldOff />
            No credentials
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            Schedule: daily 07:00, plus hourly on open bids
          </Badge>
          {result ? (
            <Badge variant="secondary" className="h-auto rounded-sm px-1.5 py-0.5 font-mono text-xs">
              Last run {new Date(result.ranAt).toLocaleTimeString()}
            </Badge>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Query variant</TableHead>
                <TableHead className="w-24 text-right">Matches</TableHead>
                <TableHead>Why it is needed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watcherQueries.map((q) => (
                <TableRow key={q.query}>
                  <TableCell className="font-mono text-xs">{q.query}</TableCell>
                  <TableCell className="text-right tabular-nums">{q.matches}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{q.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2">
          <Label htmlFor="simulate-new" className="text-muted-foreground text-xs">
            Simulate a new posting on the next run, to show the alert flow
          </Label>
          <Switch id="simulate-new" checked={simulateNew} onCheckedChange={setSimulateNew} />
        </div>

        {result?.newBids.length ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-sm">
            <p className="font-medium">New posting captured</p>
            {result.newBids.map((b) => (
              <p key={b.bidNumber} className="text-muted-foreground text-xs">
                <span className="font-mono">{b.bidNumber}</span> · {b.buyer} · closes {b.closes}
              </p>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
