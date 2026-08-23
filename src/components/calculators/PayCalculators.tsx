"use client";

import { useMemo, useState } from "react";
import { hourlyToSalary, salaryToHourly } from "@/calculators/pay";
import { MetricTile } from "@/components/ui/primitives";
import { NumberField } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { CalcLayout } from "./CalcLayout";

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function HourlyToSalaryCalculator() {
  const [rate, setRate] = useState<number | "">(25);
  const [hpw, setHpw] = useState<number | "">(40);
  const [wpy, setWpy] = useState<number | "">(52);

  const r = useMemo(
    () =>
      hourlyToSalary({
        hourlyRate: rate === "" ? 0 : Number(rate),
        hoursPerWeek: hpw === "" ? 0 : Number(hpw),
        weeksPerYear: wpy === "" ? 52 : Number(wpy),
      }),
    [rate, hpw, wpy],
  );

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          <NumberField label="Hourly rate" value={rate} onChange={setRate} min={0} step={0.01} prefix="$" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Hours / week" value={hpw} onChange={setHpw} min={0} step={0.5} />
            <NumberField label="Weeks / year" value={wpy} onChange={setWpy} min={1} max={53} />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Annual salary" value={usd(r.annual)} sub="before taxes" highlight />
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Weekly" value={usd(r.weekly)} />
            <MetricTile label="Monthly avg" value={usd(r.monthlyAverage)} />
          </div>
          <ActionsBar>
            <CopyButton calculatorId="hourly_to_salary" getText={() => `${usd(r.annual)}/yr (${usd(r.weekly)}/wk)`} />
            <PrintButton calculatorId="hourly_to_salary" />
          </ActionsBar>
        </div>
      }
    />
  );
}

export function SalaryToHourlyCalculator() {
  const [salary, setSalary] = useState<number | "">(52000);
  const [hpw, setHpw] = useState<number | "">(40);
  const [wpy, setWpy] = useState<number | "">(52);

  const r = useMemo(
    () =>
      salaryToHourly({
        annualSalary: salary === "" ? 0 : Number(salary),
        hoursPerWeek: hpw === "" ? 0 : Number(hpw),
        weeksPerYear: wpy === "" ? 52 : Number(wpy),
      }),
    [salary, hpw, wpy],
  );

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          <NumberField label="Annual salary" value={salary} onChange={setSalary} min={0} step={100} prefix="$" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Hours / week" value={hpw} onChange={setHpw} min={0} step={0.5} />
            <NumberField label="Weeks / year" value={wpy} onChange={setWpy} min={1} max={53} />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Hourly rate" value={usd(r.hourlyRate)} sub="before taxes" highlight />
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Weekly" value={usd(r.weekly)} />
            <MetricTile label="Monthly avg" value={usd(r.monthlyAverage)} />
          </div>
          <ActionsBar>
            <CopyButton calculatorId="salary_to_hourly" getText={() => `${usd(r.hourlyRate)}/hr`} />
            <PrintButton calculatorId="salary_to_hourly" />
          </ActionsBar>
        </div>
      }
    />
  );
}
