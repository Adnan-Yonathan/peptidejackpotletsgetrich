import type { AgeRange } from "@/types/planner";

export interface PeptideAgeGuidance {
  peptideId: string;
  supportedAgeRanges: AgeRange[];
  bestFitAgeRanges?: AgeRange[];
  lifeStageNote: string;
  cautionByAge?: Partial<Record<AgeRange, string>>;
  avoidByAge?: Partial<Record<AgeRange, string>>;
}

export const PEPTIDE_AGE_GUIDANCE: PeptideAgeGuidance[] = [
  {
    peptideId: "semaglutide",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["35-44", "45-54", "55-64"],
    lifeStageNote: "Strongest fit for adults where weight, glucose control, and cardiometabolic risk are part of the decision.",
  },
  {
    peptideId: "tirzepatide",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["35-44", "45-54", "55-64"],
    lifeStageNote: "Most relevant in adult metabolic-health and obesity contexts rather than early-life performance use.",
  },
  {
    peptideId: "liraglutide",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["35-44", "45-54", "55-64"],
    lifeStageNote: "Adult metabolic-health use case with the strongest fit when evidence and regulatory clarity matter more than novelty.",
  },
  {
    peptideId: "epitalon",
    supportedAgeRanges: ["35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["45-54", "55-64", "65+"],
    lifeStageNote: "Usually discussed in older-adult longevity and sleep-maintenance contexts, not younger performance use.",
  },
  {
    peptideId: "ghk-cu",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["35-44", "45-54", "55-64"],
    lifeStageNote: "Broad adult fit for cosmetic and skin-repair goals, especially when route is topical rather than systemic.",
  },
  {
    peptideId: "bpc-157",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64"],
    bestFitAgeRanges: ["25-34", "35-44", "45-54"],
    lifeStageNote: "Commonly researched by active adults for recovery, but still lacks validated human age-specific evidence.",
    cautionByAge: {
      "55-64": "Human data remain thin, so older-adult use should stay conservative.",
    },
    avoidByAge: {
      "65+": "Very limited human evidence makes this a weak fit for older-adult decision-making.",
    },
  },
  {
    peptideId: "tb-500",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64"],
    bestFitAgeRanges: ["25-34", "35-44", "45-54"],
    lifeStageNote: "Usually framed as a recovery compound for active adults rather than a later-life maintenance tool.",
    cautionByAge: {
      "55-64": "Later-life use should be cautious because human efficacy and safety data are sparse.",
    },
    avoidByAge: {
      "65+": "Experimental status and limited human evidence make this a poor fit for older adults.",
    },
  },
  {
    peptideId: "thymosin-alpha-1",
    supportedAgeRanges: ["35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["55-64", "65+"],
    lifeStageNote: "Age fit improves later in life because immune-support logic becomes more relevant as immunosenescence rises.",
  },
  {
    peptideId: "mk-677",
    supportedAgeRanges: ["25-34", "35-44", "45-54"],
    bestFitAgeRanges: ["25-34", "35-44"],
    lifeStageNote: "Most often discussed for younger and midlife adults, but metabolic and fluid-retention risks narrow the fit quickly with age.",
    cautionByAge: {
      "45-54": "Glucose, edema, and endocrine burden deserve a more conservative threshold at this stage.",
    },
    avoidByAge: {
      "55-64": "Later-life GH-axis stimulation becomes harder to justify without clear medical supervision.",
      "65+": "Cancer, cardiovascular, and glucose-management risk make this a poor fit for most older adults.",
    },
  },
  {
    peptideId: "cjc-1295",
    supportedAgeRanges: ["25-34", "35-44", "45-54"],
    bestFitAgeRanges: ["35-44", "45-54"],
    lifeStageNote: "Midlife is where GH-restoration framing is most often used, but evidence and long-term safety remain limited.",
    cautionByAge: {
      "25-34": "Aggressive GH manipulation is usually unnecessary when younger adults have no true deficiency context.",
    },
    avoidByAge: {
      "55-64": "Later-life GH-axis escalation raises a higher monitoring and cancer-risk burden.",
      "65+": "Generally a poor fit because growth signaling and monitoring burden climb with age.",
    },
  },
  {
    peptideId: "ipamorelin",
    supportedAgeRanges: ["25-34", "35-44", "45-54"],
    bestFitAgeRanges: ["35-44", "45-54"],
    lifeStageNote: "Usually framed as a lower-friction GH secretagogue, but age still increases the burden of monitoring and risk review.",
    cautionByAge: {
      "25-34": "Younger adults should still question whether GH-axis support is necessary at all.",
    },
    avoidByAge: {
      "55-64": "Later-life use requires a more conservative standard because GH stimulation is harder to justify.",
      "65+": "Generally a poor fit in older adults unless a clinician-driven rationale exists.",
    },
  },
  {
    peptideId: "pt-141",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64"],
    bestFitAgeRanges: ["25-34", "35-44", "45-54"],
    lifeStageNote: "Adult sexual-health use case with strongest fit before later-life cardiovascular burden becomes a larger concern.",
    cautionByAge: {
      "55-64": "Later-life cardiovascular context matters more because this compound can raise blood pressure.",
    },
    avoidByAge: {
      "65+": "Use becomes harder to justify when blood-pressure and cardiovascular tolerance are uncertain.",
    },
  },
  {
    peptideId: "semax",
    supportedAgeRanges: ["25-34", "35-44", "45-54", "55-64", "65+"],
    bestFitAgeRanges: ["35-44", "45-54", "55-64"],
    lifeStageNote: "Usually discussed for adult cognitive or recovery support rather than youth-oriented performance enhancement.",
  },
];

export function getAgeGuidanceForPeptide(peptideId: string) {
  return PEPTIDE_AGE_GUIDANCE.find((entry) => entry.peptideId === peptideId);
}

export function getAgeExclusionReason(peptideId: string, ageRange: AgeRange) {
  return getAgeGuidanceForPeptide(peptideId)?.avoidByAge?.[ageRange];
}

export function getAgeCautionReason(peptideId: string, ageRange: AgeRange) {
  return getAgeGuidanceForPeptide(peptideId)?.cautionByAge?.[ageRange];
}
