import { getGoalById } from "@/data/goals";
import {
  getDoseReferencesForPeptide,
  type DoseReferenceLane,
  type DoseReferenceVariant,
} from "@/data/dosing-references";
import type { PlannerAnswers, PlannerRecommendation, PlannerResult } from "@/types/planner";

export interface ProtocolProfileSnapshot {
  label: string;
  value: string;
}

export interface PersonalizedDoseReference {
  recommendation: PlannerRecommendation;
  references: DoseReferenceVariant[];
  lane: DoseReferenceLane;
  laneReasons: string[];
}

export const PLANNER_DEFAULTS_FOR_PROTOCOL: Partial<PlannerAnswers> = {
  secondaryGoalIds: [],
  topProblems: [],
  healthConditions: [],
  medications: [],
  reproductiveStatus: "none",
  femaleLifeStage: "not_applicable",
  maleHormoneContext: "not_applicable",
  notes: "",
  deliveryPreference: "flexible",
  stackingPreference: "basic_stack",
  routineConsistency: "medium",
  monitoringWillingness: "basic",
  planStyle: "balanced",
};

export function isPlannerAnswers(value: unknown): value is PlannerAnswers {
  if (!value || typeof value !== "object") return false;
  const answers = value as Partial<PlannerAnswers>;
  return Boolean(
    answers.country &&
      answers.ageRange &&
      answers.sex &&
      answers.activityLevel &&
      answers.experience &&
      answers.primaryGoalId &&
      answers.budget &&
      answers.deliveryPreference &&
      answers.monitoringWillingness &&
      answers.riskTolerance &&
      answers.planStyle &&
      answers.timeframe &&
      Array.isArray(answers.topProblems) &&
      Array.isArray(answers.healthConditions) &&
      Array.isArray(answers.medications)
  );
}

export function isPlannerResult(value: unknown): value is PlannerResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<PlannerResult>;
  return Array.isArray(result.primary) && Array.isArray(result.alternatives);
}

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildProfileSnapshot(answers?: PlannerAnswers): ProtocolProfileSnapshot[] {
  if (!answers) {
    return [
      { label: "Personalization", value: "No saved quiz snapshot found - generic product template" },
    ];
  }

  const goal = getGoalById(answers.primaryGoalId);
  const items: ProtocolProfileSnapshot[] = [
    { label: "Goal", value: goal?.displayName ?? titleCase(answers.primaryGoalId) },
    { label: "Age range", value: answers.ageRange },
    { label: "Sex", value: titleCase(answers.sex) },
    { label: "Activity", value: titleCase(answers.activityLevel) },
    { label: "Experience", value: titleCase(answers.experience) },
    { label: "Plan style", value: titleCase(answers.planStyle) },
    { label: "Monitoring", value: titleCase(answers.monitoringWillingness) },
    { label: "Delivery", value: titleCase(answers.deliveryPreference) },
  ];

  if (answers.healthConditions.length > 0) {
    items.push({ label: "Health context", value: answers.healthConditions.map(titleCase).join(", ") });
  }

  if (answers.medications.length > 0) {
    items.push({ label: "Medication context", value: answers.medications.map(titleCase).join(", ") });
  }

  if (answers.reproductiveStatus !== "none") {
    items.push({ label: "Reproductive context", value: titleCase(answers.reproductiveStatus) });
  }

  return items;
}

export function chooseDoseReferenceLane(
  answers: PlannerAnswers | undefined,
  recommendation: PlannerRecommendation
): { lane: DoseReferenceLane; reasons: string[] } {
  if (!answers) {
    return {
      lane: "standard_reference_lane",
      reasons: ["No saved quiz snapshot was found, so the generated protocol uses the product template lane."],
    };
  }

  const cautionReasons: string[] = [];
  const upperReasons: string[] = [];

  if (answers.experience === "beginner") cautionReasons.push("Beginner experience favors a lower reference-start lane.");
  if (answers.ageRange === "65+" || answers.ageRange === "55-64") cautionReasons.push("Older age range favors conservative reference selection.");
  if (answers.planStyle === "conservative") cautionReasons.push("Conservative plan style favors the low-reference lane.");
  if (answers.monitoringWillingness === "minimal") cautionReasons.push("Minimal monitoring tolerance favors a lower reference lane.");
  if (answers.reproductiveStatus !== "none") cautionReasons.push("Reproductive context requires a tighter screen.");
  if (answers.healthConditions.length > 0) cautionReasons.push("Health-condition context adds caution flags.");
  if (answers.medications.length > 0) cautionReasons.push("Medication context adds interaction-review needs.");
  if (answers.deliveryPreference === "oral_topical_only" || answers.deliveryPreference === "avoid_injections") {
    cautionReasons.push("Delivery preference conflicts with many injectable reference protocols.");
  }
  if (recommendation.cautions.length > 0) cautionReasons.push("Planner cautions were attached to this compound.");

  if (answers.activityLevel === "athlete" || answers.activityLevel === "high") {
    upperReasons.push("High activity or athlete context can justify upper-reference discussion when no major caution flags apply.");
  }
  if (answers.topProblems.some((problem) => problem.includes("injury") || problem.includes("recovery"))) {
    upperReasons.push("Recovery/injury context can justify upper-reference discussion when no major caution flags apply.");
  }
  if (answers.experience === "advanced") {
    upperReasons.push("Advanced experience supports a broader discussion range when monitoring is adequate.");
  }

  if (cautionReasons.length > 0) {
    return { lane: "low_reference_lane", reasons: cautionReasons.slice(0, 4) };
  }

  if (upperReasons.length > 0 && answers.monitoringWillingness === "advanced") {
    return { lane: "upper_reference_lane", reasons: upperReasons.slice(0, 3) };
  }

  return {
    lane: "standard_reference_lane",
    reasons: ["Profile did not trigger a major low-lane caution or advanced upper-lane condition."],
  };
}

export function buildPersonalizedDoseReferences(
  recommendations: PlannerRecommendation[],
  answers?: PlannerAnswers
): PersonalizedDoseReference[] {
  return recommendations.map((recommendation) => {
    const lane = chooseDoseReferenceLane(answers, recommendation);
    return {
      recommendation,
      references: getDoseReferencesForPeptide(recommendation.peptide.id),
      lane: lane.lane,
      laneReasons: lane.reasons,
    };
  });
}

export function buildMonitoringNotes(plan: PlannerResult | undefined, answers?: PlannerAnswers) {
  const notes = new Set<string>();

  notes.add("Track response, side effects, adherence, and any reason to stop or seek clinician review.");
  notes.add("Use dose ranges as reference context only; dose, route, and titration should be clinician-confirmed.");

  if (answers?.monitoringWillingness === "minimal") {
    notes.add("Minimal monitoring tolerance means the protocol should stay simple and conservative.");
  }

  for (const recommendation of plan?.primary ?? []) {
    const category = recommendation.peptide.category;
    if (category === "gh_axis" || category === "growth_factor") {
      notes.add("GH-axis or growth-factor compounds warrant IGF-1/glucose-style monitoring discussion.");
    }
    if (category === "metabolic") {
      notes.add("Metabolic compounds warrant GI tolerance, hydration, gallbladder/pancreatitis symptom, and medication-overlap review.");
    }
    if (category === "immune" || category === "antimicrobial") {
      notes.add("Immune/inflammatory compounds warrant symptom tracking and clear escalation triggers.");
    }
    if (recommendation.peptide.wadaFlag !== "none") {
      notes.add("Athletes should check WADA/USADA status before using any prohibited or unclear compound.");
    }
  }

  return Array.from(notes);
}

export function buildWashoutNotes(references: PersonalizedDoseReference[]) {
  const notes = new Set<string>();
  notes.add("Default planning rule: use an equal-to-cycle washout unless product-specific or clinician-specific guidance differs.");

  for (const item of references) {
    for (const reference of item.references) {
      if (reference.washoutRule) notes.add(`${item.recommendation.peptide.name}: ${reference.washoutRule}`);
    }
  }

  return Array.from(notes).slice(0, 8);
}
