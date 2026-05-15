export const REVENUE_EVENT_TYPES = [
  "quiz_started",
  "quiz_completed",
  "signup_started",
  "signup_completed",
  "paywall_viewed",
  "checkout_started",
  "checkout_completed",
  "affiliate_click",
] as const;

export type RevenueEventType = (typeof REVENUE_EVENT_TYPES)[number];

export interface RevenueEventPayload {
  eventType: RevenueEventType;
  sessionId?: string;
  sourcePage?: string;
  sourceType?: string;
  goalId?: string;
  peptideId?: string;
  peptideSlug?: string;
  vendorId?: string;
  vendorSlug?: string;
  productSlug?: string;
  offerType?: "primary" | "addon" | "bundle" | string;
  destinationUrl?: string;
  amountTotal?: number;
  currency?: string;
  utmParams?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export function isRevenueEventType(value: unknown): value is RevenueEventType {
  return typeof value === "string" && REVENUE_EVENT_TYPES.includes(value as RevenueEventType);
}
