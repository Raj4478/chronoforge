import type { MetadataRoute } from "next";
import { ALLOW_INDEX, SITE_URL } from "@/lib/site";

/**
 * Production (ALLOW_INDEX=true): allow all, point to the sitemap.
 * Dev/preview: disallow everything so non-canonical hosts never get indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEX) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
