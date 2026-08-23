#!/usr/bin/env node
// Validate that every URL in ./out/sitemap.xml resolves to a built page,
// and that no obvious indexable page is missing from the sitemap.
// Usage: node scripts/validate-sitemap.mjs [outDir]
import { existsSync } from "node:fs";
import path from "node:path";
import { collectHtmlFiles, extractSignals, fileToUrlPath, readText } from "./lib/audit-core.mjs";

const outDir = process.argv[2] || "out";
const sitemapPath = path.join(outDir, "sitemap.xml");

if (!existsSync(sitemapPath)) {
  console.error(`✖ ${sitemapPath} not found. Run \`npm run build\` first.`);
  process.exit(2);
}

const xml = await readText(sitemapPath);
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(
  locs.map((u) => {
    try {
      let p = new URL(u).pathname;
      if (p !== "/" && !p.endsWith("/")) p += "/";
      return p;
    } catch {
      return u;
    }
  }),
);

const problems = [];

// 1) Every sitemap URL must exist as a file.
for (const p of sitemapPaths) {
  const file = p === "/" ? path.join(outDir, "index.html") : path.join(outDir, p.replace(/\/$/, ""), "index.html");
  if (!existsSync(file)) problems.push(`[missing-file] sitemap lists ${p} but ${file} does not exist`);
}

// 2) Every indexable built page should be in the sitemap.
const files = await collectHtmlFiles(outDir);
for (const file of files) {
  const url = fileToUrlPath(outDir, file);
  if (url.startsWith("/guides/") && url.split("/").length > 3) {
    // guide detail — fine
  }
  const html = await readText(file);
  const { robots } = extractSignals(html);
  const noindex = robots && /noindex/i.test(robots);
  const is404 = url === "/404/" || file.endsWith("/404.html");
  if (!noindex && !is404 && !sitemapPaths.has(url)) {
    problems.push(`[not-in-sitemap] ${url} is indexable but missing from sitemap.xml`);
  }
}

console.log(`ChronoForge sitemap validation — ${sitemapPaths.size} URLs listed\n`);
if (problems.length === 0) {
  console.log("✓ Sitemap is consistent with the build.");
  process.exit(0);
}
console.log(`✖ ${problems.length} problem(s):`);
for (const p of problems) console.log("  " + p);
process.exit(1);
