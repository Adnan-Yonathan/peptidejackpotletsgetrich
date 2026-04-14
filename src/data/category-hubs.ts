import { GOALS, getGoalById, type GoalData } from "@/data/goals";

export interface CategoryHubData {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  outcomes: string[];
  goalIds: string[];
  featuredPeptideIds: string[];
  vendorHeadline: string;
  imageSrc: string;
  imageAlt: string;
}

export const CATEGORY_HUBS: CategoryHubData[] = [
  {
    id: "weight-loss-metabolism",
    slug: "weight-loss-metabolism",
    title: "Weight Loss & Metabolism",
    shortTitle: "Weight loss",
    description:
      "Research compounds tied to appetite, body composition, metabolic health, and lower-friction fat-loss support.",
    outcomes: ["body composition", "metabolic support", "waistline reduction", "energy regulation"],
    goalIds: ["fat_loss"],
    featuredPeptideIds: ["tesamorelin", "aod-9604", "mots-c", "ipamorelin"],
    vendorHeadline: "Trusted vendors for metabolic and body-composition research",
    imageSrc: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Athlete training with a focus on weight loss and conditioning",
  },
  {
    id: "muscle-performance",
    slug: "muscle-performance",
    title: "Muscle & Performance",
    shortTitle: "Muscle & performance",
    description:
      "Explore compounds researched for muscle retention, anabolic signaling, training recovery, and performance-oriented GH-axis support.",
    outcomes: ["muscle gain", "strength support", "training output", "lean-mass focus"],
    goalIds: ["muscle_growth", "gh_optimization"],
    featuredPeptideIds: ["sermorelin", "cjc-1295", "ipamorelin", "igf-1-lr3"],
    vendorHeadline: "Trusted vendors for performance and GH-axis research",
    imageSrc: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Strength training scene representing muscle and performance goals",
  },
  {
    id: "recovery-injury-support",
    slug: "recovery-injury-support",
    title: "Recovery & Injury Support",
    shortTitle: "Recovery & injury",
    description:
      "Compare peptides researched for soft-tissue healing, tendon or joint support, wound repair, and getting back to training sooner.",
    outcomes: ["injury recovery", "joint support", "soft-tissue repair", "return-to-training"],
    goalIds: ["recovery"],
    featuredPeptideIds: ["bpc-157", "thymosin-beta-4", "tb-500", "ghk-cu"],
    vendorHeadline: "Trusted vendors for tissue-repair research",
    imageSrc: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Recovery and mobility session focused on return to training",
  },
  {
    id: "sleep-stress",
    slug: "sleep-stress",
    title: "Sleep & Stress",
    shortTitle: "Sleep & stress",
    description:
      "See research options tied to sleep quality, stress resilience, anxiety, calmer evenings, and recovery-friendly downtime.",
    outcomes: ["deeper sleep", "lower stress", "calmer mood", "better recovery nights"],
    goalIds: ["sleep", "anxiety"],
    featuredPeptideIds: ["selank", "dsip", "semax", "oxytocin"],
    vendorHeadline: "Trusted vendors for sleep and mood-oriented research",
    imageSrc: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Calm evening routine representing sleep and stress support",
  },
  {
    id: "focus-brain-health",
    slug: "focus-brain-health",
    title: "Focus & Brain Health",
    shortTitle: "Focus & brain health",
    description:
      "Research compounds associated with focus, resilience under cognitive load, neuroprotection signals, and mental-performance support.",
    outcomes: ["focus", "mental clarity", "brain health", "cognitive resilience"],
    goalIds: ["cognitive"],
    featuredPeptideIds: ["semax", "selank", "humanin", "dihexa"],
    vendorHeadline: "Trusted vendors for cognitive and neuroprotection research",
    imageSrc: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Person working with intense focus for a brain health theme",
  },
  {
    id: "longevity-healthy-aging",
    slug: "longevity-healthy-aging",
    title: "Longevity & Healthy Aging",
    shortTitle: "Longevity & aging",
    description:
      "Explore compounds researched for mitochondrial support, immune resilience, cellular aging pathways, and age-related performance decline.",
    outcomes: ["healthy aging", "cellular resilience", "mitochondrial support", "long-term vitality"],
    goalIds: ["anti_aging"],
    featuredPeptideIds: ["elamipretide", "humanin", "mots-c", "epitalon"],
    vendorHeadline: "Trusted vendors for longevity-focused research",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Active healthy aging lifestyle scene outdoors",
  },
  {
    id: "skin-hair-appearance",
    slug: "skin-hair-appearance",
    title: "Skin, Hair & Appearance",
    shortTitle: "Skin & hair",
    description:
      "Find compounds researched for skin quality, visible recovery, pigmentation, collagen support, and cosmetic-adjacent outcomes.",
    outcomes: ["skin quality", "hair support", "appearance", "collagen signaling"],
    goalIds: ["skin_hair"],
    featuredPeptideIds: ["ghk-cu", "kpv", "melanotan-1", "melanotan-2"],
    vendorHeadline: "Trusted vendors for skin and cosmetic research",
    imageSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Beauty and appearance-focused portrait representing skin and hair goals",
  },
  {
    id: "libido-hormone-support",
    slug: "libido-hormone-support",
    title: "Libido & Hormone Support",
    shortTitle: "Libido & hormones",
    description:
      "Compare compounds researched for arousal, reproductive-axis signaling, social bonding pathways, and hormone-adjacent performance.",
    outcomes: ["libido", "sexual health", "reproductive signaling", "hormone support"],
    goalIds: ["sexual_health"],
    featuredPeptideIds: ["pt-141", "kisspeptin", "oxytocin", "melanotan-2"],
    vendorHeadline: "Trusted vendors for libido and reproductive-axis research",
    imageSrc: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=60",
    imageAlt: "Connected couple representing libido and hormone support goals",
  },
];

export function getCategoryHubBySlug(slug: string): CategoryHubData | undefined {
  return CATEGORY_HUBS.find((hub) => hub.slug === slug);
}

export function getCategoryHubById(id: string): CategoryHubData | undefined {
  return CATEGORY_HUBS.find((hub) => hub.id === id);
}

export function getHubGoals(hub: CategoryHubData): GoalData[] {
  return hub.goalIds
    .map((goalId) => getGoalById(goalId))
    .filter((goal): goal is GoalData => !!goal);
}

export function getHubPeptideIds(hub: CategoryHubData): string[] {
  const goalPeptideIds = GOALS.filter((goal) => hub.goalIds.includes(goal.id)).flatMap((goal) => goal.peptideIds);
  return Array.from(new Set([...hub.featuredPeptideIds, ...goalPeptideIds]));
}
