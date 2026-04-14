"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStackBuilder } from "@/hooks/useStackBuilder";
import { getStackablePeptides, getPeptideById } from "@/data/peptides";
import { getCompatibility } from "@/data/compatibility";
import { DISCLAIMERS } from "@/data/disclaimers";
import { getGoalsForPeptide } from "@/data/goals";
import {
  Plus,
  Trash2,
  Share2,
  Save,
  AlertTriangle,
  XOctagon,
  Search,
  X,
  Minus,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const EVIDENCE_SCORE: Record<string, number> = {
  A: 5,
  B: 4,
  "B-C": 3,
  C: 2,
  "C-D": 1,
  D: 0,
};

const RISK_SCORE: Record<string, number> = {
  low: 3,
  medium: 2,
  "med-high": 1,
  high: 0,
  extreme: -1,
};

export default function StackBuilderPage() {
  const { name, items, warnings, setName, addItem, removeItem, updateQuantity, hasContraindicated, clear } =
    useStackBuilder();
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");

  const stackablePeptides = getStackablePeptides();
  const addedIds = new Set(items.map((i) => i.peptide.id));
  const selectedGoalIds = new Set(items.flatMap((item) => getGoalsForPeptide(item.peptide.id).map((goal) => goal.id)));
  const selectedCategories = new Set(items.map((item) => item.peptide.category));

  const filtered = stackablePeptides.filter(
    (p) =>
      !addedIds.has(p.id) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.synonyms.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const contraindicatedPairs = warnings.filter((w) => w.status === "contraindicated");
  const cautionPairs = warnings.filter((w) => w.status === "caution");
  const recommendedAdds = stackablePeptides
    .filter((candidate) => {
      if (addedIds.has(candidate.id)) {
        return false;
      }

      return items.every((item) => {
        const { status } = getCompatibility(candidate.id, item.peptide.id);
        return status !== "contraindicated" && status !== "caution";
      });
    })
    .map((candidate) => {
      const candidateGoalIds = getGoalsForPeptide(candidate.id).map((goal) => goal.id);
      const sharedGoals = candidateGoalIds.filter((goalId) => selectedGoalIds.has(goalId));
      const categoryDiversityBonus = items.length === 0 || !selectedCategories.has(candidate.category) ? 2 : 0;
      const score =
        sharedGoals.length * 4 +
        categoryDiversityBonus +
        (EVIDENCE_SCORE[candidate.evidenceTier] ?? 0) +
        (RISK_SCORE[candidate.riskLevel] ?? 0);

      return {
        peptide: candidate,
        sharedGoals,
        score,
      };
    })
    .filter((entry) => entry.sharedGoals.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Stack Builder</h1>
              <p className="text-muted-foreground">
                Build and compare custom peptide research stacks with compatibility checking.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" /> Save Stack
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Stack name..."
              className="max-w-xs text-lg font-semibold border-none px-0 focus-visible:ring-0"
            />
          </div>

          {/* Compatibility warnings */}
          {contraindicatedPairs.length > 0 && (
            <Card className="mb-4 border-red-500/50 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <XOctagon className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-500 mb-2">Contraindicated Combinations</p>
                    {contraindicatedPairs.map((w, i) => (
                      <div key={i} className="text-sm mb-2">
                        <span className="font-medium">
                          {getPeptideById(w.peptideA)?.name} + {getPeptideById(w.peptideB)?.name}
                        </span>
                        <p className="text-muted-foreground mt-0.5">{w.summary}</p>
                      </div>
                    ))}
                    <p className="text-xs text-red-500/80 mt-2">{DISCLAIMERS.CONTRAINDICATED_STACK.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {cautionPairs.length > 0 && (
            <Card className="mb-4 border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Caution Flags</p>
                    {cautionPairs.map((w, i) => (
                      <div key={i} className="text-sm mb-2">
                        <span className="font-medium">
                          {getPeptideById(w.peptideA)?.name} + {getPeptideById(w.peptideB)?.name}
                        </span>
                        <p className="text-muted-foreground mt-0.5">{w.summary}</p>
                      </div>
                    ))}
                    <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-2">
                      {DISCLAIMERS.CAUTION_STACK.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stack items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Components
                <div className="flex gap-2">
                  {items.length > 0 && (
                    <Button size="sm" variant="ghost" onClick={clear}>
                      Clear All
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setShowPicker(!showPicker)}>
                    {showPicker ? (
                      <>
                        <X className="mr-2 h-4 w-4" /> Close
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Add Peptide
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length > 0 && recommendedAdds.length > 0 && (
                <div className="mb-6 rounded-xl border bg-primary/5 p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Complementary additions for this stack</p>
                      <p className="text-sm text-muted-foreground">
                        These suggestions share your stack&apos;s goals and avoid known caution or contraindication pairings.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {recommendedAdds.map(({ peptide, sharedGoals }) => (
                      <button
                        key={peptide.id}
                        onClick={() => addItem(peptide)}
                        className="rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{peptide.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{peptide.shortDescription}</p>
                          </div>
                          <Plus className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-[10px]">
                            Tier {peptide.evidenceTier}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {peptide.riskLevel} risk
                          </Badge>
                          {sharedGoals.slice(0, 2).map((goalId) => (
                            <Badge key={goalId} variant="secondary" className="text-[10px]">
                              {getGoalsForPeptide(peptide.id).find((goal) => goal.id === goalId)?.displayName}
                            </Badge>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Peptide picker */}
              {showPicker && (
                <div className="mb-6 border rounded-lg p-4 bg-muted/30">
                  <p className="mb-3 text-sm text-muted-foreground">
                    Search the full stackable directory. Recommendations above are goal-aligned and filtered to avoid known caution pairs.
                  </p>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search peptides..."
                      className="pl-9"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filtered.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {search ? "No matching peptides found." : "All stackable peptides have been added."}
                      </p>
                    ) : (
                      filtered.map((peptide) => (
                        <button
                          key={peptide.id}
                          onClick={() => {
                            addItem(peptide);
                            setSearch("");
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-muted text-left transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{peptide.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{peptide.shortDescription}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <Badge variant="outline" className="text-[10px]">
                              {peptide.evidenceTier}
                            </Badge>
                            {peptide.fdaCompoundingRiskFlag === "flagged" && (
                              <Badge variant="destructive" className="text-[10px]">
                                FDA
                              </Badge>
                            )}
                            {peptide.wadaFlag !== "none" && peptide.wadaFlag !== "unknown" && (
                              <Badge variant="secondary" className="text-[10px]">
                                WADA
                              </Badge>
                            )}
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">No peptides added yet.</p>
                  <p className="text-sm">Click &quot;Add Peptide&quot; to start building your stack.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.peptide.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{item.peptide.name}</p>
                          <Badge variant="outline" className="text-[10px]">
                            {item.peptide.evidenceTier}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {item.peptide.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.peptide.shortDescription}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.peptide.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.peptide.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.peptide.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Stack Summary</p>
                  <p className="text-lg font-semibold">
                    {items.length} peptide{items.length !== 1 ? "s" : ""}
                    {warnings.length > 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        &middot; {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {hasContraindicated() && (
                    <Badge variant="destructive">Has Contraindications</Badge>
                  )}
                  {!hasContraindicated() && cautionPairs.length > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50">
                      Caution
                    </Badge>
                  )}
                  {warnings.length === 0 && items.length > 1 && (
                    <Badge variant="outline">No Known Interactions</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Need a real protocol?</p>
                  <h2 className="mt-2 text-2xl font-bold">Take the quiz for a goal-matched protocol</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The stack builder helps you test combinations. The quiz is where we fit compounds to your age, goals, health context, and risk tolerance.
                  </p>
                </div>
                <Button size="lg" render={<Link href="/quiz" />}>
                  Get my custom protocol <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Global disclaimer */}
          {items.length > 0 && (
            <p className="text-xs text-muted-foreground mt-6 text-center max-w-2xl mx-auto">
              {DISCLAIMERS.GLOBAL_STANDARD.text}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
