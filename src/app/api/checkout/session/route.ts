import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { recordRevenueEvent } from "@/lib/revenue/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeAutomaticTaxEnabled } from "@/lib/stripe/server";
import { getBundleProducts, getPaidPdfProduct, getStripePriceId } from "@/lib/stripe/products";

export async function POST(request: Request) {
  const {
    productSlug,
    offerType: requestedOfferType,
    sourcePage = "checkout-session-api",
    quizSessionId,
    goalId,
    primaryPeptideSlug,
  } = (await request.json().catch(() => ({}))) as {
    productSlug?: string;
    offerType?: string;
    sourcePage?: string;
    quizSessionId?: string;
    goalId?: string;
    primaryPeptideSlug?: string;
  };
  const product = productSlug ? getPaidPdfProduct(productSlug) : null;

  if (!product) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectParams = new URLSearchParams();
    if (requestedOfferType) redirectParams.set("offer", requestedOfferType);
    if (sourcePage) redirectParams.set("sourcePage", sourcePage);
    if (quizSessionId) redirectParams.set("sessionId", quizSessionId);
    if (goalId) redirectParams.set("goalId", goalId);
    if (primaryPeptideSlug) redirectParams.set("primaryPeptideSlug", primaryPeptideSlug);
    const checkoutPath = `/checkout/${product.slug}${redirectParams.size ? `?${redirectParams.toString()}` : ""}`;
    return NextResponse.json(
      { redirectUrl: `/signup?redirectTo=${encodeURIComponent(checkoutPath)}` },
      { status: 401 }
    );
  }

  const offerType = requestedOfferType === "bundle" && product.kind === "primary" ? "bundle" : product.kind;
  const products = offerType === "bundle" ? getBundleProducts(product) : [product];
  const productSlugs = products.map((item) => item.slug);
  const sessionId = quizSessionId || crypto.randomUUID();

  await recordRevenueEvent({
    eventType: "checkout_started",
    userId: user.id,
    sessionId,
    sourcePage,
    sourceType: "checkout_session_api",
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
    return NextResponse.json({ error: "Stripe did not return a Checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
