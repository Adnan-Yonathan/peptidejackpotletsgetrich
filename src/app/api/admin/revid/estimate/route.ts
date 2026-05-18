import { NextResponse } from "next/server";
import { buildBeforeAfterPayloads, callRevid } from "@/lib/revid";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const urls = await request.json();
    const payloads = buildBeforeAfterPayloads(urls);
    const [before, after] = await Promise.all([
      callRevid("/calculate-credits", {
        method: "POST",
        body: JSON.stringify(payloads.before),
      }),
      callRevid("/calculate-credits", {
        method: "POST",
        body: JSON.stringify(payloads.after),
      }),
    ]);

    return NextResponse.json({
      payloads,
      estimates: {
        before,
        after,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Credit estimate failed" },
      { status: 500 }
    );
  }
}
