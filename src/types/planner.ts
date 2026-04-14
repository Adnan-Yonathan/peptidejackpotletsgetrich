import type {
  BudgetTier,
  ExperienceLevel,
  PeptideData,
} from "@/data/peptides";
import type { VendorData } from "@/data/vendors";

export type PlannerStep =
  | "identity"
  | "goals"
  | "health"
  | "constraints"
  | "style";

export type AgeRange =
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-64"
  | "65+";

export type Sex = "female" | "male" | "other";
export type ActivityLevel = "low" | "moderate" | "high" | "athlete";
export type Timeframe = "short" | "medium" | "long";
export type StackingPreference = "single" | "basic_stack" | "advanced_stack";
export type DeliveryPreference = "oral_topical_only" | "avoid_injections" | "flexible" | "injectable_ok";
export type RoutineConsistency = "low" | "medium" | "high";
export type MonitoringWillingness = "minimal" | "basic" | "advanced";
export type PlanStyle = "conservative" | "balanced" | "aggressive";

export interface PlannerAnswers {
  ageRange: AgeRange;
  sex: Sex;
  activityLevel: ActivityLevel;
  experience: ExperienceLevel;
  primaryGoalId: string;
  secondaryGoalIds: string[];
  topProblems: string[];
  healthConditions: string[];
  medications: string[];
  budget: BudgetTier;
  riskTolerance: 1 | 2 | 3 | 4 | 5;
  timeframe: Timeframe;
  stackingPreference: StackingPreference;
  deliveryPreference: DeliveryPreference;
  routineConsistency: RoutineConsistency;
  monitoringWillingness: MonitoringWillingness;
  planStyle: PlanStyle;
  notes?: string;
}

export interface PlannerRecommendation {
  peptide: PeptideData;
  role: "foundation" | "goal-driver" | "adjunct";
  score: number;
  rationale: string[];
  cautions: string[];
  vendors: VendorData[];
}

export interface ExcludedCompound {
  peptide: PeptideData;
  reasons: string[];
}

export interface ProgramPhase {
  title: string;
  description: string;
}

export interface PlannerResult {
  profileSummary: string;
  planHeadline: string;
  identifiedNeeds: string[];
  primary: PlannerRecommendation[];
  alternatives: PlannerRecommendation[];
  excluded: ExcludedCompound[];
  compatibilityWarnings: string[];
  safetyNotes: string[];
  timelineSummary: string;
  programPhases: ProgramPhase[];
}
