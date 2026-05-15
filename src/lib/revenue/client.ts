"use client";

import type { RevenueEventPayload } from "@/lib/revenue/types";
import { getCurrentUtmParams, getRevenueSessionId } from "@/lib/revenue/session";

export function trackRevenueEvent(payload: RevenueEventPayload) {
  const body = {
    ...payload,
    sessionId: payload.sessionId || getRevenueSessionId(),
    sourcePage: payload.sourcePage || window.location.pathname,
    utmParams: {
      ...getCurrentUtmParams(),
      ...payload.utmParams,
    },
  };

  fetch("/api/revenue/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Revenue telemetry should never block the funnel.
  });
}
