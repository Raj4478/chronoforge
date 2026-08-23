"use client";

import { useState, type ReactNode } from "react";
import { track } from "@/lib/analytics/events";

const actionClassName =
  "inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)] px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] shadow-sm transition-all hover:-translate-y-px hover:border-accent-violet/60 hover:text-accent-violet hover:shadow-md active:translate-y-0";

async function writeClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fallback for browsers without the async clipboard API.
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
    </svg>
  );
}

export function CopyButton({
  getText,
  getShareText,
  calculatorId,
}: {
  getText: () => string;
  getShareText?: () => string;
  calculatorId: string;
}) {
  const [copied, setCopied] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");

  async function copy() {
    // When a calculator provides a polished share summary, use the same
    // privacy-safe, human-readable structure for Copy as well.
    const text = getShareText?.() ?? getText();
    await writeClipboard(text);
    setCopied(true);
    track("copy_result", { calculator_id: calculatorId });
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    const summary = getShareText?.() ?? getText();
    // Keep the URL clean and put the summary + URL in one text payload.
    // Some share targets drop `text` when a separate `url` field is supplied.
    const url = `${window.location.origin}${window.location.pathname}`;
    const text = `${summary}\n\nOpen in ChronoForge:\n${url}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "ChronoForge",
          text,
        });
        setShareState("shared");
        track("share_result", { calculator_id: calculatorId, share_method: "native" });
        window.setTimeout(() => setShareState("idle"), 1600);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await writeClipboard(text);
    setShareState("copied");
    track("share_result", { calculator_id: calculatorId, share_method: "clipboard" });
    window.setTimeout(() => setShareState("idle"), 1600);
  }

  return (
    <>
      <button type="button" onClick={copy} className={actionClassName} aria-live="polite" title="Copy a formatted summary">
        <CopyIcon />
        {copied ? "Summary copied ✓" : getShareText ? "Copy summary" : "Copy result"}
      </button>
      <button type="button" onClick={share} className={actionClassName} aria-live="polite" title="Share this result">
        <ShareIcon />
        {shareState === "shared" ? "Shared ✓" : shareState === "copied" ? "Share copied ✓" : "Share result"}
      </button>
    </>
  );
}

export function PrintButton({ calculatorId }: { calculatorId: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        track("print_result", { calculator_id: calculatorId });
        window.print();
      }}
      className={actionClassName}
    >
      Print
    </button>
  );
}

export function ActionsBar({ children }: { children: ReactNode }) {
  return <div className="cf-no-print flex flex-wrap items-center gap-2">{children}</div>;
}
