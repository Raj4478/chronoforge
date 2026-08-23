/**
 * Time Card calculator — the flagship tool.
 *
 * Sums multiple shifts across multiple days, subtracts unpaid breaks, supports
 * overnight shifts, and splits the weekly total into regular vs. overtime hours
 * using an editable arithmetic threshold.
 *
 * IMPORTANT: overtime here is pure arithmetic (hours over the threshold). It is
 * NOT a legal determination of overtime eligibility.
 */

import {
  durationBetween,
  formatHhMm,
  minutesToDecimal,
  parseTimeToMinutes,
  roundTo,
  type TimeFormat,
} from "@/lib/time/core";

export interface ShiftInput {
  clockIn: string; // "HH:mm"
  clockOut: string; // "HH:mm"
  breakMinutes?: number;
}

export interface DayInput {
  dateOrLabel: string;
  shifts: ShiftInput[];
}

export interface TimeCardInput {
  days: DayInput[];
  overtimeThresholdHours?: number; // default 40
  hourlyRate?: number | null;
  timeFormat?: TimeFormat;
}

export interface DayDuration {
  dateOrLabel: string;
  netMinutes: number;
  decimalHours: number;
  formatted: string;
}

export interface TimeCardResult {
  dailyDurations: DayDuration[];
  weeklyTotalMinutes: number;
  weeklyTotalDecimalHours: number;
  regularHours: number;
  overtimeHours: number;
  estimatedGrossPay: number | null;
  warnings: string[];
}

const OVERTIME_MULTIPLIER = 1.5;

export function calculateTimeCard(input: TimeCardInput): TimeCardResult {
  const {
    days,
    overtimeThresholdHours = 40,
    hourlyRate = null,
    timeFormat: _timeFormat = "12h",
  } = input;

  const warnings: string[] = [];
  const dailyDurations: DayDuration[] = [];
  let weeklyTotalMinutes = 0;

  days.forEach((day, dayIndex) => {
    let dayMinutes = 0;

    day.shifts.forEach((shift, shiftIndex) => {
      const start = parseTimeToMinutes(shift.clockIn);
      const end = parseTimeToMinutes(shift.clockOut);
      const breakMinutes = Math.max(0, shift.breakMinutes ?? 0);
      const label = `${day.dateOrLabel || `Day ${dayIndex + 1}`} · shift ${shiftIndex + 1}`;

      // Skip shifts that aren't filled in yet — a blank row shouldn't be an error.
      if (start === null || end === null) {
        if (shift.clockIn?.trim() || shift.clockOut?.trim()) {
          warnings.push(`${label}: incomplete clock in/out was ignored.`);
        }
        return;
      }

      const gross = durationBetween(start, end, "auto");
      if (gross === 0) {
        warnings.push(`${label}: clock in and clock out are the same time.`);
      }
      if (breakMinutes > gross) {
        warnings.push(
          `${label}: break (${breakMinutes}m) is longer than the shift (${formatHhMm(
            gross,
          )}); break was capped.`,
        );
      }
      const net = Math.max(0, gross - Math.min(breakMinutes, gross));
      dayMinutes += net;
    });

    dailyDurations.push({
      dateOrLabel: day.dateOrLabel || `Day ${dayIndex + 1}`,
      netMinutes: dayMinutes,
      decimalHours: roundTo(minutesToDecimal(dayMinutes), 2),
      formatted: formatHhMm(dayMinutes),
    });
    weeklyTotalMinutes += dayMinutes;
  });

  const weeklyDecimal = minutesToDecimal(weeklyTotalMinutes);
  const thresholdHours = Math.max(0, overtimeThresholdHours);
  const overtimeHours = roundTo(Math.max(0, weeklyDecimal - thresholdHours), 2);
  const regularHours = roundTo(Math.min(weeklyDecimal, thresholdHours), 2);

  let estimatedGrossPay: number | null = null;
  if (hourlyRate != null && hourlyRate >= 0) {
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * OVERTIME_MULTIPLIER;
    estimatedGrossPay = roundTo(regularPay + overtimePay, 2);
  }

  return {
    dailyDurations,
    weeklyTotalMinutes,
    weeklyTotalDecimalHours: roundTo(weeklyDecimal, 2),
    regularHours,
    overtimeHours,
    estimatedGrossPay,
    warnings,
  };
}
