import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
  glow?: boolean;
}

/**
 * The core surface: a translucent "glass" panel with a soft border and blur.
 * Uses CSS variables so it adapts to light/dark automatically.
 */
export function GlassCard({ children, className, as = "div", glow = false }: GlassCardProps) {
  const Tag = as;
  return (
    <Tag
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
      className={cn(
        "rounded-xl border",
        glow && "ring-1 ring-accent-violet/20",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
