import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { recordRevenueEvent } from "@/lib/revenue/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeAutomaticTaxEnabled } from "@/lib/stripe/server";
import { getBundleProducts, getPaidPdfProduct, getStripePriceId } from "@/lib/stripe/products";

export default async function CheckoutProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ productSlug: string }>;
  searchParams: Promise<{
    offer?: string;
    sourcePage?: string;
    sessionId?: string;
    goalId?: string;
    primaryPeptideSlug?: string;
  }>;
}) {
  const { productSlug } = await params;
  const {
    offer,
    sourcePage = "checkout-page",
    sessionId = crypto.randomUUID(),
    goalId,
    primaryPeptideSlug,
  } = await searchParams;
  const product = getPaidPdfProduct(productSlug);

  if (!product) {
    redirect("/dashboard/purchases");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectParams = new URLSearchParams();
    if (offer) redirectParams.set("offer", offer);
    if (sourcePage) redirectParams.set("sourcePage", sourcePage);
    if (sessionId) redirectParams.set("sessionId", sessionId);
    if (goalId) redirectParams.set("goalId", goalId);
    if (primaryPeptideSlug) redirectParams.set("primaryPeptideSlug", primaryPeptideSlug);
    const checkoutPath = `/checkout/${product.slug}${redirectParams.size ? `?${redirectParams.toString()}` : ""}`;
    redirect(`/signup?redirectTo=${encodeURIComponent(checkoutPath)}`);
  }

  const offerType = offer === "bundle" && product.kind === "primary" ? "bundle" : product.kind;
  const products = offerType === "bundle" ? getBundleProducts(product) : [product];
  const productSlugs = products.map((item) => item.slug);

  await recordRevenueEvent({
    eventType: "checkout_started",
    userId: user.id,
    sessionId,
    sourcePage,
    sourceType: "stripe_checkout_page",
    goalId,
    peptideSlug: primaryPeptideSlug,
    productSlug: product.slug,
    offerType,
    metadata: {
      productSlugs,
    },
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items:
      offerType === "bundle" && products.length > 1
        ? [
            {
              price_data: {
                currency: "usd",
                unit_amount: 5900,
                product_data: {
                  name: `${products[0].shortName} + ${products[1].shortName}`,
                  description: "PeptidePros protocol bundle",
                },
              },
              quantity: 1,
            },
          ]
        : products.map((item) => ({
            price: getStripePriceId(item),
            quantity: 1,
          })),
    automatic_tax: {
      enabled: isStripeAutomaticTaxEnabled(),
    },
    metadata: {
      userId: user.id,
      productSlug: product.slug,
      productSlugs: JSON.stringify(productSlugs),
      pdfKey: product.pdfKey,
      offerType,
      sourcePage,
      quizSessionId: sessionId,
      goalId: goalId ?? "",
      primaryPeptideSlug: primaryPeptideSlug ?? "",
    },
    payment_intent_data: {
      metadata: {
        userId: user.id,
        productSlug: product.slug,
        productSlugs: JSON.stringify(productSlugs),
        pdfKey: product.pdfKey,
        offerType,
        sourcePage,
        quizSessionId: sessionId,
        goalId: goalId ?? "",
        primaryPeptideSlug: primaryPeptideSlug ?? "",
      },
    },
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/dashboard/purchases?checkout=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  redirect(session.url);
}
