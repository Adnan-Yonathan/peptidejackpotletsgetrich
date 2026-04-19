"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PeptideBottleArt } from "@/components/peptide/PeptideBottleArt";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type PeptideData,
  getPublishedPeptides,
  type EvidenceTier,
  type RiskLevel,
} from "@/data/peptides";
import { getGoalsForPeptide } from "@/data/goals";
import { formatCostRange, getPeptideCostEstimate } from "@/lib/costs";
import { ArrowRight, Search, AlertTriangle, ShieldAlert, ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";

const GOAL_FILTERS = [
  { key: "all", label: "All research goals", goalIds: [] },
  { key: "performance", label: "Performance & muscle", goalIds: ["muscle_growth", "gh_optimization"] },
  { key: "fat-loss", label: "Fat loss & metabolism", goalIds: ["fat_loss"] },
  { key: "recovery", label: "Recovery & injury support", goalIds: ["recovery"] },
  { key: "sleep-stress", label: "Sleep, stress & mood", goalIds: ["sleep", "anxiety"] },
  { key: "focus", label: "Focus & brain health", goalIds: ["cognitive"] },
  { key: "longevity", label: "Longevity & healthy aging", goalIds: ["anti_aging"] },
  { key: "appearance", label: "Skin, hair & appearance", goalIds: ["skin_hair"] },
  { key: "immune", label: "Immune resilience", goalIds: ["immune"] },
  { key: "libido", label: "Libido & hormone support", goalIds: ["sexual_health"] },
] as const;

type GoalFilterKey = (typeof GOAL_FILTERS)[number]["key"];

const GOAL_TO_FILTER: Record<string, GoalFilterKey> = {
  muscle_growth: "performance",
  gh_optimization: "performance",
  fat_loss: "fat-loss",
  recovery: "recovery",
  sleep: "sleep-stress",
  anxiety: "sleep-stress",
  cognitive: "focus",
  anti_aging: "longevity",
  skin_hair: "appearance",
  immune: "immune",
  sexual_health: "libido",
};

const EVIDENCE_TIER_LABELS: Record<"all" | EvidenceTier, string> = {
  all: "All tiers",
  A: "Tier A",
  B: "Tier B",
  "B-C": "Tier B-C",
  C: "Tier C",
  "C-D": "Tier C-D",
  D: "Tier D",
};

const RISK_LEVEL_LABELS: Record<"all" | RiskLevel, string> = {
  all: "All risk",
  low: "Low risk",
  medium: "Medium risk",
  "med-high": "Med-high risk",
  high: "High risk",
  extreme: "Extreme risk",
};

const SORT_OPTIONS = [
  { value: "most-researched", label: "Most Researched" },
  { value: "lowest-risk", label: "Lowest Risk" },
  { value: "name", label: "Name" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const EVIDENCE_ORDER: Record<EvidenceTier, number> = {
  A: 6,
  B: 5,
  "B-C": 4,
  C: 3,
  "C-D": 2,
  D: 1,
};

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  "med-high": 3,
  high: 4,
  extreme: 5,
};

function getRiskBadgeClasses(level: string) {
  const colors: Record<string, string> = {
    low: "bg-green-500/10 text-green-600 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    "med-high": "bg-orange-500/10 text-orange-600 border-orange-500/30",
    high: "bg-red-500/10 text-red-600 border-red-500/30",
    extreme: "bg-red-700/10 text-red-700 border-red-700/30",
  };
  return colors[level] ?? "";
}

function getEffectivenessScore(peptide: PeptideData) {
  const base: Record<EvidenceTier, number> = {
    A: 9.1,
    B: 8.5,
    "B-C": 8.2,
    C: 7.8,
    "C-D": 7.3,
    D: 6.8,
  };

  const modifier =
    peptide.regulatoryStatus === "rx_approved" ? 0.3 : peptide.regulatoryStatus === "investigational" ? 0.1 : 0;

  return Math.min(9.6, base[peptide.evidenceTier] + modifier).toFixed(1);
}

function getTimelineLabel(onsetTimeline: string) {
  const lowered = onsetTimeline.toLowerCase();
  const rangeMatch = onsetTimeline.match(/\d+\s*(?:-|to)\s*\d+\s*(day|days|week|weeks|month|months)/i);
  if (rangeMatch) {
    return rangeMatch[0].replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const singleMatch = onsetTimeline.match(/\d+\s*(day|days|week|weeks|month|months)/i);
  if (singleMatch) {
    if (lowered.includes("within") || lowered.includes("acute")) {
      return `Within ${singleMatch[0]}`;
    }

    return singleMatch[0].replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (lowered.includes("minutes")) return "Minutes-Hours";
  if (lowered.includes("days")) return "Days-Weeks";
  if (lowered.includes("weeks")) return "2-8 Weeks";
  if (lowered.includes("months")) return "1-6 Months";

  return "Varies";
}

function getBestForLabels(peptide: PeptideData) {
  const goals = getGoalsForPeptide(peptide.id).map((goal) =>
    goal.displayName
      .replace(" & ", ", ")
      .replace("Tissue Repair ", "")
      .replace("GH Axis ", "GH ")
  );

  return goals.slice(0, 3);
}

function getNotIdealLabels(peptide: PeptideData) {
  const source = `${peptide.contraindications} ${peptide.interactionNotes}`.toLowerCase();
  const labels: string[] = [];

  if (source.includes("pregnan")) labels.push("Pregnancy");
  if (source.includes("malignan") || source.includes("neoplas")) labels.push("Cancer Risk");
  if (source.includes("diabet") || source.includes("glucose") || source.includes("insulin")) labels.push("Glucose Issues");
  if (source.includes("hypotension") || source.includes("blood pressure") || source.includes("vasodil")) labels.push("BP Concerns");
  if (source.includes("cardio") || source.includes("heart")) labels.push("Cardiac Risk");
  if (source.includes("autoimmune") || source.includes("immune stimulation")) labels.push("Autoimmune Context");
  if (source.includes("fertility") || source.includes("gonad") || source.includes("reproductive")) labels.push("Hormone-Sensitive Use");

  if (peptide.fdaCompoundingRiskFlag === "flagged" && !labels.includes("Gray-Market Use")) {
    labels.push("Gray-Market Use");
  }

  if (labels.length === 0 && peptide.riskLevel !== "low") {
    labels.push("Low-Friction Use");
  }

  if (labels.length === 0) {
    labels.push("Casual Stacking");
  }

  return labels.slice(0, 2);
}

function getHighlightLine(peptide: PeptideData) {
  const goal = getGoalsForPeptide(peptide.id)[0];
  if (goal) {
    return `Best for ${goal.displayName.toLowerCase()}`;
  }

  return `${peptide.category.replaceAll("_", " ")} support`;
}

function PeptidesDirectoryContent() {
  const searchParams = useSearchParams();
  const requestedGoal = searchParams.get("goal");
  const requestedFilter = useMemo<GoalFilterKey>(() => {
    if (!requestedGoal) {
      return "all";
    }

    return GOAL_TO_FILTER[requestedGoal] ?? "all";
  }, [requestedGoal]);

  const [activeGoal, setActiveGoal] = useState<GoalFilterKey>(requestedFilter);
  const [activeTier, setActiveTier] = useState<"all" | EvidenceTier>("all");
  const [activeRisk, setActiveRisk] = useState<"all" | RiskLevel>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("most-researched");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  useEffect(() => {
    setActiveGoal(requestedFilter);
  }, [requestedFilter]);

  const allPeptides = getPublishedPeptides();
  const compareHref =
    compareSlugs.length >= 2 ? `/compare/peptides?ids=${compareSlugs.join(",")}` : undefined;

  function toggleCompare(slug: string) {
    setCompareSlugs((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, slug];
    });
  }

  const filtered = useMemo(() => {
    const matched = allPeptides.filter((p) => {
      const peptideGoalIds = getGoalsForPeptide(p.id).map((goal) => goal.id);
      const goalFilter = GOAL_FILTERS.find((filter) => filter.key === activeGoal);
      const matchGoal =
        !goalFilter ||
        goalFilter.goalIds.length === 0 ||
        goalFilter.goalIds.some((goalId) => peptideGoalIds.includes(goalId));
      const matchTier = activeTier === "all" || p.evidenceTier === activeTier;
      const matchRisk = activeRisk === "all" || p.riskLevel === activeRisk;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.synonyms.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase());
      return matchGoal && matchTier && matchRisk && matchSearch;
    });

    return matched.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "lowest-risk") {
        return RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel] || EVIDENCE_ORDER[b.evidenceTier] - EVIDENCE_ORDER[a.evidenceTier];
      }

      return EVIDENCE_ORDER[b.evidenceTier] - EVIDENCE_ORDER[a.evidenceTier] || RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel];
    });
  }, [activeGoal, activeRisk, activeTier, allPeptides, search, sortBy]);

  const activeGoalLabel = GOAL_FILTERS.find((filter) => filter.key === activeGoal)?.label ?? "All research goals";

  return (
    <main className="flex-1 bg-[#f6f7f5] px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 grid gap-4 xl:grid-cols-[1.8fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Peptide Database
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Research Peptides, Ranked & Explained
            </h1>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Evidence-based insights to help you choose smarter. {allPeptides.length} peptides. Updated April 2026.
            </p>
          </div>

          <Card className="border-emerald-100 bg-emerald-50/80 shadow-none">
            <CardContent className="flex h-full flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-3 text-emerald-700 shadow-sm">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Not sure where to start?</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Take our 2-minute quiz to get a personalized peptide plan.
                  </p>
                </div>
              </div>
              <Button className="bg-emerald-900 hover:bg-emerald-800" render={<Link href="/quiz" />}>
                Find My Plan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {compareSlugs.length > 0 && (
          <Card className="mb-6 border-emerald-200 bg-white shadow-sm">
            <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Compare tray</p>
                <div className="flex flex-wrap gap-2">
                  {compareSlugs.map((slug) => {
                    const peptide = allPeptides.find((item) => item.slug === slug);
                    return (
                      <Badge key={slug} variant="secondary">
                        {peptide?.name ?? slug}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add 2 to 4 peptides, then open the side-by-side comparison.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="ghost" onClick={() => setCompareSlugs([])}>
                  Clear
                </Button>
                {compareHref ? (
                  <Button className="bg-emerald-900 hover:bg-emerald-800" render={<Link href={compareHref} />}>
                    Compare selected <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                ) : (
                  <Button disabled>
                    Select at least 2
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter by Risk:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(RISK_LEVEL_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveRisk(key as "all" | RiskLevel)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      activeRisk === key
                        ? "border-emerald-900 bg-emerald-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_160px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search compounds"
                  className="h-10 rounded-full border-slate-200 bg-slate-50 pl-9"
                />
              </div>
              <label className="flex items-center justify-end gap-2 text-xs font-medium text-slate-500">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {GOAL_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveGoal(filter.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                activeGoal === filter.key
                  ? "border-emerald-900 bg-emerald-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">
            {Object.entries(EVIDENCE_TIER_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTier(key as "all" | EvidenceTier)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  activeTier === key
                    ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          {filtered.length} peptide{filtered.length !== 1 ? "s" : ""} for {activeGoalLabel.toLowerCase()}
        </p>

        <div className="grid gap-5 xl:grid-cols-3 md:grid-cols-2">
          {filtered.map((peptide) => {
            const costEstimate = getPeptideCostEstimate(peptide.id);
            const bestFor = getBestForLabels(peptide);
            const notIdealFor = getNotIdealLabels(peptide);
            const highlightLine = getHighlightLine(peptide);
            return (
              <div
                key={peptide.id}
                className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] transition-shadow hover:shadow-[0_18px_50px_-24px_rgba(15,23,42,0.38)]"
              >
                <div className="flex items-start gap-4">
                  <PeptideBottleArt
                    slug={peptide.slug}
                    name={peptide.name}
                    category={peptide.category}
                    regulatoryStatus={peptide.regulatoryStatus}
                    className="mx-0 h-28 w-28 shrink-0 max-w-none"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight text-slate-900">{peptide.name}</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          {peptide.synonyms.slice(0, 2).join(" / ") || peptide.shortDescription}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getRiskBadgeClasses(peptide.riskLevel)}`}
                      >
                        {peptide.riskLevel === "med-high" ? "Med-High" : peptide.riskLevel.replace(/\b\w/g, (char) => char.toUpperCase())} Risk
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-emerald-800">{highlightLine}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{peptide.shortDescription}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-900">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Best For
                    </div>
                    <p className="text-xs leading-5 text-slate-600">{bestFor.join(", ")}</p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-rose-900">
                      <XCircle className="h-3.5 w-3.5" />
                      Not Ideal If
                    </div>
                    <p className="text-xs leading-5 text-slate-600">{notIdealFor.join(", ")}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Effectiveness</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{getEffectivenessScore(peptide)}/10</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Time to Results</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{getTimelineLabel(peptide.onsetTimeline)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Typical Cycle</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {costEstimate
                        ? formatCostRange(costEstimate.cycleCostLow, costEstimate.cycleCostHigh)
                        : "Varies"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full bg-slate-100 text-[10px] text-slate-700">
                    {peptide.category.replaceAll("_", " ")}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full bg-slate-100 text-[10px] text-slate-700">
                    Tier {peptide.evidenceTier}
                  </Badge>
                  {getGoalsForPeptide(peptide.id).slice(0, 2).map((goal) => (
                    <Badge key={goal.id} variant="secondary" className="rounded-full bg-slate-100 text-[10px] text-slate-700">
                      {goal.displayName}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Button variant="ghost" size="sm" className="px-0 text-emerald-900 hover:bg-transparent hover:text-emerald-800" render={<Link href={`/peptides/${peptide.slug}`} />}>
                    View Full Guide &amp; Protocols <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-xl bg-emerald-900 px-4 hover:bg-emerald-800"
                    variant={compareSlugs.includes(peptide.slug) ? "secondary" : "default"}
                    disabled={!compareSlugs.includes(peptide.slug) && compareSlugs.length >= 4}
                    onClick={() => toggleCompare(peptide.slug)}
                  >
                    {compareSlugs.includes(peptide.slug) ? "Added" : "Add to Compare"}
                  </Button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  {peptide.fdaCompoundingRiskFlag === "flagged" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-red-700">
                      <ShieldAlert className="h-3 w-3" />
                      FDA Flag
                    </span>
                  )}
                  {peptide.wadaFlag !== "none" && peptide.wadaFlag !== "unknown" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                      <AlertTriangle className="h-3 w-3" />
                      WADA {peptide.wadaFlag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No peptides match your filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PeptidesPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="flex-1 py-12 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Peptide Directory</h1>
                <p className="text-muted-foreground">
                  Loading peptide filters...
                </p>
              </div>
            </div>
          </main>
        }
      >
        <PeptidesDirectoryContent />
      </Suspense>
      <Footer />
    </>
  );
}
