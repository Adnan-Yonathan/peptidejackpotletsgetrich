import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeAutomaticTaxEnabled } from "@/lib/stripe/server";
import { getPaidPdfProduct, getStripePriceId } from "@/lib/stripe/products";

export async function POST(request: Request) {
  const { productSlug } = (await request.json().catch(() => ({}))) as {
    productSlug?: string;
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
    return NextResponse.json(
      { redirectUrl: `/signup?redirectTo=${encodeURIComponent(`/checkout/${product.slug}`)}` },
      { status: 401 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price: getStripePriceId(product),
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: isStripeAutomaticTaxEnabled(),
    },
    metadata: {
      userId: user.id,
      productSlug: product.slug,
      pdfKey: product.pdfKey,
    },
    payment_intent_data: {
      metadata: {
        userId: user.id,
        productSlug: product.slug,
        pdfKey: product.pdfKey,
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
