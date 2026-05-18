import { NextResponse } from "next/server";
import { callRevid } from "@/lib/revid";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pid = url.searchParams.get("pid");

    if (!pid) {
      return NextResponse.json({ error: "Missing pid" }, { status: 400 });
    }

    const status = await callRevid(`/status?pid=${encodeURIComponent(pid)}`, {
      method: "GET",
    });

    return NextResponse.json({ pid, status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    );
  }
}
