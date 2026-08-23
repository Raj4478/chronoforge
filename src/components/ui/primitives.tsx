import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase eyebrow label. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A rounded data chip / tag. */
export function DataChip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "cyan" | "violet" | "success" | "warning" }) {
  const tones: Record<string, string> = {
    neutral: "border-[var(--border)] text-[var(--text-secondary)]",
    cyan: "border-accent-cyan/40 text-accent-cyan bg-accent-cyan/5",
    violet: "border-accent-violet/40 text-accent-violet bg-accent-violet/5",
    success: "border-state-success/40 text-state-success bg-state-success/5",
    warning: "border-state-warning/50 text-state-warning bg-state-warning/5",
  };
  return (
    <span
      className={cn(
        "cf-tabular inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Big result tile: label on top, prominent tabular value. */
export function MetricTile({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        highlight
          ? "border-transparent bg-brand-gradient text-white shadow-glow"
          : "border-[var(--border)] bg-[var(--surface-solid)]/40",
      )}
    >
      <div
        className={cn(
          "text-xs font-semibold uppercase tracking-wide",
          highlight ? "text-white/80" : "text-[var(--text-muted)]",
        )}
      >
        {label}
      </div>
      <div className={cn("cf-tabular mt-1 text-2xl font-bold sm:text-3xl", highlight ? "text-white" : "text-[var(--text-primary)]")}>
        {value}
      </div>
      {sub != null && (
        <div className={cn("cf-tabular mt-0.5 text-sm", highlight ? "text-white/80" : "text-[var(--text-secondary)]")}>{sub}</div>
      )}
    </div>
  );
}

/** Long-form prose container with sensible spacing and readable measure. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-prose space-y-4 text-[15px] leading-7 text-[var(--text-secondary)] [&_a]:text-accent-violet [&_a:hover]:underline [&_strong]:text-[var(--text-primary)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Section wrapper with a heading + optional description. */
export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("space-y-4", className)}>
      {title && (
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h2>
          {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
