import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PeptidePros +",
  robots: { index: false, follow: false },
};

export default function ProtocolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
