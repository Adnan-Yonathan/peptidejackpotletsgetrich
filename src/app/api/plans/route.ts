import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in required to save plan" }, { status: 401 });
    }

    const { data, error } = await supabase.from("plans").insert({
      user_id: user.id,
      name: body.name || "My Plan",
      quiz_snapshot: body.quizSnapshot ?? null,
      recommended_peptides: body.recommendedPeptides ?? null,
      total_cost_estimate: body.totalCostEstimate ?? null,
      timeline_weeks: body.timelineWeeks ?? null,
      is_saved: true,
    }).select("*").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      quiz_snapshot: data.quiz_snapshot,
      recommended_peptides: data.recommended_peptides,
      total_cost_estimate: data.total_cost_estimate,
      timeline_weeks: data.timeline_weeks,
      is_saved: data.is_saved,
      created_at: data.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
  }
}
