"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPublishedPeptides,
  type EvidenceTier,
  type RiskLevel,
} from "@/data/peptides";
import { getGoalsForPeptide } from "@/data/goals";
import { ArrowRight, Search, AlertTriangle, ShieldAlert } from "lucide-react";

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

function EvidenceBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    A: "bg-green-500/10 text-green-600 border-green-500/30",
    B: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    "B-C": "bg-sky-500/10 text-sky-600 border-sky-500/30",
    C: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    "C-D": "bg-orange-500/10 text-orange-600 border-orange-500/30",
    D: "bg-red-500/10 text-red-600 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={colors[tier] ?? ""}>
      Tier {tier}
    </Badge>
  );
}

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: "bg-green-500/10 text-green-600 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    "med-high": "bg-orange-500/10 text-orange-600 border-orange-500/30",
    high: "bg-red-500/10 text-red-600 border-red-500/30",
    extreme: "bg-red-700/10 text-red-700 border-red-700/30",
  };
  return (
    <Badge variant="outline" className={`capitalize ${colors[level] ?? ""}`}>
      {level} risk
    </Badge>
  );
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

  useEffect(() => {
    setActiveGoal(requestedFilter);
  }, [requestedFilter]);

  const allPeptides = getPublishedPeptides();

  const filtered = allPeptides.filter((p) => {
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

  const activeGoalLabel = GOAL_FILTERS.find((filter) => filter.key === activeGoal)?.label ?? "All research goals";

  return (
    <main className="flex-1 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Peptide Directory</h1>
          <p className="text-muted-foreground">
            Browse {allPeptides.length} research peptides. Filter by broad health goals, search by name, or narrow by evidence and risk.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search peptides..."
            className="pl-9"
          />
        </div>

          {/* Goal filters */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {GOAL_FILTERS.map((filter) => (
              <Badge
                key={filter.key}
                variant={activeGoal === filter.key ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveGoal(filter.key)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>

          <div className="mb-8 space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Evidence tier
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(EVIDENCE_TIER_LABELS).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={activeTier === key ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setActiveTier(key as "all" | EvidenceTier)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Risk level
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(RISK_LEVEL_LABELS).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={activeRisk === key ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setActiveRisk(key as "all" | RiskLevel)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} peptide{filtered.length !== 1 ? "s" : ""} for {activeGoalLabel.toLowerCase()}
          </p>

          {/* Peptide cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((peptide) => {
              const goals = getGoalsForPeptide(peptide.id);
              return (
                <Card key={peptide.id} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{peptide.name}</CardTitle>
                      <div className="flex gap-1 shrink-0">
                        {peptide.fdaCompoundingRiskFlag === "flagged" && (
                          <span title="FDA compounding safety flag"><ShieldAlert className="h-4 w-4 text-red-500" /></span>
                        )}
                        {peptide.wadaFlag !== "none" && peptide.wadaFlag !== "unknown" && (
                          <span title={`WADA ${peptide.wadaFlag}`}><AlertTriangle className="h-4 w-4 text-yellow-500" /></span>
                        )}
                      </div>
                    </div>
                    {peptide.synonyms.length > 0 && (
                      <p className="text-xs text-muted-foreground">{peptide.synonyms.slice(0, 2).join(" / ")}</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {peptide.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <EvidenceBadge tier={peptide.evidenceTier} />
                      <RiskBadge level={peptide.riskLevel} />
                      <Badge variant="outline" className="capitalize text-xs">
                        {peptide.experienceLevel}
                      </Badge>
                    </div>
                    {goals.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {goals.slice(0, 3).map((g) => (
                          <Badge key={g.id} variant="secondary" className="text-[10px]">
                            {g.displayName}
                          </Badge>
                        ))}
                        {goals.length > 3 && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{goals.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Button variant="outline" size="sm" render={<Link href={`/peptides/${peptide.slug}`} />}>
                      Learn More <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
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
