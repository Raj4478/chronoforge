import Link from "next/link";
import { GlowLink } from "@/components/ui/GlowButton";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="cf-gradient-text text-6xl font-extrabold">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">This page clocked out</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        The page you&rsquo;re looking for doesn&rsquo;t exist. Let&rsquo;s get you back to the calculators.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <GlowLink href="/" variant="primary">Go home</GlowLink>
        <GlowLink href="/time-card-calculator/" variant="outline">Time card calculator</GlowLink>
      </div>
      <p className="mt-6 text-sm text-[var(--text-muted)]">
        Or browse the <Link href="/guides/" className="text-accent-violet hover:underline">guides</Link>.
      </p>
    </div>
  );
}
