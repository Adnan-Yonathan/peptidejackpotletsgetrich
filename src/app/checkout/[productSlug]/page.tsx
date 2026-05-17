import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { getCheckoutContext } from "@/lib/checkout-context";
import { createPurchaseAccessTokenMap } from "@/lib/purchase-access";
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
    quizSessionId?: string;
    goalId?: string;
    primaryPeptideSlug?: string;
  }>;
}) {
  const { productSlug } = await params;
  const {
    offer,
    sourcePage = "checkout-page",
    sessionId,
    quizSessionId,
    goalId: requestedGoalId,
    primaryPeptideSlug: requestedPrimaryPeptideSlug,
  } = await searchParams;
  const effectiveSessionId = quizSessionId || sessionId || crypto.randomUUID();
  const product = getPaidPdfProduct(productSlug);

  if (!product) {
    redirect("/pdfs");
  }

  const supabase = await createClient().catch(() => null);
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const checkoutContext = await getCheckoutContext(effectiveSessionId);
  const goalId = requestedGoalId ?? checkoutContext?.goal_id ?? undefined;
  const primaryPeptideSlug = requestedPrimaryPeptideSlug ?? checkoutContext?.primary_peptide_slug ?? undefined;

  const offerType = offer === "bundle" && product.kind === "primary" ? "bundle" : product.kind;
  const products = offerType === "bundle" ? getBundleProducts(product) : [product];
  const productSlugs = products.map((item) => item.slug);
  const accessTokens = createPurchaseAccessTokenMap(productSlugs);
  const checkoutEmail = user?.email ?? checkoutContext?.email ?? undefined;

  await recordRevenueEvent({
    eventType: "checkout_started",
    userId: user?.id ?? null,
    sessionId: effectiveSessionId,
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
      quizSessionId: effectiveSessionId,
      goalId: goalId ?? "",
      primaryPeptideSlug: primaryPeptideSlug ?? "",
    },
    payment_intent_data: {
      metadata: {
        userId: user?.id ?? "",
        productSlug: product.slug,
        productSlugs: JSON.stringify(productSlugs),
        pdfKey: product.pdfKey,
        offerType,
        sourcePage,
        quizSessionId: effectiveSessionId,
        goalId: goalId ?? "",
        primaryPeptideSlug: primaryPeptideSlug ?? "",
      },
    },
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: checkoutContext ? `${SITE_URL}/quiz/results?checkout=cancelled` : `${SITE_URL}/pdfs?checkout=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  redirect(session.url);
}
