"use client";

import { useMemo, useState } from "react";
import { calculateWeeklyHours, calculateOvertime } from "@/calculators/weekly";
import { MetricTile } from "@/components/ui/primitives";
import { NumberField } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { CalcLayout } from "./CalcLayout";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyHoursCalculator() {
  const [hours, setHours] = useState<(number | "")[]>([8, 8, 8, 8, 8, "", ""]);
  const [threshold, setThreshold] = useState<number | "">(40);
  const [rate, setRate] = useState<number | "">("");

  const r = useMemo(
    () =>
      calculateWeeklyHours({
        dailyHours: hours.map((h) => (h === "" ? 0 : Number(h))),
        overtimeThresholdHours: threshold === "" ? 40 : Number(threshold),
        hourlyRate: rate === "" ? null : Number(rate),
      }),
    [hours, threshold, rate],
  );

  const dayInput = "cf-tabular w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-2 py-2 text-center text-sm outline-none focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/30";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((d, i) => (
              <div key={d} className="space-y-1">
                <label htmlFor={`d-${i}`} className="block text-center text-[10px] font-semibold uppercase text-[var(--text-muted)]">{d}</label>
                <input id={`d-${i}`} type="number" min={0} step={0.25} value={hours[i]} onChange={(e) => setHours((prev) => prev.map((h, j) => (j === i ? (e.target.value === "" ? "" : Number(e.target.value)) : h)))} className={dayInput} aria-label={`${d} hours`} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="OT threshold (hrs)" value={threshold} onChange={setThreshold} min={0} />
            <NumberField label="Hourly rate" value={rate} onChange={setRate} min={0} step={0.01} prefix="$" placeholder="0.00" />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Total" value={`${r.totalHours}h`} highlight />
            <MetricTile label="Regular" value={`${r.regularHours}h`} />
            <MetricTile label="Overtime" value={`${r.overtimeHours}h`} />
            <MetricTile label="Est. pay" value={r.estimatedGrossPay != null ? `$${r.estimatedGrossPay.toFixed(2)}` : "—"} />
          </div>
          <ActionsBar>
            <CopyButton calculatorId="weekly_hours" getText={() => `Total ${r.totalHours}h (reg ${r.regularHours}, OT ${r.overtimeHours})`} />
            <PrintButton calculatorId="weekly_hours" />
          </ActionsBar>
        </div>
      }
    />
  );
}

export function OvertimeCalculator() {
  const [total, setTotal] = useState<number | "">(45);
  const [threshold, setThreshold] = useState<number | "">(40);
  const [rate, setRate] = useState<number | "">(20);
  const [multiplier, setMultiplier] = useState<number | "">(1.5);

  const r = useMemo(
    () =>
      calculateOvertime({
        totalHours: total === "" ? 0 : Number(total),
        overtimeThresholdHours: threshold === "" ? 40 : Number(threshold),
        hourlyRate: rate === "" ? null : Number(rate),
        overtimeMultiplier: multiplier === "" ? 1.5 : Number(multiplier),
      }),
    [total, threshold, rate, multiplier],
  );

  return (
    <CalcLayout
      inputs={
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Total hours" value={total} onChange={setTotal} min={0} step={0.25} />
          <NumberField label="OT threshold" value={threshold} onChange={setThreshold} min={0} />
          <NumberField label="Hourly rate" value={rate} onChange={setRate} min={0} step={0.01} prefix="$" />
          <NumberField label="OT multiplier" value={multiplier} onChange={setMultiplier} min={1} step={0.1} suffix="×" />
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Overtime hours" value={`${r.overtimeHours}h`} highlight />
            <MetricTile label="Regular hours" value={`${r.regularHours}h`} />
            <MetricTile label="OT pay" value={r.overtimePay != null ? `$${r.overtimePay.toFixed(2)}` : "—"} />
            <MetricTile label="Total pay" value={r.totalPay != null ? `$${r.totalPay.toFixed(2)}` : "—"} />
          </div>
          <ActionsBar>
            <CopyButton calculatorId="overtime" getText={() => `OT ${r.overtimeHours}h, total pay ${r.totalPay != null ? "$" + r.totalPay.toFixed(2) : "n/a"}`} />
            <PrintButton calculatorId="overtime" />
          </ActionsBar>
        </div>
      }
    />
  );
}
