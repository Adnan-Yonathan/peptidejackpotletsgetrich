"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlannerAnswers, PlannerStep } from "@/types/planner";
import { PLANNER_STEPS } from "@/data/planner-options";

interface QuizState {
  currentStep: number;
  answers: Partial<PlannerAnswers>;
  setAnswer: <K extends keyof PlannerAnswers>(key: K, value: PlannerAnswers[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  getCurrentStepName: () => PlannerStep;
  isComplete: () => boolean;
}

const defaultAnswers: Partial<PlannerAnswers> = {
  secondaryGoalIds: [],
  topProblems: [],
  healthConditions: [],
  medications: [],
  femaleLifeStage: "not_applicable",
  maleHormoneContext: "not_applicable",
  notes: "",
};

export const useQuizState = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: defaultAnswers,

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

      reset: () => set({ currentStep: 0, answers: defaultAnswers }),

      getCurrentStepName: () => PLANNER_STEPS[get().currentStep],

      isComplete: () => {
        const { answers } = get();
        return !!(
          answers.ageRange &&
          answers.sex &&
          answers.reproductiveStatus &&
          answers.femaleLifeStage &&
          answers.maleHormoneContext &&
          answers.activityLevel &&
          answers.experience &&
          answers.primaryGoalId &&
          answers.topProblems &&
          answers.topProblems.length > 0 &&
          answers.healthConditions &&
          answers.medications &&
          answers.budget &&
          answers.riskTolerance &&
          answers.timeframe &&
          answers.stackingPreference &&
          answers.deliveryPreference &&
          answers.routineConsistency &&
          answers.monitoringWillingness &&
          answers.planStyle
        );
      },
    }),
    {
      name: "planner-quiz-state",
    }
  )
);
