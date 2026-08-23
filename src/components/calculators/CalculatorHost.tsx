"use client";

import { useEffect } from "react";
import type { CalculatorKey } from "@/lib/tools";
import { track } from "@/lib/analytics/events";
import { TimeCardCalculator } from "./TimeCardCalculator";
import {
  WorkHoursCalculator,
  HoursBetweenCalculator,
  WorkHoursLunchCalculator,
  TimeClockCalculator,
} from "./WorkHoursCalculators";
import {
  MinutesToDecimalCalculator,
  DecimalToTimeCalculator,
  HoursAndMinutesCalculator,
} from "./ConversionCalculators";
import { WeeklyHoursCalculator, OvertimeCalculator } from "./WeeklyOvertimeCalculators";
import { HourlyToSalaryCalculator, SalaryToHourlyCalculator } from "./PayCalculators";
import { BusinessDaysCalculator, WorkdaysRemainingCalculator } from "./CalendarCalculators";
import { BillableHoursCalculator, ProjectHoursCalculator } from "./FreelanceCalculators";

const REGISTRY: Record<CalculatorKey, () => JSX.Element> = {
  "time-card": TimeCardCalculator,
  "work-hours": WorkHoursCalculator,
  "hours-between": HoursBetweenCalculator,
  "work-hours-lunch": WorkHoursLunchCalculator,
  "time-clock": TimeClockCalculator,
  "minutes-to-decimal": MinutesToDecimalCalculator,
  "decimal-to-time": DecimalToTimeCalculator,
  "hours-and-minutes": HoursAndMinutesCalculator,
  "weekly-hours": WeeklyHoursCalculator,
  overtime: OvertimeCalculator,
  "hourly-to-salary": HourlyToSalaryCalculator,
  "salary-to-hourly": SalaryToHourlyCalculator,
  "business-days": BusinessDaysCalculator,
  "workdays-remaining": WorkdaysRemainingCalculator,
  "billable-hours": BillableHoursCalculator,
  "project-hours": ProjectHoursCalculator,
};

export function CalculatorHost({ calculator }: { calculator: CalculatorKey }) {
  const Component = REGISTRY[calculator];
  useEffect(() => {
    track("calculator_view", { calculator_id: calculator });
  }, [calculator]);
  return <Component />;
}
