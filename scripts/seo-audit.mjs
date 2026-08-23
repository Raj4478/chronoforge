#!/usr/bin/env node
// SEO static audit over the exported ./out directory.
// Usage: node scripts/seo-audit.mjs [outDir]
import { collectHtmlFiles, extractSignals, fileToUrlPath, readText } from "./lib/audit-core.mjs";

const outDir = process.argv[2] || "out";

const files = await collectHtmlFiles(outDir).catch(() => {
  console.error(`✖ Could not read "${outDir}". Run \`npm run build\` first.`);
  process.exit(2);
});

const pages = [];
for (const file of files) {
  const url = fileToUrlPath(outDir, file);
  // The 404 page is served with a 404 status by the host and is not indexable,
  // so it's excluded from title/description quality checks.
  if (url === "/404/" || file.endsWith("/404.html")) continue;
  const html = await readText(file);
  pages.push({ url, ...extractSignals(html) });
}

const issues = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const p of pages) {
  if (!p.title) issues.push(`[missing-title] ${p.url}`);
  else if (p.title.length > 65) issues.push(`[long-title ${p.title.length}] ${p.url}`);
  if (!p.description) issues.push(`[missing-description] ${p.url}`);
  else if (p.description.length > 165) issues.push(`[long-description ${p.description.length}] ${p.url}`);
  if (!p.canonical) issues.push(`[missing-canonical] ${p.url}`);
  if (p.h1Count === 0) issues.push(`[missing-h1] ${p.url}`);
  if (p.h1Count > 1) issues.push(`[multiple-h1 ${p.h1Count}] ${p.url}`);

  if (p.title) seenTitles.set(p.title, [...(seenTitles.get(p.title) || []), p.url]);
  if (p.description) seenDescriptions.set(p.description, [...(seenDescriptions.get(p.description) || []), p.url]);
}

for (const [title, urls] of seenTitles) if (urls.length > 1) issues.push(`[duplicate-title] "${title}" -> ${urls.join(", ")}`);
for (const [desc, urls] of seenDescriptions) if (urls.length > 1) issues.push(`[duplicate-description] ${urls.join(", ")}`);

console.log(`ChronoForge SEO audit — ${pages.length} pages scanned in ./${outDir}\n`);
if (issues.length === 0) {
  console.log("✓ No SEO issues found.");
  process.exit(0);
}
console.log(`Found ${issues.length} issue(s):`);
for (const i of issues) console.log("  " + i);
process.exit(1);
