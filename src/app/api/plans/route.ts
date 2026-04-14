import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: replace with real DB once backend is connected
    return NextResponse.json({
      id: crypto.randomUUID(),
      name: body.name || "My Plan",
      quiz_snapshot: body.quizSnapshot,
      recommended_peptides: body.recommendedPeptides,
      total_cost_estimate: body.totalCostEstimate,
      timeline_weeks: body.timelineWeeks,
      is_saved: true,
      created_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
  }
}
