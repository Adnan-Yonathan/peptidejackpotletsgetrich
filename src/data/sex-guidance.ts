import type { Sex } from "@/types/planner";

export interface PeptideSexGuidance {
  peptideId: string;
  supportedSexes: Sex[];
  bestFitSexes?: Sex[];
  note: string;
  rationaleBySex?: Partial<Record<Sex, string>>;
  cautionBySex?: Partial<Record<Sex, string>>;
  exclusionBySex?: Partial<Record<Sex, string>>;
  monitoringBySex?: Partial<Record<Sex, string>>;
}

export const PEPTIDE_SEX_GUIDANCE: PeptideSexGuidance[] = [
  {
    peptideId: "semaglutide",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male"],
    note: "GLP-1 therapies are broadly relevant across sexes, but some reviews suggest women may see stronger average weight-loss response.",
    rationaleBySex: {
      female: "Some reviews suggest women may lose more weight on GLP-1 therapy than men on average, though individual response still varies widely.",
    },
    cautionBySex: {
      female: "Avoid in pregnancy or active conception planning unless a clinician specifically directs otherwise.",
    },
    monitoringBySex: {
      female: "Confirm pregnancy status before and during any real-world use discussion where relevant.",
    },
  },
  {
    peptideId: "tirzepatide",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male"],
    note: "Broad adult metabolic-use case with no clean sex-based dosing difference, but similar reproductive caution as other incretin therapies.",
    rationaleBySex: {
      female: "Weight-loss response may be stronger on average in women in incretin-based therapy, though this is not a guarantee.",
    },
    cautionBySex: {
      female: "Avoid in pregnancy or active conception planning unless a clinician specifically directs otherwise.",
    },
    monitoringBySex: {
      female: "Pregnancy status matters in any real-world use context.",
    },
  },
  {
    peptideId: "liraglutide",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male"],
    note: "Broad adult metabolic-use case with a stronger real-world evidence base than most wellness-market peptides.",
    cautionBySex: {
      female: "Avoid in pregnancy or active conception planning unless a clinician specifically directs otherwise.",
    },
    monitoringBySex: {
      female: "Pregnancy status should be considered in any real-world use discussion.",
    },
  },
  {
    peptideId: "pt-141",
    supportedSexes: ["female"],
    bestFitSexes: ["female"],
    note: "The clearest sex-specific peptide in the catalog: FDA-approved for premenopausal women with HSDD and not approved for men.",
    exclusionBySex: {
      male: "Not recommended in this planner because PT-141 has no approved male indication and the strongest evidence is female-specific.",
      other: "Recommendation logic stays conservative because the strongest evidence and approval boundary are female-specific.",
    },
    cautionBySex: {
      female: "Avoid in pregnancy and use more caution with cardiovascular history because blood-pressure effects matter.",
    },
    monitoringBySex: {
      female: "Pregnancy status and cardiovascular tolerance matter more than they do for most peptides in this catalog.",
    },
  },
  {
    peptideId: "thymosin-alpha-1",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male", "other"],
    note: "Immune-support framing is broadly sex-neutral based on the current evidence.",
    cautionBySex: {
      female: "Pregnancy and lactation caution remains reasonable because the evidence base is not built around those contexts.",
    },
  },
  {
    peptideId: "mk-677",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male"],
    note: "The endocrine burden is real for both sexes, but the evidence is not strong enough to support different male and female recommendation logic beyond reproductive caution.",
    cautionBySex: {
      female: "Avoid in pregnancy or active conception planning because GH-axis manipulation lacks reproductive safety data.",
    },
    monitoringBySex: {
      male: "If GH-axis strategies are discussed later in life, prostate and hematocrit context become more relevant.",
      female: "Reproductive status matters more because pregnancy and fertility safety are unclear.",
    },
  },
  {
    peptideId: "cjc-1295",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male"],
    note: "GH-axis support remains a weak area for sex-specific outcome data, so sex should act as a caution signal rather than a targeting rule.",
    cautionBySex: {
      female: "Avoid in pregnancy or active conception planning because growth-axis manipulation lacks reproductive safety data.",
    },
    monitoringBySex: {
      male: "Longer-term GH-axis use deserves more attention to prostate and hematocrit context.",
      female: "Reproductive status matters more because safety in pregnancy and lactation is not established.",
    },
  },
  {
    peptideId: "ipamorelin",
    supportedSexes: ["female", "male", "other"],
    bestFitSexes: ["female", "male"],
    note: "Like other GH secretagogues, sex-specific data are weak, but reproductive caution is still warranted.",
    cautionBySex: {
      female: "Avoid in pregnancy or active conception planning because reproductive safety is not established.",
    },
    monitoringBySex: {
      male: "Longer-term endocrine use deserves more attention to prostate and hematocrit context.",
      female: "Reproductive status should be reviewed before treating this as anything other than experimental.",
    },
  },
];

export function getSexGuidanceForPeptide(peptideId: string) {
  return PEPTIDE_SEX_GUIDANCE.find((entry) => entry.peptideId === peptideId);
}

export function getSexExclusionReason(peptideId: string, sex: Sex) {
  return getSexGuidanceForPeptide(peptideId)?.exclusionBySex?.[sex];
}

export function getSexCautionReason(peptideId: string, sex: Sex) {
  return getSexGuidanceForPeptide(peptideId)?.cautionBySex?.[sex];
}

export function getSexRationale(peptideId: string, sex: Sex) {
  return getSexGuidanceForPeptide(peptideId)?.rationaleBySex?.[sex];
}
