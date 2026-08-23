import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About ChronoForge",
  description: "ChronoForge is a fast, private suite of work-time calculators for hourly workers, freelancers, and small businesses.",
  path: "/about/",
});

export default function Page() {
  return (
    <StaticPageTemplate
      title="About ChronoForge"
      path="/about/"
      intro="The fastest way to calculate, track, and understand work time."
    >
      <p>
        ChronoForge is a suite of focused, no-nonsense calculators for the time math people actually do every week:
        totaling a time card, subtracting lunch, converting minutes to decimal hours, and estimating pay.
      </p>
      <h2>What we believe</h2>
      <ul>
        <li><strong>Utility first.</strong> Every page exists to finish a real task, not to fill space.</li>
        <li><strong>Private by default.</strong> Calculations run in your browser; nothing is uploaded.</li>
        <li><strong>Fast on a phone.</strong> Most of our visitors are on mobile, so speed is non-negotiable.</li>
        <li><strong>Honest math.</strong> Every formula is documented and unit-tested.</li>
      </ul>
      <h2>What we&rsquo;re not</h2>
      <p>
        We&rsquo;re not a payroll processor and we don&rsquo;t give tax or legal advice. Our overtime figures are arithmetic,
        not a legal eligibility ruling. See our <a href="/calculation-methodology/">methodology</a> for the details.
      </p>
    </StaticPageTemplate>
  );
}
