import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cookie Policy | ChronoForge",
  description: "How ChronoForge uses cookies and local storage — essential storage only, with optional analytics behind consent.",
  path: "/cookie-policy/",
});

export default function Page() {
  return (
    <StaticPageTemplate title="Cookie policy" path="/cookie-policy/">
      <h2>Local storage (essential)</h2>
      <p>
        We use your browser&rsquo;s local storage to remember your theme and, if you opt in, a saved schedule and preferences.
        This never leaves your device.
      </p>
      <h2>Analytics (optional)</h2>
      <p>
        If you accept in the consent banner, we load Google Analytics 4 to understand aggregate usage. IP anonymization is
        enabled and no calculator values are sent. Decline and the analytics script never loads.
      </p>
      <h2>Advertising</h2>
      <p>
        We do not run ads at launch. If advertising is added later, this policy and the consent options will be updated first.
      </p>
    </StaticPageTemplate>
  );
}
