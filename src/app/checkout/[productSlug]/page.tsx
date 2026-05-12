import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeAutomaticTaxEnabled } from "@/lib/stripe/server";
import { getPaidPdfProduct, getStripePriceId } from "@/lib/stripe/products";

export default async function CheckoutProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = getPaidPdfProduct(productSlug);

  if (!product) {
    redirect("/dashboard/purchases");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signup?redirectTo=${encodeURIComponent(`/checkout/${product.slug}`)}`);
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
    throw new Error("Stripe did not return a Checkout URL");
  }

  redirect(session.url);
}
