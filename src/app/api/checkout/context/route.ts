import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    quizSessionId?: unknown;
    email?: unknown;
    quizSnapshot?: unknown;
    recommendedPeptides?: unknown;
    goalId?: unknown;
    primaryPeptideSlug?: unknown;
    sourcePage?: unknown;
  } | null;

  const quizSessionId = typeof body?.quizSessionId === "string" ? body.quizSessionId : "";
  if (!quizSessionId) {
    return NextResponse.json({ error: "Missing quiz session id." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
  const goalId = typeof body?.goalId === "string" ? body.goalId : null;
  const primaryPeptideSlug = typeof body?.primaryPeptideSlug === "string" ? body.primaryPeptideSlug : null;
  const sourcePage = typeof body?.sourcePage === "string" ? body.sourcePage : "quiz-results-v2";

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("checkout_contexts").upsert(
      {
        quiz_session_id: quizSessionId,
        email,
        quiz_snapshot: body?.quizSnapshot ?? null,
        recommended_peptides: body?.recommendedPeptides ?? null,
        goal_id: goalId,
        primary_peptide_slug: primaryPeptideSlug,
        source_page: sourcePage,
      },
      { onConflict: "quiz_session_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save checkout context.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

