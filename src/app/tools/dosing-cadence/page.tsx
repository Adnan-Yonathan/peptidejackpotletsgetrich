import type { Metadata } from "next";
import { BreadcrumbList, JsonLd } from "@/components/seo/JsonLd";
import { DosingCadence } from "@/components/tools/DosingCadence";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getToolById } from "@/lib/tools";

const tool = getToolById("dosing-cadence")!;

export const metadata: Metadata = {
  title: "Half-Life & Dosing Cadence Calculator",
  description:
    "Get a dosing cadence recommendation from a peptide's half-life and target peak/trough ratio. Free research utility.",
  alternates: { canonical: "/tools/dosing-cadence" },
};

export default function DosingCadenceToolPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Half-Life & Cadence", href: "/tools/dosing-cadence" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Peptide Half-Life & Cadence Calculator",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          url: `${SITE_CANONICAL_URL}/tools/dosing-cadence`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageShell tool={tool}>
        <DosingCadence />
      </ToolPageShell>
    </>
  );
}
