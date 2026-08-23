"use client";

import { useState, type ReactNode } from "react";
import { track } from "@/lib/analytics/events";

const actionClassName =
  "inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-violet/60 hover:text-accent-violet";

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
    await writeClipboard(getText());
    setCopied(true);
    track("copy_result", { calculator_id: calculatorId });
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    const summary = getShareText?.() ?? getText();
    // Keep the URL clean and put the summary + URL in one text payload.
    // Some share targets drop `text` when a separate `url` field is supplied,
    // which previously caused them to share only the ChronoForge link.
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
        // Cancelling the native share sheet should not copy anything.
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
      <button type="button" onClick={copy} className={actionClassName} aria-live="polite">
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <button type="button" onClick={share} className={actionClassName} aria-live="polite">
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
