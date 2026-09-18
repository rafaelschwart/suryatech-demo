"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Cable,
  ExternalLink,
  FileBarChart2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Sun,
} from "lucide-react";

import { useFleet } from "@/app/(main)/dashboard/_components/operations/use-fleet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMediaAvailable } from "@/hooks/use-media-available";
import { cn } from "@/lib/utils";

/*
 * Structure borrowed from the LifeLabs solar landing (Dribbble 25384446): a photo-led hero inside a
 * thin rounded frame, a light geometric headline, pill buttons, a three-photo collage, a solid
 * benefits band with white icon chips, an About card with big stats, a projects grid with a side
 * list, and an FAQ. Palette and voice are SuryaTech's: navy, gold, off-white, plain sentences.
 */

const display = { fontFamily: "var(--font-outfit), var(--font-geist), sans-serif" } as const;
const NAVY = "#14284B";
const INK = "#0E1A33";
const GOLD = "#F2A900";
const PAPER = "#F3F4F3";

const NAV = [
  ["#why", "Why SuryaTech"],
  ["#about", "About"],
  ["#sites", "Sites"],
  ["#day", "A day"],
  ["#faq", "Questions"],
] as const;

const BENEFITS = [
  { icon: Cable, text: "No trench, no transformer, no utility upgrade before the first session." },
  {
    icon: BatteryCharging,
    text: "The battery charges the car after dark and through a grey week.",
    more: "/dashboard/stations",
  },
  { icon: FileBarChart2, text: "Every session reported: kilowatt-hours, revenue, uptime, faults." },
  { icon: Landmark, text: "On the Massachusetts statewide contract VEH122, categories 1 and 4." },
] as const;

const STATS = [
  ["2", "patents", "Filed by the founder"],
  ["5", "people", "Engineering, supply chain, product, business"],
  ["6", "collaborations", "Accelerators and utilities"],
  ["2025", "VEH122", "Statewide contract vendor since October"],
] as const;

const SITES = [
  {
    id: "forecourt",
    label: "Fuel forecourt",
    place: "Lowell, Massachusetts",
    who: "Private site owner",
    img: "/media/site-commercial-v2.webp",
  },
  {
    id: "municipal",
    label: "Municipal lot",
    place: "Town hall, library, DPW",
    who: "Cities and towns",
    img: "/media/site-municipal-v2.webp",
  },
  { id: "park", label: "State park", place: "Reservations and beaches", who: "DCR", img: "/media/site-park-v2.webp" },
  {
    id: "transit",
    label: "Transit and park-and-ride",
    place: "Station lots and highway lots",
    who: "MBTA, MassDOT",
    img: "/media/login-infrastructure-v2.webp",
  },
] as const;

const DAY = [
  ["Morning", "The canopy fills the battery before the first car arrives."],
  ["Session", "The battery charges the car at DC speed, whatever the sky is doing."],
  ["Grid", "Backup only, when the battery is below reserve. Never the main feed."],
  ["Every session", "Reported: kilowatt-hours delivered, revenue, uptime, faults."],
] as const;

const FAQ = [
  [
    "Does it need a grid connection?",
    "No. The canopy and the battery carry the charging. A grid feed, where one exists, is backup for the battery reserve, not the main supply.",
  ],
  [
    "What happens on a cloudy week?",
    "The battery is sized to carry sessions through several dull days. When it reaches reserve, charging slows or the grid backup takes over, and the dashboard says so.",
  ],
  [
    "How fast does it charge?",
    "DC charging from the battery, so the speed does not depend on the feeder at the site. Exact rates depend on the unit configuration and the vehicle.",
  ],
  [
    "What does VEH122 mean for a town?",
    "Massachusetts buyers can order from the statewide contract without running their own procurement. Suryatech is a listed vendor for hardware, software, services, and operation and maintenance.",
  ],
  [
    "Who maintains it?",
    "Suryatech does, under category 4 of the contract. The unit reports its own faults; work orders run from report to resolution.",
  ],
] as const;

const TEAM = [
  ["Mayur Kamalakar, MSc", "Founder, principal engineer"],
  ["Gerber Ramos, PE, MSc", "Head of design and execution"],
  ["Rohan Mathew, MSc, MBA", "Head of supply chain"],
  ["Nimbe Oviosu, BSc", "Head of product development"],
  ["Anum Valliani, MSc", "Head of business development and operations"],
  ["Paul Rummel, MSc", "Advisor"],
] as const;

const HERO = "/media/landing-hero.webp";
const COLLAGE = ["/media/landing-canopy.webp", "/media/landing-cabinet.webp", "/media/landing-park.webp"] as const;
const COLLAGE_FALLBACK = [
  "/media/site-park-v2.webp",
  "/media/site-commercial-v2.webp",
  "/media/site-municipal-v2.webp",
] as const;

export function SiteLanding() {
  const { stations } = useFleet(4000);
  const lowell = stations?.find((s) => s.id === "ST-LOWELL-01") ?? null;
  const hasHero = useMediaAvailable(HERO);
  const hasCollage = [useMediaAvailable(COLLAGE[0]), useMediaAvailable(COLLAGE[1]), useMediaAvailable(COLLAGE[2])];
  const [site, setSite] = useState<(typeof SITES)[number]["id"]>("municipal");
  const active = SITES.find((s) => s.id === site) ?? SITES[1];

  return (
    <div className="min-h-dvh text-[#0D131A]" style={{ backgroundColor: PAPER }}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-white px-4 py-2 text-xs text-slate-600 md:px-8">
        <span>
          Draft of a new suryatechpower.com. Structure after a LifeLabs solar landing, look and voice SuryaTech's. Not
          published.
        </span>
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

      {/* Hero: photo inside a thin rounded frame, nav on top of the photo. */}
      <section id="top" className="p-3 md:p-4">
        <div
          className="relative min-h-[640px] overflow-hidden rounded-[28px] text-white lg:min-h-[760px]"
          style={{ backgroundColor: NAVY }}
        >
          {hasHero ? (
            <Image
              src={HERO}
              alt="A SuryaTech charger in a municipal lot at golden hour"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <Image
              src="/media/login-infrastructure-v2.webp"
              alt="A hybrid charger in a municipal lot at dawn"
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
              background: `linear-gradient(90deg, rgba(14,26,51,0.86) 0%, rgba(20,40,75,0.55) 55%, rgba(20,40,75,0.25) 100%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 rounded-[22px] border border-white/40 md:inset-6"
          />

          <div className="relative flex h-full min-h-[640px] flex-col lg:min-h-[760px]">
            <header className="flex items-center justify-between gap-4 px-8 pt-8 md:px-14 md:pt-12">
              <a href="#top" className="flex items-center gap-2" aria-label="SuryaTech home">
                <Bolt />
                <span className="text-lg tracking-tight" style={display}>
                  <span className="font-semibold">SURYA</span>
                  <span className="font-light text-white/80">TECH</span>
                </span>
              </a>
              <nav aria-label="Sections" className="hidden items-center gap-7 text-sm text-white/85 lg:flex">
                {NAV.map(([href, label]) => (
                  <a key={href} href={href} className="hover:text-white">
                    {label}
                  </a>
                ))}
              </nav>
              <a
                href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20assessment"
                className="rounded-full bg-white px-4 py-2 font-medium text-[#14284B] text-sm hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-white"
              >
                Request a site assessment
              </a>
            </header>

            <div className="grid flex-1 grid-cols-1 gap-10 px-8 py-12 md:px-14 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h1
                  className="max-w-[22ch] font-light text-[2.5rem] leading-[1.12] sm:text-5xl lg:text-[3.6rem]"
                  style={display}
                >
                  Charging that brings its own power. From the first site visit to the first session, one cabinet and
                  one team.
                </h1>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    prefetch={false}
                    href="/dashboard/stations?station=ST-LOWELL-01"
                    className="rounded-full bg-white px-5 py-3 font-medium text-[#14284B] text-sm hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    See the unit in 3D
                  </Link>
                  <a
                    href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20assessment"
                    className="rounded-full px-5 py-3 font-medium text-[#14284B] text-sm hover:brightness-105 focus-visible:outline-2 focus-visible:outline-white"
                    style={{ backgroundColor: GOLD }}
                  >
                    Request a site assessment
                  </a>
                </div>
              </div>

              <div className="relative hidden lg:col-span-5 lg:block">
                <div className="ml-auto grid w-[19rem] grid-cols-1 gap-3 xl:w-[22rem]">
                  {COLLAGE.map((src, i) => (
                    <div
                      key={src}
                      className={cn(
                        "relative aspect-[4/3] overflow-hidden rounded-xl border border-white/20 bg-black/20",
                        i === 1 && "-ml-10 xl:-ml-16",
                      )}
                    >
                      <Image
                        src={hasCollage[i] ? src : COLLAGE_FALLBACK[i]}
                        alt=""
                        fill
                        sizes="352px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 px-8 pb-8 md:px-14 md:pb-12">
              <a
                href="#why"
                className="inline-flex items-center gap-2 border-white/60 border-b pb-1 text-sm text-white/90 hover:text-white"
              >
                Scroll down
                <ArrowDown className="size-4" />
              </a>
              <div className="rounded-full bg-[#0E1A33]/80 px-3 py-1.5 text-xs text-white/85 backdrop-blur">
                Lowell unit now:{" "}
                {lowell
                  ? `${lowell.outputKw.toFixed(1)} kW to the car, ${lowell.pvKw.toFixed(1)} kW from the sun, battery ${lowell.batterySoc.toFixed(0)}%`
                  : "reading…"}
                <span className="ml-2 text-white/50">demo fleet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits band */}
      <section id="why" className="px-3 md:px-4">
        <ul
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] text-white sm:grid-cols-2 lg:grid-cols-4"
          style={{ backgroundColor: NAVY }}
        >
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li
                key={b.text}
                className="flex min-h-[220px] flex-col justify-end gap-4 px-8 py-8 md:px-10"
                style={{ backgroundColor: NAVY }}
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-white text-[#14284B]">
                  <Icon className="size-5" />
                </span>
                <p className="max-w-[26ch] text-white/90 leading-relaxed">{b.text}</p>
                {"more" in b ? (
                  <Link
                    prefetch={false}
                    href={b.more}
                    className="inline-flex w-fit items-center gap-2 border-white/60 border-b pb-0.5 text-sm text-white/90 hover:text-white"
                  >
                    See the unit
                    <ArrowRight className="size-4" />
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* About card with stats */}
      <section id="about" className="px-3 py-10 md:px-4 md:py-14">
        <div className="rounded-[28px] bg-white px-8 py-10 md:px-14 md:py-14">
          <div className="grid grid-cols-3 text-sm">
            <span>About</span>
            <span className="text-center">SuryaTech</span>
            <span className="text-right text-slate-500">Massachusetts, 2026</span>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="max-w-[24ch] font-light text-3xl leading-tight sm:text-4xl" style={display}>
                A solar canopy, a battery bay and DC fast charging in one cabinet, built for lots the grid does not
                reach.
              </p>
              <Link
                prefetch={false}
                href="/dashboard/stations?station=ST-LOWELL-01"
                className="mt-8 inline-flex items-center gap-3 border-[#0D131A] border-b pb-1 text-sm hover:opacity-70"
              >
                Learn more
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-6">
              {STATS.map(([n, unit, cap]) => (
                <div key={unit}>
                  <dt className="sr-only">{unit}</dt>
                  <dd>
                    <span className="text-5xl tabular-nums tracking-tight" style={display}>
                      {n}
                    </span>
                    <span className="ml-1 text-sm text-slate-600">{unit}</span>
                    <p className="mt-2 max-w-[22ch] text-slate-600 text-sm">{cap}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-14 flex items-start gap-3 text-slate-600 leading-relaxed">
            <Sun className="mt-1 size-4 shrink-0" style={{ color: GOLD }} />
            <span className="max-w-[90ch]">
              An affordable, best-in-class charging experience on renewable energy, built toward the Net-Zero 2050
              goals. From the company's mission statement.
            </span>
          </p>
        </div>
      </section>

      {/* Sites: side list + photo grid, one text tile */}
      <section id="sites" className="px-3 pb-10 md:px-4 md:pb-14">
        <div className="rounded-[28px] bg-white px-8 py-10 md:px-14 md:py-14">
          <div className="flex items-center justify-between text-sm">
            <span>Where it goes</span>
            <Link
              prefetch={false}
              href="/dashboard/operations"
              className="inline-flex items-center gap-1 hover:opacity-70"
            >
              See the map
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <ul className="flex flex-row flex-wrap gap-x-6 gap-y-3 lg:col-span-3 lg:flex-col lg:gap-y-5 lg:pt-16">
              {SITES.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSite(s.id)}
                    aria-pressed={s.id === site}
                    className={cn(
                      "text-left transition-colors",
                      s.id === site ? "font-medium text-2xl text-[#0D131A]" : "text-slate-500 hover:text-[#0D131A]",
                    )}
                    style={s.id === site ? display : undefined}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3 lg:col-span-9 lg:grid-cols-3">
              {SITES.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 transition-shadow",
                    i === 0 && "lg:col-span-2",
                    s.id === site && "ring-4 ring-[#F2A900]",
                  )}
                >
                  <Image
                    src={s.img}
                    alt={`${s.label}: ${s.place}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute right-2 bottom-2 rounded-sm bg-[#0E1A33]/80 px-2 py-1 text-[10px] text-white">
                    Illustration
                  </span>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-xl p-6 text-white" style={{ backgroundColor: NAVY }}>
                <p className="font-light text-2xl leading-tight" style={display}>
                  {active.label}
                </p>
                <p className="mt-2 text-white/80">{active.place}</p>
                <p className="mt-4 text-sm text-white/60">Buyer: {active.who}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A day: video left, statements right */}
      <section id="day" className="px-3 pb-10 md:px-4 md:pb-14">
        <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-[28px] bg-white lg:grid-cols-12">
          <div className="relative aspect-video lg:col-span-7 lg:aspect-auto lg:min-h-[480px]">
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
          <div className="flex flex-col justify-center px-8 py-10 lg:col-span-5 lg:px-12">
            <h2 className="font-light text-3xl leading-tight sm:text-4xl" style={display}>
              How a day runs.
            </h2>
            <dl className="mt-8 flex flex-col divide-y">
              {DAY.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4">
                  <dt className="font-medium" style={{ color: "#8a6100" }}>
                    {k}
                  </dt>
                  <dd className="text-slate-700 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-3 pb-10 md:px-4 md:pb-14">
        <div className="rounded-[28px] bg-white px-8 py-10 md:px-14 md:py-14">
          <h2
            className="mx-auto max-w-[30ch] text-center font-light text-3xl leading-tight sm:text-4xl"
            style={display}
          >
            What buyers ask before they order.
          </h2>
          <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="px-3 pb-10 md:px-4 md:pb-14">
        <div className="grid grid-cols-1 gap-10 rounded-[28px] bg-white px-8 py-10 md:px-14 md:py-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-light text-3xl leading-tight sm:text-4xl" style={display}>
              Six people, one unit.
            </h2>
            <p className="mt-4 max-w-[40ch] text-slate-600">
              Engineering, execution, supply chain, product and business development, with an advisor.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-7">
            {TEAM.map(([name, role]) => (
              <li key={name} className="border-t pt-4">
                <div className="font-medium">{name}</div>
                <div className="text-slate-600 text-sm">{role}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-3 pb-4 md:px-4">
        <div className="rounded-[28px] text-white" style={{ backgroundColor: INK }}>
          <div className="grid grid-cols-1 gap-10 px-8 py-12 md:grid-cols-12 md:px-14">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2">
                <Bolt />
                <span className="text-lg tracking-tight" style={display}>
                  <span className="font-semibold">SURYA</span>
                  <span className="font-light text-white/80">TECH</span>
                </span>
              </div>
              <p className="mt-4 max-w-[40ch] text-white/70 leading-relaxed">
                Suryatech EV Power LLC. Hybrid solar and battery EV charging, made in Massachusetts.
              </p>
              <ul className="mt-6 flex flex-col gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-white/50" />
                  <a href="mailto:mayur.kamalakar@suryatechpower.com" className="hover:underline">
                    mayur.kamalakar@suryatechpower.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-white/50" />
                  <a href="tel:+13392449464" className="hover:underline">
                    +1 (339) 244-9464
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-white/50" />
                  Boston, Massachusetts
                </li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h3 className="font-medium" style={{ color: GOLD }}>
                Follow
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
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
            <form className="md:col-span-3" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="landing-email" className="block font-medium" style={{ color: GOLD }}>
                Get updates
              </label>
              <p className="mt-1 text-white/60 text-xs">Form is a demo. Nothing is sent.</p>
              <div className="mt-3 flex gap-2">
                <input
                  id="landing-email"
                  type="email"
                  placeholder="you@town.gov"
                  className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[#F2A900]"
                />
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 font-medium text-[#14284B] text-sm hover:brightness-105"
                  style={{ backgroundColor: GOLD }}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          <div className="border-t border-white/10 px-8 py-4 text-center text-white/40 text-xs md:px-14">
            Draft prepared by Arqentia for review. Photographs and illustrations are renders, not deployed units.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Bolt() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full" style={{ backgroundColor: GOLD }}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" style={{ fill: NAVY }}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
      </svg>
    </span>
  );
}
