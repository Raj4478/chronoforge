"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateTimeCard, type DayInput } from "@/calculators/timeCard";
import { formatHhMm } from "@/lib/time/core";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricTile, DataChip } from "@/components/ui/primitives";
import { NumberField, Toggle, Warnings } from "./fields";
import { ActionsBar, CopyButton, PrintButton } from "./ResultActions";
import { STORAGE_KEYS, readJSON, writeJSON, removeKey, DEFAULT_PREFERENCES, type Preferences } from "@/lib/storage/local";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/cn";

const DEFAULT_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface EditableShift {
  clockIn: string;
  clockOut: string;
  breakMinutes: number | "";
}
interface EditableDay {
  dateOrLabel: string;
  shifts: EditableShift[];
  reminder?: string;
}

function blankShift(): EditableShift {
  return { clockIn: "", clockOut: "", breakMinutes: "" };
}
function defaultDays(): EditableDay[] {
  return DEFAULT_LABELS.slice(0, 5).map((label) => ({ dateOrLabel: label, shifts: [blankShift()], reminder: "" }));
}

const timeInput =
  "cf-tabular w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-2.5 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/30";

const reminderInput =
  "w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20";

export function TimeCardCalculator() {
  const [days, setDays] = useState<EditableDay[]>(defaultDays);
  const [threshold, setThreshold] = useState<number | "">(40);
  const [rate, setRate] = useState<number | "">("");
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loadedTemplate, setLoadedTemplate] = useState(false);

  // Restore a saved template + preferences on first mount (local-only).
  useEffect(() => {
    const p = readJSON<Preferences>(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES);
    setPrefs(p);
    if (p.rememberSchedule) {
      const tpl = readJSON<{ days: EditableDay[]; threshold: number | "" } | null>(STORAGE_KEYS.timecardTemplate, null);
      if (tpl?.days?.length) {
        setDays(tpl.days.map((day) => ({ ...day, reminder: day.reminder ?? "" })));
        if (tpl.threshold !== undefined) setThreshold(tpl.threshold);
        setLoadedTemplate(true);
        track("local_template_loaded", { calculator_id: "time_card" });
      }
    }
  }, []);

  const result = useMemo(() => {
    const clean: DayInput[] = days.map((d) => ({
      dateOrLabel: d.dateOrLabel,
      shifts: d.shifts.map((s) => ({
        clockIn: s.clockIn,
        clockOut: s.clockOut,
        breakMinutes: s.breakMinutes === "" ? 0 : Number(s.breakMinutes),
      })),
    }));
    return calculateTimeCard({
      days: clean,
      overtimeThresholdHours: threshold === "" ? 40 : Number(threshold),
      hourlyRate: rate === "" ? null : Number(rate),
    });
  }, [days, threshold, rate]);

  function updateShift(di: number, si: number, patch: Partial<EditableShift>) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === di ? { ...d, shifts: d.shifts.map((s, j) => (j === si ? { ...s, ...patch } : s)) } : d,
      ),
    );
  }

  function updateReminder(di: number, reminder: string) {
    setDays((prev) => prev.map((day, i) => (i === di ? { ...day, reminder } : day)));
  }

  function addShift(di: number) {
    setDays((prev) => prev.map((d, i) => (i === di ? { ...d, shifts: [...d.shifts, blankShift()] } : d)));
    track("shift_added", { calculator_id: "time_card" });
  }
  function removeShift(di: number, si: number) {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== di) return d;
        const next = d.shifts.filter((_, j) => j !== si);
        return { ...d, shifts: next.length ? next : [blankShift()] };
      }),
    );
  }
  function addDay() {
    setDays((prev) => {
      if (prev.length >= 7) return prev;
      const label = DEFAULT_LABELS[prev.length] ?? `Day ${prev.length + 1}`;
      return [...prev, { dateOrLabel: label, shifts: [blankShift()], reminder: "" }];
    });
  }
  function reset() {
    setDays(defaultDays());
    setThreshold(40);
    setRate("");
  }

  function setRemember(v: boolean) {
    const next = { ...prefs, rememberSchedule: v };
    setPrefs(next);
    writeJSON(STORAGE_KEYS.preferences, next);
    if (!v) removeKey(STORAGE_KEYS.timecardTemplate);
  }
  function saveTemplate() {
    setRemember(true);
    writeJSON(STORAGE_KEYS.timecardTemplate, { days, threshold });
    setLoadedTemplate(true);
    track("local_template_saved", { calculator_id: "time_card" });
  }

  const copyText = () => {
    const lines = ["ChronoForge time card", ...result.dailyDurations.map((d) => `${d.dateOrLabel}: ${d.formatted} (${d.decimalHours}h)`)];
    lines.push(`Total: ${formatHhMm(result.weeklyTotalMinutes)} (${result.weeklyTotalDecimalHours}h)`);
    lines.push(`Regular: ${result.regularHours}h · Overtime: ${result.overtimeHours}h`);
    if (result.estimatedGrossPay != null) lines.push(`Estimated gross pay: $${result.estimatedGrossPay.toFixed(2)}`);
    return lines.join("\n");
  };

  const shareText = () => {
    const lines = ["CHRONOFORGE · WEEKLY WORK SCHEDULE", "────────────────────────────"];

    days.forEach((day, di) => {
      const completed = day.shifts.filter((shift) => shift.clockIn && shift.clockOut);
      const reminder = day.reminder?.trim();
      if (!completed.length && !reminder) return;

      lines.push(day.dateOrLabel.toUpperCase());
      completed.forEach((shift, si) => {
        const breakMinutes = shift.breakMinutes === "" ? 0 : Number(shift.breakMinutes);
        const shiftLabel = completed.length > 1 ? `Shift ${si + 1} · ` : "";
        lines.push(`${shiftLabel}${shift.clockIn} → ${shift.clockOut}  ·  ${breakMinutes} min break`);
      });

      const daily = result.dailyDurations[di];
      if (completed.length && daily) lines.push(`Worked: ${daily.formatted}`);
      if (reminder) lines.push(`Reminder: ${reminder}`);
      lines.push("");
    });

    lines.push("WEEKLY SUMMARY");
    lines.push(`Total ${formatHhMm(result.weeklyTotalMinutes)}  ·  Regular ${result.regularHours}h  ·  Overtime ${result.overtimeHours}h`);
    return lines.join("\n").trim();
  };

  const perDay = result.dailyDurations;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* Inputs */}
      <GlassCard className="cf-print-clean p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Your week</h3>
          {loadedTemplate && <DataChip tone="success">Loaded saved schedule</DataChip>}
        </div>

        <div className="space-y-3">
          {days.map((day, di) => (
            <div key={di} className="rounded-xl border border-[var(--border)] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-primary)]">{day.dateOrLabel}</span>
                <span className="cf-tabular text-sm text-[var(--text-secondary)]">{perDay[di]?.formatted ?? "0:00"}</span>
              </div>
              <div className="space-y-2">
                {day.shifts.map((shift, si) => (
                  <div key={si} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                    <label className="sr-only" htmlFor={`in-${di}-${si}`}>{day.dateOrLabel} shift {si + 1} clock in</label>
                    <input id={`in-${di}-${si}`} type="time" value={shift.clockIn} onChange={(e) => updateShift(di, si, { clockIn: e.target.value })} className={timeInput} aria-label="Clock in" />
                    <label className="sr-only" htmlFor={`out-${di}-${si}`}>{day.dateOrLabel} shift {si + 1} clock out</label>
                    <input id={`out-${di}-${si}`} type="time" value={shift.clockOut} onChange={(e) => updateShift(di, si, { clockOut: e.target.value })} className={timeInput} aria-label="Clock out" />
                    <input
                      type="number"
                      min={0}
                      value={shift.breakMinutes}
                      onChange={(e) => updateShift(di, si, { breakMinutes: e.target.value === "" ? "" : Number(e.target.value) })}
                      className={cn(timeInput, "sm:w-24")}
                      placeholder="Break m"
                      aria-label="Break minutes"
                    />
                    <button
                      type="button"
                      onClick={() => removeShift(di, si)}
                      className="cf-no-print inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-2 text-[var(--text-muted)] hover:border-state-danger/50 hover:text-state-danger"
                      aria-label={`Remove shift ${si + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="cf-no-print mt-2 flex items-center justify-between gap-3">
                <button type="button" onClick={() => addShift(di)} className="text-xs font-semibold text-accent-violet hover:underline">
                  + Add shift
                </button>
                <span className="text-[11px] text-[var(--text-muted)]">Optional note · included when shared</span>
              </div>

              <div className="cf-no-print mt-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/40 p-2.5">
                <label htmlFor={`reminder-${di}`} className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                  Reminder / note
                </label>
                <textarea
                  id={`reminder-${di}`}
                  value={day.reminder ?? ""}
                  onChange={(e) => updateReminder(di, e.target.value)}
                  className={reminderInput}
                  rows={2}
                  maxLength={240}
                  placeholder="e.g. Team meeting at 4 PM, bring access card, submit timesheet before leaving…"
                  aria-label={`${day.dateOrLabel} reminder or note`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="cf-no-print mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={addDay} disabled={days.length >= 7} className="rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-accent-violet disabled:opacity-40">
            + Add day
          </button>
          <button type="button" onClick={reset} className="rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-accent-violet">
            Reset
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <NumberField label="Overtime threshold (hrs/week)" value={threshold} onChange={setThreshold} min={0} step={1} />
          <NumberField label="Hourly rate (optional)" value={rate} onChange={setRate} min={0} step={0.01} prefix="$" placeholder="0.00" />
        </div>
      </GlassCard>

      {/* Results */}
      <div className="space-y-4">
        <GlassCard className="cf-print-clean p-4 sm:p-5" glow>
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Total hours" value={formatHhMm(result.weeklyTotalMinutes)} sub={`${result.weeklyTotalDecimalHours} decimal`} highlight />
            <MetricTile label="Regular" value={`${result.regularHours}h`} />
            <MetricTile label="Overtime" value={`${result.overtimeHours}h`} />
            <MetricTile
              label="Est. gross pay"
              value={result.estimatedGrossPay != null ? `$${result.estimatedGrossPay.toFixed(2)}` : "—"}
              sub={result.estimatedGrossPay != null ? "1.5× on overtime" : "add a rate"}
            />
          </div>

          <div className="mt-4">
            <Warnings items={result.warnings} />
          </div>

          <ActionsBar>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyButton getText={copyText} getShareText={shareText} calculatorId="time_card" />
              <PrintButton calculatorId="time_card" />
              <button type="button" onClick={saveTemplate} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-semibold text-white shadow-glow">
                Save locally
              </button>
            </div>
          </ActionsBar>
          <p className="cf-no-print mt-2 text-xs text-[var(--text-muted)]">
            Share result includes your completed shifts, day notes, weekly totals, and the ChronoForge calculator link. Hourly rate and estimated pay are not shared.
          </p>
        </GlassCard>

        <GlassCard className="cf-no-print p-4">
          <Toggle label="Remember my schedule on this device" checked={prefs.rememberSchedule} onChange={setRemember} />
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Saved only in this browser — never uploaded. Your hourly rate is not stored. Saved reminders stay with your local schedule.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
