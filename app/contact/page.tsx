import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact ChronoForge",
  description: "Get in touch with ChronoForge about a calculator, a correction, or a partnership.",
  path: "/contact/",
});

export default function Page() {
  return (
    <StaticPageTemplate title="Contact" path="/contact/" intro="Questions, corrections, and ideas are welcome." showReviewed={false}>
      <p>
        Found a calculation that looks off, or have a tool you wish existed? We&rsquo;d like to hear it — accuracy reports get
        priority.
      </p>
      <ul>
        <li>General &amp; corrections: <a href="mailto:hello@chronoforge.app">hello@chronoforge.app</a></li>
        <li>Privacy requests: <a href="mailto:privacy@chronoforge.app">privacy@chronoforge.app</a></li>
      </ul>
      <p className="text-xs">Replace these placeholder addresses with your real inbox before launch.</p>
    </StaticPageTemplate>
  );
}
