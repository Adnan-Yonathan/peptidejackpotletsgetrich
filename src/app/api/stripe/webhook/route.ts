import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

function getStripeId(value: string | { id: string } | null) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const productSlug = session.metadata?.productSlug;

  if (!userId || !productSlug) {
    throw new Error(`Checkout Session ${session.id} is missing fulfillment metadata`);
  }

  const supabase = createAdminClient();
  const stripeCustomerId = getStripeId(session.customer);

  const { error: purchaseError } = await supabase.from("purchases").upsert(
    {
      user_id: userId,
      product_slug: productSlug,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: getStripeId(session.payment_intent),
      stripe_customer_id: stripeCustomerId,
      status: "completed",
      amount_total: session.amount_total,
      currency: session.currency,
      receipt_email: session.customer_details?.email ?? session.customer_email,
      metadata: session.metadata ?? {},
      purchased_at: new Date().toISOString(),
    },
    { onConflict: "user_id,product_slug" }
  );

  if (purchaseError) {
    throw purchaseError;
  }

  if (stripeCustomerId) {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", userId)
      .is("stripe_customer_id", null);
  }
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
