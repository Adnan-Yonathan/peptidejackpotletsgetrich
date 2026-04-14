interface AffiliateClickParams {
  peptideId?: string;
  vendorId?: string;
  sourcePage: string;
  planId?: string;
}

export function trackAffiliateClick(params: AffiliateClickParams) {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/affiliate/click",
      JSON.stringify(params)
    );
  } else {
    fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      keepalive: true,
    }).catch(() => {
      // Silently fail — affiliate tracking should never block UX
    });
  }
}
