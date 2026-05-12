import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Peptide Plan",
  robots: { index: false, follow: false },
};

export default function QuizResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
