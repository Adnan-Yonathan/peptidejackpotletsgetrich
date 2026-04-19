export interface PeptideCostModel {
  peptideId: string;
  cycleWeeks: number;
  amountPerCycleLow: number;
  amountPerCycleHigh: number;
  unit: "mg";
  note: string;
}

export const PEPTIDE_COST_MODELS: PeptideCostModel[] = [
  {
    peptideId: "bpc-157",
    cycleWeeks: 4,
    amountPerCycleLow: 8,
    amountPerCycleHigh: 14,
    unit: "mg",
    note: "Short recovery-focused cycle estimate based on common adult research ranges and daily use patterns.",
  },
  {
    peptideId: "tb-500",
    cycleWeeks: 4,
    amountPerCycleLow: 8,
    amountPerCycleHigh: 15,
    unit: "mg",
    note: "Short recovery cycle estimate based on front-loaded weekly use rather than long maintenance assumptions.",
  },
  {
    peptideId: "cjc-1295",
    cycleWeeks: 4,
    amountPerCycleLow: 4,
    amountPerCycleHigh: 8,
    unit: "mg",
    note: "Cost estimate assumes a CJC-led cycle, but tracked listing is currently a blend rather than a clean standalone product.",
  },
  {
    peptideId: "tesamorelin",
    cycleWeeks: 4,
    amountPerCycleLow: 8,
    amountPerCycleHigh: 12,
    unit: "mg",
    note: "Short cycle estimate based on daily research use patterns.",
  },
  {
    peptideId: "ipamorelin",
    cycleWeeks: 4,
    amountPerCycleLow: 6,
    amountPerCycleHigh: 12,
    unit: "mg",
    note: "Cycle cost assumes multiple weekly doses rather than the lightest possible trial use.",
  },
  {
    peptideId: "aod-9604",
    cycleWeeks: 4,
    amountPerCycleLow: 12,
    amountPerCycleHigh: 24,
    unit: "mg",
    note: "Metabolic use case often burns through more product because the cycle is more frequent than occasional use peptides.",
  },
  {
    peptideId: "pt-141",
    cycleWeeks: 4,
    amountPerCycleLow: 5,
    amountPerCycleHigh: 10,
    unit: "mg",
    note: "On-demand use can vary sharply, so the cost range is wider than a fixed daily protocol.",
  },
  {
    peptideId: "semax",
    cycleWeeks: 4,
    amountPerCycleLow: 6,
    amountPerCycleHigh: 12,
    unit: "mg",
    note: "Estimate assumes repeated intranasal or systemic use over a month rather than a single test week.",
  },
  {
    peptideId: "selank",
    cycleWeeks: 4,
    amountPerCycleLow: 6,
    amountPerCycleHigh: 12,
    unit: "mg",
    note: "Estimate assumes repeated intranasal or systemic use over a month rather than light intermittent use.",
  },
  {
    peptideId: "dsip",
    cycleWeeks: 4,
    amountPerCycleLow: 4,
    amountPerCycleHigh: 8,
    unit: "mg",
    note: "Sleep-oriented use can be inconsistent, so this stays a broad planning estimate.",
  },
  {
    peptideId: "mots-c",
    cycleWeeks: 4,
    amountPerCycleLow: 6,
    amountPerCycleHigh: 12,
    unit: "mg",
    note: "Metabolic cycles can burn through product quickly if injections are frequent.",
  },
  {
    peptideId: "epitalon",
    cycleWeeks: 2,
    amountPerCycleLow: 5,
    amountPerCycleHigh: 20,
    unit: "mg",
    note: "Cycle estimate is short because epitalon is often framed as a short burst rather than continuous use.",
  },
  {
    peptideId: "thymosin-alpha-1",
    cycleWeeks: 4,
    amountPerCycleLow: 3,
    amountPerCycleHigh: 6,
    unit: "mg",
    note: "Immune-support use cases often stay lower-volume than tissue or GH-oriented cycles.",
  },
  {
    peptideId: "ghk-cu",
    cycleWeeks: 4,
    amountPerCycleLow: 40,
    amountPerCycleHigh: 80,
    unit: "mg",
    note: "Current listing may be topical or serum-led, so cost depends heavily on product format and frequency of use.",
  },
  {
    peptideId: "kpv",
    cycleWeeks: 4,
    amountPerCycleLow: 4,
    amountPerCycleHigh: 8,
    unit: "mg",
    note: "Small cycle estimate reflects the lower-volume gut and skin support use cases users usually research.",
  },
  {
    peptideId: "retatrutide",
    cycleWeeks: 4,
    amountPerCycleLow: 8,
    amountPerCycleHigh: 20,
    unit: "mg",
    note: "Estimate is broad because the current tracked listing is not a clean one-to-one product match.",
  },
];

export function getCostModelForPeptide(peptideId: string) {
  return PEPTIDE_COST_MODELS.find((model) => model.peptideId === peptideId);
}
