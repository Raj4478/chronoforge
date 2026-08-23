"use client";

import { useMemo, useState } from "react";
import { calculateBillableHours, calculateProjectHours, type BillableEntry } from "@/calculators/freelance";
import { MetricTile } from "@/components/ui/primitives";
import { TimeField, NumberField, Warnings } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { CalcLayout } from "./CalcLayout";

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function BillableHoursCalculator() {
  const [entries, setEntries] = useState<BillableEntry[]>([{ startTime: "09:00", endTime: "12:30", breakMinutes: 0 }]);
  const [rate, setRate] = useState<number | "">(75);
  const [increment, setIncrement] = useState<number | "">(15);

  const r = useMemo(
    () =>
      calculateBillableHours({
        entries,
        hourlyRate: rate === "" ? null : Number(rate),
        billingIncrementMinutes: increment === "" ? 1 : Number(increment),
      }),
    [entries, rate, increment],
  );

  function update(i: number, patch: Partial<BillableEntry>) {
    setEntries((prev) => prev.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          {entries.map((e, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <TimeField label={`Entry ${i + 1} start`} value={e.startTime} onChange={(v) => update(i, { startTime: v })} />
              <TimeField label="End" value={e.endTime} onChange={(v) => update(i, { endTime: v })} />
              <button type="button" onClick={() => setEntries((prev) => (prev.length > 1 ? prev.filter((_, j) => j !== i) : prev))} className="cf-no-print mb-1 h-9 w-9 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-state-danger/50 hover:text-state-danger" aria-label={`Remove entry ${i + 1}`}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setEntries((prev) => [...prev, { startTime: "", endTime: "", breakMinutes: 0 }])} className="cf-no-print text-xs font-semibold text-accent-violet hover:underline">
            + Add entry
          </button>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <NumberField label="Hourly rate" value={rate} onChange={setRate} min={0} step={0.01} prefix="$" />
            <NumberField label="Round to (min)" value={increment} onChange={setIncrement} min={1} step={1} suffix="min" />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Billable hours" value={`${r.billableDecimalHours}h`} sub={r.formatted} highlight />
          <MetricTile label="Estimated revenue" value={r.estimatedRevenue != null ? usd(r.estimatedRevenue) : "—"} />
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="billable_hours" getText={() => `${r.billableDecimalHours}h billable${r.estimatedRevenue != null ? " = " + usd(r.estimatedRevenue) : ""}`} />
            <PrintButton calculatorId="billable_hours" />
          </ActionsBar>
        </div>
      }
    />
  );
}

interface Task {
  label: string;
  hours: number | "";
}

export function ProjectHoursCalculator() {
  const [tasks, setTasks] = useState<Task[]>([
    { label: "Design", hours: 3 },
    { label: "Build", hours: 9 },
  ]);
  const [rate, setRate] = useState<number | "">(50);

  const r = useMemo(
    () =>
      calculateProjectHours({
        tasks: tasks.map((t) => ({ label: t.label || "Task", hours: t.hours === "" ? 0 : Number(t.hours) })),
        hourlyRate: rate === "" ? null : Number(rate),
      }),
    [tasks, rate],
  );

  function update(i: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  }

  const inp = "w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-2.5 py-2 text-sm outline-none focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/30";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
              <input value={t.label} onChange={(e) => update(i, { label: e.target.value })} className={inp} aria-label={`Task ${i + 1} name`} placeholder="Task name" />
              <input type="number" min={0} step={0.25} value={t.hours} onChange={(e) => update(i, { hours: e.target.value === "" ? "" : Number(e.target.value) })} className={`${inp} cf-tabular w-24 text-center`} aria-label={`Task ${i + 1} hours`} placeholder="hrs" />
              <button type="button" onClick={() => setTasks((prev) => (prev.length > 1 ? prev.filter((_, j) => j !== i) : prev))} className="cf-no-print h-9 w-9 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-state-danger/50 hover:text-state-danger" aria-label={`Remove task ${i + 1}`}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setTasks((prev) => [...prev, { label: "", hours: 0 }])} className="cf-no-print text-xs font-semibold text-accent-violet hover:underline">
            + Add task
          </button>
          <NumberField label="Hourly rate" value={rate} onChange={setRate} min={0} step={0.01} prefix="$" />
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Project total" value={`${r.totalHours}h`} sub={r.estimatedRevenue != null ? usd(r.estimatedRevenue) : undefined} highlight />
          <ul className="space-y-1.5">
            {r.breakdown.map((b, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{b.label}</span>
                <span className="cf-tabular text-[var(--text-primary)]">{b.hours}h · {b.share}%</span>
              </li>
            ))}
          </ul>
          <ActionsBar>
            <CopyButton calculatorId="project_hours" getText={() => `${r.totalHours}h total${r.estimatedRevenue != null ? " = " + usd(r.estimatedRevenue) : ""}`} />
            <PrintButton calculatorId="project_hours" />
          </ActionsBar>
        </div>
      }
    />
  );
}
