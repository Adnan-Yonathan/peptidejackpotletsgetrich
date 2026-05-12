import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { ReconstitutionCalculator } from "@/components/tools/ReconstitutionCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getPeptideBySlug, getPublishedPeptides } from "@/data/peptides";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("reconstitution")!;

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
    title: `${peptide.name} Reconstitution Calculator`,
    description: `Reconstitute ${peptide.name} (${peptide.synonyms[0] ?? peptide.name}). Calculate the units to draw on an insulin syringe from vial size, BAC water volume, and target dose.`,
    alternates: { canonical: `/tools/reconstitution/${peptide.slug}` },
  };
}

export default async function PeptideReconstitutionPage({
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
          { name: "Reconstitution", href: "/tools/reconstitution" },
          { name: peptide.name, href: `/tools/reconstitution/${peptide.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: `${peptide.name} Reconstitution Calculator`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/reconstitution/${peptide.slug}`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          about: { "@type": "Drug", name: peptide.name, alternateName: peptide.synonyms },
        }}
      />
      <ToolPageShell
        tool={tool}
        heading={`${peptide.name} reconstitution.`}
        description={`Calculate the units to draw on an insulin syringe for ${peptide.name}. Pre-filled with sensible defaults — adjust to match your vial label.`}
      >
        <ReconstitutionCalculator peptide={peptide} />
      </ToolPageShell>
    </>
  );
}
