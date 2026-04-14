import { NextResponse } from "next/server";
import { generatePlannerResult } from "@/lib/planner-engine";
import type { PlannerAnswers } from "@/types/planner";

export async function POST(request: Request) {
  try {
    const answers: PlannerAnswers = await request.json();

    if (!answers.primaryGoalId || !answers.budget || !answers.experience) {
      return NextResponse.json({ error: "Missing required quiz answers" }, { status: 400 });
    }

    return NextResponse.json(generatePlannerResult(answers));
  } catch {
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
