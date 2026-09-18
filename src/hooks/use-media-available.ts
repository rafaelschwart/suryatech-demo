"use client";

import { useEffect, useState } from "react";

const cache = new Map<string, boolean>();

/**
 * Whether a file under /public exists. Lets a screen light up a video loop, a diagram or a 3D model
 * the moment the asset is dropped into public/media, with no code change. Null while probing.
 */
export function useMediaAvailable(path: string): boolean | null {
  const [state, setState] = useState<boolean | null>(() => cache.get(path) ?? null);

  useEffect(() => {
    if (cache.has(path)) {
      setState(cache.get(path) ?? false);
      return;
    }
    let cancelled = false;
    fetch(path, { method: "HEAD", cache: "no-store" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        const ok = r.ok && !type.includes("text/html");
        cache.set(path, ok);
        if (!cancelled) setState(ok);
      })
      .catch(() => {
        cache.set(path, false);
        if (!cancelled) setState(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
