"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Layers,
  RotateCcw,
  Sprout,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizState } from "@/hooks/useQuizState";
import {
  formatCostRange,
  formatUsageModelLabel,
  getPeptideCostEstimate,
} from "@/lib/costs";
import { buildOutboundVendorHref, getRegionalVendorOptionsForPeptide } from "@/lib/outbound-vendors";
import { generatePlannerResult } from "@/lib/planner-engine";
import { getShopperRegion } from "@/lib/shopper-country";
import type { PlannerAnswers, PlannerRecommendation } from "@/types/planner";

const ROLE_LABELS: Record<PlannerRecommendation["role"], string> = {
  foundation: "Foundation",
  "goal-driver": "Goal driver",
  adjunct: "Adjunct",
};

const RISK_TONE: Record<string, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  "med-high": "border-orange-200 bg-orange-50 text-orange-700",
  high: "border-red-200 bg-red-50 text-red-700",
  extreme: "border-red-300 bg-red-100 text-red-800",
};

const PLANNER_DEFAULTS: Partial<PlannerAnswers> = {
  secondaryGoalIds: [],
  topProblems: [],
  healthConditions: [],
  medications: [],
  reproductiveStatus: "none",
  femaleLifeStage: "not_applicable",
  maleHormoneContext: "not_applicable",
  notes: "",
  deliveryPreference: "flexible",
  stackingPreference: "basic_stack",
  routineConsistency: "medium",
  monitoringWillingness: "basic",
  planStyle: "balanced",
};

const SECTION_CARD =
  "rounded-xl border border-stone-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]";

function getPreferredQuizVendor(recommendation: PlannerRecommendation, answers: PlannerAnswers) {
  const options = getRegionalVendorOptionsForPeptide(recommendation.peptide.id);
  const region = getShopperRegion(answers.country);
  return region === "us" ? options.us ?? options.international : options.international ?? options.us;
}

function getBenefitSummary(recommendation: PlannerRecommendation) {
  return recommendation.rationale[0] ?? recommendation.peptide.shortDescription;
}

function SidebarStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md bg-stone-50 border border-stone-100 p-2.5 text-center">
      <div className="text-base font-bold text-[color:var(--primary)] leading-none">{value}</div>
      <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function SidebarNavLink({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: typeof Sprout;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
        active
          ? "bg-[color:var(--primary)]/10 text-[color:var(--primary)] font-semibold"
          : "text-muted-foreground hover:bg-stone-100 hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

function RecommendationCard({
  recommendation,
  answers,
  position,
}: {
  recommendation: PlannerRecommendation;
  answers: PlannerAnswers;
  position: number;
}) {
  const preferredVendor = getPreferredQuizVendor(recommendation, answers);
  const estimate = getPeptideCostEstimate(recommendation.peptide.id, {
    shopperCountry: answers.country,
    outputCurrency: "USD",
  });
  const vendorName = preferredVendor?.vendor?.name ?? preferredVendor?.listing.vendorName;
  const vendorSlug = preferredVendor?.vendor?.slug ?? preferredVendor?.listing.vendorId;
  const outboundHref = vendorSlug
    ? buildOutboundVendorHref(vendorSlug, recommendation.peptide.slug, "quiz-results")
    : null;

  return (
    <div className={SECTION_CARD}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">#{position}</Badge>
            <Badge variant="outline">{ROLE_LABELS[recommendation.role]}</Badge>
            <Badge
              variant="outline"
              className={
                RISK_TONE[recommendation.peptide.riskLevel] ??
                "border-slate-200 bg-slate-50 text-slate-700"
              }
            >
              {recommendation.peptide.riskLevel} risk
            </Badge>
            <Badge variant="outline">Tier {recommendation.peptide.evidenceTier}</Badge>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {recommendation.peptide.name}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {recommendation.peptide.shortDescription}
          </p>
        </div>
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)] sm:flex">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/5 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)]">
          Why this fits you
        </p>
        <p className="mt-1.5 text-sm leading-6 text-foreground/80">
          {getBenefitSummary(recommendation)}
        </p>
        {recommendation.rationale.length > 1 && (
          <div className="mt-2.5 space-y-1.5">
            {recommendation.rationale.slice(1, 4).map((reason) => (
              <div key={reason} className="flex gap-2 text-sm leading-5 text-foreground/70">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md bg-stone-50 border border-stone-100 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--primary)]">
            Evidence
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            Tier {recommendation.peptide.evidenceTier}
          </p>
        </div>
        <div className="rounded-md bg-stone-50 border border-stone-100 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--primary)]">
            Monthly cost
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {estimate
              ? `${formatCostRange(estimate.monthlyCostLow, estimate.monthlyCostHigh, "USD")}/mo`
              : "No estimate"}
          </p>
        </div>
        <div className="rounded-md bg-stone-50 border border-stone-100 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--primary)]">
            Protocol style
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {estimate ? formatUsageModelLabel(estimate.usageModel) : "Varies"}
          </p>
        </div>
      </div>

      {recommendation.cautions.length > 0 && (
        <div className="mt-4 rounded-lg border-l-[3px] border-l-amber-500 bg-amber-50/60 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            Cautions to consider
          </p>
          <div className="mt-1.5 space-y-1 text-sm leading-5 text-amber-900/80">
            {recommendation.cautions.slice(0, 3).map((caution) => (
              <p key={caution}>{caution}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {outboundHref ? (
          <Button
            size="sm"
            render={<a href={outboundHref} target="_blank" rel="noreferrer" />}
          >
            View at {vendorName}
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button disabled size="sm">
            No affiliate source linked yet
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          render={
            <Link
              href={`/peptides/${recommendation.peptide.slug}?fromQuiz=1&country=${answers.country}`}
            />
          }
        >
          Learn more
        </Button>
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  const router = useRouter();
  const { answers, isComplete, reset } = useQuizState();

  if (!isComplete()) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <h2 className="mb-2 text-xl font-semibold">Quiz not completed</h2>
              <p className="mb-4 text-muted-foreground">
                Complete the intake first so the planner has enough context to recommend a stack.
              </p>
              <Button render={<Link href="/quiz" />}>Start intake</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const completedAnswers = { ...PLANNER_DEFAULTS, ...answers } as PlannerAnswers;
  const plan = generatePlannerResult(completedAnswers);
  const recommendedStack = plan.primary;

  if (recommendedStack.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 px-4 py-12">
          <div className="mx-auto w-full max-w-3xl">
            <Button variant="ghost" render={<Link href="/quiz" />}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to intake
            </Button>

            <Card className="mt-6">
              <CardContent className="space-y-4 pt-6">
                <h1 className="text-2xl font-semibold">No clear stack recommendation</h1>
                <p className="text-muted-foreground">
                  Your current inputs are conservative enough that the planner did not keep a strong
                  stack recommendation. That usually means your safety filters, delivery constraints,
                  or risk tolerance are tighter than the current catalog supports.
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

  const safetyCount = plan.compatibilityWarnings.length + plan.safetyNotes.length;
  const phaseCount = plan.programPhases.length;
  const altCount = plan.alternatives.length;

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="border-b border-stone-200 bg-white lg:border-b-0 lg:border-r lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <div className="px-5 py-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Your plan
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#103b2c]">
                {plan.planHeadline}
              </h1>
              <div className="mt-2.5 flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-[10px]">
                  {recommendedStack.length} compound{recommendedStack.length === 1 ? "" : "s"}
                </Badge>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground line-clamp-4">
                {plan.profileSummary}
              </p>

              {/* Mini stats */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <SidebarStat value={String(recommendedStack.length)} label="Stack" />
                <SidebarStat value={String(phaseCount)} label="Phases" />
                <SidebarStat value={String(safetyCount)} label="Cautions" />
                <SidebarStat value={String(altCount)} label="Alts" />
              </div>

              <hr className="my-5 border-dashed border-stone-200" />

              {/* Section nav */}
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
                Sections
              </div>
              <nav className="flex flex-col gap-0.5">
                <SidebarNavLink href="#stack" icon={Layers} label="Recommended stack" active />
                <SidebarNavLink href="#phases" icon={Clock3} label="Program phases" />
                <SidebarNavLink href="#safety" icon={AlertTriangle} label="Safety notes" />
                {altCount > 0 && (
                  <SidebarNavLink href="#alternatives" icon={Sprout} label="Alternatives" />
                )}
              </nav>

              <hr className="my-5 border-dashed border-stone-200" />

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full"
                  render={<Link href="/peptides" />}
                >
                  Browse compounds
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    reset();
                    router.push("/quiz");
                  }}
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Retake quiz
                </Button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
              {/* Breadcrumb */}
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <Link href="/quiz" className="hover:text-foreground transition-colors">
                  ← Quiz
                </Link>
                <span className="mx-2 text-stone-300">/</span>
                <span className="text-foreground">Your results</span>
              </div>

              {/* Safety flags row */}
              {plan.compatibilityWarnings.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {plan.compatibilityWarnings.slice(0, 2).map((warning) => (
                    <div
                      key={warning}
                      className="flex items-start gap-3 rounded-md border-l-[3px] border-l-amber-500 bg-amber-50/60 p-3"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Stack caution</p>
                        <p className="mt-0.5 text-xs text-amber-900/75">{warning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stack */}
              <div id="stack" className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--primary)]/15">
                    <Layers className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Recommended stack</h2>
                </div>
                {recommendedStack.map((recommendation, index) => (
                  <RecommendationCard
                    key={recommendation.peptide.id}
                    recommendation={recommendation}
                    answers={completedAnswers}
                    position={index + 1}
                  />
                ))}
              </div>

              {/* Program phases */}
              <div id="phases" className={SECTION_CARD}>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--primary)]/15">
                    <Clock3 className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    How to think about the plan
                  </h2>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {plan.programPhases.map((phase) => (
                    <div
                      key={phase.title}
                      className="rounded-md bg-stone-50 border border-stone-100 p-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)]">
                        {phase.title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-foreground/80">
                        {phase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety notes */}
              <div id="safety" className={SECTION_CARD}>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Safety notes</h2>
                </div>
                {[...plan.compatibilityWarnings, ...plan.safetyNotes].length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[...plan.compatibilityWarnings, ...plan.safetyNotes]
                      .slice(0, 6)
                      .map((note) => (
                        <div
                          key={note}
                          className="rounded-md border-l-[3px] border-l-amber-500 bg-amber-50/60 p-3 text-sm leading-5 text-amber-900"
                        >
                          {note}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    No major stack-level compatibility warning was generated from your quiz
                    answers.
                  </p>
                )}
              </div>

              {/* Alternatives */}
              {plan.alternatives.length > 0 && (
                <div id="alternatives" className={SECTION_CARD}>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--primary)]/15">
                      <Sprout className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Alternatives worth comparing
                    </h2>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {plan.alternatives.slice(0, 4).map((recommendation) => (
                      <Link
                        key={recommendation.peptide.id}
                        href={`/peptides/${recommendation.peptide.slug}?fromQuiz=1&country=${completedAnswers.country}`}
                        className="rounded-md border border-stone-200 bg-white p-3 transition-colors hover:border-[color:var(--primary)]/40 hover:bg-[color:var(--primary)]/[0.03]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {recommendation.peptide.name}
                          </p>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {ROLE_LABELS[recommendation.role]}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-muted-foreground line-clamp-2">
                          {getBenefitSummary(recommendation)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
