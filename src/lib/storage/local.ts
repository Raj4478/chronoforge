/**
 * Local-first persistence. Everything stays on the user's device — no accounts,
 * no server. Never store hourly rate unless the user explicitly opts in, and
 * never store names/employer data.
 */

export const STORAGE_KEYS = {
  preferences: "chronoforge.preferences",
  timecardTemplate: "chronoforge.timecard.template",
  recentTools: "chronoforge.recent-tools",
  theme: "chronoforge.theme",
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — fail silently, the app still works */
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Clear every ChronoForge key (used by the "clear saved data" control). */
export function clearAll(): void {
  Object.values(STORAGE_KEYS).forEach(removeKey);
}

export interface Preferences {
  timeFormat: "12h" | "24h";
  weekStart: "Monday" | "Sunday";
  rememberSchedule: boolean;
  persistRate: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  timeFormat: "12h",
  weekStart: "Monday",
  rememberSchedule: false,
  persistRate: false,
};
