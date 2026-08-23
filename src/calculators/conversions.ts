/**
 * Time <-> decimal conversions.
 *  - minutesToDecimalHours
 *  - decimalHoursToTime
 *  - addHoursAndMinutes (add/subtract a list of h:m values)
 */

import { formatHhMm, MINUTES_PER_HOUR, roundTo } from "@/lib/time/core";

export interface MinutesToDecimalResult {
  decimalHours: number; // full precision
  rounded2: number; // 2 dp
  roundedHundredths: number; // payroll hundredths (same as rounded2, named per contract)
}

export function minutesToDecimalHours(minutes: number): MinutesToDecimalResult {
  const safe = Number.isFinite(minutes) ? minutes : 0;
  const decimalHours = safe / MINUTES_PER_HOUR;
  return {
    decimalHours,
    rounded2: roundTo(decimalHours, 2),
    roundedHundredths: roundTo(decimalHours, 2),
  };
}

export interface DecimalHoursToTimeResult {
  hours: number;
  minutes: number;
  formatted: string; // "H:mm"
}

export function decimalHoursToTime(decimalHours: number): DecimalHoursToTimeResult {
  const safe = Number.isFinite(decimalHours) ? decimalHours : 0;
  const sign = safe < 0 ? -1 : 1;
  const totalMinutes = Math.round(Math.abs(safe) * MINUTES_PER_HOUR);
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR) * sign;
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return {
    hours,
    minutes,
    formatted: formatHhMm(sign * totalMinutes),
  };
}

export interface HoursAndMinutesTerm {
  hours: number;
  minutes: number;
  operation?: "add" | "subtract";
}

export interface HoursAndMinutesResult {
  totalMinutes: number;
  formatted: string;
  decimalHours: number;
}

/** Add and subtract a series of hours/minutes terms. */
export function addHoursAndMinutes(terms: HoursAndMinutesTerm[]): HoursAndMinutesResult {
  const totalMinutes = terms.reduce((acc, term) => {
    const magnitude = (term.hours || 0) * MINUTES_PER_HOUR + (term.minutes || 0);
    return acc + (term.operation === "subtract" ? -magnitude : magnitude);
  }, 0);

  return {
    totalMinutes,
    formatted: formatHhMm(totalMinutes),
    decimalHours: roundTo(totalMinutes / MINUTES_PER_HOUR, 2),
  };
}
