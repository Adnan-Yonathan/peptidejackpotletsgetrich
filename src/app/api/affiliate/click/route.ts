import { NextResponse } from "next/server";
import { recordAffiliateEvent, recordRevenueEvent } from "@/lib/revenue/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = typeof body.sessionId === "string" && body.sessionId ? body.sessionId : crypto.randomUUID();
    const supabase = await createClient().catch(() => null);
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    const eventPayload = {
      eventType: "affiliate_click" as const,
      userId: user?.id ?? null,
      sessionId,
      sourcePage: typeof body.sourcePage === "string" ? body.sourcePage : "unknown",
      sourceType: "affiliate_link",
      vendorId: typeof body.vendorId === "string" ? body.vendorId : undefined,
      vendorSlug: typeof body.vendorId === "string" ? body.vendorId : undefined,
      peptideId: typeof body.peptideId === "string" ? body.peptideId : undefined,
      peptideSlug: typeof body.peptideId === "string" ? body.peptideId : undefined,
      destinationUrl: typeof body.destinationUrl === "string" ? body.destinationUrl : undefined,
      utmParams: isRecord(body.utmParams) ? body.utmParams : {},
      metadata: {
        planId: typeof body.planId === "string" ? body.planId : undefined,
      },
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    };
    await Promise.all([recordRevenueEvent(eventPayload), recordAffiliateEvent(eventPayload)]);
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

function isRecord(value: unknown): value is Record<string, string> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
