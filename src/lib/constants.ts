export const SITE_NAME = "PeptidePros";
export const SITE_DESCRIPTION =
  "Independent peptide research and vendor comparison. Evidence-graded compound profiles, regulatory flags, and vendor purity testing. We don't sell peptides — we help researchers compare them.";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// Production canonical, used by sitemap/robots/llms.txt. Always points to the public domain
// regardless of NEXT_PUBLIC_APP_URL (which may be localhost in dev or a preview URL).
export const SITE_CANONICAL_URL = "https://peptidepros.io";

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

// "Tools" is rendered as a hover dropdown in the header (not a flat link).
// See ToolsDropdown.tsx and src/lib/tools.ts.
export const NAV_LINKS = [
  { href: "/peptides", label: "Peptides" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/vendors", label: "Vendors" },
  { href: "/quiz", label: "Find Your Plan" },
  { href: "/protocol", label: "PeptidePros +" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: "layout-dashboard" },
  { href: "/dashboard/plans", label: "My Plans", icon: "clipboard-list" },
  { href: "/dashboard/stacks", label: "My Stacks", icon: "layers" },
  { href: "/dashboard/purchases", label: "My PDFs", icon: "file-text" },
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
