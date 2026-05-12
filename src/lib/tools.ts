import {
  Beaker,
  Calculator,
  Compass,
  FlaskConical,
  GitCompare,
  Layers,
  Microscope,
  Repeat,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ToolStatus = "live" | "coming-soon";
export type ToolCategory = "calculators" | "compatibility" | "discovery" | "verification";

export interface ToolEntry {
  id: string;
  href: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  icon: LucideIcon;
  /** Used as the dropdown order within a category. Lower first. */
  order: number;
}

export interface ToolCategoryMeta {
  id: ToolCategory;
  label: string;
  eyebrow: string;
}

export const TOOL_CATEGORIES: ToolCategoryMeta[] = [
  { id: "calculators", label: "Calculators", eyebrow: "Calc" },
  { id: "compatibility", label: "Compatibility", eyebrow: "Stack" },
  { id: "discovery", label: "Discovery", eyebrow: "Find" },
  { id: "verification", label: "Verification", eyebrow: "Verify" },
];

export const TOOLS: ToolEntry[] = [
  // Calculators
  {
    id: "reconstitution",
    href: "/tools/reconstitution",
    name: "Reconstitution Calculator",
    shortName: "Reconstitution",
    description: "Calculate units on an insulin syringe from vial size, BAC water, and target dose.",
    category: "calculators",
    status: "live",
    icon: Beaker,
    order: 1,
  },
  {
    id: "cost",
    href: "/tools/cost",
    name: "Cost Calculator",
    shortName: "Cost Calculator",
    description: "Estimate monthly and full-cycle cost across tracked vendor listings.",
    category: "calculators",
    status: "live",
    icon: Calculator,
    order: 2,
  },
  {
    id: "convert",
    href: "/tools/convert",
    name: "Dose Conversion",
    shortName: "Dose Conversion",
    description: "Convert between mcg, mg, IU, and insulin syringe units.",
    category: "calculators",
    status: "live",
    icon: Repeat,
    order: 3,
  },
  {
    id: "dosing-cadence",
    href: "/tools/dosing-cadence",
    name: "Half-Life & Cadence",
    shortName: "Half-Life Cadence",
    description: "Get a dosing cadence recommendation from a compound's half-life.",
    category: "calculators",
    status: "live",
    icon: Sparkles,
    order: 4,
  },

  // Compatibility
  {
    id: "stack-builder",
    href: "/stack-builder",
    name: "Stack Builder",
    shortName: "Stack Builder",
    description: "Build a peptide stack with live compatibility checks and cost estimates.",
    category: "compatibility",
    status: "live",
    icon: Layers,
    order: 1,
  },
  {
    id: "compare-peptides",
    href: "/compare/peptides",
    name: "Compare Peptides",
    shortName: "Compare Peptides",
    description: "Side-by-side comparison of evidence, risk, dosing, and vendor coverage.",
    category: "compatibility",
    status: "live",
    icon: GitCompare,
    order: 2,
  },

  // Discovery
  {
    id: "quiz",
    href: "/quiz",
    name: "Find Your Plan",
    shortName: "Find Your Plan",
    description: "Personalized peptide recommendations based on goal, experience, and risk tolerance.",
    category: "discovery",
    status: "live",
    icon: Compass,
    order: 1,
  },
  {
    id: "wada-checker",
    href: "/tools/wada-checker",
    name: "WADA Status Checker",
    shortName: "WADA Status",
    description: "Look up anti-doping classification per compound. Useful for athletes in tested sports.",
    category: "discovery",
    status: "live",
    icon: ShieldCheck,
    order: 2,
  },

  // Verification
  {
    id: "coa-check",
    href: "/tools/coa-check",
    name: "COA Sanity Check",
    shortName: "COA Check",
    description: "Paste a Certificate of Analysis and flag mismatches against expected purity and sequence.",
    category: "verification",
    status: "live",
    icon: Microscope,
    order: 1,
  },
];

export function getToolById(id: string): ToolEntry | undefined {
  return TOOLS.find((t) => t.id === id);
}

export function getLiveTools(): ToolEntry[] {
  return TOOLS.filter((t) => t.status === "live");
}

export function getToolsByCategory(category: ToolCategory): ToolEntry[] {
  return TOOLS.filter((t) => t.category === category).sort((a, b) => a.order - b.order);
}

export const TOOLS_HUB_ICON: LucideIcon = FlaskConical;
