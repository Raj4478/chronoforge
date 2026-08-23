import Link from "next/link";

/** ChronoForge wordmark: a small glowing "forge clock" glyph + gradient name. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className} aria-label="ChronoForge home">
      <span className="inline-flex items-center gap-2">
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-[var(--text-primary)]">Chrono</span>
          <span className="cf-gradient-text">Forge</span>
        </span>
      </span>
    </Link>
  );
}
