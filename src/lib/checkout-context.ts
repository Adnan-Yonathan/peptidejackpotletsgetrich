import { createAdminClient } from "@/lib/supabase/admin";

export interface CheckoutContextRow {
  quiz_session_id: string;
  email: string | null;
  quiz_snapshot: unknown;
  recommended_peptides: unknown;
  goal_id: string | null;
  primary_peptide_slug: string | null;
  source_page: string | null;
}

export async function getCheckoutContext(quizSessionId: string | null | undefined) {
  if (!quizSessionId) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("checkout_contexts")
    .select("quiz_session_id, email, quiz_snapshot, recommended_peptides, goal_id, primary_peptide_slug, source_page")
    .eq("quiz_session_id", quizSessionId)
    .maybeSingle<CheckoutContextRow>();

  if (error) return null;
  return data;
}

