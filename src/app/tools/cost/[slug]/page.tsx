import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { CostCalculator } from "@/components/tools/CostCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getPeptideBySlug, getPublishedPeptides } from "@/data/peptides";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("cost")!;

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
    title: `${peptide.name} Cost Calculator`,
    description: `Estimate the monthly and full-cycle cost of ${peptide.name} from tracked vendor listings. U.S. and international shipping routes.`,
    alternates: { canonical: `/tools/cost/${peptide.slug}` },
  };
}

export default async function PeptideCostPage({
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
          { name: "Cost", href: "/tools/cost" },
          { name: peptide.name, href: `/tools/cost/${peptide.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: `${peptide.name} Cost Calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/cost/${peptide.slug}`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          about: { "@type": "Drug", name: peptide.name, alternateName: peptide.synonyms },
        }}
      />
      <ToolPageShell
        tool={tool}
        heading={`${peptide.name} cost.`}
        description={`Estimate the monthly burn and full-cycle cost of ${peptide.name} based on tracked vendor listings. Adjust the cycle length and shipping route to match your plan.`}
      >
        <CostCalculator peptide={peptide} />
      </ToolPageShell>
    </>
  );
}
