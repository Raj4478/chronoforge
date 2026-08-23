import { CalculatorHost } from "@/components/calculators/CalculatorHost";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Prose, Section } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq, RelatedGuides, RelatedTools } from "./blocks";
import { getHub, type Tool } from "@/lib/tools";
import { breadcrumbJsonLd, faqJsonLd, webApplicationJsonLd, type Crumb } from "@/lib/seo/jsonLd";
import { site } from "@/lib/site";

export function CalculatorPageTemplate({ tool }: { tool: Tool }) {
  const hub = getHub(tool.category);
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }];
  if (hub) crumbs.push({ name: hub.navLabel, path: hub.route });
  crumbs.push({ name: tool.navLabel, path: tool.route });

  return (
    <article className="space-y-12">
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          webApplicationJsonLd({ name: tool.h1, description: tool.metaDescription, path: tool.route }),
          faqJsonLd(tool.faq),
        ]}
      />

      {/* Header + calculator */}
      <header className="space-y-4">
        <Breadcrumbs crumbs={crumbs} />
        <div className="space-y-2">
          <Eyebrow>Calculator</Eyebrow>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{tool.h1}</h1>
          <p className="max-w-2xl text-base text-[var(--text-secondary)]">{tool.promise}</p>
        </div>
      </header>

      <CalculatorHost calculator={tool.key} />

      {/* Assumptions */}
      <Section title="Assumptions" description="What this calculator does — and does not — do.">
        <GlassCard className="p-5">
          <ul className="space-y-2">
            {tool.assumptions.map((a, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-[var(--text-secondary)]">
                <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Section>

      {/* Worked example */}
      <Section title="Worked example">
        <GlassCard className="p-5">
          <Prose>
            <p>{tool.workedExample}</p>
          </Prose>
        </GlassCard>
      </Section>

      {/* Formula / methodology */}
      <Section title="Formula & methodology">
        <GlassCard className="p-5">
          <p className="cf-tabular rounded-lg bg-[var(--surface-solid)]/50 p-4 text-sm leading-6 text-[var(--text-secondary)]">{tool.formula}</p>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            See the full <a href="/calculation-methodology/" className="text-accent-violet hover:underline">calculation methodology</a> for
            rounding rules and assumptions.
          </p>
        </GlassCard>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked questions">
        <Faq items={tool.faq} />
      </Section>

      {/* Related */}
      <div className="grid gap-8 md:grid-cols-2">
        <Section title="Related tools">
          <RelatedTools keys={tool.relatedTools} />
        </Section>
        {tool.relatedGuides.length > 0 && (
          <Section title="Related guides">
            <RelatedGuides slugs={tool.relatedGuides} />
          </Section>
        )}
      </div>

      <p className="text-xs text-[var(--text-muted)]">Last reviewed: {site.lastReviewed}</p>
    </article>
  );
}
