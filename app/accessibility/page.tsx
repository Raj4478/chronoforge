import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Accessibility Statement | ChronoForge",
  description: "ChronoForge targets WCAG 2.2 AA: keyboard operable, screen-reader friendly, high contrast, and reduced-motion aware.",
  path: "/accessibility/",
});

export default function Page() {
  return (
    <StaticPageTemplate title="Accessibility" path="/accessibility/" intro="We build ChronoForge to be usable by everyone.">
      <p>We target <strong>WCAG 2.2 AA</strong>. That means:</p>
      <ul>
        <li>Every calculator is fully keyboard operable, with visible focus rings.</li>
        <li>Results are announced to screen readers and never conveyed by color or glow alone.</li>
        <li>Text and controls meet AA contrast in both light and dark themes.</li>
        <li>Animations are subtle and respect your &ldquo;reduce motion&rdquo; setting.</li>
        <li>Time fields are clearly labeled and use your device&rsquo;s native picker.</li>
      </ul>
      <p>
        Found a barrier? Email <a href="mailto:hello@chronoforge.app">hello@chronoforge.app</a> and we&rsquo;ll fix it.
      </p>
    </StaticPageTemplate>
  );
}
