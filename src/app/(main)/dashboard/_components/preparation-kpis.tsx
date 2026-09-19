import { AnimatedNumber } from "@/app/(main)/dashboard/_components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PreparationKpisProps {
  sdpDaysLeft: number;
  sdpDue: string;
  sdpQuarter: string;
  seen: number;
  awarded: number;
  chase: number;
  contractDaysLeft: number;
}

export function PreparationKpis({
  sdpDaysLeft,
  sdpDue,
  sdpQuarter,
  seen,
  awarded,
  chase,
  contractDaysLeft,
}: PreparationKpisProps) {
  const sdpTone = sdpDaysLeft <= 14 ? "critical" : sdpDaysLeft <= 45 ? "warning" : "ok";
  const years = (contractDaysLeft / 365).toFixed(1);

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Kpi
          title="Next filing"
          value={`${sdpDaysLeft} days`}
          sub={`SDP spending report, ${sdpQuarter}. Due ${sdpDue}.`}
          badge={sdpTone === "critical" ? "Overdue soon" : sdpTone === "warning" ? "In window" : "Scheduled"}
          tone={sdpTone}
          className="border-b md:border-r"
        />
        <Kpi
          title="VEH122 requests seen"
          value={String(seen)}
          sub={`${awarded} awarded to others. None answered.`}
          badge={`${awarded} awarded`}
          tone="warning"
          className="border-b xl:border-r"
        />
        <Kpi
          title="Worth chasing"
          value={String(chase)}
          sub="Marked as a fit by the triage rules."
          badge="Chase"
          tone="ok"
          className="border-b md:border-r xl:border-b-0"
        />
        <Kpi
          title="Contract runs"
          value={`${years} yrs`}
          sub="VEH122 runs to September 2033."
          badge="To 2033"
          tone="neutral"
        />
      </div>
    </div>
  );
}

function Kpi({
  title,
  value,
  sub,
  badge,
  tone,
  className,
}: {
  title: string;
  value: string;
  sub: string;
  badge: string;
  tone: "critical" | "warning" | "ok" | "neutral";
  className?: string;
}) {
  return (
    <Card className={cn("gap-4 overflow-hidden rounded-none border-0 border-foreground/10 ring-0", className)}>
      <CardHeader>
        <CardTitle className="font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-3xl tabular-nums leading-none tracking-tight">
            <AnimatedNumber value={value} />
          </div>
          <p className="text-muted-foreground text-xs">{sub}</p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0",
            tone === "critical" && "bg-destructive/10 text-destructive",
            tone === "warning" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
            tone === "ok" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {badge}
        </Badge>
      </CardContent>
    </Card>
  );
}
