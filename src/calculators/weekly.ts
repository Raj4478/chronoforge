/**
 * Weekly-hours and overtime arithmetic.
 * Overtime is arithmetic (hours above an editable threshold) — NOT a legal
 * eligibility determination.
 */

import { roundTo } from "@/lib/time/core";

export interface WeeklyHoursInput {
  /** Decimal hours per day (any length; blanks treated as 0). */
  dailyHours: number[];
  overtimeThresholdHours?: number; // default 40
  hourlyRate?: number | null;
}

export interface WeeklyHoursResult {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  estimatedGrossPay: number | null;
}

const OVERTIME_MULTIPLIER = 1.5;

export function calculateWeeklyHours(input: WeeklyHoursInput): WeeklyHoursResult {
  const threshold = Math.max(0, input.overtimeThresholdHours ?? 40);
  const total = input.dailyHours.reduce((acc, h) => acc + (Number.isFinite(h) ? Math.max(0, h) : 0), 0);
  const overtime = Math.max(0, total - threshold);
  const regular = Math.min(total, threshold);

  let estimatedGrossPay: number | null = null;
  if (input.hourlyRate != null && input.hourlyRate >= 0) {
    estimatedGrossPay = roundTo(
      regular * input.hourlyRate + overtime * input.hourlyRate * OVERTIME_MULTIPLIER,
      2,
    );
  }

  return {
    totalHours: roundTo(total, 2),
    regularHours: roundTo(regular, 2),
    overtimeHours: roundTo(overtime, 2),
    estimatedGrossPay,
  };
}

export interface OvertimeInput {
  totalHours: number;
  overtimeThresholdHours?: number; // default 40
  hourlyRate?: number | null;
  overtimeMultiplier?: number; // default 1.5
}

export interface OvertimeResult {
  regularHours: number;
  overtimeHours: number;
  regularPay: number | null;
  overtimePay: number | null;
  totalPay: number | null;
}

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const threshold = Math.max(0, input.overtimeThresholdHours ?? 40);
  const multiplier = input.overtimeMultiplier ?? OVERTIME_MULTIPLIER;
  const total = Math.max(0, Number.isFinite(input.totalHours) ? input.totalHours : 0);
  const overtimeHours = roundTo(Math.max(0, total - threshold), 2);
  const regularHours = roundTo(Math.min(total, threshold), 2);

  let regularPay: number | null = null;
  let overtimePay: number | null = null;
  let totalPay: number | null = null;
  if (input.hourlyRate != null && input.hourlyRate >= 0) {
    regularPay = roundTo(regularHours * input.hourlyRate, 2);
    overtimePay = roundTo(overtimeHours * input.hourlyRate * multiplier, 2);
    totalPay = roundTo(regularPay + overtimePay, 2);
  }

  return { regularHours, overtimeHours, regularPay, overtimePay, totalPay };
}
