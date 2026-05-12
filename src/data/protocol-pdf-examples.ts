import { getGoalById } from "@/data/goals";
import type { ProtocolPdfProduct } from "@/data/protocol-pdfs";

const AGE_RANGES = ["25-34", "35-44", "45-54", "55-64"] as const;
const SEXES = ["female", "male"] as const;
const ACTIVITY_LEVELS = ["low", "moderate", "high", "athlete"] as const;
const BUDGETS = ["budget", "mid", "premium"] as const;
const TIMEFRAMES = ["4-6 weeks", "8 weeks", "12 weeks", "12+ weeks"] as const;
const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const ROUTINE_LEVELS = ["low-friction", "moderately structured", "high-consistency"] as const;
const MONITORING_LEVELS = ["minimal", "basic", "advanced"] as const;

interface ExampleProfile {
  name: string;
  ageRange: string;
  sex: string;
  activityLevel: string;
  budget: string;
  timeframe: string;
  experience: string;
  routineConsistency: string;
  monitoring: string;
  goal: string;
  situation: string;
}

export interface ProtocolPdfExample {
  product: ProtocolPdfProduct;
  profile: ExampleProfile;
  promise: string;
  resultPath: string[];
  actionPlan: string[];
  tracker: string[];
  redFlags: string[];
  nextSevenDays: string[];
}

function hashString(value: string) {
  return Array.from(value).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function pick<T>(items: readonly T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

function getOutcomePhrase(product: ProtocolPdfProduct) {
  const goal = product.goalId ? getGoalById(product.goalId) : null;
  if (goal) return goal.displayName.toLowerCase();

  return product.name
    .replace(/ protocol| plan/gi, "")
    .toLowerCase();
}

function getProfileSituation(product: ProtocolPdfProduct, profile: Omit<ExampleProfile, "situation">) {
  const outcome = getOutcomePhrase(product);
  const intensity =
    product.kind === "primary"
      ? "wants a clear protocol path without comparing every compound manually"
      : "already knows the goal and needs the execution layer to stay consistent";

  return `${profile.name} is a ${profile.ageRange} ${profile.sex} with ${profile.activityLevel} activity, a ${profile.budget} budget, and ${profile.routineConsistency} routine capacity. They want progress on ${outcome} over ${profile.timeframe} and ${intensity}.`;
}

function buildProfile(product: ProtocolPdfProduct): ExampleProfile {
  const seed = hashString(product.slug);
  const goal = product.goalId ? getGoalById(product.goalId)?.displayName ?? product.name : product.name;
  const baseProfile = {
    name: `Sample ${pick(["Avery", "Jordan", "Morgan", "Taylor", "Riley"], seed)}`,
    ageRange: pick(AGE_RANGES, seed, 1),
    sex: pick(SEXES, seed, 2),
    activityLevel: pick(ACTIVITY_LEVELS, seed, 3),
    budget: pick(BUDGETS, seed, 4),
    timeframe: pick(TIMEFRAMES, seed, 5),
    experience: pick(EXPERIENCE_LEVELS, seed, 6),
    routineConsistency: pick(ROUTINE_LEVELS, seed, 7),
    monitoring: pick(MONITORING_LEVELS, seed, 8),
    goal,
  };

  return {
    ...baseProfile,
    situation: getProfileSituation(product, baseProfile),
  };
}

function buildPromise(product: ProtocolPdfProduct) {
  if (product.kind === "addon") {
    return `Turn the ${getOutcomePhrase(product)} goal into a repeatable weekly execution system with simple tracking and fewer missed steps.`;
  }

  return `Choose the right ${getOutcomePhrase(product)} path, avoid obvious bad-fit options, and know what to review each week before making the plan more complex.`;
}

function buildResultPath(product: ProtocolPdfProduct, profile: ExampleProfile) {
  if (product.kind === "addon") {
    return [
      `Start with the lowest-friction version because this profile has ${profile.routineConsistency} routine capacity.`,
      `Use the first week to establish baseline behavior before adding complexity.`,
      `Review the scorecard weekly and only tighten the plan when adherence is already stable.`,
    ];
  }

  return [
    `Recommended lane: ${profile.experience === "beginner" ? "conservative" : profile.experience === "advanced" ? "advanced" : "balanced"}.`,
    `Budget fit: use the ${profile.budget} lane and avoid stacking extras until the primary goal is responding.`,
    `Timeline expectation: look for directional signals inside ${profile.timeframe}, then reassess instead of escalating blindly.`,
  ];
}

function buildActionPlan(product: ProtocolPdfProduct) {
  const actionItems =
    product.kind === "primary"
      ? [
          "Pick one primary path and one backup path before comparing vendors.",
          "Write down the result you expect to see first, not every possible benefit.",
          "Use the guardrail checklist to remove bad-fit options.",
          "Set a weekly review date before starting the plan.",
        ]
      : [
          "Choose the simplest weekly template and run it for seven days.",
          "Prep the habit, meal, training, or recovery anchors before adding new tools.",
          "Track only the metrics that change the next decision.",
          "Use the troubleshooting checklist when adherence drops below 80%.",
        ];

  return [...product.includes.slice(0, 3), ...actionItems];
}

function buildTracker(product: ProtocolPdfProduct) {
  const base =
    product.kind === "primary"
      ? ["Goal progress", "Side effects or friction", "Routine completion", "Next decision"]
      : ["Daily adherence", "Energy and recovery", "Main blocker", "Next adjustment"];

  return [
    ...base,
    "Week 1 baseline",
    "Week 2 review",
    "Week 4 keep/change decision",
  ];
}

function buildRedFlags(product: ProtocolPdfProduct) {
  const shared = [
    "New or worsening symptoms that do not match the expected adjustment period.",
    "Pressure to stack more because results are not immediate.",
    "Any pregnancy, breastfeeding, fertility, cardiovascular, psychiatric, or cancer-history concern that needs clinician review.",
  ];

  if (product.kind === "addon") {
    return [
      "The execution plan is making sleep, pain, appetite, mood, or recovery worse.",
      "The user cannot complete the baseline routine for one full week.",
      ...shared.slice(1),
    ];
  }

  return shared;
}

function buildNextSevenDays(product: ProtocolPdfProduct) {
  return product.kind === "primary"
    ? [
        "Define the single result that would make this PDF successful.",
        "Complete the fit screen and remove obvious bad-fit options.",
        "Choose conservative, balanced, or advanced lane.",
        "Fill out the weekly scorecard before taking action.",
        "Prepare clinician/vendor questions.",
      ]
    : [
        "Choose one weekly template.",
        "Set baseline metrics on day one.",
        "Prepare the easiest version of the routine.",
        "Run the plan without adding new variables.",
        "Review the scorecard and adjust one thing only.",
      ];
}

export function buildProtocolPdfExample(product: ProtocolPdfProduct): ProtocolPdfExample {
  const profile = buildProfile(product);

  return {
    product,
    profile,
    promise: buildPromise(product),
    resultPath: buildResultPath(product, profile),
    actionPlan: buildActionPlan(product),
    tracker: buildTracker(product),
    redFlags: buildRedFlags(product),
    nextSevenDays: buildNextSevenDays(product),
  };
}
