"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ENABLE_CONSENT_BANNER, GA_MEASUREMENT_ID } from "@/lib/site";

const CONSENT_KEY = "chronoforge.consent";
type Consent = "granted" | "denied" | null;

function loadGa(id: string) {
  if (!id) return;
  if (document.getElementById("cf-ga")) return;
  const s = document.createElement("script");
  s.id = "cf-ga";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

/**
 * Consent-aware analytics. Analytics never loads until the user accepts (or if
 * no GA id / banner is configured, it stays dormant). Choice persists locally.
 */
export function ConsentAnalytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: Consent = null;
    try {
      stored = window.localStorage.getItem(CONSENT_KEY) as Consent;
    } catch {
      /* ignore */
    }
    setConsent(stored);

    if (stored === "granted") {
      loadGa(GA_MEASUREMENT_ID);
    }
    // Show the banner only when a decision is needed and one is configured.
    const needsDecision = stored == null && ENABLE_CONSENT_BANNER && GA_MEASUREMENT_ID !== "";
    setVisible(needsDecision);
  }, []);

  const decide = useCallback((choice: Consent) => {
    try {
      if (choice) window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* ignore */
    }
    setConsent(choice);
    setVisible(false);
    if (choice === "granted") loadGa(GA_MEASUREMENT_ID);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="cf-no-print fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border p-4 backdrop-blur-xl sm:inset-x-auto sm:right-4"
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)", boxShadow: "var(--shadow)" }}
    >
      <p className="text-sm text-[var(--text-secondary)]">
        We use privacy-friendly analytics to improve our calculators. No time-card data or pay is ever
        collected. See our{" "}
        <Link href="/cookie-policy/" className="text-accent-violet hover:underline">
          cookie policy
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => decide("granted")}
          className="rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-semibold text-white shadow-glow"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          className="rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)]"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
