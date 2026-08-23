/**
 * ChronoForge time primitives.
 *
 * Everything here is a pure, deterministic, side-effect-free function so the
 * calculators are trivially unit-testable ("golden tests"). Time-of-day is
 * represented internally as **minutes since midnight** (0–1439); durations are
 * plain **minutes** and may exceed 1440 (e.g. a weekly total).
 */

export type TimeFormat = "12h" | "24h";

export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

/**
 * Parse an "HH:mm" (24-hour) string into minutes since midnight.
 * Returns null for empty/invalid input rather than throwing, so UI code can
 * treat "not yet filled in" and "typo" gracefully.
 */
export function parseTimeToMinutes(value: string | null | undefined): number | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (trimmed === "") return null;

  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * MINUTES_PER_HOUR + minutes;
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Duration in minutes between two clock times.
 *
 * `crossesMidnight`:
 *  - true  => always add a day when end <= start (overnight shift)
 *  - false => never add a day (may return 0/negative-safe 0)
 *  - "auto" (default) => add a day only when end is strictly before start
 */
export function durationBetween(
  startMinutes: number,
  endMinutes: number,
  crossesMidnight: boolean | "auto" = "auto",
): number {
  let diff = endMinutes - startMinutes;
  const shouldWrap =
    crossesMidnight === true || (crossesMidnight === "auto" && diff < 0);
  if (shouldWrap) diff += MINUTES_PER_DAY;
  return Math.max(0, diff);
}

/** Convert whole minutes to decimal hours. */
export function minutesToDecimal(minutes: number): number {
  return minutes / MINUTES_PER_HOUR;
}

/** Round to a fixed number of decimal places without float drift (e.g. 1.005 -> 1.01). */
export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Format a duration in minutes as "H:mm" (e.g. 95 -> "1:35"). Hours are not
 * capped at 24, so a 42.5h week renders "42:30".
 */
export function formatHhMm(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / MINUTES_PER_HOUR);
  const minutes = abs % MINUTES_PER_HOUR;
  return `${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Format a duration as a friendly "Hh Mm" label (e.g. 95 -> "1h 35m",
 * 60 -> "1h", 0 -> "0m").
 */
export function formatHoursMinutesLabel(totalMinutes: number): string {
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / MINUTES_PER_HOUR);
  const minutes = abs % MINUTES_PER_HOUR;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours === 0) parts.push(`${minutes}m`);
  return (totalMinutes < 0 ? "-" : "") + parts.join(" ");
}

/** Format minutes-since-midnight as a clock time in the requested format. */
export function formatClock(minutesSinceMidnight: number, format: TimeFormat = "12h"): string {
  const normalized = ((minutesSinceMidnight % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  let hours = Math.floor(normalized / MINUTES_PER_HOUR);
  const minutes = normalized % MINUTES_PER_HOUR;

  if (format === "24h") {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}
