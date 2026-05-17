"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { GOALS } from "@/data/goals";
import {
  ACTIVITY_LEVEL_OPTIONS,
  AGE_RANGE_OPTIONS,
  BODY_COMPOSITION_GOAL_OPTIONS,
  BUDGET_OPTIONS,
  COUNTRY_OPTIONS,
  DELIVERY_PREFERENCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  FEMALE_LIFE_STAGE_OPTIONS,
  HEALTH_CONDITION_OPTIONS,
  INJURY_STATUS_OPTIONS,
  MALE_HORMONE_CONTEXT_OPTIONS,
  MEDICATION_OPTIONS,
  MONITORING_OPTIONS,
  PLANNER_STEPS,
  PLAN_STYLE_OPTIONS,
  PROBLEM_OPTIONS,
  REPRODUCTIVE_STATUS_OPTIONS,
  ROUTINE_OPTIONS,
  SEX_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "@/data/planner-options";
import { useQuizState } from "@/hooks/useQuizState";
import { trackRevenueEvent } from "@/lib/revenue/client";
import type { PlannerAnswers, PlannerStep } from "@/types/planner";

const QUESTION_COPY: Record<PlannerStep, { title: string; subtitle: string }> = {
  country: {
    title: "What is your name?",
    subtitle: "This helps personalize your quiz results.",
  },
  ageRange: {
    title: "What is your age range?",
    subtitle: "Age changes the planner's risk threshold and monitoring assumptions.",
  },
  sex: {
    title: "What sex should the planner use for safety logic?",
    subtitle: "This applies sex-specific evidence, approval boundaries, and reproductive cautions where relevant.",
  },
  bodyMetrics: {
    title: "What are your height and weight?",
    subtitle: "Approximate body metrics help the planner choose a more realistic intensity lane and protocol context.",
  },
  activityLevel: {
    title: "What is your current activity level?",
    subtitle: "Training output helps separate recovery, performance, and general wellness needs.",
  },
  bodyCompositionGoal: {
    title: "What body-composition direction fits you best?",
    subtitle: "This helps distinguish metabolic, recomp, muscle, and maintenance-focused protocol logic.",
  },
  injuryStatus: {
    title: "Any injury or recovery context right now?",
    subtitle: "Recovery context changes how strongly the planner weighs tissue-repair and monitoring tradeoffs.",
  },
  topProblems: {
    title: "What problems are you trying to fix first?",
    subtitle: "Pick up to three. This helps route overlapping goals like focus, sleep, recovery, and stress.",
  },
  experience: {
    title: "How experienced are you with peptide research?",
    subtitle: "This helps control how complex the final stack can be.",
  },
  primaryGoalId: {
    title: "What is your primary goal?",
    subtitle: "This drives the core direction of your recommended stack.",
  },
  secondaryGoalIds: {
    title: "Do you have any secondary goals?",
    subtitle: "Optional. Pick up to two supporting outcomes.",
  },
  reproductiveStatus: {
    title: "What reproductive status applies?",
    subtitle: "This is a hard safety gate for pregnancy, breastfeeding, and fertility-sensitive planning.",
  },
  femaleLifeStage: {
    title: "What female life stage applies?",
    subtitle: "This adds context around perimenopause, postmenopause, bone health, and hormone tradeoffs.",
  },
  maleHormoneContext: {
    title: "What male hormone or prostate context applies?",
    subtitle: "This helps avoid casual layering of GH-axis or growth-signaling compounds.",
  },
  healthConditions: {
    title: "Any health context we should account for?",
    subtitle: "Optional, but important. These answers tighten safety filters and monitoring notes.",
  },
  medications: {
    title: "Any medication context we should account for?",
    subtitle: "Optional. Medication classes can change which compounds deserve caution or exclusion.",
  },
  budget: {
    title: "What budget lane fits best?",
    subtitle: "This helps keep the recommendation practical.",
  },
  deliveryPreference: {
    title: "What delivery route fits your comfort level?",
    subtitle: "This helps avoid recommendations that look good on paper but are unrealistic for you.",
  },
  routineConsistency: {
    title: "How consistent can your routine be?",
    subtitle: "Adherence changes whether the planner should favor lower-friction or more detailed protocols.",
  },
  monitoringWillingness: {
    title: "How much tracking are you willing to do?",
    subtitle: "Some protocols need more symptom, lab, or progress monitoring than others.",
  },
  riskTolerance: {
    title: "What is your risk tolerance?",
    subtitle: "1 is very conservative. 5 is open to higher-risk research compounds.",
  },
  planStyle: {
    title: "What style of plan do you want?",
    subtitle: "This separates safety appetite from execution style.",
  },
  timeframe: {
    title: "What timeline are you working with?",
    subtitle: "This shapes whether the stack should be short-term, focused, or longer-horizon.",
  },
  email: {
    title: "Where should we save your protocol access details?",
    subtitle: "No account required. This keeps your quiz result, checkout, and protocol access connected.",
  },
};

const RESULT_LOADING_STEPS = [
  "Securing your quiz responses",
  "Reviewing your goal and risk profile",
  "Matching compounds to your target outcome",
  "Checking stack fit and compatibility",
  "Building your personalized plan",
] as const;

function getVisibleSteps(answers: Partial<PlannerAnswers>) {
  return PLANNER_STEPS.filter((step) => {
    if (step === "femaleLifeStage") return answers.sex === "female";
    if (step === "maleHormoneContext") return answers.sex === "male";
    return true;
  });
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function hasValidBodyMetrics(answers: Partial<PlannerAnswers>) {
  const feet = answers.heightFeet;
  const inches = answers.heightInches;
  const weight = answers.weightLbs;

  return (
    typeof feet === "number" &&
    feet >= 3 &&
    feet <= 8 &&
    typeof inches === "number" &&
    inches >= 0 &&
    inches <= 11 &&
    typeof weight === "number" &&
    weight >= 70 &&
    weight <= 500
  );
}

export default function QuizPage() {
  const router = useRouter();
  const { currentStep, answers, setAnswer, goToStep } = useQuizState();
  const hasTrackedStart = useRef(false);
  const hasTrackedCompletion = useRef(false);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [activeLoadingStep, setActiveLoadingStep] = useState(0);
  const visibleSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const stepName = visibleSteps[Math.min(currentStep, visibleSteps.length - 1)];
  const progress = ((Math.min(currentStep, visibleSteps.length - 1) + 1) / visibleSteps.length) * 100;

  useEffect(() => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackRevenueEvent({
      eventType: "quiz_started",
      sourcePage: "/quiz",
      sourceType: "quiz",
    });
  }, []);

  useEffect(() => {
    if (!isGeneratingResults) return;

    if (activeLoadingStep >= RESULT_LOADING_STEPS.length) {
      const completeTimer = window.setTimeout(() => {
        router.push("/quiz/results");
      }, 450);

      return () => window.clearTimeout(completeTimer);
    }

    const stepTimer = window.setTimeout(() => {
      setActiveLoadingStep((current) => current + 1);
    }, activeLoadingStep === 0 ? 700 : 850);

    return () => window.clearTimeout(stepTimer);
  }, [activeLoadingStep, isGeneratingResults, router]);

  const toggleArrayValue = (
    key: "secondaryGoalIds" | "topProblems" | "healthConditions" | "medications",
    value: string,
    max?: number
  ) => {
    const current = answers[key] ?? [];
    const selected = current.includes(value);
    if (!selected && max && current.length >= max) return;
    setAnswer(
      key,
      selected ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const handleNext = () => {
    if (currentStep >= visibleSteps.length - 1) {
      if (!hasTrackedCompletion.current) {
        hasTrackedCompletion.current = true;
        trackRevenueEvent({
          eventType: "quiz_completed",
          sourcePage: "/quiz",
          sourceType: "quiz",
          goalId: answers.primaryGoalId,
          metadata: {
            budget: answers.budget,
            bodyCompositionGoal: answers.bodyCompositionGoal,
            experience: answers.experience,
            heightFeet: answers.heightFeet,
            heightInches: answers.heightInches,
            injuryStatus: answers.injuryStatus,
            riskTolerance: answers.riskTolerance,
            timeframe: answers.timeframe,
            weightLbs: answers.weightLbs,
          },
        });
      }
      setActiveLoadingStep(0);
      setIsGeneratingResults(true);
      return;
    }

    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    if (isGeneratingResults) return;
    goToStep(Math.max(currentStep - 1, 0));
  };

  const canProceed = (): boolean => {
    switch (stepName) {
      case "country":
        return Boolean(answers.country && answers.name?.trim());
      case "ageRange":
        return Boolean(answers.ageRange);
      case "sex":
        return Boolean(answers.sex);
      case "bodyMetrics":
        return hasValidBodyMetrics(answers);
      case "activityLevel":
        return Boolean(answers.activityLevel);
      case "bodyCompositionGoal":
        return Boolean(answers.bodyCompositionGoal);
      case "injuryStatus":
        return Boolean(answers.injuryStatus);
      case "topProblems":
        return (answers.topProblems?.length ?? 0) > 0;
      case "experience":
        return Boolean(answers.experience);
      case "primaryGoalId":
        return Boolean(answers.primaryGoalId);
      case "reproductiveStatus":
        return Boolean(answers.reproductiveStatus);
      case "femaleLifeStage":
        return Boolean(answers.femaleLifeStage);
      case "maleHormoneContext":
        return Boolean(answers.maleHormoneContext);
      case "healthConditions":
        return true;
      case "medications":
        return true;
      case "budget":
        return Boolean(answers.budget);
      case "deliveryPreference":
        return Boolean(answers.deliveryPreference);
      case "routineConsistency":
        return Boolean(answers.routineConsistency);
      case "monitoringWillingness":
        return Boolean(answers.monitoringWillingness);
      case "riskTolerance":
        return Boolean(answers.riskTolerance);
      case "planStyle":
        return Boolean(answers.planStyle);
      case "timeframe":
        return Boolean(answers.timeframe);
      case "email":
        return Boolean(answers.email?.trim().includes("@"));
      case "secondaryGoalIds":
        return true;
      default:
        return false;
    }
  };

  const questionCopy = QUESTION_COPY[stepName];
  const isLastStep = currentStep >= visibleSteps.length - 1;
  const nextLabel = isGeneratingResults
    ? "Analyzing your responses..."
    : isLastStep
      ? "Generate My Program"
      : "Next";

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#fbfaf7] px-4 pb-28 pt-5 sm:pb-12 sm:pt-10 md:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-4 rounded-[1rem] border border-[#103b2c]/10 bg-white px-4 py-3 shadow-sm sm:mb-5 sm:px-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
              2-minute planner
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#103b2c]/70 sm:text-sm">
              Get your peptide research stack, vendor options, and protocol preview matched to
              your body, health profile, goals, and timeline.
            </p>
          </div>
          <div className="mb-4 sm:mb-8">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground sm:text-sm">
              <span>
                Question {Math.min(currentStep, visibleSteps.length - 1) + 1} of {visibleSteps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="overflow-hidden border-stone-200 bg-white/95 shadow-[0_18px_55px_-42px_rgba(16,59,44,0.5)]">
            <CardHeader className="space-y-2 px-4 py-5 sm:px-6 sm:py-6">
              <CardTitle className="text-[22px] leading-tight sm:text-2xl">
                {isGeneratingResults ? "Generating your personalized plan" : questionCopy.title}
              </CardTitle>
              <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                {isGeneratingResults
                  ? "The planner is compiling your answers into a stack recommendation."
                  : questionCopy.subtitle}
              </p>
            </CardHeader>

            <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
              <QuizRevenueCue stepName={stepName} answers={answers} />
              {isGeneratingResults ? renderLoadingChecklist() : renderQuestion()}
            </CardContent>
          </Card>

          <div className="mt-6 hidden justify-between sm:flex">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isGeneratingResults}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed() || isGeneratingResults}>
              {nextLabel}
              {isGeneratingResults ? (
                <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#103b2c]/10 bg-[#fbfaf7]/95 px-4 py-3 shadow-[0_-18px_45px_-35px_rgba(16,59,44,0.7)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            disabled={currentStep === 0 || isGeneratingResults}
            className="h-12 w-12 shrink-0 rounded-xl px-0"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed() || isGeneratingResults}
            className="h-12 flex-1 rounded-xl bg-[#103b2c] text-[15px] font-extrabold text-white hover:bg-[#0c3226]"
          >
            {nextLabel}
            {isGeneratingResults ? (
              <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );

  function renderQuestion() {
    switch (stepName) {
      case "country":
        return (
          <div className="space-y-6">
            <div>
              <Input
                id="quiz-name"
                value={answers.name ?? ""}
                onChange={(event) => setAnswer("name", event.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">What is your country?</p>
              <OptionGrid options={COUNTRY_OPTIONS} value={answers.country} onSelect={(value) => setAnswer("country", value)} />
            </div>
          </div>
        );
      case "ageRange":
        return (
          <OptionGrid options={AGE_RANGE_OPTIONS} value={answers.ageRange} onSelect={(value) => setAnswer("ageRange", value)} />
        );
      case "sex":
        return (
          <OptionGrid
            options={SEX_OPTIONS}
            value={answers.sex}
            onSelect={(value) => {
              setAnswer("sex", value);
              if (value === "female") {
                setAnswer(
                  "femaleLifeStage",
                  answers.femaleLifeStage && answers.femaleLifeStage !== "not_applicable"
                    ? answers.femaleLifeStage
                    : "cycling_or_unclear"
                );
                setAnswer("maleHormoneContext", "not_applicable");
              } else if (value === "male") {
                setAnswer(
                  "maleHormoneContext",
                  answers.maleHormoneContext && answers.maleHormoneContext !== "not_applicable"
                    ? answers.maleHormoneContext
                    : "none_known"
                );
                setAnswer("femaleLifeStage", "not_applicable");
              } else {
                setAnswer("femaleLifeStage", "not_applicable");
                setAnswer("maleHormoneContext", "not_applicable");
              }
            }}
          />
        );
      case "bodyMetrics":
        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.25fr]">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#103b2c]">Height feet</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={3}
                  max={8}
                  value={answers.heightFeet ?? ""}
                  onChange={(event) => setAnswer("heightFeet", parseOptionalNumber(event.target.value))}
                  placeholder="5"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#103b2c]">Height inches</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={11}
                  value={answers.heightInches ?? 0}
                  onChange={(event) => setAnswer("heightInches", parseOptionalNumber(event.target.value))}
                  placeholder="10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#103b2c]">Weight pounds</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={70}
                  max={500}
                  value={answers.weightLbs ?? ""}
                  onChange={(event) => setAnswer("weightLbs", parseOptionalNumber(event.target.value))}
                  placeholder="180"
                />
              </label>
            </div>
            <p className="rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] px-3 py-2 text-xs leading-relaxed text-[#103b2c]/70">
              These are used for personalization context only, not to calculate a prescribed dose.
            </p>
          </div>
        );
      case "activityLevel":
        return (
          <OptionGrid options={ACTIVITY_LEVEL_OPTIONS} value={answers.activityLevel} onSelect={(value) => setAnswer("activityLevel", value)} />
        );
      case "bodyCompositionGoal":
        return (
          <OptionGrid
            options={BODY_COMPOSITION_GOAL_OPTIONS}
            value={answers.bodyCompositionGoal}
            onSelect={(value) => setAnswer("bodyCompositionGoal", value)}
          />
        );
      case "injuryStatus":
        return (
          <OptionGrid
            options={INJURY_STATUS_OPTIONS}
            value={answers.injuryStatus}
            onSelect={(value) => setAnswer("injuryStatus", value)}
          />
        );
      case "topProblems":
        return (
          <MultiSelectGrid
            options={PROBLEM_OPTIONS}
            selectedValues={answers.topProblems ?? []}
            onToggle={(value) => toggleArrayValue("topProblems", value, 3)}
            max={3}
          />
        );
      case "experience":
        return (
          <OptionGrid options={EXPERIENCE_OPTIONS} value={answers.experience} onSelect={(value) => setAnswer("experience", value)} />
        );
      case "primaryGoalId":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            {GOALS.map((goal) => (
              <OptionButton
                key={goal.id}
                selected={answers.primaryGoalId === goal.id}
                title={goal.displayName}
                onClick={() => setAnswer("primaryGoalId", goal.id)}
              />
            ))}
          </div>
        );
      case "secondaryGoalIds":
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Optional. Pick up to two.</p>
            <div className="flex flex-wrap gap-2">
            {GOALS.filter((goal) => goal.id !== answers.primaryGoalId).map((goal) => {
              const selected = (answers.secondaryGoalIds ?? []).includes(goal.id);
              const disabled = !selected && (answers.secondaryGoalIds?.length ?? 0) >= 2;

              return (
                <Badge
                  key={goal.id}
                  variant={selected ? "default" : "outline"}
                  className={`h-auto cursor-pointer px-3 py-2 text-sm ${disabled ? "opacity-50" : ""}`}
                  onClick={() => {
                    if (disabled) return;
                    toggleArrayValue("secondaryGoalIds", goal.id, 2);
                  }}
                >
                  {goal.displayName}
                </Badge>
              );
            })}
            </div>
          </div>
        );
      case "reproductiveStatus":
        return (
          <OptionGrid
            options={REPRODUCTIVE_STATUS_OPTIONS}
            value={answers.reproductiveStatus}
            onSelect={(value) => setAnswer("reproductiveStatus", value)}
          />
        );
      case "femaleLifeStage":
        return (
          <OptionGrid
            options={FEMALE_LIFE_STAGE_OPTIONS}
            value={answers.femaleLifeStage}
            onSelect={(value) => setAnswer("femaleLifeStage", value)}
          />
        );
      case "maleHormoneContext":
        return (
          <OptionGrid
            options={MALE_HORMONE_CONTEXT_OPTIONS}
            value={answers.maleHormoneContext}
            onSelect={(value) => setAnswer("maleHormoneContext", value)}
          />
        );
      case "healthConditions":
        return (
          <OptionalMultiSelectGrid
            options={HEALTH_CONDITION_OPTIONS}
            selectedValues={answers.healthConditions ?? []}
            onToggle={(value) => toggleArrayValue("healthConditions", value)}
          />
        );
      case "medications":
        return (
          <OptionalMultiSelectGrid
            options={MEDICATION_OPTIONS}
            selectedValues={answers.medications ?? []}
            onToggle={(value) => toggleArrayValue("medications", value)}
          />
        );
      case "budget":
        return (
          <OptionGrid options={BUDGET_OPTIONS} value={answers.budget} onSelect={(value) => setAnswer("budget", value)} />
        );
      case "deliveryPreference":
        return (
          <OptionGrid
            options={DELIVERY_PREFERENCE_OPTIONS}
            value={answers.deliveryPreference}
            onSelect={(value) => setAnswer("deliveryPreference", value)}
          />
        );
      case "routineConsistency":
        return (
          <OptionGrid
            options={ROUTINE_OPTIONS}
            value={answers.routineConsistency}
            onSelect={(value) => setAnswer("routineConsistency", value)}
          />
        );
      case "monitoringWillingness":
        return (
          <OptionGrid
            options={MONITORING_OPTIONS}
            value={answers.monitoringWillingness}
            onSelect={(value) => setAnswer("monitoringWillingness", value)}
          />
        );
      case "riskTolerance":
        return (
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setAnswer("riskTolerance", level as 1 | 2 | 3 | 4 | 5)}
                className={`rounded-lg border p-4 text-center font-bold transition-colors ${
                  answers.riskTolerance === level
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        );
      case "planStyle":
        return (
          <OptionGrid
            options={PLAN_STYLE_OPTIONS}
            value={answers.planStyle}
            onSelect={(value) => setAnswer("planStyle", value)}
          />
        );
      case "timeframe":
        return (
          <OptionGrid options={TIMEFRAME_OPTIONS} value={answers.timeframe} onSelect={(value) => setAnswer("timeframe", value)} />
        );
      case "email":
        return (
          <Input
            type="email"
            value={answers.email ?? ""}
            onChange={(event) => setAnswer("email", event.target.value)}
            placeholder="Enter your email"
          />
        );
      default:
        return null;
    }
  }

  function renderLoadingChecklist() {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
          <div className="mb-3 flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin text-[#0f6a52]" />
            <p className="text-sm font-medium text-[#103b2c]">
              This usually takes just a few seconds.
            </p>
          </div>
          <div className="space-y-3">
            {RESULT_LOADING_STEPS.map((item, index) => {
              const isComplete = index < activeLoadingStep;
              const isActive = index === activeLoadingStep && activeLoadingStep < RESULT_LOADING_STEPS.length;

              return (
                <div
                  key={item}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors ${
                    isComplete
                      ? "border-emerald-200 bg-emerald-50"
                      : isActive
                        ? "border-[#0f6a52]/20 bg-white"
                        : "border-stone-200 bg-white/70"
                  }`}
                >
                  {isComplete ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                  ) : isActive ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0f6a52]/10">
                      <LoaderCircle className="h-4 w-4 animate-spin text-[#0f6a52]" />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white">
                      <div className="h-2 w-2 rounded-full bg-stone-300" />
                    </div>
                  )}
                  <span
                    className={`text-sm ${
                      isComplete || isActive ? "text-[#103b2c]" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function OptionGrid<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: Array<{ value: T; label: string; description: string }>;
  value?: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2">
      {options.map((option) => (
        <OptionButton
          key={option.value}
          selected={value === option.value}
          title={option.label}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </div>
  );
}

function QuizRevenueCue({
  stepName,
  answers,
}: {
  stepName: PlannerStep;
  answers: Partial<PlannerAnswers>;
}) {
  const cue =
    stepName === "primaryGoalId"
      ? "Your protocol preview will be built around the goal you choose here."
      : stepName === "budget"
        ? "Vendor options and protocol recommendations will stay inside this budget lane."
        : stepName === "email"
          ? "Your free stack preview comes next. No account is required to view results or checkout."
          : null;

  if (!cue) return null;

  return (
    <div className="mb-4 rounded-xl border border-[#0f6a52]/15 bg-[#e7f4ee] px-3.5 py-3 text-[12.5px] font-medium leading-relaxed text-[#103b2c]">
      {cue}
      {answers.primaryGoalId && stepName === "budget" ? (
        <span className="block pt-1 text-[#103b2c]/65">
          Goal selected. Now we are narrowing the plan by cost and sourcing fit.
        </span>
      ) : null}
    </div>
  );
}

function MultiSelectGrid({
  options,
  selectedValues,
  onToggle,
  max,
}: {
  options: Array<{ id: string; label: string; description: string }>;
  selectedValues: string[];
  onToggle: (value: string) => void;
  max?: number;
}) {
  return (
    <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2">
      {options.map((option) => {
        const selected = selectedValues.includes(option.id);
        const disabled = !selected && typeof max === "number" && selectedValues.length >= max;

        return (
          <OptionButton
            key={option.id}
            selected={selected}
            disabled={disabled}
            title={option.label}
            description={option.description}
            onClick={() => {
              if (!disabled) onToggle(option.id);
            }}
          />
        );
      })}
    </div>
  );
}

function OptionalMultiSelectGrid({
  options,
  selectedValues,
  onToggle,
}: {
  options: Array<{ id: string; label: string; description: string }>;
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <p className="text-[13px] text-muted-foreground sm:text-sm">Optional. Select all that apply, or continue if none apply.</p>
      <MultiSelectGrid options={options} selectedValues={selectedValues} onToggle={onToggle} />
    </div>
  );
}

function OptionButton({
  selected,
  disabled,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  disabled?: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border p-3 text-left transition-colors sm:p-4 ${
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="text-sm font-medium leading-snug sm:text-base">{title}</div>
      {description && (
        <p className="mt-1 text-[12.5px] leading-5 text-muted-foreground sm:text-sm">{description}</p>
      )}
    </button>
  );
}
