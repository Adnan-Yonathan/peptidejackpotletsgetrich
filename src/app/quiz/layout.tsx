import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo-metadata";

const title = "Find Your Peptide Plan in a 2-Minute Quiz";
const description =
  "Get matched with evidence-graded peptides, safety flags, vendor options, and protocol next steps based on your goals, experience, and risk tolerance.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/quiz" },
  ...buildSeoMetadata({
    title,
    description,
    path: "/quiz",
  }),
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
