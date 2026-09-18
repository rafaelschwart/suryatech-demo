"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

/**
 * Client-side redirect that also works from a static host: the exported HTML carries a meta refresh,
 * and the router replaces the URL as soon as the app is interactive.
 */
export function ClientRedirect({ to, label = "Opening the Response Desk…" }: { to: string; label?: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <p className="p-6 text-muted-foreground text-sm">{label}</p>
    </>
  );
}
