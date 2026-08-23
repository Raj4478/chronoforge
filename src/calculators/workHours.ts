/**
 * Single-shift work-hours family:
 *  - calculateWorkHours          (start/end + break minutes)
 *  - calculateDurationBetweenTimes (raw duration between two clock times)
 *  - calculateWorkHoursWithBreak (explicit break window OR break minutes)
 *  - calculateTimeClock          (a running list of clock in/out pairs)
 */

import {
  durationBetween,
  formatHhMm,
  formatHoursMinutesLabel,
  minutesToDecimal,
  parseTimeToMinutes,
  roundTo,
} from "@/lib/time/core";

export interface WorkHoursInput {
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  crossesMidnight?: boolean | "auto";
}

export interface WorkHoursResult {
  grossMinutes: number;
  netMinutes: number;
  decimalHours: number;
  formattedDuration: string;
  warnings: string[];
}

export function calculateWorkHours(input: WorkHoursInput): WorkHoursResult {
  const start = parseTimeToMinutes(input.startTime);
  const end = parseTimeToMinutes(input.endTime);
  const breakMinutes = Math.max(0, input.breakMinutes ?? 0);
  const warnings: string[] = [];

  if (start === null || end === null) {
    return {
      grossMinutes: 0,
      netMinutes: 0,
      decimalHours: 0,
      formattedDuration: "0:00",
      warnings: ["Enter a valid start and end time (HH:mm)."],
    };
  }

  const grossMinutes = durationBetween(start, end, input.crossesMidnight ?? "auto");
  if (breakMinutes > grossMinutes) {
    warnings.push("Break is longer than the shift; break was capped at the shift length.");
  }
  const netMinutes = Math.max(0, grossMinutes - Math.min(breakMinutes, grossMinutes));

  return {
    grossMinutes,
    netMinutes,
    decimalHours: roundTo(minutesToDecimal(netMinutes), 2),
    formattedDuration: formatHhMm(netMinutes),
    warnings,
  };
}

export interface DurationBetweenInput {
  startTime: string;
  endTime: string;
  crossesMidnight?: boolean | "auto";
}

export interface DurationBetweenResult {
  minutes: number;
  hoursDecimal: number;
  hoursMinutes: string;
  warnings: string[];
}

export function calculateDurationBetweenTimes(
  input: DurationBetweenInput,
): DurationBetweenResult {
  const start = parseTimeToMinutes(input.startTime);
  const end = parseTimeToMinutes(input.endTime);

  if (start === null || end === null) {
    return { minutes: 0, hoursDecimal: 0, hoursMinutes: "0h 0m", warnings: ["Enter two valid times."] };
  }

  const minutes = durationBetween(start, end, input.crossesMidnight ?? "auto");
  return {
    minutes,
    hoursDecimal: roundTo(minutesToDecimal(minutes), 2),
    hoursMinutes: formatHoursMinutesLabel(minutes),
    warnings: [],
  };
}

export interface WorkHoursWithBreakInput {
  clockIn: string;
  clockOut: string;
  breakStart?: string | null;
  breakEnd?: string | null;
  breakMinutes?: number | null;
}

export interface WorkHoursWithBreakResult {
  grossDuration: string;
  grossMinutes: number;
  breakDuration: string;
  breakMinutes: number;
  netWorkDuration: string;
  netMinutes: number;
  decimalHours: number;
  warnings: string[];
}

export function calculateWorkHoursWithBreak(
  input: WorkHoursWithBreakInput,
): WorkHoursWithBreakResult {
  const clockIn = parseTimeToMinutes(input.clockIn);
  const clockOut = parseTimeToMinutes(input.clockOut);
  const warnings: string[] = [];

  if (clockIn === null || clockOut === null) {
    return {
      grossDuration: "0:00",
      grossMinutes: 0,
      breakDuration: "0:00",
      breakMinutes: 0,
      netWorkDuration: "0:00",
      netMinutes: 0,
      decimalHours: 0,
      warnings: ["Enter a valid clock in and clock out time."],
    };
  }

  const grossMinutes = durationBetween(clockIn, clockOut, "auto");

  // Prefer an explicit break window if both ends are provided; otherwise use
  // the flat break-minutes field.
  let breakMinutes = 0;
  const bStart = parseTimeToMinutes(input.breakStart ?? "");
  const bEnd = parseTimeToMinutes(input.breakEnd ?? "");
  if (bStart !== null && bEnd !== null) {
    breakMinutes = durationBetween(bStart, bEnd, "auto");
  } else if (input.breakMinutes != null) {
    breakMinutes = Math.max(0, input.breakMinutes);
  }

  if (breakMinutes > grossMinutes) {
    warnings.push("Break is longer than the shift; break was capped.");
    breakMinutes = grossMinutes;
  }

  const netMinutes = Math.max(0, grossMinutes - breakMinutes);
  return {
    grossDuration: formatHhMm(grossMinutes),
    grossMinutes,
    breakDuration: formatHhMm(breakMinutes),
    breakMinutes,
    netWorkDuration: formatHhMm(netMinutes),
    netMinutes,
    decimalHours: roundTo(minutesToDecimal(netMinutes), 2),
    warnings,
  };
}

export interface ClockPunch {
  clockIn: string;
  clockOut: string;
  breakMinutes?: number;
}

export interface TimeClockResult {
  perPunchMinutes: number[];
  totalMinutes: number;
  totalDecimalHours: number;
  totalFormatted: string;
  warnings: string[];
}

/** Sum an arbitrary list of clock in/out punches (one day, many punches). */
export function calculateTimeClock(punches: ClockPunch[]): TimeClockResult {
  const warnings: string[] = [];
  const perPunchMinutes: number[] = [];
  let totalMinutes = 0;

  punches.forEach((punch, index) => {
    const start = parseTimeToMinutes(punch.clockIn);
    const end = parseTimeToMinutes(punch.clockOut);
    const brk = Math.max(0, punch.breakMinutes ?? 0);
    if (start === null || end === null) {
      perPunchMinutes.push(0);
      if (punch.clockIn?.trim() || punch.clockOut?.trim()) {
        warnings.push(`Punch ${index + 1}: incomplete times were ignored.`);
      }
      return;
    }
    const gross = durationBetween(start, end, "auto");
    const net = Math.max(0, gross - Math.min(brk, gross));
    perPunchMinutes.push(net);
    totalMinutes += net;
  });

  return {
    perPunchMinutes,
    totalMinutes,
    totalDecimalHours: roundTo(minutesToDecimal(totalMinutes), 2),
    totalFormatted: formatHhMm(totalMinutes),
    warnings,
  };
}
