"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ApiExchange {
  id: string;
  at: string;
  method: "GET" | "POST";
  path: string;
  requestBody?: unknown;
  status: number;
  latencyMs: number;
  responseBody: unknown;
}

export function ApiConsole({ exchanges }: { exchanges: ApiExchange[] }) {
  const latest = exchanges.find((e) => e.method === "POST") ?? exchanges[0];
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>API console</CardTitle>
        <CardDescription>The last command, as sent. Polls below.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {latest ? (
          <>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span
                className={cn(
                  "rounded-sm px-1.5 py-0.5 font-medium",
                  latest.method === "POST" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {latest.method}
              </span>
              <span className="truncate">{latest.path}</span>
              <span
                className={cn(
                  "ml-auto rounded-sm px-1.5 py-0.5",
                  latest.status < 300
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {latest.status}
              </span>
              <span className="text-muted-foreground tabular-nums">{latest.latencyMs} ms</span>
            </div>
            {latest.requestBody ? (
              <div>
                <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Request</p>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
                  {JSON.stringify(latest.requestBody, null, 2)}
                </pre>
              </div>
            ) : null}
            <div>
              <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Response</p>
              <ScrollArea className="h-56 rounded-md bg-muted">
                <pre className="p-3 font-mono text-xs leading-relaxed">
                  {JSON.stringify(latest.responseBody, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Waiting for the first read.</p>
        )}
        <div>
          <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Recent calls</p>
          <ul className="flex flex-col gap-1 font-mono text-xs">
            {exchanges.slice(0, 8).map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-16 tabular-nums">{new Date(e.at).toLocaleTimeString()}</span>
                <span className="w-10">{e.method}</span>
                <span className="truncate">{e.path}</span>
                <span className="ml-auto tabular-nums">{e.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
