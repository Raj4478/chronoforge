import { HubPageTemplate } from "@/components/page/HubPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { getHub } from "@/lib/tools";

const hub = getHub("pay")!;

export const metadata = buildMetadata({
  title: hub.title,
  description: hub.metaDescription,
  path: hub.route,
});

export default function Page() {
  return <HubPageTemplate hub={hub} />;
}
