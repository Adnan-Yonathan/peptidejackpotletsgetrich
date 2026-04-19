import { redirect } from "next/navigation";

export default async function VendorCompareRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ peptide?: string | string[] }>;
}) {
  const { peptide } = await searchParams;
  const peptideSlug = Array.isArray(peptide) ? peptide[0] : peptide;
  redirect(peptideSlug ? `/vendors?peptide=${encodeURIComponent(peptideSlug)}` : "/vendors");
}
