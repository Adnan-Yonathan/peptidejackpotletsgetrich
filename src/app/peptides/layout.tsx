import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo-metadata";

const title = "Peptide Directory: 46 Compounds Compared";
const description =
  "Browse 46 research peptides with mechanism, dosing references, evidence tier, regulatory flags, and vendor pricing. Independent comparison without affiliate spin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/peptides" },
  ...buildSeoMetadata({
    title,
    description,
    path: "/peptides",
  }),
};

export default function PeptidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
