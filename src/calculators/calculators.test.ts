import { describe, expect, it } from "vitest";
import {
  addHoursAndMinutes,
  calculateBillableHours,
  calculateBusinessDays,
  calculateDurationBetweenTimes,
  calculateOvertime,
  calculateProjectHours,
  calculateTimeCard,
  calculateTimeClock,
  calculateWeeklyHours,
  calculateWorkHours,
  calculateWorkHoursWithBreak,
  decimalHoursToTime,
  hourlyToSalary,
  minutesToDecimalHours,
  salaryToHourly,
  workdaysRemaining,
} from "./index";

describe("calculateTimeCard", () => {
  it("sums a standard 5-day week with lunch and computes overtime", () => {
    const days = Array.from({ length: 5 }, (_, i) => ({
      dateOrLabel: `Day ${i + 1}`,
      shifts: [{ clockIn: "09:00", clockOut: "18:00", breakMinutes: 60 }],
    }));
    const result = calculateTimeCard({ days, overtimeThresholdHours: 40, hourlyRate: 20 });
    // 8h net/day * 5 = 40h -> no overtime.
    expect(result.weeklyTotalDecimalHours).toBe(40);
    expect(result.overtimeHours).toBe(0);
    expect(result.regularHours).toBe(40);
    expect(result.estimatedGrossPay).toBe(800);
  });

  it("splits overtime at the threshold with 1.5x pay", () => {
    const days = Array.from({ length: 5 }, () => ({
      dateOrLabel: "d",
      shifts: [{ clockIn: "08:00", clockOut: "18:00", breakMinutes: 0 }], // 10h
    }));
    const result = calculateTimeCard({ days, overtimeThresholdHours: 40, hourlyRate: 10 });
    expect(result.weeklyTotalDecimalHours).toBe(50);
    expect(result.regularHours).toBe(40);
    expect(result.overtimeHours).toBe(10);
    // 40*10 + 10*10*1.5 = 400 + 150 = 550
    expect(result.estimatedGrossPay).toBe(550);
  });

  it("handles overnight shifts", () => {
    const result = calculateTimeCard({
      days: [{ dateOrLabel: "Night", shifts: [{ clockIn: "22:00", clockOut: "06:00", breakMinutes: 30 }] }],
    });
    expect(result.weeklyTotalMinutes).toBe(8 * 60 - 30); // 7.5h
    expect(result.weeklyTotalDecimalHours).toBe(7.5);
  });

  it("caps a break that exceeds the shift and warns", () => {
    const result = calculateTimeCard({
      days: [{ dateOrLabel: "d", shifts: [{ clockIn: "09:00", clockOut: "10:00", breakMinutes: 120 }] }],
    });
    expect(result.weeklyTotalMinutes).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("supports multiple shifts per day", () => {
    const result = calculateTimeCard({
      days: [
        {
          dateOrLabel: "Split",
          shifts: [
            { clockIn: "09:00", clockOut: "12:00" },
            { clockIn: "13:00", clockOut: "17:00" },
          ],
        },
      ],
    });
    expect(result.weeklyTotalMinutes).toBe(7 * 60);
  });
});

describe("work-hours family", () => {
  it("calculateWorkHours nets out the break", () => {
    const r = calculateWorkHours({ startTime: "09:00", endTime: "17:30", breakMinutes: 30 });
    expect(r.netMinutes).toBe(8 * 60);
    expect(r.decimalHours).toBe(8);
    expect(r.formattedDuration).toBe("8:00");
  });

  it("calculateDurationBetweenTimes handles midnight wrap", () => {
    const r = calculateDurationBetweenTimes({ startTime: "23:00", endTime: "01:30" });
    expect(r.minutes).toBe(150);
    expect(r.hoursDecimal).toBe(2.5);
    expect(r.hoursMinutes).toBe("2h 30m");
  });

  it("calculateWorkHoursWithBreak uses an explicit break window", () => {
    const r = calculateWorkHoursWithBreak({
      clockIn: "08:00",
      clockOut: "17:00",
      breakStart: "12:00",
      breakEnd: "12:45",
    });
    expect(r.breakMinutes).toBe(45);
    expect(r.netMinutes).toBe(9 * 60 - 45);
  });

  it("calculateTimeClock totals a punch list", () => {
    const r = calculateTimeClock([
      { clockIn: "09:00", clockOut: "12:00" },
      { clockIn: "12:30", clockOut: "17:00", breakMinutes: 0 },
    ]);
    expect(r.totalMinutes).toBe(3 * 60 + 4 * 60 + 30);
    expect(r.totalDecimalHours).toBe(7.5);
  });
});

describe("conversions", () => {
  it("minutesToDecimalHours", () => {
    expect(minutesToDecimalHours(90).rounded2).toBe(1.5);
    expect(minutesToDecimalHours(20).rounded2).toBe(0.33);
  });
  it("decimalHoursToTime", () => {
    expect(decimalHoursToTime(1.5)).toMatchObject({ hours: 1, minutes: 30, formatted: "1:30" });
    expect(decimalHoursToTime(8.25).formatted).toBe("8:15");
  });
  it("addHoursAndMinutes adds and subtracts", () => {
    const r = addHoursAndMinutes([
      { hours: 8, minutes: 30 },
      { hours: 1, minutes: 45, operation: "subtract" },
    ]);
    expect(r.formatted).toBe("6:45");
  });
});

describe("weekly + overtime", () => {
  it("calculateWeeklyHours", () => {
    const r = calculateWeeklyHours({ dailyHours: [8, 8, 8, 8, 10], overtimeThresholdHours: 40, hourlyRate: 10 });
    expect(r.totalHours).toBe(42);
    expect(r.overtimeHours).toBe(2);
    // 40*10 + 2*10*1.5 = 430
    expect(r.estimatedGrossPay).toBe(430);
  });
  it("calculateOvertime", () => {
    const r = calculateOvertime({ totalHours: 45, hourlyRate: 20 });
    expect(r.overtimeHours).toBe(5);
    expect(r.totalPay).toBe(40 * 20 + 5 * 20 * 1.5);
  });
});

describe("pay conversions", () => {
  it("hourlyToSalary", () => {
    const r = hourlyToSalary({ hourlyRate: 25, hoursPerWeek: 40, weeksPerYear: 52 });
    expect(r.weekly).toBe(1000);
    expect(r.annual).toBe(52000);
  });
  it("salaryToHourly round-trips approximately", () => {
    const r = salaryToHourly({ annualSalary: 52000, hoursPerWeek: 40, weeksPerYear: 52 });
    expect(r.hourlyRate).toBe(25);
  });
});

describe("business days", () => {
  it("counts business days inclusive of both ends", () => {
    // Mon 2024-01-01 .. Sun 2024-01-07 => Mon-Fri = 5 (Jan 1 is a Monday)
    const r = calculateBusinessDays({ startDate: "2024-01-01", endDate: "2024-01-07" });
    expect(r.businessDays).toBe(5);
    expect(r.calendarDays).toBe(7);
    expect(r.excludedWeekendDays).toBe(2);
  });
  it("excludes holidays", () => {
    const r = calculateBusinessDays({
      startDate: "2024-01-01",
      endDate: "2024-01-05",
      holidays: ["2024-01-01"],
    });
    expect(r.businessDays).toBe(4);
    expect(r.excludedHolidays).toBe(1);
  });
  it("reverses a backwards range and warns", () => {
    const r = calculateBusinessDays({ startDate: "2024-01-07", endDate: "2024-01-01" });
    expect(r.businessDays).toBe(5);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("workdaysRemaining to year end", () => {
    const r = workdaysRemaining({ fromDate: "2024-12-30" }); // Mon+Tue business, Wed=Jan1
    // 2024-12-30 Mon, 12-31 Tue -> 2 business days (both included, to 12-31)
    expect(r.workdaysRemaining).toBe(2);
    expect(r.yearEnd).toBe("2024-12-31");
  });
});

describe("freelance", () => {
  it("calculateBillableHours rounds up to increment", () => {
    const r = calculateBillableHours({
      entries: [{ startTime: "09:00", endTime: "09:50" }],
      billingIncrementMinutes: 15,
      hourlyRate: 60,
    });
    expect(r.billableMinutes).toBe(60); // 50 -> next 15 = 60
    expect(r.estimatedRevenue).toBe(60);
  });
  it("calculateProjectHours computes shares", () => {
    const r = calculateProjectHours({
      tasks: [
        { label: "Design", hours: 3 },
        { label: "Build", hours: 9 },
      ],
      hourlyRate: 50,
    });
    expect(r.totalHours).toBe(12);
    expect(r.estimatedRevenue).toBe(600);
    expect(r.breakdown[0].share).toBe(25);
  });
});
