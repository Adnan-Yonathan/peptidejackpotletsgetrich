import type { Metadata } from "next";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { WadaChecker } from "@/components/tools/WadaChecker";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("wada-checker")!;

export const metadata: Metadata = {
  title: "WADA Status Checker for Peptides",
  description:
    "Look up WADA Prohibited List classification per peptide compound. Useful for athletes in tested sports.",
  alternates: { canonical: "/tools/wada-checker" },
};

export default function WadaCheckerToolPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "WADA Status Checker", href: "/tools/wada-checker" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Peptide WADA Status Checker",
          applicationCategory: "ReferenceApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/wada-checker`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageShell tool={tool}>
        <WadaChecker />
      </ToolPageShell>
    </>
  );
}
