#!/usr/bin/env node
// Internal SEO/QA crawler over the exported ./out directory.
// Builds a page graph and reports orphans, deep pages (>3 clicks), broken links,
// and a signal summary. Usage: node scripts/crawl-site.mjs [outDir]
import {
  collectHtmlFiles,
  extractSignals,
  fileToUrlPath,
  resolveInternalLink,
  readText,
} from "./lib/audit-core.mjs";

const outDir = process.argv[2] || "out";
const MAX_DEPTH = 3;

const files = await collectHtmlFiles(outDir).catch(() => {
  console.error(`✖ Could not read "${outDir}". Run \`npm run build\` first.`);
  process.exit(2);
});

// Build nodes + edges.
const nodes = new Map(); // url -> signals
const edges = new Map(); // url -> Set(url)
const brokenLinks = [];

for (const file of files) {
  const html = await readText(file);
  const url = fileToUrlPath(outDir, file);
  const signals = extractSignals(html);
  nodes.set(url, signals);
  const outSet = new Set();
  for (const href of signals.links) {
    const resolved = resolveInternalLink(outDir, href);
    if (resolved === null) continue;
    if (resolved === false) {
      brokenLinks.push(`${url} -> ${href}`);
      continue;
    }
    outSet.add(fileToUrlPath(outDir, resolved));
  }
  edges.set(url, outSet);
}

// BFS from "/" for click depth.
const depth = new Map();
const queue = [["/", 0]];
depth.set("/", 0);
while (queue.length) {
  const [url, d] = queue.shift();
  for (const next of edges.get(url) || []) {
    if (!depth.has(next)) {
      depth.set(next, d + 1);
      queue.push([next, d + 1]);
    }
  }
}

// Inbound counts for orphan detection.
const inbound = new Map();
for (const [, outs] of edges) for (const t of outs) inbound.set(t, (inbound.get(t) || 0) + 1);

const orphans = [];
const deep = [];
for (const url of nodes.keys()) {
  if (url === "/404/" ) continue;
  if (url !== "/" && !(inbound.get(url) > 0)) orphans.push(url);
  const d = depth.get(url);
  if (d === undefined) orphans.push(url + " (unreachable)");
  else if (d > MAX_DEPTH) deep.push(`${url} (depth ${d})`);
}

const totalWords = [...nodes.values()].reduce((a, n) => a + n.wordCount, 0);
const noJsonLd = [...nodes.entries()].filter(([, n]) => n.jsonLdCount === 0).map(([u]) => u);

console.log(`ChronoForge internal crawl — ./${outDir}`);
console.log(`  Pages:            ${nodes.size}`);
console.log(`  Internal edges:   ${[...edges.values()].reduce((a, s) => a + s.size, 0)}`);
console.log(`  Avg words/page:   ${Math.round(totalWords / Math.max(1, nodes.size))}`);
console.log(`  Broken links:     ${brokenLinks.length}`);
console.log(`  Orphan pages:     ${orphans.length}`);
console.log(`  Deep pages (>${MAX_DEPTH}): ${deep.length}`);
console.log(`  Pages w/o JSON-LD:${noJsonLd.length}`);

function section(title, items) {
  if (!items.length) return;
  console.log(`\n${title}`);
  for (const i of items) console.log("  " + i);
}
section("Broken links:", brokenLinks);
section("Orphans:", orphans);
section("Deep pages:", deep);

const failed = brokenLinks.length > 0 || orphans.length > 0;
process.exit(failed ? 1 : 0);
