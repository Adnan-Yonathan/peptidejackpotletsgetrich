import { getCurrentUtmParams, getRevenueSessionId } from "@/lib/revenue/session";

interface AffiliateClickParams {
  peptideId?: string;
  vendorId?: string;
  sourcePage: string;
  planId?: string;
  destinationUrl?: string;
}

export function trackAffiliateClick(params: AffiliateClickParams) {
  const payload = {
    ...params,
    sessionId: getRevenueSessionId(),
    utmParams: getCurrentUtmParams(),
  };

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/affiliate/click",
      JSON.stringify(payload)
    );
  } else {
    fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Silently fail — affiliate tracking should never block UX
    });
  }
}
