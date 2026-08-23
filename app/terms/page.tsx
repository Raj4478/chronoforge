import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms of Use | ChronoForge",
  description: "The terms for using ChronoForge calculators, provided as estimates and not as tax, legal, or payroll advice.",
  path: "/terms/",
});

export default function Page() {
  return (
    <StaticPageTemplate title="Terms of use" path="/terms/">
      <h2>Estimates only</h2>
      <p>
        ChronoForge calculators produce arithmetic estimates for convenience. They are not tax, legal, accounting, or payroll
        advice, and overtime figures are not legal eligibility determinations. Verify important numbers against your
        employer&rsquo;s records and applicable law.
      </p>
      <h2>No warranty</h2>
      <p>
        The service is provided &ldquo;as is&rdquo; without warranties of any kind. We work to keep formulas accurate and
        tested, but we are not liable for decisions made based on the results.
      </p>
      <h2>Acceptable use</h2>
      <p>Don&rsquo;t misuse the site, attempt to disrupt it, or scrape it in violation of our robots directives.</p>
      <p className="text-xs">This is a starting template, not legal advice — have counsel review before launch.</p>
    </StaticPageTemplate>
  );
}
