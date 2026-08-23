/**
 * Consent-aware GA4 event helper.
 *
 * PRIVACY: never send raw time-card values, hourly rate, or any personal data
 * as event parameters. Only send safe, low-cardinality dimensions.
 */

import { GA_MEASUREMENT_ID } from "@/lib/site";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent =
  | "calculator_view"
  | "calculation_started"
  | "calculation_completed"
  | "calculation_error"
  | "shift_added"
  | "break_added"
  | "local_template_saved"
  | "local_template_loaded"
  | "copy_result"
  | "share_result"
  | "calendar_reminder_downloaded"
  | "print_result"
  | "related_tool_clicked"
  | "time_format_changed"
  | "theme_changed";

// Allow-list of parameter keys that are safe to send.
const SAFE_KEYS = new Set([
  "calculator_id",
  "time_format",
  "has_break",
  "shift_count",
  "visitor_country",
  "share_method",
]);

function sanitize(params: GtagParams): GtagParams {
  const out: GtagParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (SAFE_KEYS.has(k) && v !== undefined) out[k] = v;
  }
  return out;
}

export function track(event: AnalyticsEvent, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, sanitize(params));
}
