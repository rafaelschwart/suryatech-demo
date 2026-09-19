"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

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
