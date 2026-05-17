import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GeneratedProtocolView } from "@/components/protocol/GeneratedProtocolView";
import { getDoseReferenceCoverage } from "@/data/dosing-references";
import { getGoalById } from "@/data/goals";
import { getPeptideById } from "@/data/peptides";
import { getProtocolPdfContent } from "@/data/protocol-pdf-content";
import { getVendorsForPeptide } from "@/data/vendors";
import { createClient } from "@/lib/supabase/server";
import { getPaidPdfProduct } from "@/lib/stripe/products";
import { generatePlannerResult } from "@/lib/planner-engine";
import {
  PLANNER_DEFAULTS_FOR_PROTOCOL,
  buildMonitoringNotes,
  buildPersonalizedDoseReferences,
  buildProfileSnapshot,
  buildWashoutNotes,
  isPlannerAnswers,
  isPlannerResult,
} from "@/lib/personalized-protocol";
import type { PlannerAnswers, PlannerRecommendation } from "@/types/planner";

export const metadata: Metadata = {
  title: "Personalized Protocol",
  robots: { index: false, follow: false },
};

interface PurchaseRow {
  id: string;
  product_slug: string;
  status: string;
  purchased_at: string | null;
  goal_id: string | null;
}

interface SavedPlanRow {
  id: string;
  name: string;
  quiz_snapshot: unknown;
  recommended_peptides: unknown;
  created_at: string;
}

function isGoalMatch(plan: SavedPlanRow, goalId: string | null) {
  if (!goalId) return true;
  const snapshot = plan.quiz_snapshot as Partial<PlannerAnswers> | null;
  return snapshot?.primaryGoalId === goalId;
}

function getSavedPlanResult(plan: SavedPlanRow | null) {
  if (!plan) return { answers: undefined, result: undefined };

  const answers = isPlannerAnswers(plan.quiz_snapshot)
    ? ({ ...PLANNER_DEFAULTS_FOR_PROTOCOL, ...plan.quiz_snapshot } as PlannerAnswers)
    : undefined;
  const result = answers
    ? generatePlannerResult(answers)
    : isPlannerResult(plan.recommended_peptides)
      ? plan.recommended_peptides
      : undefined;

  return { answers, result };
}

function buildGenericRecommendations(productGoalId: string | null): PlannerRecommendation[] {
  const goal = productGoalId ? getGoalById(productGoalId) : null;
  const peptideIds = goal?.peptideIds?.slice(0, 3) ?? ["semaglutide", "tirzepatide", "aod-9604"];

  return peptideIds
    .map((peptideId, index) => {
      const peptide = getPeptideById(peptideId);
      if (!peptide) return null;
      return {
        peptide,
        role: index === 0 ? "foundation" : index === 1 ? "goal-driver" : "adjunct",
        score: 0,
        rationale: [peptide.shortDescription],
        cautions: peptide.copyWarnings,
        vendors: getVendorsForPeptide(peptide.id).slice(0, 3),
      } satisfies PlannerRecommendation;
    })
    .filter((item): item is PlannerRecommendation => Boolean(item));
}

async function loadLatestPlanForUser(userId: string, goalId: string | null) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plans")
    .select("id, name, quiz_snapshot, recommended_peptides, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<SavedPlanRow[]>();

  const plans = data ?? [];
  return plans.find((plan) => isGoalMatch(plan, goalId)) ?? plans[0] ?? null;
}

export default async function GeneratedProtocolPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = getPaidPdfProduct(productSlug);
  if (!product) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/dashboard/purchases/${product.slug}/protocol`)}`);
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, product_slug, status, purchased_at, goal_id")
    .eq("user_id", user.id)
    .in("product_slug", Array.from(new Set([product.slug, productSlug])))
    .eq("status", "completed")
    .maybeSingle<PurchaseRow>();

  if (!purchase) notFound();

  const targetGoalId = purchase.goal_id ?? product.goalId;
  const savedPlan = await loadLatestPlanForUser(user.id, targetGoalId);
  const { answers, result } = getSavedPlanResult(savedPlan);
  const content = getProtocolPdfContent(product);
  const recommendations = result?.primary?.length
    ? result.primary
    : buildGenericRecommendations(product.goalId);
  const personalized = Boolean(answers && result);
  const doseReferences = buildPersonalizedDoseReferences(recommendations, answers);
  const monitoringNotes = buildMonitoringNotes(result, answers);
  const washoutNotes = buildWashoutNotes(doseReferences);
  const profile = buildProfileSnapshot(answers);
  const coverage = getDoseReferenceCoverage();

  return (
    <GeneratedProtocolView
      product={product}
      content={content}
      purchasedAt={purchase.purchased_at}
      personalized={personalized}
      profile={profile}
      recommendations={recommendations}
      doseReferences={doseReferences}
      monitoringNotes={monitoringNotes}
      washoutNotes={washoutNotes}
      dosingCoverageLabel={`${coverage.coveredPeptides}/${coverage.totalPeptides} compounds mapped`}
      backHref="/dashboard/purchases"
      backLabel="Back to purchases"
      fallbackCopy="No matching saved quiz plan was found for this purchase. This version uses the purchased product template and generic goal compounds. Retake the quiz to create a personalized saved plan before exporting again."
    />
  );
}
