import { describe, expect, it } from "vitest";
// The crawler's extractor is dependency-free and shared with the CLI scripts.
import { extractSignals } from "../../../scripts/lib/audit-core.mjs";

const HTML = `<!doctype html><html><head>
<title>Time Card Calculator — ChronoForge</title>
<meta name="description" content="Add shifts and get totals.">
<link rel="canonical" href="https://chronoforge.app/time-card-calculator/">
<meta name="robots" content="index,follow">
<script type="application/ld+json">{"@type":"WebApplication"}</script>
</head><body>
<h1>Time card calculator</h1>
<a href="/work-hours-calculator/">Work hours</a>
<a href="https://example.com">External</a>
<p>Some visible words here for the count.</p>
</body></html>`;

describe("extractSignals", () => {
  it("pulls the core SEO signals from HTML", () => {
    const s = extractSignals(HTML);
    expect(s.title).toBe("Time Card Calculator — ChronoForge");
    expect(s.description).toBe("Add shifts and get totals.");
    expect(s.canonical).toBe("https://chronoforge.app/time-card-calculator/");
    expect(s.robots).toBe("index,follow");
    expect(s.h1).toBe("Time card calculator");
    expect(s.h1Count).toBe(1);
    expect(s.jsonLdCount).toBe(1);
    expect(s.links).toContain("/work-hours-calculator/");
    expect(s.wordCount).toBeGreaterThan(3);
  });

  it("flags a missing h1", () => {
    const s = extractSignals("<html><head><title>x</title></head><body></body></html>");
    expect(s.h1Count).toBe(0);
    expect(s.h1).toBeNull();
  });
});
