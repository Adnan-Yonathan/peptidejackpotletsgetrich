import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { CostCalculator } from "@/components/tools/CostCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getPeptideBySlug, getPublishedPeptides } from "@/data/peptides";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getDefaultToolReview } from "@/lib/editorial";
import { buildSeoMetadata } from "@/lib/seo-metadata";
import { getToolById } from "@/lib/tools";

const tool = getToolById("cost")!;

export async function generateStaticParams() {
  return getPublishedPeptides().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return { title: "Peptide Not Found" };
  const title = `${peptide.name} Cost Calculator`;
  const description = `Estimate the monthly and full-cycle cost of ${peptide.name} from tracked vendor listings. U.S. and international shipping routes.`;
  const path = `/tools/cost/${peptide.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...buildSeoMetadata({
      title,
      description,
      path,
      imageAlt: `${peptide.name} cost calculator`,
    }),
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
      {peptide.slug === "aod-9604" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Why does AOD-9604 pricing vary so much?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "AOD-9604 pricing varies by vial size, concentration, testing documentation, domestic versus international shipping route, and whether the vendor publishes product-level COA information.",
                },
              },
              {
                "@type": "Question",
                name: "What changes the monthly cost of AOD-9604?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Monthly cost depends on the study amount, cycle length, vial waste, shipping charges, and whether the researcher buys single vials or larger packs.",
                },
              },
            ],
          }}
        />
      )}
      <ToolPageShell
        tool={tool}
        heading={`${peptide.name} cost.`}
        description={`Estimate the monthly burn and full-cycle cost of ${peptide.name} based on tracked vendor listings. Adjust the cycle length and shipping route to match your plan.`}
        editorialReview={getDefaultToolReview()}
        secondaryHref={`/peptides/${peptide.slug}`}
        secondaryLabel="Read peptide profile"
        tertiaryHref={`/vendors?peptide=${peptide.slug}`}
        tertiaryLabel="Review vendors"
      >
        <CostCalculator peptide={peptide} />
        {peptide.slug === "aod-9604" && (
          <section className="mt-6 rounded-xl border border-[#103b2c]/10 bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]">
              AOD-9604 cost context
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-[#103b2c]">
              Price is only useful after you normalize vial size, route, and documentation.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#103b2c]/72">
              AOD-9604 is usually shopped as a fat-loss research peptide, so monthly cost can look
              cheaper or more expensive depending on the assumed study amount and whether a vendor
              sells larger packs. Treat the calculator as a normalization tool: compare the same
              cycle length, shipping route, and documentation standard before choosing a vendor.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ["Vial economics", "Pack size and vial waste can change the real monthly burn more than headline price."],
                ["Vendor documentation", "COA access, batch identity, and current testing should matter before small price differences."],
                ["Next steps", "Read the AOD-9604 profile, compare vendors, then use the quiz before building a protocol."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
                  <h3 className="text-sm font-bold text-[#103b2c]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#103b2c]/70">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <Link className="text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px]" href="/peptides/aod-9604">
                Read AOD-9604 profile
              </Link>
              <Link className="text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px]" href="/vendors?peptide=aod-9604">
                Compare vendors
              </Link>
              <Link className="text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px]" href="/quiz">
                Take the quiz
              </Link>
            </div>
          </section>
        )}
      </ToolPageShell>
    </>
  );
}
