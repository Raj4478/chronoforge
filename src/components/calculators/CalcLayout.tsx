import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

/** Shared two-column calculator layout: inputs on the left, results on the right. */
export function CalcLayout({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <GlassCard className="cf-print-clean p-4 sm:p-5">{inputs}</GlassCard>
      <GlassCard className="cf-print-clean p-4 sm:p-5" glow>
        {results}
      </GlassCard>
    </div>
  );
}
