import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRevenueEventType, type RevenueEventPayload } from "@/lib/revenue/types";
import { recordRevenueEvent } from "@/lib/revenue/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RevenueEventPayload | null;

  if (!body || !isRevenueEventType(body.eventType) || !body.sessionId) {
    return NextResponse.json({ error: "Invalid revenue event." }, { status: 400 });
  }

  const supabase = await createClient().catch(() => null);
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  await recordRevenueEvent({
    ...body,
    userId: user?.id ?? null,
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  });

  return new NextResponse(null, { status: 204 });
}
