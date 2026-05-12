import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaidPdfProduct } from "@/lib/stripe/products";

interface PurchaseRow {
  id: string;
  product_slug: string;
  status: string;
  purchased_at: string | null;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ purchases: [] }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("purchases")
    .select("id, product_slug, status, purchased_at")
    .eq("status", "completed")
    .order("purchased_at", { ascending: false })
    .returns<PurchaseRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    purchases: (data ?? []).map((purchase) => {
      const product = getPaidPdfProduct(purchase.product_slug);
      return {
        id: purchase.id,
        productSlug: product?.slug ?? purchase.product_slug,
        productName: product?.name ?? purchase.product_slug,
        productKind: product?.kind ?? "primary",
        purchasedAt: purchase.purchased_at,
        downloadUrl: `/api/purchases/${product?.slug ?? purchase.product_slug}/download`,
        appUrl: product ? `/pdfs/examples/${product.slug}` : null,
      };
    }),
  });
}
