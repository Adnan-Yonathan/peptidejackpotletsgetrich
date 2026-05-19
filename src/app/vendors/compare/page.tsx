import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildSeoMetadata } from "@/lib/seo-metadata";

const title = "Compare Peptide Vendors by Compound";
const description =
  "Compare peptide vendors by compound, documentation quality, COA access, shipping clarity, price visibility, and product-level listing coverage.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vendors/compare" },
  ...buildSeoMetadata({
    title,
    description,
    path: "/vendors/compare",
  }),
};

export default async function VendorCompareRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ peptide?: string | string[] }>;
}) {
  const { peptide } = await searchParams;
  const peptideSlug = Array.isArray(peptide) ? peptide[0] : peptide;
  redirect(peptideSlug ? `/vendors?peptide=${encodeURIComponent(peptideSlug)}` : "/vendors");
}
