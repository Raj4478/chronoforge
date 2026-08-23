#!/usr/bin/env node
// Internal link checker over ./out — flags links that resolve to no file.
// Usage: node scripts/check-links.mjs [outDir]
import { collectHtmlFiles, extractSignals, fileToUrlPath, resolveInternalLink, readText } from "./lib/audit-core.mjs";

const outDir = process.argv[2] || "out";
const files = await collectHtmlFiles(outDir).catch(() => {
  console.error(`✖ Could not read "${outDir}". Run \`npm run build\` first.`);
  process.exit(2);
});

let checked = 0;
const broken = [];
for (const file of files) {
  const html = await readText(file);
  const { links } = extractSignals(html);
  const from = fileToUrlPath(outDir, file);
  for (const href of links) {
    const resolved = resolveInternalLink(outDir, href);
    if (resolved === null) continue; // external / mailto / anchor
    checked++;
    if (resolved === false) broken.push(`${from}  ->  ${href}`);
  }
}

console.log(`ChronoForge link check — ${checked} internal links across ${files.length} pages\n`);
if (broken.length === 0) {
  console.log("✓ No broken internal links.");
  process.exit(0);
}
console.log(`✖ ${broken.length} broken link(s):`);
for (const b of broken) console.log("  " + b);
process.exit(1);
