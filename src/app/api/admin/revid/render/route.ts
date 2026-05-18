import { NextResponse } from "next/server";
import {
  buildBeforeAfterPayloads,
  callRevid,
  extractRevidPid,
} from "@/lib/revid";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const urls = await request.json();
    const payloads = buildBeforeAfterPayloads(urls);
    const [beforeResponse, afterResponse] = await Promise.all([
      callRevid("/render", {
        method: "POST",
        body: JSON.stringify(payloads.before),
      }),
      callRevid("/render", {
        method: "POST",
        body: JSON.stringify(payloads.after),
      }),
    ]);

    return NextResponse.json({
      payloads,
      renders: {
        before: {
          pid: extractRevidPid(beforeResponse),
          response: beforeResponse,
        },
        after: {
          pid: extractRevidPid(afterResponse),
          response: afterResponse,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Render failed" },
      { status: 500 }
    );
  }
}
