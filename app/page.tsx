import Link from "next/link";
import { TimeCardCalculator } from "@/components/calculators/TimeCardCalculator";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowLink } from "@/components/ui/GlowButton";
import { DataChip, Eyebrow, Section } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { webApplicationJsonLd } from "@/lib/seo/jsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTool } from "@/lib/tools";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: `Time Card & Work Hours Calculator — ${site.name}`,
  description: site.description,
  path: "/",
  keywords: ["time card calculator", "work hours calculator", "timesheet calculator", "hours calculator"],
});

const QUICK_TOOLS = ["hours-between", "work-hours-lunch", "minutes-to-decimal", "hourly-to-salary"] as const;
const WHY = [
  { title: "Runs in your browser", body: "Every calculation happens on your device — instant, even offline." },
  { title: "No account required", body: "Nothing to sign up for. Open a tool and start typing." },
  { title: "Your data stays private", body: "Time-card values and pay are never sent to a server by default." },
  { title: "Built for mobile", body: "Big tap targets and native time pickers make phone entry fast." },
];
const HOME_GUIDES = ["how-to-calculate-time-card-hours", "decimal-hours-chart", "how-to-calculate-overtime-hours"];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <JsonLd data={webApplicationJsonLd({ name: `${site.name} Time Card Calculator`, description: site.description, path: "/" })} />

      {/* Hero */}
      <section className="space-y-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Eyebrow>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
              {site.tagline}
            </Eyebrow>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Calculate your <span className="cf-gradient-text">work hours</span> instantly
            </h1>
            <p className="max-w-xl text-base text-[var(--text-secondary)]">
              Add your shifts for the week, subtract breaks, and get total, regular, and overtime hours — with an
              optional pay estimate. Free, private, and fast.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DataChip tone="cyan">No sign-up</DataChip>
            <DataChip tone="violet">Works offline</DataChip>
            <DataChip tone="success">Private by default</DataChip>
          </div>
        </div>

        <TimeCardCalculator />
      </section>

      {/* Quick tools */}
      <Section title="Quick tools" description="Jump straight to the calculation you need.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_TOOLS.map((key) => {
            const tool = getTool(key);
            return (
              <Link key={key} href={tool.route} className="group">
                <GlassCard className="h-full p-4 transition-transform group-hover:-translate-y-0.5">
                  <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-accent-violet">{tool.navLabel}</div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{tool.promise}</p>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Why */}
      <Section title="Why ChronoForge">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item) => (
            <GlassCard key={item.title} className="p-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* Return usage */}
      <GlassCard className="p-6" glow>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Come back to the same schedule</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Turn on <strong className="text-[var(--text-primary)]">Remember my schedule</strong> in the time card and your
              week is saved on this device only — no account, nothing uploaded. Your hourly rate is never stored.
            </p>
          </div>
          <GlowLink href="/calculation-methodology/" variant="outline">
            How the math works →
          </GlowLink>
        </div>
      </GlassCard>

      {/* Guides */}
      <Section title="Popular guides" description="Short, practical, and tied to a real calculator.">
        <div className="grid gap-3 sm:grid-cols-3">
          {HOME_GUIDES.map((slug) => {
            const g = guides.find((x) => x.slug === slug)!;
            return (
              <Link key={slug} href={`/guides/${slug}/`} className="group">
                <GlassCard className="h-full p-4 transition-transform group-hover:-translate-y-0.5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-accent-violet">{g.h1}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-[var(--text-secondary)]">{g.summary}</p>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
