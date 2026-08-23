"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const inputBase =
  "cf-tabular w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-3 py-2 text-[var(--text-primary)] outline-none transition-colors focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/30 placeholder:text-[var(--text-muted)]";

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

export function TimeField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input
          id={id}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      )}
    </Field>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  hint,
  placeholder,
  prefix,
  suffix,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">{prefix}</span>
          )}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v === "" ? "" : Number(v));
            }}
            className={cn(inputBase, prefix && "pl-7", suffix && "pr-12")}
          />
          {suffix && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">{suffix}</span>
          )}
        </div>
      )}
    </Field>
  );
}

export function DateField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} className={inputBase} />
      )}
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]">
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          checked ? "bg-brand-gradient" : "bg-[var(--border-strong)]",
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
      {label}
    </label>
  );
}

export function Warnings({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul role="status" className="space-y-1 rounded-lg border border-state-warning/40 bg-state-warning/5 p-3 text-xs text-[var(--text-secondary)]">
      {items.map((w, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden className="text-state-warning">⚠</span>
          <span>{w}</span>
        </li>
      ))}
    </ul>
  );
}
