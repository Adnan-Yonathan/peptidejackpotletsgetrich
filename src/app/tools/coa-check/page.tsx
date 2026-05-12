import type { Metadata } from "next";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { CoaCheck } from "@/components/tools/CoaCheck";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("coa-check")!;

export const metadata: Metadata = {
  title: "Peptide COA Sanity Check",
  description:
    "Paste a Certificate of Analysis and flag mismatches against expected purity, test methods, lot identifiers, and third-party verification.",
  alternates: { canonical: "/tools/coa-check" },
};

export default function CoaCheckToolPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "COA Sanity Check", href: "/tools/coa-check" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Peptide COA Sanity Check",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/coa-check`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageShell tool={tool}>
        <CoaCheck />
      </ToolPageShell>
    </>
  );
}
