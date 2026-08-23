import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowLink } from "@/components/ui/GlowButton";
import { Eyebrow, Prose, Section } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq, ReferenceTable, RelatedGuides } from "./blocks";
import type { Guide } from "@/content/guides";
import { getTool } from "@/lib/tools";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, type Crumb } from "@/lib/seo/jsonLd";
import { site } from "@/lib/site";

export function GuidePageTemplate({ guide }: { guide: Guide }) {
  const tool = getTool(guide.relatedTool);
  const path = `/guides/${guide.slug}/`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides/" },
    { name: guide.h1, path },
  ];

  return (
    <article className="space-y-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd({ headline: guide.h1, description: guide.metaDescription, path, dateModified: site.lastReviewed }),
          faqJsonLd(guide.faq),
        ]}
      />

      <header className="space-y-4">
        <Breadcrumbs crumbs={crumbs} />
        <Eyebrow>Guide</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{guide.h1}</h1>
      </header>

      {/* Direct answer summary */}
      <GlassCard className="border-l-4 border-l-accent-violet p-5" glow>
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Short answer</p>
        <p className="mt-1.5 text-[15px] leading-7 text-[var(--text-primary)]">{guide.summary}</p>
        <div className="mt-4">
          <GlowLink href={tool.route} variant="primary">
            Open the {tool.navLabel} calculator →
          </GlowLink>
        </div>
      </GlassCard>

      <Prose>
        {guide.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Prose>

      {guide.table && (
        <Section title="Reference table">
          <ReferenceTable table={guide.table} />
        </Section>
      )}

      <Section title="FAQ">
        <Faq items={guide.faq} />
      </Section>

      {guide.relatedGuides.length > 0 && (
        <Section title="Related guides">
          <RelatedGuides slugs={guide.relatedGuides} />
        </Section>
      )}

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <Link href="/guides/" className="text-accent-violet hover:underline">
          ← All guides
        </Link>
        <span>Last reviewed: {site.lastReviewed}</span>
      </div>
    </article>
  );
}
