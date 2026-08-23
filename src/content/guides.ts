/**
 * Guide content. Each guide supports a real tool/user task (no filler), with a
 * direct-answer summary, explanation, an example, an optional reference table,
 * an FAQ, and a related calculator CTA.
 */

import type { CalculatorKey } from "@/lib/tools";

export interface GuideTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface Guide {
  slug: string;
  title: string; // <title>
  h1: string;
  metaDescription: string;
  summary: string; // direct answer, first thing on the page
  relatedTool: CalculatorKey;
  body: string[]; // paragraphs (plain text)
  table?: GuideTable;
  faq: { q: string; a: string }[];
  relatedGuides: string[];
}

const DECIMAL_CHART: GuideTable = {
  caption: "Minutes to decimal hours (rounded to two places)",
  headers: ["Minutes", "Decimal", "Minutes", "Decimal"],
  rows: [
    ["5", "0.08", "35", "0.58"],
    ["10", "0.17", "40", "0.67"],
    ["15", "0.25", "45", "0.75"],
    ["20", "0.33", "50", "0.83"],
    ["25", "0.42", "55", "0.92"],
    ["30", "0.50", "60", "1.00"],
  ],
};

export const guides: Guide[] = [
  {
    slug: "how-to-calculate-work-hours",
    title: "How to Calculate Work Hours (Step by Step) | ChronoForge",
    h1: "How to calculate work hours",
    metaDescription:
      "A simple step-by-step method to calculate hours worked from a start time, end time, and break — with an example and a free calculator.",
    summary:
      "Subtract your start time from your end time, then subtract any unpaid break. Convert the result to decimal hours by dividing the minutes by 60.",
    relatedTool: "work-hours",
    body: [
      "Calculating work hours is three steps: find the span from clock-in to clock-out, subtract unpaid breaks, then (for payroll) convert to decimal hours.",
      "First, find the gross span. If you started at 9:00 AM and finished at 5:30 PM, that is 8 hours and 30 minutes. If the end time is earlier than the start time, the shift crossed midnight — add 24 hours before subtracting.",
      "Second, subtract unpaid breaks. A 30-minute lunch turns 8:30 into 8:00 of paid time.",
      "Third, convert to decimal if your timesheet needs it: minutes ÷ 60. 8:00 is 8.00; 8:15 is 8.25.",
    ],
    faq: [
      { q: "How do I calculate hours worked across midnight?", a: "Add 24 hours to the end time before subtracting, or use a calculator that detects the midnight crossing automatically." },
      { q: "Are breaks always subtracted?", a: "Unpaid breaks are; paid rest breaks are not. Follow your employer's policy." },
    ],
    relatedGuides: ["how-to-calculate-time-card-hours", "how-to-calculate-lunch-breaks"],
  },
  {
    slug: "how-to-calculate-time-card-hours",
    title: "How to Calculate Time Card Hours for the Week | ChronoForge",
    h1: "How to calculate time card hours",
    metaDescription:
      "Add up a weekly time card: total each day's shifts, subtract breaks, and split regular from overtime hours. Includes an example.",
    summary:
      "For each day, add up every shift and subtract breaks. Add the days together for the weekly total, then split anything over your threshold (commonly 40 hours) as overtime.",
    relatedTool: "time-card",
    body: [
      "A weekly time card is just a stack of daily totals. Calculate each day, then add the days.",
      "For each day: subtract clock-in from clock-out for every shift, remove unpaid breaks, and add the shifts together. Multiple shifts (a split shift) simply add up.",
      "Add the seven days for the weekly total. Hours above your threshold are overtime in arithmetic terms — real eligibility depends on your role and local law.",
      "Keep times in one format (all 12-hour or all 24-hour) to avoid AM/PM mistakes.",
    ],
    faq: [
      { q: "What if I have two shifts in one day?", a: "Calculate each shift separately and add them; the daily total is the sum." },
      { q: "How is overtime decided?", a: "Arithmetically, it is hours over your weekly threshold. Legally, it depends on law and employer classification." },
    ],
    relatedGuides: ["how-to-calculate-work-hours", "time-card-rounding-explained"],
  },
  {
    slug: "decimal-hours-chart",
    title: "Decimal Hours Chart — Minutes to Decimal Reference | ChronoForge",
    h1: "Decimal hours chart",
    metaDescription:
      "A quick minutes-to-decimal-hours conversion chart for payroll and timesheets, plus how the conversion works.",
    summary:
      "To convert minutes to decimal hours, divide by 60. 15 minutes = 0.25, 30 = 0.50, 45 = 0.75. Use the chart below for common values.",
    relatedTool: "minutes-to-decimal",
    body: [
      "Payroll systems usually want decimal hours, not hours-and-minutes, because decimals multiply cleanly against a wage.",
      "The rule is simply minutes ÷ 60. The chart below covers the values you meet most often; for anything else, the calculator gives an exact figure.",
    ],
    table: DECIMAL_CHART,
    faq: [
      { q: "What is 10 minutes in decimal?", a: "About 0.17 hours (10 ÷ 60 = 0.1667)." },
      { q: "What is 40 minutes in decimal?", a: "About 0.67 hours." },
    ],
    relatedGuides: ["how-to-convert-minutes-to-decimal-hours"],
  },
  {
    slug: "how-to-calculate-lunch-breaks",
    title: "How to Calculate Lunch Breaks on a Timesheet | ChronoForge",
    h1: "How to calculate lunch breaks",
    metaDescription:
      "How to subtract lunch and unpaid breaks from hours worked, with an example and a free work-hours-with-lunch calculator.",
    summary:
      "Subtract the length of any unpaid meal break from your gross shift. A 45-minute lunch removes 0.75 hours from the day.",
    relatedTool: "work-hours-lunch",
    body: [
      "Most unpaid meal breaks are subtracted from paid hours. You can enter a break as a window (12:00–12:45) or as total minutes (45).",
      "Short paid rest breaks are usually not subtracted. When unsure, follow your employer's written policy.",
      "Example: clock in 8:00 AM, out 5:00 PM is 9:00 gross. A 45-minute lunch leaves 8:15 of paid time.",
    ],
    faq: [
      { q: "Is a 30-minute lunch paid?", a: "Usually not — bona fide meal breaks are typically unpaid and subtracted. Check your policy." },
    ],
    relatedGuides: ["how-to-calculate-work-hours", "how-to-read-a-timesheet"],
  },
  {
    slug: "how-to-convert-minutes-to-decimal-hours",
    title: "How to Convert Minutes to Decimal Hours | ChronoForge",
    h1: "How to convert minutes to decimal hours",
    metaDescription:
      "Convert minutes to decimal hours for payroll by dividing by 60. Includes worked examples and a conversion chart.",
    summary: "Divide the minutes by 60. For example, 45 minutes ÷ 60 = 0.75 decimal hours.",
    relatedTool: "minutes-to-decimal",
    body: [
      "Decimal hours make wage math simple: pay = rate × decimal hours. To get decimal hours, divide minutes by 60.",
      "Round to two decimal places for payroll unless your employer specifies otherwise.",
    ],
    table: DECIMAL_CHART,
    faq: [
      { q: "Why not just use hours and minutes?", a: "Multiplying a wage by 7:45 is awkward; multiplying by 7.75 is straightforward and less error-prone." },
    ],
    relatedGuides: ["decimal-hours-chart"],
  },
  {
    slug: "how-to-calculate-weekly-hours",
    title: "How to Calculate Weekly Hours Worked | ChronoForge",
    h1: "How to calculate weekly hours",
    metaDescription:
      "Add each day's hours for a weekly total and split regular from overtime. Includes an example and a free weekly hours calculator.",
    summary:
      "Add up each day's hours. Hours above your weekly threshold (commonly 40) are overtime in arithmetic terms.",
    relatedTool: "weekly-hours",
    body: [
      "Weekly hours are the sum of daily totals. Compute each day (shifts minus breaks), then add the days.",
      "If the weekly total exceeds your threshold, the excess is overtime arithmetically. Whether it qualifies legally depends on law and employer.",
    ],
    faq: [
      { q: "Is overtime daily or weekly?", a: "It depends on jurisdiction. This site uses a weekly threshold you can edit; it is not legal advice." },
    ],
    relatedGuides: ["how-to-calculate-overtime-hours", "how-to-calculate-time-card-hours"],
  },
  {
    slug: "how-to-calculate-overtime-hours",
    title: "How to Calculate Overtime Hours | ChronoForge",
    h1: "How to calculate overtime hours",
    metaDescription:
      "Calculate overtime hours and time-and-a-half pay with an editable threshold and multiplier. Arithmetic method with an example.",
    summary:
      "Overtime hours are total hours minus your threshold (commonly 40/week). Overtime pay is those hours × rate × your multiplier (commonly 1.5).",
    relatedTool: "overtime",
    body: [
      "Arithmetically: overtime = max(0, total − threshold). Overtime pay = overtime × rate × multiplier.",
      "Example: 45 hours at $20/hr with a 40-hour threshold and 1.5× multiplier = 40 × $20 + 5 × $20 × 1.5 = $800 + $150 = $950.",
      "This is arithmetic only. Overtime eligibility and rates are set by law and your employer.",
    ],
    faq: [
      { q: "What is time and a half?", a: "1.5 times the regular hourly rate, applied to overtime hours." },
    ],
    relatedGuides: ["how-to-calculate-weekly-hours"],
  },
  {
    slug: "how-to-calculate-hours-between-times",
    title: "How to Calculate the Hours Between Two Times | ChronoForge",
    h1: "How to calculate hours between two times",
    metaDescription:
      "Find the duration between two clock times, including spans that cross midnight. Method plus a free calculator.",
    summary:
      "Subtract the earlier time from the later time. If the end time is before the start time, add 24 hours first (the span crossed midnight).",
    relatedTool: "hours-between",
    body: [
      "Convert both times to a 24-hour value, subtract start from end, and convert the result back to hours and minutes.",
      "For overnight spans (e.g. 11:00 PM to 1:30 AM), add 24 hours to the end before subtracting: 25:30 − 23:00 = 2:30.",
    ],
    faq: [
      { q: "How many hours between 9 AM and 5 PM?", a: "8 hours." },
    ],
    relatedGuides: ["12-hour-vs-24-hour-time", "how-to-calculate-work-hours"],
  },
  {
    slug: "time-card-rounding-explained",
    title: "Time Card Rounding Explained | ChronoForge",
    h1: "Time card rounding explained",
    metaDescription:
      "How time card rounding works, common increments like 15-minute (quarter-hour) rounding, and why exact totals matter.",
    summary:
      "Rounding snaps clock times to an increment — commonly 15 minutes. ChronoForge totals exact time by default; rounding rules vary by employer and law.",
    relatedTool: "time-card",
    body: [
      "Some employers round punches to a fixed increment (often 15 minutes) using nearest, up, or down rules. Over time these should be neutral, not systematically against the worker.",
      "ChronoForge reports exact totals so you can compare against a rounded paystub and spot discrepancies.",
    ],
    table: {
      caption: "Common quarter-hour rounding (nearest)",
      headers: ["Actual", "Rounds to"],
      rows: [
        [":00–:07", ":00"],
        [":08–:22", ":15"],
        [":23–:37", ":30"],
        [":38–:52", ":45"],
        [":53–:59", "next :00"],
      ],
    },
    faq: [
      { q: "Is rounding legal?", a: "Neutral rounding is common, but rules vary by jurisdiction. This is not legal advice." },
    ],
    relatedGuides: ["how-to-calculate-time-card-hours"],
  },
  {
    slug: "hourly-vs-salary-conversion",
    title: "Hourly vs. Salary: How to Convert Between Them | ChronoForge",
    h1: "Hourly vs. salary conversion",
    metaDescription:
      "Convert between an hourly wage and an annual salary in both directions, with formulas and examples. Estimates before taxes.",
    summary:
      "Annual salary = hourly rate × hours per week × weeks per year. Hourly rate = annual salary ÷ (hours per week × weeks per year).",
    relatedTool: "hourly-to-salary",
    body: [
      "To go from hourly to salary, multiply the rate by weekly hours and by weeks worked per year (often 52). $25 × 40 × 52 = $52,000.",
      "To go the other way, divide the salary by the total hours worked in a year. $52,000 ÷ (40 × 52) = $25/hr.",
      "These are gross estimates — they do not include taxes, benefits, or paid time off assumptions.",
    ],
    faq: [
      { q: "How many work hours are in a year?", a: "About 2,080 at 40 hours a week for 52 weeks." },
    ],
    relatedGuides: [],
  },
  {
    slug: "12-hour-vs-24-hour-time",
    title: "12-Hour vs. 24-Hour Time (with Conversion Table) | ChronoForge",
    h1: "12-hour vs. 24-hour time",
    metaDescription:
      "Understand 12-hour (AM/PM) versus 24-hour (military) time and convert between them with a quick reference table.",
    summary:
      "24-hour time runs 00:00–23:59 with no AM/PM. To convert PM times to 24-hour, add 12 (except 12 PM); 12 AM is 00:00.",
    relatedTool: "hours-between",
    body: [
      "12-hour time uses AM/PM and restarts at 12; 24-hour (military) time counts straight through to 23:59.",
      "Rules: 12:00 AM = 00:00 (midnight). 12:00 PM = 12:00 (noon). For other PM times, add 12 (1:00 PM = 13:00).",
    ],
    table: {
      caption: "12-hour to 24-hour",
      headers: ["12-hour", "24-hour"],
      rows: [
        ["12:00 AM", "00:00"],
        ["6:00 AM", "06:00"],
        ["12:00 PM", "12:00"],
        ["1:00 PM", "13:00"],
        ["6:00 PM", "18:00"],
        ["11:00 PM", "23:00"],
      ],
    },
    faq: [
      { q: "Is midnight 12 AM or 12 PM?", a: "Midnight is 12:00 AM (00:00). Noon is 12:00 PM (12:00)." },
    ],
    relatedGuides: ["how-to-calculate-hours-between-times"],
  },
  {
    slug: "how-to-read-a-timesheet",
    title: "How to Read a Timesheet | ChronoForge",
    h1: "How to read a timesheet",
    metaDescription:
      "Learn the parts of a timesheet — clock in/out, breaks, regular and overtime hours, and totals — so you can check it before submitting.",
    summary:
      "A timesheet lists each day's clock-in, clock-out, breaks, and a daily total; the footer sums regular and overtime hours for the pay period.",
    relatedTool: "time-clock",
    body: [
      "Each row is a day: clock-in, clock-out, break, and the resulting hours. Split shifts add extra in/out pairs.",
      "The totals row separates regular hours from overtime and often shows a decimal total for payroll.",
      "Before submitting, re-add the days yourself — a one-minute check catches most errors.",
    ],
    faq: [
      { q: "What does a decimal total mean on a timesheet?", a: "It is the hours expressed as a decimal (7:45 = 7.75) so payroll can multiply it by your rate." },
    ],
    relatedGuides: ["how-to-calculate-time-card-hours"],
  },
];

const guideBySlug = new Map(guides.map((g) => [g.slug, g]));

export function getGuide(slug: string): Guide | undefined {
  return guideBySlug.get(slug);
}
