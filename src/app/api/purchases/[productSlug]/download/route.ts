import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaidPdfProduct } from "@/lib/stripe/products";

const PAID_PDF_BUCKET = "paid-pdfs";
const SIGNED_URL_TTL_SECONDS = 60 * 10;

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
    .eq("product_slug", product.slug)
    .eq("status", "completed")
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(PAID_PDF_BUCKET)
    .createSignedUrl(`${product.pdfKey}.pdf`, SIGNED_URL_TTL_SECONDS, {
      download: `${product.pdfKey}.pdf`,
    });

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "PDF is not available yet. Upload it to the paid-pdfs bucket first." },
      { status: 404 }
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
