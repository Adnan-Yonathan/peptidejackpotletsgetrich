import {
  getAgeCautionReason,
  getAgeExclusionReason,
  getDisclaimersForPeptide,
  getMonitoringGuidanceForPeptide,
  getPublishedPeptides,
  getSexCautionReason,
  getSexExclusionReason,
  getSexRationale,
  getVendorsForPeptide,
  GOALS,
  type PeptideData,
  type RiskLevel,
} from "@/data";
import { getCompatibility } from "@/data/compatibility";
import {
  ACTIVITY_LEVEL_OPTIONS,
  AGE_RANGE_OPTIONS,
  EXPERIENCE_OPTIONS,
  FEMALE_LIFE_STAGE_OPTIONS,
  HEALTH_CONDITION_OPTIONS,
  MALE_HORMONE_CONTEXT_OPTIONS,
  MEDICATION_OPTIONS,
  MONITORING_OPTIONS,
  PLAN_STYLE_OPTIONS,
  PROBLEM_OPTIONS,
  REPRODUCTIVE_STATUS_OPTIONS,
  ROUTINE_OPTIONS,
  SEX_OPTIONS,
  STACKING_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "@/data/planner-options";
import { COUNTRY_OPTIONS } from "@/data/planner-options";
import type {
  ExcludedCompound,
  PlannerAnswers,
  PlannerRecommendation,
  PlannerResult,
} from "@/types/planner";

const riskOrder: RiskLevel[] = ["low", "medium", "med-high", "high", "extreme"];
const tierScore: Record<PeptideData["evidenceTier"], number> = {
  A: 18,
  B: 14,
  "B-C": 11,
  C: 7,
  "C-D": 4,
  D: 1,
};

const REPRODUCTIVE_HIGH_RISK_CATEGORIES = new Set<PeptideData["category"]>([
  "gh_axis",
  "growth_factor",
  "reproductive",
  "melanocortin",
]);

const REPRODUCTIVE_HIGH_RISK_IDS = new Set([
  "semaglutide",
  "tirzepatide",
  "liraglutide",
  "retatrutide",
  "bpc-157",
  "tb-500",
  "mk-677",
  "pt-141",
  "kisspeptin",
  "tesamorelin",
]);

export function generatePlannerResult(answers: PlannerAnswers): PlannerResult {
  const peptides = getPublishedPeptides();
  const identifiedNeeds = buildIdentifiedNeeds(answers);
  const exclusions: ExcludedCompound[] = [];
  const candidates: PlannerRecommendation[] = [];

  for (const peptide of peptides) {
    const exclusionReasons = getExclusionReasons(peptide, answers);

    if (exclusionReasons.length > 0) {
      exclusions.push({ peptide, reasons: exclusionReasons });
      continue;
    }

    candidates.push(scorePeptide(peptide, answers));
  }

  const sorted = candidates.sort((a, b) => b.score - a.score);
  const primaryCount = answers.stackingPreference === "single"
    ? 1
    : answers.stackingPreference === "basic_stack"
      ? 2
      : 3;

  const primary = sorted.slice(0, primaryCount);
  const alternatives = sorted.slice(primaryCount, primaryCount + 4);
  const compatibilityWarnings = buildCompatibilityWarnings(primary);
  const safetyNotes = buildSafetyNotes(answers, primary, compatibilityWarnings);

  return {
    profileSummary: buildProfileSummary(answers),
    planHeadline: buildPlanHeadline(answers),
    identifiedNeeds,
    primary,
    alternatives,
    excluded: exclusions
      .sort((a, b) => rankExclusion(a, answers) - rankExclusion(b, answers))
      .slice(0, 6),
    compatibilityWarnings,
    safetyNotes,
    timelineSummary: buildTimelineSummary(answers),
    programPhases: buildProgramPhases(answers, primary.length),
  };
}

function scorePeptide(peptide: PeptideData, answers: PlannerAnswers): PlannerRecommendation {
  let score = 0;
  const rationale: string[] = [];
  const cautions: string[] = [];

  const goal = GOALS.find((item) => item.id === answers.primaryGoalId);
  const secondaryGoals = GOALS.filter((item) => answers.secondaryGoalIds.includes(item.id));
  const relatedProblems = PROBLEM_OPTIONS.filter((item) => answers.topProblems.includes(item.id));
  const disclaimers = getDisclaimersForPeptide(peptide.copyWarnings);

  if (goal?.peptideIds.includes(peptide.id)) {
    score += 30;
    rationale.push(`Directly supports your primary goal: ${goal.displayName.toLowerCase()}.`);
  }

  for (const secondaryGoal of secondaryGoals) {
    if (secondaryGoal.peptideIds.includes(peptide.id)) {
      score += 10;
      rationale.push(`Also aligns with your secondary goal: ${secondaryGoal.displayName.toLowerCase()}.`);
    }
  }

  for (const problem of relatedProblems) {
    if (problem.peptideIds?.includes(peptide.id)) {
      score += 16;
      rationale.push(`Targets one of your stated problems: ${problem.label.toLowerCase()}.`);
    } else if (problem.goalIds.some((goalId) => getGoalPeptideIds(goalId).has(peptide.id))) {
      score += 7;
    }
  }

  if (peptide.experienceLevel === answers.experience) {
    score += 8;
    rationale.push(`Matches your ${answers.experience} experience level.`);
  }

  if (peptide.budgetTier === answers.budget) {
    score += 6;
    rationale.push(`Fits your ${answers.budget} budget lane.`);
  }

  score += tierScore[peptide.evidenceTier];

  if (answers.planStyle === "conservative") {
    score += peptide.riskLevel === "medium" || peptide.riskLevel === "low" ? 10 : -12;
    score += peptide.evidenceTier === "A" || peptide.evidenceTier === "B" ? 8 : 0;
  } else if (answers.planStyle === "aggressive") {
    score += peptide.evidenceTier === "C" || peptide.evidenceTier === "C-D" ? 3 : 0;
  }

  if (answers.activityLevel === "athlete" || answers.activityLevel === "high") {
    if (peptide.category === "tissue_repair" || peptide.category === "muscle_repair") {
      score += 6;
    }
  }

  if (answers.ageRange === "55-64" || answers.ageRange === "65+") {
    if (peptide.riskLevel === "high" || peptide.riskLevel === "extreme") {
      score -= 10;
      cautions.push("Higher-friction fit for an older profile; conservative gating is warranted.");
    }
  }

  const ageCaution = getAgeCautionReason(peptide.id, answers.ageRange);
  if (ageCaution) {
    score -= 6;
    cautions.push(ageCaution);
  }

  const sexRationale = getSexRationale(peptide.id, answers.sex);
  if (sexRationale) {
    score += 4;
    rationale.push(sexRationale);
  }

  const sexCaution = getSexCautionReason(peptide.id, answers.sex);
  if (sexCaution) {
    score -= 4;
    cautions.push(sexCaution);
  }

  if (answers.reproductiveStatus !== "none") {
    if (REPRODUCTIVE_HIGH_RISK_CATEGORIES.has(peptide.category) || REPRODUCTIVE_HIGH_RISK_IDS.has(peptide.id)) {
      score -= 10;
      cautions.push("Your reproductive status pushes hormone-active and lower-confidence compounds into a more conservative lane.");
    }
  }

  if (answers.sex === "male") {
    if (answers.maleHormoneContext === "on_trt_or_androgen_therapy" && (peptide.category === "gh_axis" || peptide.category === "reproductive")) {
      score -= 5;
      cautions.push("Existing male hormone therapy raises the bar for layering on additional GH-axis or reproductive signaling.");
    }

    if (answers.maleHormoneContext === "prostate_or_psa_monitoring" && (peptide.category === "gh_axis" || peptide.category === "growth_factor")) {
      score -= 9;
      cautions.push("Prostate or PSA monitoring makes GH-axis and growth-signaling compounds a more cautious fit.");
    }
  }

  const monitoringGuidance = getMonitoringGuidanceForPeptide(peptide.id);
  if (monitoringGuidance) {
    if (answers.monitoringWillingness === "minimal") {
      if (monitoringGuidance.burden === "high") {
        score -= 12;
        cautions.push("Monitoring burden is high for your preferred level of tracking.");
      } else if (monitoringGuidance.burden === "medium") {
        score -= 5;
      }
    } else if (answers.monitoringWillingness === "basic" && monitoringGuidance.burden === "high") {
      score -= 4;
    }

    if (answers.monitoringWillingness === "advanced" && monitoringGuidance.burden === "high") {
      score += 3;
      rationale.push("Your monitoring tolerance makes this a more realistic option to evaluate safely.");
    }
  }

  const deliveryPenalty = getDeliveryPenalty(peptide, answers.deliveryPreference);
  score += deliveryPenalty;
  if (deliveryPenalty < 0) {
    cautions.push("Route does not perfectly fit your delivery preference.");
  }

  for (const disclaimer of disclaimers) {
    if (disclaimer.severity === "danger") {
      score -= 6;
      cautions.push(disclaimer.shortLabel);
    } else if (disclaimer.severity === "warning") {
      score -= 2;
    }
  }

  return {
    peptide,
    role: inferRole(peptide, score, answers),
    score,
    rationale: dedupeStrings(rationale).slice(0, 4),
    cautions: dedupeStrings(cautions).slice(0, 4),
    vendors: getVendorsForPeptide(peptide.id).slice(0, 3),
  };
}

function getExclusionReasons(peptide: PeptideData, answers: PlannerAnswers): string[] {
  const reasons: string[] = [];
  const maxRiskIndex = answers.riskTolerance - 1;

  if (riskOrder.indexOf(peptide.riskLevel) > maxRiskIndex) {
    reasons.push(`Exceeds your current risk tolerance (${answers.riskTolerance}/5).`);
  }

  if (answers.deliveryPreference === "oral_topical_only" && hasInjectableRoute(peptide)) {
    reasons.push("Requires an injectable-first route, which conflicts with your delivery preference.");
  }

  const ageExclusion = getAgeExclusionReason(peptide.id, answers.ageRange);
  if (ageExclusion) {
    reasons.push(ageExclusion);
  }

  const sexExclusion = getSexExclusionReason(peptide.id, answers.sex);
  if (sexExclusion) {
    reasons.push(sexExclusion);
  }

  if (answers.reproductiveStatus !== "none") {
    if (REPRODUCTIVE_HIGH_RISK_IDS.has(peptide.id) || REPRODUCTIVE_HIGH_RISK_CATEGORIES.has(peptide.category)) {
      reasons.push(`Excluded because your reproductive status (${getLabel(REPRODUCTIVE_STATUS_OPTIONS, answers.reproductiveStatus).toLowerCase()}) requires a tighter screen around hormone-active or poorly studied compounds.`);
    }
  }

  if (answers.sex === "male" && answers.maleHormoneContext === "prostate_or_psa_monitoring" && peptide.category === "growth_factor") {
    reasons.push("Excluded because prostate or PSA monitoring is a poor match for added growth-signaling risk.");
  }

  for (const condition of HEALTH_CONDITION_OPTIONS.filter((item) =>
    answers.healthConditions.includes(item.id)
  )) {
    if (condition.avoidPeptideIds?.includes(peptide.id)) {
      reasons.push(`Conflicts with your health context: ${condition.label.toLowerCase()}.`);
    }
    if (condition.avoidCategories?.includes(peptide.category)) {
      reasons.push(`Excluded because your health context makes ${peptide.category.replaceAll("_", " ")} compounds a poor fit.`);
    }
  }

  for (const medication of MEDICATION_OPTIONS.filter((item) =>
    answers.medications.includes(item.id)
  )) {
    if (medication.avoidPeptideIds?.includes(peptide.id)) {
      reasons.push(`Conflicts with your medication context: ${medication.label.toLowerCase()}.`);
    }
    if (medication.avoidCategories?.includes(peptide.category)) {
      reasons.push(`Excluded due to medication overlap with ${peptide.category.replaceAll("_", " ")} compounds.`);
    }
  }

  if (
    answers.planStyle === "conservative" &&
    (peptide.riskLevel === "high" || peptide.riskLevel === "extreme")
  ) {
    reasons.push("Dropped because you asked for a conservative program style.");
  }

  return dedupeStrings(reasons);
}

function buildIdentifiedNeeds(answers: PlannerAnswers): string[] {
  const needs = [`Shopping region: ${getLabel(COUNTRY_OPTIONS, answers.country)}`].concat(
    PROBLEM_OPTIONS.filter((item) => answers.topProblems.includes(item.id)).map(
    (item) => item.label
    )
  );

  for (const condition of HEALTH_CONDITION_OPTIONS) {
    if (answers.healthConditions.includes(condition.id)) {
      needs.push(`Safety constraint: ${condition.label}`);
    }
  }

  if (answers.reproductiveStatus !== "none") {
    needs.push(`Reproductive context: ${getLabel(REPRODUCTIVE_STATUS_OPTIONS, answers.reproductiveStatus)}`);
  }

  if (answers.sex === "female" && answers.femaleLifeStage && answers.femaleLifeStage !== "not_applicable") {
    needs.push(`Female life stage: ${getLabel(FEMALE_LIFE_STAGE_OPTIONS, answers.femaleLifeStage)}`);
  }

  if (answers.sex === "male" && answers.maleHormoneContext && answers.maleHormoneContext !== "not_applicable" && answers.maleHormoneContext !== "none_known") {
    needs.push(`Male hormone context: ${getLabel(MALE_HORMONE_CONTEXT_OPTIONS, answers.maleHormoneContext)}`);
  }

  return needs.slice(0, 6);
}

function buildCompatibilityWarnings(primary: PlannerRecommendation[]): string[] {
  const warnings: string[] = [];

  for (let i = 0; i < primary.length; i++) {
    for (let j = i + 1; j < primary.length; j++) {
      const result = getCompatibility(primary[i].peptide.id, primary[j].peptide.id);
      if (result.rule) {
        warnings.push(
          `${primary[i].peptide.name} + ${primary[j].peptide.name}: ${result.rule.rationaleSummary}`
        );
      }
    }
  }

  return warnings;
}

function buildSafetyNotes(
  answers: PlannerAnswers,
  primary: PlannerRecommendation[],
  compatibilityWarnings: string[]
): string[] {
  const notes: string[] = [];

  if (answers.healthConditions.length > 0) {
    notes.push("Your selected health conditions force a more conservative screening threshold.");
  }

  if (answers.medications.length > 0) {
    notes.push("Medication overlap was treated as a caution signal even when hard exclusion was not triggered.");
  }

  if (answers.monitoringWillingness === "minimal") {
    notes.push("Plans were biased away from compounds that usually require heavier monitoring or interpretation.");
  }

  if (answers.reproductiveStatus !== "none") {
    notes.push("Reproductive status was treated as a hard safety gate, so hormone-active and poorly studied compounds were screened more aggressively.");
  }

  if (answers.sex === "female" && answers.femaleLifeStage === "perimenopause") {
    notes.push("Perimenopause context was treated as a reason to stay practical about sleep, metabolic health, recovery, and bone-related tradeoffs instead of chasing aggressive hormone claims.");
  }

  if (answers.sex === "female" && answers.femaleLifeStage === "postmenopause") {
    notes.push("Postmenopause context was treated as a reason to emphasize metabolic, recovery, and bone-health practicality over speculative endocrine optimization.");
  }

  if (answers.sex === "male" && answers.maleHormoneContext === "on_trt_or_androgen_therapy") {
    notes.push("Existing TRT or androgen therapy was treated as a caution signal against casually layering in more endocrine-active compounds.");
  }

  if (answers.sex === "male" && answers.maleHormoneContext === "prostate_or_psa_monitoring") {
    notes.push("Prostate or PSA monitoring pushed the planner more conservative around GH-axis and growth-signaling compounds.");
  }

  const heavierMonitoring = primary
    .map((item) => getMonitoringGuidanceForPeptide(item.peptide.id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => item.burden === "high");

  if (heavierMonitoring.length > 0) {
    notes.push("Some recommended compounds carry a heavier monitoring burden, so baseline labs and follow-up discipline matter.");
  }

  if (compatibilityWarnings.length > 0) {
    notes.push("Any stack-level cautions shown below should be treated as reasons to simplify, not reasons to stack harder.");
  }

  const disclaimers = primary.flatMap((item) => getDisclaimersForPeptide(item.peptide.copyWarnings));
  for (const disclaimer of disclaimers.filter((item) => item.severity !== "info")) {
    notes.push(`${disclaimer.shortLabel}: ${disclaimer.text}`);
  }

  return dedupeStrings(notes).slice(0, 6);
}

function buildProfileSummary(answers: PlannerAnswers): string {
  const country = getLabel(COUNTRY_OPTIONS, answers.country);
  const age = getLabel(AGE_RANGE_OPTIONS, answers.ageRange);
  const sex = getLabel(SEX_OPTIONS, answers.sex);
  const activity = getLabel(ACTIVITY_LEVEL_OPTIONS, answers.activityLevel);
  const experience = getLabel(EXPERIENCE_OPTIONS, answers.experience);
  const goal = GOALS.find((item) => item.id === answers.primaryGoalId)?.displayName ?? "custom goal";
  const profileParts = [
    `${age}, ${sex.toLowerCase()}, ${activity.toLowerCase()}, ${experience.toLowerCase()} profile`,
  ];

  if (answers.reproductiveStatus !== "none") {
    profileParts.push(getLabel(REPRODUCTIVE_STATUS_OPTIONS, answers.reproductiveStatus).toLowerCase());
  }

  if (answers.sex === "female" && answers.femaleLifeStage && answers.femaleLifeStage !== "not_applicable") {
    profileParts.push(getLabel(FEMALE_LIFE_STAGE_OPTIONS, answers.femaleLifeStage).toLowerCase());
  }

  if (answers.sex === "male" && answers.maleHormoneContext && answers.maleHormoneContext !== "not_applicable" && answers.maleHormoneContext !== "none_known") {
    profileParts.push(getLabel(MALE_HORMONE_CONTEXT_OPTIONS, answers.maleHormoneContext).toLowerCase());
  }

  return `${profileParts.join(", ")} in ${country}, focused on ${goal.toLowerCase()}.`;
}

function buildPlanHeadline(answers: PlannerAnswers): string {
  const style = getLabel(PLAN_STYLE_OPTIONS, answers.planStyle);
  const goal = GOALS.find((item) => item.id === answers.primaryGoalId)?.displayName ?? "Custom goal";
  return `${style} ${goal} program`;
}

function buildTimelineSummary(answers: PlannerAnswers): string {
  const timeframe = getLabel(TIMEFRAME_OPTIONS, answers.timeframe);
  const routine = getLabel(ROUTINE_OPTIONS, answers.routineConsistency);
  const monitoring = getLabel(MONITORING_OPTIONS, answers.monitoringWillingness);

  return `${timeframe} horizon with a ${routine.toLowerCase()} routine profile and ${monitoring.toLowerCase()} tracking tolerance.`;
}

function buildProgramPhases(
  answers: PlannerAnswers,
  primaryCount: number
): { title: string; description: string }[] {
  const stackStyle = getLabel(STACKING_OPTIONS, answers.stackingPreference);

  return [
    {
      title: "Phase 1: Foundation",
      description: `Start with a ${stackStyle.toLowerCase()} structure, prioritize adherence, and establish a clean baseline before adding complexity.`,
    },
    {
      title: "Phase 2: Evaluate response",
      description: `Use your ${getLabel(TIMEFRAME_OPTIONS, answers.timeframe).toLowerCase()} timeframe to judge whether ${primaryCount} selected compound${primaryCount === 1 ? "" : "s"} are actually moving the needle on your stated problems.`,
    },
    {
      title: "Phase 3: Scale or simplify",
      description: "Keep only the pieces that fit your risk tolerance, delivery preference, and recovery capacity. Drop any compound that adds friction without clear benefit.",
    },
  ];
}

function inferRole(
  peptide: PeptideData,
  score: number,
  answers: PlannerAnswers
): PlannerRecommendation["role"] {
  const problemMatch = PROBLEM_OPTIONS.some(
    (item) => answers.topProblems.includes(item.id) && item.peptideIds?.includes(peptide.id)
  );

  if (problemMatch) return "goal-driver";
  if (score >= 45 && (peptide.evidenceTier === "A" || peptide.evidenceTier === "B")) {
    return "foundation";
  }

  return "adjunct";
}

function getDeliveryPenalty(
  peptide: PeptideData,
  preference: PlannerAnswers["deliveryPreference"]
): number {
  if (preference === "flexible" || preference === "injectable_ok") return 0;
  if (!hasInjectableRoute(peptide)) return 4;
  if (preference === "avoid_injections") return -8;
  return -20;
}

function hasInjectableRoute(peptide: PeptideData): boolean {
  return peptide.administrationRoutes.some((route) =>
    route.includes("subcutaneous") ||
    route.includes("intravenous") ||
    route.includes("implant")
  );
}

function getGoalPeptideIds(goalId: string): Set<string> {
  return new Set(GOALS.find((item) => item.id === goalId)?.peptideIds ?? []);
}

function rankExclusion(exclusion: ExcludedCompound, answers: PlannerAnswers): number {
  let rank = 100;
  if (GOALS.find((item) => item.id === answers.primaryGoalId)?.peptideIds.includes(exclusion.peptide.id)) {
    rank -= 30;
  }
  rank -= exclusion.reasons.length * 5;
  return rank;
}

function getLabel<T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T
): string {
  return options.find((item) => item.value === value)?.label ?? value;
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}
