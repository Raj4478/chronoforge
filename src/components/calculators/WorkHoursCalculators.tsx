"use client";

import { useMemo, useState } from "react";
import {
  calculateWorkHours,
  calculateDurationBetweenTimes,
  calculateWorkHoursWithBreak,
  calculateTimeClock,
  type ClockPunch,
} from "@/calculators/workHours";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricTile } from "@/components/ui/primitives";
import { TimeField, NumberField, Warnings } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { formatHhMm } from "@/lib/time/core";
import { cn } from "@/lib/cn";

function Layout({ inputs, results }: { inputs: React.ReactNode; results: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <GlassCard className="cf-print-clean p-4 sm:p-5">{inputs}</GlassCard>
      <GlassCard className="cf-print-clean p-4 sm:p-5" glow>
        {results}
      </GlassCard>
    </div>
  );
}

export function WorkHoursCalculator() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");
  const [brk, setBrk] = useState<number | "">(30);
  const r = useMemo(
    () => calculateWorkHours({ startTime: start, endTime: end, breakMinutes: brk === "" ? 0 : Number(brk) }),
    [start, end, brk],
  );
  return (
    <Layout
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TimeField label="Start" value={start} onChange={setStart} />
            <TimeField label="End" value={end} onChange={setEnd} />
          </div>
          <NumberField label="Break (minutes)" value={brk} onChange={setBrk} min={0} />
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Net hours" value={r.formattedDuration} sub={`${r.decimalHours} decimal`} highlight />
            <MetricTile label="Gross span" value={formatHhMm(r.grossMinutes)} />
          </div>
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="work_hours" getText={() => `${r.formattedDuration} (${r.decimalHours}h)`} />
            <PrintButton calculatorId="work_hours" />
          </ActionsBar>
        </div>
      }
    />
  );
}

export function HoursBetweenCalculator() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const r = useMemo(() => calculateDurationBetweenTimes({ startTime: start, endTime: end }), [start, end]);
  return (
    <Layout
      inputs={
        <div className="grid grid-cols-2 gap-3">
          <TimeField label="Start time" value={start} onChange={setStart} />
          <TimeField label="End time" value={end} onChange={setEnd} hint="Overnight spans are detected automatically." />
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Duration" value={r.hoursMinutes} sub={`${r.hoursDecimal} decimal`} highlight />
            <MetricTile label="Minutes" value={r.minutes} />
          </div>
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="hours_between" getText={() => `${r.hoursMinutes} (${r.hoursDecimal}h)`} />
            <PrintButton calculatorId="hours_between" />
          </ActionsBar>
        </div>
      }
    />
  );
}

export function WorkHoursLunchCalculator() {
  const [clockIn, setClockIn] = useState("08:00");
  const [clockOut, setClockOut] = useState("17:00");
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("12:45");
  const [useWindow, setUseWindow] = useState(true);
  const [breakMinutes, setBreakMinutes] = useState<number | "">(45);

  const r = useMemo(
    () =>
      calculateWorkHoursWithBreak({
        clockIn,
        clockOut,
        breakStart: useWindow ? breakStart : null,
        breakEnd: useWindow ? breakEnd : null,
        breakMinutes: useWindow ? null : breakMinutes === "" ? 0 : Number(breakMinutes),
      }),
    [clockIn, clockOut, breakStart, breakEnd, useWindow, breakMinutes],
  );

  return (
    <Layout
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TimeField label="Clock in" value={clockIn} onChange={setClockIn} />
            <TimeField label="Clock out" value={clockOut} onChange={setClockOut} />
          </div>
          <div className="inline-flex overflow-hidden rounded-lg border border-[var(--border-strong)] text-sm">
            <button type="button" onClick={() => setUseWindow(true)} className={cn("px-3 py-1.5", useWindow ? "bg-brand-gradient text-white" : "text-[var(--text-secondary)]")}>
              Break window
            </button>
            <button type="button" onClick={() => setUseWindow(false)} className={cn("px-3 py-1.5", !useWindow ? "bg-brand-gradient text-white" : "text-[var(--text-secondary)]")}>
              Break minutes
            </button>
          </div>
          {useWindow ? (
            <div className="grid grid-cols-2 gap-3">
              <TimeField label="Break start" value={breakStart} onChange={setBreakStart} />
              <TimeField label="Break end" value={breakEnd} onChange={setBreakEnd} />
            </div>
          ) : (
            <NumberField label="Break (minutes)" value={breakMinutes} onChange={setBreakMinutes} min={0} />
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Net paid" value={r.netWorkDuration} sub={`${r.decimalHours} decimal`} highlight />
            <MetricTile label="Break" value={r.breakDuration} />
            <MetricTile label="Gross" value={r.grossDuration} />
          </div>
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="work_hours_lunch" getText={() => `Net ${r.netWorkDuration} (${r.decimalHours}h), break ${r.breakDuration}`} />
            <PrintButton calculatorId="work_hours_lunch" />
          </ActionsBar>
        </div>
      }
    />
  );
}

interface Punch extends ClockPunch {}

export function TimeClockCalculator() {
  const [punches, setPunches] = useState<Punch[]>([
    { clockIn: "09:00", clockOut: "12:00", breakMinutes: 0 },
    { clockIn: "12:30", clockOut: "17:00", breakMinutes: 0 },
  ]);
  const r = useMemo(() => calculateTimeClock(punches), [punches]);

  function update(i: number, patch: Partial<Punch>) {
    setPunches((prev) => prev.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }

  return (
    <Layout
      inputs={
        <div className="space-y-3">
          {punches.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <TimeField label={`Punch ${i + 1} in`} value={p.clockIn} onChange={(v) => update(i, { clockIn: v })} />
              <TimeField label="Out" value={p.clockOut} onChange={(v) => update(i, { clockOut: v })} />
              <button
                type="button"
                onClick={() => setPunches((prev) => (prev.length > 1 ? prev.filter((_, j) => j !== i) : prev))}
                className="cf-no-print mb-1 inline-flex h-9 items-center justify-center rounded-lg border border-[var(--border)] px-2 text-[var(--text-muted)] hover:border-state-danger/50 hover:text-state-danger"
                aria-label={`Remove punch ${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setPunches((prev) => [...prev, { clockIn: "", clockOut: "", breakMinutes: 0 }])} className="cf-no-print text-xs font-semibold text-accent-violet hover:underline">
            + Add punch
          </button>
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Daily total" value={r.totalFormatted} sub={`${r.totalDecimalHours} decimal hours`} highlight />
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="time_clock" getText={() => `${r.totalFormatted} (${r.totalDecimalHours}h)`} />
            <PrintButton calculatorId="time_clock" />
          </ActionsBar>
        </div>
      }
    />
  );
}
