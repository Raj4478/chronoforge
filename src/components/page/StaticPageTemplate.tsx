import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow, Prose } from "@/components/ui/primitives";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { site } from "@/lib/site";

export function StaticPageTemplate({
  eyebrow = "ChronoForge",
  title,
  path,
  intro,
  children,
  showReviewed = true,
}: {
  eyebrow?: string;
  title: string;
  path: string;
  intro?: string;
  children: ReactNode;
  showReviewed?: boolean;
}) {
  return (
    <article className="space-y-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: title, path },
        ])}
      />
      <header className="space-y-3">
        <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: title, path }]} />
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="max-w-2xl text-base text-[var(--text-secondary)]">{intro}</p>}
      </header>
      <Prose className="max-w-2xl [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </Prose>
      {showReviewed && <p className="text-xs text-[var(--text-muted)]">Last reviewed: {site.lastReviewed}</p>}
    </article>
  );
}
