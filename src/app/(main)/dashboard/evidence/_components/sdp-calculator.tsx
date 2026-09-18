import { CalendarClock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { COMPANY } from "@/data/company";

interface SdpCalculatorProps {
  currentLabel: string;
  currentDue: string;
  currentDays: number;
  previousLabel: string;
  previousDue: string;
  previousDaysAgo: number;
}

export function SdpCalculator({
  currentLabel,
  currentDue,
  currentDays,
  previousLabel,
  previousDue,
  previousDaysAgo,
}: SdpCalculatorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SDP report clock</CardTitle>
        <CardDescription>Quarters end Sep 30, Dec 31, Mar 31, Jun 30. Report due 45 days later.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wider">Current quarter</p>
          <p className="mt-1 font-medium">{currentLabel}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl tabular-nums leading-none tracking-tight">{currentDays}</span>
            <span className="pb-1 text-muted-foreground text-sm">days to file</span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm">
            <CalendarClock className="size-4 text-muted-foreground" />
            Due {currentDue}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider">Previous quarter</p>
          <p className="mt-1 font-medium">{previousLabel}</p>
          <p className="text-muted-foreground text-sm">
            Was due {previousDue}, {previousDaysAgo} days ago. Whether it went out is a Discovery question.
          </p>
        </div>
        <Separator className="md:hidden" />
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm md:grid-cols-1 md:gap-y-1 md:border-l md:pl-4">
          <dt className="text-muted-foreground">Commitment</dt>
          <dd className="font-medium tabular-nums">{COMPANY.sdpCommitmentPct}% of contract sales</dd>
          <dt className="text-muted-foreground">Sent to</dt>
          <dd className="font-medium">Commonwealth Contract Manager</dd>
          <dt className="text-muted-foreground">Fields</dt>
          <dd className="font-medium">Quarterly sales, spend per certified partner, YTD check, explanation if short</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
