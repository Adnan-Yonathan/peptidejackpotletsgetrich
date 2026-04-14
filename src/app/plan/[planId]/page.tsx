import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Saved Plan" };

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Saved Plan</h1>
          <p className="text-muted-foreground">
            Plan ID: {planId}. This page will display the full saved plan with recommendations,
            cost estimates, timeline, and vendor links.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
