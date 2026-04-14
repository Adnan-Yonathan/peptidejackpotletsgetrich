"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, RotateCcw, ShieldAlert } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizState } from "@/hooks/useQuizState";
import { generatePlannerResult } from "@/lib/planner-engine";
import type { PlannerAnswers, PlannerRecommendation } from "@/types/planner";

export default function QuizResultsPage() {
  const router = useRouter();
  const { answers, isComplete, reset } = useQuizState();

  if (!isComplete()) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Quiz not completed</h2>
              <p className="text-muted-foreground mb-4">
                Complete the intake first so the planner has enough context to build a program.
              </p>
              <Button render={<Link href="/quiz" />}>Start intake</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const plan = generatePlannerResult(answers as PlannerAnswers);

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Button variant="ghost" render={<Link href="/quiz" />}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to intake
              </Button>
              <h1 className="text-3xl font-bold">{plan.planHeadline}</h1>
              <p className="mt-2 text-muted-foreground">{plan.profileSummary}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                reset();
                router.push("/quiz");
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset and retake
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>What the planner optimized for</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {plan.identifiedNeeds.map((need) => (
                    <Badge key={need} variant="secondary">
                      {need}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{plan.timelineSummary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program phases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.programPhases.map((phase) => (
                  <div key={phase.title}>
                    <p className="font-medium">{phase.title}</p>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Primary program</h2>
              <p className="text-muted-foreground">
                These are the strongest fits after applying your goal, problems, budget, risk, and safety constraints.
              </p>
            </div>
            {plan.primary.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  No compounds survived your current safety and preference filters. That usually means your intake is highly
                  conservative relative to the catalog. Relax delivery or risk constraints only if that reflects your real
                  willingness, otherwise keep the exclusion list as the output.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {plan.primary.map((item) => (
                  <RecommendationCard key={item.peptide.id} item={item} />
                ))}
              </div>
            )}
          </section>

          {plan.alternatives.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">Alternatives</h2>
                <p className="text-muted-foreground">
                  Good fits that lost to stronger options or a simpler program structure.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {plan.alternatives.map((item) => (
                  <RecommendationCard key={item.peptide.id} item={item} compact />
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Safety notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.safetyNotes.map((note) => (
                  <div key={note} className="flex gap-3 rounded-lg border border-border/60 p-3">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-sm text-muted-foreground">{note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stack compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.compatibilityWarnings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No explicit pairwise compatibility warnings were triggered for the primary program.
                  </p>
                ) : (
                  plan.compatibilityWarnings.map((warning) => (
                    <div key={warning} className="rounded-lg border border-border/60 p-3 text-sm text-muted-foreground">
                      {warning}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {plan.excluded.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Compounds deliberately excluded</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {plan.excluded.map((item) => (
                  <div key={item.peptide.id} className="rounded-lg border border-border/60 p-4">
                    <p className="font-medium">{item.peptide.name}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {item.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <p className="border-t pt-4 text-xs text-muted-foreground">
            This planner is for educational and research reference only. It is not medical advice and should not be used
            to diagnose, treat, cure, or prevent disease. Always consult a qualified healthcare professional.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function RecommendationCard({
  item,
  compact = false,
}: {
  item: PlannerRecommendation;
  compact?: boolean;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{item.peptide.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{item.peptide.shortDescription}</p>
          </div>
          <Badge variant="outline" className="capitalize">
            {item.role}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Tier {item.peptide.evidenceTier}</Badge>
          <Badge variant="outline" className="capitalize">
            {item.peptide.riskLevel} risk
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.peptide.budgetTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Why it fits</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {item.rationale.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>

        {item.cautions.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Cautions</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {item.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </div>
        )}

        {item.vendors.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Vendor options</p>
            <div className="space-y-2">
              {item.vendors.map((vendor) => (
                <Button
                  key={vendor.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  render={<Link href={`/vendors/${vendor.slug}`} />}
                >
                  <span className="truncate">{vendor.name}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {!compact && (
          <Button variant="outline" className="w-full" render={<Link href={`/peptides/${item.peptide.slug}`} />}>
            View compound detail
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
