import type { Metadata } from "next";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { DoseConverter } from "@/components/tools/DoseConverter";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("convert")!;

export const metadata: Metadata = {
  title: "Peptide Dose Conversion — mcg, mg, IU, syringe units",
  description:
    "Convert between micrograms, milligrams, IU, and insulin syringe units (U-100 / U-40). Free peptide research utility.",
  alternates: { canonical: "/tools/convert" },
};

export default function ConvertToolPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Dose Conversion", href: "/tools/convert" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Peptide Dose Conversion",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/convert`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageShell tool={tool}>
        <DoseConverter />
      </ToolPageShell>
    </>
  );
}
