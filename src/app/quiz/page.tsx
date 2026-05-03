"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  EXPERIENCE_OPTIONS,
  FEMALE_LIFE_STAGE_OPTIONS,
  MALE_HORMONE_CONTEXT_OPTIONS,
  PLANNER_STEPS,
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
  budget: {
    title: "What budget lane fits best?",
    subtitle: "This helps keep the recommendation practical.",
  },
  riskTolerance: {
    title: "What is your risk tolerance?",
    subtitle: "1 is very conservative. 5 is open to higher-risk research compounds.",
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
  const visibleSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const stepName = visibleSteps[Math.min(currentStep, visibleSteps.length - 1)];
  const progress = ((Math.min(currentStep, visibleSteps.length - 1) + 1) / visibleSteps.length) * 100;

  const toggleArrayValue = (
    key: "secondaryGoalIds",
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
      router.push("/quiz/results");
      return;
    }

    goToStep(currentStep + 1);
  };

  const handleBack = () => {
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
      case "budget":
        return Boolean(answers.budget);
      case "riskTolerance":
        return Boolean(answers.riskTolerance);
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
              <CardTitle className="text-2xl">{questionCopy.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{questionCopy.subtitle}</p>
            </CardHeader>

            <CardContent>{renderQuestion()}</CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep >= visibleSteps.length - 1 ? "Generate My Program" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
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
      case "budget":
        return (
          <OptionGrid options={BUDGET_OPTIONS} value={answers.budget} onSelect={(value) => setAnswer("budget", value)} />
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

function OptionButton({
  selected,
  disabled,
  title,
  onClick,
}: {
  selected: boolean;
  disabled?: boolean;
  title: string;
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
    </button>
  );
}
