"use client";

import { useState, type ReactNode } from "react";
import { track } from "@/lib/analytics/events";

export function CopyButton({ getText, calculatorId }: { getText: () => string; calculatorId: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    track("copy_result", { calculator_id: calculatorId });
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-violet/60 hover:text-accent-violet"
      aria-live="polite"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-violet/60 hover:text-accent-violet"
    >
      Print
    </button>
  );
}

export function ActionsBar({ children }: { children: ReactNode }) {
  return <div className="cf-no-print flex flex-wrap items-center gap-2">{children}</div>;
}
