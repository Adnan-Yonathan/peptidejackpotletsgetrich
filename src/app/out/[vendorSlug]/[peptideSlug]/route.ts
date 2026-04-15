import { NextResponse } from "next/server";
import { resolveOutboundVendorTargetFromSlugs } from "@/lib/outbound-vendors";

export async function GET(
  request: Request,
  context: { params: Promise<{ vendorSlug: string; peptideSlug: string }> }
) {
  const { vendorSlug, peptideSlug } = await context.params;
  const target = resolveOutboundVendorTargetFromSlugs(vendorSlug, peptideSlug);

  if (!target) {
    return NextResponse.redirect(new URL("/vendors", request.url));
  }

  const requestUrl = new URL(request.url);
  const sourcePage = requestUrl.searchParams.get("sourcePage") ?? "unknown";
  const planId = requestUrl.searchParams.get("planId") ?? undefined;

  console.log("Affiliate outbound redirect:", {
    vendorId: target.vendorId,
    peptideId: target.peptideId,
    sourcePage,
    planId,
    mode: target.mode,
    url: target.url,
  });

  return NextResponse.redirect(target.url, 307);
}
