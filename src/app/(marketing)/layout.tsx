import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
