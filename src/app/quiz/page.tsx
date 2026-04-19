"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { GOALS } from "@/data/goals";
import {
  ACTIVITY_LEVEL_OPTIONS,
  AGE_RANGE_OPTIONS,
  BUDGET_OPTIONS,
  DELIVERY_PREFERENCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  FEMALE_LIFE_STAGE_OPTIONS,
  HEALTH_CONDITION_OPTIONS,
  MALE_HORMONE_CONTEXT_OPTIONS,
  MEDICATION_OPTIONS,
  MONITORING_OPTIONS,
  PLAN_STYLE_OPTIONS,
  PLANNER_STEPS,
  PROBLEM_OPTIONS,
  REPRODUCTIVE_STATUS_OPTIONS,
  ROUTINE_OPTIONS,
  SEX_OPTIONS,
  STACKING_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "@/data/planner-options";
import { useQuizState } from "@/hooks/useQuizState";
import { generatePlannerResult } from "@/lib/planner-engine";

export default function QuizPage() {
  const router = useRouter();
  const { currentStep, answers, setAnswer, nextStep, prevStep } = useQuizState();
  const stepName = PLANNER_STEPS[currentStep];
  const progress = ((currentStep + 1) / PLANNER_STEPS.length) * 100;

  const toggleArrayValue = (
    key: "secondaryGoalIds" | "topProblems" | "healthConditions" | "medications",
    value: string
  ) => {
    const current = answers[key] ?? [];
    setAnswer(
      key,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handleNext = () => {
    if (currentStep === PLANNER_STEPS.length - 1) {
      const plan = generatePlannerResult(answers as Parameters<typeof generatePlannerResult>[0]);
      const topRecommendation = plan.primary[0] ?? plan.alternatives[0];

      if (topRecommendation) {
        router.push(`/peptides/${topRecommendation.peptide.slug}?fromQuiz=1`);
        return;
      }

      router.push("/quiz/results");
      return;
    }

    nextStep();
  };

  const canProceed = (): boolean => {
    switch (stepName) {
      case "identity":
        return !!(
          answers.ageRange &&
          answers.sex &&
          answers.activityLevel &&
          answers.experience
        );
      case "goals":
        return !!(
          answers.primaryGoalId &&
          answers.topProblems &&
          answers.topProblems.length > 0
        );
      case "health":
        return !!(
          answers.healthConditions &&
          answers.medications &&
          answers.reproductiveStatus &&
          (answers.sex !== "female" || answers.femaleLifeStage) &&
          (answers.sex !== "male" || answers.maleHormoneContext)
        );
      case "constraints":
        return !!(
          answers.budget &&
          answers.riskTolerance &&
          answers.timeframe &&
          answers.deliveryPreference
        );
      case "style":
        return !!(
          answers.stackingPreference &&
          answers.routineConsistency &&
          answers.monitoringWillingness &&
          answers.planStyle
        );
      default:
        return false;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {PLANNER_STEPS.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {stepName === "identity" && "Who are you?"}
                {stepName === "goals" && "What are you trying to solve?"}
                {stepName === "health" && "What health context matters?"}
                {stepName === "constraints" && "What are your constraints?"}
                {stepName === "style" && "What kind of program fits you?"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {stepName === "identity" &&
                  "Set your baseline so the planner can weigh age, sex, training profile, and the safety rules that come with them."}
                {stepName === "goals" &&
                  "Pick a primary objective and the actual problems you want the program to address."}
                {stepName === "health" &&
                  "Flag medical context, reproductive status, and hormone-sensitive issues that should push the plan more conservative."}
                {stepName === "constraints" &&
                  "Define budget, delivery preference, risk tolerance, and time horizon."}
                {stepName === "style" &&
                  "Choose how complex and how aggressive the resulting program should feel."}
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {stepName === "identity" && (
                <>
                  <OptionSection title="Age range" options={AGE_RANGE_OPTIONS} value={answers.ageRange} onSelect={(value) => setAnswer("ageRange", value)} />
                  <OptionSection
                    title="Sex"
                    subtitle="We use this to apply sex-specific evidence, approval boundaries, reproductive cautions, and monitoring notes where they are actually relevant."
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
                  <OptionSection title="Activity level" options={ACTIVITY_LEVEL_OPTIONS} value={answers.activityLevel} onSelect={(value) => setAnswer("activityLevel", value)} />
                  <OptionSection title="Experience level" options={EXPERIENCE_OPTIONS} value={answers.experience} onSelect={(value) => setAnswer("experience", value)} />
                </>
              )}

              {stepName === "goals" && (
                <>
                  <div>
                    <SectionLabel title="Primary goal" subtitle="This drives the core program direction." />
                    <div className="grid gap-3 md:grid-cols-2">
                      {GOALS.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => setAnswer("primaryGoalId", goal.id)}
                          className={`rounded-lg border p-4 text-left transition-colors ${
                            answers.primaryGoalId === goal.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-medium">{goal.displayName}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel
                      title="Secondary goals"
                      subtitle="Optional. Pick up to two supporting outcomes."
                    />
                    <div className="flex flex-wrap gap-2">
                      {GOALS.filter((goal) => goal.id !== answers.primaryGoalId).map((goal) => {
                        const selected = (answers.secondaryGoalIds ?? []).includes(goal.id);
                        const disabled =
                          !selected && (answers.secondaryGoalIds?.length ?? 0) >= 2;

                        return (
                          <Badge
                            key={goal.id}
                            variant={selected ? "default" : "outline"}
                            className={`cursor-pointer ${disabled ? "opacity-50" : ""}`}
                            onClick={() => {
                              if (disabled) return;
                              toggleArrayValue("secondaryGoalIds", goal.id);
                            }}
                          >
                            {goal.displayName}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <SectionLabel
                      title="Top problems to solve"
                      subtitle="Pick up to three. These shape the program more than a generic goal alone."
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      {PROBLEM_OPTIONS.map((problem) => {
                        const selected = (answers.topProblems ?? []).includes(problem.id);
                        const disabled = !selected && (answers.topProblems?.length ?? 0) >= 3;

                        return (
                          <button
                            key={problem.id}
                            onClick={() => {
                              if (disabled) return;
                              toggleArrayValue("topProblems", problem.id);
                            }}
                            className={`rounded-lg border p-4 text-left transition-colors ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            } ${disabled ? "opacity-50" : ""}`}
                          >
                            <div className="font-medium">{problem.label}</div>
                            <div className="text-sm text-muted-foreground">{problem.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {stepName === "health" && (
                <>
                  <OptionSection
                    title="Reproductive status"
                    subtitle="This is a hard safety gate. It helps the planner reduce compounds that do not belong in pregnancy, breastfeeding, or fertility-sensitive planning."
                    options={REPRODUCTIVE_STATUS_OPTIONS}
                    value={answers.reproductiveStatus}
                    onSelect={(value) => setAnswer("reproductiveStatus", value)}
                  />

                  {answers.sex === "female" && (
                    <OptionSection
                      title="Female life stage"
                      subtitle="This adds context around perimenopause, postmenopause, bone-health priorities, and hormone-related tradeoffs."
                      options={FEMALE_LIFE_STAGE_OPTIONS}
                      value={answers.femaleLifeStage}
                      onSelect={(value) => setAnswer("femaleLifeStage", value)}
                    />
                  )}

                  {answers.sex === "male" && (
                    <OptionSection
                      title="Male hormone and prostate context"
                      subtitle="This helps the planner avoid getting too casual with GH-axis or growth-signaling compounds when TRT or prostate monitoring is already in the picture."
                      options={MALE_HORMONE_CONTEXT_OPTIONS}
                      value={answers.maleHormoneContext}
                      onSelect={(value) => setAnswer("maleHormoneContext", value)}
                    />
                  )}

                  {answers.sex === "other" && (
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                      The planner will stay conservative here and rely more heavily on your reproductive status, health conditions, and medication context instead of forcing binary sex-based assumptions.
                    </div>
                  )}

                  <div>
                    <SectionLabel
                      title="Health conditions"
                      subtitle="Optional. Select any safety context that should narrow the plan."
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      {HEALTH_CONDITION_OPTIONS.map((condition) => {
                        const selected = (answers.healthConditions ?? []).includes(condition.id);
                        return (
                          <button
                            key={condition.id}
                            onClick={() => toggleArrayValue("healthConditions", condition.id)}
                            className={`rounded-lg border p-4 text-left transition-colors ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium">{condition.label}</div>
                            <div className="text-sm text-muted-foreground">{condition.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <SectionLabel
                      title="Medication context"
                      subtitle="Optional. Use this to avoid obvious overlap with medication classes."
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      {MEDICATION_OPTIONS.map((medication) => {
                        const selected = (answers.medications ?? []).includes(medication.id);
                        return (
                          <button
                            key={medication.id}
                            onClick={() => toggleArrayValue("medications", medication.id)}
                            className={`rounded-lg border p-4 text-left transition-colors ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium">{medication.label}</div>
                            <div className="text-sm text-muted-foreground">{medication.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <SectionLabel
                      title="Anything else the plan should know?"
                      subtitle="Optional free text. For example: shift work, old injuries, or route aversion details."
                    />
                    <Textarea
                      value={answers.notes ?? ""}
                      onChange={(event) => setAnswer("notes", event.target.value)}
                      placeholder="Examples: previous tendon injury, poor sleep during travel, trying to stay needle-free..."
                    />
                  </div>
                </>
              )}

              {stepName === "constraints" && (
                <>
                  <OptionSection title="Budget" options={BUDGET_OPTIONS} value={answers.budget} onSelect={(value) => setAnswer("budget", value)} />

                  <div>
                    <SectionLabel
                      title="Risk tolerance"
                      subtitle="1 means very conservative. 5 means open to the highest-risk research compounds."
                    />
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
                  </div>

                  <OptionSection title="Time horizon" options={TIMEFRAME_OPTIONS} value={answers.timeframe} onSelect={(value) => setAnswer("timeframe", value)} />
                  <OptionSection title="Delivery preference" options={DELIVERY_PREFERENCE_OPTIONS} value={answers.deliveryPreference} onSelect={(value) => setAnswer("deliveryPreference", value)} />
                </>
              )}

              {stepName === "style" && (
                <>
                  <OptionSection title="Stack complexity" options={STACKING_OPTIONS} value={answers.stackingPreference} onSelect={(value) => setAnswer("stackingPreference", value)} />
                  <OptionSection title="Routine consistency" options={ROUTINE_OPTIONS} value={answers.routineConsistency} onSelect={(value) => setAnswer("routineConsistency", value)} />
                  <OptionSection title="Monitoring willingness" options={MONITORING_OPTIONS} value={answers.monitoringWillingness} onSelect={(value) => setAnswer("monitoringWillingness", value)} />
                  <OptionSection title="Program style" options={PLAN_STYLE_OPTIONS} value={answers.planStyle} onSelect={(value) => setAnswer("planStyle", value)} />
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep === PLANNER_STEPS.length - 1 ? "Generate My Program" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

function SectionLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function OptionSection<T extends string>({
  title,
  subtitle = "Choose the option that best matches your current situation.",
  options,
  value,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  options: Array<{ value: T; label: string; description: string }>;
  value?: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <SectionLabel title={title} subtitle={subtitle} />
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              value === option.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm text-muted-foreground">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
