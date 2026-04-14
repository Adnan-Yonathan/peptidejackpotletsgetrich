export interface GoalData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  sortOrder: number;
  peptideIds: string[];
}

export const GOALS: GoalData[] = [
  {
    id: "muscle_growth",
    name: "muscle_growth",
    displayName: "Muscle Growth & Strength",
    description: "Peptides studied for their roles in muscle protein synthesis, growth factor signaling, and anabolic pathways.",
    icon: "Dumbbell",
    sortOrder: 1,
    peptideIds: ["igf-1-lr3", "mgf", "peg-mgf", "follistatin", "cjc-1295", "ipamorelin", "ghrp-2", "ghrp-6", "hexarelin"],
  },
  {
    id: "fat_loss",
    name: "fat_loss",
    displayName: "Fat Loss & Metabolism",
    description: "Peptides researched for lipolytic effects, metabolic regulation, and body composition changes.",
    icon: "Flame",
    sortOrder: 2,
    peptideIds: ["aod-9604", "cjc-1295", "ipamorelin", "tesamorelin", "mots-c", "ghrp-6", "ghrp-2"],
  },
  {
    id: "recovery",
    name: "recovery",
    displayName: "Tissue Repair & Recovery",
    description: "Peptides studied for wound healing, soft-tissue repair, and recovery from injury in preclinical models.",
    icon: "Heart",
    sortOrder: 3,
    peptideIds: ["bpc-157", "thymosin-beta-4", "tb-500", "ghk-cu", "ll-37", "kpv", "mgf"],
  },
  {
    id: "anti_aging",
    name: "anti_aging",
    displayName: "Longevity & Anti-Aging",
    description: "Peptides explored in aging, senolytic, and telomere-related research contexts.",
    icon: "Clock",
    sortOrder: 4,
    peptideIds: ["epitalon", "foxo4-dri", "humanin", "mots-c", "ghk-cu", "elamipretide", "thymosin-alpha-1"],
  },
  {
    id: "cognitive",
    name: "cognitive",
    displayName: "Cognitive & Neuroprotection",
    description: "Peptides studied for neurotrophic signaling, cognitive enhancement, and neuroprotective effects.",
    icon: "Brain",
    sortOrder: 5,
    peptideIds: ["semax", "selank", "dihexa", "humanin"],
  },
  {
    id: "sleep",
    name: "sleep",
    displayName: "Sleep & Relaxation",
    description: "Peptides researched for sleep architecture, circadian biology, and relaxation effects.",
    icon: "Moon",
    sortOrder: 6,
    peptideIds: ["dsip", "epitalon", "selank", "hexarelin"],
  },
  {
    id: "immune",
    name: "immune",
    displayName: "Immune Support",
    description: "Peptides studied for immune modulation, innate/adaptive pathway effects, and antimicrobial properties.",
    icon: "Shield",
    sortOrder: 7,
    peptideIds: ["thymosin-alpha-1", "ll-37", "thymosin-beta-4", "kpv"],
  },
  {
    id: "skin_hair",
    name: "skin_hair",
    displayName: "Skin & Hair",
    description: "Peptides with topical/cosmetic literature for skin repair, collagen stimulation, and pigmentation.",
    icon: "Sparkles",
    sortOrder: 8,
    peptideIds: ["ghk-cu", "kpv", "melanotan-1", "melanotan-2", "ll-37"],
  },
  {
    id: "sexual_health",
    name: "sexual_health",
    displayName: "Sexual Health & Libido",
    description: "Peptides researched for sexual desire, arousal, and reproductive axis modulation.",
    icon: "HeartPulse",
    sortOrder: 9,
    peptideIds: ["pt-141", "melanotan-2", "kisspeptin", "oxytocin"],
  },
  {
    id: "gh_optimization",
    name: "gh_optimization",
    displayName: "GH Axis Optimization",
    description: "Peptides that modulate the growth hormone axis through GHRH, GHSR, or related pathways.",
    icon: "TrendingUp",
    sortOrder: 10,
    peptideIds: ["cjc-1295", "sermorelin", "tesamorelin", "ipamorelin", "ghrp-2", "ghrp-6", "hexarelin"],
  },
  {
    id: "anxiety",
    name: "anxiety",
    displayName: "Anxiety & Mood",
    description: "Peptides studied for anxiolytic effects, social cognition, and mood modulation.",
    icon: "Leaf",
    sortOrder: 11,
    peptideIds: ["selank", "semax", "oxytocin", "dsip"],
  },
];

export function getGoalById(id: string): GoalData | undefined {
  return GOALS.find((g) => g.id === id);
}

export function getGoalsForPeptide(peptideId: string): GoalData[] {
  return GOALS.filter((g) => g.peptideIds.includes(peptideId));
}
