import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GuidePageTemplate } from "@/components/page/GuidePageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { getGuide, guides } from "@/content/guides";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}/`,
    type: "article",
  });
}

export default function GuidePage({ params }: Params) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  return <GuidePageTemplate guide={guide} />;
}
