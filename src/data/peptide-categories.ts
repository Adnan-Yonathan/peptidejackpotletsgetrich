import type { PeptideCategory } from "@/data/peptides";

export interface PeptideCategoryMeta {
  id: PeptideCategory;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  searchIntent: string;
}

export const PEPTIDE_CATEGORIES: PeptideCategoryMeta[] = [
  {
    id: "tissue_repair",
    slug: "tissue-repair",
    title: "Tissue Repair Peptides",
    shortTitle: "Tissue Repair",
    description:
      "Compounds researched for soft-tissue healing, tendon and joint support, wound repair, and post-injury recovery.",
    searchIntent: "tissue repair peptides, soft tissue healing peptides",
  },
  {
    id: "gh_axis",
    slug: "growth-hormone",
    title: "Growth Hormone (GH-Axis) Peptides",
    shortTitle: "Growth Hormone",
    description:
      "GHRH analogues and GH secretagogues researched for IGF-1, lean mass, recovery, and sleep architecture.",
    searchIntent: "growth hormone peptides, GH secretagogues",
  },
  {
    id: "metabolic",
    slug: "metabolic",
    title: "Metabolic & Weight Loss Peptides",
    shortTitle: "Metabolic",
    description:
      "GLP-1, GIP, and metabolic compounds researched for appetite, body composition, and fat-loss support.",
    searchIntent: "GLP-1 peptides, metabolic peptides, weight loss compounds",
  },
  {
    id: "melanocortin",
    slug: "melanocortin",
    title: "Melanocortin Peptides",
    shortTitle: "Melanocortin",
    description:
      "Melanocortin-system compounds studied for pigmentation, photoprotection, libido, and appetite signaling.",
    searchIntent: "melanocortin peptides, MC4R agonists",
  },
  {
    id: "neuroprotection",
    slug: "neuroprotection",
    title: "Neuroprotection Peptides",
    shortTitle: "Neuroprotection",
    description:
      "Compounds researched for neurotrophic support, BDNF modulation, and protection against neuronal stress.",
    searchIntent: "neuroprotective peptides, BDNF peptides",
  },
  {
    id: "sleep",
    slug: "sleep",
    title: "Sleep Peptides",
    shortTitle: "Sleep",
    description:
      "Peptides studied for sleep architecture, deep-sleep recovery, and stress-related sleep disruption.",
    searchIntent: "sleep peptides, DSIP, deep sleep peptides",
  },
  {
    id: "reproductive",
    slug: "reproductive",
    title: "Reproductive & Hormonal Peptides",
    shortTitle: "Reproductive",
    description:
      "Compounds researched for reproductive hormone signaling, libido, and HPG-axis modulation.",
    searchIntent: "reproductive peptides, kisspeptin, oxytocin",
  },
  {
    id: "longevity",
    slug: "longevity",
    title: "Longevity Peptides",
    shortTitle: "Longevity",
    description:
      "Compounds researched for cellular senescence, telomere biology, and longevity-adjacent pathways.",
    searchIntent: "longevity peptides, anti-aging peptides, epitalon",
  },
  {
    id: "immune",
    slug: "immune",
    title: "Immune Peptides",
    shortTitle: "Immune",
    description:
      "Thymic and immune-modulating compounds studied for innate and adaptive immune support.",
    searchIntent: "thymus peptides, immune peptides",
  },
  {
    id: "skin_cosmetic",
    slug: "skin-cosmetic",
    title: "Skin & Cosmetic Peptides",
    shortTitle: "Skin",
    description:
      "Peptides researched for skin quality, hair density, pigmentation, and cosmetic outcomes.",
    searchIntent: "skin peptides, cosmetic peptides, GHK-Cu",
  },
  {
    id: "antimicrobial",
    slug: "antimicrobial",
    title: "Antimicrobial Peptides",
    shortTitle: "Antimicrobial",
    description:
      "Naturally occurring host-defense peptides studied for antimicrobial and inflammation-modulating effects.",
    searchIntent: "antimicrobial peptides, LL-37, KPV",
  },
  {
    id: "cognitive",
    slug: "cognitive",
    title: "Cognitive & Nootropic Peptides",
    shortTitle: "Cognitive",
    description:
      "Compounds researched for cognition, focus, mental performance, and resilience under cognitive load.",
    searchIntent: "nootropic peptides, cognitive peptides, semax",
  },
  {
    id: "mitochondrial",
    slug: "mitochondrial",
    title: "Mitochondrial Peptides",
    shortTitle: "Mitochondrial",
    description:
      "Mitochondria-derived and mitochondria-targeted peptides studied for cellular energetics and longevity.",
    searchIntent: "mitochondrial peptides, MOTS-c, humanin",
  },
  {
    id: "growth_factor",
    slug: "growth-factor",
    title: "Growth Factor Peptides",
    shortTitle: "Growth Factor",
    description:
      "IGF-1 family and related growth-factor compounds researched for hypertrophy and tissue signaling.",
    searchIntent: "growth factor peptides, IGF-1, MGF",
  },
  {
    id: "muscle_repair",
    slug: "muscle-repair",
    title: "Muscle Repair Peptides",
    shortTitle: "Muscle Repair",
    description:
      "Compounds researched specifically for muscle micro-trauma recovery and exercise-induced damage.",
    searchIntent: "muscle repair peptides, post-workout recovery",
  },
];

export function getPeptideCategoryMeta(id: PeptideCategory): PeptideCategoryMeta | undefined {
  return PEPTIDE_CATEGORIES.find((c) => c.id === id);
}

export function getPeptideCategoryBySlug(slug: string): PeptideCategoryMeta | undefined {
  return PEPTIDE_CATEGORIES.find((c) => c.slug === slug);
}
