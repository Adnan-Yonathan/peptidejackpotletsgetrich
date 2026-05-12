import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getGoalProtocolPdfPairForProduct } from "@/data/protocol-pdfs";
import { getStripe } from "@/lib/stripe/server";
import { getPaidPdfProduct } from "@/lib/stripe/products";

export const metadata: Metadata = {
  title: "Purchase Complete",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId
    ? await getStripe().checkout.sessions.retrieve(sessionId).catch(() => null)
    : null;
  const purchasedProduct = session?.metadata?.productSlug
    ? getPaidPdfProduct(session.metadata.productSlug)
    : null;
  const productPair = purchasedProduct
    ? getGoalProtocolPdfPairForProduct(purchasedProduct.slug)
    : undefined;
  const addonProduct =
    purchasedProduct?.kind === "primary" && productPair?.addon
      ? productPair.addon
      : null;

  return (
    <main className="flex flex-1 items-center justify-center bg-stone-50 px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#0f6a52]" />
          <h1 className="mt-4 text-2xl font-bold">Purchase complete</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Stripe is confirming the payment. Your PDF will appear in your account as soon as the
            webhook records ownership.
          </p>
          {purchasedProduct && (
            <div className="mt-5 rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#103b2c]">
                <FileText className="h-4 w-4 text-[#0f6a52]" />
                Purchased PDF
              </p>
              <p className="mt-1 text-sm text-[#103b2c]/70">{purchasedProduct.name}</p>
            </div>
          )}
          {addonProduct && (
            <div className="mt-4 rounded-xl border border-[#0f6a52]/20 bg-white p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f6a52]">
                Recommended add-on
              </p>
              <h2 className="mt-2 text-lg font-bold text-[#103b2c]">{addonProduct.name}</h2>
              <p className="mt-1 text-sm leading-6 text-[#103b2c]/68">{addonProduct.description}</p>
              <Button className="mt-4 w-full" render={<Link href={`/checkout/${addonProduct.slug}`} />}>
                Add {addonProduct.priceLabel}
              </Button>
            </div>
          )}
          {sessionId && (
            <p className="mt-3 break-all rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              Session: {sessionId}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button render={<Link href="/protocol" />}>Open PeptidePros+</Button>
            <Button variant="outline" render={<Link href="/dashboard/purchases" />}>View my PDFs</Button>
            <Button variant="outline" render={<Link href="/peptides" />}>
              Continue browsing
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
