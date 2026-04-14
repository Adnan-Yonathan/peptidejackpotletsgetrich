// These types mirror the Supabase schema.
// Replace with auto-generated types via `supabase gen types typescript` once connected.

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface Peptide {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  category: string | null;
  experience_level: "beginner" | "intermediate" | "advanced";
  risk_level: number;
  typical_dose: string | null;
  typical_cycle_weeks: number | null;
  administration: string | null;
  budget_tier: "budget" | "mid" | "premium";
  price_range_low: number | null;
  price_range_high: number | null;
  is_stackable: boolean;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface PeptideGoal {
  peptide_id: string;
  goal_id: string;
  relevance_score: number;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  has_lab_testing: boolean;
  has_coa: boolean;
  ships_international: boolean;
  shipping_speed: string | null;
  payment_methods: string[] | null;
  refund_policy: string | null;
  trust_score: number | null;
  status: "draft" | "published";
  created_at: string;
}

export interface VendorPeptide {
  id: string;
  vendor_id: string;
  peptide_id: string;
  price: number;
  unit: string | null;
  url: string | null;
  affiliate_url: string | null;
  in_stock: boolean;
  last_verified_at: string | null;
}

export interface RecommendationRule {
  id: string;
  name: string;
  goal_id: string | null;
  budget_tier: "budget" | "mid" | "premium" | null;
  experience_level: "beginner" | "intermediate" | "advanced" | null;
  risk_tolerance: number | null;
  timeframe: "short" | "medium" | "long" | null;
  stacking_preference: "single" | "basic_stack" | "advanced_stack" | null;
  peptide_id: string;
  priority: number;
  is_active: boolean;
}

export interface Plan {
  id: string;
  user_id: string;
  name: string;
  quiz_snapshot: QuizAnswers | null;
  recommended_peptides: RecommendationResult | null;
  total_cost_estimate: number | null;
  timeline_weeks: number | null;
  is_saved: boolean;
  created_at: string;
}

export interface Stack {
  id: string;
  user_id: string;
  name: string;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface StackItem {
  id: string;
  stack_id: string;
  peptide_id: string;
  vendor_id: string | null;
  quantity: number;
  sort_order: number;
}

export interface CompatibilityRule {
  id: string;
  peptide_a_id: string;
  peptide_b_id: string;
  compatibility: "synergy" | "caution" | "conflict";
  note: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface AffiliateEvent {
  id: string;
  user_id: string | null;
  peptide_id: string | null;
  vendor_id: string | null;
  source_page: string;
  source_plan_id: string | null;
  clicked_at: string;
  ip_hash: string | null;
}

// Quiz & Recommendation types
export interface QuizAnswers {
  goalId: string;
  secondaryGoalId?: string;
  budget: "budget" | "mid" | "premium";
  experience: "beginner" | "intermediate" | "advanced";
  riskTolerance: number;
  timeframe: "short" | "medium" | "long";
  stackingPreference: "single" | "basic_stack" | "advanced_stack";
}

export interface PeptideRecommendation {
  peptide: Peptide;
  score: number;
  rationale: string;
  vendorOptions: VendorPeptide[];
}

export interface RecommendationResult {
  primary: PeptideRecommendation[];
  alternatives: PeptideRecommendation[];
  estimatedMonthlyCost: { low: number; high: number };
  timelineWeeks: number;
  warnings: string[];
}
