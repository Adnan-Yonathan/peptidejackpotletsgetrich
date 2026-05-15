import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaidPdfProduct } from "@/lib/stripe/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productSlug: string }> }
) {
  const { productSlug } = await params;
  const product = getPaidPdfProduct(productSlug);

  if (!product) {
    return NextResponse.json({ error: "Invalid product" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .in("product_slug", Array.from(new Set([product.slug, productSlug])))
    .eq("status", "completed")
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  return NextResponse.redirect(new URL(`/dashboard/purchases/${product.slug}/protocol`, _request.url));
}
