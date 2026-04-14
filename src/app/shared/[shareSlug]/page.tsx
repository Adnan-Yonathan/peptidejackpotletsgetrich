import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Shared Stack" };

export default async function SharedStackPage({
  params,
}: {
  params: Promise<{ shareSlug: string }>;
}) {
  const { shareSlug } = await params;

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Shared Stack</h1>
          <Card>
            <CardHeader>
              <CardTitle>Stack Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share slug: {shareSlug}. Public stack view with peptide components and cost breakdown.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
