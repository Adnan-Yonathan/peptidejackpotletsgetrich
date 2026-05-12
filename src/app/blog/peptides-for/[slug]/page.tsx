import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemographicPostTemplate } from "@/components/blog/DemographicPostTemplate";
import {
  getDemographicPageBySlug,
  getPublishedDemographicPages,
} from "@/data/demographic-pages";
import { SITE_CANONICAL_URL } from "@/lib/constants";

export async function generateStaticParams() {
  return getPublishedDemographicPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getDemographicPageBySlug(slug);
  if (!page) return { title: "Not Found" };

  const url = `${SITE_CANONICAL_URL}${page.canonicalPath}`;
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url,
      type: "article",
      publishedTime: page.publishedAt,
      modifiedTime: page.updatedAt,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

export default async function DemographicBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDemographicPageBySlug(slug);
  if (!page) notFound();
  return <DemographicPostTemplate page={page} />;
}
