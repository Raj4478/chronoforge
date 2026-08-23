import Link from "next/link";
import type { Crumb } from "@/lib/seo/jsonLd";

/** Visible breadcrumb trail (structured data is emitted separately via JsonLd). */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="cf-no-print">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-[var(--text-secondary)]">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className="transition-colors hover:text-accent-violet">
                    {crumb.name}
                  </Link>
                  <span aria-hidden className="opacity-50">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
