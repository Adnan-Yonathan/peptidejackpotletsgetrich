import type {
  QuizAnswers,
  RecommendationResult,
  PeptideRecommendation,
  Peptide,
  RecommendationRule,
  PeptideGoal,
  VendorPeptide,
  CompatibilityRule,
} from "@/types/database";

interface RuleWithPeptide extends RecommendationRule {
  peptide: Peptide;
}

interface EngineInput {
  answers: QuizAnswers;
  rules: RuleWithPeptide[];
  peptideGoals: PeptideGoal[];
  vendorPeptides: VendorPeptide[];
  compatibilityRules: CompatibilityRule[];
}

export function generateRecommendations(input: EngineInput): RecommendationResult {
  const { answers, rules, peptideGoals, vendorPeptides, compatibilityRules } = input;

  // 1. Filter rules that match the user's quiz answers
  const matchedRules = rules.filter((rule) => {
    if (rule.goal_id && rule.goal_id !== answers.goalId) return false;
    if (rule.budget_tier && rule.budget_tier !== answers.budget) return false;
    if (rule.experience_level && rule.experience_level !== answers.experience) return false;
    if (rule.risk_tolerance && rule.risk_tolerance < answers.riskTolerance) return false;
    if (rule.timeframe && rule.timeframe !== answers.timeframe) return false;
    if (rule.stacking_preference && rule.stacking_preference !== answers.stackingPreference)
      return false;
    if (!rule.is_active) return false;
    if (rule.peptide.status !== "published") return false;
    if (rule.peptide.risk_level > answers.riskTolerance) return false;
    return true;
  });

  // 2. Score each peptide: rule.priority + relevance_score for the selected goal
  const peptideScores = new Map<string, { peptide: Peptide; score: number }>();

  for (const rule of matchedRules) {
    const existing = peptideScores.get(rule.peptide_id);
    const goalRelevance =
      peptideGoals.find(
        (pg) => pg.peptide_id === rule.peptide_id && pg.goal_id === answers.goalId
      )?.relevance_score ?? 0;

    const score = rule.priority + goalRelevance;

    if (!existing || score > existing.score) {
      peptideScores.set(rule.peptide_id, { peptide: rule.peptide, score });
    }
  }

  // 3. Sort by score descending
  const sorted = Array.from(peptideScores.values()).sort((a, b) => b.score - a.score);

  // 4. Determine how many to recommend based on stacking preference
  let primaryCount: number;
  switch (answers.stackingPreference) {
    case "single":
      primaryCount = 1;
      break;
    case "basic_stack":
      primaryCount = Math.min(3, sorted.length);
      break;
    case "advanced_stack":
      primaryCount = Math.min(5, sorted.length);
      break;
    default:
      primaryCount = 1;
  }

  const primaryPeptides = sorted.slice(0, primaryCount);
  const alternativePeptides = sorted.slice(primaryCount, primaryCount + 5);

  // 5. Check compatibility for primary selections
  const warnings: string[] = [];
  const primaryIds = primaryPeptides.map((p) => p.peptide.id);

  for (let i = 0; i < primaryIds.length; i++) {
    for (let j = i + 1; j < primaryIds.length; j++) {
      const rule = compatibilityRules.find(
        (cr) =>
          (cr.peptide_a_id === primaryIds[i] && cr.peptide_b_id === primaryIds[j]) ||
          (cr.peptide_a_id === primaryIds[j] && cr.peptide_b_id === primaryIds[i])
      );
      if (rule?.compatibility === "conflict") {
        warnings.push(
          rule.note ||
            `Potential conflict between ${primaryPeptides[i].peptide.name} and ${primaryPeptides[j].peptide.name}`
        );
      } else if (rule?.compatibility === "caution") {
        warnings.push(
          rule.note ||
            `Use caution combining ${primaryPeptides[i].peptide.name} and ${primaryPeptides[j].peptide.name}`
        );
      }
    }
  }

  // 6. Build recommendation objects with vendor options
  function buildRecommendation(item: {
    peptide: Peptide;
    score: number;
  }): PeptideRecommendation {
    const options = vendorPeptides.filter((vp) => vp.peptide_id === item.peptide.id && vp.in_stock);
    const goalMatch = peptideGoals.find(
      (pg) => pg.peptide_id === item.peptide.id && pg.goal_id === answers.goalId
    );

    return {
      peptide: item.peptide,
      score: item.score,
      rationale: buildRationale(item.peptide, goalMatch?.relevance_score ?? 0, answers),
      vendorOptions: options.sort((a, b) => a.price - b.price),
    };
  }

  const primary = primaryPeptides.map(buildRecommendation);
  const alternatives = alternativePeptides.map(buildRecommendation);

  // 7. Estimate costs from primary recommendations
  let costLow = 0;
  let costHigh = 0;
  for (const rec of primary) {
    if (rec.vendorOptions.length > 0) {
      costLow += rec.vendorOptions[0].price;
      costHigh += rec.vendorOptions[rec.vendorOptions.length - 1].price;
    } else {
      costLow += rec.peptide.price_range_low ?? 0;
      costHigh += rec.peptide.price_range_high ?? 0;
    }
  }

  // 8. Timeline from the longest cycle in primary
  const timelineWeeks = Math.max(
    ...primary.map((r) => r.peptide.typical_cycle_weeks ?? 8),
    4
  );

  return {
    primary,
    alternatives,
    estimatedMonthlyCost: { low: costLow, high: costHigh },
    timelineWeeks,
    warnings,
  };
}

function buildRationale(
  peptide: Peptide,
  relevanceScore: number,
  answers: QuizAnswers
): string {
  const parts: string[] = [];

  if (relevanceScore >= 8) {
    parts.push(`Highly relevant to your selected goal`);
  } else if (relevanceScore >= 5) {
    parts.push(`Good match for your selected goal`);
  }

  if (peptide.experience_level === answers.experience) {
    parts.push(`suitable for ${answers.experience}-level users`);
  }

  if (peptide.budget_tier === answers.budget) {
    parts.push(`fits your ${answers.budget} budget`);
  }

  if (peptide.risk_level <= 2) {
    parts.push("well-tolerated research profile");
  }

  return parts.length > 0
    ? parts[0].charAt(0).toUpperCase() + parts.join(", ").slice(1) + "."
    : "Matches your profile based on the criteria provided.";
}
