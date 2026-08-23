# ChronoForge

**The fastest way to calculate, track, and understand work time.**

A high-end, static-first work-time utility site — time cards, work hours, breaks,
overtime, decimal conversions, pay, business days, and freelance billing — with a
Web3-inspired glass UI, dark/light themes, full SEO, and a built-in SEO/QA crawler.

Built with **Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS**.
Every calculation runs in the browser. No backend, no database, no accounts.

---

## 1. Requirements

- **Node.js 18.18+** (built and tested on Node 18.19)
- **npm** (a `package-lock.json` is committed)

Check your version:

```bash
node -v
```

---

## 2. Quick start (run it locally)

From inside the `chronoforge/` folder:

```bash
npm install
```

```bash
npm run dev
```

Then open **http://localhost:3000**. The dev server hot-reloads on edits.

> On some IPv6 networks npm can hang. If so, prefix installs with
> `NODE_OPTIONS=--dns-result-order=ipv4first npm install`.

---

## 3. Build a production static site

```bash
npm run build
```

This outputs a fully static site to **`out/`** (no server runtime needed). Preview it
exactly as it will be served:

```bash
npm run serve:export
```

…then open the URL it prints (usually http://localhost:3000).

You can also drop the `out/` folder onto **any** static host (Vercel, Netlify,
Cloudflare Pages, S3, GitHub Pages, nginx).

---

## 4. Configuration (environment variables)

Copy `.env.example` to `.env.local` and edit. All values are public (`NEXT_PUBLIC_*`);
**never** put secrets here.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (no trailing slash). Drives canonical URLs, sitemap, robots, JSON-LD. |
| `NEXT_PUBLIC_ALLOW_INDEX` | `true` only on the production domain. Anything else ⇒ `noindex` + `robots.txt` disallow (protects dev/preview). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 id, e.g. `G-XXXXXXXXXX`. Leave blank to disable analytics entirely. |
| `NEXT_PUBLIC_ENABLE_CONSENT_BANNER` | `true` to show the consent banner before analytics load. |

Analytics never load until the visitor accepts consent, and time-card values / pay
are **never** sent as analytics data.

---

## 5. Testing & quality gates

```bash
npm test          # 35 golden unit tests (pure calculator + crawler logic)
npm run typecheck # strict TypeScript, no emit
npm run lint      # next/core-web-vitals ESLint
```

### SEO / crawler audits (run after `npm run build`)

```bash
node scripts/seo-audit.mjs out        # titles, descriptions, canonical, single-H1, duplicates
node scripts/check-links.mjs out       # broken internal links
node scripts/validate-sitemap.mjs out  # sitemap ↔ build consistency
node scripts/crawl-site.mjs out        # page graph: orphans, deep pages, broken links, JSON-LD coverage
node scripts/health-check.mjs http://localhost:3000   # post-deploy: critical routes, robots, sitemap
```

All four static audits pass clean on a fresh build.

---

## 6. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it in Vercel (framework auto-detects as **Next.js**).
3. Set the environment variables from section 4 (set `NEXT_PUBLIC_ALLOW_INDEX=true`
   only on the production custom domain — leave it `false` for preview deploys).
4. Deploy. `vercel.json` applies security headers (CSP, HSTS, nosniff,
   Referrer-Policy, Permissions-Policy).
5. Add the site to **Google Search Console** and submit `/sitemap.xml`.

---

## 7. Project structure

```
chronoforge/
├─ app/                       # Next.js App Router pages (one folder per route)
│  ├─ page.tsx                # Homepage (Time Card hero)
│  ├─ layout.tsx              # Shell: theme, header, footer, consent, base JSON-LD
│  ├─ sitemap.ts / robots.ts  # Generated sitemap.xml & robots.txt
│  ├─ <calculator>/page.tsx   # 16 calculator routes (thin wrappers over the template)
│  ├─ conversions|pay|calendar|freelance/  # hub pages + nested calculators
│  ├─ guides/[slug]/          # 12 evergreen guides (statically generated)
│  └─ about, contact, privacy-policy, ... # 8 trust/legal pages
├─ src/
│  ├─ calculators/            # Pure, tested domain logic (no UI, no framework)
│  ├─ lib/time/               # Time primitives (parse, duration, format, round)
│  ├─ lib/tools.ts            # Tool REGISTRY — routing, SEO copy, FAQ, cross-links
│  ├─ lib/seo/                # Metadata + JSON-LD builders
│  ├─ lib/storage|analytics/  # Local persistence + consent-aware GA4
│  ├─ components/calculators/ # Interactive calculator UIs
│  ├─ components/ui/          # Design system (GlassCard, GlowButton, MetricTile…)
│  ├─ components/page/        # Page templates (calculator / guide / hub / static)
│  └─ content/guides.ts       # Guide content
└─ scripts/                   # SEO/crawler/health CLI tools (dependency-free)
```

---

## 8. How to extend it

**Add a calculator**
1. Write the pure function in `src/calculators/` + a golden test in `*.test.ts`.
2. Build the UI in `src/components/calculators/` and register it in `CalculatorHost.tsx`.
3. Add a registry entry in `src/lib/tools.ts` (route, SEO copy, FAQ, related links).
4. Create `app/<route>/page.tsx` (copy an existing 8-line wrapper).
   Sitemap, breadcrumbs, JSON-LD, and internal links update automatically.

**Add a guide** — add an entry to `src/content/guides.ts`. The `/guides/[slug]/`
route, metadata, and index card are generated for you.

---

## 9. What this is *not*

ChronoForge produces **arithmetic estimates**. It is **not** tax, legal, payroll, or
employment-law advice, and its overtime figures are not legal eligibility rulings. See
`/calculation-methodology/` for every formula and assumption.

---

## 10. Design system — Corporate Navy & Slate

A classic, professional palette (light-first with a working dark toggle):

| Token | Light | Dark |
| --- | --- | --- |
| Brand navy | `#1E3A5F` | `#1E3A5F` |
| Accent blue | `#2563EB` | `#3B82F6` |
| Text primary | `#0F172A` | `#F1F5F9` |
| Text secondary (slate) | `#475569` | `#94A3B8` |
| Surface | `#FFFFFF` | `#111C2E` |
| Background | `#F8FAFC` | `#0B1220` |

- Solid white cards with hairline slate borders and soft, neutral elevation — no glassmorphism or neon.
- Theme is remembered locally with no flash-of-wrong-theme; defaults to system.
- Tabular/monospace numbers for all results and time inputs.
- WCAG 2.2 AA: keyboard operable, visible focus rings, screen-reader results, reduced-motion aware, AA contrast in both themes.
- Print-friendly result cards (`Print` on any calculator).

**To retheme:** edit the CSS variables in `app/globals.css` and the color/gradient
tokens in `tailwind.config.ts` — every component reads from those two files.

Enjoy — clock in, calculate, move on.
