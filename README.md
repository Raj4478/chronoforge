# ChronoForge

**Clock in. Calculate. Move on.**

ChronoForge is a fast, privacy-conscious work-time utility platform for employees, freelancers, hourly workers, and small teams. It provides client-side time-card, work-hours, conversion, pay, calendar, and freelance calculators with a distinctive Web3-inspired interface and an SEO-first architecture.

## What is included

- Time Card Calculator
- Work Hours Calculator
- Time Clock Calculator
- Hours Between Times
- Work Hours With Lunch
- Weekly Hours Calculator
- Overtime Hours Calculator
- Minutes to Decimal Hours
- Decimal Hours to Time
- Hours and Minutes Calculator
- Hourly to Salary Calculator
- Salary to Hourly Calculator
- Business Days Calculator
- Workdays Remaining Calculator
- Billable Hours Calculator
- Project Hours Calculator
- Guide/content system
- Sitemap and robots generation
- SEO metadata + JSON-LD helpers
- Internal crawler and audit scripts
- Local-storage helpers
- Consent-aware analytics plumbing
- Unit tests for calculator/time logic

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- Vercel-ready deployment

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

## SEO / operations scripts

```bash
npm run crawl
npm run seo:audit
npm run seo:sitemap
npm run check:links
npm run health
```

See `package.json` for the exact available scripts.

## Environment variables

Copy `.env.example` to `.env.local` and configure the canonical production origin and optional analytics/consent settings.

## Architecture

The project is intentionally static-first. Calculator math lives in pure TypeScript functions under `src/calculators/`, while React components focus on interaction and presentation. Most calculations run entirely in the browser. No database or account system is required for the MVP.

## Product direction

ChronoForge is designed around recurring work-time tasks rather than a generic calculator directory. The primary user loop is:

1. Land on a time/work utility from search.
2. Complete the calculation immediately.
3. Optionally save local preferences/template data in the browser.
4. Return directly for recurring weekly use.

## Important scope note

ChronoForge performs arithmetic and planning calculations only. It should not be presented as payroll, tax, employment-law, or legal advice. Overtime calculations are mathematical estimates based on user-provided thresholds and assumptions.
