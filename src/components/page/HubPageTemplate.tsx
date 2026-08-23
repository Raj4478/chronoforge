import Link from "next/link";
import { CalculatorHost } from "@/components/calculators/CalculatorHost";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Section } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo/jsonLd";
import { getTool, toolsInCategory, type Hub } from "@/lib/tools";

export function HubPageTemplate({ hub }: { hub: Hub }) {
  const tools = toolsInCategory(hub.category);
  const featured = getTool(hub.featuredTool);
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: hub.navLabel, path: hub.route },
  ];

  return (
    <div className="space-y-12">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <header className="space-y-3">
        <Breadcrumbs crumbs={crumbs} />
        <Eyebrow>{hub.navLabel}</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{hub.h1}</h1>
        <p className="max-w-2xl text-base text-[var(--text-secondary)]">{hub.description}</p>
      </header>

      <Section title={`Featured: ${featured.navLabel}`} description={featured.promise}>
        <CalculatorHost calculator={featured.key} />
      </Section>

      <Section title="All tools in this category">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.key} href={tool.route} className="group">
              <GlassCard className="h-full p-4 transition-transform group-hover:-translate-y-0.5">
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-accent-violet">{tool.navLabel}</div>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{tool.promise}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
