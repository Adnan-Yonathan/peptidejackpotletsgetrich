import type { PeptideData, PeptideCategory } from "@/data/peptides";
import { getPeptideCostEstimate } from "@/lib/costs";
import type { PlannerAnswers, PlannerRecommendation, PlannerResult } from "@/types/planner";

export type DoseSlot = "morning" | "midday" | "evening" | "pre_bed";

export interface ProtocolDose {
  id: string;
  peptideId: string;
  peptideName: string;
  peptideSlug: string;
  slot: DoseSlot;
  timeLabel: string;
  doseSummary: string;
  route: string;
  role: PlannerRecommendation["role"];
  note?: string;
}

export interface ProtocolCompound {
  peptideId: string;
  peptideName: string;
  peptideSlug: string;
  role: PlannerRecommendation["role"];
  doseRange: string;
  frequencyLabel: string;
  timingLabel: string;
  cycleWeeks: number;
  usageModel: string;
  rationale: string;
  route: string;
}

export interface ProtocolWeek {
  index: number;
  label: string;
  phase: "ramp" | "active" | "taper" | "off";
  phaseLabel: string;
}

export interface ProtocolPlan {
  totalWeeks: number;
  currentWeek: number;
  currentDayIndex: number;
  daysIntoCycle: number;
  weeks: ProtocolWeek[];
  compounds: ProtocolCompound[];
  todayDoses: ProtocolDose[];
  nextDose?: ProtocolDose;
  nextDoseAt?: string;
  timelineSummary: string;
  phaseSummary: string;
}

const SLOT_TIMES: Record<DoseSlot, { label: string; hour: number; minute: number }> = {
  morning: { label: "7:00 AM", hour: 7, minute: 0 },
  midday: { label: "12:30 PM", hour: 12, minute: 30 },
  evening: { label: "6:00 PM", hour: 18, minute: 0 },
  pre_bed: { label: "10:00 PM", hour: 22, minute: 0 },
};

function slotForPeptide(peptide: PeptideData): DoseSlot {
  const name = peptide.name.toLowerCase();
  const category = peptide.category as PeptideCategory;

  if (category === "gh_axis" || category === "growth_factor") return "pre_bed";
  if (name.includes("dsip") || name.includes("epitalon") || name.includes("delta sleep")) return "pre_bed";
  if (name.includes("melatonin") || name.includes("ghk")) return "evening";
  if (name.includes("semax") || name.includes("selank") || name.includes("mots") || name.includes("bpc")) {
    return "morning";
  }
  if (category === "metabolic") return "morning";
  if (category === "neuroprotection" || category === "cognitive") return "morning";
  if (category === "melanocortin") return "midday";
  if (category === "reproductive" || category === "longevity") return "evening";
  return "morning";
}

function frequencyForUsage(usageModel: string | undefined): { freq: string; dosesPerWeek: number } {
  switch (usageModel) {
    case "continuous":
      return { freq: "Daily", dosesPerWeek: 7 };
    case "phase_based":
      return { freq: "5 days on, 2 off", dosesPerWeek: 5 };
    case "short_burst":
      return { freq: "Daily (short cycle)", dosesPerWeek: 7 };
    case "intermittent":
      return { freq: "3× per week", dosesPerWeek: 3 };
    case "insufficient_evidence":
      return { freq: "As protocol allows", dosesPerWeek: 3 };
    default:
      return { freq: "Daily", dosesPerWeek: 7 };
  }
}

function routeLabel(peptide: PeptideData): string {
  const route = peptide.administrationRoutes?.[0] ?? "subcutaneous";
  return route.replace(/_/g, " ");
}

function shortDoseFromRange(studyDoseRange: string): string {
  const match = studyDoseRange.match(/([\d.]+\s*[–-]\s*[\d.]+\s*(?:mcg|µg|mg|iu|IU))/i);
  if (match) return match[1].replace(/\s+/g, " ");
  const single = studyDoseRange.match(/([\d.]+\s*(?:mcg|µg|mg|iu|IU))/i);
  if (single) return single[1].replace(/\s+/g, " ");
  return "Per protocol";
}

function timingLabel(slot: DoseSlot): string {
  switch (slot) {
    case "morning":
      return "Morning, on waking";
    case "midday":
      return "Midday";
    case "evening":
      return "Evening";
    case "pre_bed":
      return "30–60 min before bed";
  }
}

function buildWeeks(totalWeeks: number): ProtocolWeek[] {
  const weeks: ProtocolWeek[] = [];
  const rampEnd = Math.max(1, Math.ceil(totalWeeks * 0.15));
  const taperStart = Math.max(rampEnd + 1, Math.ceil(totalWeeks * 0.85));
  for (let i = 1; i <= totalWeeks; i++) {
    let phase: ProtocolWeek["phase"] = "active";
    let phaseLabel = "Active phase";
    if (i <= rampEnd) {
      phase = "ramp";
      phaseLabel = "Ramp-up";
    } else if (i >= taperStart) {
      phase = "taper";
      phaseLabel = "Taper";
    }
    weeks.push({ index: i, label: `Week ${i}`, phase, phaseLabel });
  }
  return weeks;
}

function isDoseDay(dayIndex0Based: number, dosesPerWeek: number): boolean {
  const dayInWeek = dayIndex0Based % 7;
  if (dosesPerWeek >= 7) return true;
  if (dosesPerWeek === 5) return dayInWeek < 5; // Mon–Fri pattern
  if (dosesPerWeek === 3) return dayInWeek === 0 || dayInWeek === 2 || dayInWeek === 4;
  if (dosesPerWeek === 2) return dayInWeek === 0 || dayInWeek === 3;
  return dayInWeek === 0;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const aMid = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((aMid - bMid) / msPerDay);
}

export interface BuildProtocolInput {
  plan: PlannerResult;
  answers: PlannerAnswers;
  startedAt: Date;
  now: Date;
}

export function buildProtocolPlan({ plan, answers, startedAt, now }: BuildProtocolInput): ProtocolPlan {
  const compounds: ProtocolCompound[] = plan.primary.map((rec) => {
    const estimate = getPeptideCostEstimate(rec.peptide.id, {
      shopperCountry: answers.country,
      outputCurrency: "USD",
    });
    const cycleWeeks = estimate?.cycleWeeks ?? 8;
    const usageModel = estimate?.usageModel ?? "continuous";
    const { freq } = frequencyForUsage(usageModel);
    const slot = slotForPeptide(rec.peptide);
    return {
      peptideId: rec.peptide.id,
      peptideName: rec.peptide.name,
      peptideSlug: rec.peptide.slug,
      role: rec.role,
      doseRange: shortDoseFromRange(rec.peptide.studyDoseRange),
      frequencyLabel: freq,
      timingLabel: timingLabel(slot),
      cycleWeeks,
      usageModel,
      rationale: rec.rationale[0] ?? rec.peptide.shortDescription,
      route: routeLabel(rec.peptide),
    };
  });

  const totalWeeks = compounds.reduce((acc, c) => Math.max(acc, c.cycleWeeks), 0) || 8;
  const weeks = buildWeeks(totalWeeks);

  const daysInto = Math.max(0, daysBetween(now, startedAt));
  const currentWeek = Math.min(totalWeeks, Math.floor(daysInto / 7) + 1);
  const currentDayIndex = daysInto % 7;

  const todayDoses: ProtocolDose[] = plan.primary
    .map((rec) => {
      const estimate = getPeptideCostEstimate(rec.peptide.id, {
        shopperCountry: answers.country,
        outputCurrency: "USD",
      });
      const usage = estimate?.usageModel ?? "continuous";
      const { dosesPerWeek } = frequencyForUsage(usage);
      if (!isDoseDay(daysInto, dosesPerWeek)) return null;
      const slot = slotForPeptide(rec.peptide);
      const time = SLOT_TIMES[slot];
      const dose = shortDoseFromRange(rec.peptide.studyDoseRange);
      return {
        id: `${rec.peptide.id}-${slot}`,
        peptideId: rec.peptide.id,
        peptideName: rec.peptide.name,
        peptideSlug: rec.peptide.slug,
        slot,
        timeLabel: time.label,
        doseSummary: `${dose} · ${routeLabel(rec.peptide)}`,
        route: routeLabel(rec.peptide),
        role: rec.role,
      } satisfies ProtocolDose;
    })
    .filter((d): d is ProtocolDose => d !== null)
    .sort((a, b) => SLOT_TIMES[a.slot].hour - SLOT_TIMES[b.slot].hour);

  const nowMs = now.getTime();
  let nextDose: ProtocolDose | undefined;
  let nextDoseAt: string | undefined;

  for (const dose of todayDoses) {
    const slot = SLOT_TIMES[dose.slot];
    const doseDate = new Date(now);
    doseDate.setHours(slot.hour, slot.minute, 0, 0);
    if (doseDate.getTime() >= nowMs) {
      nextDose = dose;
      nextDoseAt = doseDate.toISOString();
      break;
    }
  }

  if (!nextDose && todayDoses.length > 0) {
    const first = todayDoses[0];
    const slot = SLOT_TIMES[first.slot];
    const doseDate = new Date(now);
    doseDate.setDate(doseDate.getDate() + 1);
    doseDate.setHours(slot.hour, slot.minute, 0, 0);
    nextDose = first;
    nextDoseAt = doseDate.toISOString();
  }

  const phaseSummary =
    weeks[currentWeek - 1]?.phaseLabel ?? "Active phase";

  return {
    totalWeeks,
    currentWeek,
    currentDayIndex,
    daysIntoCycle: daysInto,
    weeks,
    compounds,
    todayDoses,
    nextDose,
    nextDoseAt,
    timelineSummary: plan.timelineSummary,
    phaseSummary,
  };
}

export function doseKey(doseId: string, date: Date): string {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return `${iso}__${doseId}`;
}

export function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
