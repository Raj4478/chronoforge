import { CalculatorPageTemplate } from "@/components/page/CalculatorPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTool } from "@/lib/tools";

const tool = getTool("hours-between");

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: tool.route,
  keywords: tool.keywords,
});

export default function Page() {
  return <CalculatorPageTemplate tool={tool} />;
}
