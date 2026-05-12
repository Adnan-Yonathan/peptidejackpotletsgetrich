"use client";

import { useEffect, useMemo, useState } from "react";
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
  BUDGET_OPTIONS,
  COUNTRY_OPTIONS,
  DELIVERY_PREFERENCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  FEMALE_LIFE_STAGE_OPTIONS,
  HEALTH_CONDITION_OPTIONS,
  MALE_HORMONE_CONTEXT_OPTIONS,
  MEDICATION_OPTIONS,
  MONITORING_OPTIONS,
  PLANNER_STEPS,
  PLAN_STYLE_OPTIONS,
  PROBLEM_OPTIONS,
  REPRODUCTIVE_STATUS_OPTIONS,
  SEX_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "@/data/planner-options";
import { useQuizState } from "@/hooks/useQuizState";
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
  activityLevel: {
    title: "What is your current activity level?",
    subtitle: "Training output helps separate recovery, performance, and general wellness needs.",
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
    title: "Enter your email to unlock your personalized peptide stack",
    subtitle: "We will use this to connect your result to your saved experience later.",
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

export default function QuizPage() {
  const router = useRouter();
  const { currentStep, answers, setAnswer, goToStep } = useQuizState();
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [activeLoadingStep, setActiveLoadingStep] = useState(0);
  const visibleSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const stepName = visibleSteps[Math.min(currentStep, visibleSteps.length - 1)];
  const progress = ((Math.min(currentStep, visibleSteps.length - 1) + 1) / visibleSteps.length) * 100;

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
      case "activityLevel":
        return Boolean(answers.activityLevel);
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

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>
                Question {Math.min(currentStep, visibleSteps.length - 1) + 1} of {visibleSteps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {isGeneratingResults ? "Generating your personalized plan" : questionCopy.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isGeneratingResults
                  ? "The planner is compiling your answers into a stack recommendation."
                  : questionCopy.subtitle}
              </p>
            </CardHeader>

            <CardContent>
              {isGeneratingResults ? renderLoadingChecklist() : renderQuestion()}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isGeneratingResults}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed() || isGeneratingResults}>
              {isGeneratingResults
                ? "Analyzing your responses..."
                : currentStep >= visibleSteps.length - 1
                  ? "Generate My Program"
                  : "Next"}
              {isGeneratingResults ? (
                <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </main>
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
      case "activityLevel":
        return (
          <OptionGrid options={ACTIVITY_LEVEL_OPTIONS} value={answers.activityLevel} onSelect={(value) => setAnswer("activityLevel", value)} />
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
    <div className="grid gap-3 md:grid-cols-2">
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
    <div className="grid gap-3 md:grid-cols-2">
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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Optional. Select all that apply, or continue if none apply.</p>
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
      className={`rounded-lg border p-4 text-left transition-colors ${
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="font-medium">{title}</div>
      {description && (
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      )}
    </button>
  );
}
