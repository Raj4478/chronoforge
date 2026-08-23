import type { Metadata } from "next";
import { ALLOW_INDEX, SITE_URL, absoluteUrl, site } from "@/lib/site";

export interface PageMetaInput {
  title: string;
  description: string;
  path: string; // site-relative, e.g. "/time-card-calculator/"
  keywords?: string[];
  type?: "website" | "article";
}

/**
 * Build Next.js Metadata for a page: unique title/description, self-canonical,
 * and robots directives that only allow indexing on the production domain.
 */
export function buildMetadata(input: PageMetaInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const index = ALLOW_INDEX;

  return {
    metadataBase: new URL(SITE_URL),
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: input.type ?? "website",
      url: canonical,
      title: input.title,
      description: input.description,
      siteName: site.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}
