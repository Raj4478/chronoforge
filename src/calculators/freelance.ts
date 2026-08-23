/**
 * Freelancer tools:
 *  - calculateBillableHours (list of billable time entries -> hours + revenue)
 *  - calculateProjectHours  (roll up tasks into a project total)
 *
 * Billing rounds up to the nearest increment (e.g. 6-minute / 0.1h units) which
 * is a common freelance/agency convention. Arithmetic only.
 */

import {
  durationBetween,
  formatHhMm,
  minutesToDecimal,
  parseTimeToMinutes,
  roundTo,
} from "@/lib/time/core";

export interface BillableEntry {
  startTime: string;
  endTime: string;
  breakMinutes?: number;
}

export interface BillableHoursInput {
  entries: BillableEntry[];
  hourlyRate?: number | null;
  /** Round billed time up to the nearest N minutes (default 1 = exact). */
  billingIncrementMinutes?: number;
}

export interface BillableHoursResult {
  totalMinutes: number;
  billableMinutes: number;
  billableDecimalHours: number;
  formatted: string;
  estimatedRevenue: number | null;
  warnings: string[];
}

export function calculateBillableHours(input: BillableHoursInput): BillableHoursResult {
  const increment = Math.max(1, Math.round(input.billingIncrementMinutes ?? 1));
  const warnings: string[] = [];
  let totalMinutes = 0;

  input.entries.forEach((entry, index) => {
    const start = parseTimeToMinutes(entry.startTime);
    const end = parseTimeToMinutes(entry.endTime);
    if (start === null || end === null) {
      if (entry.startTime?.trim() || entry.endTime?.trim()) {
        warnings.push(`Entry ${index + 1}: incomplete times were ignored.`);
      }
      return;
    }
    const gross = durationBetween(start, end, "auto");
    const brk = Math.max(0, entry.breakMinutes ?? 0);
    totalMinutes += Math.max(0, gross - Math.min(brk, gross));
  });

  const billableMinutes = Math.ceil(totalMinutes / increment) * increment;
  const billableDecimalHours = roundTo(minutesToDecimal(billableMinutes), 2);

  let estimatedRevenue: number | null = null;
  if (input.hourlyRate != null && input.hourlyRate >= 0) {
    estimatedRevenue = roundTo(billableDecimalHours * input.hourlyRate, 2);
  }

  return {
    totalMinutes,
    billableMinutes,
    billableDecimalHours,
    formatted: formatHhMm(billableMinutes),
    estimatedRevenue,
    warnings,
  };
}

export interface ProjectTask {
  label: string;
  hours: number; // decimal hours
}

export interface ProjectHoursInput {
  tasks: ProjectTask[];
  hourlyRate?: number | null;
}

export interface ProjectHoursResult {
  totalHours: number;
  formatted: string;
  estimatedRevenue: number | null;
  breakdown: { label: string; hours: number; share: number }[];
}

export function calculateProjectHours(input: ProjectHoursInput): ProjectHoursResult {
  const totalHours = input.tasks.reduce(
    (acc, t) => acc + (Number.isFinite(t.hours) ? Math.max(0, t.hours) : 0),
    0,
  );

  const breakdown = input.tasks.map((t) => {
    const hours = Number.isFinite(t.hours) ? Math.max(0, t.hours) : 0;
    return {
      label: t.label,
      hours: roundTo(hours, 2),
      share: totalHours > 0 ? roundTo((hours / totalHours) * 100, 1) : 0,
    };
  });

  let estimatedRevenue: number | null = null;
  if (input.hourlyRate != null && input.hourlyRate >= 0) {
    estimatedRevenue = roundTo(totalHours * input.hourlyRate, 2);
  }

  return {
    totalHours: roundTo(totalHours, 2),
    formatted: formatHhMm(Math.round(totalHours * 60)),
    estimatedRevenue,
    breakdown,
  };
}
