export type DisclaimerType =
  | "GLOBAL_STANDARD"
  | "FDA_COMPOUNDING_RISK"
  | "WADA_S0"
  | "WADA_S2"
  | "RX_ONLY"
  | "NO_HUMAN_APPROVAL"
  | "NO_HUMAN_DATA"
  | "HIGH_COMPLIANCE_RISK"
  | "EXTREME_RISK"
  | "MITOGENIC"
  | "GH_AXIS"
  | "SEQUENCE_AMBIGUITY"
  | "EVIDENCE_GAPS"
  | "MODALITY_MISMATCH"
  | "JURISDICTION_DEPENDENT"
  | "NOT_CONSUMER_PRODUCT"
  | "CAUTION_STACK"
  | "CONTRAINDICATED_STACK";

export interface Disclaimer {
  type: DisclaimerType;
  severity: "info" | "warning" | "danger";
  shortLabel: string;
  text: string;
}

export const DISCLAIMERS: Record<DisclaimerType, Disclaimer> = {
  GLOBAL_STANDARD: {
    type: "GLOBAL_STANDARD",
    severity: "info",
    shortLabel: "Research Only",
    text: "Information provided for educational and research reference only. Not medical advice. Not for diagnosing, treating, curing, or preventing disease. Products referenced are labeled Research Use Only (RUO) by vendors; not for human or veterinary use.",
  },
  FDA_COMPOUNDING_RISK: {
    type: "FDA_COMPOUNDING_RISK",
    severity: "danger",
    shortLabel: "FDA Safety Flag",
    text: "The FDA has identified this substance as one that may present significant safety risks when used in compounding, including concerns about immunogenicity, impurity characterization, and/or insufficient safety information.",
  },
  WADA_S0: {
    type: "WADA_S0",
    severity: "warning",
    shortLabel: "WADA S0",
    text: "This substance is explicitly listed under WADA S0 (Non-Approved Substances). If you are subject to anti-doping rules, use of this substance is prohibited at all times.",
  },
  WADA_S2: {
    type: "WADA_S2",
    severity: "warning",
    shortLabel: "WADA S2",
    text: "This substance falls under WADA S2 (Peptide Hormones, Growth Factors, Related Substances and Mimetics). If you are subject to anti-doping rules, this category of substances is prohibited at all times.",
  },
  RX_ONLY: {
    type: "RX_ONLY",
    severity: "danger",
    shortLabel: "Prescription Only",
    text: "This is an FDA-approved prescription product. It should only be obtained through licensed healthcare providers and pharmacies. Do not attempt to source through RUO or gray-market channels.",
  },
  NO_HUMAN_APPROVAL: {
    type: "NO_HUMAN_APPROVAL",
    severity: "warning",
    shortLabel: "Not Approved",
    text: "This substance is not approved by any major regulatory body for human therapeutic use. All information is derived from preclinical research, limited clinical studies, or off-label contexts.",
  },
  NO_HUMAN_DATA: {
    type: "NO_HUMAN_DATA",
    severity: "danger",
    shortLabel: "No Human Data",
    text: "No human exposure data has been identified for this substance. All available evidence comes from animal models or in vitro studies. Safety in humans is completely unknown.",
  },
  HIGH_COMPLIANCE_RISK: {
    type: "HIGH_COMPLIANCE_RISK",
    severity: "danger",
    shortLabel: "High Compliance Risk",
    text: "This substance carries the highest compliance risk for platforms, advertisers, and payment processors. Ad platforms, payment rails, and regulatory bodies actively scrutinize products in this category.",
  },
  EXTREME_RISK: {
    type: "EXTREME_RISK",
    severity: "danger",
    shortLabel: "Extreme Risk",
    text: "This substance is in the extreme platform risk category due to growth-factor signaling, mitogenic potential, or complete absence of human safety data. Exercise maximum caution.",
  },
  MITOGENIC: {
    type: "MITOGENIC",
    severity: "danger",
    shortLabel: "Mitogenic Risk",
    text: "This substance has mitogenic (cell-proliferation-promoting) properties. Growth-factor class risks include hypoglycemia and potential promotion of abnormal cell growth.",
  },
  GH_AXIS: {
    type: "GH_AXIS",
    severity: "warning",
    shortLabel: "GH Axis",
    text: "This substance modulates the growth hormone axis. GH-axis stimulation carries risks including glucose intolerance, fluid retention, and theoretical concerns about sustained IGF-1 elevation.",
  },
  SEQUENCE_AMBIGUITY: {
    type: "SEQUENCE_AMBIGUITY",
    severity: "warning",
    shortLabel: "Sequence Ambiguity",
    text: "Significant sequence ambiguity exists for this product in the market. Vendors must specify exact peptide sequence, and products should not be assumed interchangeable with related full-length peptides or fragments.",
  },
  EVIDENCE_GAPS: {
    type: "EVIDENCE_GAPS",
    severity: "warning",
    shortLabel: "Evidence Gaps",
    text: "Significant evidence gaps exist for this substance. Available literature is heterogeneous, independently unreplicated, or relies heavily on secondary synthesis. Claims should be treated as exploratory hypotheses.",
  },
  MODALITY_MISMATCH: {
    type: "MODALITY_MISMATCH",
    severity: "danger",
    shortLabel: "Modality Mismatch",
    text: "The legitimate clinical modality for this substance (e.g., gene therapy, recombinant protein infusion) is fundamentally different from consumer 'peptide vial' products. Consumer peptide versions may not deliver the same biological activity.",
  },
  JURISDICTION_DEPENDENT: {
    type: "JURISDICTION_DEPENDENT",
    severity: "info",
    shortLabel: "Jurisdiction Dependent",
    text: "Regulatory status for this substance varies by country and jurisdiction. Check local regulations before any procurement or research use.",
  },
  NOT_CONSUMER_PRODUCT: {
    type: "NOT_CONSUMER_PRODUCT",
    severity: "info",
    shortLabel: "Clinical Stage",
    text: "This is a clinical-stage therapeutic, not a typical consumer RUO product. Information is provided for educational context about ongoing clinical research.",
  },
  CAUTION_STACK: {
    type: "CAUTION_STACK",
    severity: "warning",
    shortLabel: "Stack Caution",
    text: "This combination has a caution flag due to additive pathway effects or limited safety evidence. Clinical interaction safety is not established. Higher friction and additional disclaimers apply.",
  },
  CONTRAINDICATED_STACK: {
    type: "CONTRAINDICATED_STACK",
    severity: "danger",
    shortLabel: "Contraindicated",
    text: "This combination is flagged as contraindicated due to strong regulatory/label-based signals or high-risk pathway overlap. This combination is blocked from automated stack generation.",
  },
};

/**
 * Get all disclaimers that apply to a peptide based on its copyWarnings array.
 * Always includes GLOBAL_STANDARD.
 */
export function getDisclaimersForPeptide(copyWarnings: string[]): Disclaimer[] {
  const result: Disclaimer[] = [DISCLAIMERS.GLOBAL_STANDARD];

  for (const warning of copyWarnings) {
    const disclaimer = DISCLAIMERS[warning as DisclaimerType];
    if (disclaimer) {
      result.push(disclaimer);
    }
  }

  return result;
}

/**
 * Get the highest severity among a set of disclaimers.
 */
export function getHighestSeverity(disclaimers: Disclaimer[]): "info" | "warning" | "danger" {
  if (disclaimers.some((d) => d.severity === "danger")) return "danger";
  if (disclaimers.some((d) => d.severity === "warning")) return "warning";
  return "info";
}
