import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-brand-gradient shadow-glow hover:brightness-110 hover:shadow-[0_12px_28px_-12px_rgba(30,58,95,0.55)]",
  outline:
    "border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent-violet/60 hover:bg-accent-violet/5",
  ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-accent-violet/10",
};

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function GlowButton({ variant = "primary", className, children, ...rest }: GlowButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

interface GlowLinkProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function GlowLink({ href, variant = "primary", className, children }: GlowLinkProps) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} className={cn(base, variants[variant], className)} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
