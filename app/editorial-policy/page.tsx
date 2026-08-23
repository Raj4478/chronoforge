import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Editorial Policy | ChronoForge",
  description: "How ChronoForge writes and reviews its guides: human-reviewed, tied to real tools, and free of low-value filler.",
  path: "/editorial-policy/",
});

export default function Page() {
  return (
    <StaticPageTemplate title="Editorial policy" path="/editorial-policy/">
      <p>Our content exists to help you finish a task, not to chase keywords. We hold guides to these rules:</p>
      <ul>
        <li>Every guide supports a real tool or user task.</li>
        <li>No law-specific claims unless they are sourced and reviewed.</li>
        <li>No generic productivity filler and no mass-generated pages.</li>
        <li>No AI-drafted content is published without human review.</li>
        <li>We prefer concise, direct answers, with examples and tables.</li>
      </ul>
      <h2>Corrections</h2>
      <p>
        If you spot an error, email <a href="mailto:hello@chronoforge.app">hello@chronoforge.app</a>. Accuracy fixes are
        prioritized and pages carry a &ldquo;last reviewed&rdquo; date.
      </p>
    </StaticPageTemplate>
  );
}
