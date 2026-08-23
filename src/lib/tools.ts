/**
 * Tool registry — the backbone of the site.
 *
 * Every calculator page is generated from one of these entries: routing, SEO
 * metadata, sitemap, breadcrumbs, on-page copy (assumptions / formula / worked
 * example / FAQ), and internal linking all read from here. Add a tool once,
 * get a fully-formed, cross-linked, indexable page.
 */

export type CalculatorKey =
  | "time-card"
  | "work-hours"
  | "hours-between"
  | "work-hours-lunch"
  | "time-clock"
  | "minutes-to-decimal"
  | "decimal-to-time"
  | "hours-and-minutes"
  | "weekly-hours"
  | "overtime"
  | "hourly-to-salary"
  | "salary-to-hourly"
  | "business-days"
  | "workdays-remaining"
  | "billable-hours"
  | "project-hours";

export type Category =
  | "time-cards"
  | "conversions"
  | "pay"
  | "calendar"
  | "freelance";

export interface Faq {
  q: string;
  a: string;
}

export interface Tool {
  key: CalculatorKey;
  route: string; // trailing slash to match trailingSlash: true
  category: Category;
  navLabel: string; // short label for menus / cards
  h1: string;
  title: string; // <title>
  metaDescription: string;
  promise: string; // one-line task promise under the H1
  keywords: string[];
  assumptions: string[];
  formula: string;
  workedExample: string;
  faq: Faq[];
  relatedTools: CalculatorKey[];
  relatedGuides: string[]; // guide slugs
  featured?: boolean; // shown on homepage quick tools
}

export interface Hub {
  route: string;
  category: Category;
  navLabel: string;
  h1: string;
  title: string;
  metaDescription: string;
  description: string;
  featuredTool: CalculatorKey;
}

export const hubs: Hub[] = [
  {
    route: "/conversions/",
    category: "conversions",
    navLabel: "Conversions",
    h1: "Time conversion calculators",
    title: "Time Conversion Calculators | ChronoForge",
    metaDescription:
      "Convert minutes to decimal hours, decimal hours to hh:mm, and add or subtract time. Fast, exact payroll-friendly conversions.",
    description:
      "Convert between minutes, decimal hours, and hh:mm — the conversions payroll and timesheets depend on.",
    featuredTool: "minutes-to-decimal",
  },
  {
    route: "/pay/",
    category: "pay",
    navLabel: "Pay",
    h1: "Pay conversion calculators",
    title: "Pay Calculators: Hourly & Salary | ChronoForge",
    metaDescription:
      "Convert an hourly wage to an annual salary and back. Arithmetic estimates before taxes — quick and clear.",
    description:
      "Turn an hourly rate into a yearly salary, or a salary back into an hourly rate. Estimates before taxes.",
    featuredTool: "hourly-to-salary",
  },
  {
    route: "/calendar/",
    category: "calendar",
    navLabel: "Calendar",
    h1: "Work calendar calculators",
    title: "Work Calendar Calculators | ChronoForge",
    metaDescription:
      "Count business days between two dates and workdays remaining this year, with custom weekends and holidays.",
    description:
      "Count business days between dates and workdays left in the year — with your own weekends and holidays.",
    featuredTool: "business-days",
  },
  {
    route: "/freelance/",
    category: "freelance",
    navLabel: "Freelance",
    h1: "Freelancer time calculators",
    title: "Freelancer Calculators | ChronoForge",
    metaDescription:
      "Track billable hours with rounding increments and roll tasks up into a project total with estimated revenue.",
    description:
      "Track billable time and roll project tasks into a total with estimated revenue.",
    featuredTool: "billable-hours",
  },
];

export const tools: Tool[] = [
  {
    key: "time-card",
    route: "/time-card-calculator/",
    category: "time-cards",
    navLabel: "Time Card",
    h1: "Time card calculator",
    title: "Time Card Calculator: Hours & Overtime | ChronoForge",
    metaDescription:
      "Free time card calculator. Add shifts across the week, subtract lunch breaks, split regular vs. overtime hours, and estimate gross pay. Works in your browser.",
    promise: "Add your shifts for the week and get total, regular, and overtime hours instantly.",
    keywords: ["time card calculator", "timesheet calculator", "weekly hours calculator", "work hours"],
    featured: true,
    assumptions: [
      "Overtime is arithmetic: any hours above the threshold you set (default 40/week). It is not a legal overtime determination.",
      "Breaks are unpaid and subtracted from each shift.",
      "Overnight shifts (clock-out earlier than clock-in) are counted as crossing midnight.",
      "Estimated pay uses your rate for regular hours and 1.5× for overtime hours.",
    ],
    formula:
      "For each shift: net = (clockOut − clockIn, wrapping past midnight) − break. Weekly total = sum of net shifts. regular = min(total, threshold); overtime = max(0, total − threshold). Pay = regular×rate + overtime×rate×1.5.",
    workedExample:
      "Mon–Fri, 9:00 AM to 6:00 PM with a 60-minute lunch = 8h/day × 5 = 40:00. At $20/hr that is $800.00 with no overtime. Add a 2-hour Saturday shift and you get 42:00 — 40 regular + 2 overtime = $860.00.",
    faq: [
      {
        q: "How do I calculate hours on a time card?",
        a: "Subtract each clock-in from its clock-out, remove unpaid breaks, then add every shift together. ChronoForge does this live as you type and shows the weekly total in both hh:mm and decimal hours.",
      },
      {
        q: "Does this handle overnight shifts?",
        a: "Yes. If your clock-out time is earlier than your clock-in (for example 10:00 PM to 6:00 AM), the calculator assumes the shift crosses midnight and counts the full duration.",
      },
      {
        q: "Is the overtime calculation legally accurate?",
        a: "No. Overtime here is pure arithmetic — hours above the threshold you choose. Overtime eligibility depends on your role, employer, and local law. See our calculation methodology page.",
      },
      {
        q: "Is my time-card data sent anywhere?",
        a: "No. Every calculation runs in your browser. Nothing is uploaded, and saving a template stores it only on your device.",
      },
    ],
    relatedTools: ["work-hours", "weekly-hours", "overtime", "hours-between"],
    relatedGuides: ["how-to-calculate-time-card-hours", "time-card-rounding-explained", "how-to-calculate-overtime-hours"],
  },
  {
    key: "work-hours",
    route: "/work-hours-calculator/",
    category: "time-cards",
    navLabel: "Work Hours",
    h1: "Work hours calculator",
    title: "Work Hours Calculator — Hours Worked | ChronoForge",
    metaDescription:
      "Calculate hours worked from a start time, end time, and break. Get the total in hours and minutes and as decimal hours. Free, no sign-up.",
    promise: "Enter a start time, end time, and break to get your net hours worked.",
    keywords: ["work hours calculator", "hours worked calculator", "hours calculator"],
    featured: false,
    assumptions: [
      "Break minutes are subtracted from the shift.",
      "If the end time is before the start time, the shift is treated as overnight.",
    ],
    formula: "net = (endTime − startTime, wrapping past midnight) − breakMinutes.",
    workedExample:
      "Start 9:00 AM, end 5:30 PM, 30-minute break = 8:30 gross − 0:30 = 8:00 net = 8.00 decimal hours.",
    faq: [
      {
        q: "How many hours is 9 to 5 with a 30-minute lunch?",
        a: "8:00 hours net — 8 hours of paid time after subtracting the 30-minute unpaid break from the 8.5-hour span.",
      },
      {
        q: "What is 8 hours 30 minutes in decimal?",
        a: "8.5 decimal hours. ChronoForge shows both formats so you can copy whichever your timesheet needs.",
      },
    ],
    relatedTools: ["hours-between", "work-hours-lunch", "time-card"],
    relatedGuides: ["how-to-calculate-work-hours", "how-to-calculate-hours-between-times"],
  },
  {
    key: "hours-between",
    route: "/hours-between-times/",
    category: "time-cards",
    navLabel: "Hours Between",
    h1: "Hours between two times",
    title: "Hours Between Times Calculator | ChronoForge",
    metaDescription:
      "Find the duration between two times of day, including overnight spans. Results in hours and minutes and as decimal hours.",
    promise: "Pick a start and end time to see exactly how much time is between them.",
    keywords: ["hours between times", "time duration calculator", "time difference calculator"],
    featured: true,
    assumptions: ["Overnight spans are detected automatically when the end time is earlier than the start."],
    formula: "duration = endTime − startTime, adding 24 hours when the span crosses midnight.",
    workedExample: "11:00 PM to 1:30 AM = 2h 30m = 2.50 decimal hours.",
    faq: [
      {
        q: "How many hours between 9 AM and 5 PM?",
        a: "8 hours (8h 0m, or 8.00 decimal hours).",
      },
      {
        q: "How do I calculate hours across midnight?",
        a: "Enter the later time as the end time. ChronoForge detects the midnight crossing and adds the extra day for you.",
      },
    ],
    relatedTools: ["work-hours", "work-hours-lunch", "time-card"],
    relatedGuides: ["how-to-calculate-hours-between-times", "12-hour-vs-24-hour-time"],
  },
  {
    key: "work-hours-lunch",
    route: "/work-hours-with-lunch/",
    category: "time-cards",
    navLabel: "Work Hours + Lunch",
    h1: "Work hours with lunch calculator",
    title: "Work Hours With Lunch Calculator — Subtract Breaks | ChronoForge",
    metaDescription:
      "Calculate net work hours after lunch and breaks. Enter a break window or total break minutes; get gross, break, and net time.",
    promise: "Enter your clock in/out and lunch to get net paid hours.",
    keywords: ["work hours with lunch", "lunch break calculator", "hours worked minus lunch"],
    featured: true,
    assumptions: [
      "You can enter either a break window (start/end) or total break minutes.",
      "Breaks are unpaid and subtracted from the shift.",
    ],
    formula: "net = gross shift − break, where break = (breakEnd − breakStart) or breakMinutes.",
    workedExample: "Clock in 8:00 AM, out 5:00 PM, lunch 12:00–12:45 = 9:00 gross − 0:45 = 8:15 net.",
    faq: [
      {
        q: "Should lunch be subtracted from hours worked?",
        a: "Unpaid meal breaks are normally subtracted from paid hours. Paid rest breaks usually are not. Check your employer's policy.",
      },
    ],
    relatedTools: ["work-hours", "time-card", "hours-between"],
    relatedGuides: ["how-to-calculate-lunch-breaks", "how-to-calculate-work-hours"],
  },
  {
    key: "time-clock",
    route: "/time-clock-calculator/",
    category: "time-cards",
    navLabel: "Time Clock",
    h1: "Time clock calculator",
    title: "Time Clock Calculator: Clock In/Out | ChronoForge",
    metaDescription:
      "Add up multiple clock-in and clock-out punches for a single day. Subtract breaks and get the daily total in hours and decimal.",
    promise: "Add each clock-in and clock-out for the day to get your daily total.",
    keywords: ["time clock calculator", "clock in clock out calculator", "punch clock calculator"],
    assumptions: ["Each punch is a clock-in/clock-out pair.", "Overnight punches are supported."],
    formula: "dailyTotal = Σ (clockOut − clockIn − break) over every punch.",
    workedExample: "9:00–12:00 and 12:30–5:00 = 3:00 + 4:30 = 7:30 = 7.50 decimal hours.",
    faq: [
      {
        q: "Can I add more than two punches a day?",
        a: "Yes — add as many clock-in/clock-out pairs as you need and the daily total updates live.",
      },
    ],
    relatedTools: ["time-card", "work-hours", "weekly-hours"],
    relatedGuides: ["how-to-calculate-time-card-hours", "how-to-read-a-timesheet"],
  },
  {
    key: "minutes-to-decimal",
    route: "/conversions/minutes-to-decimal-hours/",
    category: "conversions",
    navLabel: "Minutes → Decimal",
    h1: "Minutes to decimal hours",
    title: "Minutes to Decimal Hours Calculator + Chart | ChronoForge",
    metaDescription:
      "Convert minutes to decimal hours for payroll. Enter minutes and get exact decimal hours, plus a quick reference chart.",
    promise: "Type minutes and get the decimal hours payroll systems expect.",
    keywords: ["minutes to decimal", "minutes to decimal hours", "payroll time conversion"],
    featured: true,
    assumptions: ["Decimal hours = minutes ÷ 60.", "Results are rounded to two decimal places for payroll."],
    formula: "decimalHours = minutes / 60.",
    workedExample: "45 minutes = 45 ÷ 60 = 0.75 decimal hours. 20 minutes ≈ 0.33.",
    faq: [
      {
        q: "What is 15 minutes in decimal?",
        a: "0.25 hours. 30 minutes is 0.5, and 45 minutes is 0.75.",
      },
      {
        q: "Why does payroll use decimal hours?",
        a: "Multiplying a wage by decimal hours is simpler and less error-prone than multiplying by hours-and-minutes.",
      },
    ],
    relatedTools: ["decimal-to-time", "hours-and-minutes", "work-hours"],
    relatedGuides: ["how-to-convert-minutes-to-decimal-hours", "decimal-hours-chart"],
  },
  {
    key: "decimal-to-time",
    route: "/conversions/decimal-hours-to-time/",
    category: "conversions",
    navLabel: "Decimal → Time",
    h1: "Decimal hours to time",
    title: "Decimal Hours to Hours and Minutes Calculator | ChronoForge",
    metaDescription:
      "Convert decimal hours back to hours and minutes (hh:mm). Enter decimal hours like 7.75 and get 7:45.",
    promise: "Turn decimal hours like 7.75 back into 7:45.",
    keywords: ["decimal to hours", "decimal hours to time", "decimal to hh:mm"],
    assumptions: ["Minutes = the fractional part × 60, rounded to the nearest minute."],
    formula: "hours = floor(decimal); minutes = round((decimal − hours) × 60).",
    workedExample: "7.75 hours = 7 hours + 0.75 × 60 = 7:45.",
    faq: [
      {
        q: "What is 0.5 hours in minutes?",
        a: "30 minutes. 0.25 is 15 minutes and 0.75 is 45 minutes.",
      },
    ],
    relatedTools: ["minutes-to-decimal", "hours-and-minutes", "work-hours"],
    relatedGuides: ["decimal-hours-chart", "how-to-convert-minutes-to-decimal-hours"],
  },
  {
    key: "hours-and-minutes",
    route: "/conversions/hours-and-minutes-calculator/",
    category: "conversions",
    navLabel: "Add Hours + Minutes",
    h1: "Hours and minutes calculator",
    title: "Add & Subtract Hours and Minutes Calculator | ChronoForge",
    metaDescription:
      "Add and subtract multiple hours-and-minutes values. Get the running total in hh:mm and decimal hours.",
    promise: "Add or subtract several hh:mm values and get the total.",
    keywords: ["add hours and minutes", "time addition calculator", "sum time"],
    assumptions: ["Each row can be added or subtracted.", "Totals can exceed 24 hours."],
    formula: "total = Σ (± (hours × 60 + minutes)) minutes, shown as hh:mm and decimal.",
    workedExample: "8:30 + 7:15 + 6:45 = 22:30 = 22.50 decimal hours.",
    faq: [
      {
        q: "Can I subtract time as well as add it?",
        a: "Yes — switch any row to subtract, for example to remove a break from a running total.",
      },
    ],
    relatedTools: ["minutes-to-decimal", "decimal-to-time", "weekly-hours"],
    relatedGuides: ["decimal-hours-chart", "how-to-calculate-weekly-hours"],
  },
  {
    key: "weekly-hours",
    route: "/weekly-hours-calculator/",
    category: "time-cards",
    navLabel: "Weekly Hours",
    h1: "Weekly hours calculator",
    title: "Weekly Hours Calculator — Total, Regular & Overtime | ChronoForge",
    metaDescription:
      "Add each day's hours to get a weekly total, split into regular and overtime, with an optional pay estimate.",
    promise: "Enter each day's hours to get your weekly total and overtime split.",
    keywords: ["weekly hours calculator", "total hours for the week", "weekly timesheet"],
    featured: false,
    assumptions: ["Overtime is any hours above the weekly threshold you set (default 40).", "Arithmetic only, not a legal determination."],
    formula: "total = Σ dailyHours; regular = min(total, threshold); overtime = max(0, total − threshold).",
    workedExample: "8 + 8 + 8 + 8 + 10 = 42 hours = 40 regular + 2 overtime.",
    faq: [
      {
        q: "When does overtime start?",
        a: "In this tool, whenever weekly hours exceed the threshold you enter. Real eligibility depends on law and employer — see methodology.",
      },
    ],
    relatedTools: ["overtime", "time-card", "hours-and-minutes"],
    relatedGuides: ["how-to-calculate-weekly-hours", "how-to-calculate-overtime-hours"],
  },
  {
    key: "overtime",
    route: "/overtime-hours-calculator/",
    category: "time-cards",
    navLabel: "Overtime",
    h1: "Overtime hours calculator",
    title: "Overtime Hours Calculator — Regular vs. OT Pay | ChronoForge",
    metaDescription:
      "Split total hours into regular and overtime using an editable threshold and multiplier, with a pay estimate. Arithmetic only.",
    promise: "Enter total hours to split regular vs. overtime and estimate pay.",
    keywords: ["overtime calculator", "overtime hours", "time and a half calculator"],
    assumptions: ["Threshold default 40h; multiplier default 1.5× — both editable.", "Not a legal overtime determination."],
    formula: "overtime = max(0, total − threshold); overtimePay = overtime × rate × multiplier.",
    workedExample: "45 hours at $20/hr, 40h threshold, 1.5× = 40×$20 + 5×$20×1.5 = $950.",
    faq: [
      {
        q: "What is time and a half for $20 an hour?",
        a: "$30 per overtime hour ($20 × 1.5). Enter your rate to see the totals.",
      },
    ],
    relatedTools: ["weekly-hours", "time-card", "hourly-to-salary"],
    relatedGuides: ["how-to-calculate-overtime-hours", "how-to-calculate-weekly-hours"],
  },
  {
    key: "hourly-to-salary",
    route: "/pay/hourly-to-salary/",
    category: "pay",
    navLabel: "Hourly → Salary",
    h1: "Hourly to salary calculator",
    title: "Hourly to Salary Calculator — Annual Pay Estimate | ChronoForge",
    metaDescription:
      "Convert an hourly wage into weekly, monthly, and annual pay. Set hours per week and weeks per year. Estimate before taxes.",
    promise: "Enter your hourly rate to estimate weekly, monthly, and annual pay.",
    keywords: ["hourly to salary", "hourly to annual", "wage to salary calculator"],
    featured: true,
    assumptions: ["Estimate before taxes, benefits, and withholdings.", "Annual = rate × hours/week × weeks/year (default 52)."],
    formula: "annual = hourlyRate × hoursPerWeek × weeksPerYear; monthly = annual / 12.",
    workedExample: "$25/hr × 40h × 52 weeks = $1,000/week = $52,000/year.",
    faq: [
      {
        q: "How much is $25 an hour annually?",
        a: "About $52,000 per year at 40 hours a week for 52 weeks, before taxes.",
      },
    ],
    relatedTools: ["salary-to-hourly", "overtime", "weekly-hours"],
    relatedGuides: ["hourly-vs-salary-conversion"],
  },
  {
    key: "salary-to-hourly",
    route: "/pay/salary-to-hourly/",
    category: "pay",
    navLabel: "Salary → Hourly",
    h1: "Salary to hourly calculator",
    title: "Salary to Hourly Calculator | ChronoForge",
    metaDescription:
      "Convert an annual salary into an equivalent hourly rate. Set hours per week and weeks per year. Estimate before taxes.",
    promise: "Enter your annual salary to estimate the equivalent hourly rate.",
    keywords: ["salary to hourly", "annual to hourly", "salary hourly rate calculator"],
    featured: false,
    assumptions: ["Estimate before taxes.", "hourlyRate = salary / (hours/week × weeks/year)."],
    formula: "hourlyRate = annualSalary / (hoursPerWeek × weeksPerYear).",
    workedExample: "$52,000 / (40 × 52) = $25.00 per hour.",
    faq: [
      {
        q: "What is $60,000 a year per hour?",
        a: "About $28.85 per hour at 40 hours a week for 52 weeks, before taxes.",
      },
    ],
    relatedTools: ["hourly-to-salary", "weekly-hours", "overtime"],
    relatedGuides: ["hourly-vs-salary-conversion"],
  },
  {
    key: "business-days",
    route: "/calendar/business-days-calculator/",
    category: "calendar",
    navLabel: "Business Days",
    h1: "Business days calculator",
    title: "Business Days Calculator | ChronoForge",
    metaDescription:
      "Count business days between two dates, excluding weekends and your own holidays. Choose whether to include the start and end dates.",
    promise: "Pick two dates to count the business days between them.",
    keywords: ["business days calculator", "working days between dates", "workdays calculator"],
    featured: false,
    assumptions: ["Weekends default to Saturday and Sunday (editable).", "You can add your own holiday dates."],
    formula: "businessDays = calendar days in range − weekend days − holiday days.",
    workedExample: "Mon Jan 1 to Sun Jan 7, 2024 = 5 business days (2 weekend days excluded).",
    faq: [
      {
        q: "Does this include the start and end date?",
        a: "By default yes; you can toggle either endpoint off, which is handy for notice periods.",
      },
    ],
    relatedTools: ["workdays-remaining"],
    relatedGuides: [],
  },
  {
    key: "workdays-remaining",
    route: "/calendar/workdays-remaining/",
    category: "calendar",
    navLabel: "Workdays Remaining",
    h1: "Workdays remaining this year",
    title: "Workdays Remaining Calculator | ChronoForge",
    metaDescription:
      "Count the business days remaining until the end of the year from any date, excluding weekends and holidays you add.",
    promise: "Pick a date to see the business days left until year end.",
    keywords: ["workdays remaining", "business days left this year", "working days remaining"],
    featured: false,
    assumptions: ["Counts from your date through December 31.", "Weekends and your holidays are excluded."],
    formula: "workdaysRemaining = business days from the date through Dec 31.",
    workedExample: "From Mon Dec 30, 2024 = 2 business days remaining (Dec 30 and 31).",
    faq: [
      {
        q: "Can I exclude company holidays?",
        a: "Yes — add each holiday date and it will be removed from the count.",
      },
    ],
    relatedTools: ["business-days"],
    relatedGuides: [],
  },
  {
    key: "billable-hours",
    route: "/freelance/billable-hours-calculator/",
    category: "freelance",
    navLabel: "Billable Hours",
    h1: "Billable hours calculator",
    title: "Billable Hours Calculator | ChronoForge",
    metaDescription:
      "Add time entries, round billed time up to your increment (e.g. 6 or 15 minutes), and estimate revenue at your hourly rate.",
    promise: "Log your time entries and get billable hours and estimated revenue.",
    keywords: ["billable hours calculator", "freelance hours", "billable time rounding"],
    featured: false,
    assumptions: ["Billed time rounds up to the increment you choose (default: exact).", "Revenue = billable hours × rate."],
    formula: "billable = ceil(totalMinutes / increment) × increment; revenue = billableHours × rate.",
    workedExample: "50 minutes with a 15-minute increment rounds up to 60 minutes = 1.00 billable hour.",
    faq: [
      {
        q: "What is a billing increment?",
        a: "The smallest unit you bill in — commonly 6 minutes (0.1h) or 15 minutes (0.25h). Partial units round up.",
      },
    ],
    relatedTools: ["project-hours", "minutes-to-decimal", "hourly-to-salary"],
    relatedGuides: ["how-to-read-a-timesheet"],
  },
  {
    key: "project-hours",
    route: "/freelance/project-hours-calculator/",
    category: "freelance",
    navLabel: "Project Hours",
    h1: "Project hours calculator",
    title: "Project Hours Calculator | ChronoForge",
    metaDescription:
      "Add project tasks with hours to get a total, each task's share of the project, and estimated revenue at your rate.",
    promise: "Add tasks and hours to total a project and estimate revenue.",
    keywords: ["project hours calculator", "project time tracking", "task hours total"],
    featured: false,
    assumptions: ["Task hours are decimal.", "Revenue = total hours × rate."],
    formula: "total = Σ taskHours; share = taskHours / total; revenue = total × rate.",
    workedExample: "Design 3h + Build 9h = 12h total. Design is 25% of the project. At $50/hr = $600.",
    faq: [
      {
        q: "Can I see how much each task is of the project?",
        a: "Yes — each task shows its share of the total so you can spot where time goes.",
      },
    ],
    relatedTools: ["billable-hours", "hourly-to-salary", "weekly-hours"],
    relatedGuides: ["how-to-read-a-timesheet"],
  },
];

// ---- Lookup helpers -------------------------------------------------------

const toolByKey = new Map(tools.map((t) => [t.key, t]));

export function getTool(key: CalculatorKey): Tool {
  const tool = toolByKey.get(key);
  if (!tool) throw new Error(`Unknown tool: ${key}`);
  return tool;
}

export function toolsInCategory(category: Category): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getHub(category: Category): Hub | undefined {
  return hubs.find((h) => h.category === category);
}

export const categoryLabels: Record<Category, string> = {
  "time-cards": "Time cards & hours",
  conversions: "Conversions",
  pay: "Pay",
  calendar: "Calendar",
  freelance: "Freelance",
};
