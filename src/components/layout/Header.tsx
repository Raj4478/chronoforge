"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/cn";

const NAV: { label: string; href: string }[] = [
  { label: "Time Card", href: "/time-card-calculator/" },
  { label: "Work Hours", href: "/work-hours-calculator/" },
  { label: "Conversions", href: "/conversions/" },
  { label: "Pay", href: "/pay/" },
  { label: "Calendar", href: "/calendar/" },
  { label: "Freelance", href: "/freelance/" },
  { label: "Guides", href: "/guides/" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="cf-no-print sticky top-0 z-40 border-b border-[var(--border)] backdrop-blur-xl" style={{ background: "var(--surface)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-accent-violet/10 hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      <div className={cn("lg:hidden", open ? "block" : "hidden")}>
        <nav aria-label="Mobile" className="mx-auto grid max-w-6xl gap-1 px-4 pb-4 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-accent-violet/10 hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
