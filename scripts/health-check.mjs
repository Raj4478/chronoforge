#!/usr/bin/env node
// Post-deploy health check against a running site.
// Usage: node scripts/health-check.mjs [baseUrl]
// Default baseUrl: http://localhost:3000
const base = (process.argv[2] || process.env.HEALTH_URL || "http://localhost:3000").replace(/\/+$/, "");

const CRITICAL = [
  "/",
  "/time-card-calculator/",
  "/work-hours-calculator/",
  "/conversions/minutes-to-decimal-hours/",
  "/pay/hourly-to-salary/",
  "/guides/",
  "/robots.txt",
  "/sitemap.xml",
];

let failed = 0;
console.log(`ChronoForge health check — ${base}\n`);

for (const path of CRITICAL) {
  const url = base + path;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const ok = res.status >= 200 && res.status < 400;
    console.log(`  ${ok ? "✓" : "✖"} ${res.status}  ${path}`);
    if (!ok) failed++;
  } catch (err) {
    console.log(`  ✖ ERR   ${path}  (${err.message})`);
    failed++;
  }
}

if (failed === 0) {
  console.log("\n✓ All critical routes healthy.");
  process.exit(0);
}
console.log(`\n✖ ${failed} route(s) failed.`);
process.exit(1);
