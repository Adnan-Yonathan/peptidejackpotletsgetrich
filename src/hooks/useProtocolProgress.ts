"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doseKey, isoDate } from "@/lib/protocol-engine";

interface ProtocolProgressState {
  startedAt: string | null;
  completedDoses: Record<string, string>;
  notes: Record<string, string>;
  ensureStarted: (now: Date) => void;
  toggleDose: (doseId: string, date: Date) => void;
  isComplete: (doseId: string, date: Date) => boolean;
  setNote: (date: Date, text: string) => void;
  getNote: (date: Date) => string;
  reset: () => void;
  adherenceLastNDays: (now: Date, windowDays: number, expectedPerDay: number) => number;
  streak: (now: Date) => number;
  completionsOnDate: (date: Date) => number;
  weeklyAdherence: (now: Date, weeks: number, expectedPerDay: number) => Array<{ week: number; adherence: number }>;
}

export const useProtocolProgress = create<ProtocolProgressState>()(
  persist(
    (set, get) => ({
      startedAt: null,
      completedDoses: {},
      notes: {},

      ensureStarted: (now) => {
        if (!get().startedAt) {
          set({ startedAt: now.toISOString() });
        }
      },

      toggleDose: (doseId, date) => {
        const key = doseKey(doseId, date);
        const current = get().completedDoses;
        const next = { ...current };
        if (key in next) {
          delete next[key];
        } else {
          next[key] = new Date().toISOString();
        }
        set({ completedDoses: next });
      },

      isComplete: (doseId, date) => {
        return doseKey(doseId, date) in get().completedDoses;
      },

      setNote: (date, text) => {
        const key = isoDate(date);
        const next = { ...get().notes };
        if (text.trim()) {
          next[key] = text;
        } else {
          delete next[key];
        }
        set({ notes: next });
      },

      getNote: (date) => get().notes[isoDate(date)] ?? "",

      reset: () => set({ startedAt: null, completedDoses: {}, notes: {} }),

      completionsOnDate: (date) => {
        const prefix = `${isoDate(date)}__`;
        return Object.keys(get().completedDoses).filter((k) => k.startsWith(prefix)).length;
      },

      adherenceLastNDays: (now, windowDays, expectedPerDay) => {
        if (expectedPerDay <= 0) return 0;
        let completed = 0;
        for (let i = 0; i < windowDays; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const prefix = `${isoDate(d)}__`;
          completed += Object.keys(get().completedDoses).filter((k) => k.startsWith(prefix)).length;
        }
        const expected = windowDays * expectedPerDay;
        return expected > 0 ? Math.min(100, Math.round((completed / expected) * 100)) : 0;
      },

      streak: (now) => {
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const prefix = `${isoDate(d)}__`;
          const any = Object.keys(get().completedDoses).some((k) => k.startsWith(prefix));
          if (any) {
            streak += 1;
          } else if (i > 0) {
            break;
          } else {
            break;
          }
        }
        return streak;
      },

      weeklyAdherence: (now, weeks, expectedPerDay) => {
        const out: Array<{ week: number; adherence: number }> = [];
        for (let w = 0; w < weeks; w++) {
          let done = 0;
          for (let d = 0; d < 7; d++) {
            const date = new Date(now);
            date.setDate(date.getDate() - (w * 7 + d));
            const prefix = `${isoDate(date)}__`;
            done += Object.keys(get().completedDoses).filter((k) => k.startsWith(prefix)).length;
          }
          const expected = 7 * expectedPerDay;
          out.unshift({
            week: weeks - w,
            adherence: expected > 0 ? Math.min(100, Math.round((done / expected) * 100)) : 0,
          });
        }
        return out;
      },
    }),
    { name: "peptidepros-protocol-progress" }
  )
);
