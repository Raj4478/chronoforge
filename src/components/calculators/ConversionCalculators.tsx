"use client";

import { useMemo, useState } from "react";
import { minutesToDecimalHours, decimalHoursToTime, addHoursAndMinutes, type HoursAndMinutesTerm } from "@/calculators/conversions";
import { MetricTile } from "@/components/ui/primitives";
import { NumberField, Warnings } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { CalcLayout } from "./CalcLayout";
import { cn } from "@/lib/cn";

export function MinutesToDecimalCalculator() {
  const [minutes, setMinutes] = useState<number | "">(90);
  const r = useMemo(() => minutesToDecimalHours(minutes === "" ? 0 : Number(minutes)), [minutes]);
  return (
    <CalcLayout
      inputs={<NumberField label="Minutes" value={minutes} onChange={setMinutes} min={0} step={1} suffix="min" />}
      results={
        <div className="space-y-4">
          <MetricTile label="Decimal hours" value={r.rounded2} sub={`${minutes || 0} minutes`} highlight />
          <ActionsBar>
            <CopyButton calculatorId="minutes_to_decimal" getText={() => String(r.rounded2)} />
            <PrintButton calculatorId="minutes_to_decimal" />
          </ActionsBar>
        </div>
      }
    />
  );
}

export function DecimalToTimeCalculator() {
  const [dec, setDec] = useState<number | "">(7.75);
  const r = useMemo(() => decimalHoursToTime(dec === "" ? 0 : Number(dec)), [dec]);
  return (
    <CalcLayout
      inputs={<NumberField label="Decimal hours" value={dec} onChange={setDec} min={0} step={0.01} suffix="hrs" />}
      results={
        <div className="space-y-4">
          <MetricTile label="Hours & minutes" value={r.formatted} sub={`${r.hours}h ${r.minutes}m`} highlight />
          <ActionsBar>
            <CopyButton calculatorId="decimal_to_time" getText={() => r.formatted} />
            <PrintButton calculatorId="decimal_to_time" />
          </ActionsBar>
        </div>
      }
    />
  );
}

interface Row {
  hours: number | "";
  minutes: number | "";
  operation: "add" | "subtract";
}

export function HoursAndMinutesCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { hours: 8, minutes: 30, operation: "add" },
    { hours: 7, minutes: 15, operation: "add" },
  ]);
  const r = useMemo(() => {
    const terms: HoursAndMinutesTerm[] = rows.map((row) => ({
      hours: row.hours === "" ? 0 : Number(row.hours),
      minutes: row.minutes === "" ? 0 : Number(row.minutes),
      operation: row.operation,
    }));
    return addHoursAndMinutes(terms);
  }, [rows]);

  function update(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }

  const rowInput = "cf-tabular w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-2.5 py-2 text-sm outline-none focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/30";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2">
              <button
                type="button"
                onClick={() => update(i, { operation: row.operation === "add" ? "subtract" : "add" })}
                className={cn("h-9 w-9 rounded-lg border text-lg font-bold", row.operation === "add" ? "border-state-success/50 text-state-success" : "border-state-danger/50 text-state-danger")}
                aria-label={row.operation === "add" ? "Adding — switch to subtract" : "Subtracting — switch to add"}
              >
                {row.operation === "add" ? "+" : "−"}
              </button>
              <input type="number" min={0} value={row.hours} onChange={(e) => update(i, { hours: e.target.value === "" ? "" : Number(e.target.value) })} className={rowInput} aria-label={`Row ${i + 1} hours`} placeholder="h" />
              <input type="number" min={0} max={59} value={row.minutes} onChange={(e) => update(i, { minutes: e.target.value === "" ? "" : Number(e.target.value) })} className={rowInput} aria-label={`Row ${i + 1} minutes`} placeholder="m" />
              <button type="button" onClick={() => setRows((prev) => (prev.length > 1 ? prev.filter((_, j) => j !== i) : prev))} className="cf-no-print h-9 w-9 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-state-danger/50 hover:text-state-danger" aria-label={`Remove row ${i + 1}`}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setRows((prev) => [...prev, { hours: 0, minutes: 0, operation: "add" }])} className="cf-no-print text-xs font-semibold text-accent-violet hover:underline">
            + Add row
          </button>
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Total" value={r.formatted} sub={`${r.decimalHours} decimal hours`} highlight />
          <Warnings items={r.totalMinutes < 0 ? ["The total is negative — you subtracted more than you added."] : []} />
          <ActionsBar>
            <CopyButton calculatorId="hours_and_minutes" getText={() => `${r.formatted} (${r.decimalHours}h)`} />
            <PrintButton calculatorId="hours_and_minutes" />
          </ActionsBar>
        </div>
      }
    />
  );
}
