import { NextResponse } from "next/server";
import Stripe from "stripe";
import { recordRevenueEvent } from "@/lib/revenue/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

function getStripeId(value: string | { id: string } | null) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const productSlug = session.metadata?.productSlug;
  const offerType = session.metadata?.offerType ?? null;
  const sourcePage = session.metadata?.sourcePage ?? null;
  const quizSessionId = session.metadata?.quizSessionId ?? undefined;
  const goalId = session.metadata?.goalId || null;
  const primaryPeptideSlug = session.metadata?.primaryPeptideSlug || null;

  if (!userId || !productSlug) {
    throw new Error(`Checkout Session ${session.id} is missing fulfillment metadata`);
  }

  const supabase = createAdminClient();
  const stripeCustomerId = getStripeId(session.customer);
  const productSlugs = parseProductSlugs(session.metadata?.productSlugs, productSlug);

  const { error: purchaseError } = await supabase.from("purchases").upsert(
    productSlugs.map((slug, index) => ({
      user_id: userId,
      product_slug: slug,
      stripe_checkout_session_id: productSlugs.length > 1 ? `${session.id}:${slug}` : session.id,
      stripe_payment_intent_id:
        productSlugs.length > 1 ? `${getStripeId(session.payment_intent) ?? session.id}:${slug}` : getStripeId(session.payment_intent),
      stripe_customer_id: stripeCustomerId,
      status: "completed",
      amount_total: index === 0 ? session.amount_total : null,
      currency: session.currency,
      receipt_email: session.customer_details?.email ?? session.customer_email,
      metadata: session.metadata ?? {},
      offer_type: offerType,
      source_page: sourcePage,
      quiz_session_id: quizSessionId ?? null,
      goal_id: goalId,
      primary_peptide_slug: primaryPeptideSlug,
      purchased_at: new Date().toISOString(),
    })),
    { onConflict: "user_id,product_slug" }
  );

  if (purchaseError) {
    throw purchaseError;
  }

  if (quizSessionId) {
    await recordRevenueEvent({
      eventType: "checkout_completed",
      userId,
      sessionId: quizSessionId,
      sourcePage: sourcePage ?? "stripe_webhook",
      sourceType: "stripe_webhook",
      goalId: goalId ?? undefined,
      peptideSlug: primaryPeptideSlug ?? undefined,
      productSlug,
      offerType: offerType ?? undefined,
      amountTotal: session.amount_total ?? undefined,
      currency: session.currency ?? undefined,
      metadata: {
        checkoutSessionId: session.id,
        productSlugs,
      },
    });
  }

  if (stripeCustomerId) {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", userId)
      .is("stripe_customer_id", null);
  }
}

function parseProductSlugs(value: string | undefined, fallback: string) {
  if (!value) return [fallback];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const slugs = parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
      if (slugs.length > 0) return slugs;
    }
  } catch {
    // Legacy sessions stored only productSlug.
  }

  return [fallback];
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await fulfillCheckoutSession(event.data.object);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook fulfillment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
