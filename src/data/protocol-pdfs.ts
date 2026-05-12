export type ProtocolPdfKind = "primary" | "addon";

export interface ProtocolPdfProduct {
  slug: string;
  goalId: string | null;
  kind: ProtocolPdfKind;
  name: string;
  shortName: string;
  description: string;
  priceLabel: string;
  priceEnvVar: string;
  pdfKey: string;
  badge?: string;
  bullets: string[];
  includes: string[];
}

export interface GoalProtocolPdfPair {
  goalId: string;
  primary: ProtocolPdfProduct;
  addon: ProtocolPdfProduct;
}

const PRIMARY_PRICE = "$49";
const ADDON_PRICE = "$20";

export const GOAL_PROTOCOL_PDF_PAIRS: GoalProtocolPdfPair[] = [
  {
    goalId: "fat_loss",
    primary: {
      slug: "fat-loss-metabolism-protocol",
      goalId: "fat_loss",
      kind: "primary",
      name: "Fat Loss & Metabolism Protocol",
      shortName: "Fat Loss Protocol",
      description:
        "A goal-mapped protocol PDF for appetite, metabolism, body composition, and GLP-1 research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_FAT_LOSS_METABOLISM_PROTOCOL",
      pdfKey: "fat-loss-metabolism-protocol",
      badge: "Bestseller",
      bullets: [
        "GLP-1 and metabolic peptide comparison map",
        "Beginner, balanced, and advanced research lanes",
        "Risk, rebound, glucose, and monitoring checkpoints",
        "Budget and timeline planning by quiz profile",
      ],
      includes: [
        "Goal snapshot and realistic timeline expectations",
        "Primary and alternative compound roles",
        "Single-compound vs stack decision framework",
        "Safety, exclusion, and clinician discussion checklists",
      ],
    },
    addon: {
      slug: "peptide-supportive-fat-loss-diet-plan",
      goalId: "fat_loss",
      kind: "addon",
      name: "Peptide-Supportive Fat Loss Diet Plan",
      shortName: "Fat Loss Diet Plan",
      description:
        "A diet execution PDF built around appetite changes, protein targets, muscle retention, and rebound prevention.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_PEPTIDE_SUPPORTIVE_FAT_LOSS_DIET_PLAN",
      pdfKey: "peptide-supportive-fat-loss-diet-plan",
      bullets: [
        "Calorie deficit setup by appetite level",
        "High-protein meal templates and grocery lists",
        "GLP-1 appetite and GI-management nutrition notes",
        "Maintenance and rebound-prevention worksheets",
      ],
      includes: [
        "Meal timing and hydration checklist",
        "Fiber, protein, and micronutrient targets",
        "Muscle-retention nutrition rules",
        "Weekly food and progress tracker",
      ],
    },
  },
  {
    goalId: "muscle_growth",
    primary: {
      slug: "muscle-growth-strength-protocol",
      goalId: "muscle_growth",
      kind: "primary",
      name: "Muscle Growth & Strength Protocol",
      shortName: "Muscle Growth Protocol",
      description:
        "A goal-mapped protocol PDF for lean mass, strength, GH-axis, and anabolic-signaling research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_MUSCLE_GROWTH_STRENGTH_PROTOCOL",
      pdfKey: "muscle-growth-strength-protocol",
      bullets: [
        "GH-axis, growth-factor, and performance compound map",
        "Training-dependent decision framework",
        "Glucose, cancer-history, and overstacking cautions",
        "Budget and experience-level protocol lanes",
      ],
      includes: [
        "Goal-driver and adjunct compound roles",
        "Beginner to advanced research paths",
        "Stack complexity decision rules",
        "Monitoring and clinician discussion checklist",
      ],
    },
    addon: {
      slug: "peptide-supportive-hypertrophy-training-plan",
      goalId: "muscle_growth",
      kind: "addon",
      name: "Peptide-Supportive Hypertrophy Training Plan",
      shortName: "Hypertrophy Training Plan",
      description:
        "An 8-12 week training PDF for progressive overload, recovery-aware volume, and lean-mass execution.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_PEPTIDE_SUPPORTIVE_HYPERTROPHY_TRAINING_PLAN",
      pdfKey: "peptide-supportive-hypertrophy-training-plan",
      bullets: [
        "Push/pull/legs and upper/lower training options",
        "Progressive overload and deload trackers",
        "Recovery-aware volume adjustment rules",
        "Lean-mass nutrition target worksheets",
      ],
      includes: [
        "8-12 week progression framework",
        "Exercise selection templates",
        "Training log pages",
        "Plateau troubleshooting checklist",
      ],
    },
  },
  {
    goalId: "recovery",
    primary: {
      slug: "tissue-repair-recovery-protocol",
      goalId: "recovery",
      kind: "primary",
      name: "Tissue Repair & Recovery Protocol",
      shortName: "Recovery Protocol",
      description:
        "A goal-mapped protocol PDF for soft-tissue, tendon, joint, wound-repair, and return-to-training research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_TISSUE_REPAIR_RECOVERY_PROTOCOL",
      pdfKey: "tissue-repair-recovery-protocol",
      badge: "Popular",
      bullets: [
        "BPC, TB, GHK, and repair-focused comparison map",
        "Acute vs chronic recovery planning lanes",
        "Return-to-training and reassessment checkpoints",
        "Local vs systemic research considerations",
      ],
      includes: [
        "Goal-specific peptide role map",
        "Stack and alternative decision tables",
        "Recovery timeline milestones",
        "Safety and documentation checklist",
      ],
    },
    addon: {
      slug: "injury-recovery-return-to-training-plan",
      goalId: "recovery",
      kind: "addon",
      name: "Injury Recovery & Return-to-Training Plan",
      shortName: "Return-to-Training Plan",
      description:
        "A recovery execution PDF for rebuilding capacity, modifying training, and tracking pain and function.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_INJURY_RECOVERY_RETURN_TO_TRAINING_PLAN",
      pdfKey: "injury-recovery-return-to-training-plan",
      bullets: [
        "Acute, rebuild, reload, and return phases",
        "Pain and function tracking worksheet",
        "Training modification templates",
        "Mobility and tissue-loading progressions",
      ],
      includes: [
        "Return-to-training criteria",
        "Weekly recovery scorecard",
        "Do-not-push-through warning checklist",
        "Rehab-style progression pages",
      ],
    },
  },
  {
    goalId: "anti_aging",
    primary: {
      slug: "longevity-anti-aging-protocol",
      goalId: "anti_aging",
      kind: "primary",
      name: "Longevity & Anti-Aging Protocol",
      shortName: "Longevity Protocol",
      description:
        "A goal-mapped protocol PDF for mitochondrial, senolytic, immune-aging, and cellular-resilience research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_LONGEVITY_ANTI_AGING_PROTOCOL",
      pdfKey: "longevity-anti-aging-protocol",
      bullets: [
        "Mitochondrial, telomere, senolytic, and immune-aging buckets",
        "Slow-timeline expectation setting",
        "Evidence-quality and overstacking filters",
        "Biomarker and monitoring discussion prompts",
      ],
      includes: [
        "Longevity compound comparison matrix",
        "Conservative, balanced, and aggressive lanes",
        "Long-horizon tracking framework",
        "Clinician discussion checklist",
      ],
    },
    addon: {
      slug: "longevity-lifestyle-biomarker-tracking-plan",
      goalId: "anti_aging",
      kind: "addon",
      name: "Longevity Lifestyle & Biomarker Tracking Plan",
      shortName: "Longevity Tracking Plan",
      description:
        "A lifestyle and tracking PDF for sleep, strength, cardio, nutrition, mobility, and biomarker conversations.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_LONGEVITY_LIFESTYLE_BIOMARKER_TRACKING_PLAN",
      pdfKey: "longevity-lifestyle-biomarker-tracking-plan",
      bullets: [
        "Monthly longevity scorecard",
        "Sleep, strength, zone 2, VO2, and mobility habits",
        "Biomarker checklist for clinician discussion",
        "Overstacking prevention framework",
      ],
      includes: [
        "Lifestyle habit tracker",
        "Biomarker notes pages",
        "Quarterly review worksheet",
        "Longevity priority audit",
      ],
    },
  },
  {
    goalId: "cognitive",
    primary: {
      slug: "cognitive-neuroprotection-protocol",
      goalId: "cognitive",
      kind: "primary",
      name: "Cognitive & Neuroprotection Protocol",
      shortName: "Cognitive Protocol",
      description:
        "A goal-mapped protocol PDF for focus, brain fog, neuroprotection, mood overlap, and CNS-active research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_COGNITIVE_NEUROPROTECTION_PROTOCOL",
      pdfKey: "cognitive-neuroprotection-protocol",
      bullets: [
        "Focus, mood, and neuroprotection compound buckets",
        "CNS-active caution framework",
        "Psychiatric medication and stimulation flags",
        "Tolerance, cycling, and reassessment checkpoints",
      ],
      includes: [
        "Cognitive compound comparison table",
        "Beginner to advanced planning lanes",
        "Route and routine complexity notes",
        "Safety and monitoring worksheet",
      ],
    },
    addon: {
      slug: "deep-work-focus-brain-performance-plan",
      goalId: "cognitive",
      kind: "addon",
      name: "Deep Work, Focus & Brain Performance Plan",
      shortName: "Brain Performance Plan",
      description:
        "A cognitive execution PDF for deep work blocks, trigger tracking, caffeine timing, and performance routines.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_DEEP_WORK_FOCUS_BRAIN_PERFORMANCE_PLAN",
      pdfKey: "deep-work-focus-brain-performance-plan",
      bullets: [
        "Deep work block templates",
        "Caffeine and stimulant timing worksheet",
        "Brain fog trigger tracker",
        "Cognitive self-assessment pages",
      ],
      includes: [
        "Workday structure options",
        "Focus recovery checklist",
        "Sleep and light anchors",
        "Weekly cognition review",
      ],
    },
  },
  {
    goalId: "sleep",
    primary: {
      slug: "sleep-relaxation-protocol",
      goalId: "sleep",
      kind: "primary",
      name: "Sleep & Relaxation Protocol",
      shortName: "Sleep Protocol",
      description:
        "A goal-mapped protocol PDF for sleep quality, stress state, circadian rhythm, and low-risk recovery research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_SLEEP_RELAXATION_PROTOCOL",
      pdfKey: "sleep-relaxation-protocol",
      bullets: [
        "Sleep, relaxation, and circadian compound map",
        "Low-risk-first planning structure",
        "Stimulation, timing, and next-day effect cautions",
        "Sleep quality and reassessment checkpoints",
      ],
      includes: [
        "Sleep goal decision framework",
        "Single vs stack logic",
        "Conservative and balanced paths",
        "Safety and clinician discussion checklist",
      ],
    },
    addon: {
      slug: "sleep-reset-circadian-optimization-plan",
      goalId: "sleep",
      kind: "addon",
      name: "Sleep Reset & Circadian Optimization Plan",
      shortName: "Sleep Reset Plan",
      description:
        "A sleep execution PDF for light exposure, caffeine timing, evening wind-down, and habit tracking.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_SLEEP_RESET_CIRCADIAN_OPTIMIZATION_PLAN",
      pdfKey: "sleep-reset-circadian-optimization-plan",
      bullets: [
        "14-day sleep reset",
        "Light exposure and evening wind-down schedule",
        "Caffeine, alcohol, meal timing, and screen rules",
        "Sleep quality tracker",
      ],
      includes: [
        "Morning and night routines",
        "Sleep environment checklist",
        "Weekly reset scorecard",
        "Troubleshooting pages",
      ],
    },
  },
  {
    goalId: "immune",
    primary: {
      slug: "immune-support-protocol",
      goalId: "immune",
      kind: "primary",
      name: "Immune Support Protocol",
      shortName: "Immune Protocol",
      description:
        "A goal-mapped protocol PDF for immune modulation, antimicrobial peptides, inflammatory context, and cautious research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_IMMUNE_SUPPORT_PROTOCOL",
      pdfKey: "immune-support-protocol",
      bullets: [
        "Immune-modulating vs antimicrobial peptide map",
        "Autoimmune and infection-context cautions",
        "Evidence and risk separation framework",
        "Monitoring and escalation checkpoints",
      ],
      includes: [
        "Immune compound comparison matrix",
        "Conservative-first planning lanes",
        "Exclusion and caution worksheets",
        "Clinician discussion checklist",
      ],
    },
    addon: {
      slug: "immune-resilience-lifestyle-plan",
      goalId: "immune",
      kind: "addon",
      name: "Immune Resilience Lifestyle Plan",
      shortName: "Immune Lifestyle Plan",
      description:
        "A lifestyle execution PDF for sleep, stress, training load, nutrition, and infection-season planning.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_IMMUNE_RESILIENCE_LIFESTYLE_PLAN",
      pdfKey: "immune-resilience-lifestyle-plan",
      bullets: [
        "Sleep, stress, nutrition, and training-load framework",
        "Infection-season planning checklist",
        "Autoimmune caution worksheet",
        "Recovery-from-illness ramp-up plan",
      ],
      includes: [
        "Immune support habit tracker",
        "Training-load adjustment pages",
        "Nutrition checklist",
        "Weekly resilience review",
      ],
    },
  },
  {
    goalId: "skin_hair",
    primary: {
      slug: "skin-hair-protocol",
      goalId: "skin_hair",
      kind: "primary",
      name: "Skin & Hair Protocol",
      shortName: "Skin & Hair Protocol",
      description:
        "A goal-mapped protocol PDF for topical, cosmetic, pigmentation, collagen, skin, and hair research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_SKIN_HAIR_PROTOCOL",
      pdfKey: "skin-hair-protocol",
      badge: "New",
      bullets: [
        "Topical vs systemic option map",
        "Skin, hair, collagen, and pigmentation lanes",
        "Skin-cancer and melanocortin cautions",
        "Photo tracking and expectation-setting framework",
      ],
      includes: [
        "Appearance compound comparison table",
        "Routine complexity and budget lanes",
        "Safety and exclusion checklist",
        "Clinician discussion prompts",
      ],
    },
    addon: {
      slug: "skin-hair-appearance-optimization-plan",
      goalId: "skin_hair",
      kind: "addon",
      name: "Skin, Hair & Appearance Optimization Plan",
      shortName: "Appearance Optimization Plan",
      description:
        "An appearance execution PDF for skincare routines, hair-support habits, nutrition, and visible-progress tracking.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_SKIN_HAIR_APPEARANCE_OPTIMIZATION_PLAN",
      pdfKey: "skin-hair-appearance-optimization-plan",
      bullets: [
        "Morning and evening skincare templates",
        "Hair-support routine tracker",
        "Nutrition and micronutrient checklist",
        "Before/after photo tracking guide",
      ],
      includes: [
        "Sun exposure and pigmentation caution page",
        "Weekly appearance tracker",
        "Routine troubleshooting checklist",
        "Product and habit audit",
      ],
    },
  },
  {
    goalId: "sexual_health",
    primary: {
      slug: "sexual-health-libido-protocol",
      goalId: "sexual_health",
      kind: "primary",
      name: "Sexual Health & Libido Protocol",
      shortName: "Libido Protocol",
      description:
        "A goal-mapped protocol PDF for libido, arousal, reproductive-axis, social-bonding, and hormone-adjacent research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_SEXUAL_HEALTH_LIBIDO_PROTOCOL",
      pdfKey: "sexual-health-libido-protocol",
      bullets: [
        "Arousal, reproductive-axis, and bonding compound map",
        "Cardiovascular and psychiatric caution framework",
        "On-demand vs baseline planning distinctions",
        "Sex and hormone-context notes",
      ],
      includes: [
        "Libido compound comparison matrix",
        "Use-case and risk decision tables",
        "Monitoring and exclusion checklist",
        "Clinician discussion worksheet",
      ],
    },
    addon: {
      slug: "libido-hormone-relationship-performance-plan",
      goalId: "sexual_health",
      kind: "addon",
      name: "Libido, Hormone & Relationship Performance Plan",
      shortName: "Libido Lifestyle Plan",
      description:
        "A sexual-health execution PDF for sleep, stress, cardio, hormone discussion, confidence, and communication.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_LIBIDO_HORMONE_RELATIONSHIP_PERFORMANCE_PLAN",
      pdfKey: "libido-hormone-relationship-performance-plan",
      bullets: [
        "Libido factor audit",
        "Cardiovascular fitness and performance checklist",
        "Hormone lab discussion worksheet",
        "Partner communication prompts",
      ],
      includes: [
        "Performance anxiety tracker",
        "Sleep and stress audit",
        "Weekly libido review",
        "Relationship-context worksheet",
      ],
    },
  },
  {
    goalId: "gh_optimization",
    primary: {
      slug: "gh-axis-optimization-protocol",
      goalId: "gh_optimization",
      kind: "primary",
      name: "GH Axis Optimization Protocol",
      shortName: "GH Axis Protocol",
      description:
        "A goal-mapped protocol PDF for GH secretagogues, GHRH/GHSR pathways, body composition, recovery, and monitoring-heavy research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_GH_AXIS_OPTIMIZATION_PROTOCOL",
      pdfKey: "gh-axis-optimization-protocol",
      bullets: [
        "Secretagogue, GHRH, and GH-axis compound map",
        "Glucose, edema, prostate, and growth-signal cautions",
        "Sleep and recovery dependency framework",
        "Monitoring burden by risk profile",
      ],
      includes: [
        "GH-axis compound comparison table",
        "Beginner, balanced, and advanced lanes",
        "Stack decision framework",
        "Safety and clinician discussion checklist",
      ],
    },
    addon: {
      slug: "gh-supportive-training-sleep-recovery-plan",
      goalId: "gh_optimization",
      kind: "addon",
      name: "GH-Supportive Training, Sleep & Recovery Plan",
      shortName: "GH Support Plan",
      description:
        "An execution PDF for sleep-first GH support, training stimuli, meal timing, glucose control, and recovery tracking.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_GH_SUPPORTIVE_TRAINING_SLEEP_RECOVERY_PLAN",
      pdfKey: "gh-supportive-training-sleep-recovery-plan",
      bullets: [
        "Sleep-first GH support framework",
        "Resistance training and sprint/conditioning options",
        "Meal timing and glucose-control habits",
        "Recovery scorecard",
      ],
      includes: [
        "Training week templates",
        "Sleep and recovery tracker",
        "Side-effect monitoring checklist",
        "Monthly progress review",
      ],
    },
  },
  {
    goalId: "anxiety",
    primary: {
      slug: "anxiety-mood-protocol",
      goalId: "anxiety",
      kind: "primary",
      name: "Anxiety & Mood Protocol",
      shortName: "Anxiety Protocol",
      description:
        "A goal-mapped protocol PDF for calming, mood resilience, stress reactivity, sleep overlap, and CNS-active research planning.",
      priceLabel: PRIMARY_PRICE,
      priceEnvVar: "STRIPE_PRICE_ANXIETY_MOOD_PROTOCOL",
      pdfKey: "anxiety-mood-protocol",
      bullets: [
        "Calming vs stimulating compound map",
        "Psychiatric medication and mental-health caution framework",
        "Sleep, stress, and cognition overlap notes",
        "Conservative-first planning lanes",
      ],
      includes: [
        "Mood compound comparison matrix",
        "Risk and monitoring checklists",
        "Single vs stack decision table",
        "Clinician discussion worksheet",
      ],
    },
    addon: {
      slug: "nervous-system-regulation-plan",
      goalId: "anxiety",
      kind: "addon",
      name: "Nervous System Regulation Plan",
      shortName: "Nervous System Plan",
      description:
        "A regulation execution PDF for breathwork, walking, sunlight, stimulant reduction, triggers, and acute stress response.",
      priceLabel: ADDON_PRICE,
      priceEnvVar: "STRIPE_PRICE_NERVOUS_SYSTEM_REGULATION_PLAN",
      pdfKey: "nervous-system-regulation-plan",
      bullets: [
        "21-day downshift plan",
        "Breathwork, walking, sunlight, and sleep anchors",
        "Trigger and symptom tracker",
        "Acute stress response playbook",
      ],
      includes: [
        "Caffeine and stimulant reduction worksheet",
        "Daily regulation tracker",
        "Weekly nervous-system review",
        "Escalation and support prompts",
      ],
    },
  },
];

export const PROTOCOL_PDF_PRODUCTS: ProtocolPdfProduct[] = [
  ...GOAL_PROTOCOL_PDF_PAIRS.flatMap((pair) => [pair.primary, pair.addon]),
];

export function getProtocolPdfProduct(slug: string): ProtocolPdfProduct | undefined {
  return PROTOCOL_PDF_PRODUCTS.find((product) => product.slug === slug);
}

export function getGoalProtocolPdfPair(goalId: string): GoalProtocolPdfPair | undefined {
  return GOAL_PROTOCOL_PDF_PAIRS.find((pair) => pair.goalId === goalId);
}

export function getGoalProtocolPdfPairForProduct(slug: string): GoalProtocolPdfPair | undefined {
  return GOAL_PROTOCOL_PDF_PAIRS.find(
    (pair) => pair.primary.slug === slug || pair.addon.slug === slug
  );
}
