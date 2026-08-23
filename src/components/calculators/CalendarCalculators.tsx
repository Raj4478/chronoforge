"use client";

import { useMemo, useState } from "react";
import { calculateBusinessDays, workdaysRemaining } from "@/calculators/businessDays";
import { MetricTile } from "@/components/ui/primitives";
import { DateField, Toggle, Warnings } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { CalcLayout } from "./CalcLayout";

function HolidayList({ holidays, setHolidays }: { holidays: string[]; setHolidays: (h: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Holidays (optional)</span>
      <div className="flex gap-2">
        <input type="date" value={draft} onChange={(e) => setDraft(e.target.value)} className="cf-tabular flex-1 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-3 py-2 text-sm outline-none focus:border-accent-violet" aria-label="Add holiday date" />
        <button type="button" onClick={() => { if (draft && !holidays.includes(draft)) { setHolidays([...holidays, draft].sort()); setDraft(""); } }} className="cf-no-print rounded-lg border border-[var(--border-strong)] px-3 text-sm font-medium text-accent-violet">
          Add
        </button>
      </div>
      {holidays.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {holidays.map((h) => (
            <li key={h}>
              <button type="button" onClick={() => setHolidays(holidays.filter((x) => x !== h))} className="cf-tabular inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-secondary)] hover:border-state-danger/50 hover:text-state-danger">
                {h} ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BusinessDaysCalculator() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");
  const [includeStart, setIncludeStart] = useState(true);
  const [includeEnd, setIncludeEnd] = useState(true);
  const [holidays, setHolidays] = useState<string[]>([]);

  const r = useMemo(
    () => calculateBusinessDays({ startDate, endDate, includeStart, includeEnd, holidays }),
    [startDate, endDate, includeStart, includeEnd, holidays],
  );

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <DateField label="Start date" value={startDate} onChange={setStartDate} />
            <DateField label="End date" value={endDate} onChange={setEndDate} />
          </div>
          <div className="flex flex-col gap-2">
            <Toggle label="Include start date" checked={includeStart} onChange={setIncludeStart} />
            <Toggle label="Include end date" checked={includeEnd} onChange={setIncludeEnd} />
          </div>
          <HolidayList holidays={holidays} setHolidays={setHolidays} />
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Business days" value={r.businessDays} sub={`${r.calendarDays} calendar days`} highlight />
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Weekend days" value={r.excludedWeekendDays} />
            <MetricTile label="Holidays" value={r.excludedHolidays} />
          </div>
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="business_days" getText={() => `${r.businessDays} business days`} />
            <PrintButton calculatorId="business_days" />
          </ActionsBar>
        </div>
      }
    />
  );
}

export function WorkdaysRemainingCalculator() {
  const [fromDate, setFromDate] = useState("2024-06-01");
  const [holidays, setHolidays] = useState<string[]>([]);

  const r = useMemo(() => workdaysRemaining({ fromDate, holidays }), [fromDate, holidays]);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <DateField label="From date" value={fromDate} onChange={setFromDate} hint="Counts through December 31 of that year." />
          <HolidayList holidays={holidays} setHolidays={setHolidays} />
        </div>
      }
      results={
        <div className="space-y-4">
          <MetricTile label="Workdays remaining" value={r.workdaysRemaining} sub={`through ${r.yearEnd || "year end"}`} highlight />
          <MetricTile label="Calendar days remaining" value={r.calendarDaysRemaining} />
          <Warnings items={r.warnings} />
          <ActionsBar>
            <CopyButton calculatorId="workdays_remaining" getText={() => `${r.workdaysRemaining} workdays left`} />
            <PrintButton calculatorId="workdays_remaining" />
          </ActionsBar>
        </div>
      }
    />
  );
}
