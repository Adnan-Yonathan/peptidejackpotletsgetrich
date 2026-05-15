import { createAdminClient } from "@/lib/supabase/admin";
import type { RevenueEventPayload } from "@/lib/revenue/types";

type ServerRevenueEventPayload = RevenueEventPayload & {
  userId?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
};

export async function recordRevenueEvent(payload: ServerRevenueEventPayload) {
  if (!payload.sessionId) return;

  try {
    const supabase = createAdminClient();
    await supabase.from("revenue_events").insert({
      user_id: payload.userId ?? null,
      session_id: payload.sessionId,
      event_type: payload.eventType,
      source_page: payload.sourcePage ?? null,
      source_type: payload.sourceType ?? null,
      goal_id: payload.goalId ?? null,
      peptide_id: payload.peptideId ?? null,
      peptide_slug: payload.peptideSlug ?? null,
      vendor_id: payload.vendorId ?? null,
      vendor_slug: payload.vendorSlug ?? null,
      product_slug: payload.productSlug ?? null,
      offer_type: payload.offerType ?? null,
      destination_url: payload.destinationUrl ?? null,
      amount_total: payload.amountTotal ?? null,
      currency: payload.currency ?? null,
      utm_params: payload.utmParams ?? {},
      metadata: payload.metadata ?? {},
      user_agent: payload.userAgent ?? null,
      referrer: payload.referrer ?? null,
    });
  } catch (error) {
    console.error("Revenue event insert failed:", error);
  }
}

export async function recordAffiliateEvent(payload: ServerRevenueEventPayload) {
  if (!payload.sessionId) return;

  try {
    const supabase = createAdminClient();
    await supabase.from("affiliate_events").insert({
      user_id: payload.userId ?? null,
      source_page: payload.sourcePage ?? "unknown",
      session_id: payload.sessionId,
      source_type: payload.sourceType ?? null,
      vendor_slug: payload.vendorSlug ?? payload.vendorId ?? null,
      peptide_slug: payload.peptideSlug ?? payload.peptideId ?? null,
      destination_url: payload.destinationUrl ?? null,
      utm_params: payload.utmParams ?? {},
      metadata: payload.metadata ?? {},
    });
  } catch (error) {
    console.error("Affiliate event insert failed:", error);
  }
}
