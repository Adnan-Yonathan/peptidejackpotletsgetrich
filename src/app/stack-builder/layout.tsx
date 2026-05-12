import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_CANONICAL_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Peptide Stack Builder — Live Compatibility Checker",
  description:
    "Build a peptide stack with live compatibility checks. Pathway overlaps, receptor competition, and dosing conflicts flagged in real time. Cost estimates from tracked vendor listings.",
  alternates: { canonical: "/stack-builder" },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Peptide Stack Builder",
  url: `${SITE_CANONICAL_URL}/stack-builder`,
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  description:
    "Live compatibility checker for peptide stacks. Flags pathway overlap, receptor competition, and dosing-window conflicts. Estimates monthly cost from tracked vendor listings.",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_CANONICAL_URL },
} as const;

export default function StackBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={webAppLd} />
      {children}
    </>
  );
}
