export type CompatibilityStatus = "compatible" | "caution" | "contraindicated" | "unknown";

export type RationaleKey =
  | "GH_AXIS_ADDITIVE"
  | "GH_AXIS_MULTIPLE_GHS"
  | "IGF_MITOGENIC_CLUSTER"
  | "MELANOCORTIN_CLUSTER"
  | "SEQUENCE_AMBIGUITY"
  | "COMMON_MARKET_STACK"
  | "LIMITED_HUMAN_DATA"
  | "HPG_AXIS_OVERLAP"
  | "HIGH_UNCERTAINTY_HUMAN"
  | "INCRETIN_OVERLAP"
  | "VASODILATION_OVERLAP"
  | "CNS_STACKING_UNCERTAINTY";

export interface CompatibilityRuleData {
  peptideA: string;
  peptideB: string;
  status: CompatibilityStatus;
  rationaleKey: RationaleKey;
  rationaleSummary: string;
}

export const RATIONALE_DESCRIPTIONS: Record<RationaleKey, string> = {
  GH_AXIS_ADDITIVE:
    "Combined ghrelin-pathway and GHRH-pathway ligands can show additive GH release based on mechanistic endocrine evidence.",
  GH_AXIS_MULTIPLE_GHS:
    "Multiple GHS/GHSR stimulation compounds. FDA flags several GH-axis peptides in compounding safety-risk context, including immunogenicity/impurity concerns.",
  IGF_MITOGENIC_CLUSTER:
    "Growth factor / mitogenic clustering. Combining IGF-axis agonists increases proliferative signaling and hypoglycemia monitoring complexity.",
  MELANOCORTIN_CLUSTER:
    "Melanocortin agonist clustering. FDA notes serious adverse events for melanotan II; bremelanotide (Vyleesi) has cardiovascular contraindications.",
  SEQUENCE_AMBIGUITY:
    "Sequence overlap or ambiguity between products. TB-500 is often described as a thymosin beta-4 fragment; must confirm exact sequence and avoid mixing assumptions.",
  COMMON_MARKET_STACK:
    "Commonly marketed as a stack/blend in consumer markets, but clinical interaction evidence is limited. Treat as uncertain.",
  LIMITED_HUMAN_DATA:
    "FDA notes limited or no safety-related information for these compounds. Combination safety is not established.",
  HPG_AXIS_OVERLAP:
    "HPG-axis (hypothalamic-pituitary-gonadal) signaling overlap. Combining HPG-active peptides increases endocrine interaction risk.",
  HIGH_UNCERTAINTY_HUMAN:
    "High uncertainty due to limited human data. One or both compounds lack established human safety profiles, making combination risk unpredictable.",
  INCRETIN_OVERLAP:
    "Multiple incretin-pathway agonists in the same stack. This increases GI burden, dosing complexity, and hypoglycemia-management risk without a clear consumer rationale.",
  VASODILATION_OVERLAP:
    "Both compounds can shift vascular tone or lower blood pressure. Combined use raises hypotension and perfusion-management uncertainty.",
  CNS_STACKING_UNCERTAINTY:
    "Multiple CNS-active experimental compounds with limited human combination data. Treat stacked nootropic claims as high-uncertainty.",
};

export const COMPATIBILITY_RULES: CompatibilityRuleData[] = [
  // GH axis additive: GHRH + GHS combinations
  {
    peptideA: "cjc-1295",
    peptideB: "ipamorelin",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "GHRH analog + GHS-R agonist may produce additive GH release; multiple GH-axis peptides flagged for safety/characterization concerns.",
  },
  {
    peptideA: "cjc-1295",
    peptideB: "ghrp-6",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "Additive GH-axis stimulation plausible; FDA flags both compounds in compounding safety-risk context.",
  },
  {
    peptideA: "cjc-1295",
    peptideB: "ghrp-2",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "Additive GH-axis stimulation plausible (mechanistic); conservative gating.",
  },
  {
    peptideA: "sermorelin",
    peptideB: "ipamorelin",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "GHRH analog + GHS-R agonist: additive GH release plausible.",
  },
  {
    peptideA: "sermorelin",
    peptideB: "ghrp-6",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "GHRH analog + GHS-R agonist: additive GH release plausible.",
  },
  {
    peptideA: "sermorelin",
    peptideB: "ghrp-2",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "GHRH analog + GHS-R agonist: additive GH release plausible.",
  },

  // Multiple GHS combinations
  {
    peptideA: "ipamorelin",
    peptideB: "ghrp-6",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "Multiple GHS/GHS-R stimulation; FDA flags both for compounding risks/limited safety info.",
  },
  {
    peptideA: "ipamorelin",
    peptideB: "ghrp-2",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "Multiple GHS/GHS-R stimulation; limited stacking safety evidence.",
  },
  {
    peptideA: "ghrp-2",
    peptideB: "ghrp-6",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "Multiple GHS/GHS-R stimulation; higher uncertainty.",
  },

  // IGF/mitogenic cluster
  {
    peptideA: "tesamorelin",
    peptideB: "igf-1-lr3",
    status: "caution",
    rationaleKey: "IGF_MITOGENIC_CLUSTER",
    rationaleSummary: "Tesamorelin increases IGF-1 (label); combining with IGF-axis agonists increases proliferative/hypoglycemia monitoring complexity.",
  },
  {
    peptideA: "igf-1-lr3",
    peptideB: "peg-mgf",
    status: "contraindicated",
    rationaleKey: "IGF_MITOGENIC_CLUSTER",
    rationaleSummary: "High-risk IGF/MGF clustering; insufficient safety basis for consumer routing; FDA flags PEG-MGF compounding risks and no identified human exposure data.",
  },
  {
    peptideA: "igf-1-lr3",
    peptideB: "follistatin",
    status: "contraindicated",
    rationaleKey: "IGF_MITOGENIC_CLUSTER",
    rationaleSummary: "Growth-factor cluster; strong clinical-only gating recommended.",
  },
  {
    peptideA: "peg-mgf",
    peptideB: "follistatin",
    status: "contraindicated",
    rationaleKey: "IGF_MITOGENIC_CLUSTER",
    rationaleSummary: "Growth-factor cluster; insufficient safety basis for consumer routing.",
  },

  // Melanocortin cluster
  {
    peptideA: "melanotan-2",
    peptideB: "pt-141",
    status: "contraindicated",
    rationaleKey: "MELANOCORTIN_CLUSTER",
    rationaleSummary: "Two melanocortin agonists; FDA reports serious adverse events for melanotan II; Rx bremelanotide has cardiovascular contraindications/warnings.",
  },
  {
    peptideA: "melanotan-1",
    peptideB: "pt-141",
    status: "caution",
    rationaleKey: "MELANOCORTIN_CLUSTER",
    rationaleSummary: "Melanocortin agonist overlap; conservative caution.",
  },
  {
    peptideA: "melanotan-1",
    peptideB: "melanotan-2",
    status: "caution",
    rationaleKey: "MELANOCORTIN_CLUSTER",
    rationaleSummary: "Melanocortin agonist overlap; conservative caution.",
  },

  // Sequence ambiguity
  {
    peptideA: "tb-500",
    peptideB: "thymosin-beta-4",
    status: "caution",
    rationaleKey: "SEQUENCE_AMBIGUITY",
    rationaleSummary: "TB-500 is often described as a thymosin beta-4 fragment/region; must confirm exact sequence and avoid mixing fragment vs full-length assumptions.",
  },

  // Common market stacks
  {
    peptideA: "bpc-157",
    peptideB: "tb-500",
    status: "caution",
    rationaleKey: "COMMON_MARKET_STACK",
    rationaleSummary: "Commonly marketed as a stack/blend in consumer market; clinical interaction evidence limited; treat as uncertain.",
  },
  {
    peptideA: "bpc-157",
    peptideB: "thymosin-beta-4",
    status: "caution",
    rationaleKey: "COMMON_MARKET_STACK",
    rationaleSummary: "Commonly co-marketed; limited interaction evidence; treat as uncertain.",
  },

  // Limited human data (CNS peptides)
  {
    peptideA: "semax",
    peptideB: "selank",
    status: "caution",
    rationaleKey: "LIMITED_HUMAN_DATA",
    rationaleSummary: "FDA notes limited safety-related information and compounding immunogenicity/impurity concerns for both.",
  },
  {
    peptideA: "semax",
    peptideB: "dsip",
    status: "caution",
    rationaleKey: "LIMITED_HUMAN_DATA",
    rationaleSummary: "CNS-active peptide combination; limited human safety basis.",
  },
  {
    peptideA: "selank",
    peptideB: "dsip",
    status: "caution",
    rationaleKey: "LIMITED_HUMAN_DATA",
    rationaleSummary: "CNS-active peptide combination; limited human safety basis.",
  },

  // HPG axis
  {
    peptideA: "kisspeptin",
    peptideB: "oxytocin",
    status: "caution",
    rationaleKey: "HPG_AXIS_OVERLAP",
    rationaleSummary: "HPG-axis signaling overlap; FDA flags kisspeptin-10 compounding uncertainty.",
  },

  // High uncertainty + growth factor
  {
    peptideA: "foxo4-dri",
    peptideB: "igf-1-lr3",
    status: "caution",
    rationaleKey: "HIGH_UNCERTAINTY_HUMAN",
    rationaleSummary: "FOXO4-DRI is a senolytic research peptide with limited human data; avoid combining with high-mitogenic axis in consumer protocols.",
  },
  {
    peptideA: "foxo4-dri",
    peptideB: "peg-mgf",
    status: "caution",
    rationaleKey: "HIGH_UNCERTAINTY_HUMAN",
    rationaleSummary: "High uncertainty + growth-factor cluster.",
  },

  // Incretin / metabolic overlap
  {
    peptideA: "semaglutide",
    peptideB: "tirzepatide",
    status: "contraindicated",
    rationaleKey: "INCRETIN_OVERLAP",
    rationaleSummary: "Do not layer GLP-1 / dual-incretin agonists in a consumer stack; GI burden and dosing complexity rise without a clear rationale.",
  },
  {
    peptideA: "semaglutide",
    peptideB: "liraglutide",
    status: "contraindicated",
    rationaleKey: "INCRETIN_OVERLAP",
    rationaleSummary: "Two GLP-1 agonists in the same stack creates redundant mechanism and higher side-effect burden.",
  },
  {
    peptideA: "semaglutide",
    peptideB: "retatrutide",
    status: "contraindicated",
    rationaleKey: "INCRETIN_OVERLAP",
    rationaleSummary: "Approved GLP-1 therapy should not be layered with an investigational multi-incretin agent.",
  },
  {
    peptideA: "tirzepatide",
    peptideB: "liraglutide",
    status: "contraindicated",
    rationaleKey: "INCRETIN_OVERLAP",
    rationaleSummary: "Dual incretin and GLP-1-only agonists should not be stacked in consumer protocols.",
  },
  {
    peptideA: "tirzepatide",
    peptideB: "retatrutide",
    status: "contraindicated",
    rationaleKey: "INCRETIN_OVERLAP",
    rationaleSummary: "Two high-potency incretin agonists compound GI and glucose-management risk.",
  },
  {
    peptideA: "liraglutide",
    peptideB: "retatrutide",
    status: "contraindicated",
    rationaleKey: "INCRETIN_OVERLAP",
    rationaleSummary: "Do not layer a daily GLP-1 agonist with an investigational triple-agonist compound.",
  },

  // MK-677 and GH-axis clustering
  {
    peptideA: "mk-677",
    peptideB: "cjc-1295",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "Oral ghrelin-receptor agonism plus GHRH analog raises GH-axis complexity and glucose-monitoring burden.",
  },
  {
    peptideA: "mk-677",
    peptideB: "sermorelin",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "MK-677 and sermorelin both push GH-axis signaling through different levers; treat as additive endocrine load.",
  },
  {
    peptideA: "mk-677",
    peptideB: "tesamorelin",
    status: "caution",
    rationaleKey: "GH_AXIS_ADDITIVE",
    rationaleSummary: "Combining ibutamoren with tesamorelin increases GH-axis burden and glucose-management uncertainty.",
  },
  {
    peptideA: "mk-677",
    peptideB: "ipamorelin",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "MK-677 and ipamorelin both stimulate ghrelin-pathway signaling; redundancy and endocrine spillover risk rise.",
  },
  {
    peptideA: "mk-677",
    peptideB: "ghrp-2",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "Multiple ghrelin-receptor secretagogues in one stack increase endocrine noise and monitoring needs.",
  },
  {
    peptideA: "mk-677",
    peptideB: "ghrp-6",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "Redundant GHSR stimulation with added appetite and glucose-management downside.",
  },
  {
    peptideA: "mk-677",
    peptideB: "hexarelin",
    status: "caution",
    rationaleKey: "GH_AXIS_MULTIPLE_GHS",
    rationaleSummary: "Hexarelin plus MK-677 creates multiple GHS-pathway inputs with limited combination safety support.",
  },

  // CNS / neuro stack uncertainty
  {
    peptideA: "cerebrolysin",
    peptideB: "semax",
    status: "caution",
    rationaleKey: "CNS_STACKING_UNCERTAINTY",
    rationaleSummary: "Both are CNS-active experimental agents. Combination claims are stronger than the human safety evidence.",
  },
  {
    peptideA: "cerebrolysin",
    peptideB: "selank",
    status: "caution",
    rationaleKey: "CNS_STACKING_UNCERTAINTY",
    rationaleSummary: "Neuroactive stack with limited direct human interaction evidence.",
  },
  {
    peptideA: "cerebrolysin",
    peptideB: "nsi-189",
    status: "caution",
    rationaleKey: "CNS_STACKING_UNCERTAINTY",
    rationaleSummary: "Two experimental neurotrophic-style agents with little human combination data.",
  },
  {
    peptideA: "nsi-189",
    peptideB: "dihexa",
    status: "caution",
    rationaleKey: "HIGH_UNCERTAINTY_HUMAN",
    rationaleSummary: "Experimental nootropic stack with limited human data and unclear downside profile.",
  },
  {
    peptideA: "nsi-189",
    peptideB: "semax",
    status: "caution",
    rationaleKey: "CNS_STACKING_UNCERTAINTY",
    rationaleSummary: "Mechanistically interesting but human combination data are weak; conservative caution.",
  },
  {
    peptideA: "nsi-189",
    peptideB: "selank",
    status: "caution",
    rationaleKey: "CNS_STACKING_UNCERTAINTY",
    rationaleSummary: "CNS-active experimental pairing with uncertain interaction profile.",
  },

  // Vascular / blood-pressure overlap
  {
    peptideA: "vip",
    peptideB: "angiotensin-1-7",
    status: "caution",
    rationaleKey: "VASODILATION_OVERLAP",
    rationaleSummary: "Both can shift vascular tone; combined use raises hypotension and perfusion-management uncertainty.",
  },
];

/**
 * Get the compatibility status between two peptides.
 * Returns the explicit rule if one exists, otherwise "unknown".
 */
export function getCompatibility(
  peptideIdA: string,
  peptideIdB: string
): { status: CompatibilityStatus; rule: CompatibilityRuleData | null } {
  const rule = COMPATIBILITY_RULES.find(
    (r) =>
      (r.peptideA === peptideIdA && r.peptideB === peptideIdB) ||
      (r.peptideA === peptideIdB && r.peptideB === peptideIdA)
  );

  if (rule) {
    return { status: rule.status, rule };
  }

  return { status: "unknown", rule: null };
}

/**
 * Check all pairs in a list of peptide IDs and return warnings.
 */
export function getStackWarnings(
  peptideIds: string[]
): { peptideA: string; peptideB: string; status: CompatibilityStatus; summary: string }[] {
  const warnings: { peptideA: string; peptideB: string; status: CompatibilityStatus; summary: string }[] = [];

  for (let i = 0; i < peptideIds.length; i++) {
    for (let j = i + 1; j < peptideIds.length; j++) {
      const { status, rule } = getCompatibility(peptideIds[i], peptideIds[j]);
      if (status === "caution" || status === "contraindicated") {
        warnings.push({
          peptideA: peptideIds[i],
          peptideB: peptideIds[j],
          status,
          summary: rule?.rationaleSummary ?? "",
        });
      }
    }
  }

  return warnings;
}
