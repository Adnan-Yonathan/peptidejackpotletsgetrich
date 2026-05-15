"use client";

const SESSION_KEY = "peptidepros-revenue-session-id";

export function getRevenueSessionId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function getCurrentUtmParams() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return Array.from(params.entries()).reduce<Record<string, string>>((acc, [key, value]) => {
    if (key.startsWith("utm_")) acc[key] = value;
    return acc;
  }, {});
}
