"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { useMediaAvailable } from "@/hooks/use-media-available";
import { cn } from "@/lib/utils";

interface OptionalIllustrationProps {
  src: string;
  alt: string;
  caption?: string;
  aspect?: "16/9" | "21/9" | "3/2";
  className?: string;
}

/**
 * Renders a Higgsfield illustration only once the file exists in public/media. Until then it renders
 * nothing, so a screen never shows a broken image while an asset is still being generated.
 */
export function OptionalIllustration({ src, alt, caption, aspect = "16/9", className }: OptionalIllustrationProps) {
  const available = useMediaAvailable(src);
  if (!available) return null;
  return (
    <figure className={cn("overflow-hidden rounded-xl border bg-white text-card-foreground", className)}>
      <div
        className={cn(
          "relative w-full",
          aspect === "21/9" && "aspect-[21/9]",
          aspect === "16/9" && "aspect-video",
          aspect === "3/2" && "aspect-[3/2]",
        )}
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 1280px) 1100px, 100vw" className="object-cover" />
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t bg-card px-4 py-2 text-muted-foreground text-xs">
        <span>{caption ?? alt}</span>
        <Badge
          variant="secondary"
          className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-amber-700 dark:text-amber-300"
        >
          Illustration
        </Badge>
      </figcaption>
    </figure>
  );
}
