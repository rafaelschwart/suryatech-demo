"use client";

import { type ReactNode, useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { animate, stagger } from "animejs";
import { ArrowRight, Cable, Clock3, ExternalLink, Mail, MapPin, Phone, Zap } from "lucide-react";

import { AnimatedNumber, useScrollReveal } from "@/app/(main)/dashboard/_components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMediaAvailable } from "@/hooks/use-media-available";
import { cn } from "@/lib/utils";

import { OldModelDiagram, SystemDiagram } from "./system-diagram";

/*
 * Draft of a new suryatechpower.com. Section language after growmodo.com (read 2026-09-18):
 * paper surfaces, hairline rules, a mono eyebrow with a small square mark above every headline,
 * medium-weight display type with tight tracking, numbered steps, technical drawings on dotted
 * sheets with corner marks, a two-panel old-versus-new comparison, and a giant wordmark in the
 * footer. Palette is SuryaTech's: navy ink, one gold signal, paper. Type: Geist 500 for display,
 * Geist 400 body, JetBrains Mono for labels. Photographs and video are renders of the unit.
 */

const T = {
  paper: "#f5f3ec",
  paperSoft: "#faf8f2",
  paper2: "#edeae0",
  paper3: "#e2dfd5",
  ink: "#0e1a33",
  ink2: "#16213b",
  inkMute: "#4b5468",
  inkFade: "#8a8f9c",
  signal: "#F2A900",
  signalDeep: "#c98c00",
  beacon: "#14284B",
  rule: "rgba(14,26,51,0.10)",
  ruleStrong: "rgba(14,26,51,0.22)",
} as const;

const display = { fontFamily: "var(--font-geist), Geist, system-ui, sans-serif", letterSpacing: "-0.02em" } as const;
const mono = {
  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace",
  fontSize: "0.6875rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};

const HERO_VIDEO = "/media/hero-cinematic.mp4";
const HERO_POSTER = "/media/hero-cinematic-poster.jpg";
const HERO_FALLBACK_VIDEO = "/media/landing-hero.mp4";

const NAV = [
  ["#unit", "The unit"],
  ["#how", "How it works"],
  ["#sites", "Sites"],
  ["#questions", "Questions"],
] as const;

const LOTS = [
  "Fuel forecourts",
  "Municipal lots",
  "DCR reservations",
  "MBTA station lots",
  "MassDOT park-and-rides",
] as const;

const PROBLEMS = [
  {
    icon: Clock3,
    title: "The interconnection queue",
    copy: "A fast charger on the grid waits for the utility: an application, a study, a schedule that belongs to someone else.",
  },
  {
    icon: Cable,
    title: "Trenching and transformers",
    copy: "A pad for a transformer, conduit across the lot, a contractor for each. The charger is the cheapest line on the estimate.",
  },
  {
    icon: Zap,
    title: "Thin feeders where cars park",
    copy: "Parks, beaches and small town lots were wired for lights, not for fast charging. The feeder is the ceiling.",
  },
] as const;

const STEPS = [
  [
    "01",
    "Site visit",
    "One visit reads the sun, the shade and the traffic on the lot. You get a drawing and a quote, and a plain answer if the lot is wrong for it.",
  ],
  [
    "02",
    "Install",
    "A pad, a crane, a day. The canopy and the battery arrive with the cabinet. Nothing is trenched, nothing waits on the utility.",
  ],
  [
    "03",
    "First session",
    "The battery is charged from the canopy before the first car arrives. DC charging from day one, whatever the feeder can do.",
  ],
  [
    "04",
    "Operate",
    "Every session reported: kilowatt-hours, revenue, uptime, faults. Maintenance under category 4 of the statewide contract.",
  ],
] as const;

const SHOWCASE = [
  { img: "/media/landing-hero.webp", label: "Municipal lot", note: "Town hall, golden hour" },
  { img: "/media/landing-park.webp", label: "State park", note: "DCR reservation lot" },
  { img: "/media/site-commercial-v2.webp", label: "Fuel forecourt", note: "Lowell, private site" },
  { img: "/media/landing-canopy.webp", label: "Canopy", note: "Photovoltaic, tilted to the sun" },
] as const;

const BENEFITS = [
  ["No trench", "The pad is the only civil work."],
  ["Charges after dark", "The battery carries the evening and a grey week."],
  ["Every session reported", "Kilowatt-hours, revenue, uptime, faults, daily."],
  ["Maintained under VEH122", "Category 4: operation and maintenance, on the contract."],
] as const;

const NUMBERS = [
  ["2", "patents filed"],
  ["5", "people on the team"],
  ["6", "collaborations"],
  ["2025", "VEH122 vendor since"],
  ["$91,000", "MassCEC InnovateMass award"],
] as const;

const FAQ = [
  [
    "Does it need a grid connection?",
    "No. The canopy and the battery carry the charging. Where a feed exists it is backup for the battery reserve, not the main supply.",
  ],
  [
    "What happens on a cloudy week?",
    "The battery carries sessions through several dull days. At reserve, charging slows or the backup takes over, and the dashboard says so.",
  ],
  [
    "How fast does it charge?",
    "DC charging from the battery, so the rate does not depend on the feeder at the site. Exact rates depend on the unit configuration and the vehicle.",
  ],
  [
    "What does VEH122 mean for a town?",
    "Massachusetts buyers can order from the statewide contract without running their own procurement. Suryatech is listed for hardware, software, services, and operation and maintenance.",
  ],
  [
    "Who maintains it?",
    "Suryatech does, under category 4 of the contract. The unit reports its own faults; work orders run from report to resolution.",
  ],
] as const;

const TEAM = [
  ["Mayur Kamalakar, MSc", "Founder, principal engineer"],
  ["Gerber Ramos, PE, MSc", "Design and execution"],
  ["Rohan Mathew, MSc, MBA", "Supply chain"],
  ["Nimbe Oviosu, BSc", "Product development"],
  ["Anum Valliani, MSc", "Business development and operations"],
  ["Paul Rummel, MSc", "Advisor"],
] as const;

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{ ...mono, color: light ? "rgba(255,255,255,0.75)" : T.inkMute }}
    >
      <span
        aria-hidden="true"
        className="inline-block size-2.5 rounded-[2px]"
        style={{ backgroundColor: light ? T.signal : T.ink }}
      />
      {children}
    </span>
  );
}

function Corners({ light = false }: { light?: boolean }) {
  const c = light ? "rgba(255,255,255,0.6)" : T.ruleStrong;
  return (
    <>
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
        <span key={pos} aria-hidden="true" className={cn("pointer-events-none absolute size-3", pos)}>
          <span className="absolute top-1/2 left-0 h-px w-full" style={{ backgroundColor: c }} />
          <span className="absolute top-0 left-1/2 h-full w-px" style={{ backgroundColor: c }} />
        </span>
      ))}
    </>
  );
}

function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 md:px-10 lg:px-16", className)}>{children}</div>;
}

export function SiteLanding() {
  const hasCinematic = useMediaAvailable(HERO_VIDEO);
  const hasFallbackVideo = useMediaAvailable(HERO_FALLBACK_VIDEO);
  const hero = useRef<HTMLDivElement>(null);
  useScrollReveal();

  useEffect(() => {
    const el = hero.current;
    if (!el || reduced()) return;
    const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-hero]"));
    for (const p of parts) p.style.opacity = "0";
    const anim = animate(parts, {
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 800,
      delay: stagger(120, { start: 200 }),
      ease: "outQuart",
    });
    return () => {
      anim.cancel();
    };
  }, []);

  const videoSrc = hasCinematic ? HERO_VIDEO : hasFallbackVideo ? HERO_FALLBACK_VIDEO : null;

  return (
    <div
      className="min-h-dvh antialiased"
      style={{
        backgroundColor: T.paperSoft,
        color: T.ink,
        fontFamily: "var(--font-geist), Geist, system-ui, sans-serif",
        fontSize: "1rem",
        lineHeight: 1.55,
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-1.5 md:px-10"
        style={{ ...mono, borderColor: T.rule, color: T.inkMute, backgroundColor: T.paper2 }}
      >
        <span>Draft of a new suryatechpower.com · not published · photographs are renders of the unit</span>
        <a
          href="https://suryatechpower.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 hover:underline"
        >
          Current site
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Nav */}
      <header
        className="sticky top-0 z-20 border-b"
        style={{ borderColor: T.rule, backgroundColor: "rgba(250,248,242,0.92)", backdropFilter: "blur(6px)" }}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <a href="#top" aria-label="SuryaTech home" className="relative block h-7 w-36">
            <Image
              src="/media/suryatech-logo.png"
              alt="SuryaTech"
              fill
              sizes="144px"
              className="object-contain object-left"
            />
          </a>
          <nav
            aria-label="Sections"
            className="hidden items-center gap-7 text-[15px] lg:flex"
            style={{ color: T.inkMute }}
          >
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#0e1a33]">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              prefetch={false}
              href="/dashboard/stations?station=ST-LOWELL-01"
              className="hidden text-[15px] hover:underline md:inline"
              style={{ color: T.inkMute }}
            >
              See the unit in 3D
            </Link>
            <a
              href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20visit"
              className="rounded-[4px] px-4 py-2.5 font-medium text-[15px] text-white hover:brightness-110"
              style={{ backgroundColor: T.ink }}
            >
              Book a site visit
            </a>
          </div>
        </Container>
      </header>

      {/* Hero: text on paper, then the film strip */}
      <section id="top" ref={hero} className="pt-16 pb-10 md:pt-24">
        <Container className="flex flex-col items-center text-center">
          <div data-hero>
            <Eyebrow>For Massachusetts lots and fleets</Eyebrow>
          </div>
          <h1
            data-hero
            className="mt-5 max-w-[16ch] font-medium"
            style={{ ...display, fontSize: "clamp(2.75rem, 7vw, 6.75rem)", lineHeight: 0.98 }}
          >
            Power that arrives with the charger.
          </h1>
          <p
            data-hero
            className="mt-6 max-w-[58ch]"
            style={{ color: T.inkMute, fontSize: "1.375rem", lineHeight: 1.32, letterSpacing: "-0.005em" }}
          >
            A solar canopy, a battery bay and DC fast charging in one cabinet. Sited in a visit, installed in a day,
            running on the sun.
          </p>
          <div data-hero className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20visit"
              className="inline-flex items-center gap-2 rounded-[4px] px-5 py-3 font-medium text-white hover:brightness-110"
              style={{ backgroundColor: T.ink }}
            >
              Book a site visit
              <ArrowRight className="size-4" />
            </a>
            <span style={{ ...mono, color: T.inkMute }}>VEH122 · categories 1 and 4 · MBE</span>
          </div>
        </Container>
        <div data-hero className="mt-12 px-3 md:px-6">
          <div
            className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[8px] border"
            style={{ borderColor: T.ruleStrong, backgroundColor: T.ink, aspectRatio: "21/9" }}
          >
            {videoSrc ? (
              <video
                key={videoSrc}
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                poster={hasCinematic ? HERO_POSTER : "/media/landing-hero.webp"}
                autoPlay
                muted
                loop
                playsInline
                aria-label="A row of SuryaTech chargers in a municipal lot at blue hour"
              />
            ) : (
              <Image
                src="/media/landing-hero.webp"
                alt="A SuryaTech charger beside a brick town hall at golden hour"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            <span
              className="absolute bottom-3 left-3 rounded-[3px] px-2 py-1"
              style={{ ...mono, backgroundColor: "rgba(14,26,51,0.75)", color: "rgba(255,255,255,0.85)" }}
            >
              Municipal lot, Massachusetts · blue hour · concept render
            </span>
          </div>
        </div>
        <Container className="mt-8">
          <p className="text-center" style={{ ...mono, color: T.inkFade }}>
            The lots the statewide contract keeps asking for
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2" style={{ color: T.inkMute }}>
            {LOTS.map((l) => (
              <li key={l} className="text-[15px]">
                {l}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The problem, on ink */}
      <section id="problem" data-reveal className="text-white" style={{ backgroundColor: T.ink }}>
        <Container className="py-20 lg:py-24">
          <Eyebrow light>The problem</Eyebrow>
          <h2
            className="mt-4 max-w-[22ch] font-medium"
            style={{ ...display, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
          >
            The lot wants chargers. The grid says wait.
          </h2>
          <ul className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {PROBLEMS.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.title} className="border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                  <Icon className="size-5" style={{ color: T.signal }} />
                  <h3 className="mt-5 font-medium text-2xl" style={display}>
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-white/70">{p.copy}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Statement + comparison */}
      <section id="unit" data-reveal>
        <Container className="pt-20 lg:pt-28">
          <h2
            className="mx-auto max-w-[30ch] text-center font-medium"
            style={{ ...display, fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", lineHeight: 1.08 }}
          >
            More chargers is slow when the grid is the bottleneck. What works is bringing the power with the cabinet.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div
              className="relative overflow-hidden rounded-[8px] border p-7 md:p-9 lg:col-span-5"
              style={{ backgroundColor: T.paper2, borderColor: T.rule }}
            >
              <Corners />
              <span style={{ ...mono, color: T.inkMute }}>Old model</span>
              <h3 className="mt-4 font-medium" style={{ ...display, fontSize: "2rem", lineHeight: 1.12 }}>
                Feeder, transformer, trench, then the charger.
              </h3>
              <p className="mt-3 max-w-[40ch]" style={{ color: T.inkMute }}>
                Four parties, four permits, one estimate where the charger is the smallest line.
              </p>
              <OldModelDiagram className="mt-8 w-full" />
              <p className="mt-3" style={{ ...mono, color: T.inkMute }}>
                Each box is a party, a permit and a wait. The charger is the last one.
              </p>
            </div>
            <div
              className="relative min-h-[520px] overflow-hidden rounded-[8px] border lg:col-span-7"
              style={{ borderColor: T.rule }}
            >
              <Image
                src="/media/landing-park.webp"
                alt="A white car charging from the unit at a state park lot"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14,26,51,0.55) 0%, rgba(14,26,51,0.15) 45%, rgba(14,26,51,0.75) 100%)",
                }}
              />
              <Corners light />
              <div className="absolute inset-x-0 top-0 p-7 text-white md:p-9">
                <span style={{ ...mono, color: "rgba(255,255,255,0.8)" }}>New model</span>
                <h3
                  className="mt-4 max-w-[18ch] font-medium"
                  style={{ ...display, fontSize: "2rem", lineHeight: 1.12 }}
                >
                  Your lot, one cabinet, the sun.
                </h3>
                <p className="mt-3 max-w-[42ch] text-white/80">
                  The canopy makes the power, the battery holds it, the charger delivers it. One party, one pad, one
                  day.
                </p>
              </div>
              <div
                className="absolute inset-x-5 bottom-5 rounded-[6px] p-4 text-white md:inset-x-9 md:bottom-9"
                style={{ backgroundColor: "rgba(14,26,51,0.82)" }}
              >
                <div className="flex items-center justify-between" style={mono}>
                  <span>Session pipeline</span>
                  <span style={{ color: T.signal }}>Unit ST-LOWELL-01</span>
                </div>
                <ol className="mt-3 grid grid-cols-4 gap-2">
                  {["Site visit", "Install", "First session", "Operate"].map((s, i) => (
                    <li
                      key={s}
                      className="rounded-[4px] px-2.5 py-2"
                      style={{
                        ...mono,
                        backgroundColor: i === 2 ? T.signal : "rgba(255,255,255,0.08)",
                        color: i === 2 ? T.ink : "rgba(255,255,255,0.85)",
                        fontSize: "0.625rem",
                      }}
                    >
                      {s}
                      <span
                        className="mt-1.5 block h-0.5 w-full rounded-full"
                        style={{ backgroundColor: i < 2 ? T.signal : i === 2 ? T.ink : "rgba(255,255,255,0.25)" }}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works: drawing + numbered steps */}
      <section id="how" data-reveal>
        <Container className="pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2
              className="mt-4 max-w-[22ch] font-medium"
              style={{ ...display, fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", lineHeight: 1.08 }}
            >
              We site it once. Then it runs on the sun.
            </h2>
          </div>
          <div
            className="relative mt-12 overflow-hidden rounded-[8px] border"
            style={{ backgroundColor: T.paper2, borderColor: T.rule }}
          >
            <SystemDiagram className="block w-full" />
          </div>
          <ol className="mt-10 grid grid-cols-1 gap-8 border-t md:grid-cols-4" style={{ borderColor: T.ruleStrong }}>
            {STEPS.map(([n, title, copy], i) => (
              <li key={n} className="relative pt-7">
                <span
                  aria-hidden="true"
                  className="absolute top-[-1px] left-0 h-[2px]"
                  style={{ width: i < 2 ? "100%" : "0", backgroundColor: T.signal }}
                />
                <span className="font-medium text-3xl" style={{ ...display, color: i < 2 ? T.ink : T.inkFade }}>
                  {n}
                </span>
                <h3 className="mt-3 font-medium text-2xl" style={{ ...display, color: i < 2 ? T.ink : T.inkFade }}>
                  {title}
                </h3>
                <p className="mt-3 max-w-[34ch]" style={{ color: i < 2 ? T.inkMute : T.inkFade }}>
                  {copy}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Showcase */}
      <section id="sites" data-reveal className="border-t" style={{ borderColor: T.rule, backgroundColor: T.paper }}>
        <Container className="py-20 lg:py-24">
          <Eyebrow>Sites</Eyebrow>
          <h2
            className="mt-4 max-w-[24ch] font-medium"
            style={{ ...display, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
          >
            Built for the lots that ask for it.
          </h2>
          <ul className="mt-10 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {SHOWCASE.map((s) => (
              <li
                key={s.label}
                className="relative overflow-hidden rounded-[6px] border"
                style={{ borderColor: T.rule }}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={s.img}
                    alt={`${s.label}: ${s.note}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[4px] px-3 py-2"
                  style={{ backgroundColor: "rgba(14,26,51,0.8)", color: "#fff" }}
                >
                  <span className="font-medium text-sm">{s.label}</span>
                  <span style={{ ...mono, color: "rgba(255,255,255,0.7)", fontSize: "0.625rem" }}>{s.note}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            prefetch={false}
            href="/dashboard/operations"
            className="mt-8 inline-flex items-center gap-2 font-medium hover:underline"
            style={{ color: T.ink }}
          >
            See the demo fleet on the map
            <ArrowRight className="size-4" />
          </Link>
        </Container>
      </section>

      {/* Benefits */}
      <section data-reveal className="border-t" style={{ borderColor: T.rule }}>
        <Container className="py-20 lg:py-24">
          <Eyebrow>What changes</Eyebrow>
          <h2
            className="mt-4 max-w-[20ch] font-medium"
            style={{ ...display, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
          >
            More charging. Less waiting.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div
              className="relative min-h-[420px] overflow-hidden rounded-[8px] border lg:col-span-7"
              style={{ borderColor: T.rule }}
            >
              <Image
                src="/media/landing-hero.webp"
                alt="A SuryaTech charger beside a brick town hall at golden hour"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(14,26,51,0) 40%, rgba(14,26,51,0.8) 100%)" }}
              />
              <Corners light />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                <h3 className="max-w-[18ch] font-medium" style={{ ...display, fontSize: "2rem", lineHeight: 1.12 }}>
                  Run the lot. We keep the units running.
                </h3>
                <p className="mt-2 max-w-[44ch] text-white/80">
                  Faults become work orders, work orders become records. The town sees uptime, not tickets.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {BENEFITS.map(([title, copy]) => (
                <li
                  key={title}
                  className="rounded-[6px] border p-5"
                  style={{ borderColor: T.rule, backgroundColor: T.paper }}
                >
                  <span style={{ ...mono, color: T.inkMute }}>{title}</span>
                  <p className="mt-2" style={{ color: T.ink }}>
                    {copy}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Numbers */}
      <section
        aria-label="By the numbers"
        data-reveal
        className="border-t"
        style={{ borderColor: T.rule, backgroundColor: T.paper2 }}
      >
        <Container className="py-16 lg:py-20">
          <Eyebrow>On the record</Eyebrow>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
            {NUMBERS.map(([n, label]) => (
              <li key={label} className="border-t pt-4" style={{ borderColor: T.ruleStrong }}>
                <div
                  className="font-medium tabular-nums"
                  style={{ ...display, fontSize: "clamp(2.5rem, 4.5vw, 4rem)", lineHeight: 1 }}
                >
                  <AnimatedNumber value={n} />
                </div>
                <div className="mt-2" style={{ ...mono, color: T.inkMute }}>
                  {label}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Questions + team */}
      <section id="questions" data-reveal className="border-t" style={{ borderColor: T.rule }}>
        <Container className="grid grid-cols-1 gap-14 py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Eyebrow>Questions</Eyebrow>
            <h2
              className="mt-4 font-medium"
              style={{ ...display, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
            >
              What buyers ask before they order.
            </h2>
            <Accordion type="single" collapsible className="mt-8">
              {FAQ.map(([q, a]) => (
                <AccordionItem key={q} value={q} style={{ borderColor: T.rule }}>
                  <AccordionTrigger className="text-left text-[1.0625rem]">{q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed" style={{ color: T.inkMute }}>
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <Eyebrow>The team</Eyebrow>
            <ul className="mt-6 divide-y" style={{ borderColor: T.rule }}>
              {TEAM.map(([name, role]) => (
                <li
                  key={name}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 py-3"
                  style={{ borderColor: T.rule }}
                >
                  <span className="font-medium">{name}</span>
                  <span style={{ ...mono, color: T.inkMute }}>{role}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[44ch]" style={{ color: T.inkMute }}>
              An affordable, best-in-class charging experience on renewable energy, built toward the Net-Zero 2050
              goals. From the company's mission statement.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section data-reveal className="border-t" style={{ borderColor: T.rule, backgroundColor: T.paper }}>
        <Container className="flex flex-col items-center py-24 text-center lg:py-32">
          <h2
            className="max-w-[16ch] font-medium"
            style={{ ...display, fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", lineHeight: 1.02 }}
          >
            See it on your lot.
          </h2>
          <p className="mt-4 max-w-[48ch]" style={{ color: T.inkMute, fontSize: "1.125rem" }}>
            One visit, one drawing, one quote. If the lot is wrong for it, you will hear that first.
          </p>
          <a
            href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20visit"
            className="mt-8 inline-flex items-center gap-2 rounded-[4px] px-6 py-3.5 font-medium text-white hover:brightness-110"
            style={{ backgroundColor: T.ink }}
          >
            Book a site visit
            <ArrowRight className="size-4" />
          </a>
        </Container>
      </section>

      {/* Footer with the giant wordmark */}
      <footer id="contact" className="text-white" style={{ backgroundColor: T.ink }}>
        <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative h-7 w-40">
              <Image
                src="/media/suryatech-logo-light.png"
                alt="SuryaTech"
                fill
                sizes="160px"
                className="object-contain object-left"
              />
            </div>
            <p className="mt-5 max-w-[40ch] text-white/70">
              Suryatech EV Power LLC. Hybrid solar and battery EV charging, made in Massachusetts.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 text-white/85">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-white/45" />
                <a href="mailto:mayur.kamalakar@suryatechpower.com" className="hover:underline">
                  mayur.kamalakar@suryatechpower.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-white/45" />
                <a href="tel:+13392449464" className="hover:underline">
                  +1 (339) 244-9464
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-white/45" />
                Boston, Massachusetts
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <span style={{ ...mono, color: T.signal }}>Follow</span>
            <ul className="mt-3 flex flex-col gap-2 text-white/85">
              <li>
                <a
                  href="https://www.linkedin.com/company/surya-tech-evpower/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/suryatech_ev"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <form className="md:col-span-4" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="landing-email" style={{ ...mono, color: T.signal }}>
              Get updates
            </label>
            <p className="mt-1 text-[13px] text-white/55">Form is a demo. Nothing is sent.</p>
            <div className="mt-3 flex gap-2">
              <input
                id="landing-email"
                type="email"
                placeholder="you@town.gov"
                className="min-w-0 flex-1 rounded-[4px] border border-white/25 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[#F2A900]"
              />
              <button
                type="submit"
                className="rounded-[4px] px-4 py-2.5 font-medium hover:brightness-105"
                style={{ backgroundColor: T.signal, color: T.ink }}
              >
                Subscribe
              </button>
            </div>
          </form>
        </Container>
        <Container className="overflow-hidden pb-4">
          <div
            aria-hidden="true"
            className="select-none border-t pt-6 font-medium text-white/90"
            style={{
              ...display,
              fontSize: "clamp(4rem, 15.5vw, 15rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            SuryaTech
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-white/45" style={mono}>
            <span>Draft prepared by Arqentia for review</span>
            <span>Photographs and video are renders of the unit</span>
          </div>
        </Container>
      </footer>
    </div>
  );
}
