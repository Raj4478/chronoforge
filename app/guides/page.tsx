import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { guides } from "@/content/guides";

export const metadata = buildMetadata({
  title: "Work Time Guides — Timesheets & Overtime | ChronoForge",
  description:
    "Short, practical guides on calculating work hours, time cards, overtime, decimal conversions, and pay. Each guide links to a free calculator.",
  path: "/guides/",
});

export default function GuidesIndex() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides/" },
        ])}
      />
      <header className="space-y-3">
        <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }]} />
        <Eyebrow>Guides</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Work time guides</h1>
        <p className="max-w-2xl text-base text-[var(--text-secondary)]">
          Practical, no-filler explanations — each one backs a real calculator.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}/`} className="group">
            <GlassCard className="h-full p-4 transition-transform group-hover:-translate-y-0.5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-accent-violet">{g.h1}</h2>
              <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[var(--text-secondary)]">{g.summary}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
