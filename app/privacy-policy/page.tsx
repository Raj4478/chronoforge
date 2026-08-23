import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy | ChronoForge",
  description: "How ChronoForge handles data: calculations run in your browser, and time-card values and pay are never sent to our servers.",
  path: "/privacy-policy/",
});

export default function Page() {
  return (
    <StaticPageTemplate title="Privacy policy" path="/privacy-policy/" intro="Short version: your time-card data stays on your device.">
      <h2>What we collect</h2>
      <ul>
        <li><strong>Calculator inputs:</strong> nothing. Times, breaks, and pay are processed in your browser and never sent to us.</li>
        <li><strong>Local storage:</strong> if you opt in, a saved schedule and preferences are stored only in your browser. Your hourly rate is not stored.</li>
        <li><strong>Analytics:</strong> if you accept, we use privacy-friendly, aggregate analytics to see which tools are used. We never send your time values or pay as analytics data.</li>
      </ul>
      <h2>Cookies &amp; consent</h2>
      <p>
        Optional analytics load only after you accept in the consent banner. You can decline and still use every calculator.
        See our <a href="/cookie-policy/">cookie policy</a>.
      </p>
      <h2>Your choices</h2>
      <ul>
        <li>Clear saved data any time from your browser settings, or with the site&rsquo;s clear-data control.</li>
        <li>Decline analytics in the consent banner.</li>
        <li>Contact <a href="mailto:privacy@chronoforge.app">privacy@chronoforge.app</a> with any request.</li>
      </ul>
      <p className="text-xs">This template is a starting point, not legal advice — have counsel review it before launch.</p>
    </StaticPageTemplate>
  );
}
