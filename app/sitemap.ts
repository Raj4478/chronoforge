import type { MetadataRoute } from "next";
import { hubs, tools } from "@/lib/tools";
import { guides } from "@/content/guides";
import { absoluteUrl, site } from "@/lib/site";

/**
 * Canonical, indexable URLs only. No query-string variants, no preview URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = site.lastReviewed;

  const staticPaths = [
    "/",
    "/guides/",
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/cookie-policy/",
    "/terms/",
    "/editorial-policy/",
    "/calculation-methodology/",
    "/accessibility/",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.5,
    });
  }
  for (const hub of hubs) {
    entries.push({ url: absoluteUrl(hub.route), lastModified, changeFrequency: "monthly", priority: 0.7 });
  }
  for (const tool of tools) {
    entries.push({ url: absoluteUrl(tool.route), lastModified, changeFrequency: "monthly", priority: 0.9 });
  }
  for (const guide of guides) {
    entries.push({ url: absoluteUrl(`/guides/${guide.slug}/`), lastModified, changeFrequency: "monthly", priority: 0.6 });
  }

  return entries;
}
