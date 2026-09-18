"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { useFleet } from "@/app/(main)/dashboard/_components/operations/use-fleet";

const display = { fontFamily: "var(--font-outfit), var(--font-geist), sans-serif" } as const;

const NAVY = "#14284B";
const INK = "#0E1A33";
const GOLD = "#F2A900";

const NAV = [
  ["#unit", "The unit"],
  ["#sites", "Where it goes"],
  ["#day", "How a day runs"],
  ["#team", "Team"],
  ["#contact", "Contact"],
] as const;

const FEATURES = [
  {
    id: "solar",
    title: "Solar-powered functionality",
    body: "The canopy charges the battery all day. What the sun makes is stored, so a car charges at full speed after dark and on a grey week.",
    img: "/media/energy-flow.webp",
    alt: "Isometric diagram of sun to battery to charger to car",
    contain: false,
  },
  {
    id: "storage",
    title: "Integrated battery storage",
    body: "Stored power can go back to the grid at peak demand, or hold a lot's charging through an outage. The unit stands where three-phase service does not reach.",
    img: "/media/login-infrastructure-v2.webp",
    alt: "A hybrid charger in a municipal lot at dawn",
    contain: false,
  },
  {
    id: "fast",
    title: "Ultra-fast charging",
    body: "DC charging from the battery, not from a thin feeder. Shorter stops for fleets and visitors, and no wait for a utility upgrade before the first session.",
    img: "/media/charger-cutout.webp",
    alt: "SuryaTech hybrid solar and battery charger, product cutout",
    contain: true,
  },
];

const SITES = [
  {
    img: "/media/site-commercial-v2.webp",
    title: "Fuel forecourt",
    place: "Lowell, Massachusetts",
    who: "Private site owner",
  },
  {
    img: "/media/site-municipal-v2.webp",
    title: "Municipal lot",
    place: "Town hall, library, DPW",
    who: "Cities and towns",
  },
  {
    img: "/media/site-park-v2.webp",
    title: "State park",
    place: "Reservations and beaches",
    who: "DCR, MassDOT, MBTA",
  },
];

const DAY = [
  ["Morning", "The canopy fills the battery before the first car arrives."],
  ["Session", "The battery charges the car at DC speed, whatever the sky is doing."],
  ["Grid", "Backup only, when the battery is below reserve. Never the main feed."],
  ["Every session", "Reported: kilowatt-hours delivered, revenue, uptime, faults."],
] as const;

const TEAM = [
  ["Mayur Kamalakar, MSc", "Founder, principal engineer"],
  ["Gerber Ramos, PE, MSc", "Head of design and execution"],
  ["Rohan Mathew, MSc, MBA", "Head of supply chain"],
  ["Nimbe Oviosu, BSc", "Head of product development"],
  ["Anum Valliani, MSc", "Head of business development and operations"],
  ["Paul Rummel, MSc", "Advisor"],
] as const;

const NUMBERS = [
  ["2", "patents filed"],
  ["5", "people on the team"],
  ["6", "collaborations"],
  ["2025", "VEH122 statewide contract vendor"],
  ["$91,000", "MassCEC InnovateMass award"],
] as const;

/**
 * A draft of a new suryatechpower.com, built from what the current site says and shows, with the
 * same navy and gold and a stronger opening. Lives inside the dashboard so it can be reviewed
 * beside the product it describes. Nothing here is published.
 */
export function SiteLanding() {
  const { stations } = useFleet(4000);
  const lowell = stations?.find((s) => s.id === "ST-LOWELL-01") ?? null;

  return (
    <div className="min-h-dvh bg-[#F6F7F9] text-[#0D131A]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-white px-4 py-2 text-xs text-slate-600 md:px-8">
        <span>Draft of a new suryatechpower.com, built from the current site. Not published.</span>
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

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#14284B] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-2" aria-label="SuryaTech home">
            <Bolt />
            <span className="text-lg tracking-tight" style={display}>
              <span className="font-semibold">SURYA</span>
              <span className="font-normal text-white/70">TECH</span>
            </span>
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20assessment"
            className="rounded-md bg-[#F2A900] px-3.5 py-2 font-medium text-[#14284B] text-sm hover:bg-[#ffb81c] focus-visible:outline-2 focus-visible:outline-white"
          >
            Request a site assessment
          </a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden text-white" style={{ backgroundColor: NAVY }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 70% at 78% 40%, rgba(242,169,0,0.18), transparent 60%), linear-gradient(180deg, ${NAVY} 0%, ${INK} 100%)`,
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-14 pb-12 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-16">
          <div className="flex flex-col justify-center lg:col-span-6">
            <h1
              className="max-w-[12ch] text-[2.75rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]"
              style={display}
            >
              Charging that brings its own power.
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-white/80 leading-relaxed">
              A solar canopy, a battery bay and DC fast charging in one cabinet. It goes where the grid is thin: park
              lots, town halls, park-and-rides, forecourts. No trench, no transformer, no waiting on a utility upgrade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:mayur.kamalakar@suryatechpower.com?subject=Site%20assessment"
                className="rounded-md bg-[#F2A900] px-5 py-3 font-medium text-[#14284B] hover:bg-[#ffb81c] focus-visible:outline-2 focus-visible:outline-white"
              >
                Request a site assessment
              </a>
              <Link
                prefetch={false}
                href="/dashboard/stations?station=ST-LOWELL-01"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-5 py-3 font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                See the unit in 3D
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-white/15 pt-6 text-sm sm:grid-cols-3">
              <Fact k="One cabinet" v="Solar, battery and DC charging together" />
              <Fact k="Massachusetts" v="Statewide contract VEH122, categories 1 and 4" />
              <Fact k="Certified" v="Minority business enterprise, founded 2022" />
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
              style={{ boxShadow: `0 0 0 1px rgba(242,169,0,0.25), 0 40px 90px -40px rgba(0,0,0,0.8)` }}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/media/charger-loop.mp4"
                poster="/media/charger-cutout.webp"
                autoPlay
                muted
                loop
                playsInline
                aria-label="The SuryaTech charger under a slow light sweep"
              />
              <div className="absolute right-3 bottom-3 left-3 rounded-lg bg-[#0E1A33]/85 px-3 py-2.5 text-xs backdrop-blur">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-white/90">Lowell unit, now</span>
                  <span className="text-[10px] text-white/50">demo fleet, simulated</span>
                </div>
                <div className="mt-1 grid grid-cols-3 gap-2 text-white">
                  <Reading label="to the car" value={lowell ? `${lowell.outputKw.toFixed(1)} kW` : "—"} />
                  <Reading label="from the sun" value={lowell ? `${lowell.pvKw.toFixed(1)} kW` : "—"} />
                  <Reading label="battery" value={lowell ? `${lowell.batterySoc.toFixed(0)}%` : "—"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="unit" className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-24">
        <h2 className="max-w-[20ch] text-3xl leading-tight tracking-tight sm:text-4xl" style={display}>
          Three things in one cabinet.
        </h2>
        <p className="mt-3 max-w-[60ch] text-slate-600">
          The current site says these three things. They are still the right three. Here they stand next to the unit
          that does them.
        </p>
        <div className="mt-12 flex flex-col gap-16">
          {FEATURES.map((f, i) => (
            <article
              key={f.id}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-7">
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-2xl border ${
                    f.contain ? "bg-[#14284B]" : "bg-white"
                  }`}
                >
                  <Image
                    src={f.img}
                    alt={f.alt}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className={f.contain ? "object-contain p-8" : "object-cover"}
                  />
                  <span className="absolute right-3 bottom-3 rounded-sm bg-[#0E1A33]/80 px-2 py-1 text-[10px] text-white">
                    Illustration
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: GOLD }} />
                <h3 className="mt-4 text-2xl leading-tight tracking-tight sm:text-3xl" style={display}>
                  {f.title}
                </h3>
                <p className="mt-3 max-w-[48ch] text-slate-600 leading-relaxed">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="sites" className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-[20ch] text-3xl leading-tight tracking-tight sm:text-4xl" style={display}>
              Where it goes.
            </h2>
            <p className="max-w-[46ch] text-slate-600">
              Public lots Massachusetts buyers have already asked for through the statewide contract.
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SITES.map((s) => (
              <li key={s.title} className="overflow-hidden rounded-2xl border bg-[#F6F7F9]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={s.img}
                    alt={`${s.title}: ${s.place}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute right-3 bottom-3 rounded-sm bg-[#0E1A33]/80 px-2 py-1 text-[10px] text-white">
                    Illustration
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl tracking-tight" style={display}>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-slate-600 text-sm">{s.place}</p>
                  <p className="mt-3 text-slate-500 text-xs">Buyer: {s.who}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="day" className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 md:px-8 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white">
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
          </div>
          <div className="flex flex-col justify-center lg:col-span-5">
            <h2 className="max-w-[16ch] text-3xl leading-tight tracking-tight sm:text-4xl" style={display}>
              How a day runs.
            </h2>
            <dl className="mt-8 flex flex-col divide-y divide-white/10">
              {DAY.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4">
                  <dt className="font-medium" style={{ color: GOLD }}>
                    {k}
                  </dt>
                  <dd className="text-white/80 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-label="By the numbers" className="text-white" style={{ backgroundColor: INK }}>
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-12 md:grid-cols-5 md:px-8">
          {NUMBERS.map(([n, label]) => (
            <li key={label}>
              <div className="text-4xl tabular-nums tracking-tight" style={{ ...display, color: GOLD }}>
                {n}
              </div>
              <div className="mt-1 text-sm text-white/70">{label}</div>
            </li>
          ))}
        </ul>
      </section>

      <section id="team" className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl leading-tight tracking-tight sm:text-4xl" style={display}>
              Six people, one unit.
            </h2>
            <blockquote
              className="mt-6 max-w-[44ch] border-l-4 pl-4 text-slate-700 leading-relaxed"
              style={{ borderColor: GOLD }}
            >
              An affordable, best-in-class charging experience on renewable energy, built toward the Net-Zero 2050
              goals.
            </blockquote>
            <p className="mt-3 text-slate-500 text-xs">From the company's mission statement.</p>
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

      <footer id="contact" className="text-white" style={{ backgroundColor: INK }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-12 md:px-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <Bolt />
              <span className="text-lg tracking-tight" style={display}>
                <span className="font-semibold">SURYA</span>
                <span className="font-normal text-white/70">TECH</span>
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
          <form
            className="md:col-span-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="landing-email" className="block font-medium" style={{ color: GOLD }}>
              Get updates
            </label>
            <p className="mt-1 text-white/60 text-xs">Form is a demo. Nothing is sent.</p>
            <div className="mt-3 flex gap-2">
              <input
                id="landing-email"
                type="email"
                placeholder="you@town.gov"
                className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[#F2A900]"
              />
              <button
                type="submit"
                className="rounded-md bg-[#F2A900] px-3 py-2 font-medium text-[#14284B] text-sm hover:bg-[#ffb81c]"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-white/40 text-xs md:px-8">
          Draft prepared by Arqentia for review. Illustrations are renders, not photographs of deployed units.
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

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-medium text-white">{k}</dt>
      <dd className="mt-0.5 text-white/65">{v}</dd>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-medium text-base tabular-nums leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] text-white/60">{label}</div>
    </div>
  );
}
