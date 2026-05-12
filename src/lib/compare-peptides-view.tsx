import type { ReactNode } from "react";
import type { EvidenceTier, PeptideData, RiskLevel } from "@/data/peptides";
import { getAgeGuidanceForPeptide } from "@/data/age-guidance";
import { getMonitoringGuidanceForPeptide } from "@/data/monitoring-guidance";
import { formatConfidenceLabel, formatCostRange, getPeptideCostEstimate } from "@/lib/costs";
import {
  formatFdaFlag,
  formatRegulatoryStatus,
  formatWadaFlag,
  getGoalLabelsForPeptide,
  getPeptidePurchaseSummary,
  getPeptideSourcingNote,
  getVendorCoverageCount,
} from "@/lib/compare-peptides";

export const EVIDENCE_PRIORITY: Record<EvidenceTier, number> = {
  A: 0,
  B: 1,
  "B-C": 2,
  C: 3,
  "C-D": 4,
  D: 5,
};

export const RISK_PRIORITY: Record<RiskLevel, number> = {
  low: 0,
  medium: 1,
  "med-high": 2,
  high: 3,
  extreme: 4,
};

export function evidencePillClass(tier: EvidenceTier) {
  const map: Record<EvidenceTier, string> = {
    A: "bg-[#0f6a52]/10 text-[#0f6a52]",
    B: "bg-[#0f6a52]/10 text-[#0f6a52]",
    "B-C": "bg-sky-500/10 text-sky-700",
    C: "bg-amber-500/10 text-amber-700",
    "C-D": "bg-orange-500/10 text-orange-700",
    D: "bg-red-500/10 text-red-700",
  };
  return map[tier];
}

export function riskPillClass(level: RiskLevel) {
  const map: Record<RiskLevel, string> = {
    low: "bg-[#0f6a52]/10 text-[#0f6a52]",
    medium: "bg-amber-500/10 text-amber-700",
    "med-high": "bg-orange-500/10 text-orange-700",
    high: "bg-red-500/10 text-red-700",
    extreme: "bg-red-700/10 text-red-800",
  };
  return map[level];
}

export interface ComparisonSection {
  eyebrow: string;
  title: string;
  rows: { label: string; values: ReactNode[] }[];
}

export function buildComparisonSections(peptides: PeptideData[]): ComparisonSection[] {
  return [
    {
      eyebrow: "01",
      title: "At a glance",
      rows: [
        { label: "Primary fit", values: peptides.map((p) => getPeptidePurchaseSummary(p).bestFor) },
        {
          label: "Evidence",
          values: peptides.map((p) => (
            <span
              key={`${p.id}-ev`}
              className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] ${evidencePillClass(p.evidenceTier)}`}
            >
              Tier {p.evidenceTier}
            </span>
          )),
        },
        {
          label: "Risk",
          values: peptides.map((p) => (
            <span
              key={`${p.id}-risk`}
              className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] ${riskPillClass(p.riskLevel)}`}
            >
              {p.riskLevel}
            </span>
          )),
        },
        { label: "Experience level", values: peptides.map((p) => p.experienceLevel) },
        { label: "Budget tier", values: peptides.map((p) => p.budgetTier) },
        {
          label: "Administration route",
          values: peptides.map((p) => p.administrationRoutes.join(", ")),
        },
      ],
    },
    {
      eyebrow: "02",
      title: "Use case & timing",
      rows: [
        {
          label: "Goal fit",
          values: peptides.map(
            (p) => getGoalLabelsForPeptide(p.id).join(", ") || "Not categorized yet"
          ),
        },
        { label: "What users compare it for", values: peptides.map((p) => p.expectedEffects) },
        { label: "Onset timeline", values: peptides.map((p) => p.onsetTimeline) },
        { label: "Main tradeoff", values: peptides.map((p) => getPeptidePurchaseSummary(p).tradeoff) },
      ],
    },
    {
      eyebrow: "03",
      title: "Safety & restrictions",
      rows: [
        { label: "Adverse effects", values: peptides.map((p) => p.adverseEffects) },
        { label: "Contraindications", values: peptides.map((p) => p.contraindications) },
        { label: "Interaction notes", values: peptides.map((p) => p.interactionNotes) },
        {
          label: "Regulatory status",
          values: peptides.map((p) => formatRegulatoryStatus(p.regulatoryStatus)),
        },
        { label: "FDA flag", values: peptides.map((p) => formatFdaFlag(p.fdaCompoundingRiskFlag)) },
        { label: "WADA status", values: peptides.map((p) => formatWadaFlag(p.wadaFlag)) },
      ],
    },
    {
      eyebrow: "04",
      title: "Age & monitoring",
      rows: [
        {
          label: "Supported age ranges",
          values: peptides.map(
            (p) =>
              getAgeGuidanceForPeptide(p.id)?.supportedAgeRanges.join(", ") ||
              "No age guidance yet"
          ),
        },
        {
          label: "Life-stage note",
          values: peptides.map(
            (p) => getAgeGuidanceForPeptide(p.id)?.lifeStageNote || "Not yet documented"
          ),
        },
        {
          label: "Monitoring burden",
          values: peptides.map(
            (p) => getMonitoringGuidanceForPeptide(p.id)?.burden || "Not specified"
          ),
        },
        {
          label: "Follow-up cadence",
          values: peptides.map(
            (p) =>
              getMonitoringGuidanceForPeptide(p.id)?.followUpFrequency ||
              "Not yet documented"
          ),
        },
      ],
    },
    {
      eyebrow: "05",
      title: "Cost & sourcing",
      rows: [
        {
          label: "Typical cycle cost",
          values: peptides.map((p) => {
            const e = getPeptideCostEstimate(p.id);
            return e
              ? formatCostRange(e.cycleCostLow, e.cycleCostHigh, e.currencyCode)
              : "No reliable estimate yet";
          }),
        },
        {
          label: "Estimated monthly cost",
          values: peptides.map((p) => {
            const e = getPeptideCostEstimate(p.id);
            return e
              ? formatCostRange(e.monthlyCostLow, e.monthlyCostHigh, e.currencyCode)
              : "No reliable estimate yet";
          }),
        },
        {
          label: "Cost confidence",
          values: peptides.map((p) => {
            const e = getPeptideCostEstimate(p.id);
            return e ? formatConfidenceLabel(e.confidence) : "No estimate";
          }),
        },
      ],
    },
    {
      eyebrow: "06",
      title: "Before you buy",
      rows: [
        {
          label: "Tracked vendor listings",
          values: peptides.map((p) => {
            const n = getVendorCoverageCount(p.id);
            return `${n} listing${n === 1 ? "" : "s"}`;
          }),
        },
        { label: "Sourcing note", values: peptides.map((p) => getPeptideSourcingNote(p.id)) },
        {
          label: "Stack-friendly?",
          values: peptides.map((p) =>
            p.isStackable ? "Usually stack-friendly" : "Better as a standalone decision"
          ),
        },
      ],
    },
  ];
}

export interface QuickWinner {
  eyebrow: string;
  peptide: PeptideData;
  detail: string;
}

export function buildQuickWinners(peptides: PeptideData[]): QuickWinner[] {
  if (peptides.length === 0) return [];

  const strongestEvidence = [...peptides].sort(
    (a, b) => EVIDENCE_PRIORITY[a.evidenceTier] - EVIDENCE_PRIORITY[b.evidenceTier]
  )[0];
  const lowestRisk = [...peptides].sort(
    (a, b) => RISK_PRIORITY[a.riskLevel] - RISK_PRIORITY[b.riskLevel]
  )[0];
  const easiestStart = [...peptides].sort((a, b) => {
    const r = { beginner: 0, intermediate: 1, advanced: 2 } as const;
    const d = r[a.experienceLevel] - r[b.experienceLevel];
    if (d !== 0) return d;
    return RISK_PRIORITY[a.riskLevel] - RISK_PRIORITY[b.riskLevel];
  })[0];
  const mostAvailable = [...peptides].sort(
    (a, b) => getVendorCoverageCount(b.id) - getVendorCoverageCount(a.id)
  )[0];

  return [
    {
      eyebrow: "Strongest evidence",
      peptide: strongestEvidence,
      detail: `Tier ${strongestEvidence.evidenceTier}`,
    },
    { eyebrow: "Lowest risk", peptide: lowestRisk, detail: `${lowestRisk.riskLevel} risk` },
    {
      eyebrow: "Easiest to start",
      peptide: easiestStart,
      detail: `${easiestStart.experienceLevel} level`,
    },
    {
      eyebrow: "Best vendor coverage",
      peptide: mostAvailable,
      detail: (() => {
        const n = getVendorCoverageCount(mostAvailable.id);
        return `${n} tracked listing${n === 1 ? "" : "s"}`;
      })(),
    },
  ];
}
