import { NextResponse } from "next/server";
import { parsePurchaseAccessTokenMap } from "@/lib/purchase-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

interface PurchaseRecoveryRow {
  product_slug: string;
  receipt_email: string | null;
  status: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    checkoutSessionId?: unknown;
  } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const checkoutSessionId =
    typeof body?.checkoutSessionId === "string" ? body.checkoutSessionId.trim() : "";

  if (!email || !email.includes("@") || !checkoutSessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Enter the checkout email and Stripe session id." }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId).catch(() => null);
  const sessionEmail = (session?.customer_details?.email ?? session?.customer_email ?? "").toLowerCase();

  if (!session || sessionEmail !== email) {
    return NextResponse.json({ error: "No matching purchase was found." }, { status: 404 });
  }

  const tokenMap = parsePurchaseAccessTokenMap(session.metadata?.purchaseAccessTokens);
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("product_slug, receipt_email, status")
    .ilike("stripe_checkout_session_id", `${checkoutSessionId}%`)
    .eq("status", "completed")
    .returns<PurchaseRecoveryRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const links = (data ?? [])
    .filter((purchase) => purchase.receipt_email?.toLowerCase() === email)
    .map((purchase) => {
      const token = tokenMap[purchase.product_slug];
      return token ? { productSlug: purchase.product_slug, url: `/purchases/access/${token}` } : null;
    })
    .filter((item): item is { productSlug: string; url: string } => Boolean(item));

  if (links.length === 0) {
    return NextResponse.json({ error: "No recoverable protocol link was found for that session." }, { status: 404 });
  }

  return NextResponse.json({ links });
}

