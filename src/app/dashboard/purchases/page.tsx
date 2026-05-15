import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getPaidPdfProduct } from "@/lib/stripe/products";

export const metadata: Metadata = { title: "My PDFs" };

interface PurchaseRow {
  id: string;
  product_slug: string;
  status: string;
  purchased_at: string | null;
}

export default async function PurchasesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent("/dashboard/purchases")}`);
  }

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, product_slug, status, purchased_at")
    .eq("status", "completed")
    .order("purchased_at", { ascending: false })
    .returns<PurchaseRow[]>();

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My PDFs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Purchased protocols live here. Open a protocol to review your personalized plan and
          export it as a PDF.
        </p>
      </div>

      {purchases && purchases.length > 0 ? (
        <div className="grid gap-4">
          {purchases.map((purchase) => {
            const product = getPaidPdfProduct(purchase.product_slug);
            const title = product?.name ?? purchase.product_slug;
            const protocolSlug = product?.slug ?? purchase.product_slug;
            return (
              <Card key={purchase.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Purchased{" "}
                      {purchase.purchased_at
                        ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                            new Date(purchase.purchased_at)
                          )
                        : "recently"}
                    </p>
                  </div>
                  <Button size="sm" render={<Link href={`/dashboard/purchases/${protocolSlug}/protocol`} />}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open personalized protocol
                  </Button>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No purchased PDFs yet.</p>
            <Button className="mt-4" variant="outline" render={<Link href="/peptides" />}>
              Browse protocol hubs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
