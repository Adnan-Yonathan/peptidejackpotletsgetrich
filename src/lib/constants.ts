export const SITE_NAME = "PeptidePros";
export const SITE_DESCRIPTION =
  "Research peptides with confidence. Personalized plans, trusted vendor comparisons, and trackable stacks.";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const QUIZ_STEPS = [
  "goal",
  "budget",
  "experience",
  "risk",
  "timeframe",
  "stacking",
] as const;

export type QuizStep = (typeof QUIZ_STEPS)[number];

export const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget-Friendly", description: "Under $50/month" },
  { value: "mid", label: "Mid-Range", description: "$50–$150/month" },
  { value: "premium", label: "Premium", description: "$150+/month" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner", description: "New to peptides" },
  { value: "intermediate", label: "Intermediate", description: "Some experience with peptides" },
  { value: "advanced", label: "Advanced", description: "Extensive peptide experience" },
] as const;

export const TIMEFRAME_OPTIONS = [
  { value: "short", label: "Short-Term", description: "Less than 4 weeks" },
  { value: "medium", label: "Medium-Term", description: "4–12 weeks" },
  { value: "long", label: "Long-Term", description: "12+ weeks" },
] as const;

export const STACKING_OPTIONS = [
  { value: "single", label: "Single Peptide", description: "Keep it simple with one peptide" },
  { value: "basic_stack", label: "Basic Stack", description: "2–3 complementary peptides" },
  { value: "advanced_stack", label: "Advanced Stack", description: "3–5 peptides for experienced users" },
] as const;

export const NAV_LINKS = [
  { href: "/peptides", label: "Peptides" },
  { href: "/guides", label: "Guides" },
  { href: "/vendors", label: "Vendors" },
  { href: "/stack-builder", label: "Stack Builder" },
  { href: "/quiz", label: "Find Your Plan" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: "layout-dashboard" },
  { href: "/dashboard/plans", label: "My Plans", icon: "clipboard-list" },
  { href: "/dashboard/stacks", label: "My Stacks", icon: "layers" },
  { href: "/dashboard/profile", label: "Profile", icon: "user" },
] as const;

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/admin/peptides", label: "Peptides", icon: "flask-conical" },
  { href: "/admin/vendors", label: "Vendors", icon: "store" },
  { href: "/admin/rules", label: "Rules", icon: "settings-2" },
  { href: "/admin/goals", label: "Goals", icon: "target" },
  { href: "/admin/analytics", label: "Analytics", icon: "bar-chart-3" },
] as const;
