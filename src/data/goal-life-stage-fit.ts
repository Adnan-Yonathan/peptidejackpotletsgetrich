import type { AgeRange } from "@/types/planner";

export interface GoalLifeStageFit {
  goalId: string;
  ageRange: AgeRange;
  peptideIds: string[];
  note: string;
}

export const GOAL_LIFE_STAGE_FIT: GoalLifeStageFit[] = [
  {
    goalId: "fat_loss",
    ageRange: "35-44",
    peptideIds: ["semaglutide", "tirzepatide", "liraglutide", "mots-c"],
    note: "Midlife fat-loss decisions skew toward compounds with clearer human evidence and metabolic outcomes.",
  },
  {
    goalId: "fat_loss",
    ageRange: "45-54",
    peptideIds: ["semaglutide", "tirzepatide", "liraglutide", "mots-c"],
    note: "Later fat-loss planning should tilt toward evidence-backed metabolic compounds over speculative GH-driven shortcuts.",
  },
  {
    goalId: "muscle_growth",
    ageRange: "25-34",
    peptideIds: ["cjc-1295", "ipamorelin", "mk-677"],
    note: "Younger muscle-focused use cases often center on GH-axis tools, but that still does not make them low-risk or necessary.",
  },
  {
    goalId: "gh_optimization",
    ageRange: "35-44",
    peptideIds: ["cjc-1295", "ipamorelin", "mk-677"],
    note: "GH-restoration framing becomes more common in midlife, though the evidence and monitoring burden stay mixed.",
  },
  {
    goalId: "immune",
    ageRange: "55-64",
    peptideIds: ["thymosin-alpha-1", "kpv"],
    note: "Immune-support use cases become more relevant later in life, but conservative screening still matters.",
  },
  {
    goalId: "anti_aging",
    ageRange: "65+",
    peptideIds: ["thymosin-alpha-1", "epitalon", "ghk-cu"],
    note: "Later-life longevity framing should favor lower-friction maintenance and immune support over aggressive growth signaling.",
  },
];
