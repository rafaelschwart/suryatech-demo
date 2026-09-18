"use client";

import Image from "next/image";

import { useMediaAvailable } from "@/hooks/use-media-available";

const HERO = "/media/login-hero.webp";
const LOOP = "/media/charger-loop.mp4";

/**
 * The login side panel. Navy with the wordmark until a Higgsfield hero exists in public/media,
 * then the dawn render with the copy over it; the charger loop plays behind it when present.
 */
export function LoginHero() {
  const hasHero = useMediaAvailable(HERO);
  const hasLoop = useMediaAvailable(LOOP);

  return (
    <div className="relative hidden overflow-hidden bg-primary lg:block lg:w-1/3">
      {hasHero ? <Image src={HERO} alt="" fill priority sizes="33vw" className="object-cover" /> : null}
      {hasLoop ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src={LOOP}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A33]/90 via-[#0E1A33]/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
        <div className="flex items-center gap-2 text-2xl tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#F2A900]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-[#14284B]">
              <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
            </svg>
          </span>
          <span>
            <span className="font-bold">SURYA</span>
            <span className="font-medium opacity-70">TECH</span>
          </span>
        </div>
        <div className="space-y-3">
          <h1 className="font-light text-4xl leading-tight">The request is the product.</h1>
          <p className="max-w-sm text-primary-foreground/80">
            Every VEH122 posting, the day it appears. Every response, assembled from what you already have. Every
            filing, on the board before it is due.
          </p>
        </div>
      </div>
    </div>
  );
}
