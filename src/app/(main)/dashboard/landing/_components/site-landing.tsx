"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { animate, stagger } from "animejs";
import { ArrowDown, ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { AnimatedNumber, useScrollReveal } from "@/app/(main)/dashboard/_components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMediaAvailable } from "@/hooks/use-media-available";
import { cn } from "@/lib/utils";

/*
 * Draft of a new suryatechpower.com. Register: brand. Color strategy: committed navy with one gold
 * accent on paper. Type: Barlow Condensed for display (industrial signage), Public Sans for body
 * (the civic typeface of the buyers who read this). Structure after the solar-industry sites
 * reviewed on 2026-09-18 (Terrasmart, Array Technologies, Nextpower): a full-bleed video hero with
 * a two-line uppercase headline, stacked photo rows, product tiles with one big word each, a
 * split video row, a navy numbers band, questions and team, navy footer. Every image is a render
 * of the unit made from the product cutout; the page says so.
 */

const display = {
  fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', 'Arial Narrow', sans-serif",
} as const;
const body = { fontFamily: "var(--font-public-sans), 'Public Sans', system-ui, sans-serif" } as const;

const NAVY = "#14284B";
const INK = "#0E1A33";
const GOLD = "#F2A900";
const PAPER = "#f6f5f1";
const SAND = "#f1ebe3";
const TEXT = "#1f2a2e";
const MUTED = "#5b5b5b";

const HERO_VIDEO = "/media/hero-cinematic.mp4";
const HERO_POSTER = "/media/hero-cinematic-poster.jpg";
const HERO_FALLBACK_VIDEO = "/media/landing-hero.mp4";
const HERO_FALLBACK_IMAGE = "/media/landing-hero.webp";

const NAV = [
  ["#work", "How it works"],
  ["#unit", "The unit"],
  ["#sites", "Sites"],
  ["#questions", "Questions"],
  ["#contact", "Contact"],
] as const;

const ROWS = [
  {
    id: "site",
    title: "Site",
    lead: "Where the grid is thin.",
    copy: "Municipal lots, park reservations, park-and-rides, forecourts. A site visit reads the sun, the shade and the traffic. Saying yes does not wait for a utility upgrade.",
    img: "/media/landing-hero.webp",
    alt: "A SuryaTech charger beside a brick town hall at golden hour",
  },
  {
    id: "install",
    title: "Install",
    lead: "A pad, a crane, a day.",
    copy: "No trench, no transformer, no new feeder. The canopy and the battery arrive with the cabinet, so the first session is days after delivery, not months after an interconnection.",
    img: "/media/landing-park.webp",
    alt: "A white car charging from the unit at a state park lot",
  },
  {
    id: "operate",
    title: "Operate",
    lead: "Every session reported.",
    copy: "Kilowatt-hours, revenue, uptime and faults, for every unit, every day. Maintenance runs under category 4 of the Massachusetts statewide contract, from report to resolution.",
    img: "/media/site-commercial-v2.webp",
    alt: "The unit on a commercial forecourt",
  },
] as const;

const TILES = [
  {
    id: "canopy",
    word: "Canopy",
    line: "Photovoltaic, tilted to the Massachusetts sun.",
    img: "/media/landing-canopy.webp",
  },
  { id: "bay", word: "Battery", line: "Stores the day. Charges after dark.", img: "/media/landing-cabinet.webp" },
  { id: "dc", word: "DC", line: "Fast charging from the battery, not the feeder.", img: "/media/landing-park.webp" },
] as const;

const DAY = [
  ["Morning", "The canopy fills the battery before the first car arrives."],
  ["Session", "The battery charges the car at DC speed, whatever the sky is doing."],
  ["Grid", "Backup only, when the battery is below reserve. Never the main feed."],
  ["Evening", "The day is reported: kilowatt-hours, revenue, uptime, faults."],
] as const;

const SITES = [
  { img: "/media/site-commercial-v2.webp", title: "Fuel forecourt", who: "Lowell, private site owner" },
  { img: "/media/site-municipal-v2.webp", title: "Municipal lot", who: "Cities and towns" },
  { img: "/media/site-park-v2.webp", title: "State park", who: "DCR, MassDOT, MBTA" },
] as const;

const NUMBERS = [
  ["2", "patents filed"],
  ["5", "people"],
  ["6", "collaborations"],
  ["2025", "VEH122 vendor"],
  ["$91,000", "MassCEC award"],
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

export function SiteLanding() {
  const hasCinematic = useMediaAvailable(HERO_VIDEO);
  const hasFallbackVideo = useMediaAvailable(HERO_FALLBACK_VIDEO);
  const hero = useRef<HTMLDivElement>(null);
  useScrollReveal();

  // One page-load sequence: headline lines, then the sentence, then the actions.
  useEffect(() => {
    const el = hero.current;
    if (!el || reduced()) return;
    const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-hero]"));
    for (const p of parts) p.style.opacity = "0";
    const anim = animate(parts, {
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 900,
      delay: stagger(140, { start: 250 }),
      ease: "outQuart",
    });
    return () => {
      anim.cancel();
    };
  }, []);

  const videoSrc = hasCinematic ? HERO_VIDEO : hasFallbackVideo ? HERO_FALLBACK_VIDEO : null;

  return (
    <div className="min-h-dvh" style={{ backgroundColor: PAPER, color: TEXT, ...body }}>
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-black/10 border-b bg-white px-4 py-1.5 text-[12px] md:px-8"
        style={{ color: MUTED }}
      >
        <span>Draft of a new suryatechpower.com, for review. Not published. Photographs are renders of the unit.</span>
        <a
          href="https://suryatechpower.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline-offset-2 hover:underline"
        >
          Current site
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Hero */}
      <section
        ref={hero}
        className="relative min-h-[640px] overflow-hidden text-white"
        style={{ backgroundColor: INK, height: "min(100svh, 920px)" }}
      >
        {videoSrc ? (
          <video
            key={videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={hasCinematic ? HERO_POSTER : HERO_FALLBACK_IMAGE}
            autoPlay
            muted
            loop
            playsInline
            aria-label="A row of SuryaTech chargers in a municipal lot at blue hour"
          />
        ) : (
          <Image
            src={HERO_FALLBACK_IMAGE}
            alt="A SuryaTech charger beside a brick town hall at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,26,51,0.55) 0%, rgba(14,26,51,0.05) 30%, rgba(14,26,51,0.15) 60%, rgba(14,26,51,0.85) 100%), linear-gradient(90deg, rgba(14,26,51,0.55) 0%, rgba(14,26,51,0) 60%)",
          }}
        />

        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-6 px-5 py-5 md:px-10">
          <a href="#top" aria-label="SuryaTech home" className="relative block h-7 w-36 md:h-8 md:w-44">
            <Image
              src="/media/suryatech-logo-light.png"
              alt="SuryaTech"
              fill
              sizes="176px"
              className="object-contain object-left"
            />
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-8 text-[15px] text-white/85 lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20assessment"
            className="rounded-sm px-4 py-2.5 font-semibold text-[15px] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-white"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            Request a site assessment
          </a>
        </header>

        <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-1 gap-8 px-5 pb-10 md:px-10 md:pb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <h1
              className="max-w-[14ch] font-bold uppercase leading-[0.92] tracking-[-0.01em]"
              style={{ ...display, fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              <span data-hero className="block">
                Power that arrives
              </span>
              <span data-hero className="block" style={{ color: GOLD }}>
                with the charger.
              </span>
            </h1>
            <p data-hero className="mt-6 max-w-[52ch] text-[1.0625rem] text-white/85 leading-relaxed md:text-lg">
              A solar canopy, a battery bay and DC fast charging in one cabinet, for the lots the grid does not reach.
            </p>
            <div data-hero className="mt-7 flex flex-wrap gap-3">
              <a
                href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20assessment"
                className="rounded-sm px-5 py-3 font-semibold hover:brightness-105 focus-visible:outline-2 focus-visible:outline-white"
                style={{ backgroundColor: GOLD, color: INK }}
              >
                Request a site assessment
              </a>
              <Link
                prefetch={false}
                href="/dashboard/stations?station=ST-LOWELL-01"
                className="inline-flex items-center gap-2 rounded-sm border border-white/60 px-5 py-3 font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                See the unit in 3D
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 text-[13px] text-white/70 lg:col-span-3 lg:flex-col lg:items-end">
            <span className="max-w-[26ch] lg:text-right">
              Municipal lot, Massachusetts, blue hour. Concept render of the unit.
            </span>
            <a href="#work" className="inline-flex items-center gap-2 text-white/85 hover:text-white">
              Scroll
              <ArrowDown className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Stacked photo rows */}
      <section id="work" className="flex flex-col">
        {ROWS.map((r, i) => (
          <article key={r.id} data-reveal className="relative grid min-h-[60vh] grid-cols-1 lg:grid-cols-12">
            <div className={cn("relative min-h-[320px] lg:col-span-8", i % 2 ? "lg:order-2" : "")}>
              <Image src={r.img} alt={r.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
              <span
                className="absolute right-3 bottom-3 rounded-sm px-2 py-1 text-[11px] text-white/80"
                style={{ backgroundColor: "rgba(14,26,51,0.7)" }}
              >
                Render
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col justify-center px-6 py-12 lg:col-span-4 lg:px-12",
                i % 2 ? "lg:order-1" : "",
              )}
              style={{ backgroundColor: i === 1 ? SAND : PAPER }}
            >
              <h2
                className="font-bold uppercase leading-none"
                style={{ ...display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: NAVY }}
              >
                {r.title}
              </h2>
              <p className="mt-4 font-semibold text-xl" style={{ color: TEXT }}>
                {r.lead}
              </p>
              <p className="mt-3 max-w-[46ch] leading-relaxed" style={{ color: MUTED }}>
                {r.copy}
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* Product tiles */}
      <section id="unit" data-reveal className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 lg:py-28">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <h2
              className="font-bold uppercase leading-[0.95] lg:col-span-7"
              style={{ ...display, fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              One cabinet. <span style={{ color: GOLD }}>Three machines.</span>
            </h2>
            <p className="max-w-[48ch] text-white/80 leading-relaxed lg:col-span-5">
              The canopy makes the power, the battery holds it, the charger delivers it. Nothing to trench, nothing to
              wait for from the utility.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {TILES.map((t, i) => (
              <li key={t.id} className={cn("relative overflow-hidden rounded-sm", i === 1 ? "md:mt-10" : "")}>
                <div className="relative aspect-[4/5]">
                  <Image
                    src={t.img}
                    alt={`${t.word}: ${t.line}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(14,26,51,0) 40%, rgba(14,26,51,0.9) 100%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3
                      className="font-bold uppercase leading-none"
                      style={{ ...display, fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
                    >
                      {t.word}
                    </h3>
                    <p className="mt-2 max-w-[30ch] text-white/85">{t.line}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Split video row */}
      <section id="day" data-reveal className="grid grid-cols-1 lg:grid-cols-12" style={{ backgroundColor: PAPER }}>
        <div className="relative aspect-video lg:col-span-7 lg:aspect-auto lg:min-h-[560px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/energy-flow-loop.mp4"
            poster="/media/energy-flow.webp"
            autoPlay
            muted
            loop
            playsInline
            aria-label="Energy moving from the solar panel to the battery to the charger to the car"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-14 lg:col-span-5 lg:px-14">
          <h2
            className="font-bold uppercase leading-none"
            style={{ ...display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: NAVY }}
          >
            How a day runs
          </h2>
          <dl className="mt-8 flex flex-col divide-y divide-black/10">
            {DAY.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                <dt className="font-semibold" style={{ color: NAVY }}>
                  {k}
                </dt>
                <dd className="leading-relaxed" style={{ color: MUTED }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            prefetch={false}
            href="/dashboard/stations?station=ST-LOWELL-01"
            className="mt-8 inline-flex w-fit items-center gap-2 font-semibold underline-offset-4 hover:underline"
            style={{ color: NAVY }}
          >
            Watch a station live in the demo
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Sites */}
      <section id="sites" data-reveal className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-bold uppercase leading-[0.95] lg:col-span-7"
            style={{ ...display, fontSize: "clamp(2.5rem, 5.5vw, 5rem)", color: NAVY }}
          >
            Built for Massachusetts lots.
          </h2>
          <p className="max-w-[48ch] leading-relaxed lg:col-span-5" style={{ color: MUTED }}>
            The public lots the statewide contract VEH122 keeps asking for. Suryatech is a listed vendor, categories 1
            and 4.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SITES.map((s) => (
            <li key={s.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={s.img}
                  alt={`${s.title}: ${s.who}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-bold text-2xl uppercase" style={{ ...display, color: NAVY }}>
                {s.title}
              </h3>
              <p style={{ color: MUTED }}>{s.who}</p>
            </li>
          ))}
        </ul>
        <Link
          prefetch={false}
          href="/dashboard/operations"
          className="mt-10 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          style={{ color: NAVY }}
        >
          See the demo fleet on the map
          <ArrowRight className="size-4" />
        </Link>
      </section>

      {/* Numbers band */}
      <section aria-label="By the numbers" data-reveal className="text-white" style={{ backgroundColor: INK }}>
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-8 gap-y-10 px-5 py-16 md:grid-cols-5 md:px-10">
          {NUMBERS.map(([n, label]) => (
            <li key={label}>
              <div
                className="font-bold tabular-nums leading-none"
                style={{ ...display, fontSize: "clamp(3rem, 5vw, 4.75rem)", color: GOLD }}
              >
                <AnimatedNumber value={n} />
              </div>
              <div className="mt-2 text-white/75">{label}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions and team */}
      <section
        id="questions"
        data-reveal
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 py-20 md:px-10 lg:grid-cols-12 lg:py-28"
      >
        <div className="lg:col-span-7">
          <h2
            className="font-bold uppercase leading-[0.95]"
            style={{ ...display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: NAVY }}
          >
            What buyers ask.
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-black/10">
                <AccordionTrigger className="text-left text-[1.0625rem]">{q}</AccordionTrigger>
                <AccordionContent className="leading-relaxed" style={{ color: MUTED }}>
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div id="team" className="lg:col-span-5 lg:pt-4">
          <h2
            className="font-bold uppercase leading-[0.95]"
            style={{ ...display, fontSize: "clamp(2rem, 3.5vw, 3rem)", color: NAVY }}
          >
            Six people, one unit.
          </h2>
          <ul className="mt-6 divide-y divide-black/10">
            {TEAM.map(([name, role]) => (
              <li key={name} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                <span className="font-semibold">{name}</span>
                <span style={{ color: MUTED }}>{role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[44ch] leading-relaxed" style={{ color: MUTED }}>
            An affordable, best-in-class charging experience on renewable energy, built toward the Net-Zero 2050 goals.
            From the company's mission statement.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-16 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <div className="relative h-8 w-44">
              <Image
                src="/media/suryatech-logo-light.png"
                alt="SuryaTech"
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </div>
            <p className="mt-5 max-w-[40ch] text-white/75 leading-relaxed">
              Suryatech EV Power LLC. Hybrid solar and battery EV charging, made in Massachusetts.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-white/50" />
                <a href="mailto:mayur.kamalakar@suryatechpower.com" className="hover:underline">
                  mayur.kamalakar@suryatechpower.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-white/50" />
                <a href="tel:+13392449464" className="hover:underline">
                  +1 (339) 244-9464
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-white/50" />
                Boston, Massachusetts
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-bold text-xl uppercase" style={{ ...display, color: GOLD }}>
              Follow
            </h3>
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
            <label
              htmlFor="landing-email"
              className="block font-bold text-xl uppercase"
              style={{ ...display, color: GOLD }}
            >
              Get updates
            </label>
            <p className="mt-1 text-[13px] text-white/60">Form is a demo. Nothing is sent.</p>
            <div className="mt-3 flex gap-2">
              <input
                id="landing-email"
                type="email"
                placeholder="you@town.gov"
                className="min-w-0 flex-1 rounded-sm border border-white/25 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[#F2A900]"
              />
              <button
                type="submit"
                className="rounded-sm px-4 py-2.5 font-semibold hover:brightness-105"
                style={{ backgroundColor: GOLD, color: INK }}
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
        <div className="border-white/10 border-t px-5 py-4 text-center text-[12px] text-white/45 md:px-10">
          Draft prepared by Arqentia for review. Photographs and video are renders of the unit, not deployed
          installations.
        </div>
      </footer>
    </div>
  );
}
