"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizState } from "@/hooks/useQuizState";
import { generatePlannerResult } from "@/lib/planner-engine";
import type { PlannerAnswers } from "@/types/planner";

export default function QuizResultsPage() {
  const router = useRouter();
  const { answers, isComplete, reset } = useQuizState();

  const plan = isComplete() ? generatePlannerResult(answers as PlannerAnswers) : null;
  const topRecommendation = plan?.primary[0] ?? plan?.alternatives[0];

  useEffect(() => {
    if (topRecommendation) {
      router.replace(`/peptides/${topRecommendation.peptide.slug}?fromQuiz=1`);
    }
  }, [router, topRecommendation]);

  if (!isComplete()) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <h2 className="mb-2 text-xl font-semibold">Quiz not completed</h2>
              <p className="mb-4 text-muted-foreground">
                Complete the intake first so the planner has enough context to recommend a compound.
              </p>
              <Button render={<Link href="/quiz" />}>Start intake</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  if (topRecommendation) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-lg text-center">
            <CardContent className="pt-6">
              <h2 className="mb-2 text-xl font-semibold">Sending you to your recommendation</h2>
              <p className="mb-4 text-muted-foreground">
                Redirecting to {topRecommendation.peptide.name} and the strongest tracked vendor route.
              </p>
              <Button render={<Link href={`/peptides/${topRecommendation.peptide.slug}?fromQuiz=1`} />}>
                Continue now
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto w-full max-w-3xl">
          <Button variant="ghost" render={<Link href="/quiz" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to intake
          </Button>

          <Card className="mt-6">
            <CardContent className="space-y-4 pt-6">
              <h1 className="text-2xl font-semibold">No clear compound recommendation</h1>
              <p className="text-muted-foreground">
                Your current inputs are conservative enough that the planner did not keep a strong compound recommendation.
                That usually means your safety filters, delivery constraints, or risk tolerance are tighter than the current
                catalog supports.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
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
                <Button render={<Link href="/peptides" />}>Browse compounds manually</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
