import type {
  ActivityLevel,
  AgeRange,
  DeliveryPreference,
  FemaleLifeStage,
  MaleHormoneContext,
  MonitoringWillingness,
  PlanStyle,
  PlannerStep,
  ReproductiveStatus,
  RoutineConsistency,
  Sex,
  StackingPreference,
  Timeframe,
} from "@/types/planner";
import type { BudgetTier, ExperienceLevel } from "@/data/peptides";
import type { ShopperCountry } from "@/lib/shopper-country";

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
};

export const PLANNER_STEPS: PlannerStep[] = [
  "country",
  "ageRange",
  "sex",
  "activityLevel",
  "experience",
  "primaryGoalId",
  "secondaryGoalIds",
  "reproductiveStatus",
  "femaleLifeStage",
  "maleHormoneContext",
  "budget",
  "riskTolerance",
  "timeframe",
  "email",
];

export const AGE_RANGE_OPTIONS: Option<AgeRange>[] = [
  { value: "18-24", label: "18-24", description: "Early-stage training and recovery profile" },
  { value: "25-34", label: "25-34", description: "Performance and body composition focus" },
  { value: "35-44", label: "35-44", description: "Recovery and sustainability matter more" },
  { value: "45-54", label: "45-54", description: "Risk management becomes more important" },
  { value: "55-64", label: "55-64", description: "Bias toward evidence and conservative planning" },
  { value: "65+", label: "65+", description: "Highest emphasis on safety and medical oversight" },
];

export const SEX_OPTIONS: Option<Sex>[] = [
  { value: "female", label: "Female", description: "Use female-specific safety and evidence notes where relevant" },
  { value: "male", label: "Male", description: "Use male-specific safety and monitoring notes where relevant" },
  { value: "other", label: "Other / prefer not to say", description: "Stay conservative and avoid assumptions beyond shared adult safety rules" },
];

export const COUNTRY_OPTIONS: Option<ShopperCountry>[] = [
  { value: "us", label: "United States", description: "Prioritize U.S. vendor routes and USD pricing." },
  { value: "ca", label: "Canada", description: "Prefer international vendor routes with broader non-U.S. shipping." },
  { value: "uk", label: "United Kingdom", description: "Prefer XL-style international routes and EUR pricing in-app." },
  { value: "de", label: "Germany", description: "Prefer EU-friendly vendor routes and international shipping." },
  { value: "fr", label: "France", description: "Prefer EU-friendly vendor routes and international shipping." },
  { value: "es", label: "Spain", description: "Prefer EU-friendly vendor routes and international shipping." },
  { value: "it", label: "Italy", description: "Prefer EU-friendly vendor routes and international shipping." },
  { value: "nl", label: "Netherlands", description: "Prefer EU-friendly vendor routes and international shipping." },
  { value: "ie", label: "Ireland", description: "Prefer EU-friendly vendor routes and international shipping." },
  { value: "au", label: "Australia", description: "Prefer international vendor routes over U.S.-only recommendations." },
  { value: "nz", label: "New Zealand", description: "Prefer international vendor routes over U.S.-only recommendations." },
  { value: "sg", label: "Singapore", description: "Prefer international vendor routes with rest-of-world shipping." },
  { value: "other_international", label: "Other international", description: "Use the international vendor path by default." },
];

export const REPRODUCTIVE_STATUS_OPTIONS: Option<ReproductiveStatus>[] = [
  { value: "none", label: "No current pregnancy or fertility context", description: "No active pregnancy, breastfeeding, or conception planning that should tighten the plan." },
  { value: "trying_to_conceive", label: "Trying to conceive / fertility-sensitive", description: "Use a more conservative screen around reproductive and hormone-active compounds." },
  { value: "pregnant", label: "Pregnant", description: "Sharply reduce compounds with reproductive, hormonal, or unknown fetal safety issues." },
  { value: "breastfeeding", label: "Breastfeeding / postpartum", description: "Use a more conservative screen where lactation safety is unclear." },
];

export const FEMALE_LIFE_STAGE_OPTIONS: Option<FemaleLifeStage>[] = [
  { value: "cycling_or_unclear", label: "Cycling / premenopausal / not sure", description: "Use standard adult female logic without menopause-specific assumptions." },
  { value: "perimenopause", label: "Perimenopause", description: "Keep a closer eye on body-composition, bone, sleep, and hormone-context tradeoffs." },
  { value: "postmenopause", label: "Postmenopause", description: "Bias harder toward bone, metabolic, and recovery context while avoiding weak hormone claims." },
  { value: "not_applicable", label: "Not applicable", description: "Skip female life-stage targeting." },
];

export const MALE_HORMONE_CONTEXT_OPTIONS: Option<MaleHormoneContext>[] = [
  { value: "none_known", label: "No known male hormone or prostate concern", description: "Use standard adult male logic without extra hormone-context gating." },
  { value: "on_trt_or_androgen_therapy", label: "On TRT or androgen therapy", description: "Treat GH-axis and reproductive-axis layering more cautiously." },
  { value: "prostate_or_psa_monitoring", label: "Prostate history / PSA monitoring", description: "Push the plan more conservative around GH-axis and growth-signaling compounds." },
  { value: "not_applicable", label: "Not applicable", description: "Skip male-specific hormone and prostate targeting." },
];

export const ACTIVITY_LEVEL_OPTIONS: Option<ActivityLevel>[] = [
  { value: "low", label: "Low activity", description: "Mostly sedentary or inconsistent training" },
  { value: "moderate", label: "Moderate", description: "Regular walks or a few training sessions weekly" },
  { value: "high", label: "High", description: "Frequent training with active recovery needs" },
  { value: "athlete", label: "Athlete", description: "Performance-focused with high output demands" },
];

export const BUDGET_OPTIONS: Option<BudgetTier>[] = [
  { value: "budget", label: "Budget - $75-$200/mo", description: "Keep the plan lean and cost-conscious" },
  { value: "mid", label: "Mid-range - $200-$500/mo", description: "Room for one premium or stack component" },
  { value: "premium", label: "Premium - $500+/mo", description: "Optimize for fit rather than price ceiling" },
];

export const EXPERIENCE_OPTIONS: Option<ExperienceLevel>[] = [
  { value: "beginner", label: "Beginner", description: "New to peptide research and conservative on complexity" },
  { value: "intermediate", label: "Intermediate", description: "Comfortable comparing compounds and protocols" },
  { value: "advanced", label: "Advanced", description: "Can handle nuanced tradeoffs and stack complexity" },
];

export const TIMEFRAME_OPTIONS: Option<Timeframe>[] = [
  { value: "short", label: "Short - 2-4 weeks", description: "I want something that feels actionable right away" },
  { value: "medium", label: "Medium - 1-3 months", description: "I can commit to a focused 1-3 month block" },
  { value: "long", label: "Long - 3+ months", description: "I want a sustainable longer-horizon strategy" },
];

export const STACKING_OPTIONS: Option<StackingPreference>[] = [
  { value: "single", label: "Single compound", description: "Keep it simple and easier to evaluate" },
  { value: "basic_stack", label: "Basic stack", description: "Use 2-3 pieces with clear roles" },
  { value: "advanced_stack", label: "Advanced stack", description: "Use a more layered program if justified" },
];

export const DELIVERY_PREFERENCE_OPTIONS: Option<DeliveryPreference>[] = [
  { value: "oral_topical_only", label: "Oral/topical only", description: "Exclude injectable-first ideas as much as possible" },
  { value: "avoid_injections", label: "Avoid injections", description: "Penalize injections heavily, allow only strong fits" },
  { value: "flexible", label: "Flexible", description: "Route is not a deciding factor" },
  { value: "injectable_ok", label: "Injectable OK", description: "Open to research compounds that require injections" },
];

export const ROUTINE_OPTIONS: Option<RoutineConsistency>[] = [
  { value: "low", label: "Low consistency", description: "Need a low-friction plan I can actually follow" },
  { value: "medium", label: "Medium consistency", description: "Can follow a structured routine most weeks" },
  { value: "high", label: "High consistency", description: "Can stick to a detailed program reliably" },
];

export const MONITORING_OPTIONS: Option<MonitoringWillingness>[] = [
  { value: "minimal", label: "Minimal monitoring", description: "Prefer the simplest possible tracking burden" },
  { value: "basic", label: "Basic monitoring", description: "Can track symptoms, side effects, and checkpoints" },
  { value: "advanced", label: "Advanced monitoring", description: "Comfortable with higher-friction and more experimental plans" },
];

export const PLAN_STYLE_OPTIONS: Option<PlanStyle>[] = [
  { value: "conservative", label: "Conservative", description: "Bias toward lower risk and stronger evidence" },
  { value: "balanced", label: "Balanced", description: "Balance evidence, fit, and practicality" },
  { value: "aggressive", label: "Aggressive", description: "Willing to consider narrower or more experimental options" },
];

export interface ProblemOption {
  id: string;
  label: string;
  description: string;
  goalIds: string[];
  peptideIds?: string[];
}

export const PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: "slow_recovery",
    label: "Slow recovery or nagging injuries",
    description: "Joint, tendon, soft-tissue, or post-training recovery issues.",
    goalIds: ["recovery"],
    peptideIds: ["bpc-157", "thymosin-beta-4", "tb-500", "ghk-cu"],
  },
  {
    id: "stubborn_body_fat",
    label: "Stubborn body fat / metabolism",
    description: "Body composition, abdominal fat, or low metabolic output.",
    goalIds: ["fat_loss", "gh_optimization"],
    peptideIds: ["aod-9604", "tesamorelin", "mots-c", "cjc-1295"],
  },
  {
    id: "muscle_plateau",
    label: "Muscle or strength plateau",
    description: "Need a more performance-oriented or growth-focused plan.",
    goalIds: ["muscle_growth", "gh_optimization"],
    peptideIds: ["cjc-1295", "ipamorelin", "igf-1-lr3", "mgf"],
  },
  {
    id: "poor_sleep",
    label: "Poor sleep quality",
    description: "Trouble falling asleep, staying asleep, or winding down.",
    goalIds: ["sleep", "anxiety"],
    peptideIds: ["dsip", "selank", "epitalon"],
  },
  {
    id: "stress_anxiety",
    label: "Stress, anxiety, or overactivation",
    description: "Need a calmer baseline and less mental friction.",
    goalIds: ["anxiety", "sleep"],
    peptideIds: ["selank", "semax", "oxytocin"],
  },
  {
    id: "brain_fog",
    label: "Brain fog or low focus",
    description: "Cognitive sharpness, drive, or resilience feels off.",
    goalIds: ["cognitive"],
    peptideIds: ["semax", "dihexa", "humanin"],
  },
  {
    id: "skin_hair_quality",
    label: "Skin or hair quality",
    description: "Topical or cosmetic outcomes matter most.",
    goalIds: ["skin_hair"],
    peptideIds: ["ghk-cu", "kpv", "melanotan-1"],
  },
  {
    id: "immune_resilience",
    label: "Immune resilience",
    description: "Need a cautious immune-supporting research direction.",
    goalIds: ["immune"],
    peptideIds: ["thymosin-alpha-1", "ll-37", "kpv"],
  },
  {
    id: "low_libido",
    label: "Low libido or sexual performance concerns",
    description: "Need reproductive-axis or sexual-health oriented options.",
    goalIds: ["sexual_health"],
    peptideIds: ["pt-141", "kisspeptin", "oxytocin"],
  },
  {
    id: "healthy_aging",
    label: "Healthy aging / longevity support",
    description: "Want a lower-friction longevity-oriented framework.",
    goalIds: ["anti_aging"],
    peptideIds: ["epitalon", "humanin", "elamipretide", "ghk-cu"],
  },
];

export interface HealthConstraintOption {
  id: string;
  label: string;
  description: string;
  avoidPeptideIds?: string[];
  avoidCategories?: string[];
  cautionPeptideIds?: string[];
  cautionCategories?: string[];
}

export const HEALTH_CONDITION_OPTIONS: HealthConstraintOption[] = [
  {
    id: "glucose_issues",
    label: "Blood sugar / insulin resistance",
    description: "Prediabetes, diabetes, or sensitivity to glucose dysregulation.",
    avoidPeptideIds: ["igf-1-lr3", "peg-mgf"],
    cautionCategories: ["gh_axis", "growth_factor", "metabolic"],
  },
  {
    id: "cancer_history",
    label: "Cancer history / tumor concern",
    description: "Want to avoid mitogenic or growth-signaling pathways.",
    avoidCategories: ["growth_factor"],
    cautionCategories: ["gh_axis", "longevity"],
    avoidPeptideIds: ["igf-1-lr3", "peg-mgf", "follistatin"],
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular issues",
    description: "Blood pressure, vascular risk, or cardiovascular caution.",
    avoidPeptideIds: ["melanotan-2", "pt-141"],
    cautionCategories: ["gh_axis", "melanocortin"],
  },
  {
    id: "pregnancy_fertility",
    label: "Pregnant / trying to conceive / fertility-sensitive",
    description: "Need the plan to sharply reduce reproductive or high-risk compounds.",
    avoidPeptideIds: ["pt-141", "melanotan-2", "kisspeptin", "tesamorelin"],
    cautionCategories: ["reproductive", "gh_axis", "growth_factor"],
  },
  {
    id: "autoimmune",
    label: "Autoimmune condition",
    description: "Need a more careful immune-modulating profile.",
    cautionCategories: ["immune", "antimicrobial"],
  },
  {
    id: "mental_health",
    label: "Complex mental health history",
    description: "Need caution with mood, arousal, or CNS-active compounds.",
    cautionPeptideIds: ["semax", "selank", "oxytocin", "pt-141", "dihexa"],
  },
  {
    id: "skin_cancer_history",
    label: "Skin cancer or melanoma history",
    description: "Avoid pigmentation-oriented melanocortin compounds.",
    avoidCategories: ["melanocortin"],
    avoidPeptideIds: ["melanotan-1", "melanotan-2"],
  },
  {
    id: "endocrine_disorder",
    label: "Endocrine or pituitary issue",
    description: "Need to avoid piling on endocrine-axis modulation.",
    cautionCategories: ["gh_axis", "reproductive"],
  },
];

export const MEDICATION_OPTIONS: HealthConstraintOption[] = [
  {
    id: "glp1_or_diabetes_meds",
    label: "GLP-1 or diabetes medication",
    description: "Compounds affecting appetite, glucose, or insulin need extra caution.",
    avoidPeptideIds: ["igf-1-lr3"],
    cautionCategories: ["gh_axis", "metabolic", "growth_factor"],
  },
  {
    id: "blood_pressure_meds",
    label: "Blood pressure medication",
    description: "Avoid stacking compounds with cardiovascular warning profiles.",
    avoidPeptideIds: ["melanotan-2", "pt-141"],
    cautionCategories: ["melanocortin"],
  },
  {
    id: "fertility_hormone_therapy",
    label: "Hormone or fertility therapy",
    description: "Avoid extra HPG-axis complexity unless clearly justified.",
    cautionCategories: ["reproductive", "gh_axis"],
    cautionPeptideIds: ["kisspeptin", "oxytocin"],
  },
  {
    id: "psychiatric_meds",
    label: "Psychiatric medication",
    description: "Use more caution with CNS-active or arousal-driven compounds.",
    cautionPeptideIds: ["semax", "selank", "oxytocin", "pt-141", "dihexa"],
  },
];
