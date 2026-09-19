"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BatteryMedium, Box, Menu, Sun, X, Zap } from "lucide-react";

import styles from "./site-landing.module.css";

const navigation = [
  ["#system", "Our system"],
  ["#applications", "Applications"],
  ["#company", "Company"],
] as const;

export function LandingNavigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const navId = useId();
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className={styles.header}>
      <a className={styles.logo} href="#top" aria-label="SuryaTech home" onClick={() => setOpen(false)}>
        <Image src="/media/suryatech-logo.png" alt="SuryaTech" width={196} height={68} />
      </a>
      <nav className={styles.desktopNav} aria-label="Main navigation">
        {navigation.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className={styles.headerCta} href="#contact" onClick={() => setOpen(false)}>
        Let's talk <ArrowUpRight size={18} />
      </a>
      <button
        className={styles.menuToggle}
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={navId}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav id={navId} className={styles.mobileNav} aria-label="Mobile navigation" hidden={!open}>
        {navigation.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
            <ArrowUpRight size={18} />
          </a>
        ))}
        <a href="#questions" onClick={() => setOpen(false)}>
          Common questions <ArrowUpRight size={18} />
        </a>
        <a href="#contact" onClick={() => setOpen(false)}>
          Request a site assessment <ArrowUpRight size={18} />
        </a>
      </nav>
    </header>
  );
}

const components = [
  {
    title: "Solar generation",
    label: "Capture",
    icon: Sun,
    description:
      "Put the solar resource at your site to work. Generation is considered alongside available space, shade and the energy your vehicles need.",
    note: "The solar canopy",
    position: "solar",
  },
  {
    title: "Battery storage",
    label: "Store",
    icon: BatteryMedium,
    description:
      "Store energy at the site and make it available for charging. Battery capacity and operating reserve are sized around the site's demand and expected conditions.",
    note: "Integrated energy storage",
    position: "battery",
  },
  {
    title: "EV charging",
    label: "Charge",
    icon: Zap,
    description:
      "Deliver energy to the vehicles using the site. Charging equipment, connector requirements and power levels are defined as part of the project configuration.",
    note: "Vehicle connection",
    position: "charger",
  },
] as const;

export function SystemExplorer() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const active = components[selected];
  function moveTo(index: number) {
    setSelected(index);
    tabRefs.current[index]?.focus();
  }
  return (
    <div className={styles.systemExplorer}>
      <div className={styles.systemVisual}>
        <span className={styles.systemVisualLabel}>Hybrid charging concept</span>
        <div className={styles.modelImage}>
          <Image
            src="/media/charging-station-poster.png"
            alt="Concept rendering of a SuryaTech charger with solar canopy, battery cabinet and vehicle connector"
            fill
            sizes="(min-width: 800px) 400px, 85vw"
          />
          <span className={styles.modelCallout} data-part={active.position}>
            <span aria-hidden="true">0{selected + 1}</span>
            {active.note}
          </span>
        </div>
        <Link href="/dashboard/stations?station=ST-LOWELL-01" prefetch={false} className={styles.modelLink}>
          <Box size={18} /> Explore the interactive 3D concept <ArrowUpRight size={17} />
        </Link>
        <p className={styles.modelDisclaimer}>
          Concept rendering. Equipment and capacity are defined for each project.
        </p>
      </div>
      <div className={styles.systemContent}>
        <div
          role="tablist"
          aria-label="System components"
          aria-orientation="vertical"
          className={styles.systemTabs}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
              event.preventDefault();
              moveTo((selected + 1) % components.length);
            }
            if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
              event.preventDefault();
              moveTo((selected + components.length - 1) % components.length);
            }
            if (event.key === "Home") {
              event.preventDefault();
              moveTo(0);
            }
            if (event.key === "End") {
              event.preventDefault();
              moveTo(components.length - 1);
            }
          }}
        >
          {components.map((part, index) => (
            <button
              key={part.title}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${id}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
            >
              <span className={styles.tabNumber}>0{index + 1}</span>
              <part.icon size={24} />
              <span>{part.title}</span>
              <ArrowUpRight size={20} />
            </button>
          ))}
        </div>
        {components.map((part, index) => (
          <div
            key={part.title}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={selected !== index}
            tabIndex={0}
            className={styles.systemPanel}
          >
            <p className={styles.eyebrow}>{part.label} energy on site</p>
            <h3>
              {part.title}.<br />
              Part of a bigger picture.
            </h3>
            <p>{part.description}</p>
          </div>
        ))}
        <a href="#contact" className={styles.textLink}>
          Find the right configuration <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
