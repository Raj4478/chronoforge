// Dependency-free HTML signal extraction + crawl helpers.
// Used by the SEO/crawler scripts and by unit tests. Pure functions only.

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/** Extract SEO signals from a page's HTML string. */
export function extractSignals(html) {
  const title = matchTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = matchAttr(html, /<meta[^>]+name=["']description["'][^>]*>/i, "content");
  const canonical = matchAttr(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, "href");
  const robots = matchAttr(html, /<meta[^>]+name=["']robots["'][^>]*>/i, "content");

  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi)].length;
  const text = stripTags(html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, ""));
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    title: title ? decode(title.trim()) : null,
    description: description ? decode(description.trim()) : null,
    canonical: canonical || null,
    robots: robots || null,
    h1: h1Matches[0] ? decode(h1Matches[0].trim()) : null,
    h1Count: h1Matches.length,
    links,
    jsonLdCount: jsonLd,
    wordCount,
  };
}

function matchTag(html, re) {
  const m = re.exec(html);
  return m ? stripTags(m[1]) : null;
}
function matchAttr(html, tagRe, attr) {
  const tag = tagRe.exec(html);
  if (!tag) return null;
  const m = new RegExp(`${attr}=["']([^"']*)["']`, "i").exec(tag[0]);
  return m ? m[1] : null;
}
function stripTags(s) {
  return s.replace(/<[^>]+>/g, "");
}
function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

/** Recursively list all .html files under a directory. */
export async function collectHtmlFiles(dir) {
  const out = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(".html")) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

/** Convert an /out file path to its canonical URL path (with trailing slash). */
export function fileToUrlPath(outDir, file) {
  let rel = path.relative(outDir, file).split(path.sep).join("/");
  rel = rel.replace(/index\.html$/, "").replace(/\.html$/, "/");
  if (!rel.startsWith("/")) rel = "/" + rel;
  if (rel !== "/" && !rel.endsWith("/")) rel += "/";
  return rel;
}

/** Resolve an internal link to the file that should serve it in /out. */
export function resolveInternalLink(outDir, href) {
  // Strip hash/query and origin.
  let p = href.split("#")[0].split("?")[0];
  if (/^https?:\/\//i.test(p) || p.startsWith("mailto:") || p.startsWith("tel:")) return null;
  if (!p.startsWith("/")) return null; // skip relative (none expected)
  const clean = p.replace(/\/$/, "");
  const candidates = [
    path.join(outDir, clean, "index.html"),
    path.join(outDir, clean + ".html"),
    path.join(outDir, p === "/" ? "index.html" : ""),
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  return false; // broken
}

export async function readText(file) {
  return readFile(file, "utf8");
}
