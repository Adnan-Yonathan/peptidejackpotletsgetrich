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
  const purchasedSlugs = parseProductSlugs(session?.metadata?.productSlugs, purchasedProduct?.slug);
  const purchasedProducts = purchasedSlugs
    .map((slug) => getPaidPdfProduct(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
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
          {purchasedProducts.length > 0 && (
            <div className="mt-5 rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#103b2c]">
                <FileText className="h-4 w-4 text-[#0f6a52]" />
                Purchased PDFs
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[#103b2c]/70">
                {purchasedProducts.map((product) => (
                  <li key={product.slug}>{product.name}</li>
                ))}
              </ul>
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
            <Button render={<Link href="/dashboard/purchases" />}>Download my PDFs</Button>
            {purchasedProduct && (
              <Button variant="outline" render={<Link href={`/pdfs/examples/${purchasedProduct.slug}`} />}>
                Open PDF preview
              </Button>
            )}
            <Button variant="outline" render={<Link href="/dashboard/purchases" />}>View my PDFs</Button>
            <Button variant="outline" render={<Link href="/vendors" />}>
              See matching vendors
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function parseProductSlugs(value: string | undefined, fallback: string | undefined) {
  if (!value) return fallback ? [fallback] : [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
    }
  } catch {
    // Legacy checkout sessions only store productSlug.
  }

  return fallback ? [fallback] : [];
}
