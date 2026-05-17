import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeneratedProtocolView } from "@/components/protocol/GeneratedProtocolView";
import { getDoseReferenceCoverage } from "@/data/dosing-references";
import { getGoalById } from "@/data/goals";
import { getPeptideById } from "@/data/peptides";
import { getProtocolPdfContent } from "@/data/protocol-pdf-content";
import { getVendorsForPeptide } from "@/data/vendors";
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
import { hashPurchaseAccessToken } from "@/lib/purchase-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPaidPdfProduct } from "@/lib/stripe/products";
import type { PlannerAnswers, PlannerRecommendation } from "@/types/planner";

export const metadata: Metadata = {
  title: "Personalized Protocol",
  robots: { index: false, follow: false },
};

interface AccessPurchaseRow {
  id: string;
  user_id: string | null;
  product_slug: string;
  status: string;
  purchased_at: string | null;
  goal_id: string | null;
  quiz_snapshot: unknown;
  recommended_peptides: unknown;
}

function getSavedPurchaseResult(purchase: AccessPurchaseRow) {
  const answers = isPlannerAnswers(purchase.quiz_snapshot)
    ? ({ ...PLANNER_DEFAULTS_FOR_PROTOCOL, ...purchase.quiz_snapshot } as PlannerAnswers)
    : undefined;
  const result = answers
    ? generatePlannerResult(answers)
    : isPlannerResult(purchase.recommended_peptides)
      ? purchase.recommended_peptides
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

export default async function PurchaseAccessProtocolPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!token || token.length < 32) notFound();

  const tokenHash = hashPurchaseAccessToken(token);
  const supabase = createAdminClient();
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, user_id, product_slug, status, purchased_at, goal_id, quiz_snapshot, recommended_peptides")
    .eq("access_token_hash", tokenHash)
    .eq("status", "completed")
    .maybeSingle<AccessPurchaseRow>();

  if (!purchase) notFound();

  const authClient = await createClient().catch(() => null);
  const {
    data: { user },
  } = authClient ? await authClient.auth.getUser() : { data: { user: null } };
  if (user && !purchase.user_id) {
    await supabase.from("purchases").update({ user_id: user.id }).eq("id", purchase.id);
  }

  await supabase
    .from("purchases")
    .update({ access_token_last_used_at: new Date().toISOString() })
    .eq("id", purchase.id);

  const product = getPaidPdfProduct(purchase.product_slug);
  if (!product) notFound();

  const { answers, result } = getSavedPurchaseResult(purchase);
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
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-8">
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
        backHref="/purchases/recover"
        backLabel="Recover another purchase"
        fallbackCopy="No matching quiz result was found for this purchase. This version uses the purchased product template and generic goal compounds."
      />
    </main>
  );
}
