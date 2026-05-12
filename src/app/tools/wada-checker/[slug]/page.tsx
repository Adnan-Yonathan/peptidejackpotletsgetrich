import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { WadaChecker } from "@/components/tools/WadaChecker";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getPeptideBySlug, getPublishedPeptides } from "@/data/peptides";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("wada-checker")!;

export async function generateStaticParams() {
  return getPublishedPeptides().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return { title: "Peptide Not Found" };
  return {
    title: `Is ${peptide.name} on the WADA Prohibited List?`,
    description: `${peptide.name} WADA classification, anti-doping status, and what athletes in tested sports need to know.`,
    alternates: { canonical: `/tools/wada-checker/${peptide.slug}` },
  };
}

export default async function PeptideWadaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) notFound();

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "WADA Status", href: "/tools/wada-checker" },
          { name: peptide.name, href: `/tools/wada-checker/${peptide.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: `${peptide.name} WADA Status`,
          applicationCategory: "ReferenceApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/wada-checker/${peptide.slug}`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          about: { "@type": "Drug", name: peptide.name, alternateName: peptide.synonyms },
        }}
      />
      <ToolPageShell
        tool={tool}
        heading={`Is ${peptide.name} on the WADA list?`}
        description={`Anti-doping classification for ${peptide.name}, plus what athletes in tested sports need to know before any research use.`}
      >
        <WadaChecker peptide={peptide} />
      </ToolPageShell>
    </>
  );
}
