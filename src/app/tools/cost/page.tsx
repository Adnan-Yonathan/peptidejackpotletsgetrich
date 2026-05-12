import type { Metadata } from "next";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { CostCalculator } from "@/components/tools/CostCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("cost")!;

export const metadata: Metadata = {
  title: "Peptide Cost Calculator",
  description:
    "Estimate monthly and full-cycle peptide cost across tracked vendor listings. U.S. and international routes.",
  alternates: { canonical: "/tools/cost" },
};

export default function CostToolPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Cost Calculator", href: "/tools/cost" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Peptide Cost Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/cost`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageShell tool={tool}>
        <CostCalculator />
      </ToolPageShell>
    </>
  );
}
