"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, FileText, LoaderCircle } from "lucide-react";
import QuizResultsPage from "@/app/quiz/results/page";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizState } from "@/hooks/useQuizState";

type PurchaseAccess = {
  id: string;
  productSlug: string;
  productName: string;
  productKind: "primary" | "addon";
  purchasedAt: string | null;
  downloadUrl: string;
  appUrl: string | null;
};

export default function ProtocolPage() {
  const router = useRouter();
  const isComplete = useQuizState((state) => state.isComplete);
  const [mounted, setMounted] = useState(false);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);
  const [purchases, setPurchases] = useState<PurchaseAccess[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isComplete()) {
      router.replace("/quiz");
      return;
    }

    let cancelled = false;
    setIsLoadingPurchases(true);
    fetch("/api/purchases", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return { purchases: [] };
        if (!response.ok) throw new Error("Unable to load purchases");
        return response.json() as Promise<{ purchases: PurchaseAccess[] }>;
      })
      .then((data) => {
        if (!cancelled) setPurchases(data.purchases ?? []);
      })
      .catch(() => {
        if (!cancelled) setPurchases([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPurchases(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isComplete, mounted, router]);

  if (!mounted) {
    return null;
  }

  if (!isComplete()) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center bg-[#fbfaf7] px-4 py-12">
          <div className="rounded-[1.1rem] border border-[#103b2c]/10 bg-white px-5 py-4 text-sm font-medium text-[#103b2c]/70 shadow-sm">
            Redirecting to the quiz...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isLoadingPurchases) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center bg-[#fbfaf7] px-4 py-12">
          <div className="flex items-center gap-3 rounded-[1.1rem] border border-[#103b2c]/10 bg-white px-5 py-4 text-sm font-medium text-[#103b2c]/70 shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin text-[#0f6a52]" />
            Loading PeptidePros+...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (purchases.length === 0) {
    return <QuizResultsPage />;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#fbfaf7] px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
              PeptidePros+
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#103b2c] md:text-4xl">
              Your protocol library
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#103b2c]/68">
              Download your purchased PDFs or open the in-app protocol view from here.
            </p>
          </div>

          <div className="grid gap-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="border-[#103b2c]/10 bg-white">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-[#103b2c]">
                      <FileText className="h-5 w-5 text-[#0f6a52]" />
                      {purchase.productName}
                    </CardTitle>
                    <p className="mt-1 text-sm text-[#103b2c]/58">
                      {purchase.productKind === "primary" ? "Core protocol" : "Add-on plan"}
                      {purchase.purchasedAt
                        ? ` · Purchased ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                            new Date(purchase.purchasedAt)
                          )}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button size="sm" render={<a href={purchase.downloadUrl} />}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    {purchase.appUrl && (
                      <Button size="sm" variant="outline" render={<Link href={purchase.appUrl} />}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in app
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-5 border-[#103b2c]/10 bg-white">
            <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[#103b2c]">Need another protocol?</p>
                <p className="mt-1 text-sm text-[#103b2c]/62">
                  Retake the quiz to route into another protocol path.
                </p>
              </div>
              <Button variant="outline" render={<Link href="/quiz" />}>Retake quiz</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
