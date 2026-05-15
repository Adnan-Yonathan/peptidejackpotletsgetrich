import { NextResponse } from "next/server";
import { resolveOutboundVendorTargetFromSlugs } from "@/lib/outbound-vendors";
import { recordAffiliateEvent, recordRevenueEvent } from "@/lib/revenue/server";
import { createClient } from "@/lib/supabase/server";

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
  const sessionId = requestUrl.searchParams.get("sessionId") ?? crypto.randomUUID();
  const utmParams = Array.from(requestUrl.searchParams.entries()).filter(([key]) =>
    key.startsWith("utm_")
  );
  const utmParamObject = Object.fromEntries(utmParams);

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

  const supabase = await createClient().catch(() => null);
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const eventPayload = {
    eventType: "affiliate_click" as const,
    userId: user?.id ?? null,
    sessionId,
    sourcePage,
    sourceType: "outbound_redirect",
    vendorId: target.vendorId,
    vendorSlug,
    peptideId: target.peptideId,
    peptideSlug,
    destinationUrl: destinationUrl.toString(),
    utmParams: utmParamObject,
    metadata: {
      planId,
      mode: target.mode,
    },
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  };

  await Promise.all([recordRevenueEvent(eventPayload), recordAffiliateEvent(eventPayload)]);

  const response = NextResponse.redirect(destinationUrl, 307);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
