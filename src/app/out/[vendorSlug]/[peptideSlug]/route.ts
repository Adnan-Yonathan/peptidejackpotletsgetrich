import { NextResponse } from "next/server";
import { resolveOutboundVendorTargetFromSlugs } from "@/lib/outbound-vendors";

export async function GET(
  request: Request,
  context: { params: Promise<{ vendorSlug: string; peptideSlug: string }> }
) {
  const { vendorSlug, peptideSlug } = await context.params;
  const target = resolveOutboundVendorTargetFromSlugs(vendorSlug, peptideSlug);

  if (!target) {
    const fallback = NextResponse.redirect(new URL("/vendors", request.url));
    fallback.headers.set("X-Robots-Tag", "noindex, nofollow");
    return fallback;
  }

  const requestUrl = new URL(request.url);
  const sourcePage = requestUrl.searchParams.get("sourcePage") ?? "unknown";
  const planId = requestUrl.searchParams.get("planId") ?? undefined;
  const utmParams = Array.from(requestUrl.searchParams.entries()).filter(([key]) =>
    key.startsWith("utm_")
  );

  console.log("Affiliate outbound redirect:", {
    vendorId: target.vendorId,
    peptideId: target.peptideId,
    sourcePage,
    planId,
    mode: target.mode,
    url: target.url,
  });

  const destinationUrl = new URL(target.url);
  for (const [key, value] of utmParams) {
    destinationUrl.searchParams.set(key, value);
  }

  const response = NextResponse.redirect(destinationUrl, 307);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
