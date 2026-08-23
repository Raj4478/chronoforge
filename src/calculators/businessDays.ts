/**
 * Calendar tools:
 *  - calculateBusinessDays (business days between two dates)
 *  - workdaysRemaining (business days left in a given year from a date)
 *
 * Dates are handled in UTC to avoid off-by-one errors from local timezones.
 * Input dates are "YYYY-MM-DD" strings.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseISODateToUTC(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Reject impossible dates that Date silently rolls over (e.g. 2024-02-31).
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface BusinessDaysInput {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  includeStart?: boolean; // default true
  includeEnd?: boolean; // default true
  weekendDays?: number[]; // 0=Sun..6=Sat, default [0,6]
  holidays?: string[]; // YYYY-MM-DD list
}

export interface BusinessDaysResult {
  businessDays: number;
  calendarDays: number;
  excludedWeekendDays: number;
  excludedHolidays: number;
  warnings: string[];
}

export function calculateBusinessDays(input: BusinessDaysInput): BusinessDaysResult {
  const warnings: string[] = [];
  const start = parseISODateToUTC(input.startDate);
  const end = parseISODateToUTC(input.endDate);
  const includeStart = input.includeStart ?? true;
  const includeEnd = input.includeEnd ?? true;
  const weekendDays = new Set(input.weekendDays ?? [0, 6]);
  const holidaySet = new Set(
    (input.holidays ?? [])
      .map((h) => parseISODateToUTC(h))
      .filter((d): d is Date => d !== null)
      .map(toISO),
  );

  if (!start || !end) {
    return {
      businessDays: 0,
      calendarDays: 0,
      excludedWeekendDays: 0,
      excludedHolidays: 0,
      warnings: ["Enter a valid start and end date (YYYY-MM-DD)."],
    };
  }

  let from = start;
  let to = end;
  if (from.getTime() > to.getTime()) {
    warnings.push("Start date was after end date; the range was reversed.");
    [from, to] = [to, from];
  }

  let businessDays = 0;
  let excludedWeekendDays = 0;
  let excludedHolidays = 0;
  let calendarDays = 0;

  for (let t = from.getTime(); t <= to.getTime(); t += MS_PER_DAY) {
    const current = new Date(t);
    const isStart = t === from.getTime();
    const isEnd = t === to.getTime();
    if (isStart && !includeStart) continue;
    if (isEnd && !includeEnd) continue;

    calendarDays += 1;
    const dow = current.getUTCDay();
    const iso = toISO(current);

    if (weekendDays.has(dow)) {
      excludedWeekendDays += 1;
    } else if (holidaySet.has(iso)) {
      excludedHolidays += 1;
    } else {
      businessDays += 1;
    }
  }

  return { businessDays, calendarDays, excludedWeekendDays, excludedHolidays, warnings };
}

export interface WorkdaysRemainingInput {
  fromDate: string; // YYYY-MM-DD
  year?: number; // default: year of fromDate
  weekendDays?: number[];
  holidays?: string[];
  includeToday?: boolean; // default true
}

export interface WorkdaysRemainingResult {
  workdaysRemaining: number;
  calendarDaysRemaining: number;
  yearEnd: string;
  warnings: string[];
}

export function workdaysRemaining(input: WorkdaysRemainingInput): WorkdaysRemainingResult {
  const from = parseISODateToUTC(input.fromDate);
  if (!from) {
    return {
      workdaysRemaining: 0,
      calendarDaysRemaining: 0,
      yearEnd: "",
      warnings: ["Enter a valid date (YYYY-MM-DD)."],
    };
  }
  const year = input.year ?? from.getUTCFullYear();
  const yearEndISO = `${year}-12-31`;

  const result = calculateBusinessDays({
    startDate: toISO(from),
    endDate: yearEndISO,
    includeStart: input.includeToday ?? true,
    includeEnd: true,
    weekendDays: input.weekendDays,
    holidays: input.holidays,
  });

  return {
    workdaysRemaining: result.businessDays,
    calendarDaysRemaining: result.calendarDays,
    yearEnd: yearEndISO,
    warnings: result.warnings,
  };
}
