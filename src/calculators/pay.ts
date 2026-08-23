/**
 * Pay conversions. These are arithmetic estimates only — they do not account
 * for taxes, benefits, or withholdings.
 */

import { roundTo } from "@/lib/time/core";

export interface HourlyToSalaryInput {
  hourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear?: number; // default 52
}

export interface HourlyToSalaryResult {
  weekly: number;
  monthlyAverage: number;
  annual: number;
}

export function hourlyToSalary(input: HourlyToSalaryInput): HourlyToSalaryResult {
  const rate = Math.max(0, input.hourlyRate || 0);
  const hours = Math.max(0, input.hoursPerWeek || 0);
  const weeks = Math.max(0, input.weeksPerYear ?? 52);

  const weekly = rate * hours;
  const annual = weekly * weeks;
  return {
    weekly: roundTo(weekly, 2),
    monthlyAverage: roundTo(annual / 12, 2),
    annual: roundTo(annual, 2),
  };
}

export interface SalaryToHourlyInput {
  annualSalary: number;
  hoursPerWeek: number;
  weeksPerYear?: number; // default 52
}

export interface SalaryToHourlyResult {
  hourlyRate: number;
  weekly: number;
  monthlyAverage: number;
}

export function salaryToHourly(input: SalaryToHourlyInput): SalaryToHourlyResult {
  const salary = Math.max(0, input.annualSalary || 0);
  const hours = Math.max(0, input.hoursPerWeek || 0);
  const weeks = Math.max(1, input.weeksPerYear ?? 52); // avoid divide-by-zero

  const totalHours = hours * weeks;
  const hourlyRate = totalHours > 0 ? salary / totalHours : 0;
  return {
    hourlyRate: roundTo(hourlyRate, 2),
    weekly: roundTo(salary / weeks, 2),
    monthlyAverage: roundTo(salary / 12, 2),
  };
}
