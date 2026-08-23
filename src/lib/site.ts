/**
 * Global site configuration. Single source of truth for brand + environment.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://chronoforge.app";

/** Canonical origin with no trailing slash. */
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

/** Only the production custom domain should be indexable. */
export const ALLOW_INDEX = process.env.NEXT_PUBLIC_ALLOW_INDEX === "true";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

export const ENABLE_CONSENT_BANNER =
  process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER !== "false";

export const site = {
  name: "ChronoForge",
  shortName: "ChronoForge",
  positioning: "The fastest way to calculate, track, and understand work time.",
  tagline: "Clock in. Calculate. Move on.",
  description:
    "Free, private work-time calculators: time cards, work hours, breaks, overtime, decimal conversions, and pay — all in your browser.",
  locale: "en-US",
  twitter: "@chronoforge",
  publisher: "ChronoForge",
  lastReviewed: "2026-08-23",
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
