"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlannerAnswers, PlannerStep } from "@/types/planner";
import { PLANNER_STEPS } from "@/data/planner-options";

interface QuizState {
  currentStep: number;
  answers: Partial<PlannerAnswers>;
  /**
   * Unix-ms timestamp of when the user first reached the completed-quiz state.
   * Persisted so a returning visitor (hours later) can be distinguished from
   * someone who just landed on /quiz/results — used to gate the founding-cohort
   * urgency banner.
   */
  completedAt: number | null;
  setAnswer: <K extends keyof PlannerAnswers>(key: K, value: PlannerAnswers[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  markCompletedNow: () => void;
  getCurrentStepName: () => PlannerStep;
  isComplete: () => boolean;
}

const defaultAnswers: Partial<PlannerAnswers> = {
  name: "",
  email: "",
  country: "us",
  secondaryGoalIds: [],
  topProblems: [],
  healthConditions: [],
  medications: [],
  reproductiveStatus: "none",
  femaleLifeStage: "not_applicable",
  maleHormoneContext: "not_applicable",
  heightInches: 0,
  notes: "",
  deliveryPreference: "flexible",
  stackingPreference: "basic_stack",
  routineConsistency: "medium",
  monitoringWillingness: "basic",
  planStyle: "balanced",
};

function hasValidBodyMetrics(answers: Partial<PlannerAnswers>) {
  return (
    typeof answers.heightFeet === "number" &&
    answers.heightFeet >= 3 &&
    answers.heightFeet <= 8 &&
    typeof answers.heightInches === "number" &&
    answers.heightInches >= 0 &&
    answers.heightInches <= 11 &&
    typeof answers.weightLbs === "number" &&
    answers.weightLbs >= 70 &&
    answers.weightLbs <= 500
  );
}

export const useQuizState = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: defaultAnswers,
      completedAt: null,

      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, PLANNER_STEPS.length - 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step) => set({ currentStep: step }),

      reset: () => set({ currentStep: 0, answers: defaultAnswers, completedAt: null }),

      // Idempotent: only stamps the first time the user reaches a completed quiz.
      markCompletedNow: () => {
        if (get().completedAt === null) set({ completedAt: Date.now() });
      },

      getCurrentStepName: () => PLANNER_STEPS[get().currentStep],

      isComplete: () => {
        const answers = { ...defaultAnswers, ...get().answers };
        return !!(
          answers.country &&
          answers.name &&
          answers.email &&
          answers.ageRange &&
          answers.sex &&
          hasValidBodyMetrics(answers) &&
          answers.reproductiveStatus &&
          answers.femaleLifeStage &&
          answers.maleHormoneContext &&
          answers.activityLevel &&
          answers.bodyCompositionGoal &&
          answers.injuryStatus &&
          answers.topProblems &&
          answers.topProblems.length > 0 &&
          answers.experience &&
          answers.primaryGoalId &&
          answers.healthConditions &&
          answers.medications &&
          answers.budget &&
          answers.deliveryPreference &&
          answers.routineConsistency &&
          answers.monitoringWillingness &&
          answers.riskTolerance &&
          answers.planStyle &&
          answers.timeframe
        );
      },
    }),
    {
      name: "planner-quiz-state",
    }
  )
);
