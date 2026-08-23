import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Calculators",
    links: [
      { label: "Time Card", href: "/time-card-calculator/" },
      { label: "Work Hours", href: "/work-hours-calculator/" },
      { label: "Hours Between", href: "/hours-between-times/" },
      { label: "Weekly Hours", href: "/weekly-hours-calculator/" },
      { label: "Overtime", href: "/overtime-hours-calculator/" },
    ],
  },
  {
    title: "Convert & pay",
    links: [
      { label: "Minutes → Decimal", href: "/conversions/minutes-to-decimal-hours/" },
      { label: "Decimal → Time", href: "/conversions/decimal-hours-to-time/" },
      { label: "Hourly → Salary", href: "/pay/hourly-to-salary/" },
      { label: "Salary → Hourly", href: "/pay/salary-to-hourly/" },
      { label: "Business Days", href: "/calendar/business-days-calculator/" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Methodology", href: "/calculation-methodology/" },
      { label: "Editorial policy", href: "/editorial-policy/" },
      { label: "Accessibility", href: "/accessibility/" },
      { label: "Privacy", href: "/privacy-policy/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Guides", href: "/guides/" },
      { label: "Terms", href: "/terms/" },
      { label: "Cookie policy", href: "/cookie-policy/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="cf-no-print mt-20 border-t border-[var(--border)]" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-[var(--text-secondary)]">{site.positioning}</p>
            <p className="text-xs text-[var(--text-muted)]">Runs in your browser. No account required.</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] transition-colors hover:text-accent-violet">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center">
          <p>© {site.name}. Estimates only — not tax, legal, or payroll advice.</p>
          <p>Made for people who’d rather not do time math by hand.</p>
        </div>
      </div>
    </footer>
  );
}
