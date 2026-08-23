import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { getGuide } from "@/content/guides";
import { getTool, type CalculatorKey } from "@/lib/tools";
import type { GuideTable } from "@/content/guides";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <GlassCard key={i} as="div" className="overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]">
              {item.q}
              <span aria-hidden className="text-accent-violet transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="px-4 pb-4 text-sm leading-6 text-[var(--text-secondary)]">{item.a}</p>
          </details>
        </GlassCard>
      ))}
    </div>
  );
}

export function RelatedTools({ keys }: { keys: CalculatorKey[] }) {
  if (!keys.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keys.map((key) => {
        const tool = getTool(key);
        return (
          <Link key={key} href={tool.route} className="group">
            <GlassCard className="h-full p-4 transition-transform group-hover:-translate-y-0.5">
              <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-accent-violet">{tool.navLabel}</div>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{tool.promise}</p>
            </GlassCard>
          </Link>
        );
      })}
    </div>
  );
}

export function RelatedGuides({ slugs }: { slugs: string[] }) {
  const guides = slugs.map(getGuide).filter(Boolean);
  if (!guides.length) return null;
  return (
    <ul className="space-y-2">
      {guides.map((g) => (
        <li key={g!.slug}>
          <Link href={`/guides/${g!.slug}/`} className="text-sm text-accent-violet hover:underline">
            {g!.h1}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ReferenceTable({ table }: { table: GuideTable }) {
  return (
    <figure>
      <GlassCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
              {table.headers.map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="cf-tabular">
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-[var(--border)] last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-[var(--text-secondary)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
      <figcaption className="mt-2 text-xs text-[var(--text-muted)]">{table.caption}</figcaption>
    </figure>
  );
}
