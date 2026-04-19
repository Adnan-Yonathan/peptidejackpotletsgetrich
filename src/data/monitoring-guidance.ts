export type MonitoringBurden = "low" | "medium" | "high";

export interface PeptideMonitoringGuidance {
  peptideId: string;
  burden: MonitoringBurden;
  summary: string;
  baselineLabs: string[];
  followUpFrequency: string;
  redFlags: string[];
}

export const PEPTIDE_MONITORING_GUIDANCE: PeptideMonitoringGuidance[] = [
  {
    peptideId: "semaglutide",
    burden: "medium",
    summary: "Metabolic follow-up and GI tolerance matter more than exotic monitoring, but this is still not a zero-friction compound.",
    baselineLabs: ["CMP", "fasting glucose or HbA1c", "lipids", "weight and blood pressure baseline"],
    followUpFrequency: "Early tolerance review in the first weeks, then metabolic follow-up every few months.",
    redFlags: ["persistent vomiting or dehydration", "gallbladder symptoms", "pancreatitis-type abdominal pain"],
  },
  {
    peptideId: "tirzepatide",
    burden: "medium",
    summary: "Monitoring looks similar to other incretin therapies, with more attention to metabolic response and GI tolerance.",
    baselineLabs: ["CMP", "fasting glucose or HbA1c", "lipids", "weight and blood pressure baseline"],
    followUpFrequency: "Early tolerance review, then periodic metabolic follow-up every few months.",
    redFlags: ["persistent GI intolerance", "rapid dehydration", "pancreatitis-type abdominal pain"],
  },
  {
    peptideId: "liraglutide",
    burden: "medium",
    summary: "Requires follow-up around metabolic response, GI tolerance, and adherence because of daily dosing.",
    baselineLabs: ["CMP", "fasting glucose or HbA1c", "lipids", "weight baseline"],
    followUpFrequency: "Early review in the first month, then periodic follow-up every few months.",
    redFlags: ["persistent nausea or vomiting", "gallbladder symptoms", "pancreatitis-type abdominal pain"],
  },
  {
    peptideId: "thymosin-alpha-1",
    burden: "medium",
    summary: "Immune-support framing still deserves a clean baseline and a more cautious read in autoimmune or cancer-sensitive contexts.",
    baselineLabs: ["CBC", "CMP", "clinical review of immune history"],
    followUpFrequency: "Periodic reassessment every few months, especially if health context is complex.",
    redFlags: ["hypersensitivity reactions", "unexpected immune flares", "new inflammatory symptoms"],
  },
  {
    peptideId: "mk-677",
    burden: "high",
    summary: "GH-axis and glucose-related monitoring burden is materially higher than for simpler wellness compounds.",
    baselineLabs: ["fasting glucose or HbA1c", "CMP", "IGF-1", "blood pressure and weight baseline"],
    followUpFrequency: "More frequent early follow-up, then reassessment every few months if continued.",
    redFlags: ["rapid edema", "worsening glucose control", "numbness or carpal-tunnel-like symptoms"],
  },
  {
    peptideId: "cjc-1295",
    burden: "high",
    summary: "GH-axis support is not a low-friction decision. IGF-1 and cancer-risk context matter.",
    baselineLabs: ["IGF-1", "fasting glucose or HbA1c", "CMP", "blood pressure baseline"],
    followUpFrequency: "Reassess at startup and then roughly every few months if continuing.",
    redFlags: ["excessive IGF-1 elevation", "edema or joint pain", "unusual growth-related symptoms"],
  },
  {
    peptideId: "ipamorelin",
    burden: "high",
    summary: "Selective GH support still brings a meaningful monitoring burden because the axis being manipulated is the same one users usually underestimate.",
    baselineLabs: ["IGF-1", "fasting glucose or HbA1c", "CMP"],
    followUpFrequency: "Frequent early review, then periodic reassessment every few months.",
    redFlags: ["edema", "glucose drift", "unexpected endocrine-type side effects"],
  },
  {
    peptideId: "pt-141",
    burden: "medium",
    summary: "The main monitoring issue is cardiovascular tolerance and overall side-effect fit rather than broad lab surveillance.",
    baselineLabs: ["blood pressure baseline", "cardiovascular history review"],
    followUpFrequency: "Review tolerance early and reassess if use becomes frequent.",
    redFlags: ["marked blood-pressure rise", "severe nausea", "headaches with cardiovascular symptoms"],
  },
];

export function getMonitoringGuidanceForPeptide(peptideId: string) {
  return PEPTIDE_MONITORING_GUIDANCE.find((entry) => entry.peptideId === peptideId);
}
