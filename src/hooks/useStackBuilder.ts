"use client";

import { create } from "zustand";
import type { PeptideData } from "@/data/peptides";
import type { CompatibilityStatus } from "@/data/compatibility";
import { getStackWarnings } from "@/data/compatibility";

export interface StackItemState {
  peptide: PeptideData;
  quantity: number;
}

export interface StackWarning {
  peptideA: string;
  peptideB: string;
  status: CompatibilityStatus;
  summary: string;
}

interface StackBuilderState {
  name: string;
  items: StackItemState[];
  warnings: StackWarning[];
  setName: (name: string) => void;
  addItem: (peptide: PeptideData) => void;
  removeItem: (peptideId: string) => void;
  updateQuantity: (peptideId: string, quantity: number) => void;
  hasContraindicated: () => boolean;
  clear: () => void;
}

function recalcWarnings(items: StackItemState[]): StackWarning[] {
  const ids = items.map((i) => i.peptide.id);
  return getStackWarnings(ids);
}

export const useStackBuilder = create<StackBuilderState>((set, get) => ({
  name: "My Stack",
  items: [],
  warnings: [],

  setName: (name) => set({ name }),

  addItem: (peptide) =>
    set((state) => {
      if (state.items.some((item) => item.peptide.id === peptide.id)) {
        return state;
      }
      const newItems = [...state.items, { peptide, quantity: 1 }];
      return { items: newItems, warnings: recalcWarnings(newItems) };
    }),

  removeItem: (peptideId) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.peptide.id !== peptideId);
      return { items: newItems, warnings: recalcWarnings(newItems) };
    }),

  updateQuantity: (peptideId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.peptide.id === peptideId ? { ...item, quantity } : item
      ),
    })),

  hasContraindicated: () => {
    return get().warnings.some((w) => w.status === "contraindicated");
  },

  clear: () => set({ name: "My Stack", items: [], warnings: [] }),
}));
