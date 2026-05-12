import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peptide Directory — 46 Compounds Compared",
  description:
    "Browse 46 research peptides with mechanism, dosing references, evidence tier, regulatory flags, and vendor pricing. Independent comparison without affiliate spin.",
  alternates: { canonical: "/peptides" },
};

export default function PeptidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
