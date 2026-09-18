import { CalendarClock, FileText, ListChecks, MessageSquareText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AmendmentEvent } from "@/data/opportunities";
import { cn } from "@/lib/utils";

const kindMeta: Record<AmendmentEvent["kind"], { icon: typeof FileText; label: string; className: string }> = {
  "date-change": { icon: CalendarClock, label: "Date moved", className: "text-destructive" },
  criteria: { icon: ListChecks, label: "Criteria changed", className: "text-amber-600 dark:text-amber-400" },
  attachment: { icon: FileText, label: "File replaced", className: "text-muted-foreground" },
  qa: { icon: MessageSquareText, label: "Q and A", className: "text-muted-foreground" },
};

export function AmendmentFeed({ events }: { events: AmendmentEvent[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Amendments, MAPC</CardTitle>
        <CardDescription>
          Seven changes in six weeks. The evaluation criteria arrived two weeks after the original due date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-3">
          {events.map((e) => {
            const meta = kindMeta[e.kind];
            const Icon = meta.icon;
            return (
              <li key={`${e.date}-${e.text}`} className="flex gap-3">
                <Icon className={cn("mt-0.5 size-4 shrink-0", meta.className)} />
                <div className="min-w-0">
                  <p className="font-mono text-muted-foreground text-xs">
                    {e.date} · {meta.label}
                  </p>
                  <p className="text-sm leading-snug">{e.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
