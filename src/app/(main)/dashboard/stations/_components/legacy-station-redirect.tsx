"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LegacyStationRedirect() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.hash === "#controls") params.set("view", "controls");
    router.replace(`/dashboard/operations?${params.toString()}#station-details`);
  }, [router]);
  return (
    <p className="text-sm text-muted-foreground">
      Opening the station workspace.{" "}
      <Link className="underline" href="/dashboard/operations">
        Continue to Stations &amp; map
      </Link>
    </p>
  );
}
