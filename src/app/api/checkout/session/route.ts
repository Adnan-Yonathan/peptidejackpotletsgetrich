import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getCheckoutContext } from "@/lib/checkout-context";
import { createPurchaseAccessTokenMap } from "@/lib/purchase-access";
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

  const supabase = await createClient().catch(() => null);
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const offerType = requestedOfferType === "bundle" && product.kind === "primary" ? "bundle" : product.kind;
  const products = offerType === "bundle" ? getBundleProducts(product) : [product];
  const productSlugs = products.map((item) => item.slug);
  const sessionId = quizSessionId || crypto.randomUUID();
  const checkoutContext = await getCheckoutContext(sessionId);
  const resolvedGoalId = goalId ?? checkoutContext?.goal_id ?? undefined;
  const resolvedPrimaryPeptideSlug = primaryPeptideSlug ?? checkoutContext?.primary_peptide_slug ?? undefined;
  const accessTokens = createPurchaseAccessTokenMap(productSlugs);
  const checkoutEmail = user?.email ?? checkoutContext?.email ?? undefined;

  await recordRevenueEvent({
    eventType: "checkout_started",
    userId: user?.id ?? null,
    sessionId,
    sourcePage,
    sourceType: "checkout_session_api",
    goalId: resolvedGoalId,
    peptideSlug: resolvedPrimaryPeptideSlug,
    productSlug: product.slug,
    offerType,
    metadata: {
      productSlugs,
    },
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: checkoutEmail || undefined,
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
      userId: user?.id ?? "",
      productSlug: product.slug,
      productSlugs: JSON.stringify(productSlugs),
      purchaseAccessTokens: JSON.stringify(accessTokens),
      pdfKey: product.pdfKey,
      offerType,
      sourcePage,
      quizSessionId: sessionId,
      goalId: resolvedGoalId ?? "",
      primaryPeptideSlug: resolvedPrimaryPeptideSlug ?? "",
    },
    payment_intent_data: {
      metadata: {
        userId: user?.id ?? "",
        productSlug: product.slug,
        productSlugs: JSON.stringify(productSlugs),
        pdfKey: product.pdfKey,
        offerType,
        sourcePage,
        quizSessionId: sessionId,
        goalId: resolvedGoalId ?? "",
        primaryPeptideSlug: resolvedPrimaryPeptideSlug ?? "",
      },
    },
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: checkoutContext ? `${SITE_URL}/quiz/results?checkout=cancelled` : `${SITE_URL}/pdfs?checkout=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a Checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
