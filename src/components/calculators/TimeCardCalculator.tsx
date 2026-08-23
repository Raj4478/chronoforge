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
const ICS_DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

interface EditableShift {
  clockIn: string;
  clockOut: string;
  breakMinutes: number | "";
}
interface EditableDay {
  dateOrLabel: string;
  shifts: EditableShift[];
}

function blankShift(): EditableShift {
  return { clockIn: "", clockOut: "", breakMinutes: "" };
}
function defaultDays(): EditableDay[] {
  return DEFAULT_LABELS.slice(0, 5).map((label) => ({ dateOrLabel: label, shifts: [blankShift()] }));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localIcsDate(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function utcIcsDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function nextOccurrence(dayIndex: number, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  const jsDay = dayIndex === 6 ? 0 : dayIndex + 1;
  const delta = (jsDay - now.getDay() + 7) % 7;
  target.setDate(now.getDate() + delta);
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 7);
  return target;
}

const timeInput =
  "cf-tabular w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-2.5 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/30";

export function TimeCardCalculator() {
  const [days, setDays] = useState<EditableDay[]>(defaultDays);
  const [threshold, setThreshold] = useState<number | "">(40);
  const [rate, setRate] = useState<number | "">("");
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loadedTemplate, setLoadedTemplate] = useState(false);
  const [reminderAdded, setReminderAdded] = useState(false);

  // Restore a saved template + preferences on first mount (local-only).
  useEffect(() => {
    const p = readJSON<Preferences>(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES);
    setPrefs(p);
    if (p.rememberSchedule) {
      const tpl = readJSON<{ days: EditableDay[]; threshold: number | "" } | null>(STORAGE_KEYS.timecardTemplate, null);
      if (tpl?.days?.length) {
        setDays(tpl.days);
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
      return [...prev, { dateOrLabel: label, shifts: [blankShift()] }];
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
      if (!completed.length) return;
      lines.push(day.dateOrLabel.toUpperCase());
      completed.forEach((shift, si) => {
        const breakMinutes = shift.breakMinutes === "" ? 0 : Number(shift.breakMinutes);
        const shiftLabel = completed.length > 1 ? `Shift ${si + 1} · ` : "";
        lines.push(`${shiftLabel}${shift.clockIn} → ${shift.clockOut}  ·  ${breakMinutes} min break`);
      });
      const daily = result.dailyDurations[di];
      if (daily) lines.push(`Worked: ${daily.formatted}`);
      lines.push("");
    });
    lines.push("WEEKLY SUMMARY");
    lines.push(`Total ${formatHhMm(result.weeklyTotalMinutes)}  ·  Regular ${result.regularHours}h  ·  Overtime ${result.overtimeHours}h`);
    return lines.join("\n").trim();
  };

  function addCalendarReminders() {
    const events: string[] = [];
    const stamp = utcIcsDate(new Date());

    days.forEach((day, di) => {
      day.shifts.forEach((shift, si) => {
        if (!shift.clockIn || !shift.clockOut || di > 6) return;
        const start = nextOccurrence(di, shift.clockIn);
        const end = new Date(start);
        const [outHours, outMinutes] = shift.clockOut.split(":").map(Number);
        end.setHours(outHours, outMinutes, 0, 0);
        if (end <= start) end.setDate(end.getDate() + 1);
        const breakMinutes = shift.breakMinutes === "" ? 0 : Number(shift.breakMinutes);
        const description = `Work schedule from ChronoForge. Break: ${breakMinutes} minutes.`;

        events.push(
          [
            "BEGIN:VEVENT",
            `UID:chronoforge-${di}-${si}-${start.getTime()}@chronoforge`,
            `DTSTAMP:${stamp}`,
            `DTSTART:${localIcsDate(start)}`,
            `DTEND:${localIcsDate(end)}`,
            `RRULE:FREQ=WEEKLY;BYDAY=${ICS_DAYS[di]}`,
            `SUMMARY:Work schedule · ${day.dateOrLabel}`,
            `DESCRIPTION:${description}`,
            "BEGIN:VALARM",
            "TRIGGER:-PT15M",
            "ACTION:DISPLAY",
            `DESCRIPTION:Your ${day.dateOrLabel} shift starts in 15 minutes.`,
            "END:VALARM",
            "END:VEVENT",
          ].join("\r\n"),
        );
      });
    });

    if (!events.length) return;
    const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ChronoForge//Work Schedule//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
    const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "chronoforge-work-schedule.ics";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setReminderAdded(true);
    track("calendar_reminder_downloaded", { calculator_id: "time_card" });
    window.setTimeout(() => setReminderAdded(false), 2000);
  }

  const hasCompletedShift = days.some((day) => day.shifts.some((shift) => shift.clockIn && shift.clockOut));
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
              <button type="button" onClick={() => addShift(di)} className="cf-no-print mt-2 text-xs font-semibold text-accent-violet hover:underline">
                + Add shift
              </button>
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
              <button
                type="button"
                onClick={addCalendarReminders}
                disabled={!hasCompletedShift}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-violet/60 hover:text-accent-violet disabled:cursor-not-allowed disabled:opacity-40"
                title="Add weekly calendar events with a reminder 15 minutes before each shift"
              >
                {reminderAdded ? "Calendar ready ✓" : "Add reminders"}
              </button>
              <button type="button" onClick={saveTemplate} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-semibold text-white shadow-glow">
                Save locally
              </button>
            </div>
          </ActionsBar>
          <p className="cf-no-print mt-2 text-xs text-[var(--text-muted)]">
            Add reminders creates a private weekly calendar file with a 15-minute alert before each completed shift.
          </p>
        </GlassCard>

        <GlassCard className="cf-no-print p-4">
          <Toggle label="Remember my schedule on this device" checked={prefs.rememberSchedule} onChange={setRemember} />
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Saved only in this browser — never uploaded. Your hourly rate is not stored.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
