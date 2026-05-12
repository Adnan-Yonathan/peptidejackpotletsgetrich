import type { Metadata } from "next";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { ReconstitutionCalculator } from "@/components/tools/ReconstitutionCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("reconstitution")!;

export const metadata: Metadata = {
  title: "Peptide Reconstitution Calculator",
  description:
    "Calculate units on an insulin syringe from vial size, BAC water, and target dose. Free peptide research math.",
  alternates: { canonical: "/tools/reconstitution" },
};

export default function ReconstitutionToolPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Reconstitution Calculator", href: "/tools/reconstitution" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Peptide Reconstitution Calculator",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/reconstitution`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageShell tool={tool}>
        <ReconstitutionCalculator />
      </ToolPageShell>
    </>
  );
}
