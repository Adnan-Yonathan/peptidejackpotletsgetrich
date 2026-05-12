import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Peptide Plan — 2-Minute Quiz",
  description:
    "Get matched with evidence-graded peptides, safety flags, and vendor options. Personalized to your goals, experience, and risk tolerance.",
  alternates: { canonical: "/quiz" },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
